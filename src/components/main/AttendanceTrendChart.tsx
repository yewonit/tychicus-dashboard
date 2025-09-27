import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AttendanceTrendData } from '../../types';

interface AttendanceTrendChartProps {
  attendanceTrendData: AttendanceTrendData[];
  loading: boolean;
  error: string | null;
}

const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({
  attendanceTrendData,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className='chart-card'>
        <h3 className='chart-title'>주차별 청년예배 출석 트렌드</h3>
        <div className='center-loading'>
          출석 트렌드 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='chart-card'>
        <h3 className='chart-title'>주차별 청년예배 출석 트렌드</h3>
        <div className='center-loading error-text'>⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className='chart-card'>
      <h3 className='chart-title'>주차별 청년예배 출석 트렌드</h3>
      <ResponsiveContainer width='100%' height={350}>
        <LineChart
          data={Array.isArray(attendanceTrendData) ? attendanceTrendData : []}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='var(--chart-grid)' />
          <XAxis
            dataKey='weekLabel'
            stroke='var(--chart-axis)'
            interval={0}
            tick={{ fontSize: 11, textAnchor: 'end' }}
            height={70}
            angle={-45}
          />
          <YAxis stroke='var(--chart-axis)' />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card-dugigo)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-light-dugigo)',
            }}
            labelFormatter={value => `주차: ${value}`}
            formatter={(value, _name) => [`${value}명`, '출석 인원']}
          />
          <Line
            type='monotone'
            dataKey='출석'
            stroke='var(--chart-primary)'
            strokeWidth={3}
            dot={{ fill: 'var(--chart-primary)', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: 'var(--chart-primary)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;
