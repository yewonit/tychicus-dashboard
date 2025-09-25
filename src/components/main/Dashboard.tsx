import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AttendanceTrendData,
  ContinuousAttendanceStats,
  Gook,
  Group,
  WeeklyGraphData,
  WeeklyStats,
} from '../../types';
import axiosClient from '../../utils/axiosClient';
import logger from '../../utils/logger';
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
  const [weeklyGraphData, setWeeklyGraphData] = useState<WeeklyGraphData[]>([]);
  const [continuousAttendanceStats, setContinuousAttendanceStats] =
    useState<ContinuousAttendanceStats | null>(null);
  const [attendanceTrendData, setAttendanceTrendData] = useState<
    AttendanceTrendData[]
  >([]);

  // 국 데이터 가져오기
  const fetchGooks = async (year?: number) => {
    try {
      setLoading(prev => ({ ...prev, gooks: true }));
      setError(prev => ({ ...prev, gooks: null }));

      const params = year ? { year } : {};
      // 국/그룹 데이터는 운영 서버에서 가져오기
      const response = await axios.get(
        'https://attendance.icoramdeo.com/api/organizations/gooks',
        {
          params,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // API 응답 데이터 구조 확인 및 안전하게 처리
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setGooks(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setGooks(responseData.data);
      } else if (responseData && Array.isArray(responseData.gooks)) {
        setGooks(responseData.gooks);
      } else {
        logger.warn('예상하지 못한 API 응답 구조:', responseData);
        setGooks([]);
      }
    } catch (err: any) {
      logger.error('국 데이터를 가져오는데 실패했습니다:', err);
      setError(prev => ({
        ...prev,
        gooks:
          err.response?.data?.message || '국 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, gooks: false }));
    }
  };

  // 그룹 데이터 가져오기
  const fetchGroups = async (gookId: number) => {
    try {
      setLoading(prev => ({ ...prev, groups: true }));
      setError(prev => ({ ...prev, groups: null }));

      // 그룹 데이터도 운영 서버에서 가져오기
      const response = await axios.get(
        'https://attendance.icoramdeo.com/api/organizations/groups',
        {
          params: { gookId },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // API 응답 데이터 구조 확인 및 안전하게 처리
      const responseData = response.data;
      logger.info('그룹 API 응답', 'Dashboard', { gookId, responseData });

      let groupsData: Group[] = [];
      if (Array.isArray(responseData)) {
        groupsData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        groupsData = responseData.data;
      } else if (responseData && Array.isArray(responseData.groups)) {
        groupsData = responseData.groups;
      } else {
        logger.warn('예상하지 못한 그룹 API 응답 구조:', responseData);
        groupsData = [];
      }

      // 그룹 데이터 구조 확인
      if (groupsData.length > 0) {
        logger.info('첫 번째 그룹 데이터 구조', 'Dashboard', groupsData[0]);
      }

      setGroups(groupsData);
    } catch (err: any) {
      logger.error('그룹 데이터를 가져오는데 실패했습니다:', err);
      setError(prev => ({
        ...prev,
        groups:
          err.response?.data?.message ||
          '그룹 데이터를 가져오는데 실패했습니다.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

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

      // API 응답 구조 확인을 위한 로깅
      logger.info('주간 통계 API 응답', 'Dashboard', {
        params,
        responseData: response.data,
        hasLastWeek: !!response.data?.lastWeek,
      });

      setWeeklyStats(response.data);
    } catch (err: any) {
      logger.error('주간 통계를 가져오는데 실패했습니다:', err);
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
        setWeeklyGraphData(responseData);
      } else if (responseData && Array.isArray(responseData.data)) {
        setWeeklyGraphData(responseData.data);
      } else if (responseData && Array.isArray(responseData.graph)) {
        setWeeklyGraphData(responseData.graph);
      } else {
        logger.warn(
          '예상하지 못한 주간 그래프 API 응답 구조:',
          'Dashboard',
          responseData
        );
        setWeeklyGraphData([]);
      }
    } catch (err: any) {
      logger.error(
        '주간 그래프 데이터를 가져오는데 실패했습니다:',
        'Dashboard',
        err
      );
      setError(prev => ({
        ...prev,
        weeklyGraph:
          err.response?.data?.message ||
          '주간 그래프 데이터를 가져오는데 실패했습니다.',
      }));
      setWeeklyGraphData([]); // 오류 시 빈 배열로 설정
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
      logger.error('연속 출석 데이터를 가져오는데 실패했습니다:', err);
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
      logger.info('출석 트렌드 API 응답', 'Dashboard', responseData);

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
        logger.warn(
          '예상하지 못한 출석 트렌드 API 응답 구조:',
          'Dashboard',
          responseData
        );
        trendData = [];
      }

      logger.info('처리된 트렌드 데이터', 'Dashboard', {
        dataLength: trendData.length,
        firstItem: trendData[0],
        lastItem: trendData[trendData.length - 1],
      });

      setAttendanceTrendData(trendData);
    } catch (err: any) {
      logger.error(
        '출석 트렌드 데이터를 가져오는데 실패했습니다:',
        'Dashboard',
        err
      );
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

  // 컴포넌트 마운트 시 국 데이터 가져오기
  useEffect(() => {
    fetchGooks();
    fetchAttendanceTrend(); // 트렌드 데이터는 국/그룹 선택과 무관
  }, []);

  // 국/그룹 선택이 변경될 때마다 출석 데이터 가져오기
  useEffect(() => {
    fetchWeeklyStats(selectedGukId, selectedGroupId);
    fetchWeeklyGraph(selectedGukId, selectedGroupId);
    fetchContinuousAttendance(selectedGukId, selectedGroupId);
  }, [selectedGukId, selectedGroupId]);

  // 선택된 국이 변경될 때 그룹 데이터 가져오기
  useEffect(() => {
    if (selectedGukId !== '전체') {
      fetchGroups(selectedGukId);
    } else {
      setGroups([]);
    }
  }, [selectedGukId]);

  // 선택된 국에 따른 그룹 목록 (API 데이터 기반)
  const availableGroups = useMemo((): {
    value: number | '전체';
    label: string;
  }[] => {
    logger.info('availableGroups 계산', 'Dashboard', {
      selectedGukId,
      groupsLength: groups.length,
    });

    if (selectedGukId === '전체') {
      return [{ value: '전체', label: '전체' }];
    }

    const groupOptions = Array.isArray(groups)
      ? groups.map(group => ({
          value: group.id,
          label: group.organization_name || group.name || `그룹 ${group.id}`,
        }))
      : [];

    logger.info('그룹 옵션들', 'Dashboard', groupOptions);

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
              : gooks.find(g => g.id === selectedGukId)?.organization_name ||
                '전체'
          }
          selectedGroup={
            selectedGroupId === '전체'
              ? '전체'
              : groups.find(g => g.id === selectedGroupId)?.organization_name ||
                groups.find(g => g.id === selectedGroupId)?.name ||
                '전체'
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
