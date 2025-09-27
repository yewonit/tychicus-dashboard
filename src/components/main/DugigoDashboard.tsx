import React from 'react';
import { Badge, Button, Card, Table } from '../ui';

/**
 * DUGIGO 스타일이 적용된 대시보드
 * 기존 Dashboard의 DUGIGO 버전
 */
const DugigoDashboard: React.FC = () => {
  // 모의 데이터
  const quickStats = [
    { label: '전체 구성원', value: 245, growth: '+12', isPositive: true },
    { label: '이번주 출석', value: 198, growth: '+8', isPositive: true },
    { label: '새가족', value: 15, growth: '+3', isPositive: true },
    { label: '출석률', value: '80.8%', growth: '+2.1%', isPositive: true },
  ];

  const recentActivities = [
    { id: 1, type: '심방', member: '김철수', date: '2024-01-15', status: '완료' },
    { id: 2, type: '포럼', member: '이영희', date: '2024-01-14', status: '진행중' },
    { id: 3, type: '심방', member: '박민수', date: '2024-01-13', status: '완료' },
  ];

  const activityColumns = [
    { key: 'type', title: '활동', align: 'center' as const, render: (value: string) => <Badge variant='primary'>{value}</Badge> },
    { key: 'member', title: '구성원', align: 'left' as const },
    { key: 'date', title: '날짜', align: 'center' as const },
    { key: 'status', title: '상태', align: 'center' as const, render: (value: string) => (
      <Badge variant={value === '완료' ? 'success' : 'warning'}>{value}</Badge>
    )},
  ];

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--brand-text)', fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>
          DUGIGO 대시보드
        </h1>
        <p style={{ color: 'var(--text-secondary-dugigo)', fontSize: 'var(--font-size-base)', margin: 0 }}>
          차분한 데이터 중심의 교회 관리 시스템
        </p>
      </div>

      {/* 빠른 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {quickStats.map((stat, index) => (
          <Card key={index} dugigo hoverable>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary-dugigo)', marginBottom: '8px', fontWeight: '600' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--brand-text)', marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: stat.isPositive ? 'var(--state-success)' : 'var(--state-danger)' }}>
                {stat.isPositive ? '↗' : '↘'} 전주 대비 {stat.growth}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card dugigo accentColor='primary'>
          <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px', fontSize: 'var(--font-size-lg)' }}>
            주간 출석 현황
          </h3>
          <div style={{ 
            height: '200px', 
            background: 'var(--surface-muted)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary-dugigo)'
          }}>
            차트 영역 (Chart.js 적용 예정)
          </div>
        </Card>

        <Card dugigo accentColor='secondary'>
          <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px', fontSize: 'var(--font-size-lg)' }}>
            출석 트렌드
          </h3>
          <div style={{ 
            height: '200px', 
            background: 'var(--surface-muted)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-secondary-dugigo)'
          }}>
            트렌드 차트 영역 (Recharts 적용 예정)
          </div>
        </Card>
      </div>

      {/* 최근 활동 */}
      <Card dugigo>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: 'var(--brand-text)', margin: 0, fontSize: 'var(--font-size-lg)' }}>
            최근 활동
          </h3>
          <Button variant='outline' size='small'>
            전체 보기
          </Button>
        </div>
        <Table 
          columns={activityColumns} 
          data={recentActivities} 
          onRowClick={(record) => console.log('클릭:', record)}
        />
      </Card>

      {/* 연속 출석/결석 현황 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <Card dugigo accentColor='success'>
          <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px', fontSize: 'var(--font-size-lg)' }}>
            연속 출석 현황
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-success)' }}>
                24
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                4주 연속
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-success)' }}>
                18
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                3주 연속
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-success)' }}>
                12
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                2주 연속
              </div>
            </div>
          </div>
        </Card>

        <Card dugigo accentColor='warning'>
          <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px', fontSize: 'var(--font-size-lg)' }}>
            연속 결석 현황
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-danger)' }}>
                3
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                4주 결석
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-warning)' }}>
                7
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                3주 결석
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--state-warning)' }}>
                12
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary-dugigo)' }}>
                2주 결석
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DugigoDashboard;
