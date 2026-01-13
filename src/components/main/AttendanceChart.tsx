import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useEffect, useMemo, useRef } from 'react';

// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

// 범례와 차트 간 간격 조정 플러그인
const legendSpacing = {
  id: 'legendSpacing',
  beforeInit(chart: any, args: any, opts: any) {
    const fit = chart.legend.fit;
    chart.legend.fit = function fitWithSpacing() {
      fit.call(this);
      this.height += opts?.extra ?? 0; // 범례 아래 추가 공간
    };
  },
};

interface AttendanceChartProps {
  attendanceData2025: {
    attendanceXAxis: string[];
    attendanceYAxisMax: number | null;
    attendanceCounts: {
      sunday: number;
      sundayYoungAdult: number;
      wednesdayYoungAdult: number;
      fridayYoungAdult: number;
    }[];
    attendanceAggregationSum: {
      sunday: number;
      sundayYoungAdult: number;
      wednesdayYoungAdult: number;
      fridayYoungAdult: number;
    };
    attendanceAggregationAverage: {
      sunday: number;
      sundayYoungAdult: number;
      wednesdayYoungAdult: number;
      fridayYoungAdult: number;
    };
  } | null;
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

  // 차트 제목을 chartType에 따라 동적으로 설정
  const getChartTitle = () => {
    switch (chartType) {
      case 'gook':
        return '국별 출석 수 현황';
      case 'group':
        return '그룹별 출석 수 현황';
      case 'sun':
        return '순별 출석 수 현황';
      default:
        return '출석 수 현황';
    }
  };

  // API 응답 구조에 맞는 데이터 처리
  const chartData = useMemo(() => {
    if (!attendanceData2025) {
      return {
        labels: [],
        datasets: [],
        summary: {
          sunday: 0,
          sundayYoungAdult: 0,
          wednesdayYoungAdult: 0,
          fridayYoungAdult: 0,
        },
        averages: {
          sunday: 0,
          sundayYoungAdult: 0,
          wednesdayYoungAdult: 0,
          fridayYoungAdult: 0,
        },
        maxValue: 10,
      };
    }

    // 차트 타입에 따라 데이터 필터링
    let filteredLabels: string[] = [];
    let filteredCounts: any[] = [];

    if (chartType === 'gook') {
      // 국별: "국"으로 끝나는 항목만 표시
      const gookIndices: number[] = [];
      attendanceData2025.attendanceXAxis?.forEach((item, index) => {
        if (item && item.endsWith('국')) {
          gookIndices.push(index);
        }
      });

      filteredLabels = gookIndices.map(index => attendanceData2025.attendanceXAxis[index]);
      filteredCounts = gookIndices.map(index => attendanceData2025.attendanceCounts[index]);
    } else if (chartType === 'group') {
      // 그룹별: "그룹"으로 끝나는 항목만 표시
      const groupIndices: number[] = [];
      attendanceData2025.attendanceXAxis?.forEach((item, index) => {
        if (item && item.includes('그룹') && !item.includes('순')) {
          groupIndices.push(index);
        }
      });

      filteredLabels = groupIndices.map(index => attendanceData2025.attendanceXAxis[index]);
      filteredCounts = groupIndices.map(index => attendanceData2025.attendanceCounts[index]);
    } else if (chartType === 'sun') {
      // 순별: "순"으로 끝나는 항목만 표시
      const sunIndices: number[] = [];
      attendanceData2025.attendanceXAxis?.forEach((item, index) => {
        if (item && item.endsWith('순')) {
          sunIndices.push(index);
        }
      });

      filteredLabels = sunIndices.map(index => attendanceData2025.attendanceXAxis[index]);
      filteredCounts = sunIndices.map(index => attendanceData2025.attendanceCounts[index]);
    }

    // 필터링된 데이터로 차트 데이터 생성
    const sundayData = filteredCounts.map(item => item.sunday);
    const sundayYoungAdultData = filteredCounts.map(item => item.sundayYoungAdult);
    const wednesdayYoungAdultData = filteredCounts.map(item => item.wednesdayYoungAdult);
    const fridayYoungAdultData = filteredCounts.map(item => item.fridayYoungAdult);

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: '대예배',
          data: sundayData,
          backgroundColor: 'rgba(38, 58, 153, 0.8)',
          borderColor: 'rgba(38, 58, 153, 1)',
          borderWidth: 1,
        },
        {
          label: '주일청년예배',
          data: sundayYoungAdultData,
          backgroundColor: 'rgba(151, 180, 222, 0.8)',
          borderColor: 'rgba(151, 180, 222, 1)',
          borderWidth: 1,
        },
        {
          label: '수요제자기도회',
          data: wednesdayYoungAdultData,
          backgroundColor: 'rgba(255, 193, 7, 0.8)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1,
        },
        {
          label: '두란노사역자모임',
          data: fridayYoungAdultData,
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
        },
      ],
      summary: attendanceData2025.attendanceAggregationSum || {
        sunday: 0,
        sundayYoungAdult: 0,
        wednesdayYoungAdult: 0,
        fridayYoungAdult: 0,
      },
      averages: attendanceData2025.attendanceAggregationAverage || {
        sunday: 0,
        sundayYoungAdult: 0,
        wednesdayYoungAdult: 0,
        fridayYoungAdult: 0,
      },
      maxValue: attendanceData2025.attendanceYAxisMax || 10,
    };
  }, [attendanceData2025, chartType]);

  // 차트 생성
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartData.labels || chartData.labels.length === 0) return;

    // 기존 차트 인스턴스 제거
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: chartData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // @ts-ignore - 커스텀 플러그인
          legendSpacing: {
            extra: 16, // 범례와 차트 간 16px 간격 추가
          },
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
                const label = context[0].label;
                return `${label}`;
              },
              label: function (context) {
                const value = context.parsed.y;
                return `출석 수: ${value}명`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: chartData.maxValue,
            ticks: {
              stepSize: 5, // 5단위로 고정
            },
          },
        },
      },
      plugins: [legendSpacing],
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, selectedGuk, selectedGroup, chartType]);

  if (!chartData.labels || chartData.labels.length === 0) {
    return (
      <div className='chart-container'>
        <h3 className='chart-title'>{getChartTitle()}</h3>
        <div className='no-data-message'>
          {!attendanceData2025 && '데이터를 불러오는 중...'}
          {attendanceData2025 && chartType === 'gook' && '국별 데이터가 없습니다.'}
          {attendanceData2025 && chartType === 'group' && '그룹별 데이터가 없습니다.'}
          {attendanceData2025 && chartType === 'sun' && `순별 데이터가 없습니다. (선택된 그룹: ${selectedGroup})`}
        </div>
      </div>
    );
  }

  return (
    <div className='chart-container'>
      <h3 className='chart-title'>{getChartTitle()}</h3>

      <div className='chart-wrapper'>
        <canvas ref={chartRef}></canvas>
      </div>

      <div className='worship-info'>
        <div className='worship-card'>
          <div className='worship-title'>대예배</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>{chartData.summary.sunday}명</div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>{chartData.averages.sunday}명</div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>주일청년예배</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>{chartData.summary.sundayYoungAdult}명</div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>{chartData.averages.sundayYoungAdult}명</div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>수요제자기도회</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>{chartData.summary.wednesdayYoungAdult}명</div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>{chartData.averages.wednesdayYoungAdult}명</div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>두란노사역자모임</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>{chartData.summary.fridayYoungAdult}명</div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>{chartData.averages.fridayYoungAdult}명</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
