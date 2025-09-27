import React, { useState } from 'react';
import { Badge, Button, Card, FormField, Modal, Table } from '../ui';
import DugigoDashboard from './DugigoDashboard';

/**
 * DUGIGO 디자인 시스템 데모 페이지
 * 새로운 컴포넌트들의 동작을 확인하기 위한 임시 페이지
 */
const DugigoDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'dashboard'>('dashboard');
  const [showModal, setShowModal] = useState(false);
  
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
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'var(--brand-text)', fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: '8px' }}>
          DUGIGO 디자인 시스템
        </h1>
        <p style={{ color: 'var(--text-secondary-dugigo)', fontSize: 'var(--font-size-base)', margin: 0 }}>
          차분한 데이터 중심의 어드민 UI 시스템
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-subtle)' }}>
          <button
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'dashboard' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              color: activeTab === 'dashboard' ? 'var(--brand-primary)' : 'var(--text-secondary-dugigo)',
              fontWeight: activeTab === 'dashboard' ? '600' : '400',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            대시보드 데모
          </button>
          <button
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'components' ? '3px solid var(--brand-primary)' : '3px solid transparent',
              color: activeTab === 'components' ? 'var(--brand-primary)' : 'var(--text-secondary-dugigo)',
              fontWeight: activeTab === 'components' ? '600' : '400',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
            onClick={() => setActiveTab('components')}
          >
            컴포넌트 가이드
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'dashboard' ? (
        <DugigoDashboard />
      ) : (
        <div>
      
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

      {/* 모달 섹션 */}
      <Card dugigo hoverable style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--brand-text)', marginBottom: '16px' }}>모달 컴포넌트</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant='primary' onClick={() => setShowModal(true)}>
            모달 열기
          </Button>
        </div>
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
      
      {/* 모달 */}
      <Modal
        isOpen={showModal}
        title='DUGIGO 모달 예시'
        onClose={() => setShowModal(false)}
        size='medium'
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ color: 'var(--text-primary-dugigo)', marginBottom: '16px' }}>
            이것은 DUGIGO 스타일의 모달입니다. 반투명 오버레이와 블러 효과가 적용되어 있습니다.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant='outline' onClick={() => setShowModal(false)}>
              취소
            </Button>
            <Button variant='primary' onClick={() => setShowModal(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
        </div>
      )}
    </div>
  );
};

export default DugigoDemo;
