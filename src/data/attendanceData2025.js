// 2025년 1월부터 8월까지의 국, 그룹, 순 조직별 예배 출석 가상 데이터

// 2025년 1월부터 8월까지의 주차별 날짜 계산
const getWeekDates = () => {
  const dates = [];
  const startDate = new Date(2025, 0, 1); // 2025년 1월 1일
  
  for (let month = 0; month < 8; month++) { // 1월부터 8월까지
    const currentMonth = new Date(2025, month, 1);
    const lastDay = new Date(2025, month + 1, 0);
    
    // 해당 월의 첫 번째 일요일 찾기
    let firstSunday = new Date(currentMonth);
    while (firstSunday.getDay() !== 0) {
      firstSunday.setDate(firstSunday.getDate() + 1);
    }
    
    // 해당 월의 모든 일요일 찾기
    let currentSunday = new Date(firstSunday);
    let weekCount = 1;
    
    while (currentSunday.getMonth() === month) {
      // 수요일 (수요제자기도회)
      const wednesday = new Date(currentSunday);
      wednesday.setDate(currentSunday.getDate() - 4);
      
      // 금요일 (두란노사역자모임)
      const friday = new Date(currentSunday);
      friday.setDate(currentSunday.getDate() - 2);
      
      dates.push({
        month,
        week: weekCount,
        sunday: new Date(currentSunday),
        wednesday: new Date(wednesday),
        friday: new Date(friday)
      });
      
      currentSunday.setDate(currentSunday.getDate() + 7);
      weekCount++;
    }
  }
  
  return dates;
};

// 국별 기본 인원 수
const gukBaseMembers = {
  '1국': 25,
  '2국': 28,
  '3국': 22,
  '4국': 30,
  '5국': 26
};

// 그룹별 기본 인원 수 (그룹장 이름 기반) - 각 국당 최대 8개 그룹
const groupBaseMembers = {
  // 1국 그룹들 (최대 8개)
  '김민수 그룹': 8,
  '이지은 그룹': 9,
  '박준호 그룹': 7,
  '최수진 그룹': 10,
  '정현우 그룹': 8,
  '한소영 그룹': 9,
  '강동현 그룹': 7,
  '윤미라 그룹': 8,
  
  // 2국 그룹들 (최대 8개)
  '송태민 그룹': 6,
  '임하나 그룹': 9,
  '김서연 그룹': 8,
  '이동욱 그룹': 7,
  '박소영 그룹': 9,
  '최민준 그룹': 8,
  '정하은 그룹': 7,
  '한지훈 그룹': 8,
  
  // 3국 그룹들 (최대 8개)
  '강유진 그룹': 9,
  '윤태호 그룹': 7,
  '송지원 그룹': 8,
  '임현수 그룹': 6,
  '김도현 그룹': 8,
  '이수빈 그룹': 7,
  '박재민 그룹': 9,
  '최예은 그룹': 8,
  
  // 4국 그룹들 (최대 8개)
  '정승우 그룹': 7,
  '한소희 그룹': 8,
  '강민석 그룹': 9,
  '윤지현 그룹': 6,
  '송현우 그룹': 8,
  '임서연 그룹': 7,
  '김태영 그룹': 9,
  '이하나 그룹': 8,
  
  // 5국 그룹들 (최대 8개)
  '박지원 그룹': 7,
  '최동현 그룹': 8,
  '정소영 그룹': 9,
  '한민수 그룹': 6,
  '강지은 그룹': 8,
  '윤준호 그룹': 7,
  '송수진 그룹': 9,
  '임현우 그룹': 8
};

// 국별 그룹 매핑 (각 국당 최대 8개 그룹)
const gukGroupMapping = {
  '1국': [
    '김민수 그룹', '이지은 그룹', '박준호 그룹', '최수진 그룹',
    '정현우 그룹', '한소영 그룹', '강동현 그룹', '윤미라 그룹'
  ],
  '2국': [
    '송태민 그룹', '임하나 그룹', '김서연 그룹', '이동욱 그룹',
    '박소영 그룹', '최민준 그룹', '정하은 그룹', '한지훈 그룹'
  ],
  '3국': [
    '강유진 그룹', '윤태호 그룹', '송지원 그룹', '임현수 그룹',
    '김도현 그룹', '이수빈 그룹', '박재민 그룹', '최예은 그룹'
  ],
  '4국': [
    '정승우 그룹', '한소희 그룹', '강민석 그룹', '윤지현 그룹',
    '송현우 그룹', '임서연 그룹', '김태영 그룹', '이하나 그룹'
  ],
  '5국': [
    '박지원 그룹', '최동현 그룹', '정소영 그룹', '한민수 그룹',
    '강지은 그룹', '윤준호 그룹', '송수진 그룹', '임현우 그룹'
  ]
};

