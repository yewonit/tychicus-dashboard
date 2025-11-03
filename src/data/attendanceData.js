// 청년회 조직 구조에 따른 최근 4주간 출석 데이터 샘플
// 5개국, 각 국당 3-4개 그룹, 각 그룹당 3-4개 순, 각 순 최대 10명 구성

// 최근 4주간의 날짜 계산 (현재 기준)
const getRecentWeeks = () => {
  const today = new Date();
  const weeks = [];
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
    weeks.push(weekStart);
  }
  
  return weeks;
};

const recentWeeks = getRecentWeeks();

// 예배 종류
const worshipTypes = {
  SUNDAY: '주일청년예배',
  WEDNESDAY: '수요제자기도회', 
  FRIDAY: '두란노사역자모임',
  SPECIAL: '대예배'
};

// 출석 상태
const attendanceStatus = {
  PRESENT: '출석',
  ABSENT: '결석',
  LATE: '지각'
};

// 직분 목록
const positions = [
  '회장', '부회장', '서기', '부서기', '회계', '부회계', '총무',
  '국장', '부국장', '그룹장', '부그룹장', '순장', 'EBS', '순원'
];

// 이름 샘플
const nameSamples = [
  '김민수', '이지은', '박준호', '최수진', '정현우', '한소영', '강동현', '윤미라', '송태민', '임하나',
  '김서연', '이동욱', '박소영', '최민준', '정하은', '한지훈', '강유진', '윤태호', '송지원', '임현수',
  '김도현', '이수빈', '박재민', '최예은', '정승우', '한소희', '강민석', '윤지현', '송현우', '임서연',
  '김태영', '이하나', '박지원', '최동현', '정소영', '한민수', '강지은', '윤준호', '송수진', '임현우'
];

// 랜덤 출석 상태 생성
const getRandomAttendance = () => {
  const rand = Math.random();
  if (rand < 0.7) return attendanceStatus.PRESENT;
  if (rand < 0.85) return attendanceStatus.ABSENT;
  return attendanceStatus.LATE;
};

// 랜덤 날짜 생성 (해당 주의 예배일)
const getRandomWorshipDate = (weekIndex, worshipType) => {
  const weekStart = new Date(recentWeeks[weekIndex]);
  
  switch (worshipType) {
    case worshipTypes.SUNDAY:
      return new Date(weekStart.getTime() + 0 * 24 * 60 * 60 * 1000); // 일요일
    case worshipTypes.WEDNESDAY:
      return new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000); // 수요일
    case worshipTypes.FRIDAY:
      return new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000); // 금요일
    case worshipTypes.SPECIAL:
      return new Date(weekStart.getTime() + 0 * 24 * 60 * 60 * 1000); // 일요일 (대예배)
    default:
      return weekStart;
  }
};

