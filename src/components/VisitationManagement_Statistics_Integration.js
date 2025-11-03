// VisitationManagement.js에 추가할 심방통계 탭 렌더링 함수
// 기존 renderStatisticsTab 함수를 대체하거나 확장

const renderStatisticsTab = () => (
  <div>
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

    {/* 추가 통계 섹션 */}
    <StatsGrid style={{ marginTop: '30px' }}>
      <StatCard>
        <StatTitle>심방 방법별 통계</StatTitle>
        <StatValue>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            {Object.entries(methodStats).map(([method, data]) => (
              <div key={method} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: 'bold' }}>{method}</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {data.count}건 ({data.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </StatValue>
        <StatDescription>심방 방법별 현황</StatDescription>
      </StatCard>
      
      <StatCard>
        <StatTitle>직분별 팀사역 통계</StatTitle>
        <StatValue>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
            {Object.entries(roleBasedStats).map(([role, data]) => (
              <div key={role} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: 'bold' }}>{role}</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {data.totalMissions}건
                </span>
              </div>
            ))}
          </div>
        </StatValue>
        <StatDescription>직분별 팀사역 현황</StatDescription>
      </StatCard>
      
      <StatCard>
        <StatTitle>목표 달성률</StatTitle>
        <StatValue>{goalAchievement.achievementRate}%</StatValue>
        <StatDescription>
          목표: {goalAchievement.monthlyGoal}건 / 현재: {goalAchievement.currentAchievement}건
        </StatDescription>
      </StatCard>
      
      <StatCard>
        <StatTitle>이번 달 주요 키워드</StatTitle>
        <StatValue>
          <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
            {keywordAnalysis.thisMonth.slice(0, 3).map((kw, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold' }}>{kw.keyword}</span>
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '0.6rem',
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}>
                  {kw.count}
                </span>
              </div>
            ))}
          </div>
        </StatValue>
        <StatDescription>이번 달 심방 내용에서 자주 언급된 키워드</StatDescription>
      </StatCard>
    </StatsGrid>
  </div>
);

// VisitationManagement.js에 추가할 상태 변수들
const [expandedDepartments, setExpandedDepartments] = useState(new Set());
const [expandedGroups, setExpandedGroups] = useState(new Set());
const [selectedDepartment, setSelectedDepartment] = useState('전체');
const [sortBy, setSortBy] = useState('name');

// VisitationManagement.js에 추가할 함수들
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

// VisitationManagement.js에 추가할 import
import { 
  visitationStatsSummary,
  departmentVisitationStats,
  departmentSummaryTable,
  roleBasedStats,
  methodStats,
  keywordAnalysis,
  goalAchievement
} from '../data/visitationStatsData';




