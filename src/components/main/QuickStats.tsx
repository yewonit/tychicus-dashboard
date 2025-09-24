import React from 'react';
import { WeeklyStats } from '../../types';

interface QuickStatsProps {
  weeklyStats: WeeklyStats | null;
  loading: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({ weeklyStats, loading }) => {
  // 전주 대비 계산 함수
  const calculateGrowth = (current: number, lastWeek?: number) => {
    if (!lastWeek || lastWeek === 0) return { value: 0, isPositive: true };
    const diff = current - lastWeek;
    return {
      value: Math.abs(diff),
      isPositive: diff >= 0,
    };
  };

  // 각 필드별 전주 대비 데이터 계산
  const membersGrowth = calculateGrowth(
    weeklyStats?.totalMembers || 0,
    weeklyStats?.lastWeek?.totalMembers
  );
  const presentGrowth = calculateGrowth(
    weeklyStats?.totalPresent || 0,
    weeklyStats?.lastWeek?.totalPresent
  );
  const newFamilyGrowth = calculateGrowth(
    weeklyStats?.newFamily || 0,
    weeklyStats?.lastWeek?.newFamily
  );
  const attendanceRateGrowth = calculateGrowth(
    weeklyStats?.attendanceRate || 0,
    weeklyStats?.lastWeek?.attendanceRate
  );
  const activeAttendanceRateGrowth = calculateGrowth(
    weeklyStats?.activeAttendanceRate || 0,
    weeklyStats?.lastWeek?.activeAttendanceRate
  );

  return (
    <div className='quick-stats-grid'>
      <div className='quick-stat-card'>
        <div className='quick-stat-label'>전체 구성원 수</div>
        <div className='quick-stat-value'>
          {loading ? '로딩 중...' : weeklyStats?.totalMembers || 0}
        </div>
        <div
          className={`quick-stat-growth ${membersGrowth.isPositive ? 'positive' : 'negative'}`}
        >
          <span className='growth-icon'>
            {membersGrowth.isPositive ? '↗' : '↘'}
          </span>
          전주 대비 {membersGrowth.isPositive ? '+' : '-'}
          {membersGrowth.value}명
        </div>
      </div>

      <div className='quick-stat-card'>
        <div className='quick-stat-label'>이번주 출석 수</div>
        <div className='quick-stat-value'>
          {loading ? '로딩 중...' : weeklyStats?.totalPresent || 0}
        </div>
        <div
          className={`quick-stat-growth ${presentGrowth.isPositive ? 'positive' : 'negative'}`}
        >
          <span className='growth-icon'>
            {presentGrowth.isPositive ? '↗' : '↘'}
          </span>
          전주 대비 {presentGrowth.isPositive ? '+' : '-'}
          {presentGrowth.value}명
        </div>
      </div>

      <div className='quick-stat-card'>
        <div className='quick-stat-label'>이번주 새가족</div>
        <div className='quick-stat-value'>
          {loading ? '로딩 중...' : weeklyStats?.newFamily || 0}
        </div>
        <div
          className={`quick-stat-growth ${newFamilyGrowth.isPositive ? 'positive' : 'negative'}`}
        >
          <span className='growth-icon'>
            {newFamilyGrowth.isPositive ? '↗' : '↘'}
          </span>
          전주 대비 {newFamilyGrowth.isPositive ? '+' : '-'}
          {newFamilyGrowth.value}명
        </div>
      </div>

      <div className='quick-stat-card'>
        <div className='quick-stat-label'>전체 출석률</div>
        <div className='quick-stat-value'>
          {loading ? '로딩 중...' : `${weeklyStats?.attendanceRate || 0}%`}
        </div>
        <div
          className={`quick-stat-growth ${attendanceRateGrowth.isPositive ? 'positive' : 'negative'}`}
        >
          <span className='growth-icon'>
            {attendanceRateGrowth.isPositive ? '↗' : '↘'}
          </span>
          전주 대비 {attendanceRateGrowth.isPositive ? '+' : '-'}
          {attendanceRateGrowth.value}%
        </div>
      </div>

      <div className='quick-stat-card'>
        <div className='quick-stat-label'>활성인원 출석률</div>
        <div className='quick-stat-value'>
          {loading
            ? '로딩 중...'
            : `${weeklyStats?.activeAttendanceRate || 0}%`}
        </div>
        <div
          className={`quick-stat-growth ${activeAttendanceRateGrowth.isPositive ? 'positive' : 'negative'}`}
        >
          <span className='growth-icon'>
            {activeAttendanceRateGrowth.isPositive ? '↗' : '↘'}
          </span>
          전주 대비 {activeAttendanceRateGrowth.isPositive ? '+' : '-'}
          {activeAttendanceRateGrowth.value}%
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
