#!/usr/bin/env node

/**
 * React 앱 빌드 스크립트
 * Vue의 --mode 옵션과 유사하게 동작
 *
 * 사용법:
 *   npm run build -- --mode development
 *   npm run build -- --mode production
 */

const { spawn } = require('child_process');

// 인자 파싱
const args = process.argv.slice(2);
const modeIndex = args.indexOf('--mode');
const mode = modeIndex !== -1 && args[modeIndex + 1] ? args[modeIndex + 1] : 'production';

// NODE_ENV 설정
// development 모드일 때는 NODE_ENV=development
// production 모드일 때는 NODE_ENV=production
const nodeEnv = mode === 'development' ? 'development' : 'production';

// REACT_APP_ENV 설정 (axiosClient.ts에서 사용)
// development 모드일 때는 REACT_APP_ENV=development
// production 모드일 때는 REACT_APP_ENV=production (또는 설정 안 함)
const reactAppEnv = mode === 'development' ? 'development' : 'production';

// 환경 변수 설정
process.env.NODE_ENV = nodeEnv;
process.env.REACT_APP_ENV = reactAppEnv;
process.env.DISABLE_ESLINT_PLUGIN = 'true';

console.log(`Building in ${mode} mode...`);
console.log(`NODE_ENV=${nodeEnv}`);
console.log(`REACT_APP_ENV=${reactAppEnv}`);

// react-scripts build 실행
const buildProcess = spawn('react-scripts', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: nodeEnv,
    REACT_APP_ENV: reactAppEnv,
    DISABLE_ESLINT_PLUGIN: 'true',
  },
});

buildProcess.on('close', code => {
  if (code !== 0) {
    console.error(`Build failed with code ${code}`);
    process.exit(code);
  }
  console.log(`Build completed successfully in ${mode} mode!`);
});
