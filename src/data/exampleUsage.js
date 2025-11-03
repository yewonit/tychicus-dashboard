

// 출석 데이터 사용 예시
import { attendanceData, recentActivities, monthlyTrends } from './attendanceData.js';
import { exportMembersToCSV, exportStatsToCSV } from './exportAttendanceData.js';

// 1. 전체 구성원 수 조회
console.log('=== 전체 구성원 현황 ===');
console.log(`총 구성원: ${attendanceData.overallStats.totalMembers}명`);
console.log(`출석률: ${attendanceData.overallStats.attendanceRate}%`);

// 2. 국별 통계 조회
console.log('\n=== 국별 통계 ===');
Object.keys(attendanceData.gukStats).forEach(guk => {
  const stats = attendanceData.gukStats[guk];
  console.log(`${guk}: ${stats.totalMembers}명, 출석률 ${stats.attendanceRate}%`);
});

// 3. 특정 순의 구성원 조회
console.log('\n=== 첫 번째 순의 구성원 ===');
const firstTeam = attendanceData.members[0]?.소속순 || '김민수 순';
const teamMembers = attendanceData.members.filter(member => 
  member.소속순 === firstTeam
);
teamMembers.forEach(member => {
  console.log(`- ${member.이름} (${member.직분})`);
});

// 4. 직분별 구성원 수 조회
console.log('\n=== 직분별 구성원 수 ===');
const positionCounts = {};
attendanceData.members.forEach(member => {
  positionCounts[member.직분] = (positionCounts[member.직분] || 0) + 1;
});
Object.keys(positionCounts).forEach(position => {
  console.log(`${position}: ${positionCounts[position]}명`);
});

// 5. 최근 주 출석 현황 (주1주)
console.log('\n=== 최근 주 출석 현황 (주1주) ===');
  // 최근 주 출석자 수 계산
  const recentWeek = '주1주';
  const sundayAttendance = attendanceData.members.filter(m => 
    m[`${recentWeek}_주일청년예배출석여부`] === '출석'
  ).length;
  const wednesdayAttendance = attendanceData.members.filter(m => 
    m[`${recentWeek}_수요제자기도회출석여부`] === '출석'
  ).length;
  const fridayAttendance = attendanceData.members.filter(m => 
    m[`${recentWeek}_두란노사역자모임출석여부`] === '출석'
  ).length;
  const specialAttendance = attendanceData.members.filter(m => 
    m[`${recentWeek}_대예배출석여부`] === '출석'
  ).length;

  console.log(`주일청년예배: ${sundayAttendance}명`);
  console.log(`수요제자기도회: ${wednesdayAttendance}명`);
  console.log(`두란노사역자모임: ${fridayAttendance}명`);
  console.log(`대예배: ${specialAttendance}명`);

  // 결석자 목록
  const absentMembers = attendanceData.members.filter(member => 
    member[`${recentWeek}_주일청년예배출석여부`] === '결석' ||
    member[`${recentWeek}_수요제자기도회출석여부`] === '결석' ||
    member[`${recentWeek}_두란노사역자모임출석여부`] === '결석' ||
    member[`${recentWeek}_대예배출석여부`] === '결석'
  );

  console.log('\n=== 결석자 목록 ===');
  absentMembers.forEach(member => {
    const absences = [];
    if (member[`${recentWeek}_주일청년예배출석여부`] === '결석') absences.push('주일청년예배');
    if (member[`${recentWeek}_수요제자기도회출석여부`] === '결석') absences.push('수요제자기도회');
    if (member[`${recentWeek}_두란노사역자모임출석여부`] === '결석') absences.push('두란노사역자모임');
    if (member[`${recentWeek}_대예배출석여부`] === '결석') absences.push('대예배');
    
    console.log(`${member.이름} (${member.소속국}): ${absences.join(', ')}`);
  });