// 그룹별 순 매핑 (각 그룹당 3-4개 순)
const groupSunMapping = {
  // 1국 그룹들의 순들
  '김민수 그룹': ['김도현 순', '이수빈 순', '박재민 순'],
  '이지은 그룹': ['최예은 순', '정승우 순', '한소희 순'],
  '박준호 그룹': ['강민석 순', '윤지현 순', '송현우 순'],
  '최수진 그룹': ['임서연 순', '김태영 순', '이하나 순'],
  '정현우 그룹': ['박지원 순', '최동현 순', '정소영 순'],
  '한소영 그룹': ['한민수 순', '강지은 순', '윤준호 순'],
  '강동현 그룹': ['송수진 순', '임현우 순', '김민수 순'],
  '윤미라 그룹': ['이지은 순', '박준호 순', '최수진 순'],
  
  // 2국 그룹들의 순들
  '송태민 그룹': ['정현우 순', '한소영 순', '강동현 순'],
  '임하나 그룹': ['윤미라 순', '송태민 순', '임하나 순'],
  '김서연 그룹': ['김도현 순', '이수빈 순', '박재민 순'],
  '이동욱 그룹': ['최예은 순', '정승우 순', '한소희 순'],
  '박소영 그룹': ['강민석 순', '윤지현 순', '송현우 순'],
  '최민준 그룹': ['임서연 순', '김태영 순', '이하나 순'],
  '정하은 그룹': ['박지원 순', '최동현 순', '정소영 순'],
  '한지훈 그룹': ['한민수 순', '강지은 순', '윤준호 순'],
  
  // 3국 그룹들의 순들
  '강유진 그룹': ['송수진 순', '임현우 순', '김민수 순'],
  '윤태호 그룹': ['이지은 순', '박준호 순', '최수진 순'],
  '송지원 그룹': ['정현우 순', '한소영 순', '강동현 순'],
  '임현수 그룹': ['윤미라 순', '송태민 순', '임하나 순'],
  '김도현 그룹': ['김도현 순', '이수빈 순', '박재민 순'],
  '이수빈 그룹': ['최예은 순', '정승우 순', '한소희 순'],
  '박재민 그룹': ['강민석 순', '윤지현 순', '송현우 순'],
  '최예은 그룹': ['임서연 순', '김태영 순', '이하나 순'],
  
  // 4국 그룹들의 순들
  '정승우 그룹': ['박지원 순', '최동현 순', '정소영 순'],
  '한소희 그룹': ['한민수 순', '강지은 순', '윤준호 순'],
  '강민석 그룹': ['송수진 순', '임현우 순', '김민수 순'],
  '윤지현 그룹': ['이지은 순', '박준호 순', '최수진 순'],
  '송현우 그룹': ['정현우 순', '한소영 순', '강동현 순'],
  '임서연 그룹': ['윤미라 순', '송태민 순', '임하나 순'],
  '김태영 그룹': ['김도현 순', '이수빈 순', '박재민 순'],
  '이하나 그룹': ['최예은 순', '정승우 순', '한소희 순'],
  
  // 5국 그룹들의 순들
  '박지원 그룹': ['강민석 순', '윤지현 순', '송현우 순'],
  '최동현 그룹': ['임서연 순', '김태영 순', '이하나 순'],
  '정소영 그룹': ['박지원 순', '최동현 순', '정소영 순'],
  '한민수 그룹': ['한민수 순', '강지은 순', '윤준호 순'],
  '강지은 그룹': ['송수진 순', '임현우 순', '김민수 순'],
  '윤준호 그룹': ['이지은 순', '박준호 순', '최수진 순'],
  '송수진 그룹': ['정현우 순', '한소영 순', '강동현 순'],
  '임현우 그룹': ['윤미라 순', '송태민 순', '임하나 순']
};

