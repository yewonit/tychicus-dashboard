import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { membersData } from '../../data/mockData';

const MembersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMembers = membersData.filter(
    member =>
      member.이름.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.소속국.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.소속그룹.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.소속순.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handleMemberClick = (member: any) => {
    // 구성원 상세 정보 화면으로 이동
    navigate(`/main/member-management/${member.id}`);
  };

  const handleAddMember = () => {
    // 새 구성원 추가 로직
  };

  return (
    <div className='members-container'>
      <div className='members-header'>
        <h1>구성원 관리</h1>
        <p>청년회 구성원 정보를 관리하세요</p>
      </div>

      <div className='members-controls'>
        <div className='search-box'>
          <input
            type='text'
            placeholder='이름, 소속 국, 소속 그룹, 소속 순으로 검색...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className='search-icon'>🔍</span>
        </div>
        <button className='add-button' onClick={handleAddMember}>
          + 새 구성원 추가
        </button>
      </div>

      <div className='table-container'>
        <table className='members-table'>
          <thead>
            <tr>
              <th>이름</th>
              <th>기수</th>
              <th>소속 국</th>
              <th>소속 그룹</th>
              <th>소속 순</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map(member => (
              <tr key={member.id}>
                <td className='clickable-name' onClick={() => handleMemberClick(member)}>
                  {member.이름}
                </td>
                <td>{member.생일연도 ? member.생일연도.slice(-2) : ''}</td>
                <td>{member.소속국}</td>
                <td>{member.소속그룹}</td>
                <td>{member.소속순}</td>
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
    </div>
  );
};

export default MembersManagement;
