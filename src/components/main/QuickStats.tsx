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
    weeklyStats?.allMemberCount || (weeklyStats as any)?.totalMembers || 0,
    weeklyStats?.lastWeek?.allMemberCount ||
      (weeklyStats?.lastWeek as any)?.totalMembers
  );
  const presentGrowth = calculateGrowth(
    weeklyStats?.weeklyAttendanceMemberCount ||
      (weeklyStats as any)?.totalPresent ||
      0,
    weeklyStats?.lastWeek?.weeklyAttendanceMemberCount ||
      (weeklyStats?.lastWeek as any)?.totalPresent
  );
  const newFamilyGrowth = calculateGrowth(
    weeklyStats?.weeklyNewMemberCount || (weeklyStats as any)?.newFamily || 0,
    weeklyStats?.lastWeek?.weeklyNewMemberCount ||
      (weeklyStats?.lastWeek as any)?.newFamily
  );
  const attendanceRateGrowth = calculateGrowth(
    weeklyStats?.attendanceRate || 0,
    weeklyStats?.lastWeek?.attendanceRate
  );
  const activeAttendanceRateGrowth = calculateGrowth(
    (weeklyStats as any)?.activeAttendanceRate || 0,
    (weeklyStats?.lastWeek as any)?.activeAttendanceRate
  );

  return (
    <div className='quick-stats-grid'>
      <div className='quick-stat-card'>
        <div className='quick-stat-label'>전체 구성원 수</div>
        <div className='quick-stat-value'>
          {loading
            ? '로딩 중...'
            : weeklyStats?.allMemberCount ||
              (weeklyStats as any)?.totalMembers ||
              0}
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
          {loading
            ? '로딩 중...'
            : weeklyStats?.weeklyAttendanceMemberCount ||
              (weeklyStats as any)?.totalPresent ||
              0}
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
          {loading
            ? '로딩 중...'
            : weeklyStats?.weeklyNewMemberCount ||
              (weeklyStats as any)?.newFamily ||
              0}
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
            : `${(weeklyStats as any)?.activeAttendanceRate || 0}%`}
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
