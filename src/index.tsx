import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { logCurrentConfig } from './utils/envConfig';

// 앱 시작 시 현재 환경 설정 출력
logCurrentConfig();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
