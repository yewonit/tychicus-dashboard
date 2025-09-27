/**
 * DUGIGO 차트 유틸리티
 * 차트 색상 팔레트와 설정을 DUGIGO 토큰 기반으로 제공
 */

// CSS 변수에서 실제 색상값을 가져오는 함수
const getCSSVariable = (variable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

// DUGIGO 차트 색상 팔레트
export const DUGIGO_CHART_COLORS = {
  primary: {
    background: 'rgba(38, 58, 153, 0.8)', // --royal-blue with opacity
    border: 'rgba(38, 58, 153, 1)',
  },
  secondary: {
    background: 'rgba(151, 180, 222, 0.8)', // --dark-sky-blue with opacity
    border: 'rgba(151, 180, 222, 1)',
  },
  success: {
    background: 'rgba(40, 167, 69, 0.8)', // --state-success with opacity
    border: 'rgba(40, 167, 69, 1)',
  },
  warning: {
    background: 'rgba(255, 193, 7, 0.8)', // --state-warning with opacity
    border: 'rgba(255, 193, 7, 1)',
  },
  danger: {
    background: 'rgba(220, 53, 69, 0.8)', // --state-danger with opacity
    border: 'rgba(220, 53, 69, 1)',
  },
  caramel: {
    background: 'rgba(227, 175, 100, 0.8)', // --caramel-essence with opacity
    border: 'rgba(227, 175, 100, 1)',
  },
};

// 기존 Chart.js 색상을 DUGIGO 색상으로 매핑
export const mapLegacyColors = {
  'rgba(153, 102, 255, 0.8)': DUGIGO_CHART_COLORS.primary.background, // 대예배
  'rgba(54, 162, 235, 0.8)': DUGIGO_CHART_COLORS.secondary.background, // 주일청년예배
  'rgba(255, 206, 86, 0.8)': DUGIGO_CHART_COLORS.warning.background, // 수요제자기도회
  'rgba(75, 192, 192, 0.8)': DUGIGO_CHART_COLORS.success.background, // 두란노사역자모임
};

// 기존 보더 색상 매핑
export const mapLegacyBorderColors = {
  'rgba(153, 102, 255, 1)': DUGIGO_CHART_COLORS.primary.border,
  'rgba(54, 162, 235, 1)': DUGIGO_CHART_COLORS.secondary.border,
  'rgba(255, 206, 86, 1)': DUGIGO_CHART_COLORS.warning.border,
  'rgba(75, 192, 192, 1)': DUGIGO_CHART_COLORS.success.border,
};

// DUGIGO 차트 기본 옵션
export const DUGIGO_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: getCSSVariable('--brand-text') || '#2A2829',
        font: {
          family: getCSSVariable('--font-family') || 'system-ui',
          size: 14,
          weight: '500',
        },
      },
    },
    tooltip: {
      backgroundColor: getCSSVariable('--bg-card-dugigo') || '#ffffff',
      titleColor: getCSSVariable('--brand-text') || '#2A2829',
      bodyColor: getCSSVariable('--text-primary-dugigo') || '#2A2829',
      borderColor: getCSSVariable('--border-subtle') || '#e9ecef',
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: {
        color: getCSSVariable('--chart-grid') || '#E5E7EB',
      },
      ticks: {
        color: getCSSVariable('--chart-axis') || '#6B7280',
      },
    },
    y: {
      grid: {
        color: getCSSVariable('--chart-grid') || '#E5E7EB',
      },
      ticks: {
        color: getCSSVariable('--chart-axis') || '#6B7280',
      },
    },
  },
};

// Recharts용 DUGIGO 색상 팔레트
export const DUGIGO_RECHARTS_COLORS = [
  '#263A99', // --royal-blue
  '#97B4DE', // --dark-sky-blue
  '#28a745', // --state-success
  '#ffc107', // --state-warning
  '#dc3545', // --state-danger
  '#E3AF64', // --caramel-essence
];

// 차트 컨테이너 스타일 클래스명
export const DUGIGO_CHART_CONTAINER_CLASS = 'dugigo-chart-container';
export const DUGIGO_CHART_TITLE_CLASS = 'dugigo-chart-title';