// 순별 기본 인원 수 (순장 이름 기반)
const sunBaseMembers = {
  '김도현 순': 4,
  '이수빈 순': 5,
  '박재민 순': 4,
  '최예은 순': 6,
  '정승우 순': 5,
  '한소희 순': 4,
  '강민석 순': 5,
  '윤지현 순': 4,
  '송현우 순': 5,
  '임서연 순': 4,
  '김태영 순': 5,
  '이하나 순': 4,
  '박지원 순': 6,
  '최동현 순': 5,
  '정소영 순': 4,
  '한민수 순': 5,
  '강지은 순': 4,
  '윤준호 순': 5,
  '송수진 순': 4,
  '임현우 순': 5,
  '김민수 순': 4,
  '이지은 순': 5,
  '박준호 순': 4,
  '최수진 순': 6,
  '정현우 순': 5,
  '한소영 순': 4,
  '강동현 순': 5,
  '윤미라 순': 4,
  '송태민 순': 5,
  '임하나 순': 4
};

// 출석률 변동을 위한 랜덤 함수
const getRandomAttendanceRate = (baseRate, variation = 0.15) => {
  const min = Math.max(0.1, baseRate - variation);
  const max = Math.min(1.0, baseRate + variation);
  return Math.random() * (max - min) + min;
};

// 예배별 기본 출석률
const worshipBaseRates = {
  '주일청년예배': 0.85,      // 주일 예배는 출석률이 높음
  '수요제자기도회': 0.65,    // 수요일은 중간 정도
  '두란노사역자모임': 0.45,  // 금요일은 출석률이 낮음
  '대예배': 0.80             // 대예배는 주일청년예배보다 약간 낮음
};

// 월별 출석률 변동 (계절, 시험기간 등 고려)
const monthlyVariations = {
  1: { variation: 0.05, reason: '새해 결심, 겨울방학' },
  2: { variation: 0.08, reason: '겨울방학, 설날' },
  3: { variation: 0.12, reason: '개강, 새학기' },
  4: { variation: 0.10, reason: '봄학기 중간' },
  5: { variation: 0.15, reason: '봄학기 기말고사' },
  6: { variation: 0.08, reason: '여름방학 시작' },
  7: { variation: 0.05, reason: '여름방학 중' },
  8: { variation: 0.10, reason: '여름방학 끝, 개강 준비' }
};

