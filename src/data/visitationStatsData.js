// 심방통계용 목업 데이터
// mockData.js의 조직 구조를 기반으로 한 팀사역 통계

// 국별 팀사역 통계 요약 데이터
export const visitationStatsSummary = {
  totalTeamMissions: 40,
  activeDepartments: 5,
  averagePerDepartment: 8,
  highestDepartment: { name: '4국', count: 13 },
  totalMembers: 20,
  participationRate: 85.0
};

// 국별 팀사역 통계 상세 데이터
export const departmentVisitationStats = [
  {
    department: '1국',
    departmentHead: { name: '김양원', role: '국장', teamMissionCount: 0 },
    deputyHead: { name: '이해니', role: '부국장', teamMissionCount: 0 },
    totalTeamMissions: 7,
    groups: [
      {
        groupName: '김민수 그룹',
        groupLeader: { name: '김민수', role: '그룹장', teamMissionCount: 0 },
        deputyLeaders: [
          { name: '이지은', role: '부그룹장', teamMissionCount: 0 }
        ],
        teamLeaders: [
          { name: '김민수', role: '순장', teamMissionCount: 0 },
          { name: '이지은', role: '순장', teamMissionCount: 0 }
        ],
        members: [
          { name: '박서연', role: '', teamMissionCount: 0 },
          { name: '최준호', role: '', teamMissionCount: 0 }
        ],
        groupTotal: 0
      }
    ],
    departmentTotal: 7
  },
  {
    department: '2국',
    departmentHead: { name: '신승민', role: '국장', teamMissionCount: 0 },
    deputyHead: { name: '심주하', role: '부국장', teamMissionCount: 0 },
    totalTeamMissions: 9,
    groups: [
      {
        groupName: '박준호 그룹',
        groupLeader: { name: '박준호', role: '그룹장', teamMissionCount: 0 },
        deputyLeaders: [
          { name: '최수진', role: '부그룹장', teamMissionCount: 2 }
        ],
        teamLeaders: [
          { name: '박준호', role: '순장', teamMissionCount: 0 },
          { name: '최수진', role: '순장', teamMissionCount: 1 }
        ],
        members: [
          { name: '김지훈', role: '', teamMissionCount: 0 },
          { name: '이미영', role: '', teamMissionCount: 0 }
        ],
        groupTotal: 3
      }
    ],
    departmentTotal: 9
  },
  {
    department: '3국',
    departmentHead: { name: '이현동', role: '국장', teamMissionCount: 0 },
    deputyHead: { name: '신경이', role: '부국장', teamMissionCount: 0 },
    totalTeamMissions: 4,
    groups: [
      {
        groupName: '정현우 그룹',
        groupLeader: { name: '정현우', role: '그룹장', teamMissionCount: 0 },
        deputyLeaders: [
          { name: '한소영', role: '부그룹장', teamMissionCount: 0 }
        ],
        teamLeaders: [
          { name: '정현우', role: '순장', teamMissionCount: 0 },
          { name: '한소영', role: '순장', teamMissionCount: 0 }
        ],
        members: [
          { name: '박성민', role: '', teamMissionCount: 0 },
          { name: '김수진', role: '', teamMissionCount: 0 }
        ],
        groupTotal: 0
      }
    ],
    departmentTotal: 4
  },
  {
    department: '4국',
    departmentHead: { name: '장승우', role: '국장', teamMissionCount: 0 },
    deputyHead: { name: '박우주', role: '부국장', teamMissionCount: 0 },
    totalTeamMissions: 13,
    groups: [
      {
        groupName: '강동현 그룹',
        groupLeader: { name: '강동현', role: '그룹장', teamMissionCount: 0 },
        deputyLeaders: [
          { name: '윤미라', role: '부그룹장', teamMissionCount: 2 }
        ],
        teamLeaders: [
          { name: '강동현', role: '순장', teamMissionCount: 0 },
          { name: '윤미라', role: '순장', teamMissionCount: 1 }
        ],
        members: [
          { name: '이준석', role: '', teamMissionCount: 0 },
          { name: '최유진', role: '', teamMissionCount: 0 }
        ],
        groupTotal: 3
      }
    ],
    departmentTotal: 13
  },
  {
    department: '5국',
    departmentHead: { name: '송태민', role: '국장', teamMissionCount: 0 },
    deputyHead: { name: '임하나', role: '부국장', teamMissionCount: 0 },
    totalTeamMissions: 7,
    groups: [
      {
        groupName: '송태민 그룹',
        groupLeader: { name: '송태민', role: '그룹장', teamMissionCount: 0 },
        deputyLeaders: [
          { name: '임하나', role: '부그룹장', teamMissionCount: 2 }
        ],
        teamLeaders: [
          { name: '송태민', role: '순장', teamMissionCount: 0 },
          { name: '임하나', role: '순장', teamMissionCount: 1 }
        ],
        members: [
          { name: '박지원', role: '', teamMissionCount: 0 },
          { name: '김민지', role: '', teamMissionCount: 0 }
        ],
        groupTotal: 3
      }
    ],
    departmentTotal: 7
  }
];

// 국별 팀사역 요약 표 데이터
export const departmentSummaryTable = [
  { department: '1국', teamMissionCount: 7, percentage: 17.5, color: '#667eea' },
  { department: '2국', teamMissionCount: 9, percentage: 22.5, color: '#764ba2' },
  { department: '3국', teamMissionCount: 4, percentage: 10.0, color: '#f093fb' },
  { department: '4국', teamMissionCount: 13, percentage: 32.5, color: '#f5576c' },
  { department: '5국', teamMissionCount: 7, percentage: 17.5, color: '#4facfe' }
];

