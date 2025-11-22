import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../../types/api';
import { memberService } from '../../services/memberService';
import { LoadingSpinner } from '../ui'; // Assuming LoadingSpinner exists in ui/index.ts

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Data states
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOptions, setFilterOptions] = useState<{
    departments: string[];
    groups: string[];
    teams: string[];
  }>({ departments: [], groups: [], teams: [] });

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
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    }
  };

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await memberService.getMembers({
        search: searchTerm,
        department: filterDepartment,
        group: filterGroup,
        team: filterTeam,
        page: currentPage,
        limit: itemsPerPage,
      });

      setMembers(response.members);
      setTotalPages(response.pagination.totalPages);
      
      // API에서 필터 옵션을 제공하지 않으므로 별도 호출 필요
      // 하지만 초기 로딩 시에만 호출하면 됨
    } catch (error) {
      console.error('Failed to fetch members:', error);
      alert('구성원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Initial Load: Filter Options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Search & Filter: Members List
  useEffect(() => {
    fetchMembers();
  }, [searchTerm, filterDepartment, filterGroup, filterTeam, currentPage]);

  // 사이드바 메뉴 클릭 시 화면 초기화
  useEffect(() => {
    const handleResetPage = () => {
      setSearchTerm('');
      setFilterDepartment('전체');
      setFilterGroup('전체');
      setFilterTeam('전체');
      setCurrentPage(1);
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
      fetchFilterOptions(); // 옵션도 초기화 시 재조회
      fetchMembers();
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
              setCurrentPage(1);
            }}
          >
            <option value='전체'>소속국</option>
            {(filterOptions.departments || []).map(dept => (
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
              setCurrentPage(1);
            }}
          >
            <option value='전체'>소속그룹</option>
            {(filterOptions.groups || []).map(group => (
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
          >
            <option value='전체'>소속순</option>
            {(filterOptions.teams || []).map(team => (
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
      </div>

      <div className='pagination'>
        <button className='page-button' onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`page-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          className='page-button'
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          다음
        </button>
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