// 날짜 포맷팅
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// 연속 출석 통계 계산 함수
const calculateConsecutiveAttendance = (members, targetGroup = null) => {
  const consecutiveStats = {
    wednesday: {
      consecutive4Weeks: 0,
      consecutive3Weeks: 0,
      consecutive2Weeks: 0,
      consecutive1Week: 0,
      totalMembers: 0
    },
    friday: {
      consecutive4Weeks: 0,
      consecutive3Weeks: 0,
      consecutive2Weeks: 0,
      consecutive1Week: 0,
      totalMembers: 0
    },
    special: {
      consecutive4Weeks: 0,
      consecutive3Weeks: 0,
      consecutive2Weeks: 0,
      consecutive1Week: 0,
      totalMembers: 0
    }
  };

  // 그룹별로 필터링
  const filteredMembers = targetGroup 
    ? members.filter(member => member.소속그룹 === targetGroup)
    : members;

  filteredMembers.forEach(member => {
    consecutiveStats.wednesday.totalMembers++;
    consecutiveStats.friday.totalMembers++;
    consecutiveStats.special.totalMembers++;

    // 수요제자기도회 연속 출석 계산
    let wednesdayConsecutive = 0;
    for (let week = 1; week <= 4; week++) {
      const weekKey = `주${week}주`;
      const attendance = member[`${weekKey}_수요제자기도회출석여부`];
      if (attendance === attendanceStatus.PRESENT) {
        wednesdayConsecutive++;
      } else {
        break;
      }
    }
    
    if (wednesdayConsecutive >= 4) consecutiveStats.wednesday.consecutive4Weeks++;
    else if (wednesdayConsecutive >= 3) consecutiveStats.wednesday.consecutive3Weeks++;
    else if (wednesdayConsecutive >= 2) consecutiveStats.wednesday.consecutive2Weeks++;
    else if (wednesdayConsecutive >= 1) consecutiveStats.wednesday.consecutive1Week++;

    // 두란노사역자모임 연속 출석 계산
    let fridayConsecutive = 0;
    for (let week = 1; week <= 4; week++) {
      const weekKey = `주${week}주`;
      const attendance = member[`${weekKey}_두란노사역자모임출석여부`];
      if (attendance === attendanceStatus.PRESENT) {
        fridayConsecutive++;
      } else {
        break;
      }
    }
    
    if (fridayConsecutive >= 4) consecutiveStats.friday.consecutive4Weeks++;
    else if (fridayConsecutive >= 3) consecutiveStats.friday.consecutive3Weeks++;
    else if (fridayConsecutive >= 2) consecutiveStats.friday.consecutive2Weeks++;
    else if (fridayConsecutive >= 1) consecutiveStats.friday.consecutive1Week++;

    // 대예배 연속 출석 계산
    let specialConsecutive = 0;
    for (let week = 1; week <= 4; week++) {
      const weekKey = `주${week}주`;
      const attendance = member[`${weekKey}_대예배출석여부`];
      if (attendance === attendanceStatus.PRESENT) {
        specialConsecutive++;
      } else {
        break;
      }
    }
    
    if (specialConsecutive >= 4) consecutiveStats.special.consecutive4Weeks++;
    else if (specialConsecutive >= 3) consecutiveStats.special.consecutive3Weeks++;
    else if (specialConsecutive >= 2) consecutiveStats.special.consecutive2Weeks++;
    else if (specialConsecutive >= 1) consecutiveStats.special.consecutive1Week++;
  });

  return consecutiveStats;
};

// 연속 결석 통계 계산 함수 (중앙화)
export const calculateConsecutiveAbsence = (members, targetGroup = null) => {
  const absenceStats = {
    sunday: {
      consecutive4Weeks: 0,
      consecutive3Weeks: 0,
      consecutive2Weeks: 0,
      members: {
        consecutive4Weeks: [],
        consecutive3Weeks: [],
        consecutive2Weeks: []
      }
    }
  };

  // 그룹별로 필터링
  const filteredMembers = targetGroup 
    ? members.filter(member => member.소속그룹 === targetGroup)
    : members;

  filteredMembers.forEach(member => {
    // 주일청년예배 연속 결석 계산
    let consecutiveAbsence = 0;
    for (let week = 1; week <= 4; week++) {
      const weekKey = `주${week}주`;
      const attendance = member[`${weekKey}_주일청년예배출석여부`];
      if (attendance === attendanceStatus.ABSENT) {
        consecutiveAbsence++;
      } else {
        break;
      }
    }
    
    // 연속 결석 기간별로 분류
    if (consecutiveAbsence >= 4) {
      absenceStats.sunday.consecutive4Weeks++;
      absenceStats.sunday.members.consecutive4Weeks.push({
        name: member.이름,
        team: member.소속순,
        role: member.직분 || null,
        consecutiveWeeks: consecutiveAbsence,
        소속국: member.소속국,
        소속그룹: member.소속그룹
      });
    } else if (consecutiveAbsence >= 3) {
      absenceStats.sunday.consecutive3Weeks++;
      absenceStats.sunday.members.consecutive3Weeks.push({
        name: member.이름,
        team: member.소속순,
        role: member.직분 || null,
        consecutiveWeeks: consecutiveAbsence,
        소속국: member.소속국,
        소속그룹: member.소속그룹
      });
    } else if (consecutiveAbsence >= 2) {
      absenceStats.sunday.consecutive2Weeks++;
      absenceStats.sunday.members.consecutive2Weeks.push({
        name: member.이름,
        team: member.소속순,
        role: member.직분 || null,
        consecutiveWeeks: consecutiveAbsence,
        소속국: member.소속국,
        소속그룹: member.소속그룹
      });
    }
  });

  return absenceStats;
};

