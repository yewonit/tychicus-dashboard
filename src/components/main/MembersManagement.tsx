import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { membersData } from '../../data/mockData';

interface Member {
  id: number;
  이름: string;
  생일연도?: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
  직분?: string;
  주일청년예배출석일자?: string;
  수요예배출석일자?: string;
  휴대폰번호?: string;
}

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 체크박스 및 모달 상태
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTeam, setNewTeam] = useState('');

  // 구성원 데이터를 상태로 관리 (목업 데이터)
  const [members, setMembers] = useState<Member[]>(membersData);

  // 소속국, 그룹, 순 목록 생성
  const departments = [...new Set(members.map(m => m.소속국))].sort();
  const groups = [...new Set(members.map(m => m.소속그룹))].sort();
  const teams = [...new Set(members.map(m => m.소속순))].sort();

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.이름.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '전체' || member.소속국 === filterDepartment;
    const matchesGroup = filterGroup === '전체' || member.소속그룹 === filterGroup;
    const matchesTeam = filterTeam === '전체' || member.소속순 === filterTeam;

    return matchesSearch && matchesDepartment && matchesGroup && matchesTeam;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handleMemberClick = (member: Member) => {
    navigate(`/main/member-management/${member.id}`);
  };

  const handleAddMember = () => {
    // 새 구성원 추가 로직 (목업 - 실제 API 연동 필요)
    console.log('새 구성원 추가');
  };

  // 체크박스 핸들러
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedMembers(currentMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers(prev => (prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]));
  };

  const isAllSelected = selectedMembers.length === currentMembers.length && currentMembers.length > 0;

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

  const handleConfirmChange = () => {
    if (!newDepartment || !newGroup || !newTeam) {
      alert('모든 소속 정보를 선택해주세요.');
      return;
    }

    // 목업: 로컬 상태만 업데이트 (실제로는 API 호출 필요)
    setMembers(prevMembers =>
      prevMembers.map(member =>
        selectedMembers.includes(member.id)
          ? {
              ...member,
              소속국: newDepartment,
              소속그룹: newGroup,
              소속순: newTeam,
            }
          : member
      )
    );

    // 알림 표시
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    handleCloseModal();
    setSelectedMembers([]);
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
            {departments.map(dept => (
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
            {groups.map(group => (
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
            {teams.map(team => (
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
            {currentMembers.map(member => (
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
            ))}
          </tbody>
        </table>
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
          disabled={currentPage === totalPages}
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
                  {departments.map(dept => (
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
                  {groups.map(group => (
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
                  {teams.map(team => (
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

      {/* 성공 알림 */}
      {showAlert && <div className='members-alert'>소속이 변경되었습니다.</div>}
    </div>
  );
};

export default MembersManagement;
