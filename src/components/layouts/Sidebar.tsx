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

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className='sidebar-container'>
      <div className='sidebar-header'>
        <div className='sidebar-logo'>
          <h2 className='sidebar-title'>코람데오</h2>
          <p className='sidebar-subtitle'>청년회 관리</p>
        </div>
      </div>

      <div className='sidebar-content'>
        <nav className='sidebar-nav'>
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className='sidebar-category'>
              <div className='sidebar-category-title'>{section.title}</div>
              <ul className='sidebar-menu-list'>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className='sidebar-menu-item'>
                    <button
                      className={`sidebar-menu-button ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => handleMenuClick(item.path)}
                    >
                      <span className='sidebar-menu-icon'>{item.icon}</span>
                      <span className='sidebar-menu-text'>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className='sidebar-footer'>
        <div className='sidebar-user-info'>
          <div className='sidebar-user-avatar'>👤</div>
          <div className='sidebar-user-details'>
            <div className='sidebar-user-name'>{user?.name || '사용자'}</div>
            <div className='sidebar-user-role'>
              {user?.roles?.[0]?.roleName || ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
