import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useEffect, useRef } from 'react';

// datalabels 플러그인 등록
Chart.register(ChartDataLabels);

interface AttendanceChartProps {
  attendanceData2025: {
    attendanceXAxis: string[];
    attendanceYAxisMax: number;
    attendanceCounts: number[];
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
  };
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
  const getChartData = () => {
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
      };
    }

    return {
      labels: attendanceData2025.attendanceXAxis || [],
      datasets: [
        {
          label: '대예배',
          data: attendanceData2025.attendanceCounts || [],
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
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
    };
  };

  // 차트 생성
  useEffect(() => {
    if (!chartRef.current) return;

    const chartData = getChartData();
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
            max: attendanceData2025?.attendanceYAxisMax || 10,
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

  const chartData = getChartData();

  if (!chartData.labels || chartData.labels.length === 0) {
    return (
      <div className='chart-container'>
        <h3 className='chart-title'>{getChartTitle()}</h3>
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
              <div className='value'>
                {chartData.summary.sundayYoungAdult}명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {chartData.averages.sundayYoungAdult}명
              </div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>수요제자기도회</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {chartData.summary.wednesdayYoungAdult}명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {chartData.averages.wednesdayYoungAdult}명
              </div>
            </div>
          </div>
        </div>

        <div className='worship-card'>
          <div className='worship-title'>두란노사역자모임</div>
          <div className='worship-stats'>
            <div className='stat-item'>
              <div className='label'>총 출석</div>
              <div className='value'>
                {chartData.summary.fridayYoungAdult}명
              </div>
            </div>
            <div className='stat-item'>
              <div className='label'>평균</div>
              <div className='value'>
                {chartData.averages.fridayYoungAdult}명
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
