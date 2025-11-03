/**
 * 셀 데이터 검증 규칙 상수
 * 회기 변경 관리 엑셀 데이터 검증용
 */

/**
 * 검증 함수 타입
 * @param value 셀 값
 * @param rowData 행 전체 데이터 (다른 컬럼 참조가 필요한 경우)
 * @returns true면 유효, false면 무효
 */
type ValidationFunction = (value: any, rowData?: Record<string, any>) => boolean;

/**
 * 번호(전화번호) 형식 검증
 * 규칙:
 * 1. 직분이 없으면 검증하지 않음
 * 2. 직분이 있는데 번호가 비어있으면 무효
 * 3. 번호가 있으면 '3자리-4자리-4자리' 형식이어야 함
 */
const validatePhone = (value: any, rowData?: Record<string, any>): boolean => {
  const phoneStr = String(value || '').trim();
  const role = rowData?.['직분'] ? String(rowData['직분']).trim() : '';

  // 규칙 1: 직분이 없으면 검증하지 않음 (항상 유효)
  if (!role) {
    return true;
  }

  // 규칙 2: 직분이 있는데 번호가 비어있으면 무효
  if (!phoneStr) {
    return false;
  }

  // 규칙 3: 번호가 있으면 '3자리-4자리-4자리' 형식이어야 함
  const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
  return phonePattern.test(phoneStr);
};

/**
 * 기수 형식 검증
 * 규칙:
 * 1. 기수가 비어있으면 무효
 * 2. 기수는 2자리 숫자여야 함 (문자열 타입)
 */
const validateBirthdate = (value: any): boolean => {
  const birthdateStr = String(value || '').trim();

  // 규칙 1: 기수가 비어있으면 무효
  if (!birthdateStr) {
    return false;
  }

  // 규칙 2: 2자리 숫자여야 함
  const birthdatePattern = /^\d{2}$/;
  return birthdatePattern.test(birthdateStr);
};

/**
 * 컬럼명별 검증 규칙 매핑
 * 키: 엑셀 컬럼명, 값: 검증 함수
 */
export const CELL_VALIDATION_RULES: Record<string, ValidationFunction> = {
  번호: validatePhone,
  기수: validateBirthdate,
};

/**
 * 셀 데이터 검증
 * @param columnName 컬럼명
 * @param value 셀 값
 * @param rowData 행 전체 데이터 (선택)
 * @returns 유효하면 true, 무효하면 false
 */
export const validateCell = (columnName: string, value: any, rowData?: Record<string, any>): boolean => {
  const validationFn = CELL_VALIDATION_RULES[columnName];

  // 검증 규칙이 없으면 항상 유효
  if (!validationFn) {
    return true;
  }

  return validationFn(value, rowData);
};

/**
 * @deprecated 대신 validateCell을 사용하세요
 */
export const validateCellData = validateCell;
