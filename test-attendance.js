// 테스트용 출석 데이터 확인
import { attendanceData } from './src/data/attendanceData.js';

console.log('=== 청년회 출석 데이터 테스트 ===');
console.log(`총 구성원 수: ${attendanceData.members.length}명`);

// 첫 번째 구성원의 출석 정보 확인
const firstMember = attendanceData.members[0];
if (firstMember) {
  console.log(`\n첫 번째 구성원: ${firstMember.이름} (${firstMember.소속국}, ${firstMember.소속그룹}, ${firstMember.소속순})`);
  console.log(`  주1주: 주일청년예배 ${firstMember.주1주_주일청년예배출석여부}, 수요제자기도회 ${firstMember.주1주_수요제자기도회출석여부}, 두란노사역자모임 ${firstMember.주1주_두란노사역자모임출석여부}, 대예배 ${firstMember.주1주_대예배출석여부}`);
}

// 국별 통계 확인
console.log('\n=== 국별 통계 ===');
Object.entries(attendanceData.gukStats).forEach(([guk, stats]) => {
  console.log(`${guk}: 총 ${stats.totalMembers}명, 출석률 ${stats.attendanceRate}%`);
});

// 전체 통계 확인
console.log('\n=== 전체 통계 ===');
console.log(`전체 구성원: ${attendanceData.overallStats.totalMembers}명`);
console.log(`전체 출석률: ${attendanceData.overallStats.attendanceRate}%`);
console.log(`출석: ${attendanceData.overallStats.totalPresent}명`);
console.log(`결석: ${attendanceData.overallStats.totalAbsent}명`);
console.log(`지각: ${attendanceData.overallStats.totalLate}명`); 