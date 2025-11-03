import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 240px;
  height: 100vh;
  background: var(--gradient-primary);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-heavy);
  overflow-y: auto;
  padding-bottom: 120px; /* 로그인 정보 영역을 위한 공간 */
  padding-right: 6px; /* 스크롤바 공간 확보 */
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    width: 200px;
  }
  
  @media (max-width: 768px) {
    width: 180px;
  }
`;

const Logo = styled.div`
  padding: 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h1 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    background: linear-gradient(135deg, var(--alabaster-white), var(--pastel-gray));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 3px 0 0 0;
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 15px 15px;
    
    h1 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 12px;
    
    h1 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.75rem;
    }
  }
`;

const NavMenu = styled.nav`
  padding: 15px 0;
`;

const NavSection = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.div`
  padding: 0 20px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 0 15px 6px;
    font-size: 0.7rem;
  }
  
  @media (max-width: 768px) {
    padding: 0 12px 5px;
    font-size: 0.65rem;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
  }
  
  ${props => props.active && `
    background: rgba(255, 255, 255, 0.15);
    border-left: 4px solid var(--accent-secondary);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--caramel-essence);
    }
  `}
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 8px 15px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

const NavIcon = styled.span`
  margin-right: 12px;
  font-size: 1rem;
  width: 18px;
  text-align: center;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    margin-right: 10px;
    font-size: 0.9rem;
    width: 16px;
  }
  
  @media (max-width: 768px) {
    margin-right: 8px;
    font-size: 0.85rem;
    width: 14px;
  }
`;

const NavText = styled.span`
  flex: 1;
`;

const UserSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 234px; /* 스크롤바 공간을 위해 6px 줄임 */
  padding: 20px 25px 20px 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%);
  backdrop-filter: blur(10px);
  z-index: 1001;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    width: 194px;
    padding: 15px 20px 15px 20px;
  }
  
  @media (max-width: 768px) {
    width: 174px;
    padding: 12px 15px 12px 15px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--caramel-essence), var(--sapphire-dust));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    font-size: 0.9rem;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  
  h4 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0 0 3px 0;
    color: white;
  }
  
  p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-weight: 500;
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    h4 {
      font-size: 0.9rem;
    }
    
    p {
      font-size: 0.75rem;
    }
  }
  
  @media (max-width: 768px) {
    h4 {
      font-size: 0.85rem;
    }
    
    p {
      font-size: 0.7rem;
    }
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 8px 10px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 0.75rem;
  }
`;

const menuSections = [
  {
    title: "대시보드",
    items: [
      { path: '/', icon: '📊', text: '전체 현황' },
      { path: '/worship', icon: '⛪', text: '예배 현황' }
    ]
  },
  {
    title: "조직 관리",
    items: [
      { path: '/members', icon: '👥', text: '구성원 관리' },
      { path: '/groups', icon: '🏠', text: '소그룹 관리' }
    ]
  },
  {
    title: "활동 관리",
    items: [
      { path: '/attendance', icon: '📝', text: '출결 관리' },
      { path: '/forum', icon: '💬', text: '포럼 관리' },
      { path: '/visitation', icon: '🏠', text: '심방 관리' },
      { path: '/meetings', icon: '📍', text: '지역모임 관리' },
      { path: '/events', icon: '🎉', text: '행사 관리' }
    ]
  },
  {
    title: "커뮤니케이션",
    items: [
      { path: '/notifications', icon: '🔔', text: '공지사항' },
      { path: '/messages', icon: '💌', text: '메시지 관리' },
      { path: '/announcements', icon: '📢', text: '알림 관리' }
    ]
  },
  {
    title: "데이터 관리",
    items: [
      { path: '/data-export', icon: '📤', text: '데이터 내보내기' },
      { path: '/backup', icon: '💾', text: '데이터 백업' },
      { path: '/settings', icon: '⚙️', text: '시스템 설정' }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  const handleMenuClick = (path) => {
    // 구성원 관리 메뉴 클릭 시 이벤트 발생
    if (path === '/members') {
      window.dispatchEvent(new CustomEvent('resetMembersPage'));
    }
  };

  return (
    <SidebarContainer>
      <Logo>
        <h1>청년회 어드민</h1>
        <p>코람데오 교회</p>
      </Logo>
      
      <NavMenu>
        {menuSections.map((section, sectionIndex) => (
          <NavSection key={sectionIndex}>
            <SectionTitle>{section.title}</SectionTitle>
            {section.items.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path}
                active={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
              >
                <NavIcon>{item.icon}</NavIcon>
                <NavText>{item.text}</NavText>
              </NavItem>
            ))}
          </NavSection>
        ))}
      </NavMenu>
      
      <UserSection>
        <UserInfo>
          <UserAvatar>관</UserAvatar>
          <UserDetails>
            <h4>관리자</h4>
            <p>시스템 관리자</p>
          </UserDetails>
        </UserInfo>
        <LogoutButton>로그아웃</LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar; 