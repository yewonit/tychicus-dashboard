/**
 * 전화번호 포맷팅 유틸리티
 */

/**
 * 숫자만 추출
 */
export const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * 전화번호를 자동으로 포맷팅 (010-1234-5678 형식)
 * @param value 입력값
 * @returns 포맷팅된 전화번호
 */
export const formatPhoneNumber = (value: string): string => {
  const numbers = extractNumbers(value);

  // 11자리 (010-1234-5678)
  if (numbers.length >= 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
  // 10자리 (010-123-4567)
  else if (numbers.length >= 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }
  // 7자리 이상 (010-123-4)
  else if (numbers.length >= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  // 4자리 이상 (010-12)
  else if (numbers.length >= 4) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  // 3자리 이하 (010)
  else {
    return numbers;
  }
};

/**
 * 전화번호 유효성 검증
 */
export const validatePhoneNumber = (value: string): { isValid: boolean; error?: string } => {
  const numbers = extractNumbers(value);

  if (!numbers) {
    return { isValid: false, error: '전화번호를 입력해주세요.' };
  }

  if (numbers.length < 10 || numbers.length > 11) {
    return { isValid: false, error: '올바른 전화번호를 입력해주세요. (10-11자리)' };
  }

  if (!/^01[0-9]/.test(numbers)) {
    return { isValid: false, error: '휴대폰 번호는 010, 011, 016, 017, 018, 019로 시작해야 합니다.' };
  }

  return { isValid: true };
};
