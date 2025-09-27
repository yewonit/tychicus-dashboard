import { Box, Typography } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    // 2초 후에 '환영합니다.' 텍스트 표시
    const welcomeTimer = setTimeout(() => {
      setWelcomeShown(true);
    }, 2000);

    // 4초 후에 대시보드로 이동
    const navigationTimer = setTimeout(() => {
      navigate('/main/dashboard');
    }, 4000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className='welcome-container'>
      <Box sx={{ mb: 4 }}>
        <img
          className='welcome-image'
          src='/intro.png'
          alt='Welcome'
          onError={e => {
            // 이미지 로드 실패시 기본 텍스트 표시
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallbackText = document.getElementById('welcome-text-fallback');
            const subText = document.getElementById('welcome-subtext-fallback');
            if (fallbackText) {
              fallbackText.style.display = 'block';
            }
            if (subText) {
              subText.style.display = 'block';
            }
          }}
        />
        {/* 이미지 로드 실패시 표시할 기본 텍스트 */}
        <Typography
          variant='h4'
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            mt: 2,
            display: 'none',
          }}
          id='welcome-text-fallback'
        >
          MADE IN HEAVEN!
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: 'text.secondary',
            mt: 1,
            display: 'none',
          }}
          id='welcome-subtext-fallback'
        >
          산업국 IT팀
        </Typography>
      </Box>

      <Typography
        className={`welcome-text ${!welcomeShown ? 'fadeIn' : 'fadeOut'}`}
        variant='h3'
        component='h1'
        sx={{ display: welcomeShown ? 'none' : 'block' }}
      >
        대시보드에
        <br />잘 오셨습니다.
      </Typography>

      <Typography
        className={`welcome-text ${welcomeShown ? 'fadeIn' : 'fadeOut'}`}
        variant='h3'
        component='h1'
        sx={{ display: welcomeShown ? 'block' : 'none' }}
      >
        환영합니다.
      </Typography>
    </div>
  );
};

export default WelcomePage;
