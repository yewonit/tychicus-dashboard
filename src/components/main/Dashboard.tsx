import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AttendanceChart from './AttendanceChart';

// 더미 데이터 임포트 (나중에 실제 데이터로 교체)
const attendanceData = {
  overallStats: {
    totalMembers: 250,
    totalPresent: 180,
    attendanceRate: 72,
  },
  gukStats: {
    '1국': { totalMembers: 50, totalPresent: 38, attendanceRate: 76 },
    '2국': { totalMembers: 45, totalPresent: 32, attendanceRate: 71 },
    '3국': { totalMembers: 55, totalPresent: 40, attendanceRate: 73 },
  },
  members: [],
};

const attendanceData2025 = {
  organizationStats: {
    guk: {
      '1국': { totalMembers: 50 },
      '2국': { totalMembers: 45 },
      '3국': { totalMembers: 55 },
    },
  },
  weeklyData: [
    {
      month: 7,
      attendance: {
        guk: { '1국': { 주일청년예배: { present: 38, total: 50 } } },
      },
    },
  ],
};

const newQuickStatsData = {
  thisWeekNewFamily: 5,
};

const weekOverWeekData = {
  growth: {
    totalNewFamily: 2,
  },
};

const recentActivities = [
  {
    id: 1,
    member: '김민수',
    type: '심방',
    group: '1국 김철수 그룹',
    date: '2025-01-15',
    time: '14:00',
  },
  {
    id: 2,
    member: '이영희',
    type: '지역모임',
    group: '2국 박영수 그룹',
    date: '2025-01-14',
    time: '19:00',
  },
];

