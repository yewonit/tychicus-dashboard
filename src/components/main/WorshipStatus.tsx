import React, { useEffect, useState } from 'react';

// 더미 데이터 (실제 데이터로 교체 필요)
const attendanceData2025 = {
  weeklyData: [
    {
      dates: { sunday: new Date('2025-01-05') },
      month: 0,
      week: 1,
      attendance: {
        guk: {
          '1국': {
            주일청년예배: { present: 45, total: 60 },
            대예배: { present: 38, total: 60 },
            수요제자기도회: { present: 25, total: 60 },
            두란노사역자모임: { present: 20, total: 60 },
          },
          '2국': {
            주일청년예배: { present: 42, total: 55 },
            대예배: { present: 35, total: 55 },
            수요제자기도회: { present: 22, total: 55 },
            두란노사역자모임: { present: 18, total: 55 },
          },
          '3국': {
            주일청년예배: { present: 48, total: 65 },
            대예배: { present: 40, total: 65 },
            수요제자기도회: { present: 28, total: 65 },
            두란노사역자모임: { present: 22, total: 65 },
          },
        },
        group: {
          '김철수 그룹': {
            주일청년예배: { present: 15, total: 20 },
            대예배: { present: 12, total: 20 },
            수요제자기도회: { present: 8, total: 20 },
            두란노사역자모임: { present: 6, total: 20 },
          },
          '이영희 그룹': {
            주일청년예배: { present: 18, total: 22 },
            대예배: { present: 15, total: 22 },
            수요제자기도회: { present: 10, total: 22 },
            두란노사역자모임: { present: 8, total: 22 },
          },
        },
        sun: {
          '1순': {
            주일청년예배: { present: 8, total: 10 },
            대예배: { present: 6, total: 10 },
            수요제자기도회: { present: 4, total: 10 },
            두란노사역자모임: { present: 3, total: 10 },
          },
          '2순': {
            주일청년예배: { present: 7, total: 10 },
            대예배: { present: 6, total: 10 },
            수요제자기도회: { present: 4, total: 10 },
            두란노사역자모임: { present: 3, total: 10 },
          },
        },
      },
    },
    // 더 많은 주차 데이터...
    {
      dates: { sunday: new Date('2025-01-12') },
      month: 0,
      week: 2,
      attendance: {
        guk: {
          '1국': {
            주일청년예배: { present: 47, total: 60 },
            대예배: { present: 40, total: 60 },
            수요제자기도회: { present: 27, total: 60 },
            두란노사역자모임: { present: 22, total: 60 },
          },
          '2국': {
            주일청년예배: { present: 44, total: 55 },
            대예배: { present: 37, total: 55 },
            수요제자기도회: { present: 24, total: 55 },
            두란노사역자모임: { present: 20, total: 55 },
          },
          '3국': {
            주일청년예배: { present: 50, total: 65 },
            대예배: { present: 42, total: 65 },
            수요제자기도회: { present: 30, total: 65 },
            두란노사역자모임: { present: 24, total: 65 },
          },
        },
        group: {
          '김철수 그룹': {
            주일청년예배: { present: 17, total: 20 },
            대예배: { present: 14, total: 20 },
            수요제자기도회: { present: 10, total: 20 },
            두란노사역자모임: { present: 8, total: 20 },
          },
          '이영희 그룹': {
            주일청년예배: { present: 20, total: 22 },
            대예배: { present: 17, total: 22 },
            수요제자기도회: { present: 12, total: 22 },
            두란노사역자모임: { present: 10, total: 22 },
          },
        },
        sun: {
          '1순': {
            주일청년예배: { present: 9, total: 10 },
            대예배: { present: 7, total: 10 },
            수요제자기도회: { present: 5, total: 10 },
            두란노사역자모임: { present: 4, total: 10 },
          },
          '2순': {
            주일청년예배: { present: 8, total: 10 },
            대예배: { present: 7, total: 10 },
            수요제자기도회: { present: 5, total: 10 },
            두란노사역자모임: { present: 4, total: 10 },
          },
        },
      },
    },
  ],
  organizationStats: {
    guk: {
      '1국': { totalMembers: 60 },
      '2국': { totalMembers: 55 },
      '3국': { totalMembers: 65 },
    },
  },
  gukGroupMapping: {
    '1국': ['김철수 그룹', '이영희 그룹'],
    '2국': ['박민수 그룹', '최영수 그룹'],
    '3국': ['정다은 그룹', '한민준 그룹'],
  } as Record<string, string[]>,
  groupSunMapping: {
    '김철수 그룹': ['1순', '2순'],
    '이영희 그룹': ['3순', '4순'],
    '박민수 그룹': ['5순', '6순'],
    '최영수 그룹': ['7순', '8순'],
  } as Record<string, string[]>,
};