// 직분별 팀사역 통계
export const roleBasedStats = {
  국장: { count: 5, totalMissions: 0, average: 0 },
  부국장: { count: 5, totalMissions: 0, average: 0 },
  그룹장: { count: 5, totalMissions: 0, average: 0 },
  부그룹장: { count: 5, totalMissions: 4, average: 0.8 },
  순장: { count: 10, totalMissions: 2, average: 0.2 },
  일반구성원: { count: 10, totalMissions: 0, average: 0 }
};

// 월별 팀사역 트렌드 데이터
export const monthlyTrends = [
  { month: '1월', totalMissions: 35, departments: { '1국': 6, '2국': 8, '3국': 3, '4국': 12, '5국': 6 } },
  { month: '2월', totalMissions: 42, departments: { '1국': 7, '2국': 9, '3국': 4, '4국': 13, '5국': 9 } },
  { month: '3월', totalMissions: 38, departments: { '1국': 6, '2국': 8, '3국': 3, '4국': 11, '5국': 10 } },
  { month: '4월', totalMissions: 45, departments: { '1국': 8, '2국': 10, '3국': 5, '4국': 14, '5국': 8 } },
  { month: '5월', totalMissions: 40, departments: { '1국': 7, '2국': 9, '3국': 4, '4국': 13, '5국': 7 } }
];

// 팀사역 방법별 통계
export const methodStats = {
  만남: { count: 15, percentage: 37.5 },
  통화: { count: 12, percentage: 30.0 },
  카카오톡: { count: 8, percentage: 20.0 },
  기타: { count: 5, percentage: 12.5 }
};

// 최근 팀사역 활동 데이터
export const recentTeamMissions = [
  {
    id: 1,
    date: '2024-01-25',
    member: '최수진',
    department: '2국',
    group: '박준호 그룹',
    team: '최수진 순',
    role: '부그룹장',
    method: '만남',
    target: '김지훈',
    content: '최근 직장 스트레스로 인한 고민 상담 및 기도'
  },
  {
    id: 2,
    date: '2024-01-24',
    member: '윤미라',
    department: '4국',
    group: '강동현 그룹',
    team: '윤미라 순',
    role: '부그룹장',
    method: '통화',
    target: '이준석',
    content: '가족 문제로 인한 어려움 공유 및 격려'
  },
  {
    id: 3,
    date: '2024-01-23',
    member: '임하나',
    department: '5국',
    group: '송태민 그룹',
    team: '임하나 순',
    role: '부그룹장',
    method: '카카오톡',
    target: '박지원',
    content: '시험 준비로 인한 스트레스 해소 및 격려'
  },
  {
    id: 4,
    date: '2024-01-22',
    member: '최수진',
    department: '2국',
    group: '박준호 그룹',
    team: '최수진 순',
    role: '순장',
    method: '만남',
    target: '이미영',
    content: '건강 문제로 인한 걱정 상담 및 기도'
  },
  {
    id: 5,
    date: '2024-01-21',
    member: '윤미라',
    department: '4국',
    group: '강동현 그룹',
    team: '윤미라 순',
    role: '순장',
    method: '통화',
    target: '최유진',
    content: '취업 준비로 인한 고민 상담 및 격려'
  }
];

// 팀사역 성과 지표
export const performanceMetrics = {
  totalVisitations: 40,
  thisMonth: 12,
  thisWeek: 5,
  today: 1,
  averagePerMember: 2.0,
  topPerformer: { name: '최수진', count: 3 },
  mostActiveDepartment: { name: '4국', count: 13 },
  participationRate: 85.0
};

// 팀사역 키워드 분석
export const keywordAnalysis = {
  thisMonth: [
    { keyword: '스트레스', count: 8, trend: 'up' },
    { keyword: '기도', count: 6, trend: 'stable' },
    { keyword: '가족', count: 4, trend: 'up' },
    { keyword: '건강', count: 3, trend: 'down' },
    { keyword: '취업', count: 3, trend: 'stable' }
  ],
  thisWeek: [
    { keyword: '고민', count: 3, trend: 'up' },
    { keyword: '격려', count: 2, trend: 'stable' },
    { keyword: '상담', count: 2, trend: 'up' }
  ]
};

// 팀사역 효과성 분석
export const effectivenessAnalysis = {
  followUpRate: 75.0, // 후속 조치율
  satisfactionScore: 4.2, // 만족도 (5점 만점)
  improvementAreas: [
    '정기적인 후속 관리',
    '다양한 심방 방법 활용',
    '개인별 맞춤 상담'
  ],
  recommendations: [
    '월 1회 정기 심방 일정 수립',
    '심방 방법 다양화 (화상, 문자 등)',
    '심방 내용 기록 및 분석 강화'
  ]
};

// 팀사역 목표 및 달성률
export const goalAchievement = {
  monthlyGoal: 50,
  currentAchievement: 40,
  achievementRate: 80.0,
  remainingDays: 6,
  projectedAchievement: 48,
  departmentGoals: [
    { department: '1국', goal: 10, current: 7, rate: 70.0 },
    { department: '2국', goal: 12, current: 9, rate: 75.0 },
    { department: '3국', goal: 8, current: 4, rate: 50.0 },
    { department: '4국', goal: 15, current: 13, rate: 86.7 },
    { department: '5국', goal: 10, current: 7, rate: 70.0 }
  ]
};

export default {
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
};




