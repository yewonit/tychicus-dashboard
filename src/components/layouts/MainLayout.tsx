import { ArrowBack, Cancel, Home } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showCancelButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  onCancel?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  title = '서비스 선택',
  showBackButton = false,
  showHomeButton = false,
  showCancelButton = false,
  onBack,
  onHome,
  onCancel,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate('/main/service-selection');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/main/service-selection');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginLeft: { xs: 0, sm: 0, md: '240px', lg: '280px' },
          overflow: 'hidden',
          width: {
            xs: '100%',
            sm: '100%',
            md: 'calc(100% - 240px)',
            lg: 'calc(100% - 280px)',
          },
          minWidth: 0, // flexbox에서 최소 너비 제한 해제
        }}
      >
        <AppBar position='static' sx={{ backgroundColor: '#4ecdc4' }}>
          <Toolbar>
            {showBackButton && (
              <IconButton
                edge='start'
                color='inherit'
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
            )}

            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              {title}
            </Typography>

            {showHomeButton && (
              <IconButton color='inherit' onClick={handleHome} sx={{ mr: 1 }}>
                <Home />
              </IconButton>
            )}

            {showCancelButton && (
              <IconButton color='inherit' onClick={handleCancel}>
                <Cancel />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 1.5, md: 2 },
            overflow: 'auto',
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
