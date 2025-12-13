/**
 * 입력값 sanitization 유틸리티
 * XSS 공격 방지 및 안전한 입력값 처리
 */

/**
 * HTML 태그 제거 및 특수문자 이스케이프
 */
export const sanitizeInput = (value: string): string => {
  if (!value) return '';

  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * 검색어 sanitization (HTML 태그 제거, 특수문자 제한)
 */
export const sanitizeSearchTerm = (value: string): string => {
  if (!value) return '';

  // HTML 태그 제거
  let sanitized = value.replace(/<[^>]*>/g, '');

  // 특수문자 제한 (한글, 영문, 숫자, 공백만 허용)
  sanitized = sanitized.replace(/[^가-힣a-zA-Z0-9\s]/g, '');

  // 연속된 공백을 하나로
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
};

/**
 * 이름 sanitization (한글, 영문, 공백만 허용)
 */
export const sanitizeName = (value: string): string => {
  if (!value) return '';

  // 한글, 영문, 공백만 허용
  return value.replace(/[^가-힣a-zA-Z\s]/g, '').trim();
};

/**
 * 동명이인 구분자 sanitization (영문, 숫자만 허용)
 */
export const sanitizeNameSuffix = (value: string): string => {
  if (!value) return '';

  // 영문, 숫자만 허용
  return value.replace(/[^a-zA-Z0-9]/g, '').trim();
};

/**
 * 전화번호 sanitization (숫자와 하이픈만 허용)
 */
export const sanitizePhoneNumber = (value: string): string => {
  if (!value) return '';

  // 숫자와 하이픈만 허용
  return value.replace(/[^0-9-]/g, '');
};
