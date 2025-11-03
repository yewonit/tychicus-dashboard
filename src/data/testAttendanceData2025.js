// 2025년 출석 데이터 테스트 및 사용 예시
import attendanceData2025 from './attendanceData2025';

// 데이터 구조 확인
console.log('=== 2025년 출석 데이터 구조 ===');
console.log('전체 주차 수:', attendanceData2025.weeklyData.length);
console.log('월별 요약 데이터:', Object.keys(attendanceData2025.monthlySummary));
console.log('조직별 통계:', Object.keys(attendanceData2025.organizationStats));

// 1월 1주차 데이터 확인
console.log('\n=== 1월 1주차 데이터 ===');
const firstWeek = attendanceData2025.weeklyData[0];
console.log('날짜:', {
  일요일: firstWeek.dates.sunday.toLocaleDateString('ko-KR'),
  수요일: firstWeek.dates.wednesday.toLocaleDateString('ko-KR'),
  금요일: firstWeek.dates.friday.toLocaleDateString('ko-KR')
});

// 1국 주일청년예배 데이터
console.log('1국 주일청년예배:', firstWeek.attendance.guk['1국']['주일청년예배']);

// 월별 요약 데이터 확인
console.log('\n=== 1월 요약 데이터 ===');
const januarySummary = attendanceData2025.monthlySummary[1];
console.log('1월 1국 출석률:', {
  '주일청년예배': januarySummary.guk['1국']['주일청년예배'].rate.toFixed(1) + '%',
  '수요제자기도회': januarySummary.guk['1국']['수요제자기도회'].rate.toFixed(1) + '%',
  '두란노사역자모임': januarySummary.guk['1국']['두란노사역자모임'].rate.toFixed(1) + '%',
  '대예배': januarySummary.guk['1국']['대예배'].rate.toFixed(1) + '%'
});

// 조직별 평균 출석률 확인
console.log('\n=== 조직별 평균 출석률 ===');
Object.keys(attendanceData2025.organizationStats.guk).forEach(gukName => {
  const stats = attendanceData2025.organizationStats.guk[gukName];
  console.log(`${gukName} (총 ${stats.totalMembers}명):`, {
    '주일청년예배': stats.averageAttendance['주일청년예배'].toFixed(1) + '%',
    '수요제자기도회': stats.averageAttendance['수요제자기도회'].toFixed(1) + '%',
    '두란노사역자모임': stats.averageAttendance['두란노사역자모임'].toFixed(1) + '%',
    '대예배': stats.averageAttendance['대예배'].toFixed(1) + '%'
  });
});

// 차트 데이터 생성 함수 예시
export const getChartData = (organizationType, worshipType) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8];
  const labels = months.map(m => `${m}월`);
  
  const datasets = [];
  
  if (organizationType === 'guk') {
    Object.keys(attendanceData2025.organizationStats.guk).forEach(gukName => {
      const data = months.map(month => 
        attendanceData2025.monthlySummary[month]?.guk[gukName]?.[worshipType]?.rate || 0
      );
      
      datasets.push({
        label: gukName,
        data: data,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 2
      });
    });
  } else if (organizationType === 'group') {
    Object.keys(attendanceData2025.organizationStats.group).forEach(groupName => {
      const data = months.map(month => 
        attendanceData2025.monthlySummary[month]?.group[groupName]?.[worshipType]?.rate || 0
      );
      
      datasets.push({
        label: groupName,
        data: data,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 2
      });
    });
  } else if (organizationType === 'sun') {
    Object.keys(attendanceData2025.organizationStats.sun).forEach(sunName => {
      const data = months.map(month => 
        attendanceData2025.monthlySummary[month]?.sun[sunName]?.[worshipType]?.rate || 0
      );
      
      datasets.push({
        label: sunName,
        data: data,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 2
      });
    });
  }
  
  return {
    labels,
    datasets
  };
};

// 랜덤 색상 생성 함수
const getRandomColor = () => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 특정 조직의 특정 예배 출석률 추이 데이터
export const getAttendanceTrend = (organizationType, organizationName, worshipType) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8];
  const labels = months.map(m => `${m}월`);
  
  const data = months.map(month => {
    if (organizationType === 'guk') {
      return attendanceData2025.monthlySummary[month]?.guk[organizationName]?.[worshipType]?.rate || 0;
    } else if (organizationType === 'group') {
      return attendanceData2025.monthlySummary[month]?.group[organizationName]?.[worshipType]?.rate || 0;
    } else if (organizationType === 'sun') {
      return attendanceData2025.monthlySummary[month]?.sun[organizationName]?.[worshipType]?.rate || 0;
    }
    return 0;
  });
  
  return {
    labels,
    datasets: [{
      label: `${organizationName} ${worshipType} 출석률`,
      data: data,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 3,
      fill: false,
      tension: 0.1
    }]
  };
};

// 월별 비교 데이터 (국별)
export const getMonthlyComparison = (month, worshipType) => {
  const labels = Object.keys(attendanceData2025.organizationStats.guk);
  const data = labels.map(gukName => 
    attendanceData2025.monthlySummary[month]?.guk[gukName]?.[worshipType]?.rate || 0
  );
  
  return {
    labels,
    datasets: [{
      label: `${month}월 ${worshipType} 출석률`,
      data: data,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2
    }]
  };
};

// 사용 예시 출력
console.log('\n=== 차트 데이터 생성 예시 ===');
console.log('국별 주일청년예배 월별 출석률:', getChartData('guk', '주일청년예배'));
console.log('1국 주일청년예배 출석률 추이:', getAttendanceTrend('guk', '1국', '주일청년예배'));
console.log('1월 국별 주일청년예배 비교:', getMonthlyComparison(1, '주일청년예배'));

export default attendanceData2025;


