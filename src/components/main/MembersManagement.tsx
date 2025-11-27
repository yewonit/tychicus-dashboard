import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScroll } from '../../hooks';
import { memberService } from '../../services/memberService';
import { Member, OrganizationDto } from '../../types/api';

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 무한 스크롤을 위해 페이지당 항목 수 증가

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTeam, setNewTeam] = useState('');

  // 새 구성원 정보 상태
  const [newMemberInfo, setNewMemberInfo] = useState({
    이름: '',
    name_suffix: 'A', // 동명이인 구분자 (기본값: A)
    생일연도: '',
    휴대폰번호: '',
    gender_type: 'M' as 'M' | 'F', // 성별 (기본값: 남성)
    소속국: '',
    소속그룹: '',
    소속순: '',
    is_new_member: false, // 새가족 여부 (기본값: false)
  });

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const options = await memberService.getFilterOptions();
      setFilterOptions(options);

      // 조직 목록도 가져와서 계층적 필터링에 사용
      const orgs = await memberService.fetchOrganizations();
      setAllOrganizations(orgs);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  // 계층적 필터 옵션 계산
  const getFilteredOptions = () => {
    let filteredGroups = filterOptions.groups || [];
    let filteredTeams = filterOptions.teams || [];

    // 소속국이 선택된 경우, 해당 소속국에 속한 그룹만 필터링
    if (filterDepartment !== '전체' && allOrganizations.length > 0) {
      const deptOrgs = allOrganizations.filter(org => org.name.startsWith(filterDepartment + '_'));
      const deptGroups = new Set<string>();
      deptOrgs.forEach(org => {
        const parts = org.name.split('_');
        if (parts.length >= 2 && parts[1]) {
          deptGroups.add(parts[1]);
        }
      });
      filteredGroups = Array.from(deptGroups).sort();

      // 소속그룹도 선택된 경우, 해당 그룹에 속한 순만 필터링
      if (filterGroup !== '전체') {
        const groupOrgs = deptOrgs.filter(org => org.name.includes(`_${filterGroup}_`));
        const groupTeams = new Set<string>();
        groupOrgs.forEach(org => {
          const parts = org.name.split('_');
          if (parts.length >= 3 && parts[2]) {
            groupTeams.add(parts[2]);
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
  };

  const filteredOptions = getFilteredOptions();

  // Fetch members (무한 스크롤 지원)
  const fetchMembers = useCallback(
    async (append = false) => {
      // 필터/검색이 변경된 경우 append 모드 비활성화
      const currentFilterKey = `${searchTerm}_${filterDepartment}_${filterGroup}_${filterTeam}`;
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
        const response = await memberService.getMembers({
          search: searchTerm,
          department: filterDepartment === '전체' ? undefined : filterDepartment,
          group: filterGroup === '전체' ? undefined : filterGroup,
          team: filterTeam === '전체' ? undefined : filterTeam,
          page: currentPage,
          limit: itemsPerPage,
        });

        // 데이터 누적 또는 교체
        if (append) {
          setMembers(prev => [...prev, ...response.members]);
        } else {
          setMembers(response.members);
        }

        // 더 불러올 데이터가 있는지 확인
        setHasMore(currentPage < response.pagination.totalPages);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        if (!append) {
          alert('구성원 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchTerm, filterDepartment, filterGroup, filterTeam, currentPage, itemsPerPage]
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
      filterKeyRef.current = `${searchTerm}_${filterDepartment}_${filterGroup}_${filterTeam}`;
      fetchMembers(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터/검색 변경 시 초기화
  useEffect(() => {
    const currentFilterKey = `${searchTerm}_${filterDepartment}_${filterGroup}_${filterTeam}`;
    const isFilterChanged = filterKeyRef.current !== currentFilterKey;

    if (isFilterChanged) {
      setCurrentPage(1);
      setHasMore(true);
      setMembers([]); // 데이터 초기화
      filterKeyRef.current = currentFilterKey; // 필터 키 업데이트
      // 스크롤 위치를 맨 위로 이동
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchTerm, filterDepartment, filterGroup, filterTeam]);

  // 페이지 변경 시 데이터 로드 (무한 스크롤)
  useEffect(() => {
    const isFirstPage = currentPage === 1;
    const isFilterChanged = filterKeyRef.current !== `${searchTerm}_${filterDepartment}_${filterGroup}_${filterTeam}`;

    // 필터가 변경되었거나 첫 페이지인 경우 새로 로드
    if (isFirstPage || isFilterChanged) {
      fetchMembers(false);
    } else {
      // 이후 페이지는 누적 로드
      fetchMembers(true);
    }
  }, [currentPage, fetchMembers, searchTerm, filterDepartment, filterGroup, filterTeam]);

  // 사이드바 메뉴 클릭 시 화면 초기화
  useEffect(() => {
    const handleResetPage = () => {
      setSearchTerm('');
      setFilterDepartment('전체');
      setFilterGroup('전체');
      setFilterTeam('전체');
      setCurrentPage(1);
      setHasMore(true);
      setMembers([]);
      setSelectedMembers([]);
      setShowModal(false);
      setShowAddMemberModal(false);
      setShowAlert(false);
      setNewDepartment('');
      setNewGroup('');
      setNewTeam('');
      setNewMemberInfo({
        이름: '',
        name_suffix: 'A',
        생일연도: '',
        휴대폰번호: '',
        gender_type: 'M',
        소속국: '',
        소속그룹: '',
        소속순: '',
        is_new_member: false,
      });
      filterKeyRef.current = '';
      fetchFilterOptions(); // 옵션도 초기화 시 재조회
      // fetchMembers는 필터 변경 useEffect에서 자동 호출됨
    };

    window.addEventListener('resetMembersPage', handleResetPage);

    return () => {
      window.removeEventListener('resetMembersPage', handleResetPage);
    };
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
    setNewMemberInfo({
      이름: '',
      name_suffix: 'A',
      생일연도: '',
      휴대폰번호: '',
      gender_type: 'M',
      소속국: '',
      소속그룹: '',
      소속순: '',
      is_new_member: false,
    });
  };

  const handleAddMemberSubmit = async () => {
    // 유효성 검사
    if (!newMemberInfo.이름) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!newMemberInfo.name_suffix || !newMemberInfo.name_suffix.trim()) {
      alert('동명이인 구분자를 입력해주세요.');
      return;
    }
    if (!newMemberInfo.휴대폰번호) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    if (!newMemberInfo.소속국 || !newMemberInfo.소속그룹 || !newMemberInfo.소속순) {
      alert('소속 정보를 모두 선택해주세요.');
      return;
    }

    try {
      const response = await memberService.createMember({
        이름: newMemberInfo.이름,
        name_suffix: newMemberInfo.name_suffix,
        생일연도: newMemberInfo.생일연도 || undefined,
        휴대폰번호: newMemberInfo.휴대폰번호,
        gender_type: newMemberInfo.gender_type,
        소속국: newMemberInfo.소속국,
        소속그룹: newMemberInfo.소속그룹,
        소속순: newMemberInfo.소속순,
        is_new_member: newMemberInfo.is_new_member,
      });

      if (response.success) {
        setAlertMessage('새 구성원이 추가되었습니다.');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        handleCloseAddMemberModal();
        fetchMembers(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to create member:', error);
      alert('구성원 추가에 실패했습니다.');
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
      alert('변경할 구성원을 선택해주세요.');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewDepartment('');
    setNewGroup('');
    setNewTeam('');
  };

  const handleConfirmChange = async () => {
    if (!newDepartment || !newGroup || !newTeam) {
      alert('모든 소속 정보를 선택해주세요.');
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

        setAlertMessage(response.message || '소속이 변경되었습니다.');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        handleCloseModal();
        setSelectedMembers([]);
        fetchMembers(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to update affiliation:', error);
      alert('소속 변경에 실패했습니다.');
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
                placeholder='이름으로 검색...'
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className='search-icon'>🔍</span>
            </div>
            <select
              className='members-filter-select'
              value={filterDepartment}
              onChange={e => {
                setFilterDepartment(e.target.value);
                // 소속국 변경 시 하위 필터 초기화
                setFilterGroup('전체');
                setFilterTeam('전체');
                setCurrentPage(1);
              }}
            >
              <option value='전체'>소속국</option>
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
                setFilterTeam('전체');
                setCurrentPage(1);
              }}
              disabled={filterDepartment === '전체'}
            >
              <option value='전체'>소속그룹</option>
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
              disabled={filterGroup === '전체'}
            >
              <option value='전체'>소속순</option>
              {(filteredOptions.teams || []).map(team => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className='members-action-buttons'>
            <button className='add-button' onClick={handleAddMember}>
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
          <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
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
                <th>이름</th>
                <th>기수</th>
                <th>소속 국</th>
                <th>소속 그룹</th>
                <th>소속 순</th>
                <th>휴대폰번호</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div className='members-empty-state'>검색 결과가 없습니다.</div>
                  </td>
                </tr>
              ) : (
                members.map(member => (
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
              <div className='infinite-scroll-loading' style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid var(--border-light)',
                      borderTop: '3px solid var(--primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    더 많은 구성원을 불러오는 중...
                  </span>
                </div>
              </div>
            )}

            {!hasMore && members.length > 0 && (
              <div className='infinite-scroll-end' style={{ padding: '20px', textAlign: 'center' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  모든 구성원을 불러왔습니다 ({members.length}명)
                </span>
              </div>
            )}

            {/* Intersection Observer 감지용 요소 */}
            {hasMore && <div ref={observerRef} style={{ height: '20px' }} />}
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
              <div className='members-form-group'>
                <label>소속 국</label>
                <select
                  className='members-modal-select'
                  value={newDepartment}
                  onChange={e => setNewDepartment(e.target.value)}
                >
                  <option value=''>선택하세요</option>
                  {(filterOptions.departments || []).map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className='members-form-group'>
                <label>소속 그룹</label>
                <select className='members-modal-select' value={newGroup} onChange={e => setNewGroup(e.target.value)}>
                  <option value=''>선택하세요</option>
                  {(filterOptions.groups || []).map(group => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div className='members-form-group'>
                <label>소속 순</label>
                <select className='members-modal-select' value={newTeam} onChange={e => setNewTeam(e.target.value)}>
                  <option value=''>선택하세요</option>
                  {(filterOptions.teams || []).map(team => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
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
                      className='members-modal-input'
                      value={newMemberInfo.이름}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 이름: e.target.value })}
                      placeholder='이름을 입력하세요'
                    />
                  </div>
                  <div className='members-form-group'>
                    <label>
                      동명이인 구분자 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <input
                      type='text'
                      className='members-modal-input'
                      value={newMemberInfo.name_suffix}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, name_suffix: e.target.value })}
                      placeholder='예: A, B, C'
                      maxLength={10}
                    />
                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      동일한 이름이 있을 경우 구분하기 위한 문자 (예: 홍길동A의 "A")
                    </small>
                  </div>
                  <div className='members-form-group'>
                    <label>생년월일</label>
                    <input
                      type='date'
                      className='members-modal-input'
                      value={newMemberInfo.생일연도}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 생일연도: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className='members-form-group'>
                    <label>성별</label>
                    <select
                      className='members-modal-select'
                      value={newMemberInfo.gender_type}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, gender_type: e.target.value as 'M' | 'F' })}
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
                      className='members-modal-input'
                      value={newMemberInfo.휴대폰번호}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 휴대폰번호: e.target.value })}
                      placeholder='예: 010-1234-5678'
                    />
                  </div>
                  <div className='members-form-group'>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type='checkbox'
                        checked={newMemberInfo.is_new_member}
                        onChange={e => setNewMemberInfo({ ...newMemberInfo, is_new_member: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span>새가족 여부</span>
                    </label>
                    <small style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '26px' }}>
                      체크 시 새가족으로 등록됩니다
                    </small>
                  </div>
                </div>

                {/* 오른쪽 열: 소속 정보 */}
                <div className='members-modal-form-column'>
                  <div className='members-form-group'>
                    <label>
                      소속 국 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <select
                      className='members-modal-select'
                      value={newMemberInfo.소속국}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 소속국: e.target.value })}
                    >
                      <option value=''>선택하세요</option>
                      {(filterOptions.departments || []).map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='members-form-group'>
                    <label>
                      소속 그룹 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <select
                      className='members-modal-select'
                      value={newMemberInfo.소속그룹}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 소속그룹: e.target.value })}
                    >
                      <option value=''>선택하세요</option>
                      {(filterOptions.groups || []).map(group => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='members-form-group'>
                    <label>
                      소속 순 <span style={{ color: 'var(--error)' }}>*</span>
                    </label>
                    <select
                      className='members-modal-select'
                      value={newMemberInfo.소속순}
                      onChange={e => setNewMemberInfo({ ...newMemberInfo, 소속순: e.target.value })}
                    >
                      <option value=''>선택하세요</option>
                      {(filterOptions.teams || []).map(team => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
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

      {/* 성공 알림 */}
      {showAlert && <div className='members-alert'>{alertMessage}</div>}
    </div>
  );
};

export default MembersManagement;
