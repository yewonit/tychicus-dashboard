import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AccessibleOrganization,
  AttendanceTrendData,
  ContinuousAttendanceStats,
  Gook,
  Group,
  WeeklyStats,
} from '../../types';
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
  const [selectedGroupId, setSelectedGroupId] = useState<number | '전체'>(
    '전체'
  );
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
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [continuousAttendanceStats, setContinuousAttendanceStats] =
    useState<ContinuousAttendanceStats | null>(null);
  const [attendanceTrendData, setAttendanceTrendData] = useState<
    AttendanceTrendData[]
  >([]);

  // 접근 가능한 조직 데이터 변환 함수 (depth 기반)
  const transformAccessibleDataToGooksAndGroups = (
    accessibleData: AccessibleOrganization[]
  ) => {
    const transformedGooks: Gook[] = [];
    const transformedGroups: Group[] = [];

    // depth 1에서 국 목록 추출
    const gooksData = accessibleData.find(item => item.depth === 1);
    if (gooksData && 'gooks' in gooksData) {
      gooksData.gooks.forEach(gookItem => {
        const gook: Gook = {
          id: gookItem.id,
          name: gookItem.name,
        };
        transformedGooks.push(gook);
      });
    }

    // depth 2에서 각 국의 그룹 목록 추출 (현재는 1국만 있음)
    accessibleData
      .filter(item => item.depth === 2)
      .forEach(gookData => {
        if ('groups' in gookData && 'id' in gookData) {
          gookData.groups.forEach(groupItem => {
            const group: Group = {
              id: groupItem.id,
              name: groupItem.name,
              gookId: gookData.id,
              gookName: gookData.name,
              organization_name: groupItem.name,
            };
            transformedGroups.push(group);
          });
        }
      });

    return { gooks: transformedGooks, groups: transformedGroups };
  };

  // 접근 가능한 조직 구조 데이터 가져오기
  const fetchAccessibleOrganizations = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, gooks: true, groups: true }));
      setError(prev => ({ ...prev, gooks: null, groups: null }));

      const accessibleData = await getAccessibleOrganizations();

      const { gooks, groups } =
        transformAccessibleDataToGooksAndGroups(accessibleData);

      setGooks(gooks);
      setGroups(groups);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        gooks:
          err.response?.data?.message ||
          '조직 데이터를 가져오는데 실패했습니다.',
        groups:
          err.response?.data?.message ||
          '조직 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, gooks: false, groups: false }));
    }
  }, []);

  // 주간 통계 가져오기
  const fetchWeeklyStats = async (
    gookId?: number | '전체',
    groupId?: number | '전체'
  ) => {
    try {
      setLoading(prev => ({ ...prev, weeklyStats: true }));
      setError(prev => ({ ...prev, weeklyStats: null }));

      const params: any = {};

      // 국 ID 설정
      if (gookId && gookId !== '전체') {
        params.gook = gookId;
      }

      // 그룹 ID 설정
      if (groupId && groupId !== '전체') {
        params.group = groupId;
      }

      const response = await axiosClient.get('/attendances/weekly', { params });

      setWeeklyStats(response.data);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        weeklyStats:
          err.response?.data?.message || '주간 통계를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, weeklyStats: false }));
    }
  };

  // 주간 그래프 데이터 가져오기
  const fetchWeeklyGraph = async (
    gookId?: number | '전체',
    groupId?: number | '전체'
  ) => {
    try {
      setLoading(prev => ({ ...prev, weeklyGraph: true }));
      setError(prev => ({ ...prev, weeklyGraph: null }));

      const params: any = {};

      // 국 ID 설정
      if (gookId && gookId !== '전체') {
        params.gook = gookId;
      }

      // 그룹 ID 설정
      if (groupId && groupId !== '전체') {
        params.group = groupId;
      }

      const response = await axiosClient.get('/attendances/graph', { params });

      // API 응답 구조에 따라 안전하게 처리
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        // 데이터 처리 로직 제거됨
      } else if (responseData && Array.isArray(responseData.data)) {
        // 데이터 처리 로직 제거됨
      } else if (responseData && Array.isArray(responseData.graph)) {
        // 데이터 처리 로직 제거됨
      } else {
        // 예상하지 못한 응답 구조
      }
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        weeklyGraph:
          err.response?.data?.message ||
          '주간 그래프 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, weeklyGraph: false }));
    }
  };

  // 연속 결석/출석자 데이터 가져오기
  const fetchContinuousAttendance = async (
    gookId?: number | '전체',
    groupId?: number | '전체'
  ) => {
    try {
      setLoading(prev => ({ ...prev, continuousAttendance: true }));
      setError(prev => ({ ...prev, continuousAttendance: null }));

      const params: any = {};

      // 국 ID 설정
      if (gookId && gookId !== '전체') {
        params.gook = gookId;
      }

      // 그룹 ID 설정
      if (groupId && groupId !== '전체') {
        params.group = groupId;
      }

      const response = await axiosClient.get('/attendances/continuous', {
        params,
      });
      setContinuousAttendanceStats(response.data);
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        continuousAttendance:
          err.response?.data?.message ||
          '연속 출석 데이터를 가져오는데 실패했습니다.',
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
        Array.isArray(
          responseData.data.weeklySundayYoungAdultAttendanceTrends.xAxis
        )
      ) {
        trendData =
          responseData.data.weeklySundayYoungAdultAttendanceTrends.xAxis.map(
            (item: any) => ({
              weekLabel: item.xAxisName,
              출석: item.count,
            })
          );
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
        attendanceTrend:
          err.response?.data?.message ||
          '출석 트렌드 데이터를 가져오는데 실패했습니다.',
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
  }, [selectedGukId, selectedGroupId]);

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
    const filteredGroups = Array.isArray(groups)
      ? groups.filter(group => group.gookId === selectedGukId)
      : [];

    const groupOptions = filteredGroups.map(group => ({
      value: group.id,
      label: group.organization_name || group.name || `그룹 ${group.id}`,
    }));

    return [{ value: '전체', label: '전체' }, ...groupOptions];
  }, [selectedGukId, groups]);

  // 선택된 그룹의 이름 계산
  const selectedGroupName = useMemo(() => {
    if (selectedGroupId === '전체') {
      return '전체';
    }
    const selectedGroup = groups.find(group => group.id === selectedGroupId);
    return selectedGroup
      ? selectedGroup.organization_name ||
          selectedGroup.name ||
          `그룹 ${selectedGroup.id}`
      : '전체';
  }, [selectedGroupId, groups]);

  // 연속 출석 인원 데이터 계산
  const getConsecutiveAttendanceMembers = (_type: string) => {
    const sampleData = [
      { name: '김민수', team: '1순', role: '순장', consecutiveWeeks: 4 },
      { name: '이영희', team: '2순', role: null, consecutiveWeeks: 3 },
      { name: '박철수', team: '3순', role: '부순장', consecutiveWeeks: 2 },
    ];
    return sampleData;
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
          attendanceData2025={{
            attendanceXAxis: [],
            attendanceYAxisMax: 10,
            attendanceCounts: [],
            attendanceAggregationSum: {
              sunday: 0,
              sundayYoungAdult: 0,
              wednesdayYoungAdult: 0,
              fridayYoungAdult: 0,
            },
            attendanceAggregationAverage: {
              sunday: 0,
              sundayYoungAdult: 0,
              wednesdayYoungAdult: 0,
              fridayYoungAdult: 0,
            },
          }}
          selectedGuk={
            selectedGukId === '전체'
              ? '전체'
              : gooks.find(g => g.id === selectedGukId)?.name || '전체'
          }
          selectedGroup={
            selectedGroupId === '전체'
              ? '전체'
              : groups.find(g => g.id === selectedGroupId)?.name || '전체'
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
