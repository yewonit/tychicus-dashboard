import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useEffect, useRef } from 'react';
import { logDebug, logWarn } from '../../utils/logger';

// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

interface AttendanceChartProps {
  attendanceData2025: any;
  selectedGuk?: string;
  selectedGroup?: string;
  chartType?: 'gook' | 'group' | 'sun';
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({
  attendanceData2025,
  selectedGuk = '전체',
  selectedGroup = '전체',
  chartType = 'gook',
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // 각 예배별 데이터 기준일자 계산
  const getWorshipDateInfo = () => {
    if (
      !attendanceData2025?.weeklyData ||
      attendanceData2025.weeklyData.length === 0
    ) {
      return { 주일청년예배: '', 수요기도회: '', 두란노모임: '', 대예배: '' };
    }

    // 가장 최근 주차의 날짜 정보
    const lastWeek =
      attendanceData2025.weeklyData[attendanceData2025.weeklyData.length - 1];
    const weekStartDate = new Date(lastWeek.weekStart);

    // 각 예배별 기준일자 계산
    // 주일청년예배: 해당 주의 일요일
    const sunday = new Date(weekStartDate);
    sunday.setDate(weekStartDate.getDate() + (7 - weekStartDate.getDay()));

    // 수요기도회: 해당 주의 수요일
    const wednesday = new Date(weekStartDate);
    wednesday.setDate(weekStartDate.getDate() + (3 - weekStartDate.getDay()));

    // 두란노모임: 해당 주의 금요일
    const friday = new Date(weekStartDate);
    friday.setDate(weekStartDate.getDate() + (5 - weekStartDate.getDay()));

    // 대예배: 해당 주의 일요일 (주일청년예배와 같은 날)
    const specialSunday = new Date(weekStartDate);
    specialSunday.setDate(
      weekStartDate.getDate() + (7 - weekStartDate.getDay())
    );

    return {
      주일청년예배: `${sunday.getMonth() + 1}/${sunday.getDate()}`,
      수요기도회: `${wednesday.getMonth() + 1}/${wednesday.getDate()}`,
      두란노모임: `${friday.getMonth() + 1}/${friday.getDate()}`,
      대예배: `${specialSunday.getMonth() + 1}/${specialSunday.getDate()}`,
    };
  };

  // 차트 타입에 따른 제목과 데이터 설정
  const getChartConfig = () => {
    switch (chartType) {
      case 'gook':
        return {
          title: '국별 출석 수 현황',
          data: getGookData(),
          summaryData: getGookSummary(),
        };
      case 'group':
        return {
          title: '그룹별 출석 수 현황',
          data: getGroupData(),
          summaryData: getGroupSummary(),
        };
      case 'sun':
        return {
          title: '순별 출석 수 현황',
          data: getSunData(),
          summaryData: getSunSummary(),
        };
      default:
        return {
          title: '출석 수 현황',
          data: [],
          summaryData: {},
        };
    }
  };

  // 국별 데이터 처리
  const getGookData = () => {
    if (
      !attendanceData2025?.organizationStats?.gook ||
      !Array.isArray(Object.entries(attendanceData2025.organizationStats.gook))
    ) {
      return [];
    }

    return Object.entries(attendanceData2025.organizationStats.gook).map(
      ([gookName, stats]: [string, any]) => {
        // 직전 주간 데이터 (가장 최근 주차)
        const lastWeek =
          Array.isArray(attendanceData2025.weeklyData) &&
          attendanceData2025.weeklyData.length > 0
            ? attendanceData2025.weeklyData[
                attendanceData2025.weeklyData.length - 1
              ]
            : null;
        let 주일청년예배 = 0,
          수요기도회 = 0,
          두란노모임 = 0,
          대예배 = 0;

        if (lastWeek?.attendance?.gook?.[gookName]) {
          주일청년예배 =
            lastWeek.attendance.gook[gookName]['주일청년예배']?.present || 0;
          수요기도회 =
            lastWeek.attendance.gook[gookName]['수요제자기도회']?.present || 0;
          두란노모임 =
            lastWeek.attendance.gook[gookName]['두란노사역자모임']?.present ||
            0;
          대예배 = lastWeek.attendance.gook[gookName]['대예배']?.present || 0;
        }

        return {
          gook: gookName,
          주일청년예배,
          수요기도회,
          두란노모임,
          대예배,
        };
      }
    );
  };

  // 그룹별 데이터 처리
  const getGroupData = () => {
    if (!attendanceData2025?.organizationStats?.group || selectedGuk === '전체')
      return [];

    // 선택된 국에 속한 그룹들만 필터링
    const gookGroups = Object.keys(
      attendanceData2025.organizationStats.group
    ).filter((groupName: string) => {
      const gookName = Object.keys(attendanceData2025.gookGroupMapping).find(
        gook => attendanceData2025.gookGroupMapping[gook].includes(groupName)
      );
      return gookName === selectedGuk;
    });

    return gookGroups.map(groupName => {
      const stats = attendanceData2025.organizationStats.group[groupName];
      const lastWeek =
        attendanceData2025.weeklyData[attendanceData2025.weeklyData.length - 1];
      let 주일청년예배 = 0,
        수요기도회 = 0,
        두란노모임 = 0,
        대예배 = 0;

      if (lastWeek?.attendance?.group?.[groupName]) {
        주일청년예배 =
          lastWeek.attendance.group[groupName]['주일청년예배']?.present || 0;
        수요기도회 =
          lastWeek.attendance.group[groupName]['수요제자기도회']?.present || 0;
        두란노모임 =
          lastWeek.attendance.group[groupName]['두란노사역자모임']?.present ||
          0;
        대예배 = lastWeek.attendance.group[groupName]['대예배']?.present || 0;
      }

      return {
        group: groupName,
        주일청년예배,
        수요기도회,
        두란노모임,
        대예배,
      };
    });
  };

  // 순별 데이터 처리
  const getSunData = () => {
    logDebug('getSunData 호출', 'AttendanceChart', {
      selectedGuk,
      selectedGroup,
    });

    if (!attendanceData2025?.organizationStats?.sun) {
      logWarn('organizationStats.sun이 없음', 'AttendanceChart');
      return [];
    }

    if (selectedGuk === '전체' || selectedGroup === '전체') {
      logDebug('국 또는 그룹이 전체로 선택됨', 'AttendanceChart');
      return [];
    }

    // 선택된 그룹에 속한 순들만 필터링
    const groupSuns = Object.keys(
      attendanceData2025.organizationStats.sun
    ).filter((sunName: string) => {
      const groupName = Object.keys(attendanceData2025.groupSunMapping).find(
        group => attendanceData2025.groupSunMapping[group].includes(sunName)
      );

      logDebug('순 필터링 과정', 'AttendanceChart', {
        sunName,
        groupName,
        selectedGroup,
      });

      // 그룹명 매칭 (여러 형태 지원)
      let isMatch = false;

      // 1. 정확한 매칭
      if (groupName === selectedGroup) {
        isMatch = true;
        logDebug('1. 정확한 매칭 성공', 'AttendanceChart');
      }
      // 2. " 그룹" 추가된 형태 매칭
      else if (groupName === `${selectedGroup} 그룹`) {
        isMatch = true;
        logDebug('2. " 그룹" 추가 매칭 성공', 'AttendanceChart');
      }
      // 3. " 그룹" 제거된 형태 매칭
      else if (groupName === selectedGroup.replace(' 그룹', '')) {
        isMatch = true;
        logDebug('3. " 그룹" 제거 매칭 성공', 'AttendanceChart');
      }

      if (isMatch) {
        logDebug('순 매칭 성공', 'AttendanceChart', {
          sunName,
          groupName,
          selectedGroup,
        });
      }

      return isMatch;
    });

    logDebug('순별 데이터 처리 결과', 'AttendanceChart', {
      selectedGuk,
      selectedGroup,
      totalSunCount: Object.keys(attendanceData2025.organizationStats.sun)
        .length,
      matchedSunCount: groupSuns.length,
    });
    if (groupSuns.length === 0) {
      logWarn('매칭된 순이 없음', 'AttendanceChart', {
        availableGroups: Object.keys(attendanceData2025.groupSunMapping),
      });
    }

    return groupSuns.map(sunName => {
      const stats = attendanceData2025.organizationStats.sun[sunName];
      const lastWeek =
        attendanceData2025.weeklyData[attendanceData2025.weeklyData.length - 1];
      let 주일청년예배 = 0,
        수요기도회 = 0,
        두란노모임 = 0,
        대예배 = 0;

      if (lastWeek?.attendance?.sun?.[sunName]) {
        주일청년예배 =
          lastWeek.attendance.sun[sunName]['주일청년예배']?.present || 0;
        수요기도회 =
          lastWeek.attendance.sun[sunName]['수요제자기도회']?.present || 0;
        두란노모임 =
          lastWeek.attendance.sun[sunName]['두란노사역자모임']?.present || 0;
        대예배 = lastWeek.attendance.sun[sunName]['대예배']?.present || 0;
      }

      return {
        sun: sunName,
        주일청년예배,
        수요기도회,
        두란노모임,
        대예배,
      };
    });
  };

  // 국별 요약 데이터
  const getGookSummary = () => {
    if (!attendanceData2025?.organizationStats?.gook) return {};

    const totalMembers = Object.values(
      attendanceData2025.organizationStats.gook
    ).reduce((sum: number, stats: any) => sum + (stats.totalMembers || 0), 0);

    const totalAttendance = getGookData().reduce(
      (sum, item) => sum + item.주일청년예배,
      0
    );

    return {
      totalMembers,
      totalAttendance,
      averageRate:
        totalMembers > 0
          ? Math.round((totalAttendance / totalMembers) * 100)
          : 0,
    };
  };

  // 그룹별 요약 데이터
  const getGroupSummary = () => {
    if (!attendanceData2025?.organizationStats?.group || selectedGuk === '전체')
      return {};

    const groupData = getGroupData();
    if (groupData.length === 0) return {};

    const totalMembers = groupData.reduce((sum, item) => {
      const groupName = item.group;
      return (
        sum +
        (attendanceData2025.organizationStats.group[groupName]?.totalMembers ||
          0)
      );
    }, 0);

    const totalAttendance = groupData.reduce(
      (sum, item) => sum + item.주일청년예배,
      0
    );

    return {
      totalMembers,
      totalAttendance,
      averageRate:
        totalMembers > 0
          ? Math.round((totalAttendance / totalMembers) * 100)
          : 0,
    };
  };

  // 순별 요약 데이터
  const getSunSummary = () => {
    if (
      !attendanceData2025?.organizationStats?.sun ||
      selectedGuk === '전체' ||
      selectedGroup === '전체'
    )
      return {};

    const sunData = getSunData();
    if (sunData.length === 0) return {};

    const totalMembers = sunData.reduce((sum, item) => {
      const sunName = item.sun;
      return (
        sum +
        (attendanceData2025.organizationStats.sun[sunName]?.totalMembers || 0)
      );
    }, 0);

    const totalAttendance = sunData.reduce(
      (sum, item) => sum + item.주일청년예배,
      0
    );

    return {
      totalMembers,
      totalAttendance,
      averageRate:
        totalMembers > 0
          ? Math.round((totalAttendance / totalMembers) * 100)
          : 0,
    };
  };

  // 2025년 평균 출석 수 계산 함수
  const get2025AverageAttendance = (gookName: string, worshipType: string) => {
    if (!attendanceData2025?.weeklyData) return 0;

    let totalAttendance = 0;
    let weekCount = 0;

    attendanceData2025.weeklyData.forEach((week: any) => {
      if (
        week.attendance?.gook?.[gookName]?.[worshipType]?.present !== undefined
      ) {
        totalAttendance += week.attendance.gook[gookName][worshipType].present;
        weekCount++;
      }
    });

    return weekCount > 0 ? Math.round(totalAttendance / weekCount) : 0;
  };

  // 차트 생성
  useEffect(() => {
    if (!chartRef.current) return;

    const config = getChartConfig();
    if (!config.data || !Array.isArray(config.data) || config.data.length === 0)
      return;

    // 기존 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: Array.isArray(config.data)
        ? config.data.map(
            item =>
              (item as any).gook ||
              (item as any).group ||
              (item as any).sun ||
              'Unknown'
          )
        : [],
      datasets: [
        {
          label: '대예배',
          data: Array.isArray(config.data)
            ? config.data.map(item => item.대예배 || 0)
            : [],
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
        {
          label: '주일청년예배',
          data: Array.isArray(config.data)
            ? config.data.map(item => item.주일청년예배 || 0)
            : [],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: '수요기도회',
          data: Array.isArray(config.data)
            ? config.data.map(item => item.수요기도회 || 0)
            : [],
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
        {
          label: '두란노사역모임',
          data: Array.isArray(config.data)
            ? config.data.map(item => item.두란노모임 || 0)
            : [],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          datalabels: {
            color: '#333',
            anchor: 'end',
            align: 'top',
            formatter: value => value || '',
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              title: function (context) {
                const gookName = context[0].label;
                const worshipType = context[0].dataset.label;
                return `${gookName} - ${worshipType}`;
              },
              label: function (context) {
                const value = context.parsed.y;
                return `출석 수: ${value}명`;
              },
              afterBody: function (context) {
                if (chartType === 'gook') {
                  const gookName = context[0].label;
                  const worshipType = context[0].dataset.label;

                  // 예배 타입을 데이터 키로 변환
                  let worshipKey = '';
                  switch (worshipType) {
                    case '주일청년예배':
                      worshipKey = '주일청년예배';
                      break;
                    case '수요기도회':
                      worshipKey = '수요제자기도회';
                      break;
                    case '두란노사역모임':
                      worshipKey = '두란노사역자모임';
                      break;
                    case '대예배':
                      worshipKey = '대예배';
                      break;
                    default:
                      return '';
                  }

                  // 예배일자 (직전 주의 해당 요일)
                  let dateInfo = '';
                  const today = new Date();
                  const lastWeek = new Date(today);
                  lastWeek.setDate(today.getDate() - 7); // 직전 주로 이동

                  let worshipDate;
                  switch (worshipType) {
                    case '주일청년예배':
                    case '대예배':
                      // 직전 주 일요일
                      worshipDate = new Date(lastWeek);
                      worshipDate.setDate(
                        lastWeek.getDate() - lastWeek.getDay()
                      );
                      break;
                    case '수요기도회':
                      // 직전 주 수요일
                      worshipDate = new Date(lastWeek);
                      worshipDate.setDate(
                        lastWeek.getDate() - lastWeek.getDay() + 3
                      );
                      break;
                    case '두란노사역모임':
                      // 직전 주 금요일
                      worshipDate = new Date(lastWeek);
                      worshipDate.setDate(
                        lastWeek.getDate() - lastWeek.getDay() + 5
                      );
                      break;
                    default:
                      worshipDate = new Date(lastWeek);
                  }

                  dateInfo = `예배일자: ${worshipDate.getFullYear()}/${String(worshipDate.getMonth() + 1).padStart(2, '0')}/${String(worshipDate.getDate()).padStart(2, '0')}`;

                  // 2025년 평균 출석 수
                  const average2025 = get2025AverageAttendance(
                    gookName,
                    worshipKey
                  );

                  return [dateInfo, `2025년 평균: ${average2025}명`];
                }
                return '';
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [attendanceData2025, selectedGuk, selectedGroup, chartType]);

  const config = getChartConfig();

  if (!config.data || !Array.isArray(config.data) || config.data.length === 0) {
    return (
      <div className='chart-container'>
        <h3 className='chart-title'>{config.title}</h3>
        <div className='no-data-message'>
          {chartType === 'gook' && '국별 데이터가 없습니다.'}
          {chartType === 'group' && '그룹별 데이터가 없습니다.'}
          {chartType === 'sun' &&
            `순별 데이터가 없습니다. (선택된 그룹: ${selectedGroup})`}
        </div>
      </div>
    );
  }

  return (
    <div className='chart-container'>
      <h3 className='chart-title'>{config.title}</h3>

      <div className='chart-wrapper'>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className='worship-info'>
        <div className='worship-card'>
          <div className='worship-title'>대예배</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {Array.isArray(config.data)
                  ? config.data.reduce(
                      (sum, item) => sum + (item.대예배 || 0),
                      0
                    )
                  : 0}
                명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {Array.isArray(config.data) && config.data.length > 0
                  ? Math.round(
                      config.data.reduce(
                        (sum, item) => sum + (item.대예배 || 0),
                        0
                      ) / config.data.length
                    )
                  : 0}
                명
              </div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>주일청년예배</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {Array.isArray(config.data)
                  ? config.data.reduce(
                      (sum, item) => sum + (item.주일청년예배 || 0),
                      0
                    )
                  : 0}
                명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {Array.isArray(config.data) && config.data.length > 0
                  ? Math.round(
                      config.data.reduce(
                        (sum, item) => sum + (item.주일청년예배 || 0),
                        0
                      ) / config.data.length
                    )
                  : 0}
                명
              </div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>수요기도회</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {Array.isArray(config.data)
                  ? config.data.reduce(
                      (sum, item) => sum + (item.수요기도회 || 0),
                      0
                    )
                  : 0}
                명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {Array.isArray(config.data) && config.data.length > 0
                  ? Math.round(
                      config.data.reduce(
                        (sum, item) => sum + (item.수요기도회 || 0),
                        0
                      ) / config.data.length
                    )
                  : 0}
                명
              </div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>두란노사역모임</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {Array.isArray(config.data)
                  ? config.data.reduce(
                      (sum, item) => sum + (item.두란노모임 || 0),
                      0
                    )
                  : 0}
                명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {Array.isArray(config.data) && config.data.length > 0
                  ? Math.round(
                      config.data.reduce(
                        (sum, item) => sum + (item.두란노모임 || 0),
                        0
                      ) / config.data.length
                    )
                  : 0}
                명
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
