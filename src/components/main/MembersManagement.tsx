import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useDebounce, useInfiniteScroll, useRetry } from '../../hooks';
import { findOrganizationId, memberService } from '../../services/memberService';
import { AccessibleOrganizationDto, Member, OrganizationDto } from '../../types/api';
import { getApiErrorMessage } from '../../utils/apiError';
import { getAccessibleOrganizations } from '../../utils/authService';
import { ASSIGNABLE_ROLE_NAMES, AssignableRoleName, isAssignableRoleName } from '../../utils/constants';
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
const ORGANIZATION_NOT_FOUND_MESSAGE = '선택한 소속을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.';

// 필터 키 생성 헬퍼 함수
const createFilterKey = (search: string, dept: string, group: string, team: string): string => {
  return `${search}_${dept}_${group}_${team}`;
};

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // 현재 검색/필터 조합
  const filterKey = createFilterKey(validSearchTerm, filterDepartment, filterGroup, filterTeam);

  // 페이지 번호는 해당 필터 키와 함께 저장한다.
  // 필터가 바뀐 렌더에서 곧바로 1페이지로 계산되므로 이전 필터의 페이지 번호로 요청이 나가지 않는다.
  const [pageState, setPageState] = useState({ filterKey, page: 1 });
  const currentPage = pageState.filterKey === filterKey ? pageState.page : 1;

  // 같은 조건으로 목록을 다시 요청할 때 증가 (소속 변경 후 재조회, 추가 로드 재시도)
  const [requestVersion, setRequestVersion] = useState(0);

  // 접근 가능한 조직 (gook 1개/group 1개일 때 필터 고정용)
  const [accessibleOrganizations, setAccessibleOrganizations] = useState<AccessibleOrganizationDto | null>(null);
  const [isLoadingAccessibleOrgs, setIsLoadingAccessibleOrgs] = useState(true);

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
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  // 가장 마지막 목록 요청 번호 (늦게 도착한 이전 요청의 응답은 버림)
  const latestRequestIdRef = useRef(0);

  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    groups: string[];
    teams: string[];
  }>({ departments: [], groups: [], teams: [] });

  // 필터 옵션을 계층적으로 관리하기 위한 상태
  const [allOrganizations, setAllOrganizations] = useState<OrganizationDto[]>([]);

  // 선택 및 모달 상태 (소속 변경은 1명씩만 가능)
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [newRole, setNewRole] = useState<AssignableRoleName | ''>('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);

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
      });
      setFilterOptions(options);

      // 조직 목록도 가져와서 계층적 필터링 및 조직 ID 조회에 사용
      const orgs = await executeWithRetry('organizations', () => memberService.fetchOrganizations(), {
        maxRetries: 3,
        retryDelay: 1000,
      });
      setAllOrganizations(orgs);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, '필터 옵션을 불러오는데 실패했습니다.');
      // 보안: 에러 객체 전체를 출력하지 않고 메시지만 기록
      console.error('Failed to fetch filter options:', errorMessage);
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

  // 목록을 1페이지부터 다시 불러오기 (현재 필터 유지)
  const reloadMembers = useCallback(() => {
    setPageState({ filterKey, page: 1 });
    setRequestVersion(version => version + 1);
  }, [filterKey]);

  // 더 불러오기 함수
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || loading || loadMoreFailed) return;
    setPageState({ filterKey, page: currentPage + 1 });
  }, [hasMore, isLoadingMore, loading, loadMoreFailed, filterKey, currentPage]);

  // 추가 로드 실패 시 같은 페이지 재요청
  const retryLoadMore = () => {
    setRequestVersion(version => version + 1);
  };

  // 무한 스크롤 Observer 설정
  const observerRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore || loading,
    onLoadMore: loadMore,
  });

  // Initial Load: 접근 가능 조직 조회 → 필터 초기값 설정(1개일 때 고정) → 필터 옵션 로드
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAccessibleOrganizations();
        if (cancelled) return;
        setAccessibleOrganizations(data);

        if (data.gook?.length === 1) {
          setFilterDepartment(`${data.gook[0]}국`);
        }
        // group은 2중 배열 (예: [["강병관"]]) → 내부 요소가 1개일 때만 필터 고정
        const flatGroup = data.group?.flat() ?? [];
        if (flatGroup.length === 1) {
          setFilterGroup(`${flatGroup[0]}그룹`);
        }
        await fetchFilterOptions();
      } catch (error) {
        if (!cancelled) {
          const errorMessage = getApiErrorMessage(error, '접근 가능한 조직을 불러오는데 실패했습니다.');
          // 보안: 에러 객체 전체를 출력하지 않고 메시지만 기록
          console.error('Failed to load accessible organizations:', errorMessage);
          setToast({ message: errorMessage, type: 'error' });
        }
      } finally {
        if (!cancelled) setIsLoadingAccessibleOrgs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터/검색 변경 시 선택 해제 및 스크롤 맨 위로 이동
  useEffect(() => {
    setSelectedMemberId(null);
    const mainContent = document.querySelector('.dugigo-main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filterKey]);

  // 목록 조회 (무한 스크롤) — 접근 가능 조직 로드 완료 후에만 실행
  useEffect(() => {
    if (isLoadingAccessibleOrgs) return;

    const requestId = ++latestRequestIdRef.current;
    const append = currentPage > 1;

    setLoadMoreFailed(false);
    if (append) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
      setMembers([]);
    }

    const loadMembers = async () => {
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
          }
        );
        if (requestId !== latestRequestIdRef.current) return;

        // 데이터 누적 또는 교체
        setMembers(prev => (append ? [...prev, ...response.members] : response.members));
        // 더 불러올 데이터가 있는지 확인
        setHasMore(currentPage < response.pagination.totalPages);
      } catch (error) {
        if (requestId !== latestRequestIdRef.current) return;

        // 보안: 에러 객체 전체(구성원 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
        const errorMessage = getApiErrorMessage(error, '구성원 목록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch members:', errorMessage);
        if (append) {
          // 실패한 페이지를 건너뛰지 않도록 자동 로드를 멈추고 재시도 버튼을 노출
          setLoadMoreFailed(true);
        }
        setToast({ message: `${errorMessage} 잠시 후 다시 시도해주세요.`, type: 'error' });
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setLoading(false);
          setIsLoadingMore(false);
        }
      }
    };

    loadMembers();
  }, [
    validSearchTerm,
    filterDepartment,
    filterGroup,
    filterTeam,
    currentPage,
    requestVersion,
    isLoadingAccessibleOrgs,
    executeWithRetry,
  ]);

  const singleDepartment = accessibleOrganizations?.gook?.length === 1 ? `${accessibleOrganizations.gook[0]}국` : null;
  const flatGroups = accessibleOrganizations?.group?.flat() ?? [];
  const singleGroup = flatGroups.length === 1 ? `${flatGroups[0]}그룹` : null;

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

    const organizationId = findOrganizationId(
      allOrganizations,
      newMemberInfo.소속국,
      newMemberInfo.소속그룹,
      newMemberInfo.소속순
    );
    if (!organizationId) {
      setToast({ message: ORGANIZATION_NOT_FOUND_MESSAGE, type: 'error' });
      return;
    }

    try {
      await memberService.createMember({
        이름: newMemberInfo.이름,
        name_suffix: newMemberInfo.name_suffix,
        생일연도: newMemberInfo.생일연도 || undefined,
        // 전화번호에서 숫자만 추출하여 전송
        휴대폰번호: extractNumbers(newMemberInfo.휴대폰번호),
        gender_type: newMemberInfo.gender_type,
        organizationId,
        is_new_member: newMemberInfo.is_new_member,
      });

      setToast({ message: '새 구성원이 추가되었습니다.', type: 'success' });
      handleCloseAddMemberModal();
      reloadMembers();
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, '구성원 추가에 실패했습니다.');
      // 보안: 에러 객체 전체(구성원 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
      console.error('Failed to create member:', errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  // 선택 핸들러: 한 명만 선택 (같은 구성원을 다시 누르면 해제)
  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(prev => (prev === memberId ? null : memberId));
  };

  const selectedMember = useMemo(
    () => members.find(member => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId]
  );

  // 선택 가능한 직분(그룹장/순장/부순장/순원)이 아닌 구성원은 이 화면에서 변경 불가
  const isSelectedRoleLocked = !!selectedMember && !isAssignableRoleName(selectedMember.직분);

  // 권한 체크: 'MEMBER_MANAGEMENT_CONTROL' 권한이 있는지 확인
  const hasMemberManagementControlPermission = useMemo(() => {
    return user?.permissions?.includes('MEMBER_MANAGEMENT_CONTROL') ?? false;
  }, [user?.permissions]);

  // 소속 변경 모달 핸들러
  const handleOpenModal = () => {
    if (!selectedMember) {
      setToast({ message: '변경할 구성원을 선택해주세요.', type: 'warning' });
      return;
    }

    // 선택된 구성원의 기존 소속/직분을 기본값으로 설정
    setNewDepartment(selectedMember.소속국 || '');
    setNewGroup(selectedMember.소속그룹 || '');
    setNewTeam(selectedMember.소속순 || '');
    setNewRole(isAssignableRoleName(selectedMember.직분) ? selectedMember.직분 : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (isSubmittingChange) return;

    setShowModal(false);
    setNewDepartment('');
    setNewGroup('');
    setNewTeam('');
    setNewRole('');
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
    if (!selectedMember || isSubmittingChange) return;

    if (!newDepartment || !newGroup || !newTeam || !newRole) {
      setToast({ message: '소속과 직분을 모두 선택해주세요.', type: 'warning' });
      return;
    }

    const isUnchanged =
      selectedMember.소속국 === newDepartment &&
      selectedMember.소속그룹 === newGroup &&
      selectedMember.소속순 === newTeam &&
      selectedMember.직분 === newRole;
    if (isUnchanged) {
      setToast({ message: '변경된 내용이 없습니다.', type: 'info' });
      return;
    }

    const organizationId = findOrganizationId(allOrganizations, newDepartment, newGroup, newTeam);
    if (!organizationId) {
      setToast({ message: ORGANIZATION_NOT_FOUND_MESSAGE, type: 'error' });
      return;
    }

    setIsSubmittingChange(true);
    try {
      await memberService.updateMembersAffiliation({
        memberIds: [selectedMember.id],
        organizationId,
        roleName: newRole,
      });

      setToast({
        message: `${selectedMember.이름}님의 소속이 변경되었습니다. (${newDepartment} / ${newGroup} / ${newTeam}, ${newRole})`,
        type: 'success',
      });
      setShowModal(false);
      setSelectedMemberId(null);

      // 현재 필터는 유지한 채 목록을 다시 불러온다 (변경된 구성원은 현재 필터에서 빠질 수 있음)
      reloadMembers();
    } catch (error) {
      const errorMessage = getApiErrorMessage(error, '소속 변경에 실패했습니다.');
      // 보안: 에러 객체 전체(구성원 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
      console.error('Failed to update affiliation:', errorMessage);
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmittingChange(false);
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
                  setSearchTerm(sanitizeSearchTerm(e.currentTarget.value));
                }}
                onChange={e => {
                  // 조합 중이 아닐 때만 sanitization 적용 (조합 중에는 그대로 설정)
                  setSearchTerm(isComposing ? e.target.value : sanitizeSearchTerm(e.target.value));
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
              }}
              disabled={!!singleDepartment}
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
              }}
              disabled={!!singleGroup || filterDepartment === DEFAULT_FILTER}
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
              onChange={e => setFilterTeam(e.target.value)}
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
              disabled={!selectedMember || !hasMemberManagementControlPermission}
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
                <th style={{ width: '50px', textAlign: 'center' }} aria-label='선택' />
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
                        checked={selectedMemberId === member.id}
                        onChange={() => handleSelectMember(member.id)}
                        aria-label={`${member.이름} 선택`}
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

            {loadMoreFailed && (
              <div className='infinite-scroll-end'>
                <button className='members-modal-button secondary' onClick={retryLoadMore}>
                  다시 불러오기
                </button>
              </div>
            )}

            {!hasMore && (
              <div className='infinite-scroll-end'>
                <span className='infinite-scroll-end-text'>모든 구성원을 불러왔습니다 ({members.length}명)</span>
              </div>
            )}

            {/* Intersection Observer 감지용 요소 */}
            {hasMore && !loadMoreFailed && <div ref={observerRef} className='infinite-scroll-trigger' />}
          </>
        )}
      </div>

      {/* 소속 변경 모달 */}
      {showModal && selectedMember && (
        <div className='members-modal-overlay' onClick={handleCloseModal}>
          <div className='members-modal-content' onClick={e => e.stopPropagation()}>
            <div className='members-modal-header'>
              <h3>소속 변경</h3>
              <button className='members-modal-close' onClick={handleCloseModal} disabled={isSubmittingChange}>
                ×
              </button>
            </div>
            <div className='members-modal-form'>
              {/* 기존 소속/직분 표시 */}
              <div className='current-affiliation'>
                <div className='current-affiliation-label'>현재 소속</div>
                <div className='current-affiliation-value'>
                  {selectedMember.이름} · {selectedMember.소속국} / {selectedMember.소속그룹} / {selectedMember.소속순}{' '}
                  · {selectedMember.직분 || '-'}
                </div>
              </div>
              {isSelectedRoleLocked && (
                <div className='form-error-message' style={{ marginBottom: '12px' }}>
                  현재 직분({selectedMember.직분 || '없음'})은 이 화면에서 변경할 수 없습니다.
                </div>
              )}
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
                  disabled={isSelectedRoleLocked}
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
                  disabled={isSelectedRoleLocked || !newDepartment}
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
                  disabled={isSelectedRoleLocked || !newGroup}
                  className='members-modal-select'
                />
              </div>
              <div className='members-form-group'>
                <label>직분</label>
                <select
                  className='members-modal-select'
                  value={newRole}
                  onChange={e => {
                    if (isAssignableRoleName(e.target.value)) {
                      setNewRole(e.target.value);
                    }
                  }}
                  disabled={isSelectedRoleLocked}
                >
                  <option value='' disabled>
                    직분을 선택하세요
                  </option>
                  {ASSIGNABLE_ROLE_NAMES.map(roleName => (
                    <option key={roleName} value={roleName}>
                      {roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='members-modal-buttons'>
              <button
                className='members-modal-button secondary'
                onClick={handleCloseModal}
                disabled={isSubmittingChange}
              >
                취소
              </button>
              <button
                className='members-modal-button primary'
                onClick={handleConfirmChange}
                disabled={isSubmittingChange || isSelectedRoleLocked}
              >
                {isSubmittingChange ? '변경 중...' : '확인'}
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
