import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface MenuItem {
  path: string;
  icon: string;
  text: string;
  requiredPermission?: string; // 메뉴 표시에 필요한 권한
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
  const { user, logout, revalidateAuth } = useAuth();

  /**
   * permissions가 없으면 토큰을 리프레시하여 데이터를 다시 받아오는 함수
   */
  useEffect(() => {
    const checkAndRefreshPermissions = async () => {
      // user가 없거나 이미 permissions가 있으면 리프레시 불필요
      if (!user || (user.permissions && user.permissions.length > 0)) {
        return;
      }

      // permissions가 없으면 토큰 리프레시
      try {
        await revalidateAuth();
      } catch (error) {
        console.error('권한 정보를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    checkAndRefreshPermissions();
  }, [user, revalidateAuth]);

  /**
   * roleLevel이 가장 낮은 역할의 이름을 반환하는 함수
   * roleLevel이 낮을수록 상위 권한을 의미함
   */
  const lowestLevelRoleName = useMemo(() => {
    if (!user?.roles || user.roles.length === 0) {
      return '';
    }

    // roleLevel이 가장 낮은 역할 찾기
    const lowestRole = user.roles.reduce((lowest, current) => {
      return current.roleLevel < lowest.roleLevel ? current : lowest;
    }, user.roles[0]);

    return lowestRole.roleName;
  }, [user?.roles]);

  /**
   * 권한에 따라 메뉴를 필터링하는 함수
   */
  const filteredMenuSections = useMemo(() => {
    const userPermissions = user?.permissions || [];

    const menuSections: MenuSection[] = [
      {
        title: '대시보드',
        items: [
          { path: '/main/dashboard', icon: '📊', text: '전체 현황', requiredPermission: 'DASHBOARD_ACCESS' },
          // { path: '/main/worship', icon: '⛪', text: '예배 현황' },
        ],
      },
      {
        title: '조직 관리',
        items: [
          {
            path: '/main/member-management',
            icon: '👥',
            text: '구성원 관리',
            requiredPermission: 'MEMBER_MANAGEMENT_ACCESS',
          },
          // { path: '/main/groups', icon: '🏠', text: '소그룹 관리' },
          // { path: '/main/season-update', icon: '🔄', text: '회기 변경 관리' },
        ],
      },
      // {
      //   title: '활동 관리',
      //   items: [
      //     { path: '/main/attendance', icon: '📝', text: '출결 관리' },
      //     { path: '/main/forum', icon: '💬', text: '포럼 관리' },
      //     { path: '/main/visitation', icon: '🏠', text: '심방 관리' },
      //     { path: '/main/meeting-records', icon: '📍', text: '지역모임 관리' },
      //     { path: '/main/events', icon: '🎉', text: '행사 관리' },
      //   ],
      // },
      // {
      //   title: '커뮤니케이션',
      //   items: [
      //     { path: '/main/notifications', icon: '🔔', text: '공지사항' },
      //     { path: '/main/messages', icon: '💌', text: '메시지 관리' },
      //     { path: '/main/announcements', icon: '📢', text: '알림 관리' },
      //   ],
      // },
      // {
      //   title: '데이터 관리',
      //   items: [
      //     { path: '/main/data-export', icon: '📤', text: '데이터 내보내기' },
      //     { path: '/main/backup', icon: '💾', text: '데이터 백업' },
      //     { path: '/main/settings', icon: '⚙️', text: '시스템 설정' },
      //   ],
      // },
    ];

    return menuSections
      .map(section => ({
        ...section,
        items: section.items.filter(item => {
          // requiredPermission이 없으면 항상 표시
          if (!item.requiredPermission) {
            return true;
          }

          // requiredPermission이 있으면 해당 권한이 있는지 확인
          return userPermissions.includes(item.requiredPermission);
        }),
      }))
      .filter(section => section.items.length > 0); // 빈 섹션은 제거
  }, [user?.permissions]);

  /**
   * 메뉴 클릭 핸들러
   */
  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  /**
   * 현재 경로가 활성화된 메뉴인지 확인하는 함수
   */
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

  const getLogoutButtonClassName = () => {
    return dugigo ? 'dugigo-sidebar-logout-button' : 'sidebar-logout-button';
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
    }
  };

  return (
    <div className={getContainerClassName()}>
      <div className={getHeaderClassName()}>
        <div className='sidebar-logo'>
          <h2 className={getTitleClassName()}>코람데오</h2>
          <p className={getSubtitleClassName()}>청년회 관리</p>
        </div>
      </div>

      <div className={getContentClassName()}>
        <nav className='sidebar-nav'>
          {filteredMenuSections.map((section, sectionIndex) => (
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

      <div className={getFooterClassName()}>
        <div className={getUserInfoClassName()}>
          <div className={getUserAvatarClassName()}>👤</div>
          <div className={getUserDetailsClassName()}>
            <div className={getUserNameClassName()}>{user?.name || '사용자'}</div>
            <div className={getUserRoleClassName()}>{lowestLevelRoleName}</div>
          </div>
          <button className={getLogoutButtonClassName()} onClick={handleLogout} title='로그아웃' aria-label='로그아웃'>
            ⏻
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