// 가상 출석 데이터 생성
const generateAttendanceData = () => {
  const weekDates = getWeekDates();
  const data = {
    weeklyData: [],
    monthlySummary: {},
    organizationStats: {
      guk: {},
      group: {},
      sun: {}
    }
  };

  // 주차별 데이터 생성
  weekDates.forEach(({ month, week, sunday, wednesday, friday }) => {
    const weekData = {
      month,
      week,
      dates: { sunday, wednesday, friday },
      attendance: {
        guk: {},
        group: {},
        sun: {}
      }
    };

    // 국별 데이터
    Object.keys(gukBaseMembers).forEach(gukName => {
      const baseMembers = gukBaseMembers[gukName];
      
      weekData.attendance.guk[gukName] = {
        '주일청년예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['주일청년예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '수요제자기도회': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['수요제자기도회'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '두란노사역자모임': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['두란노사역자모임'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '대예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['대예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        }
      };

      // 결석과 지각 인원 계산
      Object.keys(weekData.attendance.guk[gukName]).forEach(worshipType => {
        const worship = weekData.attendance.guk[gukName][worshipType];
        worship.absent = worship.total - worship.present;
        worship.late = Math.round(worship.present * 0.1); // 출석자의 10%가 지각
        worship.present -= worship.late; // 지각자를 출석에서 제외
      });
    });

    // 그룹별 데이터
    Object.keys(groupBaseMembers).forEach(groupName => {
      const baseMembers = groupBaseMembers[groupName];
      
      weekData.attendance.group[groupName] = {
        '주일청년예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['주일청년예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '수요제자기도회': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['수요제자기도회'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '두란노사역자모임': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['두란노사역자모임'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '대예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['대예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        }
      };

      // 결석과 지각 인원 계산
      Object.keys(weekData.attendance.group[groupName]).forEach(worshipType => {
        const worship = weekData.attendance.group[groupName][worshipType];
        worship.absent = worship.total - worship.present;
        worship.late = Math.round(worship.present * 0.1);
        worship.present -= worship.late;
      });
    });

    // 순별 데이터
    Object.keys(sunBaseMembers).forEach(sunName => {
      const baseMembers = sunBaseMembers[sunName];
      
      weekData.attendance.sun[sunName] = {
        '주일청년예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['주일청년예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '수요제자기도회': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['수요제자기도회'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '두란노사역자모임': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['두란노사역자모임'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        },
        '대예배': {
          total: baseMembers,
          present: Math.round(baseMembers * getRandomAttendanceRate(
            worshipBaseRates['대예배'],
            monthlyVariations[month + 1]?.variation || 0.1
          )),
          absent: 0,
          late: 0
        }
      };

      // 결석과 지각 인원 계산
      Object.keys(weekData.attendance.sun[sunName]).forEach(worshipType => {
        const worship = weekData.attendance.sun[sunName][worshipType];
        worship.absent = worship.total - worship.present;
        worship.late = Math.round(worship.present * 0.1);
        worship.present -= worship.late;
      });
    });

    data.weeklyData.push(weekData);
  });

  // 월별 요약 데이터 생성
  for (let month = 1; month <= 8; month++) {
    const monthData = data.weeklyData.filter(week => week.month === month);
    
    data.monthlySummary[month] = {
      guk: {},
      group: {},
      sun: {}
    };

    // 국별 월 요약
    Object.keys(gukBaseMembers).forEach(gukName => {
      data.monthlySummary[month].guk[gukName] = {
        '주일청년예배': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '수요제자기도회': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '두란노사역자모임': { total: 0, present: 0, absent: 0, late: 0, rate: 0 }
      };

      monthData.forEach(week => {
        Object.keys(data.monthlySummary[month].guk[gukName]).forEach(worshipType => {
          const weekData = week.attendance.guk[gukName][worshipType];
          data.monthlySummary[month].guk[gukName][worshipType].total += weekData.total;
          data.monthlySummary[month].guk[gukName][worshipType].present += weekData.present;
          data.monthlySummary[month].guk[gukName][worshipType].absent += weekData.absent;
          data.monthlySummary[month].guk[gukName][worshipType].late += weekData.late;
        });
      });

      // 출석률 계산
      Object.keys(data.monthlySummary[month].guk[gukName]).forEach(worshipType => {
        const worship = data.monthlySummary[month].guk[gukName][worshipType];
        worship.rate = worship.total > 0 ? (worship.present / worship.total) * 100 : 0;
      });
    });

    // 그룹별 월 요약
    Object.keys(groupBaseMembers).forEach(groupName => {
      data.monthlySummary[month].group[groupName] = {
        '주일청년예배': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '수요제자기도회': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '두란노사역자모임': { total: 0, present: 0, absent: 0, late: 0, rate: 0 }
      };

      monthData.forEach(week => {
        Object.keys(data.monthlySummary[month].group[groupName]).forEach(worshipType => {
          const weekData = week.attendance.group[groupName][worshipType];
          data.monthlySummary[month].group[groupName][worshipType].total += weekData.total;
          data.monthlySummary[month].group[groupName][worshipType].present += weekData.present;
          data.monthlySummary[month].group[groupName][worshipType].absent += weekData.absent;
          data.monthlySummary[month].group[groupName][worshipType].late += weekData.late;
        });
      });

      // 출석률 계산
      Object.keys(data.monthlySummary[month].group[groupName]).forEach(worshipType => {
        const worship = data.monthlySummary[month].group[groupName][worshipType];
        worship.rate = worship.total > 0 ? (worship.present / worship.total) * 100 : 0;
      });
    });

    // 순별 월 요약
    Object.keys(sunBaseMembers).forEach(sunName => {
      data.monthlySummary[month].sun[sunName] = {
        '주일청년예배': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '수요제자기도회': { total: 0, present: 0, absent: 0, late: 0, rate: 0 },
        '두란노사역자모임': { total: 0, present: 0, absent: 0, late: 0, rate: 0 }
      };

      monthData.forEach(week => {
        Object.keys(data.monthlySummary[month].sun[sunName]).forEach(worshipType => {
          const weekData = week.attendance.sun[sunName][worshipType];
          data.monthlySummary[month].sun[sunName][worshipType].total += weekData.total;
          data.monthlySummary[month].sun[sunName][worshipType].present += weekData.present;
          data.monthlySummary[month].sun[sunName][worshipType].absent += weekData.absent;
          data.monthlySummary[month].sun[sunName][worshipType].late += weekData.late;
        });
      });

      // 출석률 계산
      Object.keys(data.monthlySummary[month].sun[sunName]).forEach(worshipType => {
        const worship = data.monthlySummary[month].sun[sunName][worshipType];
        worship.rate = worship.total > 0 ? (worship.present / worship.total) * 100 : 0;
      });
    });
  }

  // 조직별 전체 통계
  Object.keys(gukBaseMembers).forEach(gukName => {
    data.organizationStats.guk[gukName] = {
      totalMembers: gukBaseMembers[gukName],
      totalWeeks: data.weeklyData.length,
      averageAttendance: {
        '주일청년예배': 0,
        '수요제자기도회': 0,
        '두란노사역자모임': 0
      }
    };

    // 평균 출석률 계산
    Object.keys(data.organizationStats.guk[gukName].averageAttendance).forEach(worshipType => {
      let totalRate = 0;
      let count = 0;
      
      for (let month = 1; month <= 8; month++) {
        if (data.monthlySummary[month]?.guk[gukName]?.[worshipType]?.rate) {
          totalRate += data.monthlySummary[month].guk[gukName][worshipType].rate;
          count++;
        }
      }
      
      data.organizationStats.guk[gukName].averageAttendance[worshipType] = count > 0 ? totalRate / count : 0;
    });
  });

  Object.keys(groupBaseMembers).forEach(groupName => {
    data.organizationStats.group[groupName] = {
      totalMembers: groupBaseMembers[groupName],
      totalWeeks: data.weeklyData.length,
      averageAttendance: {
        '주일청년예배': 0,
        '수요제자기도회': 0,
        '두란노사역자모임': 0
      }
    };

    // 평균 출석률 계산
    Object.keys(data.organizationStats.group[groupName].averageAttendance).forEach(worshipType => {
      let totalRate = 0;
      let count = 0;
      
      for (let month = 1; month <= 8; month++) {
        if (data.monthlySummary[month]?.group[groupName]?.[worshipType]?.rate) {
          totalRate += data.monthlySummary[month].group[groupName][worshipType].rate;
          count++;
        }
      }
      
      data.organizationStats.group[groupName].averageAttendance[worshipType] = count > 0 ? totalRate / count : 0;
    });
  });

  Object.keys(sunBaseMembers).forEach(sunName => {
    data.organizationStats.sun[sunName] = {
      totalMembers: sunBaseMembers[sunName],
      totalWeeks: data.weeklyData.length,
      averageAttendance: {
        '주일청년예배': 0,
        '수요제자기도회': 0,
        '두란노사역자모임': 0
      }
    };

    // 평균 출석률 계산
    Object.keys(data.organizationStats.sun[sunName].averageAttendance).forEach(worshipType => {
      let totalRate = 0;
      let count = 0;
      
      for (let month = 1; month <= 8; month++) {
        if (data.monthlySummary[month]?.sun[sunName]?.[worshipType]?.rate) {
          totalRate += data.monthlySummary[month].sun[sunName][worshipType].rate;
          count++;
        }
      }
      
      data.organizationStats.sun[sunName].averageAttendance[worshipType] = count > 0 ? totalRate / count : 0;
    });
  });

  // 국별 그룹 매핑 추가
  data.gukGroupMapping = gukGroupMapping;
  
  // 그룹별 순 매핑 추가
  data.groupSunMapping = groupSunMapping;
  
  return data;
};

// 데이터 생성 및 내보내기
const attendanceData2025 = generateAttendanceData();

export default attendanceData2025;

// 사용 예시:
// import attendanceData2025 from './attendanceData2025';
// 
// // 주차별 데이터 접근
// console.log(attendanceData2025.weeklyData[0]); // 1월 1주차
// 
// // 월별 요약 데이터 접근
// console.log(attendanceData2025.monthlySummary[1]); // 1월 요약
// 
// // 조직별 통계 접근
// console.log(attendanceData2025.organizationStats.guk['1국']); // 1국 통계
// console.log(attendanceData2025.organizationStats.group['1그룹']); // 1그룹 통계
// console.log(attendanceData2025.organizationStats.sun['1순']); // 1순 통계
