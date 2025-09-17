import React from 'react';

interface TempPageProps {
  title: string;
  description: string;
}

const TempPage: React.FC<TempPageProps> = ({ title, description }) => {
  return (
    <>
      <div className='main-content-with-sidebar'>
        <div className='temp-page-container'>
          <div className='temp-page-content'>
            <h1 className='temp-page-title'>{title}</h1>
            <p className='temp-page-description'>{description}</p>
            <div className='temp-page-card'>
              <p className='temp-page-message'>
                이 페이지는 현재 개발 중입니다. 곧 완성될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TempPage;