const Dashboard: React.FC = () => {
  const [selectedGuk, setSelectedGuk] = useState('전체');
  const [selectedGroup, setSelectedGroup] = useState('전체');
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);
  const [attendancePopupData, setAttendancePopupData] = useState<{
    title: string;
    data: any[];
  }>({
    title: '',
    data: [],
  });

  // 국 목록 생성
  const guks = ['전체', ...Object.keys(attendanceData?.gukStats || {})];

  // 선택된 국에 따른 그룹 목록
  const availableGroups = useMemo(() => {
    if (selectedGuk === '전체') {
      return ['전체'];
    }
    return ['전체', '김철수', '박영수', '이민호'];
  }, [selectedGuk]);

  // 2025년 주일 청년예배 주차별 출석 트렌드 데이터
  const weeklyAttendanceTrends = useMemo(() => {
    const sampleData = [];
    for (let i = 1; i <= 8; i++) {
      sampleData.push({
        week: `W${i}`,
        month: '8월',
        weekLabel: `8월 W${i}`,
        출석: Math.floor(Math.random() * 50) + 150,
      });
    }
    return sampleData;
  }, []);

  // 연속 결석 통계 데이터
  const consecutiveAbsenceStats = {
    sunday: {
      consecutive4Weeks: 5,
      consecutive3Weeks: 8,
      consecutive2Weeks: 12,
      members: {
        consecutive4Weeks: [
          { name: '김철수', role: '순장', team: '1순', consecutiveWeeks: 4 },
          { name: '이영희', role: null, team: '2순', consecutiveWeeks: 4 },
        ],
        consecutive3Weeks: [
          { name: '박민수', role: '부순장', team: '3순', consecutiveWeeks: 3 },
        ],
        consecutive2Weeks: [
          { name: '최영수', role: null, team: '4순', consecutiveWeeks: 2 },
        ],
      },
    },
  };

  // 연속 출석 통계 데이터
  const consecutiveStats = {
    wednesday: {
      consecutive4Weeks: 15,
      consecutive3Weeks: 22,
      consecutive2Weeks: 35,
    },
    friday: {
      consecutive4Weeks: 12,
      consecutive3Weeks: 18,
      consecutive2Weeks: 28,
    },
    special: {
      consecutive4Weeks: 20,
      consecutive3Weeks: 30,
      consecutive2Weeks: 45,
    },
  };

  // 연속 출석 인원 데이터 계산
  const getConsecutiveAttendanceMembers = (_type: string) => {
    const sampleData = [
      { name: '김민수', team: '1순', role: '순장', consecutiveWeeks: 4 },
      { name: '이영희', team: '2순', role: null, consecutiveWeeks: 3 },
      { name: '박철수', team: '3순', role: '부순장', consecutiveWeeks: 2 },
    ];
    return sampleData;
  };

  // 팝업창 열기 함수
  const openAttendancePopup = (type: string, title: string) => {
    const data = getConsecutiveAttendanceMembers(type);
    setAttendancePopupData({
      title: title,
      data: data,
    });
    setShowAttendancePopup(true);
  };

  return (
    <>
      <div className='dashboard-container'>
        <div className='dashboard-header'>
          <h1>청년회 대시보드</h1>
          <p>코람데오 청년회 현황을 한눈에 확인하세요</p>
        </div>

        <div className='dashboard-filter-section'>
          <div className='filter-group'>
            <label className='filter-label'>국 선택:</label>
            <select
              className='filter-select'
              value={selectedGuk}
              onChange={e => {
                setSelectedGuk(e.target.value);
                setSelectedGroup('전체');
              }}
            >
              {guks.map(guk => (
                <option key={guk} value={guk}>
                  {guk}
                </option>
              ))}
            </select>
          </div>

          <div className='filter-group'>
            <label className='filter-label'>그룹 선택:</label>
            <select
              className='filter-select'
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              {availableGroups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='quick-stats-grid'>
          <div className='quick-stat-card'>
            <div className='quick-stat-label'>전체 구성원 수</div>
            <div className='quick-stat-value'>
              {Object.values(attendanceData2025.organizationStats.guk).reduce(
                (sum, guk) => sum + guk.totalMembers,
                0
              )}
            </div>
            <div className='quick-stat-growth positive'>
              <span className='growth-icon'>↗</span>
              전주 대비 +0명
            </div>
          </div>

          <div className='quick-stat-card'>
            <div className='quick-stat-label'>이번주 출석 수</div>
            <div className='quick-stat-value'>180</div>
            <div className='quick-stat-growth positive'>
              <span className='growth-icon'>↗</span>
              전주 대비 +5명
            </div>
          </div>

          <div className='quick-stat-card'>
            <div className='quick-stat-label'>이번주 새가족</div>
            <div className='quick-stat-value'>
              {newQuickStatsData.thisWeekNewFamily}
            </div>
            <div className='quick-stat-growth positive'>
              <span className='growth-icon'>↗</span>
              전주 대비 +{weekOverWeekData.growth.totalNewFamily}명
            </div>
          </div>

          <div className='quick-stat-card'>
            <div className='quick-stat-label'>전체 출석률</div>
            <div className='quick-stat-value'>72%</div>
            <div className='quick-stat-growth positive'>
              <span className='growth-icon'>↗</span>
              전주 대비 +2%
            </div>
          </div>

          <div className='quick-stat-card'>
            <div className='quick-stat-label'>활성인원 출석률</div>
            <div className='quick-stat-value'>85%</div>
            <div className='quick-stat-growth positive'>
              <span className='growth-icon'>↗</span>
              전주 대비 +3%
            </div>
          </div>
        </div>

        {/* AttendanceChart 섹션 */}
        <AttendanceChart
          attendanceData2025={attendanceData2025}
          selectedGuk={selectedGuk}
          selectedGroup={selectedGroup}
          chartType={
            selectedGuk === '전체'
              ? 'guk'
              : selectedGroup === '전체'
                ? 'group'
                : 'sun'
          }
        />

        {/* 연속 결석자 정보 섹션 */}
        <div className='consecutive-absence-section'>
          <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
          <div className='absence-grid'>
            <div className='absence-card high-severity'>
              <h4 className='absence-title'>🚨 4주 연속 결석자</h4>
              <div className='absence-stats'>
                <div className='absence-stat-value high-severity'>
                  {consecutiveAbsenceStats?.sunday?.consecutive4Weeks || 0}명
                </div>
              </div>
              <div className='absence-list'>
                {(
                  consecutiveAbsenceStats?.sunday?.members?.consecutive4Weeks ||
                  []
                )
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={index} className='absence-item'>
                      <div className='absence-member-info'>
                        <span className='absence-member-name'>
                          {member.name}
                        </span>
                        {member.role && (
                          <span className='absence-member-role'>
                            {member.role}
                          </span>
                        )}
                        <span className='absence-team-name'>{member.team}</span>
                      </div>
                      <span className='absence-badge high-severity'>
                        {member.consecutiveWeeks}주 연속
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className='absence-card medium-severity'>
              <h4 className='absence-title'>⚠️ 3주 연속 결석자</h4>
              <div className='absence-stats'>
                <div className='absence-stat-value medium-severity'>
                  {consecutiveAbsenceStats?.sunday?.consecutive3Weeks || 0}명
                </div>
              </div>
              <div className='absence-list'>
                {(
                  consecutiveAbsenceStats?.sunday?.members?.consecutive3Weeks ||
                  []
                )
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={index} className='absence-item'>
                      <div className='absence-member-info'>
                        <span className='absence-member-name'>
                          {member.name}
                        </span>
                        {member.role && (
                          <span className='absence-member-role'>
                            {member.role}
                          </span>
                        )}
                        <span className='absence-team-name'>{member.team}</span>
                      </div>
                      <span className='absence-badge medium-severity'>
                        {member.consecutiveWeeks}주 연속
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className='absence-card low-severity'>
              <h4 className='absence-title'>🔄 2주 연속 결석자</h4>
              <div className='absence-stats'>
                <div className='absence-stat-value low-severity'>
                  {consecutiveAbsenceStats?.sunday?.consecutive2Weeks || 0}명
                </div>
              </div>
              <div className='absence-list'>
                {(
                  consecutiveAbsenceStats?.sunday?.members?.consecutive2Weeks ||
                  []
                )
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={index} className='absence-item'>
                      <div className='absence-member-info'>
                        <span className='absence-member-name'>
                          {member.name}
                        </span>
                        {member.role && (
                          <span className='absence-member-role'>
                            {member.role}
                          </span>
                        )}
                        <span className='absence-team-name'>{member.team}</span>
                      </div>
                      <span className='absence-badge low-severity'>
                        {member.consecutiveWeeks}주 연속
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 연속 출석 통계 섹션 */}
        <div className='consecutive-attendance-section'>
          <h3 className='chart-title'>최근 4주 연속 출석 현황</h3>
          <div className='consecutive-grid'>
            <div className='consecutive-card'>
              <h4 className='consecutive-title'>🙏 수요제자기도회</h4>
              <div className='consecutive-stats'>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.wednesday.consecutive4Weeks}
                  </div>
                  <div className='consecutive-stat-label'>4주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.wednesday.consecutive3Weeks}
                  </div>
                  <div className='consecutive-stat-label'>3주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.wednesday.consecutive2Weeks}
                  </div>
                  <div className='consecutive-stat-label'>2주 연속</div>
                </div>
              </div>
              {selectedGuk !== '전체' && (
                <button
                  className='view-button'
                  onClick={() =>
                    openAttendancePopup(
                      'wednesday',
                      '수요제자기도회 4주간 연속 출석 인원'
                    )
                  }
                >
                  출석인원 확인
                </button>
              )}
            </div>

            <div className='consecutive-card'>
              <h4 className='consecutive-title'>⛪ 두란노사역자모임</h4>
              <div className='consecutive-stats'>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.friday.consecutive4Weeks}
                  </div>
                  <div className='consecutive-stat-label'>4주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.friday.consecutive3Weeks}
                  </div>
                  <div className='consecutive-stat-label'>3주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.friday.consecutive2Weeks}
                  </div>
                  <div className='consecutive-stat-label'>2주 연속</div>
                </div>
              </div>
              {selectedGuk !== '전체' && (
                <button
                  className='view-button'
                  onClick={() =>
                    openAttendancePopup(
                      'friday',
                      '두란노사역자모임 4주간 연속 출석 인원'
                    )
                  }
                >
                  출석인원 확인
                </button>
              )}
            </div>

            <div className='consecutive-card'>
              <h4 className='consecutive-title'>🎯 대예배</h4>
              <div className='consecutive-stats'>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.special.consecutive4Weeks}
                  </div>
                  <div className='consecutive-stat-label'>4주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.special.consecutive3Weeks}
                  </div>
                  <div className='consecutive-stat-label'>3주 연속</div>
                </div>
                <div className='consecutive-stat'>
                  <div className='consecutive-stat-value'>
                    {consecutiveStats.special.consecutive2Weeks}
                  </div>
                  <div className='consecutive-stat-label'>2주 연속</div>
                </div>
              </div>
              {selectedGuk !== '전체' && (
                <button
                  className='view-button'
                  onClick={() =>
                    openAttendancePopup(
                      'special',
                      '대예배 4주간 연속 출석 인원'
                    )
                  }
                >
                  출석인원 확인
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 차트 섹션 */}
        <div className='charts-grid'>
          <div className='chart-card'>
            <h3 className='chart-title'>주차별 청년예배 출석 트렌드</h3>
            <ResponsiveContainer width='100%' height={350}>
              <LineChart
                data={weeklyAttendanceTrends}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
                <XAxis
                  dataKey='weekLabel'
                  stroke='#6B7280'
                  interval={0}
                  tick={{ fontSize: 11, textAnchor: 'end' }}
                  height={70}
                  angle={-45}
                />
                <YAxis stroke='#6B7280' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelFormatter={value => `주차: ${value}`}
                  formatter={(value, _name) => [`${value}명`, '출석 인원']}
                />
                <Line
                  type='monotone'
                  dataKey='출석'
                  stroke='#26428B'
                  strokeWidth={3}
                  dot={{ fill: '#26428B', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#26428B', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 최근 활동 섹션 */}
        <div className='activities-section'>
          <h3 className='chart-title'>최근 활동 (심방, 지역모임)</h3>
          {recentActivities.slice(0, 10).map(activity => (
            <div key={activity.id} className='activity-item'>
              <div
                className='activity-icon'
                style={{
                  backgroundColor:
                    activity.type === '심방' ? '#E3AF64' : '#26428B',
                }}
              >
                {activity.type === '심방' ? '🏠' : '📍'}
              </div>
              <div className='activity-content'>
                <div className='activity-title'>
                  {activity.member} - {activity.type}
                </div>
                <div className='activity-subtitle'>{activity.group}</div>
              </div>
              <div className='activity-time'>
                {activity.date}
                <br />
                {activity.time}
              </div>
            </div>
          ))}
        </div>

        {/* 출석 인원 팝업창 */}
        {showAttendancePopup && (
          <div
            className='popup-overlay'
            onClick={() => setShowAttendancePopup(false)}
          >
            <div className='popup-container' onClick={e => e.stopPropagation()}>
              <div className='popup-header'>
                <h3 className='popup-title'>{attendancePopupData.title}</h3>
                <button
                  className='close-button'
                  onClick={() => setShowAttendancePopup(false)}
                >
                  ×
                </button>
              </div>
              <div className='popup-content'>
                <div className='attendance-list'>
                  {attendancePopupData.data.length > 0 ? (
                    attendancePopupData.data.map(
                      (member: any, index: number) => (
                        <div key={index} className='attendance-item'>
                          <div className='member-info'>
                            <span className='member-name'>{member.name}</span>
                            {member.role && (
                              <span className='member-role'>{member.role}</span>
                            )}
                            <span className='team-name'>{member.team}</span>
                          </div>
                          <span className='consecutive-badge'>
                            {member.consecutiveWeeks}주 연속
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      연속 출석한 인원이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
