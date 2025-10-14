import React from 'react';
import { ContinuousAttendanceStats } from '../../types';

interface ConsecutiveAbsenceProps {
  continuousAttendanceStats: ContinuousAttendanceStats | null;
  loading: boolean;
  error: string | null;
}

const ConsecutiveAbsence: React.FC<ConsecutiveAbsenceProps> = ({ continuousAttendanceStats, loading, error }) => {
  // 연속 주차 계산 헬퍼 함수 (absenteeList용)
  const getConsecutiveWeeks = (member: any, absenteeList: any) => {
    if (!absenteeList) return 0;

    // 각 주차별 배열에서 해당 멤버 찾기
    const weekKeys = ['4weeks', '3weeks', '2weeks'];
    for (const weekKey of weekKeys) {
      if (absenteeList[weekKey]?.some((m: any) => m.name === member.name)) {
        // "4weeks" -> "4", "3weeks" -> "3", "2weeks" -> "2"
        return parseInt(weekKey.split('weeks')[0]);
      }
    }
    return 0;
  };

  // absenteeList 데이터에서 연속 결석 통계 추출
  const getAbsenceStats = () => {
    const absenteeList = continuousAttendanceStats?.absenteeList;

    // absenteeList 데이터가 있으면 사용, 없으면 기존 구조 사용
    if (absenteeList) {
      // 각 주차별 멤버에 연속 주차 정보 추가
      const processMembers = (members: any[]) => {
        return members.map(member => ({
          ...member,
          consecutiveWeeks: getConsecutiveWeeks(member, absenteeList),
        }));
      };

      return {
        consecutive4Weeks: absenteeList['4weeks']?.length || 0,
        consecutive3Weeks: absenteeList['3weeks']?.length || 0,
        consecutive2Weeks: absenteeList['2weeks']?.length || 0,
        members: {
          consecutive4Weeks: processMembers(absenteeList['4weeks'] || []),
          consecutive3Weeks: processMembers(absenteeList['3weeks'] || []),
          consecutive2Weeks: processMembers(absenteeList['2weeks'] || []),
        },
      };
    }

    // 기존 구조 사용 (fallback)
    return {
      consecutive4Weeks: continuousAttendanceStats?.consecutive4Weeks || 0,
      consecutive3Weeks: continuousAttendanceStats?.consecutive3Weeks || 0,
      consecutive2Weeks: continuousAttendanceStats?.consecutive2Weeks || 0,
      members: continuousAttendanceStats?.members || {
        consecutive4Weeks: [],
        consecutive3Weeks: [],
        consecutive2Weeks: [],
      },
    };
  };

  const absenceStats = getAbsenceStats();
  if (loading) {
    return (
      <div className='consecutive-absence-section'>
        <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
        <div className='center-loading'>연속 결석 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='consecutive-absence-section'>
        <h3 className='chart-title'>최근 4주 청년예배 연속 결석 현황</h3>
        <div className='center-loading error-text'>⚠️ {error}</div>
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
            <div className='absence-stat-value high-severity'>{absenceStats.consecutive4Weeks}명</div>
          </div>
          <div className='absence-list'>
            {(absenceStats.members.consecutive4Weeks || []).map((member, index) => (
              <div key={index} className='absence-item'>
                <div className='absence-member-info'>
                  <span className='absence-member-name'>{member.name}</span>
                  {member.role && <span className='absence-member-role'>{member.role}</span>}
                  <span className='absence-team-name'>{member.team}</span>
                </div>
                <span className='absence-badge high-severity'>{member.consecutiveWeeks}주 연속</span>
              </div>
            ))}
          </div>
        </div>

        <div className='absence-card medium-severity'>
          <h4 className='absence-title'>⚠️ 3주 연속 결석자</h4>
          <div className='absence-stats'>
            <div className='absence-stat-value medium-severity'>{absenceStats.consecutive3Weeks}명</div>
          </div>
          <div className='absence-list'>
            {(absenceStats.members.consecutive3Weeks || []).map((member, index) => (
              <div key={index} className='absence-item'>
                <div className='absence-member-info'>
                  <span className='absence-member-name'>{member.name}</span>
                  {member.role && <span className='absence-member-role'>{member.role}</span>}
                  <span className='absence-team-name'>{member.team}</span>
                </div>
                <span className='absence-badge medium-severity'>{member.consecutiveWeeks}주 연속</span>
              </div>
            ))}
          </div>
        </div>

        <div className='absence-card low-severity'>
          <h4 className='absence-title'>🔄 2주 연속 결석자</h4>
          <div className='absence-stats'>
            <div className='absence-stat-value low-severity'>{absenceStats.consecutive2Weeks}명</div>
          </div>
          <div className='absence-list'>
            {(absenceStats.members.consecutive2Weeks || []).map((member, index) => (
              <div key={index} className='absence-item'>
                <div className='absence-member-info'>
                  <span className='absence-member-name'>{member.name}</span>
                  {member.role && <span className='absence-member-role'>{member.role}</span>}
                  <span className='absence-team-name'>{member.team}</span>
                </div>
                <span className='absence-badge low-severity'>{member.consecutiveWeeks}주 연속</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsecutiveAbsence;
