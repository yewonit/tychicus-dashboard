import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { membersData } from '../data/mockData';

const MembersContainer = styled.div`
  padding: 10px;
  /*margin-left: 240px;*/
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  max-width: 600px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5568d3;
  }
`;

const TableContainer = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    background: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
  
  td {
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  tr:hover {
    background: rgba(248, 247, 245, 0.5);
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.status === '출석' ? '#10B981' :
    props.status === '결석' ? '#EF4444' :
    '#F59E0B'
  };
  color: white;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 5px;
  
  &.edit {
    background: var(--blue-oblivion);
    color: white;
    
    &:hover {
      background: var(--sapphire-dust);
    }
  }
  
  &.delete {
    background: #EF4444;
    color: white;
    
    &:hover {
      background: #DC2626;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background: ${props => props.active ? 'var(--blue-oblivion)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--sapphire-dust)' : 'var(--bg-secondary)'};
  }
`;

const ClickableName = styled.td`
  cursor: pointer;
  color: var(--blue-oblivion);
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--sapphire-dust);
    text-decoration: underline;
  }
`;

const ChangeAffiliationButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ModalForm = styled.div`
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;
    margin-bottom: 8px;
  }
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e9ecef;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
`;

const Alert = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  z-index: 2000;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const MembersManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // 체크박스 및 모달 상태
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newTeam, setNewTeam] = useState('');
  
  // 구성원 데이터를 상태로 관리
  const [members, setMembers] = useState(membersData);

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
      setShowAlert(false);
      setNewDepartment('');
      setNewGroup('');
      setNewTeam('');
    };

    window.addEventListener('resetMembersPage', handleResetPage);
    
    return () => {
      window.removeEventListener('resetMembersPage', handleResetPage);
    };
  }, []);

  // 소속국, 그룹, 순 목록 생성
  const departments = [...new Set(members.map(m => m.소속국))].sort();
  const groups = [...new Set(members.map(m => m.소속그룹))].sort();
  const teams = [...new Set(members.map(m => m.소속순))].sort();

  // 모달에서 사용할 필터링된 목록
  const getFilteredGroups = (selectedDept) => {
    if (!selectedDept) return [];
    return [...new Set(members
      .filter(m => m.소속국 === selectedDept)
      .map(m => m.소속그룹))].sort();
  };

  const getFilteredTeams = (selectedDept, selectedGroup) => {
    if (!selectedDept || !selectedGroup) return [];
    return [...new Set(members
      .filter(m => m.소속국 === selectedDept && m.소속그룹 === selectedGroup)
      .map(m => m.소속순))].sort();
  };

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

  const handleMemberClick = (member) => {
    // 구성원 상세 정보 화면으로 이동
    navigate(`/members/${member.id}`);
  };

  // 체크박스 핸들러
  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

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

  const handleDepartmentChange = (dept) => {
    setNewDepartment(dept);
    setNewGroup(''); // 소속국이 변경되면 그룹과 순 초기화
    setNewTeam('');
  };

  const handleGroupChange = (group) => {
    setNewGroup(group);
    setNewTeam(''); // 소속그룹이 변경되면 순 초기화
  };

  const handleConfirmChange = () => {
    if (!newDepartment || !newGroup || !newTeam) {
      alert('모든 소속 정보를 선택해주세요.');
      return;
    }

    // 실제 구현에서는 API 호출
    // 여기서는 로컬 상태만 업데이트
    setMembers(prevMembers => 
      prevMembers.map(member => 
        selectedMembers.includes(member.id)
          ? {
              ...member,
              소속국: newDepartment,
              소속그룹: newGroup,
              소속순: newTeam
            }
          : member
      )
    );
    
    // 소속 변경 이벤트 발생
    window.dispatchEvent(new CustomEvent('memberAffiliationChanged', {
      detail: {
        memberIds: selectedMembers,
        newDepartment,
        newGroup,
        newTeam
      }
    }));
    
    // 알림 표시
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    
    handleCloseModal();
    setSelectedMembers([]);
  };

  return (
    <MembersContainer>
      <Header>
        <h1>구성원 관리</h1>
        <p>청년회 구성원 정보를 관리하세요</p>
      </Header>

      <Controls>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="이름으로 검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <FilterSelect
            value={filterDepartment}
            onChange={(e) => {
              setFilterDepartment(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="전체">소속국</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterGroup}
            onChange={(e) => {
              setFilterGroup(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="전체">소속그룹</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterTeam}
            onChange={(e) => {
              setFilterTeam(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="전체">소속순</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </FilterSelect>
        </SearchBar>
        <div style={{ display: 'flex', gap: '10px' }}>
          <AddButton>+ 새 구성원 추가</AddButton>
          <ChangeAffiliationButton 
            onClick={handleOpenModal}
          >
            소속 변경
          </ChangeAffiliationButton>
        </div>
      </Controls>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}></th>
              <th>이름</th>
              <th>기수</th>
              <th>소속 국</th>
              <th>소속 그룹</th>
              <th>소속 순</th>
              <th>휴대폰번호</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map((member) => (
              <tr key={member.id}>
                <td style={{ textAlign: 'center' }}>
                  <Checkbox 
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                    disabled={selectedMembers.length > 0 && !selectedMembers.includes(member.id)}
                  />
                </td>
                <ClickableName onClick={() => handleMemberClick(member)}>
                  {member.이름}
                </ClickableName>
                <td>{member.생일연도 ? member.생일연도.slice(-2) : ''}</td>
                <td>{member.소속국}</td>
                <td>{member.소속그룹}</td>
                <td>{member.소속순}</td>
                <td>{member.휴대폰번호 ? member.휴대폰번호.slice(-4) : ''}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <Pagination>
        <PageButton 
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
        
        <PageButton 
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </PageButton>
      </Pagination>

      {/* 소속 변경 모달 */}
      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>소속 변경</h3>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <ModalForm>
              <FormGroup>
                <label>소속 국</label>
                <ModalSelect 
                  value={newDepartment} 
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </ModalSelect>
              </FormGroup>
              <FormGroup>
                <label>소속 그룹</label>
                <ModalSelect 
                  value={newGroup} 
                  onChange={(e) => handleGroupChange(e.target.value)}
                  disabled={!newDepartment}
                >
                  <option value="">선택하세요</option>
                  {getFilteredGroups(newDepartment).map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </ModalSelect>
              </FormGroup>
              <FormGroup>
                <label>소속 순</label>
                <ModalSelect 
                  value={newTeam} 
                  onChange={(e) => setNewTeam(e.target.value)}
                  disabled={!newGroup}
                >
                  <option value="">선택하세요</option>
                  {getFilteredTeams(newDepartment, newGroup).map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </ModalSelect>
              </FormGroup>
            </ModalForm>
            <ModalButtonGroup>
              <ModalButton className="secondary" onClick={handleCloseModal}>
                취소
              </ModalButton>
              <ModalButton className="primary" onClick={handleConfirmChange}>
                확인
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* 성공 알림 */}
      {showAlert && <Alert>소속이 변경되었습니다.</Alert>}
    </MembersContainer>
  );
};

export default MembersManagement; 