const WorshipStatus: React.FC = () => {
  const [filters, setFilters] = useState({
    country: 'all',
    group: 'all',
    startDate: '',
    endDate: '',
  });

  const [filteredData, setFilteredData] = useState<any[]>([]);

  // 국 옵션
  const countryOptions = [
    { value: 'all', label: '전체' },
    { value: '1국', label: '1국' },
    { value: '2국', label: '2국' },
    { value: '3국', label: '3국' },
    { value: '4국', label: '4국' },
    { value: '5국', label: '5국' },
  ];

  // 예배 타입
  const worshipTypes = ['주일청년예배', '대예배', '수요제자기도회', '두란노사역자모임'];

  useEffect(() => {
    // 초기 데이터 로드
    loadFilteredData();
  }, []);

  useEffect(() => {
    // 국이 변경되면 그룹 필터 초기화
    setFilters(prev => ({
      ...prev,
      group: 'all',
    }));
  }, [filters.country]);

  const loadFilteredData = () => {
    let data: any[] = [];

    // 국이 전체일 때: 국별 데이터
    if (filters.country === 'all') {
      data = attendanceData2025.weeklyData.slice(0, 8).map(week => ({
        date: week.dates.sunday.toISOString().split('T')[0],
        month: week.month + 1,
        week: week.week,
        attendance: week.attendance.guk,
        level: 'guk',
      }));
    }
    // 특정 국 선택, 그룹이 전체일 때: 해당 국의 그룹별 데이터
    else if (filters.country !== 'all' && filters.group === 'all') {
      data = attendanceData2025.weeklyData.slice(0, 8).map(week => ({
        date: week.dates.sunday.toISOString().split('T')[0],
        month: week.month + 1,
        week: week.week,
        attendance: week.attendance.group,
        level: 'group',
        country: filters.country,
      }));
    }
    // 특정 국과 그룹 선택 시: 해당 그룹의 순별 데이터
    else if (filters.country !== 'all' && filters.group !== 'all') {
      data = attendanceData2025.weeklyData.slice(0, 8).map(week => ({
        date: week.dates.sunday.toISOString().split('T')[0],
        month: week.month + 1,
        week: week.week,
        attendance: week.attendance.sun,
        level: 'sun',
        country: filters.country,
        group: filters.group,
      }));
    }

    // 날짜 범위 필터 적용
    if (filters.startDate && filters.endDate) {
      data = data.filter(week => {
        const weekDate = new Date(week.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return weekDate >= startDate && weekDate <= endDate;
      });
    }

    setFilteredData(data);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    loadFilteredData();
  };

  const getOrganizationNames = () => {
    // 국이 전체일 때: 모든 국 표시
    if (filters.country === 'all') {
      return Object.keys(attendanceData2025.organizationStats.guk);
    }
    // 특정 국 선택, 그룹이 전체일 때: 해당 국에 속한 그룹들 표시
    else if (filters.country !== 'all' && filters.group === 'all') {
      return attendanceData2025.gukGroupMapping[filters.country] || [];
    }
    // 특정 국과 그룹 선택 시: 해당 그룹에 속한 순들 표시
    else if (filters.country !== 'all' && filters.group !== 'all') {
      return attendanceData2025.groupSunMapping[filters.group] || [];
    }

    return [];
  };

  const getAttendanceData = (weekData: any, orgName: string, worshipType: string) => {
    if (!weekData.attendance[orgName] || !weekData.attendance[orgName][worshipType]) {
      return { present: 0, total: 0 };
    }
    return weekData.attendance[orgName][worshipType];
  };

  const calculateTotal = (weekData: any, worshipType: string) => {
    const orgNames = getOrganizationNames();
    return orgNames.reduce((sum: number, orgName: string) => {
      const data = getAttendanceData(weekData, orgName, worshipType);
      return sum + data.present;
    }, 0);
  };

  // 국별 그룹 옵션 동적 생성
  const getGroupOptions = () => {
    if (filters.country === 'all') {
      return [{ value: 'all', label: '전체' }];
    }

    const groupsInCountry = attendanceData2025.gukGroupMapping[filters.country] || [];
    return [
      { value: 'all', label: '전체' },
      ...groupsInCountry.map((groupName: string) => ({
        value: groupName,
        label: groupName,
      })),
    ];
  };

  // 현재 데이터 레벨에 따른 제목 생성
  const getDataLevelTitle = () => {
    if (filters.country === 'all') {
      return '국별';
    } else if (filters.country !== 'all' && filters.group === 'all') {
      return `${filters.country} 그룹별`;
    } else if (filters.country !== 'all' && filters.group !== 'all') {
      return `${filters.country} ${filters.group} 순별`;
    }
    return '';
  };

  // 테이블 너비 동적 계산
  const calculateTableWidth = () => {
    const orgNames = getOrganizationNames();
    const dateWidth = 120; // 날짜 열
    const worshipWidth = 150; // 예배 열
    const orgColWidth = 80; // 각 조직의 출석/전체 열 너비
    const totalColWidth = 100; // 총합계 열

    const totalWidth = dateWidth + worshipWidth + orgNames.length * orgColWidth * 2 + totalColWidth;

    // 최소 너비 보장 (스크롤이 발생하도록)
    return Math.max(totalWidth, 1500);
  };

  return (
    <>
      <div className='main-content-with-sidebar'>
        <div className='worship-status-container'>
          <div className='page-header'>
            <h1>예배 현황</h1>
            <p>일자별 각 예배의 출석 현황을 확인하세요</p>
          </div>

          <div className='filter-section'>
            <h3 className='filter-title'>조회 조건</h3>
            <div className='filter-grid'>
              <div className='filter-group'>
                <label>국</label>
                <select value={filters.country} onChange={e => handleFilterChange('country', e.target.value)}>
                  {countryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {filters.country !== 'all' && (
                <div className='filter-group'>
                  <label>그룹</label>
                  <select value={filters.group} onChange={e => handleFilterChange('group', e.target.value)}>
                    {getGroupOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className='filter-group'>
                <label>시작일</label>
                <input
                  type='date'
                  value={filters.startDate}
                  onChange={e => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className='filter-group'>
                <label>종료일</label>
                <input
                  type='date'
                  value={filters.endDate}
                  onChange={e => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <button className='search-button' onClick={handleSearch}>
              조회하기
            </button>
          </div>

          <div className='worship-table-section'>
            <h2 className='section-title'>조회 결과 - {getDataLevelTitle()}</h2>
            <div className='table-wrapper'>
              <table className='worship-table' style={{ width: calculateTableWidth() + 'px' }}>
                <thead>
                  <tr>
                    <th rowSpan={2} className='date-cell'>
                      날짜
                    </th>
                    <th rowSpan={2} className='worship-type'>
                      예배
                    </th>
                    {getOrganizationNames().map((orgName: string) => (
                      <th key={orgName} colSpan={2} className='guk-header'>
                        {orgName}
                      </th>
                    ))}
                    <th rowSpan={2} className='total-cell'>
                      총합계
                    </th>
                  </tr>
                  <tr>
                    {getOrganizationNames().map((orgName: string) => (
                      <React.Fragment key={orgName}>
                        <th className='group-header'>출석</th>
                        <th className='sun-header'>전체</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((weekData, weekIndex) =>
                    worshipTypes.map((worshipType, worshipIndex) => (
                      <tr key={`${weekIndex}-${worshipType}`}>
                        {worshipIndex === 0 ? (
                          <td rowSpan={worshipTypes.length} className='merged-date'>
                            {weekData.date}
                            <br />
                            <small>
                              {weekData.month}월 {weekData.week}주차
                            </small>
                          </td>
                        ) : null}
                        <td className='worship-type'>{worshipType}</td>
                        {getOrganizationNames().map((orgName: string) => {
                          const data = getAttendanceData(weekData, orgName, worshipType);
                          return (
                            <React.Fragment key={orgName}>
                              <td>{data.present}</td>
                              <td>{data.total}</td>
                            </React.Fragment>
                          );
                        })}
                        <td className='total-cell'>{calculateTotal(weekData, worshipType)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorshipStatus;
