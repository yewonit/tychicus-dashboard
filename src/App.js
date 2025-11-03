import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WorshipStatus from './components/WorshipStatus';
import MembersManagement from './components/MembersManagement';
import MemberDetail from './components/MemberDetail';
import VisitationManagement from './components/VisitationManagement';
import VisitationDetail from './components/VisitationDetail';
import ForumManagement from './components/ForumManagement';
import ForumDetail from './components/ForumDetail';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f7f5 0%, #e8e6e1 100%);
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    /* 태블릿 스타일 */
  }
  
  @media (max-width: 768px) {
    /* 태블릿 세로 모드 */
  }
`;

const MainContent = styled.main`
  margin-left: 280px;
  min-height: 100vh;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    margin-left: 240px;
  }
  
  @media (max-width: 768px) {
    margin-left: 200px;
  }
`;

// 임시 페이지 컴포넌트들
const TempPage = ({ title, description }) => (
  <div style={{ 
    padding: '30px', 
    marginLeft: '280px', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }}>
    <h1 style={{ 
      fontSize: '2.2rem', 
      fontWeight: '800', 
      color: 'var(--text-primary)', 
      marginBottom: '8px' 
    }}>
      {title}
    </h1>
    <p style={{ 
      fontSize: '1.1rem', 
      color: 'var(--text-secondary)',
      marginBottom: '30px'
    }}>
      {description}
    </p>
    <div style={{
      background: 'var(--bg-card)',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: 'var(--shadow-light)',
      maxWidth: '500px'
    }}>
      <p style={{ color: 'var(--text-secondary)' }}>
        이 페이지는 현재 개발 중입니다. 곧 완성될 예정입니다.
      </p>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/worship" element={<WorshipStatus />} />
            <Route path="/analytics" element={
              <TempPage 
                title="분석 리포트" 
                description="청년회 활동에 대한 상세한 분석을 확인하세요" 
              />
            } />
            <Route path="/reports" element={
              <TempPage 
                title="보고서 관리" 
                description="청년회 활동 보고서를 관리하세요" 
              />
            } />
            <Route path="/members" element={<MembersManagement />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/groups" element={
              <TempPage 
                title="소그룹 관리" 
                description="지역별, 연령별 소그룹을 관리하세요" 
              />
            } />
            <Route path="/attendance" element={
              <TempPage 
                title="출결 관리" 
                description="청년회 출결 현황을 관리하세요" 
              />
            } />
            <Route path="/forum" element={<ForumManagement />} />
            <Route path="/forum/:id" element={<ForumDetail />} />
            <Route path="/visitation" element={<VisitationManagement />} />
            <Route path="/visitation/:id" element={<VisitationDetail />} />
            <Route path="/meetings" element={
              <TempPage 
                title="지역모임 관리" 
                description="지역별 모임을 관리하세요" 
              />
            } />
            <Route path="/events" element={
              <TempPage 
                title="행사 관리" 
                description="청년회 행사와 활동을 관리하세요" 
              />
            } />
            <Route path="/activities" element={
              <TempPage 
                title="활동 계획" 
                description="청년회 활동 계획을 관리하세요" 
              />
            } />
            <Route path="/notifications" element={
              <TempPage 
                title="공지사항" 
                description="청년회 공지사항을 관리하세요" 
              />
            } />
            <Route path="/messages" element={
              <TempPage 
                title="메시지 관리" 
                description="구성원 간 메시지를 관리하세요" 
              />
            } />
            <Route path="/announcements" element={
              <TempPage 
                title="알림 관리" 
                description="청년회 알림 시스템을 관리하세요" 
              />
            } />
            <Route path="/data-export" element={
              <TempPage 
                title="데이터 내보내기" 
                description="청년회 데이터를 다양한 형식으로 내보내세요" 
              />
            } />
            <Route path="/backup" element={
              <TempPage 
                title="데이터 백업" 
                description="청년회 데이터를 백업하고 복원하세요" 
              />
            } />
            <Route path="/settings" element={
              <TempPage 
                title="시스템 설정" 
                description="어드민 시스템 설정을 관리하세요" 
              />
            } />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App; 