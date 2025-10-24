/**
 * 셀 데이터 검증 규칙 상수
 * 각 컬럼명에 대한 검증 함수를 정의합니다.
 */

/**
 * 검증 함수 타입
 * @returns true면 유효, false면 무효
 */
type ValidationFunction = (value: any) => boolean;

/**
 * 날짜 형식 검증 (YYYY-MM-DD 또는 YYYY/MM/DD)
 */
const validateDate = (value: any): boolean => {
  if (!value) return true; // 빈 값은 허용
  const datePattern = /^\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])$/;
  return datePattern.test(String(value));
};

/**
 * 이메일 형식 검증
 */
const validateEmail = (value: any): boolean => {
  if (!value) return true; // 빈 값은 허용
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(String(value));
};

/**
 * 전화번호 형식 검증 (010-1234-5678 또는 01012345678)
 */
const validatePhoneNumber = (value: any): boolean => {
  if (!value) return true; // 빈 값은 허용
  const phonePattern = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return phonePattern.test(String(value).replace(/\s/g, ''));
};

/**
 * Y/N 값 검증
 */
const validateYesNo = (value: any): boolean => {
  if (!value) return true; // 빈 값은 허용
  const upperValue = String(value).toUpperCase();
  return upperValue === 'Y' || upperValue === 'N';
};

/**
 * 성별 형식 검증 (M/F 또는 남/여)
 */
const validateGender = (value: any): boolean => {
  if (!value) return true; // 빈 값은 허용
  const upperValue = String(value).toUpperCase();
  return upperValue === 'M' || upperValue === 'F' || value === '남' || value === '여';
};

/**
 * 컬럼명별 검증 규칙 매핑
 * 키: 엑셀 컬럼명, 값: 검증 함수
 */
export const CELL_VALIDATION_RULES: Record<string, ValidationFunction> = {
  생년월일: validateDate,
  교회등록일: validateDate,
  이메일: validateEmail,
  전화번호: validatePhoneNumber,
  성별: validateGender,
  새가족여부: validateYesNo,
  장기결석여부: validateYesNo,
};

/**
 * 셀 데이터 검증
 * @param columnName 컬럼명
 * @param value 셀 값
 * @returns 유효하면 true, 무효하면 false
 */
export const validateCellData = (columnName: string, value: any): boolean => {
  const validationFn = CELL_VALIDATION_RULES[columnName];

  // 검증 규칙이 없으면 항상 유효
  if (!validationFn) {
    return true;
  }

  return validationFn(value);
};