// 청년회 구성원 데이터 생성
export const generateMembersData = () => {
  const members = [];
  let memberId = 1;
  
  // 5개국 생성
  for (let guk = 1; guk <= 5; guk++) {
    const groupsPerGuk = Math.floor(Math.random() * 2) + 3; // 3-4개 그룹
    
    for (let group = 1; group <= groupsPerGuk; group++) {
      // 그룹장 이름 생성
      const groupLeaderName = nameSamples[Math.floor(Math.random() * nameSamples.length)];
      const teamsPerGroup = Math.floor(Math.random() * 2) + 3; // 3-4개 순
      
      for (let team = 1; team <= teamsPerGroup; team++) {
        // 순장 이름 생성
        const teamLeaderName = nameSamples[Math.floor(Math.random() * nameSamples.length)];
        const membersPerTeam = Math.floor(Math.random() * 8) + 3; // 3-10명
        
        for (let member = 1; member <= membersPerTeam; member++) {
          const memberData = {
            id: memberId++,
            소속국: `${guk}국`,
            소속그룹: `${groupLeaderName} 그룹`,
            소속순: `${teamLeaderName} 순`,
            그룹장: groupLeaderName,
            순장: teamLeaderName,
            이름: nameSamples[Math.floor(Math.random() * nameSamples.length)],
            직분: positions[Math.floor(Math.random() * positions.length)],
            연락처: `010-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
            생일연도: Math.floor(Math.random() * 15) + 1985, // 1985-1999년생
            가입일: formatDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1))
          };
          
          // 최근 4주간 출석 데이터 생성
          for (let week = 0; week < 4; week++) {
            const weekKey = `주${4-week}주`;
            
            // 주일청년예배
            const sundayAttendance = getRandomAttendance();
            memberData[`${weekKey}_주일청년예배출석여부`] = sundayAttendance;
            if (sundayAttendance !== attendanceStatus.ABSENT) {
              memberData[`${weekKey}_주일청년예배출석일자`] = formatDate(getRandomWorshipDate(week, worshipTypes.SUNDAY));
            }
            
            // 수요제자기도회
            const wednesdayAttendance = getRandomAttendance();
            memberData[`${weekKey}_수요제자기도회출석여부`] = wednesdayAttendance;
            if (wednesdayAttendance !== attendanceStatus.ABSENT) {
              memberData[`${weekKey}_수요제자기도회출석일자`] = formatDate(getRandomWorshipDate(week, worshipTypes.WEDNESDAY));
            }
            
            // 두란노사역자모임
            const fridayAttendance = getRandomAttendance();
            memberData[`${weekKey}_두란노사역자모임출석여부`] = fridayAttendance;
            if (fridayAttendance !== attendanceStatus.ABSENT) {
              memberData[`${weekKey}_두란노사역자모임출석일자`] = formatDate(getRandomWorshipDate(week, worshipTypes.FRIDAY));
            }

            // 대예배 (주일청년예배와 같은 날짜)
            const specialAttendance = getRandomAttendance();
            memberData[`${weekKey}_대예배출석여부`] = specialAttendance;
            if (specialAttendance !== attendanceStatus.ABSENT) {
              memberData[`${weekKey}_대예배출석일자`] = formatDate(getRandomWorshipDate(week, worshipTypes.SUNDAY));
            }
          }
          
          members.push(memberData);
        }
      }
    }
  }
  
  return members;
};

// 통계 데이터 생성
export const generateStatsData = () => {
  const members = generateMembersData();
  
  // 국별 통계
  const gukStats = {};
  const groupStats = {};
  const teamStats = {};
  
  // 전체 통계
  let totalMembers = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  
  members.forEach(member => {
    const guk = member.소속국;
    const group = member.소속그룹;
    const team = member.소속순;
    
    // 국별 통계
    if (!gukStats[guk]) {
      gukStats[guk] = {
        totalMembers: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        groups: new Set(),
        teams: new Set()
      };
    }
    gukStats[guk].totalMembers++;
    gukStats[guk].groups.add(group);
    gukStats[guk].teams.add(team);
    
    // 그룹별 통계
    if (!groupStats[group]) {
      groupStats[group] = {
        totalMembers: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        teams: new Set(),
        groupLeader: member.그룹장
      };
    }
    groupStats[group].totalMembers++;
    groupStats[group].teams.add(team);
    // groupLeader가 설정되지 않은 경우 업데이트
    if (!groupStats[group].groupLeader) {
      groupStats[group].groupLeader = member.그룹장;
    }
    
      // 순별 통계
    if (!teamStats[team]) {
      teamStats[team] = {
        totalMembers: 0,
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        teamLeader: member.순장
      };
    }
    teamStats[team].totalMembers++;
    // teamLeader가 설정되지 않은 경우 업데이트
    if (!teamStats[team].teamLeader) {
      teamStats[team].teamLeader = member.순장;
    }
    
    // 최근 주 출석 통계 (주1주)
    const recentWeek = '주1주';
    const sundayStatus = member[`${recentWeek}_주일청년예배출석여부`];
    const wednesdayStatus = member[`${recentWeek}_수요제자기도회출석여부`];
    const fridayStatus = member[`${recentWeek}_두란노사역자모임출석여부`];
    const specialStatus = member[`${recentWeek}_대예배출석여부`];
    
    [sundayStatus, wednesdayStatus, fridayStatus, specialStatus].forEach(status => {
      if (status === attendanceStatus.PRESENT) {
        totalPresent++;
        gukStats[guk].totalPresent++;
        groupStats[group].totalPresent++;
        teamStats[team].totalPresent++;
      } else if (status === attendanceStatus.ABSENT) {
        totalAbsent++;
        gukStats[guk].totalAbsent++;
        groupStats[group].totalAbsent++;
        teamStats[team].totalAbsent++;
      } else if (status === attendanceStatus.LATE) {
        totalLate++;
        gukStats[guk].totalLate++;
        groupStats[group].totalLate++;
        teamStats[team].totalLate++;
      }
    });
  });
  
  // 통계 데이터 정리
  const processedGukStats = {};
  Object.keys(gukStats).forEach(guk => {
    const stats = gukStats[guk];
    processedGukStats[guk] = {
      totalMembers: stats.totalMembers,
      totalPresent: stats.totalPresent,
      totalAbsent: stats.totalAbsent,
      totalLate: stats.totalLate,
      attendanceRate: Math.round((stats.totalPresent / (stats.totalPresent + stats.totalAbsent + stats.totalLate)) * 100),
      groups: stats.groups.size,
      teams: stats.teams.size
    };
  });
  
  const processedGroupStats = {};
  Object.keys(groupStats).forEach(group => {
    const stats = groupStats[group];
    processedGroupStats[group] = {
      totalMembers: stats.totalMembers,
      totalPresent: stats.totalPresent,
      totalAbsent: stats.totalAbsent,
      totalLate: stats.totalLate,
      attendanceRate: Math.round((stats.totalPresent / (stats.totalPresent + stats.totalAbsent + stats.totalLate)) * 100),
      teams: stats.teams.size,
      groupLeader: stats.groupLeader
    };
  });
  
  const processedTeamStats = {};
  Object.keys(teamStats).forEach(team => {
    const stats = teamStats[team];
    processedTeamStats[team] = {
      totalMembers: stats.totalMembers,
      totalPresent: stats.totalPresent,
      totalAbsent: stats.totalAbsent,
      totalLate: stats.totalLate,
      attendanceRate: Math.round((stats.totalPresent / (stats.totalPresent + stats.totalAbsent + stats.totalLate)) * 100),
      teamLeader: stats.teamLeader
    };
  });
  
  return {
    members: members,
    gukStats: processedGukStats,
    groupStats: processedGroupStats,
    teamStats: processedTeamStats,
    overallStats: {
      totalMembers: members.length,
      totalPresent: totalPresent,
      totalAbsent: totalAbsent,
      totalLate: totalLate,
      attendanceRate: Math.round((totalPresent / (totalPresent + totalAbsent + totalLate)) * 100)
    }
  };
};

// 최근 활동 데이터 생성 (심방, 지역모임만 표시)
export const generateRecentActivities = () => {
  const activities = [];
  const activityTypes = ['심방', '지역모임']; // 심방과 지역모임만 포함
  const members = generateMembersData();
  
  for (let i = 0; i < 20; i++) {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    activities.push({
      id: i + 1,
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      member: randomMember.이름,
      group: randomMember.소속그룹,
      team: randomMember.소속순,
      date: formatDate(randomDate),
      time: `${Math.floor(Math.random() * 12) + 9}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)}`
    });
  }
  
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// 월별 트렌드 데이터 생성
export const generateMonthlyTrends = () => {
  const trends = [];
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  months.forEach((month, index) => {
    trends.push({
      month: month,
      출석: Math.floor(Math.random() * 20) + 75, // 75-95% 범위
      members: Math.floor(Math.random() * 50) + 150 // 150-200명 범위
    });
  });
  
  return trends;
};

// 연속 출석 통계 계산 함수 (외부에서 사용)
export const getConsecutiveAttendanceStats = (members, targetGroup = null) => {
  return calculateConsecutiveAttendance(members, targetGroup);
};

// 전주 대비 증가 데이터 생성 함수
export const generateWeekOverWeekData = () => {
  const members = generateMembersData();
  
  // 전주와 이번 주 데이터 비교
  const thisWeek = '주1주';
  const lastWeek = '주2주';
  
  let thisWeekStats = {
    totalMembers: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalNewFamily: 0
  };
  
  let lastWeekStats = {
    totalMembers: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    totalNewFamily: 0
  };
  
  // 이번 주 통계
  members.forEach(member => {
    const sundayStatus = member[`${thisWeek}_주일청년예배출석여부`];
    const wednesdayStatus = member[`${thisWeek}_수요제자기도회출석여부`];
    const fridayStatus = member[`${thisWeek}_두란노사역자모임출석여부`];
    const specialStatus = member[`${thisWeek}_대예배출석여부`];
    
    thisWeekStats.totalMembers++;
    
    [sundayStatus, wednesdayStatus, fridayStatus, specialStatus].forEach(status => {
      if (status === attendanceStatus.PRESENT) {
        thisWeekStats.totalPresent++;
      } else if (status === attendanceStatus.ABSENT) {
        thisWeekStats.totalAbsent++;
      } else if (status === attendanceStatus.LATE) {
        thisWeekStats.totalLate++;
      }
    });
    
    // 이번 주 새가족 여부 확인 (랜덤하게 설정)
    if (Math.random() < 0.1) {
      thisWeekStats.totalNewFamily++;
    }
  });
  
  // 전주 통계
  members.forEach(member => {
    const sundayStatus = member[`${lastWeek}_주일청년예배출석여부`];
    const wednesdayStatus = member[`${lastWeek}_수요제자기도회출석여부`];
    const fridayStatus = member[`${lastWeek}_두란노사역자모임출석여부`];
    const specialStatus = member[`${lastWeek}_대예배출석여부`];
    
    lastWeekStats.totalMembers++;
    
    [sundayStatus, wednesdayStatus, fridayStatus, specialStatus].forEach(status => {
      if (status === attendanceStatus.PRESENT) {
        lastWeekStats.totalPresent++;
      } else if (status === attendanceStatus.ABSENT) {
        lastWeekStats.totalAbsent++;
      } else if (status === attendanceStatus.LATE) {
        lastWeekStats.totalLate++;
      }
    });
    
    // 전주 새가족 여부 확인 (랜덤하게 설정)
    if (Math.random() < 0.08) {
      lastWeekStats.totalNewFamily++;
    }
  });
  
  // 증가율 계산
  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  const thisWeekAttendanceRate = Math.round((thisWeekStats.totalPresent / (thisWeekStats.totalPresent + thisWeekStats.totalAbsent + thisWeekStats.totalLate)) * 100);
  const lastWeekAttendanceRate = Math.round((lastWeekStats.totalPresent / (lastWeekStats.totalPresent + lastWeekStats.totalAbsent + lastWeekStats.totalLate)) * 100);
  
  return {
    thisWeek: {
      totalMembers: thisWeekStats.totalMembers,
      totalPresent: thisWeekStats.totalPresent,
      totalAbsent: thisWeekStats.totalAbsent,
      totalLate: thisWeekStats.totalLate,
      totalNewFamily: thisWeekStats.totalNewFamily,
      attendanceRate: thisWeekAttendanceRate
    },
    lastWeek: {
      totalMembers: lastWeekStats.totalMembers,
      totalPresent: lastWeekStats.totalPresent,
      totalAbsent: lastWeekStats.totalAbsent,
      totalLate: lastWeekStats.totalLate,
      totalNewFamily: lastWeekStats.totalNewFamily,
      attendanceRate: lastWeekAttendanceRate
    },
    growth: {
      totalMembers: thisWeekStats.totalMembers - lastWeekStats.totalMembers,
      totalPresent: thisWeekStats.totalPresent - lastWeekStats.totalPresent,
      totalAbsent: calculateGrowthRate(thisWeekStats.totalAbsent, lastWeekStats.totalAbsent),
      totalLate: calculateGrowthRate(thisWeekStats.totalLate, lastWeekStats.totalLate),
      totalNewFamily: thisWeekStats.totalNewFamily - lastWeekStats.totalNewFamily,
      attendanceRate: calculateGrowthRate(thisWeekAttendanceRate, lastWeekAttendanceRate)
    }
  };
};

// 새로운 퀵 스택 그리드 구성을 위한 데이터 생성 함수
export const generateNewQuickStatsData = () => {
  const members = generateMembersData();
  
  // 구성원 분류
  const memberCategories = {
    regularAttendees: 0,    // 정기 출석자
    interestedAttendees: 0, // 관심 출석자
    shortTermAbsent: 0,     // 단기 결석자
    longTermAbsent: 0,      // 장기 결석자
    expulsionTarget: 0,     // 제적 대상자
    newFamily: 0            // 새가족 (이번주 신규 등록자)
  };
  
  // 이번 주 출석자 수
  let thisWeekAttendees = 0;
  
  // 지난 주 출석자 수
  let lastWeekAttendees = 0;
  
  // 이번 주 새가족 수
  let thisWeekNewFamily = 0;
  
  // 지난 주 새가족 수
  let lastWeekNewFamily = 0;
  
  members.forEach(member => {
    // 이번 주 출석 여부 확인
    const thisWeekSunday = member['주1주_주일청년예배출석여부'];
    const thisWeekWednesday = member['주1주_수요제자기도회출석여부'];
    const thisWeekFriday = member['주1주_두란노사역자모임출석여부'];
    const thisWeekSpecial = member['주1주_대예배출석여부'];
    
    // 지난 주 출석 여부 확인
    const lastWeekSunday = member['주2주_주일청년예배출석여부'];
    const lastWeekWednesday = member['주2주_수요제자기도회출석여부'];
    const lastWeekFriday = member['주2주_두란노사역자모임출석여부'];
    const lastWeekSpecial = member['주2주_대예배출석여부'];
    
    // 이번 주 출석 여부
    const thisWeekAttended = [thisWeekSunday, thisWeekWednesday, thisWeekFriday, thisWeekSpecial].some(status => status === attendanceStatus.PRESENT);
    if (thisWeekAttended) {
      thisWeekAttendees++;
    }
    
    // 지난 주 출석 여부
    const lastWeekAttended = [lastWeekSunday, lastWeekWednesday, lastWeekFriday, lastWeekSpecial].some(status => status === attendanceStatus.PRESENT);
    if (lastWeekAttended) {
      lastWeekAttendees++;
    }
    
    // 구성원 분류 (랜덤하게 분류)
    const random = Math.random();
    if (random < 0.4) {
      memberCategories.regularAttendees++;
    } else if (random < 0.6) {
      memberCategories.interestedAttendees++;
    } else if (random < 0.75) {
      memberCategories.shortTermAbsent++;
    } else if (random < 0.85) {
      memberCategories.longTermAbsent++;
    } else if (random < 0.95) {
      memberCategories.expulsionTarget++;
    } else {
      memberCategories.newFamily++;
      // 이번 주 새가족인 경우
      if (Math.random() < 0.3) {
        thisWeekNewFamily++;
      }
      // 지난 주 새가족인 경우 (랜덤하게 설정)
      if (Math.random() < 0.2) {
        lastWeekNewFamily++;
      }
    }
  });
  
  // 전체 구성원 수
  const totalMembers = Object.values(memberCategories).reduce((sum, count) => sum + count, 0);
  
  // 전체 출석률 계산
  const totalAttendanceRate = Math.round((lastWeekAttendees / totalMembers) * 100);
  
  // 활성인원 출석률 계산 (제적 대상자 제외)
  const activeMembers = totalMembers - memberCategories.expulsionTarget;
  const activeAttendanceRate = Math.round((lastWeekAttendees / activeMembers) * 100);
  
  return {
    totalMembers: {
      regularAttendees: memberCategories.regularAttendees,
      interestedAttendees: memberCategories.interestedAttendees,
      shortTermAbsent: memberCategories.shortTermAbsent,
      longTermAbsent: memberCategories.longTermAbsent,
      expulsionTarget: memberCategories.expulsionTarget,
      newFamily: memberCategories.newFamily,
      total: totalMembers
    },
    thisWeekAttendees: thisWeekAttendees,
    totalAttendanceRate: totalAttendanceRate,
    activeAttendanceRate: activeAttendanceRate,
    thisWeekNewFamily: thisWeekNewFamily,
    lastWeekNewFamily: lastWeekNewFamily,
    lastWeekAttendees: lastWeekAttendees,
    activeMembers: activeMembers
  };
};

// 기본 데이터 내보내기
export const attendanceData = generateStatsData();
export const recentActivities = generateRecentActivities();
export const monthlyTrends = generateMonthlyTrends();
export const weekOverWeekData = generateWeekOverWeekData();
export const newQuickStatsData = generateNewQuickStatsData(); 