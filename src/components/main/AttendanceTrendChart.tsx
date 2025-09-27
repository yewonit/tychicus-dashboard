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
          <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
          <XAxis
            dataKey='weekLabel'
            stroke='#6B7280'
            interval={0}
            tick={{ fontSize: 11, textAnchor: 'end' }}
            height={70}
            angle={-45}
          />
          <YAxis stroke='#6B7280' />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelFormatter={value => `주차: ${value}`}
            formatter={(value, _name) => [`${value}명`, '출석 인원']}
          />
          <Line
            type='monotone'
            dataKey='출석'
            stroke='#26428B'
            strokeWidth={3}
            dot={{ fill: '#26428B', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: '#26428B', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;