// 7. 순장과 EBS 조회
console.log('\n=== 순장과 EBS 목록 ===');
const leaders = attendanceData.members.filter(member => 
  member.직분 === '순장' || member.직분 === 'EBS'
);
leaders.forEach(leader => {
  console.log(`- ${leader.이름} (${leader.소속순}, ${leader.직분})`);
});

// 8. 새가족 조회 (가입일이 최근인 구성원)
console.log('\n=== 최근 가입한 새가족 ===');
const recentMembers = attendanceData.members
  .filter(member => {
    const joinDate = new Date(member.가입일);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return joinDate > threeMonthsAgo;
  })
  .sort((a, b) => new Date(b.가입일) - new Date(a.가입일));

recentMembers.slice(0, 5).forEach(member => {
  console.log(`- ${member.이름} (${member.소속순}, 가입일: ${member.가입일})`);
});

// 9. 출석률이 높은 순 상위 5개 순
console.log('\n=== 출석률 상위 5개 순 ===');
const teamAttendanceRates = Object.values(attendanceData.teamStats)
  .map(team => ({
    team: `${team.teamLeader} 순`,
    rate: team.attendanceRate,
    members: team.totalMembers
  }))
  .sort((a, b) => b.rate - a.rate)
  .slice(0, 5);

teamAttendanceRates.forEach((team, index) => {
  console.log(`${index + 1}. ${team.team}: ${team.rate}% (${team.members}명)`);
});

// 10. CSV 내보내기 예시
console.log('\n=== CSV 내보내기 예시 ===');
const membersCSV = exportMembersToCSV();
const statsCSV = exportStatsToCSV();

console.log('구성원 데이터 CSV (처음 3행):');
console.log(membersCSV.split('\n').slice(0, 4).join('\n'));

console.log('\n통계 데이터 CSV:');
console.log(statsCSV);

// 11. 월별 트렌드 분석
console.log('\n=== 월별 트렌드 분석 ===');
const averageAttendance = monthlyTrends.reduce((sum, trend) => sum + trend.출석, 0) / monthlyTrends.length;
const averageMembers = monthlyTrends.reduce((sum, trend) => sum + trend.members, 0) / monthlyTrends.length;

console.log(`평균 출석률: ${averageAttendance.toFixed(1)}%`);
console.log(`평균 구성원 수: ${averageMembers.toFixed(0)}명`);

// 12. 활동 데이터 분석
console.log('\n=== 최근 활동 분석 ===');
const activityTypes = {};
recentActivities.forEach(activity => {
  activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
});

console.log('활동 유형별 빈도:');
Object.keys(activityTypes).forEach(type => {
  console.log(`${type}: ${activityTypes[type]}회`);
});

// 13. 데이터 검증
console.log('\n=== 데이터 검증 ===');
const totalMembers = attendanceData.members.length;
const uniqueNames = new Set(attendanceData.members.map(m => m.이름)).size;
const uniqueTeams = new Set(attendanceData.members.map(m => m.소속순)).size;
const uniqueGroups = new Set(attendanceData.members.map(m => m.소속그룹)).size;

console.log(`총 구성원: ${totalMembers}명`);
console.log(`고유 이름: ${uniqueNames}개`);
console.log(`고유 그룹: ${uniqueGroups}개`);
console.log(`고유 순: ${uniqueTeams}개`);
console.log(`데이터 일관성: ${totalMembers > 0 ? '정상' : '오류'}`);

// 14. 그룹장과 순장 정보 확인
console.log('\n=== 그룹장과 순장 정보 ===');
const groupLeaders = [...new Set(attendanceData.members.map(m => m.그룹장))];
const teamLeaders = [...new Set(attendanceData.members.map(m => m.순장))];

console.log(`그룹장 수: ${groupLeaders.length}명`);
console.log(`순장 수: ${teamLeaders.length}명`);
console.log(`그룹장 예시: ${groupLeaders.slice(0, 3).join(', ')}`);
console.log(`순장 예시: ${teamLeaders.slice(0, 3).join(', ')}`);

export {
  attendanceData,
  recentActivities,
  monthlyTrends
}; 