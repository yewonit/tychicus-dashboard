import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  visitationStatsSummary,
  departmentVisitationStats,
  departmentSummaryTable,
  roleBasedStats,
  monthlyTrends,
  methodStats,
  recentTeamMissions,
  performanceMetrics,
  keywordAnalysis,
  effectivenessAnalysis,
  goalAchievement
} from '../data/visitationStatsData';

// 기존 스타일 컴포넌트 재사용
const Container = styled.div`
  padding: 30px;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: var(--background-primary);
  padding: 25px;
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatDescription = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
`;

// 새로운 계층적 표 스타일 컴포넌트
const HierarchicalTableContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-top: 20px;
`;

const DepartmentSection = styled.div`
  border-bottom: 2px solid var(--border-light);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DepartmentHeader = styled.div`
  background: linear-gradient(135deg, var(--royal-blue) 0%, var(--dark-sky-blue) 100%);
  color: white;
  padding: 15px 20px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--dark-sky-blue) 0%, var(--royal-blue) 100%);
  }
`;

const GroupSection = styled.div`
  background: rgba(151, 180, 222, 0.1);
  border-left: 4px solid var(--dark-sky-blue);
`;

const GroupHeader = styled.div`
  background: rgba(151, 180, 222, 0.2);
  padding: 12px 20px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(151, 180, 222, 0.3);
  }
`;

const MemberRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-light);
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MemberName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const MemberRole = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const MissionCount = styled.span`
  font-weight: 400;
  color: var(--text-primary);
  text-align: center;
`;

const ExpandIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// 요약 표 스타일
const SummaryTableContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-light);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
  text-align: center;
`;

const TableCellBold = styled(TableCell)`
  font-weight: 600;
  color: var(--text-primary);
`;

const TableCellSecondary = styled(TableCell)`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

// 필터 컨트롤 스타일
const FilterControls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  background: var(--gradient-primary);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

