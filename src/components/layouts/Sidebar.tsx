import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface MenuItem {
  path: string;
  icon: string;
  text: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  /** DUGIGO 스타일 사용 여부 */
  dugigo?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ dugigo = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuSections: MenuSection[] = [
    {
      title: '대시보드',
      items: [
        { path: '/main/dashboard', icon: '📊', text: '전체 현황' },
        { path: '/main/worship', icon: '⛪', text: '예배 현황' },
      ],
    },
    {
      title: '조직 관리',
      items: [
        { path: '/main/member-management', icon: '👥', text: '구성원 관리' },
        { path: '/main/groups', icon: '🏠', text: '소그룹 관리' },
      ],
    },
    {
      title: '활동 관리',
      items: [
        { path: '/main/attendance', icon: '📝', text: '출결 관리' },
        { path: '/main/forum', icon: '💬', text: '포럼 관리' },
        { path: '/main/visitation', icon: '🏠', text: '심방 관리' },
        { path: '/main/meeting-records', icon: '📍', text: '지역모임 관리' },
        { path: '/main/events', icon: '🎉', text: '행사 관리' },
      ],
    },
    {
      title: '커뮤니케이션',
      items: [
        { path: '/main/notifications', icon: '🔔', text: '공지사항' },
        { path: '/main/messages', icon: '💌', text: '메시지 관리' },
        { path: '/main/announcements', icon: '📢', text: '알림 관리' },
      ],
    },
    {
      title: '데이터 관리',
      items: [
        { path: '/main/data-export', icon: '📤', text: '데이터 내보내기' },
        { path: '/main/backup', icon: '💾', text: '데이터 백업' },
        { path: '/main/settings', icon: '⚙️', text: '시스템 설정' },
      ],
    },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getContainerClassName = () => {
    return dugigo ? 'dugigo-sidebar-container' : 'sidebar-container';
  };

  const getHeaderClassName = () => {
    return dugigo ? 'dugigo-sidebar-header' : 'sidebar-header';
  };

  const getTitleClassName = () => {
    return dugigo ? 'dugigo-sidebar-title' : 'sidebar-title';
  };

  const getSubtitleClassName = () => {
    return dugigo ? 'dugigo-sidebar-subtitle' : 'sidebar-subtitle';
  };

  const getContentClassName = () => {
    return dugigo ? 'dugigo-sidebar-content' : 'sidebar-content';
  };

  const getCategoryClassName = () => {
    return dugigo ? 'dugigo-sidebar-category' : 'sidebar-category';
  };

  const getCategoryTitleClassName = () => {
    return dugigo ? 'dugigo-sidebar-category-title' : 'sidebar-category-title';
  };

  const getMenuListClassName = () => {
    return dugigo ? 'dugigo-sidebar-menu-list' : 'sidebar-menu-list';
  };

  const getMenuItemClassName = () => {
    return dugigo ? 'dugigo-sidebar-menu-item' : 'sidebar-menu-item';
  };

  const getMenuButtonClassName = (path: string) => {
    const baseClass = dugigo ? 'dugigo-sidebar-menu-button' : 'sidebar-menu-button';
    return `${baseClass} ${isActive(path) ? 'active' : ''}`;
  };

  const getMenuIconClassName = () => {
    return dugigo ? 'dugigo-sidebar-menu-icon' : 'sidebar-menu-icon';
  };

  const getMenuTextClassName = () => {
    return dugigo ? 'dugigo-sidebar-menu-text' : 'sidebar-menu-text';
  };

  const getFooterClassName = () => {
    return dugigo ? 'dugigo-sidebar-footer' : 'sidebar-footer';
  };

  const getUserInfoClassName = () => {
    return dugigo ? 'dugigo-sidebar-user-info' : 'sidebar-user-info';
  };

  const getUserAvatarClassName = () => {
    return dugigo ? 'dugigo-sidebar-user-avatar' : 'sidebar-user-avatar';
  };

  const getUserDetailsClassName = () => {
    return dugigo ? 'dugigo-sidebar-user-details' : 'sidebar-user-details';
  };

  const getUserNameClassName = () => {
    return dugigo ? 'dugigo-sidebar-user-name' : 'sidebar-user-name';
  };

  const getUserRoleClassName = () => {
    return dugigo ? 'dugigo-sidebar-user-role' : 'sidebar-user-role';
  };

  return (
    <div className={getContainerClassName()}>
      {/* 로고 영역 */}
      <div className={getHeaderClassName()}>
        <div className='sidebar-logo'>
          <h1 className={getTitleClassName()}>청년회 어드민</h1>
          <p className={getSubtitleClassName()}>코람데오 교회</p>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <div className={getContentClassName()}>
        <nav className='sidebar-nav'>
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={getCategoryClassName()}>
              <div className={getCategoryTitleClassName()}>{section.title}</div>
              <ul className={getMenuListClassName()}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={getMenuItemClassName()}>
                    <button className={getMenuButtonClassName(item.path)} onClick={() => handleMenuClick(item.path)}>
                      <span className={getMenuIconClassName()}>{item.icon}</span>
                      <span className={getMenuTextClassName()}>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* 사용자 정보 영역 */}
      <div className={getFooterClassName()}>
        <div className={getUserInfoClassName()}>
          <div className={getUserAvatarClassName()}>관</div>
          <div className={getUserDetailsClassName()}>
            <div className={getUserNameClassName()}>{user?.name || '관리자'}</div>
            <div className={getUserRoleClassName()}>{user?.roles?.[0]?.roleName || '시스템 관리자'}</div>
          </div>
        </div>
        <button className={dugigo ? 'dugigo-sidebar-logout-button' : 'sidebar-logout-button'} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
