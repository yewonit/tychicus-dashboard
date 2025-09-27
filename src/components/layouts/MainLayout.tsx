import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

/**
 * 메인 레이아웃 컴포넌트
 * DUGIGO 디자인 시스템이 적용된 기본 레이아웃
 */
const MainLayout: React.FC = () => {
  return (
    <div className='dugigo-main-layout'>
      <Sidebar dugigo />
      <div className='dugigo-main-content'>
        <div className='dugigo-main-content-inner'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