// 심방통계 컴포넌트
const VisitationStatistics = () => {
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState('전체');
  const [sortBy, setSortBy] = useState('name');

  // 국 확장/축소 토글
  const toggleDepartment = (departmentName) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentName)) {
        newSet.delete(departmentName);
      } else {
        newSet.add(departmentName);
      }
      return newSet;
    });
  };

  // 그룹 확장/축소 토글
  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  // 필터링된 데이터
  const filteredData = selectedDepartment === '전체' 
    ? departmentVisitationStats 
    : departmentVisitationStats.filter(dept => dept.department === selectedDepartment);

  // 정렬된 데이터
  const sortedData = [...filteredData].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.department.localeCompare(b.department);
      case 'count':
        return b.totalTeamMissions - a.totalTeamMissions;
      case 'percentage':
        return b.totalTeamMissions - a.totalTeamMissions;
      default:
        return 0;
    }
  });

  return (
    <Container>
      <Header>
        <Title>심방통계</Title>
        <Subtitle>팀사역 활동 현황을 확인하고 분석하세요</Subtitle>
      </Header>

      {/* 요약 통계 카드 */}
      <StatsGrid>
        <StatCard>
          <StatTitle>총 팀사역 수</StatTitle>
          <StatValue>{visitationStatsSummary.totalTeamMissions}</StatValue>
          <StatDescription>전체 팀사역 합계</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>활성 국 수</StatTitle>
          <StatValue>{visitationStatsSummary.activeDepartments}</StatValue>
          <StatDescription>팀사역이 있는 국</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>평균 팀사역</StatTitle>
          <StatValue>{visitationStatsSummary.averagePerDepartment}</StatValue>
          <StatDescription>국별 평균 팀사역</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>최고 팀사역</StatTitle>
          <StatValue>{visitationStatsSummary.highestDepartment.count}</StatValue>
          <StatDescription>{visitationStatsSummary.highestDepartment.name} 팀사역</StatDescription>
        </StatCard>
      </StatsGrid>

      {/* 국별 요약 표 */}
      <SummaryTableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>국</TableHeaderCell>
              <TableHeaderCell>팀사역 숫자</TableHeaderCell>
              <TableHeaderCell>비율</TableHeaderCell>
              <TableHeaderCell>상태</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {departmentSummaryTable.map(dept => (
              <TableRow key={dept.department}>
                <TableCellBold>{dept.department}</TableCellBold>
                <TableCellBold>{dept.teamMissionCount}</TableCellBold>
                <TableCellSecondary>{dept.percentage}%</TableCellSecondary>
                <TableCellSecondary>
                  {dept.teamMissionCount > 10 ? '우수' : 
                   dept.teamMissionCount > 5 ? '양호' : '개선필요'}
                </TableCellSecondary>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SummaryTableContainer>

      {/* 필터 컨트롤 */}
      <FilterControls>
        <FilterSelect 
          value={selectedDepartment} 
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="전체">전체 국</option>
          <option value="1국">1국</option>
          <option value="2국">2국</option>
          <option value="3국">3국</option>
          <option value="4국">4국</option>
          <option value="5국">5국</option>
        </FilterSelect>
        
        <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">국명순</option>
          <option value="count">팀사역 수순</option>
          <option value="percentage">비율순</option>
        </FilterSelect>
        
        <Button onClick={() => {
          setExpandedDepartments(new Set(sortedData.map(dept => dept.department)));
        }}>
          전체 펼치기
        </Button>
        
        <Button onClick={() => {
          setExpandedDepartments(new Set());
          setExpandedGroups(new Set());
        }}>
          전체 접기
        </Button>
      </FilterControls>

      {/* 계층적 상세 표 */}
      <HierarchicalTableContainer>
        {sortedData.map(department => (
          <DepartmentSection key={department.department}>
            <DepartmentHeader onClick={() => toggleDepartment(department.department)}>
              <span>{department.department} ({department.totalTeamMissions}건)</span>
              <ExpandIcon expanded={expandedDepartments.has(department.department)}>
                ▼
              </ExpandIcon>
            </DepartmentHeader>
            
            {expandedDepartments.has(department.department) && (
              <>
                {/* 국장, 부국장 정보 */}
                <MemberRow>
                  <MemberName>{department.departmentHead.name}</MemberName>
                  <MemberRole>{department.departmentHead.role}</MemberRole>
                  <MissionCount>{department.departmentHead.teamMissionCount}</MissionCount>
                </MemberRow>
                <MemberRow>
                  <MemberName>{department.deputyHead.name}</MemberName>
                  <MemberRole>{department.deputyHead.role}</MemberRole>
                  <MissionCount>{department.deputyHead.teamMissionCount}</MissionCount>
                </MemberRow>
                
                {/* 그룹별 정보 */}
                {department.groups.map(group => (
                  <GroupSection key={group.groupName}>
                    <GroupHeader onClick={() => toggleGroup(group.groupName)}>
                      <span>{group.groupName} ({group.groupTotal}건)</span>
                      <ExpandIcon expanded={expandedGroups.has(group.groupName)}>
                        ▼
                      </ExpandIcon>
                    </GroupHeader>
                    
                    {expandedGroups.has(group.groupName) && (
                      <>
                        {/* 그룹장 */}
                        <MemberRow>
                          <MemberName>{group.groupLeader.name}</MemberName>
                          <MemberRole>{group.groupLeader.role}</MemberRole>
                          <MissionCount>{group.groupLeader.teamMissionCount}</MissionCount>
                        </MemberRow>
                        
                        {/* 부그룹장들 */}
                        {group.deputyLeaders.map((deputy, index) => (
                          <MemberRow key={index}>
                            <MemberName>{deputy.name}</MemberName>
                            <MemberRole>{deputy.role}</MemberRole>
                            <MissionCount>{deputy.teamMissionCount}</MissionCount>
                          </MemberRow>
                        ))}
                        
                        {/* 순장들 */}
                        {group.teamLeaders.map((leader, index) => (
                          <MemberRow key={index}>
                            <MemberName>{leader.name}</MemberName>
                            <MemberRole>{leader.role}</MemberRole>
                            <MissionCount>{leader.teamMissionCount}</MissionCount>
                          </MemberRow>
                        ))}
                        
                        {/* 일반 구성원들 */}
                        {group.members.map((member, index) => (
                          <MemberRow key={index}>
                            <MemberName>{member.name}</MemberName>
                            <MemberRole>{member.role || '구성원'}</MemberRole>
                            <MissionCount>{member.teamMissionCount}</MissionCount>
                          </MemberRow>
                        ))}
                      </>
                    )}
                  </GroupSection>
                ))}
              </>
            )}
          </DepartmentSection>
        ))}
      </HierarchicalTableContainer>
    </Container>
  );
};

export default VisitationStatistics;
