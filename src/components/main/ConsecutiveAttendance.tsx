import React from 'react';
import { ContinuousAttendanceStats } from '../../types';

interface ConsecutiveAttendanceProps {
  selectedGukId: number | '전체';
  continuousAttendanceStats: ContinuousAttendanceStats | null;
  loading: boolean;
  error: string | null;
  onOpenAttendancePopup: (type: string, title: string) => void;
}

const ConsecutiveAttendance: React.FC<ConsecutiveAttendanceProps> = ({
  selectedGukId,
  continuousAttendanceStats,
  loading,
  error,
  onOpenAttendancePopup,
}) => {
  // API 데이터에서 연속 출석 통계 추출 (continuousAttendeeCount 사용)
  const getConsecutiveStats = (
    type:
      | 'wednesdayYoungAdult'
      | 'fridayYoungAdult'
      | 'sunday'
      | 'sundayYoungAdult'
  ) => {
    const data = continuousAttendanceStats?.continuousAttendeeCount?.[type];
    return {
      consecutive4Weeks: data?.['4weeks']?.length || 0,
      consecutive3Weeks: data?.['3weeks']?.length || 0,
      consecutive2Weeks: data?.['2weeks']?.length || 0,
    };
  };

  const wednesdayStats = getConsecutiveStats('wednesdayYoungAdult');
  const fridayStats = getConsecutiveStats('fridayYoungAdult');
  const sundayStats = getConsecutiveStats('sunday');
  const sundayYoungAdultStats = getConsecutiveStats('sundayYoungAdult');

  if (loading) {
    return (
      <div className='consecutive-attendance-section'>
        <h3 className='chart-title'>최근 4주 연속 출석 현황</h3>
        <div className='center-loading'>
          연속 출석 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='consecutive-attendance-section'>
        <h3 className='chart-title'>최근 4주 연속 출석 현황</h3>
        <div className='center-loading error-text'>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className='consecutive-attendance-section'>
      <h3 className='chart-title'>최근 4주 연속 출석 현황</h3>
      <div className='consecutive-grid'>
        <div className='consecutive-card'>
          <h4 className='consecutive-title'>🙏 수요제자기도회</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {wednesdayStats.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {wednesdayStats.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {wednesdayStats.consecutive2Weeks}
              </div>
              <div className='consecutive-stat-label'>2주 연속</div>
            </div>
          </div>
          {selectedGukId !== '전체' && (
            <button
              className='view-button'
              onClick={() =>
                onOpenAttendancePopup(
                  'wednesday',
                  '수요제자기도회 4주간 연속 출석 인원'
                )
              }
            >
              출석인원 확인
            </button>
          )}
        </div>

        <div className='consecutive-card'>
          <h4 className='consecutive-title'>⛪ 두란노사역자모임</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {fridayStats.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {fridayStats.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {fridayStats.consecutive2Weeks}
              </div>
              <div className='consecutive-stat-label'>2주 연속</div>
            </div>
          </div>
          {selectedGukId !== '전체' && (
            <button
              className='view-button'
              onClick={() =>
                onOpenAttendancePopup(
                  'friday',
                  '두란노사역자모임 4주간 연속 출석 인원'
                )
              }
            >
              출석인원 확인
            </button>
          )}
        </div>

        <div className='consecutive-card'>
          <h4 className='consecutive-title'>⛪ 주일청년예배</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayYoungAdultStats.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayYoungAdultStats.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayYoungAdultStats.consecutive2Weeks}
              </div>
              <div className='consecutive-stat-label'>2주 연속</div>
            </div>
          </div>
          {selectedGukId !== '전체' && (
            <button
              className='view-button'
              onClick={() =>
                onOpenAttendancePopup(
                  'sundayYoungAdult',
                  '주일청년예배 4주간 연속 출석 인원'
                )
              }
            >
              출석인원 확인
            </button>
          )}
        </div>

        <div className='consecutive-card'>
          <h4 className='consecutive-title'>🎯 대예배</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayStats.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayStats.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {sundayStats.consecutive2Weeks}
              </div>
              <div className='consecutive-stat-label'>2주 연속</div>
            </div>
          </div>
          {selectedGukId !== '전체' && (
            <button
              className='view-button'
              onClick={() =>
                onOpenAttendancePopup('special', '대예배 4주간 연속 출석 인원')
              }
            >
              출석인원 확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsecutiveAttendance;
