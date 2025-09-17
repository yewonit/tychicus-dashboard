/**
 * 공통 상수 정의
 */

// 역할 ID 매핑
export const ROLE_IDS = {
  순장: 222,
  EBS: 223,
  순원: 224,
} as const;

// 역할 순서 (정렬용)
export const ROLE_ORDER = {
  [ROLE_IDS.순장]: 1,
  [ROLE_IDS.EBS]: 2,
  [ROLE_IDS.순원]: 3,
} as const;

// 요일 텍스트
export const DAY_OF_WEEK_TEXTS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
] as const;

// 성별 텍스트
export const GENDER_TEXTS = {
  M: '남성',
  F: '여성',
} as const;

// 공개 여부 텍스트
export const PUBLIC_TEXTS = {
  Y: '공개',
  N: '비공개',
} as const;

// 새 회원 여부 텍스트
export const NEW_MEMBER_TEXTS = {
  Y: '신입',
  N: '기존',
} as const;

// 장기 결석 여부 텍스트
export const LONG_TERM_ABSENTEE_TEXTS = {
  Y: '장기결석',
  N: '정상',
} as const;

// 카카오톡 채팅방 멤버 여부 텍스트
export const KAKAOTALK_CHAT_MEMBER_TEXTS = {
  Y: '참여',
  N: '미참여',
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  MEMBERS: '/members',
  ACTIVITIES: '/activities',
  MEETINGS: '/meetings',
  ATTENDANCE: '/attendance',
} as const;

// 페이지 크기
export const PAGE_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50,
} as const;

// 이미지 관련
export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 3,
  MAX_WIDTH: 1280,
  MAX_HEIGHT: 720,
  COMPRESSION_QUALITY: 0.7,
} as const;

// 날짜 형식
export const DATE_FORMATS = {
  DISPLAY: 'yyyy. MM. dd.',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;
