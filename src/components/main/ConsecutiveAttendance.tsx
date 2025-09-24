import React from 'react';

interface ConsecutiveAttendanceProps {
  selectedGukId: number | '전체';
  onOpenAttendancePopup: (type: string, title: string) => void;
}

const ConsecutiveAttendance: React.FC<ConsecutiveAttendanceProps> = ({
  selectedGukId,
  onOpenAttendancePopup,
}) => {
  // 연속 출석 통계 데이터
  const consecutiveStats = {
    wednesday: {
      consecutive4Weeks: 15,
      consecutive3Weeks: 22,
      consecutive2Weeks: 35,
    },
    friday: {
      consecutive4Weeks: 12,
      consecutive3Weeks: 18,
      consecutive2Weeks: 28,
    },
    special: {
      consecutive4Weeks: 20,
      consecutive3Weeks: 30,
      consecutive2Weeks: 45,
    },
  };

  return (
    <div className='consecutive-attendance-section'>
      <h3 className='chart-title'>최근 4주 연속 출석 현황</h3>
      <div className='consecutive-grid'>
        <div className='consecutive-card'>
          <h4 className='consecutive-title'>🙏 수요제자기도회</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.wednesday.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.wednesday.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.wednesday.consecutive2Weeks}
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
                {consecutiveStats.friday.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.friday.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.friday.consecutive2Weeks}
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
          <h4 className='consecutive-title'>🎯 대예배</h4>
          <div className='consecutive-stats'>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.special.consecutive4Weeks}
              </div>
              <div className='consecutive-stat-label'>4주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.special.consecutive3Weeks}
              </div>
              <div className='consecutive-stat-label'>3주 연속</div>
            </div>
            <div className='consecutive-stat'>
              <div className='consecutive-stat-value'>
                {consecutiveStats.special.consecutive2Weeks}
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
