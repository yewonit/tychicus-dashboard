import React from 'react';
import { ContinuousAttendanceStats } from '../../types';

interface ConsecutiveAbsenceProps {
  continuousAttendanceStats: ContinuousAttendanceStats | null;
  loading: boolean;
  error: string | null;
}

const ConsecutiveAbsence: React.FC<ConsecutiveAbsenceProps> = ({
  continuousAttendanceStats,
  loading,
  error,
}) => {
  // 디버깅을 위한 로그
  console.log('ConsecutiveAbsence 렌더링:', {
    loading,
    error,
    continuousAttendanceStats,
    hasData: !!continuousAttendanceStats,
    consecutive4Weeks: continuousAttendanceStats?.consecutive4Weeks,
    consecutive3Weeks: continuousAttendanceStats?.consecutive3Weeks,
    consecutive2Weeks: continuousAttendanceStats?.consecutive2Weeks,
    members4Weeks:
      continuousAttendanceStats?.members?.consecutive4Weeks?.length,
    members3Weeks:
      continuousAttendanceStats?.members?.consecutive3Weeks?.length,
    members2Weeks:
      continuousAttendanceStats?.members?.consecutive2Weeks?.length,
  });
  if (loading) {
    return (
      <div className='consecutive-absence-section'>
        <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          연속 결석 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='consecutive-absence-section'>
        <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--error)',
          }}
        >
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className='consecutive-absence-section'>
      <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
      <div className='absence-grid'>
        <div className='absence-card high-severity'>
          <h4 className='absence-title'>🚨 4주 연속 결석자</h4>
          <div className='absence-stats'>
            <div className='absence-stat-value high-severity'>
              {continuousAttendanceStats?.consecutive4Weeks || 0}명
            </div>
          </div>
          <div className='absence-list'>
            {(continuousAttendanceStats?.members?.consecutive4Weeks || [])
              .slice(0, 5)
              .map((member, index) => (
                <div key={index} className='absence-item'>
                  <div className='absence-member-info'>
                    <span className='absence-member-name'>{member.name}</span>
                    {member.role && (
                      <span className='absence-member-role'>{member.role}</span>
                    )}
                    <span className='absence-team-name'>{member.team}</span>
                  </div>
                  <span className='absence-badge high-severity'>
                    {member.consecutiveWeeks}주 연속
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className='absence-card medium-severity'>
          <h4 className='absence-title'>⚠️ 3주 연속 결석자</h4>
          <div className='absence-stats'>
            <div className='absence-stat-value medium-severity'>
              {continuousAttendanceStats?.consecutive3Weeks || 0}명
            </div>
          </div>
          <div className='absence-list'>
            {(continuousAttendanceStats?.members?.consecutive3Weeks || [])
              .slice(0, 5)
              .map((member, index) => (
                <div key={index} className='absence-item'>
                  <div className='absence-member-info'>
                    <span className='absence-member-name'>{member.name}</span>
                    {member.role && (
                      <span className='absence-member-role'>{member.role}</span>
                    )}
                    <span className='absence-team-name'>{member.team}</span>
                  </div>
                  <span className='absence-badge medium-severity'>
                    {member.consecutiveWeeks}주 연속
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className='absence-card low-severity'>
          <h4 className='absence-title'>🔄 2주 연속 결석자</h4>
          <div className='absence-stats'>
            <div className='absence-stat-value low-severity'>
              {continuousAttendanceStats?.consecutive2Weeks || 0}명
            </div>
          </div>
          <div className='absence-list'>
            {(continuousAttendanceStats?.members?.consecutive2Weeks || [])
              .slice(0, 5)
              .map((member, index) => (
                <div key={index} className='absence-item'>
                  <div className='absence-member-info'>
                    <span className='absence-member-name'>{member.name}</span>
                    {member.role && (
                      <span className='absence-member-role'>{member.role}</span>
                    )}
                    <span className='absence-team-name'>{member.team}</span>
                  </div>
                  <span className='absence-badge low-severity'>
                    {member.consecutiveWeeks}주 연속
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsecutiveAbsence;
