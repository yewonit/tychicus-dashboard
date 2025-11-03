// 출석 데이터 CSV 내보내기 유틸리티
import { attendanceData, recentActivities, monthlyTrends } from './attendanceData.js';

// CSV 헤더 생성
const createCSVHeader = (data) => {
  if (data.length === 0) return '';
  return Object.keys(data[0]).join(',') + '\n';
};

// CSV 행 생성
const createCSVRow = (obj) => {
  return Object.values(obj).map(value => {
    // 값에 쉼표가 있으면 따옴표로 감싸기
    if (typeof value === 'string' && value.includes(',')) {
      return `"${value}"`;
    }
    return value;
  }).join(',');
};

// 구성원 데이터를 CSV로 변환
export const exportMembersToCSV = () => {
  const members = attendanceData.members;
  let csv = 'ID,소속국,소속그룹,소속순,이름,직분,연락처,가입일';
  
  // CSV 헤더 추가
  csv += `이름,소속국,소속그룹,소속순,직분,연락처,가입일`;
  
  // 주차별 출석 데이터 헤더 추가
  for (let week = 1; week <= 4; week++) {
    csv += `,주${week}주_주일청년예배출석여부,주${week}주_주일청년예배출석일자,주${week}주_수요제자기도회출석여부,주${week}주_수요제자기도회출석일자,주${week}주_두란노사역자모임출석여부,주${week}주_두란노사역자모임출석일자`;
    csv += `,주${week}주_대예배출석여부,주${week}주_대예배출석일자`;
  }
  csv += '\n';
  
  // 데이터 행 추가
  members.forEach(member => {
    const row = [
      member.id,
      member.소속국,
      member.소속그룹,
      member.소속순,
      member.이름,
      member.직분,
      member.연락처,
      member.가입일
    ];
    
    // 주차별 출석 데이터 추가
    for (let week = 1; week <= 4; week++) {
      const weekKey = `주${week}주`;
      csv += `,${member[`${weekKey}_주일청년예배출석여부`] || ''},${member[`${weekKey}_주일청년예배출석일자`] || ''}`;
      csv += `,${member[`${weekKey}_수요제자기도회출석여부`] || ''},${member[`${weekKey}_수요제자기도회출석일자`] || ''}`;
      csv += `,${member[`${weekKey}_두란노사역자모임출석여부`] || ''},${member[`${weekKey}_두란노사역자모임출석일자`] || ''}`;
      csv += `,${member[`${weekKey}_대예배출석여부`] || ''},${member[`${weekKey}_대예배출석일자`] || ''}`;
    }
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// 통계 데이터를 CSV로 변환
export const exportStatsToCSV = () => {
  let csv = '구분,총인원,출석,결석,지각,출석률,그룹수,순수\n';
  
  // 전체 통계
  const overall = attendanceData.overallStats;
  csv += `전체,${overall.totalMembers},${overall.totalPresent},${overall.totalAbsent},${overall.totalLate},${overall.attendanceRate}%,,,\n`;
  
  // 국별 통계
  Object.keys(attendanceData.gukStats).forEach(guk => {
    const stats = attendanceData.gukStats[guk];
    csv += `${guk},${stats.totalMembers},${stats.totalPresent},${stats.totalAbsent},${stats.totalLate},${stats.attendanceRate}%,${stats.groups},${stats.teams}\n`;
  });
  
  return csv;
};

// 활동 데이터를 CSV로 변환
export const exportActivitiesToCSV = () => {
  let csv = 'ID,활동유형,구성원,그룹,순,날짜,시간\n';
  
  recentActivities.forEach(activity => {
    csv += `${activity.id},${activity.type},${activity.member},${activity.group},${activity.team},${activity.date},${activity.time}\n`;
  });
  
  return csv;
};

// 월별 트렌드를 CSV로 변환
export const exportTrendsToCSV = () => {
  let csv = '월,출석률,구성원수\n';
  
  monthlyTrends.forEach(trend => {
    csv += `${trend.month},${trend.출석}%,${trend.members}\n`;
  });
  
  return csv;
};

// 모든 데이터를 하나의 파일로 내보내기
export const exportAllData = () => {
  const membersCSV = exportMembersToCSV();
  const statsCSV = exportStatsToCSV();
  const activitiesCSV = exportActivitiesToCSV();
  const trendsCSV = exportTrendsToCSV();
  
  return {
    members: membersCSV,
    stats: statsCSV,
    activities: activitiesCSV,
    trends: trendsCSV
  };
};

// CSV 파일 다운로드 함수 (브라우저 환경에서 사용)
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 데이터 샘플 출력
console.log('=== CSV 내보내기 샘플 ===');

const allData = exportAllData();

console.log('\n📊 구성원 데이터 (처음 3행):');
console.log(allData.members.split('\n').slice(0, 4).join('\n'));

console.log('\n📈 통계 데이터:');
console.log(allData.stats);

console.log('\n📅 활동 데이터 (처음 3행):');
console.log(allData.activities.split('\n').slice(0, 4).join('\n'));

console.log('\n📊 월별 트렌드:');
console.log(allData.trends); 