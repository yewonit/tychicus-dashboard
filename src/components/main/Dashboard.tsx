import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AttendanceTrendData, ContinuousAttendanceStats, Gook, Group } from '../../types';
import { getAccessibleOrganizations } from '../../utils/authService';
import axiosClient from '../../utils/axiosClient';
import AttendanceChart from './AttendanceChart';
import AttendancePopup from './AttendancePopup';
import AttendanceTrendChart from './AttendanceTrendChart';
import ConsecutiveAbsence from './ConsecutiveAbsence';
import ConsecutiveAttendance from './ConsecutiveAttendance';
import DashboardFilter from './DashboardFilter';
import QuickStats from './QuickStats';

const Dashboard: React.FC = () => {
  const [selectedGukId, setSelectedGukId] = useState<number | '전체'>('전체');
  const [selectedGroupId, setSelectedGroupId] = useState<number | '전체'>('전체');
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);
  const [attendancePopupData, setAttendancePopupData] = useState<{
    title: string;
    data: any[];
  }>({
    title: '',
    data: [],
  });

  // API 데이터 상태
  const [gooks, setGooks] = useState<Gook[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState({
    gooks: false,
    groups: false,
    weeklyStats: false,
    weeklyGraph: false,
    continuousAttendance: false,
    attendanceTrend: false,
  });
  const [error, setError] = useState({
    gooks: null as string | null,
    groups: null as string | null,
    weeklyStats: null as string | null,
    weeklyGraph: null as string | null,
    continuousAttendance: null as string | null,
    attendanceTrend: null as string | null,
  });

  // 출석 관련 데이터 상태
  const [weeklyStats, setWeeklyStats] = useState<{
    data?: {
      allMemberCount: number;
      weeklyAttendanceMemberCount: number;
      weeklyNewMemberCount: number;
      attendanceRate: number;
      lastWeek?: {
        allMemberCount: number;
        weeklyAttendanceMemberCount: number;
        weeklyNewMemberCount: number;
        attendanceRate: number;
      };
    };
    error?: any;
  } | null>(null);
  const [weeklyGraphData, setWeeklyGraphData] = useState<{
    attendanceXAxis: string[][];
    attendanceYAxisMax: number | null;
    attendanceCounts: {
      sunday: number;
      sundayYoungAdult: number;
      wednesdayYoungAdult: number;
      fridayYoungAdult: number;
    }[];
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
  } | null>(null);
  const [continuousAttendanceStats, setContinuousAttendanceStats] = useState<ContinuousAttendanceStats | null>(null);
  const [attendanceTrendData, setAttendanceTrendData] = useState<AttendanceTrendData[]>([]);

  // 새로운 API 응답 구조에 맞게 데이터 변환 (group이 2차원 배열)
  const transformAccessibleDataToGooksAndGroups = (accessibleData: { gook: string[]; group: string[][] }) => {
    const transformedGooks: Gook[] = accessibleData.gook.map((name, index) => ({
      id: index + 1, // 임시 ID 생성
      name: `${name}국`, // "1" → "1국"
    }));

    const transformedGroups: Group[] = [];
    accessibleData.group.forEach((groupArray, gookIndex) => {
      groupArray.forEach(groupName => {
        transformedGroups.push({
          id: transformedGroups.length + 1, // 고유 ID 생성
          name: `${groupName}그룹`, // "강병관" → "강병관그룹"
          gookId: gookIndex + 1, // 해당 국의 ID
        });
      });
    });

    return { gooks: transformedGooks, groups: transformedGroups };
  };

  // 접근 가능한 조직 구조 데이터 가져오기
  const fetchAccessibleOrganizations = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, gooks: true, groups: true }));
      setError(prev => ({ ...prev, gooks: null, groups: null }));

      const accessibleData = await getAccessibleOrganizations();

      const { gooks, groups } = transformAccessibleDataToGooksAndGroups(accessibleData);

      setGooks(gooks);
      setGroups(groups);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        gooks: err.response?.data?.message || '조직 데이터를 가져오는데 실패했습니다.',
        groups: err.response?.data?.message || '조직 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, gooks: false, groups: false }));
    }
  }, []);

  // 주간 통계 가져오기
  const fetchWeeklyStats = async (gookId?: number | '전체', groupId?: number | '전체') => {
    try {
      setLoading(prev => ({ ...prev, weeklyStats: true }));
      setError(prev => ({ ...prev, weeklyStats: null }));

      const params: any = {};

      // 국 이름 설정 (접미사 "국" 제거)
      if (gookId && gookId !== '전체') {
        const selectedGook = gooks.find(gook => gook.id === gookId);
        if (selectedGook) {
          params.gook = selectedGook.name.replace('국', ''); // "1국" → "1"
        }
      }

      // 그룹 이름 설정 (접미사 "그룹" 제거)
      if (groupId && groupId !== '전체') {
        const selectedGroup = groups.find(group => group.id === groupId);
        if (selectedGroup) {
          params.group = selectedGroup.name.replace('그룹', ''); // "김종성그룹" → "김종성"
        }
      }

      const response = await axiosClient.get('/attendances/weekly', { params });

      // API 응답 구조에 따라 안전하게 처리 (data 필드 안에 실제 데이터가 있음)
      const responseData = response.data;
      if (responseData && responseData.data) {
        setWeeklyStats(responseData);
      } else {
        setWeeklyStats(null);
      }
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        weeklyStats: err.response?.data?.message || '주간 통계를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, weeklyStats: false }));
    }
  };

  // 주간 그래프 데이터 가져오기
  const fetchWeeklyGraph = useCallback(
    async (gookId?: number | '전체', groupId?: number | '전체') => {
      try {
        setLoading(prev => ({ ...prev, weeklyGraph: true }));
        setError(prev => ({ ...prev, weeklyGraph: null }));

        const params: any = {};

        // 국 이름 설정 (접미사 "국" 제거)
        if (gookId && gookId !== '전체') {
          const selectedGook = gooks.find(gook => gook.id === gookId);
          if (selectedGook) {
            params.gook = selectedGook.name.replace('국', ''); // "1국" → "1"
          }
        }

        // 그룹 이름 설정 (접미사 "그룹" 제거)
        if (groupId && groupId !== '전체') {
          const selectedGroup = groups.find(group => group.id === groupId);
          if (selectedGroup) {
            params.group = selectedGroup.name.replace('그룹', ''); // "김종성그룹" → "김종성"
          }
        }

        const response = await axiosClient.get('/attendances/graph', {
          params,
        });

        // API 응답 구조에 따라 안전하게 처리
        const responseData = response.data;

        // 새로운 API 응답 구조 처리 (data 필드 안에 실제 데이터가 있음)
        if (
          responseData &&
          responseData.data &&
          responseData.data.attendanceXAxis &&
          responseData.data.attendanceCounts
        ) {
          setWeeklyGraphData(responseData.data);
        } else {
          // 예상하지 못한 응답 구조
          setWeeklyGraphData(null);
        }
      } catch (err: any) {
        setError(prev => ({
          ...prev,
          weeklyGraph: err.response?.data?.message || '주간 그래프 데이터를 가져오는데 실패했습니다.',
        }));
      } finally {
        setLoading(prev => ({ ...prev, weeklyGraph: false }));
      }
    },
    [gooks, groups]
  );

  // 연속 결석/출석자 데이터 가져오기
  const fetchContinuousAttendance = async (gookId?: number | '전체', groupId?: number | '전체') => {
    try {
      setLoading(prev => ({ ...prev, continuousAttendance: true }));
      setError(prev => ({ ...prev, continuousAttendance: null }));

      const params: any = {};

      // 국 이름 설정 (접미사 "국" 제거)
      if (gookId && gookId !== '전체') {
        const selectedGook = gooks.find(gook => gook.id === gookId);
        if (selectedGook) {
          params.gook = selectedGook.name.replace('국', ''); // "1국" → "1"
        }
      }

      // 그룹 이름 설정 (접미사 "그룹" 제거)
      if (groupId && groupId !== '전체') {
        const selectedGroup = groups.find(group => group.id === groupId);
        if (selectedGroup) {
          params.group = selectedGroup.name.replace('그룹', ''); // "김종성그룹" → "김종성"
        }
      }

      const response = await axiosClient.get('/attendances/continuous', {
        params,
      });

      // 새로운 API 응답 구조에 맞게 데이터 변환
      const apiData = response.data?.data || response.data;

      const transformedData: ContinuousAttendanceStats = {
        // 연속 결석자 수 (absenteeList 배열 길이로 계산)
        consecutive4Weeks: apiData.absenteeList?.['4weeks']?.length || 0,
        consecutive3Weeks: apiData.absenteeList?.['3weeks']?.length || 0,
        consecutive2Weeks: apiData.absenteeList?.['2weeks']?.length || 0,
        members: {
          consecutive4Weeks: apiData.absenteeList?.['4weeks'] || [],
          consecutive3Weeks: apiData.absenteeList?.['3weeks'] || [],
          consecutive2Weeks: apiData.absenteeList?.['2weeks'] || [],
        },
        // 원본 데이터 보존 (상세 정보 확인용)
        absenteeList: apiData.absenteeList,
        continuousAttendeeCount: apiData.continuousAttendeeCount,
      };

      setContinuousAttendanceStats(transformedData);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        continuousAttendance: err.response?.data?.message || '연속 출석 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, continuousAttendance: false }));
    }
  };

  // 회기 내 전체 청년예배 출석 트렌드 가져오기
  const fetchAttendanceTrend = async () => {
    try {
      setLoading(prev => ({ ...prev, attendanceTrend: true }));
      setError(prev => ({ ...prev, attendanceTrend: null }));

      const response = await axiosClient.get('/attendances/trend');

      // API 응답 구조에 따라 안전하게 처리
      const responseData = response.data;

      let trendData: AttendanceTrendData[] = [];

      // 실제 API 응답 구조: data.weeklySundayYoungAdultAttendanceTrends.xAxis
      if (
        responseData?.data?.weeklySundayYoungAdultAttendanceTrends?.xAxis &&
        Array.isArray(responseData.data.weeklySundayYoungAdultAttendanceTrends.xAxis)
      ) {
        trendData = responseData.data.weeklySundayYoungAdultAttendanceTrends.xAxis.map((item: any) => ({
          weekLabel: item.xAxisName,
          출석: item.count,
        }));
      } else if (Array.isArray(responseData)) {
        trendData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        trendData = responseData.data;
      } else if (responseData && Array.isArray(responseData.trend)) {
        trendData = responseData.trend;
      } else {
        trendData = [];
      }

      setAttendanceTrendData(trendData);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        attendanceTrend: err.response?.data?.message || '출석 트렌드 데이터를 가져오는데 실패했습니다.',
      }));
      setAttendanceTrendData([]); // 오류 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, attendanceTrend: false }));
    }
  };

  // 컴포넌트 마운트 시 접근 가능한 조직 데이터 가져오기
  useEffect(() => {
    fetchAccessibleOrganizations();
    fetchAttendanceTrend(); // 트렌드 데이터는 국/그룹 선택과 무관
  }, [fetchAccessibleOrganizations]);

  // 국/그룹 선택이 변경될 때마다 출석 데이터 가져오기
  useEffect(() => {
    fetchWeeklyStats(selectedGukId, selectedGroupId);
    fetchWeeklyGraph(selectedGukId, selectedGroupId);
    fetchContinuousAttendance(selectedGukId, selectedGroupId);
  }, [selectedGukId, selectedGroupId, fetchWeeklyGraph]);

  // 선택된 국이 변경될 때는 이미 모든 그룹 데이터가 있으므로 별도 처리 불필요
  // (fetchAccessibleOrganizations에서 모든 국과 그룹 데이터를 한번에 가져옴)

  // 선택된 국에 따른 그룹 목록 (API 데이터 기반)
  const availableGroups = useMemo((): {
    value: number | '전체';
    label: string;
  }[] => {
    if (selectedGukId === '전체') {
      return [{ value: '전체', label: '전체' }];
    }

    // 선택된 국에 해당하는 그룹만 필터링
    const filteredGroups = Array.isArray(groups) ? groups.filter(group => group.gookId === selectedGukId) : [];

    const groupOptions = filteredGroups.map(group => ({
      value: group.id,
      label: group.name || `그룹 ${group.id}`,
    }));

    return [{ value: '전체', label: '전체' }, ...groupOptions];
  }, [selectedGukId, groups]);

  // 선택된 그룹의 이름 계산
  const selectedGroupName = useMemo(() => {
    if (selectedGroupId === '전체') {
      return '전체';
    }
    const selectedGroup = groups.find(group => group.id === selectedGroupId);
    return selectedGroup ? selectedGroup.name || `그룹 ${selectedGroup.id}` : '전체';
  }, [selectedGroupId, groups]);

  // 연속 출석 인원 데이터 계산 (continuousAttendeeCount 사용)
  const getConsecutiveAttendanceMembers = (type: string) => {
    if (!continuousAttendanceStats?.continuousAttendeeCount) {
      return [];
    }

    const attendeeData = continuousAttendanceStats.continuousAttendeeCount;
    let members: any[] = [];

    // 타입에 따라 해당하는 데이터 가져오기
    switch (type) {
      case 'wednesday':
        members = [
          ...(attendeeData.wednesdayYoungAdult?.['4weeks'] || []),
          ...(attendeeData.wednesdayYoungAdult?.['3weeks'] || []),
          ...(attendeeData.wednesdayYoungAdult?.['2weeks'] || []),
        ];
        break;
      case 'friday':
        members = [
          ...(attendeeData.fridayYoungAdult?.['4weeks'] || []),
          ...(attendeeData.fridayYoungAdult?.['3weeks'] || []),
          ...(attendeeData.fridayYoungAdult?.['2weeks'] || []),
        ];
        break;
      case 'sundayYoungAdult':
        members = [
          ...(attendeeData.sundayYoungAdult?.['4weeks'] || []),
          ...(attendeeData.sundayYoungAdult?.['3weeks'] || []),
          ...(attendeeData.sundayYoungAdult?.['2weeks'] || []),
        ];
        break;
      case 'special': // 대예배
        members = [
          ...(attendeeData.sunday?.['4weeks'] || []),
          ...(attendeeData.sunday?.['3weeks'] || []),
          ...(attendeeData.sunday?.['2weeks'] || []),
        ];
        break;
      default:
        return [];
    }

    // 데이터 변환 (API 응답 형식을 컴포넌트가 기대하는 형식으로)
    return members.map(member => ({
      name: member.name,
      team: member.organization || '',
      role: member.role,
      consecutiveWeeks: getConsecutiveWeeks(member, attendeeData, type),
    }));
  };

  // 연속 주차 계산 헬퍼 함수 (키에서 숫자 추출)
  const getConsecutiveWeeks = (member: any, attendeeData: any, type: string) => {
    const typeData = attendeeData[type === 'special' ? 'sunday' : type];
    if (!typeData) return 0;

    // 각 주차별 배열에서 해당 멤버 찾기
    const weekKeys = ['4weeks', '3weeks', '2weeks'];
    for (const weekKey of weekKeys) {
      if (typeData[weekKey]?.some((m: any) => m.name === member.name)) {
        // "4weeks" -> "4", "3weeks" -> "3", "2weeks" -> "2"
        return parseInt(weekKey.split('weeks')[0]);
      }
    }
    return 0;
  };

  // 팝업창 열기 함수
  const openAttendancePopup = (type: string, title: string) => {
    const data = getConsecutiveAttendanceMembers(type);
    setAttendancePopupData({
      title: title,
      data: data,
    });
    setShowAttendancePopup(true);
  };

  return (
    <>
      <div className='dashboard-container'>
        <div className='dashboard-header'>
          <h1>청년회 대시보드</h1>
          <p>코람데오 청년회 현황을 한눈에 확인하세요</p>
        </div>

        <DashboardFilter
          selectedGukId={selectedGukId}
          selectedGroupId={selectedGroupId}
          selectedGroupName={selectedGroupName}
          gooks={gooks}
          groups={groups}
          availableGroups={availableGroups}
          loading={loading}
          error={error}
          onGukChange={value => {
            setSelectedGukId(value);
            setSelectedGroupId('전체');
          }}
          onGroupChange={setSelectedGroupId}
        />

        <QuickStats weeklyStats={weeklyStats} loading={loading.weeklyStats} />

        <AttendanceChart
          attendanceData2025={weeklyGraphData}
          selectedGuk={selectedGukId === '전체' ? '전체' : gooks.find(g => g.id === selectedGukId)?.name || '전체'}
          selectedGroup={
            selectedGroupId === '전체' ? '전체' : groups.find(g => g.id === selectedGroupId)?.name || '전체'
          }
          chartType={
            selectedGukId === '전체'
              ? 'gook' // 국과 그룹이 모두 전체 → 국별 출석 수 현황
              : selectedGroupId === '전체'
                ? 'group' // 국은 선택, 그룹은 전체 → 그룹별 출석 수 현황
                : 'sun' // 국과 그룹 모두 선택 → 순별 출석 수 현황
          }
        />

        <ConsecutiveAbsence
          continuousAttendanceStats={continuousAttendanceStats}
          loading={loading.continuousAttendance}
          error={error.continuousAttendance}
        />

        <ConsecutiveAttendance
          selectedGukId={selectedGukId}
          continuousAttendanceStats={continuousAttendanceStats}
          loading={loading.continuousAttendance}
          error={error.continuousAttendance}
          onOpenAttendancePopup={openAttendancePopup}
        />

        {/* 차트 섹션 */}
        <div className='charts-grid'>
          <AttendanceTrendChart
            attendanceTrendData={attendanceTrendData}
            loading={loading.attendanceTrend}
            error={error.attendanceTrend}
          />
        </div>

        {/* 최근 활동 섹션 */}
        <div className='activities-section'>
          <h3 className='chart-title'>최근 활동 (심방, 지역모임)</h3>
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text-secondary)',
            }}
          >
            최근 활동 데이터를 불러오는 중...
          </div>
        </div>

        <AttendancePopup
          isOpen={showAttendancePopup}
          title={attendancePopupData.title}
          data={attendancePopupData.data}
          onClose={() => setShowAttendancePopup(false)}
        />
      </div>
    </>
  );
};

export default Dashboard;
