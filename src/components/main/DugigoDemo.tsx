import React from 'react';
import { Badge, Button, Card, FormField, Table } from '../ui';

/**
 * DUGIGO 디자인 시스템 데모 페이지
 * 새로운 컴포넌트들의 동작을 확인하기 위한 임시 페이지
 */
const DugigoDemo: React.FC = () => {
  // 테이블 데모 데이터
  const tableColumns = [
    { key: 'name', title: '이름', align: 'left' as const },
    { key: 'role', title: '역할', align: 'center' as const },
    { key: 'status', title: '상태', align: 'center' as const, render: (value: string) => <Badge variant='success'>{value}</Badge> },
  ];

  const tableData = [
    { name: '김철수', role: '리더', status: '활성' },
    { name: '이영희', role: '멤버', status: '활성' },
    { name: '박민수', role: '멤버', status: '비활성' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--brand-text)', marginBottom: '32px' }}>DUGIGO 디자인 시스템 데모</h1>
      
      {/* 버튼 섹션 */}
      <Card dugigo hoverable style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px' }}>버튼 컴포넌트</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant='primary'>Primary</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='success'>Success</Button>
          <Button variant='danger'>Danger</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='text'>Text</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant='primary' size='small'>Small Primary</Button>
          <Button variant='outline' size='small'>Small Outline</Button>
          <Button variant='primary' loading>Loading</Button>
          <Button variant='primary' disabled>Disabled</Button>
        </div>
      </Card>

      {/* 카드 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card dugigo>
          <h4 style={{ color: 'var(--brand-text)', marginBottom: '8px' }}>기본 카드</h4>
          <p style={{ color: 'var(--text-secondary-dugigo)' }}>DUGIGO 기본 카드 스타일입니다.</p>
        </Card>
        
        <Card dugigo hoverable accentColor='primary'>
          <h4 style={{ color: 'var(--brand-text)', marginBottom: '8px' }}>Primary 강조 카드</h4>
          <p style={{ color: 'var(--text-secondary-dugigo)' }}>왼쪽 보더가 primary 색상으로 강조됩니다.</p>
        </Card>
        
        <Card dugigo hoverable accentColor='success'>
          <h4 style={{ color: 'var(--brand-text)', marginBottom: '8px' }}>Success 강조 카드</h4>
          <p style={{ color: 'var(--text-secondary-dugigo)' }}>성공 상태를 나타내는 카드입니다.</p>
        </Card>
      </div>

      {/* 배지 섹션 */}
      <Card dugigo style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px' }}>배지 컴포넌트</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <Badge variant='primary'>Primary</Badge>
          <Badge variant='secondary'>Secondary</Badge>
          <Badge variant='success'>Success</Badge>
          <Badge variant='warning'>Warning</Badge>
          <Badge variant='danger'>Danger</Badge>
          <Badge variant='info'>Info</Badge>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant='primary' size='small'>Small</Badge>
          <Badge variant='secondary' size='default'>Default</Badge>
          <Badge variant='success' size='large'>Large</Badge>
        </div>
      </Card>

      {/* 테이블 섹션 */}
      <Card dugigo>
        <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px' }}>테이블 컴포넌트</h3>
        <Table columns={tableColumns} data={tableData} onRowClick={(record) => alert(`클릭: ${record.name}`)} />
      </Card>

      {/* 폼 필드 섹션 */}
      <Card dugigo style={{ marginTop: '24px' }}>
        <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px' }}>폼 필드 컴포넌트</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <FormField dugigo label='이름' placeholder='이름을 입력하세요' helperText='한글 이름을 입력해주세요' />
          <FormField dugigo label='이메일' type='email' placeholder='이메일을 입력하세요' />
          <FormField dugigo label='에러 예시' error='필수 입력 항목입니다' touched />
        </div>
      </Card>
    </div>
  );
};

export default DugigoDemo;
