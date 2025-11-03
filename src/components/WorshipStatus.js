import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import attendanceData2025 from '../data/attendanceData2025';

const WorshipStatusContainer = styled.div`
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
`;

const FilterSection = styled.div`
  background: var(--bg-card);
  padding: 25px;
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  margin-bottom: 30px;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }
  
  select, input {
    padding: 10px 12px;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    font-size: 0.9rem;
    background: white;
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.1);
    }
  }
`;

const SearchButton = styled.button`
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const WorshipTableSection = styled.div`
  background: var(--bg-card);
  padding: 30px;
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow-x: auto;
  position: relative;
  
  /* 스크롤 컨테이너 강화 */
  transform: translateZ(0);
  will-change: scroll-position;
  -webkit-overflow-scrolling: touch;
  
  /* 스크롤 성능 최적화 */
  scroll-behavior: smooth;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-subtle);
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: 6px;
    
    &:hover {
      background: var(--accent-secondary);
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
`;

const WorshipTable = styled.table`
  width: ${props => props.tableWidth || 3000}px;
  border-collapse: collapse;
  border: 1px solid var(--border-light);
  position: relative;
  table-layout: fixed;
  
  th, td {
    padding: 10px 8px;
    text-align: center;
    border: 1px solid var(--border-light);
    font-size: 0.8rem;
    white-space: nowrap;
    position: relative;
  }
  
  th {
    background: var(--accent-primary);
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  th.date-cell {
    position: sticky;
    left: 0;
    z-index: 30;
    width: 120px;
    background: var(--accent-primary);
    border-right: 3px solid var(--accent-primary);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  th.worship-type {
    position: sticky;
    left: 120px;
    z-index: 29;
    width: 150px;
    background: var(--accent-primary);
    border-right: 3px solid var(--accent-primary);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  td {
    color: var(--text-primary);
    background: white;
  }
  
  td.date-cell {
    background: var(--bg-subtle);
    font-weight: 600;
    position: sticky;
    left: 0;
    z-index: 25;
    width: 120px;
    border-right: 3px solid var(--accent-primary);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  td.worship-type {
    background: var(--bg-subtle);
    font-weight: 500;
    position: sticky;
    left: 120px;
    z-index: 24;
    width: 150px;
    border-right: 3px solid var(--accent-primary);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  td.total-cell {
    background: var(--accent-secondary);
    color: white;
    font-weight: 600;
  }
  
  .merged-date {
    background: var(--bg-subtle);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .guk-header {
    background: var(--accent-secondary);
    color: white;
    font-weight: 600;
  }
  
  .group-header {
    background: var(--bg-subtle);
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .sun-header {
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const WorshipStatus = () => {
  const [filters, setFilters] = useState({
    country: 'all',
    group: 'all',
    startDate: '',
    endDate: ''
  });

  const [filteredData, setFilteredData] = useState([]);

  // 국 옵션
  const countryOptions = [
    { value: 'all', label: '전체' },
    { value: '1국', label: '1국' },
    { value: '2국', label: '2국' },
    { value: '3국', label: '3국' },
    { value: '4국', label: '4국' },
    { value: '5국', label: '5국' }
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
      group: 'all'
    }));
  }, [filters.country]);

  const loadFilteredData = () => {
    let data = [];
    
    // 국이 전체일 때: 국별 데이터
    if (filters.country === 'all') {
      data = attendanceData2025.weeklyData.slice(0, 8).map(week => ({
        date: week.dates.sunday.toISOString().split('T')[0],
        month: week.month + 1,
        week: week.week,
        attendance: week.attendance.guk,
        level: 'guk'
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
        country: filters.country
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
        group: filters.group
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

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
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

  const getAttendanceData = (weekData, orgName, worshipType) => {
    if (!weekData.attendance[orgName] || !weekData.attendance[orgName][worshipType]) {
      return { present: 0, total: 0 };
    }
    return weekData.attendance[orgName][worshipType];
  };

  const calculateTotal = (weekData, worshipType) => {
    const orgNames = getOrganizationNames();
    return orgNames.reduce((sum, orgName) => {
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
      ...groupsInCountry.map(groupName => ({
        value: groupName,
        label: groupName
      }))
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
    
    const totalWidth = dateWidth + worshipWidth + (orgNames.length * orgColWidth * 2) + totalColWidth;
    
    // 최소 너비 보장 (스크롤이 발생하도록)
    return Math.max(totalWidth, 1500);
  };

  return (
    <WorshipStatusContainer>
      <PageHeader>
        <h1>예배 현황</h1>
        <p>일자별 각 예배의 출석 현황을 확인하세요</p>
      </PageHeader>

      <FilterSection>
        <FilterTitle>조회 조건</FilterTitle>
        <FilterGrid>
          <FilterGroup>
            <label>국</label>
            <select 
              value={filters.country} 
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              {countryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterGroup>
          
          {filters.country !== 'all' && (
            <FilterGroup>
              <label>그룹</label>
              <select 
                value={filters.group} 
                onChange={(e) => handleFilterChange('group', e.target.value)}
              >
                {getGroupOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FilterGroup>
          )}
          
          <FilterGroup>
            <label>시작일</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <label>종료일</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </FilterGroup>
        </FilterGrid>
        
        <SearchButton onClick={handleSearch}>
          조회하기
        </SearchButton>
      </FilterSection>

             <WorshipTableSection>
         <SectionTitle>조회 결과</SectionTitle>
        <WorshipTable tableWidth={calculateTableWidth()}>
          <thead>
            <tr>
              <th rowSpan={2} className="date-cell">날짜</th>
              <th rowSpan={2} className="worship-type">예배</th>
              {getOrganizationNames().map(orgName => (
                <th key={orgName} colSpan={2} className="guk-header">
                  {orgName}
                </th>
              ))}
              <th rowSpan={2} className="total-cell">총합계</th>
            </tr>
            <tr>
              {getOrganizationNames().map(orgName => (
                <React.Fragment key={orgName}>
                  <th className="group-header">출석</th>
                  <th className="sun-header">전체</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((weekData, weekIndex) => (
              worshipTypes.map((worshipType, worshipIndex) => (
                <tr key={`${weekIndex}-${worshipType}`}>
                  {worshipIndex === 0 ? (
                    <td rowSpan={worshipTypes.length} className="merged-date">
                      {weekData.date}<br/>
                      <small>{weekData.month}월 {weekData.week}주차</small>
                    </td>
                  ) : null}
                  <td className="worship-type">{worshipType}</td>
                  {getOrganizationNames().map(orgName => {
                    const data = getAttendanceData(weekData, orgName, worshipType);
                    return (
                      <React.Fragment key={orgName}>
                        <td>{data.present}</td>
                        <td>{data.total}</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="total-cell">
                    {calculateTotal(weekData, worshipType)}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </WorshipTable>
      </WorshipTableSection>
    </WorshipStatusContainer>
  );
};

export default WorshipStatus;
