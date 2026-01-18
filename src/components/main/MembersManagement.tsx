import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce, useInfiniteScroll, useRetry } from '../../hooks';
import { memberService } from '../../services/memberService';
import { Member, OrganizationDto } from '../../types/api';
import { extractNumbers, formatPhoneNumber, validatePhoneNumber } from '../../utils/phoneUtils';
import { sanitizeName, sanitizeNameSuffix, sanitizeSearchTerm } from '../../utils/sanitization';
import { commonValidators, validationRules } from '../../utils/validation';
import { ComboBox } from '../ui/ComboBox';
import { Toast } from '../ui/Toast';

// 타입 정의
interface HierarchicalFilterOptions {
  departments: string[];
  groups: string[];
  teams: string[];
}

interface ParsedOrganizationName {
  department?: string;
  group?: string;
  team?: string;
}

// 상수 정의
const INITIAL_MEMBER_INFO = {
  이름: '',
  name_suffix: 'A',
  생일연도: '',
  휴대폰번호: '',
  gender_type: 'M' as 'M' | 'F',
  소속국: '',
  소속그룹: '',
  소속순: '',
  is_new_member: false,
};

const DEFAULT_FILTER = '전체';
const ITEMS_PER_PAGE = 20;

// 필터 키 생성 헬퍼 함수
const createFilterKey = (search: string, dept: string, group: string, team: string): string => {
  return `${search}_${dept}_${group}_${team}`;
};

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 검색어 유효성 검증 및 sanitization (최소 2자 이상 또는 빈 문자열)
  const validSearchTerm = useMemo(() => {
    const sanitized = sanitizeSearchTerm(debouncedSearchTerm);
    const trimmed = sanitized.trim();
    // 최소 2자 이상이거나 빈 문자열만 허용
    return trimmed.length >= 2 || trimmed.length === 0 ? trimmed : '';
  }, [debouncedSearchTerm]);
  const [filterDepartment, setFilterDepartment] = useState(DEFAULT_FILTER);
  const [filterGroup, setFilterGroup] = useState(DEFAULT_FILTER);
  const [filterTeam, setFilterTeam] = useState(DEFAULT_FILTER);
  const [currentPage, setCurrentPage] = useState(1);

  // 정렬 상태
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Toast 상태
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // 폼 에러 상태
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 필터/검색 변경 추적을 위한 ref
  const filterKeyRef = useRef<string>('');
  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    groups: string[];
    teams: string[];
  }>({ departments: [], groups: [], teams: [] });

  // 필터 옵션을 계층적으로 관리하기 위한 상태
  const [allOrganizations, setAllOrganizations] = useState<OrganizationDto[]>([]);

  // 체크박스 및 모달 상태
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTeam, setNewTeam] = useState('');

  // 새 구성원 정보 상태
  const [newMemberInfo, setNewMemberInfo] = useState(INITIAL_MEMBER_INFO);

  // 재시도 로직 훅
  const { executeWithRetry } = useRetry();

  // 필터 옵션 로딩 실패 상태
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(null);

  // Fetch filter options (재시도 로직 포함)
  const fetchFilterOptions = useCallback(async () => {
    try {
      setFilterOptionsError(null);

      const options = await executeWithRetry('filterOptions', () => memberService.getFilterOptions(), {
        maxRetries: 3,
        retryDelay: 1000,
        onRetry: (attempt: number) => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(`필터 옵션 로딩 재시도 중... (${attempt}/3)`);
          }
        },
      });
      setFilterOptions(options);

      // 조직 목록도 가져와서 계층적 필터링에 사용
      const orgs = await executeWithRetry('organizations', () => memberService.fetchOrganizations(), {
        maxRetries: 3,
        retryDelay: 1000,
      });
      setAllOrganizations(orgs);
    } catch (error: any) {
      console.error('Failed to fetch filter options:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '필터 옵션을 불러오는데 실패했습니다.';
      setFilterOptionsError(errorMessage);
      setToast({
        message: `${errorMessage} 페이지를 새로고침해주세요.`,
        type: 'error',
      });
    }
  }, [executeWithRetry]);

  // 조직명 파싱 헬퍼 함수
  const parseOrganizationName = useCallback((orgName: string): ParsedOrganizationName => {
    const parts = orgName.split('_');
    return {
      department: parts.length >= 1 && parts[0] ? parts[0] : undefined,
      group: parts.length >= 2 && parts[1] ? parts[1] : undefined,
      team: parts.length >= 3 && parts[2] ? parts[2] : undefined,
    };
  }, []);

  // 계층적 필터 옵션 계산 헬퍼 함수
  const getHierarchicalOptions = useCallback(
    (dept: string, group: string): HierarchicalFilterOptions => {
      let filteredGroups = filterOptions.groups || [];
      let filteredTeams = filterOptions.teams || [];

      // 소속국이 선택된 경우, 해당 소속국에 속한 그룹만 필터링
      if (dept && dept !== DEFAULT_FILTER && allOrganizations.length > 0) {
        const deptOrgs = allOrganizations.filter(org => org.name.startsWith(`${dept}_`));
        const deptGroups = new Set<string>();
        deptOrgs.forEach(org => {
          const parsed = parseOrganizationName(org.name);
          if (parsed.group) {
            deptGroups.add(parsed.group);
          }
        });
        filteredGroups = Array.from(deptGroups).sort();

        // 소속그룹도 선택된 경우, 해당 그룹에 속한 순만 필터링
        if (group && group !== DEFAULT_FILTER) {
          const groupOrgs = deptOrgs.filter(org => org.name.includes(`_${group}_`));
          const groupTeams = new Set<string>();
          groupOrgs.forEach(org => {
            const parsed = parseOrganizationName(org.name);
            if (parsed.team) {
              groupTeams.add(parsed.team);
            }
          });
          filteredTeams = Array.from(groupTeams).sort();
        }
      }

      return {
        departments: filterOptions.departments || [],
        groups: filteredGroups,
        teams: filteredTeams,
      };
    },
    [filterOptions, allOrganizations, parseOrganizationName]
  );

  // 메인 필터용 계층적 옵션 (useMemo로 최적화)
  const filteredOptions = useMemo(
    () => getHierarchicalOptions(filterDepartment, filterGroup),
    [filterDepartment, filterGroup, getHierarchicalOptions]
  );

  // 새 구성원 추가 모달용 계층적 옵션 (useMemo로 최적화)
  const modalFilteredOptions = useMemo(
    () => getHierarchicalOptions(newMemberInfo.소속국, newMemberInfo.소속그룹),
    [newMemberInfo.소속국, newMemberInfo.소속그룹, getHierarchicalOptions]
  );

  // 소속 변경 모달용 계층적 옵션 (useMemo로 최적화)
  const changeAffiliationFilteredOptions = useMemo(
    () => getHierarchicalOptions(newDepartment, newGroup),
    [newDepartment, newGroup, getHierarchicalOptions]
  );

  // 정렬된 멤버 목록
  const sortedMembers = useMemo(() => {
    if (!sortField) return members;

    return [...members].sort((a, b) => {
      const aValue = (a as any)[sortField] || '';
      const bValue = (b as any)[sortField] || '';

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, sortField, sortOrder]);

  // 정렬 핸들러
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
    },
    [sortField]
  );

  // 필터 초기화
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterDepartment(DEFAULT_FILTER);
    setFilterGroup(DEFAULT_FILTER);
    setFilterTeam(DEFAULT_FILTER);
    setCurrentPage(1);
    setSortField('');
    setSortOrder('asc');
  }, []);

  // Fetch members (무한 스크롤 지원)
  const fetchMembers = useCallback(
    async (append = false) => {
      // 필터/검색이 변경된 경우 append 모드 비활성화
      const currentFilterKey = createFilterKey(validSearchTerm, filterDepartment, filterGroup, filterTeam);
      const isFilterChanged = filterKeyRef.current !== currentFilterKey;

      if (isFilterChanged) {
        filterKeyRef.current = currentFilterKey;
        append = false; // 필터 변경 시 항상 새로 시작
      }

      // 로딩 상태 설정
      if (append) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
        setMembers([]); // 필터 변경 시 기존 데이터 초기화
      }

      try {
        const response = await executeWithRetry(
          'members',
          () =>
            memberService.getMembers({
              search: validSearchTerm || undefined,
              department: filterDepartment === DEFAULT_FILTER ? undefined : filterDepartment,
              group: filterGroup === DEFAULT_FILTER ? undefined : filterGroup,
              team: filterTeam === DEFAULT_FILTER ? undefined : filterTeam,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
            }),
          {
            maxRetries: append ? 1 : 3, // append 모드에서는 재시도 최소화
            retryDelay: 1000,
            onRetry: (attempt: number) => {
              if (!append && process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log(`구성원 목록 로딩 재시도 중... (${attempt}/3)`);
              }
            },
          }
        );

        // 데이터 누적 또는 교체
        if (append) {
          setMembers(prev => [...prev, ...response.members]);
        } else {
          setMembers(response.members);
        }

        // 더 불러올 데이터가 있는지 확인
        setHasMore(currentPage < response.pagination.totalPages);
      } catch (error: any) {
        console.error('Failed to fetch members:', error);
        if (!append) {
          const errorMessage =
            error?.response?.data?.message || error?.message || '구성원 목록을 불러오는데 실패했습니다.';
          setToast({ message: `${errorMessage} 잠시 후 다시 시도해주세요.`, type: 'error' });
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [validSearchTerm, filterDepartment, filterGroup, filterTeam, currentPage, executeWithRetry]
  );

  // 더 불러오기 함수
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || loading) return;
    setCurrentPage(prev => prev + 1);
  }, [hasMore, isLoadingMore, loading]);

  // 무한 스크롤 Observer 설정
  const observerRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore || loading,
    onLoadMore: loadMore,
  });

  // Initial Load: Filter Options & First Data Load
  useEffect(() => {
    fetchFilterOptions();
    // 초기 데이터 로드 (currentPage가 1이고 필터 키가 비어있을 때)
    if (currentPage === 1 && filterKeyRef.current === '') {
      filterKeyRef.current = createFilterKey(validSearchTerm, filterDepartment, filterGroup, filterTeam);
      fetchMembers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터/검색 변경 시 초기화 (validSearchTerm 사용)
  useEffect(() => {
    const currentFilterKey = createFilterKey(validSearchTerm, filterDepartment, filterGroup, filterTeam);
    const isFilterChanged = filterKeyRef.current !== currentFilterKey;

    if (isFilterChanged) {
      setCurrentPage(1);
      setHasMore(true);
      setMembers([]); // 데이터 초기화
      filterKeyRef.current = currentFilterKey; // 필터 키 업데이트
      // 스크롤 위치를 맨 위로 이동
      const mainContent = document.querySelector('.dugigo-main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [validSearchTerm, filterDepartment, filterGroup, filterTeam]);

  // 페이지 변경 시 데이터 로드 (무한 스크롤)
  useEffect(() => {
    const isFirstPage = currentPage === 1;
    const isFilterChanged =
      filterKeyRef.current !== createFilterKey(validSearchTerm, filterDepartment, filterGroup, filterTeam);

    // 필터가 변경되었거나 첫 페이지인 경우 새로 로드
    if (isFirstPage || isFilterChanged) {
      fetchMembers(false);
    } else {
      // 이후 페이지는 누적 로드
      fetchMembers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, fetchMembers, validSearchTerm, filterDepartment, filterGroup, filterTeam]);

  // 사이드바 메뉴 클릭 시 화면 초기화
  useEffect(() => {
    const handleResetPage = () => {
      setSearchTerm('');
      setFilterDepartment(DEFAULT_FILTER);
      setFilterGroup(DEFAULT_FILTER);
      setFilterTeam(DEFAULT_FILTER);
      setCurrentPage(1);
      setHasMore(true);
      setMembers([]);
      setSelectedMembers([]);
      setShowModal(false);
      setShowAddMemberModal(false);
      setNewDepartment('');
      setNewGroup('');
      setNewTeam('');
      setNewMemberInfo(INITIAL_MEMBER_INFO);
      filterKeyRef.current = '';
      fetchFilterOptions(); // 옵션도 초기화 시 재조회
      // fetchMembers는 필터 변경 useEffect에서 자동 호출됨
    };

    window.addEventListener('resetMembersPage', handleResetPage);

    return () => {
      window.removeEventListener('resetMembersPage', handleResetPage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 페이지 변경 시 선택 해제
  useEffect(() => {
    setSelectedMembers([]);
  }, [currentPage]);

  const handleMemberClick = (member: Member) => {
    navigate(`/main/member-management/${member.id}`);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    setNewMemberInfo(INITIAL_MEMBER_INFO);
    setFormErrors({});
  };

  const handleAddMemberSubmit = async () => {
    // 유효성 검사
    const errors: Record<string, string> = {};

    // 이름 검증
    const nameError = commonValidators.requiredNameWithEnglish(newMemberInfo.이름);
    if (nameError) {
      errors.이름 = nameError;
    }

    // 동명이인 구분자 검증
    const nameSuffixError = commonValidators.requiredNameSuffix(newMemberInfo.name_suffix);
    if (nameSuffixError) {
      errors.name_suffix = nameSuffixError;
    }

    // 전화번호 검증
    const phoneValidation = validatePhoneNumber(newMemberInfo.휴대폰번호);
    if (!phoneValidation.isValid) {
      errors.휴대폰번호 = phoneValidation.error || '휴대폰 번호를 입력해주세요.';
    }

    // 생년월일 검증 (입력된 경우에만)
    if (newMemberInfo.생일연도) {
      const birthDateError = validationRules.birthDate(newMemberInfo.생일연도);
      if (birthDateError) {
        errors.생일연도 = birthDateError;
      }
    }

    // 소속 정보 검증
    if (!newMemberInfo.소속국 || !newMemberInfo.소속그룹 || !newMemberInfo.소속순) {
      errors.소속 = '소속 정보를 모두 선택해주세요.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({ message: '입력 정보를 확인해주세요.', type: 'error' });
      return;
    }

    setFormErrors({});

    try {
      // 전화번호에서 숫자만 추출하여 전송
      const phoneNumber = extractNumbers(newMemberInfo.휴대폰번호);

      const response = await memberService.createMember({
        이름: newMemberInfo.이름,
        name_suffix: newMemberInfo.name_suffix,
        생일연도: newMemberInfo.생일연도 || undefined,
        휴대폰번호: phoneNumber,
        gender_type: newMemberInfo.gender_type,
        소속국: newMemberInfo.소속국,
        소속그룹: newMemberInfo.소속그룹,
        소속순: newMemberInfo.소속순,
        is_new_member: newMemberInfo.is_new_member,
      });

      if (response.success) {
        setToast({ message: '새 구성원이 추가되었습니다.', type: 'success' });
        handleCloseAddMemberModal();
        fetchMembers(); // Refresh list
      }
    } catch (error: any) {
      console.error('Failed to create member:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '구성원 추가에 실패했습니다.';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  // 체크박스 핸들러
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMembers(members.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers(prev => (prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]));
  };

  const isAllSelected = selectedMembers.length === members.length && members.length > 0;

  // 소속 변경 모달 핸들러
  const handleOpenModal = () => {
    if (selectedMembers.length === 0) {
      setToast({ message: '변경할 구성원을 선택해주세요.', type: 'warning' });
      return;
    }

    // 소속 변경은 1명에 대해서만 가능
    if (selectedMembers.length > 1) {
      alert('소속 변경은 한 번에 1명씩만 가능합니다.\n1명만 선택해주세요.');
      return;
    }
    // 선택된 구성원의 기존 소속 정보 가져오기
    const selectedMember = members.find(m => selectedMembers.includes(m.id));
    if (selectedMember) {
      setNewDepartment(selectedMember.소속국 || '');
      setNewGroup(selectedMember.소속그룹 || '');
      setNewTeam(selectedMember.소속순 || '');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewDepartment('');
    setNewGroup('');
    setNewTeam('');
  };

  // 공통: 소속국 변경 핸들러 (하위 필터 초기화)
  const handleDepartmentChange = useCallback(
    (newDept: string, onUpdate: (updates: { department: string; group: string; team: string }) => void) => {
      onUpdate({
        department: newDept,
        group: '', // 소속국 변경 시 그룹 초기화
        team: '', // 소속국 변경 시 순 초기화
      });
    },
    []
  );

  // 공통: 소속그룹 변경 핸들러 (하위 필터 초기화)
  const handleGroupChange = useCallback(
    (newGroup: string, onUpdate: (updates: { group: string; team: string }) => void) => {
      onUpdate({
        group: newGroup,
        team: '', // 소속그룹 변경 시 순 초기화
      });
    },
    []
  );

  const handleConfirmChange = async () => {
    if (!newDepartment || !newGroup || !newTeam) {
      setToast({ message: '모든 소속 정보를 선택해주세요.', type: 'warning' });
      return;
    }

    try {
      const response = await memberService.updateMembersAffiliation({
        memberIds: selectedMembers,
        affiliation: {
          department: newDepartment,
          group: newGroup,
          team: newTeam,
        },
      });

      if (response.success) {
        // 소속 변경 이벤트 발생
        window.dispatchEvent(
          new CustomEvent('memberAffiliationChanged', {
            detail: {
              memberIds: selectedMembers,
              newDepartment,
              newGroup,
              newTeam,
            },
          })
        );

        setToast({ message: response.message || '소속이 변경되었습니다.', type: 'success' });
        handleCloseModal();
        setSelectedMembers([]);

        // 소속 변경 후 필터를 새로운 소속으로 설정
        // 검색어는 유지하거나 초기화할 수 있음 (현재는 유지)
        setFilterDepartment(newDepartment);
        setFilterGroup(newGroup);
        setFilterTeam(newTeam);
        setCurrentPage(1);
        setHasMore(true);

        // 필터 키를 새로운 소속 필터 상태로 설정
        // 이렇게 하면 useEffect가 필터 변경을 감지하여 자동으로 fetchMembers를 호출함
        const newFilterKey = createFilterKey(validSearchTerm, newDepartment, newGroup, newTeam);
        filterKeyRef.current = newFilterKey;

        // 필터 옵션도 다시 로드 (변경된 소속이 반영되도록)
        fetchFilterOptions();

        // 필터 변경은 useEffect에서 자동으로 처리되므로
        // 명시적인 fetchMembers 호출은 불필요함
        // useEffect가 필터 변경을 감지하여 자동으로 목록을 새로고침함
      }
    } catch (error: any) {
      console.error('Failed to update affiliation:', error);
      const errorMessage = error?.response?.data?.message || error?.message || '소속 변경에 실패했습니다.';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  return (
    <div className='members-container'>
      <div className='members-sticky-header'>
        <div className='members-header'>
          <h1>구성원 관리</h1>
          <p>청년회 구성원 정보를 관리하세요</p>
        </div>

        <div className='members-controls'>
          <div className='members-search-bar'>
            <div className='search-box'>
              <input
                type='text'
                placeholder='이름으로 검색... (최소 2자 이상)'
                value={searchTerm}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={e => {
                  setIsComposing(false);
                  // 조합 완료 후 sanitization 적용
                  const sanitized = sanitizeSearchTerm(e.currentTarget.value);
                  setSearchTerm(sanitized);
                  setCurrentPage(1);
                }}
                onChange={e => {
                  // 조합 중이 아닐 때만 sanitization 적용
                  if (!isComposing) {
                    const sanitized = sanitizeSearchTerm(e.target.value);
                    setSearchTerm(sanitized);
                    setCurrentPage(1);
                  } else {
                    // 조합 중일 때는 그대로 설정 (sanitization 없이)
                    setSearchTerm(e.target.value);
                  }
                }}
                maxLength={50}
              />
              <span className='search-icon'>🔍</span>
            </div>
            {filterOptionsError && (
              <div className='filter-error-notice'>
                <span style={{ color: 'var(--error)', fontSize: '0.85rem' }}>⚠️ {filterOptionsError}</span>
              </div>
            )}
            <select
              className='members-filter-select'
              value={filterDepartment}
              onChange={e => {
                setFilterDepartment(e.target.value);
                // 소속국 변경 시 하위 필터 초기화
                setFilterGroup(DEFAULT_FILTER);
                setFilterTeam(DEFAULT_FILTER);
                setCurrentPage(1);
              }}
            >
              <option value={DEFAULT_FILTER}>소속국 선택</option>
              {(filteredOptions.departments || []).map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              className='members-filter-select'
              value={filterGroup}
              onChange={e => {
                setFilterGroup(e.target.value);
                // 소속그룹 변경 시 소속순 초기화
                setFilterTeam(DEFAULT_FILTER);
                setCurrentPage(1);
              }}
              disabled={filterDepartment === DEFAULT_FILTER}
            >
              <option value={DEFAULT_FILTER}>소속그룹 선택</option>
              {(filteredOptions.groups || []).map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <select
              className='members-filter-select'
              value={filterTeam}
              onChange={e => {
                setFilterTeam(e.target.value);
                setCurrentPage(1);
              }}
              disabled={filterGroup === DEFAULT_FILTER}
            >
              <option value={DEFAULT_FILTER}>소속순 선택</option>
              {(filteredOptions.teams || []).map(team => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className='members-action-buttons'>
            <button className='add-button' onClick={handleAddMember} disabled>
              + 새 구성원 추가
            </button>
            <button
              className='change-affiliation-button'
              onClick={handleOpenModal}
              disabled={selectedMembers.length === 0}
            >
              소속 변경
            </button>
          </div>
        </div>
      </div>

      <div className='table-container'>
        {loading ? (
          <div className='members-loading-state'>로딩 중...</div>
        ) : (
          <table className='members-table'>
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>
                  <input
                    type='checkbox'
                    className='members-checkbox'
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='sortable-header' onClick={() => handleSort('이름')}>
                  이름
                  {sortField === '이름' && <span className='sort-icon active'>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  {sortField !== '이름' && <span className='sort-icon'>↕</span>}
                </th>
                <th className='sortable-header' onClick={() => handleSort('생일연도')}>
                  기수
                  {sortField === '생일연도' && (
                    <span className='sort-icon active'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                  {sortField !== '생일연도' && <span className='sort-icon'>↕</span>}
                </th>
                <th className='sortable-header' onClick={() => handleSort('소속국')}>
                  소속 국
                  {sortField === '소속국' && (
                    <span className='sort-icon active'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                  {sortField !== '소속국' && <span className='sort-icon'>↕</span>}
                </th>
                <th>소속 그룹</th>
                <th>소속 순</th>
                <th>휴대폰번호</th>
              </tr>
            </thead>
            <tbody>
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div className='members-empty-state'>검색 결과가 없습니다.</div>
                  </td>
                </tr>
              ) : (
                sortedMembers.map(member => (
                  <tr key={member.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type='checkbox'
                        className='members-checkbox'
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                      />
                    </td>
                    <td className='clickable-name' onClick={() => handleMemberClick(member)}>
                      {member.이름}
                    </td>
                    <td>{member.생일연도 ? member.생일연도.slice(-2) : ''}</td>
                    <td>{member.소속국}</td>
                    <td>{member.소속그룹}</td>
                    <td>{member.소속순}</td>
                    <td>{member.휴대폰번호 ? member.휴대폰번호.slice(-4) : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 무한 스크롤: 하단 로딩 인디케이터 및 감지 요소 */}
        {!loading && members.length > 0 && (
          <>
            {isLoadingMore && (
              <div className='infinite-scroll-loading'>
                <div className='infinite-scroll-loading-content'>
                  <div className='infinite-scroll-spinner' />
                  <span className='infinite-scroll-loading-text'>더 많은 구성원을 불러오는 중...</span>
                </div>
              </div>
            )}

            {!hasMore && members.length > 0 && (
              <div className='infinite-scroll-end'>
                <span className='infinite-scroll-end-text'>모든 구성원을 불러왔습니다 ({members.length}명)</span>
              </div>
            )}

            {/* Intersection Observer 감지용 요소 */}
            {hasMore && <div ref={observerRef} className='infinite-scroll-trigger' />}
          </>
        )}
      </div>

      {/* 소속 변경 모달 */}
      {showModal && (
        <div className='members-modal-overlay' onClick={handleCloseModal}>
          <div className='members-modal-content' onClick={e => e.stopPropagation()}>
            <div className='members-modal-header'>
              <h3>소속 변경</h3>
              <button className='members-modal-close' onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className='members-modal-form'>
              {/* 기존 소속 표시 */}
              {selectedMembers.length > 0 &&
                (() => {
                  const selectedMember = members.find(m => selectedMembers.includes(m.id));
                  if (selectedMember) {
                    return (
                      <div className='current-affiliation'>
                        <div className='current-affiliation-label'>현재 소속</div>
                        <div className='current-affiliation-value'>
                          {selectedMember.소속국} / {selectedMember.소속그룹} / {selectedMember.소속순}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              <div className='members-form-group'>
                <label>소속 국</label>
                <ComboBox
                  options={changeAffiliationFilteredOptions.departments || []}
                  value={newDepartment}
                  onChange={value =>
                    handleDepartmentChange(value, ({ department, group, team }) => {
                      setNewDepartment(department);
                      setNewGroup(group);
                      setNewTeam(team);
                    })
                  }
                  placeholder='소속국을 선택하세요'
                  className='members-modal-select'
                />
              </div>
              <div className='members-form-group'>
                <label>소속 그룹</label>
                <ComboBox
                  options={changeAffiliationFilteredOptions.groups || []}
                  value={newGroup}
                  onChange={value =>
                    handleGroupChange(value, ({ group, team }) => {
                      setNewGroup(group);
                      setNewTeam(team);
                    })
                  }
                  placeholder='소속그룹을 선택하세요'
                  disabled={!newDepartment}
                  className='members-modal-select'
                />
              </div>
              <div className='members-form-group'>
                <label>소속 순</label>
                <ComboBox
                  options={changeAffiliationFilteredOptions.teams || []}
                  value={newTeam}
                  onChange={value => setNewTeam(value)}
                  placeholder='소속순을 선택하세요'
                  disabled={!newGroup}
                  className='members-modal-select'
                />
              </div>
            </div>
            <div className='members-modal-buttons'>
              <button className='members-modal-button secondary' onClick={handleCloseModal}>
                취소
              </button>
              <button className='members-modal-button primary' onClick={handleConfirmChange}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 새 구성원 추가 모달 */}
      {showAddMemberModal && (
        <div className='members-modal-overlay' onClick={handleCloseAddMemberModal}>
          <div className='members-modal-content' onClick={e => e.stopPropagation()}>
            <div className='members-modal-header'>
              <h3>새 구성원 추가</h3>
              <button className='members-modal-close' onClick={handleCloseAddMemberModal}>
                ×
              </button>
            </div>
            <div className='members-modal-form'>
              {/* 2단 레이아웃 */}
              <div className='members-modal-form-columns'>
                {/* 왼쪽 열: 기본 정보 */}
                <div className='members-modal-form-column'>
                  <div className='members-form-group'>
                    <label>
                      이름 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type='text'
                      className={`members-modal-input ${formErrors.이름 ? 'form-field-error' : ''}`}
                      value={newMemberInfo.이름}
                      onChange={e => {
                        // 입력값 sanitization
                        const sanitized = sanitizeName(e.target.value);
                        setNewMemberInfo({ ...newMemberInfo, 이름: sanitized });
                        if (formErrors.이름) {
                          const newErrors = { ...formErrors };
                          delete newErrors.이름;
                          setFormErrors(newErrors);
                        }
                      }}
                      onBlur={() => {
                        const error = commonValidators.requiredNameWithEnglish(newMemberInfo.이름);
                        if (error) {
                          setFormErrors(prev => ({ ...prev, 이름: error }));
                        }
                      }}
                      placeholder='이름을 입력하세요 (한글 또는 영문)'
                      maxLength={20}
                    />
                    {formErrors.이름 && <span className='form-error-message'>{formErrors.이름}</span>}
                  </div>
                  <div className='members-form-group'>
                    <label>
                      동명이인 구분자 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type='text'
                      className={`members-modal-input ${formErrors.name_suffix ? 'form-field-error' : ''}`}
                      value={newMemberInfo.name_suffix}
                      onChange={e => {
                        // 입력값 sanitization (영문/숫자만 허용)
                        const sanitized = sanitizeNameSuffix(e.target.value);
                        setNewMemberInfo({ ...newMemberInfo, name_suffix: sanitized });
                        if (formErrors.name_suffix) {
                          const newErrors = { ...formErrors };
                          delete newErrors.name_suffix;
                          setFormErrors(newErrors);
                        }
                      }}
                      onBlur={() => {
                        const error = commonValidators.requiredNameSuffix(newMemberInfo.name_suffix);
                        if (error) {
                          setFormErrors(prev => ({ ...prev, name_suffix: error }));
                        }
                      }}
                      placeholder='예: A, B, C (영문 또는 숫자)'
                      maxLength={10}
                    />
                    {formErrors.name_suffix && <span className='form-error-message'>{formErrors.name_suffix}</span>}
                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      동일한 이름이 있을 경우 구분하기 위한 문자 (예: 홍길동A의 "A")
                    </small>
                  </div>
                  <div className='members-form-group'>
                    <label>생년월일</label>
                    <input
                      type='date'
                      className={`members-modal-input ${formErrors.생일연도 ? 'form-field-error' : ''}`}
                      value={newMemberInfo.생일연도}
                      onChange={e => {
                        setNewMemberInfo({ ...newMemberInfo, 생일연도: e.target.value });
                        if (formErrors.생일연도) {
                          const newErrors = { ...formErrors };
                          delete newErrors.생일연도;
                          setFormErrors(newErrors);
                        }
                      }}
                      onBlur={() => {
                        if (newMemberInfo.생일연도) {
                          const error = validationRules.birthDate(newMemberInfo.생일연도);
                          if (error) {
                            setFormErrors(prev => ({ ...prev, 생일연도: error }));
                          }
                        }
                      }}
                      max={new Date().toISOString().split('T')[0]}
                      min='1900-01-01'
                    />
                    {formErrors.생일연도 && <span className='form-error-message'>{formErrors.생일연도}</span>}
                  </div>
                  <div className='members-form-group'>
                    <label>성별</label>
                    <select
                      className='members-modal-select'
                      value={newMemberInfo.gender_type}
                      onChange={e =>
                        setNewMemberInfo({
                          ...newMemberInfo,
                          gender_type: e.target.value as 'M' | 'F',
                        })
                      }
                    >
                      <option value='M'>남성</option>
                      <option value='F'>여성</option>
                    </select>
                  </div>
                  <div className='members-form-group'>
                    <label>
                      휴대폰 번호 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type='text'
                      className={`members-modal-input ${formErrors.휴대폰번호 ? 'form-field-error' : ''}`}
                      value={newMemberInfo.휴대폰번호}
                      onChange={e => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setNewMemberInfo({ ...newMemberInfo, 휴대폰번호: formatted });
                        // 실시간 검증
                        if (formErrors.휴대폰번호) {
                          const validation = validatePhoneNumber(formatted);
                          if (validation.isValid) {
                            const newErrors = { ...formErrors };
                            delete newErrors.휴대폰번호;
                            setFormErrors(newErrors);
                          }
                        }
                      }}
                      onBlur={() => {
                        const validation = validatePhoneNumber(newMemberInfo.휴대폰번호);
                        if (!validation.isValid) {
                          setFormErrors(prev => ({ ...prev, 휴대폰번호: validation.error || '' }));
                        }
                      }}
                      placeholder='예: 010-1234-5678 또는 01012345678'
                      maxLength={13}
                    />
                    {formErrors.휴대폰번호 && <span className='form-error-message'>{formErrors.휴대폰번호}</span>}
                  </div>
                  <div className='members-form-group'>
                    <label className='members-checkbox-label'>
                      <input
                        type='checkbox'
                        className='members-checkbox-input'
                        checked={newMemberInfo.is_new_member}
                        onChange={e => setNewMemberInfo({ ...newMemberInfo, is_new_member: e.target.checked })}
                      />
                      <span>새가족 여부</span>
                    </label>
                    <small className='members-checkbox-helper-text'>체크 시 새가족으로 등록됩니다</small>
                  </div>
                </div>

                {/* 오른쪽 열: 소속 정보 */}
                <div className='members-modal-form-column'>
                  {formErrors.소속 && (
                    <div className='form-error-message' style={{ marginBottom: '12px' }}>
                      {formErrors.소속}
                    </div>
                  )}
                  <div className='members-form-group'>
                    <label>
                      소속 국 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <ComboBox
                      options={modalFilteredOptions.departments || []}
                      value={newMemberInfo.소속국}
                      onChange={value =>
                        handleDepartmentChange(value, ({ department, group, team }) => {
                          setNewMemberInfo({
                            ...newMemberInfo,
                            소속국: department,
                            소속그룹: group,
                            소속순: team,
                          });
                          if (formErrors.소속) {
                            const newErrors = { ...formErrors };
                            delete newErrors.소속;
                            setFormErrors(newErrors);
                          }
                        })
                      }
                      placeholder='소속국을 선택하세요'
                      className='members-modal-select'
                    />
                  </div>
                  <div className='members-form-group'>
                    <label>
                      소속 그룹 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <ComboBox
                      options={modalFilteredOptions.groups || []}
                      value={newMemberInfo.소속그룹}
                      onChange={value =>
                        handleGroupChange(value, ({ group, team }) => {
                          setNewMemberInfo({
                            ...newMemberInfo,
                            소속그룹: group,
                            소속순: team,
                          });
                        })
                      }
                      placeholder='소속그룹을 선택하세요'
                      disabled={!newMemberInfo.소속국}
                      className='members-modal-select'
                    />
                  </div>
                  <div className='members-form-group'>
                    <label>
                      소속 순 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <ComboBox
                      options={modalFilteredOptions.teams || []}
                      value={newMemberInfo.소속순}
                      onChange={value => setNewMemberInfo({ ...newMemberInfo, 소속순: value })}
                      placeholder='소속순을 선택하세요'
                      disabled={!newMemberInfo.소속그룹}
                      className='members-modal-select'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='members-modal-buttons'>
              <button className='members-modal-button secondary' onClick={handleCloseAddMemberModal}>
                취소
              </button>
              <button className='members-modal-button primary' onClick={handleAddMemberSubmit}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 알림 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MembersManagement;
