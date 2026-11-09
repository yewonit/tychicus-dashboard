/**
 * 셀 데이터 검증 규칙
 * 회기 변경 관리 엑셀에서 형식이 이상한 값을 노란 칸으로 표시하기 위해 사용합니다.
 */

/**
 * 검증 함수 타입
 * @param value 셀 값
 * @param rowData 행 전체 데이터 (다른 컬럼 참조가 필요한 경우)
 * @returns 문제가 있으면 사용자에게 보여줄 메시지, 없으면 null
 */
type CellRule = (value: any, rowData?: Record<string, any>) => string | null;

interface CellRuleDefinition {
  check: CellRule;
  /** true면 서버가 거절하는 값이라 고치기 전에는 회기 변경을 적용할 수 없음 */
  blocking: boolean;
}

const toText = (value: any): string => String(value ?? '').trim();

/**
 * 번호(전화번호)
 * - 값이 있으면 010-0000-0000 형식이어야 함 (업로드 시 숫자·하이픈·공백만 다른 번호는 자동으로 맞춤)
 * - 직분이 있는 사람(리더)은 번호가 비어 있으면 안 됨
 */
const checkPhone: CellRule = (value, rowData) => {
  const phone = toText(value);
  const role = toText(rowData?.['직분']);
  if (!phone) {
    return role ? `직분(${role})이 있는 사람은 연락처가 필요해요.` : null;
  }
  return /^\d{3}-\d{4}-\d{4}$/.test(phone) ? null : '연락처 형식이 010-0000-0000이 아니에요.';
};

/** 기수: 두 자리 숫자 (예: 96) */
const checkBirth: CellRule = value => {
  const birth = toText(value);
  if (!birth) return '기수가 비어 있어요. (정보 동기화 시 기존 정보로 채워질 수 있어요)';
  return /^\d{2}$/.test(birth) ? null : '기수는 두 자리 숫자여야 해요. (예: 96)';
};

const checkName: CellRule = value => (toText(value) ? null : '이름이 비어 있어 회기 변경에서 제외돼요.');

const checkGook: CellRule = value => (toText(value) ? null : '국이 비어 있어요.');

const checkGroup: CellRule = value => {
  const group = toText(value);
  if (!group) return '그룹이 비어 있어요.';
  return group.endsWith('그룹') ? null : "그룹 이름은 '그룹'으로 끝나야 해요. (예: 홍길동그룹)";
};

const checkSoon: CellRule = value => {
  const soon = toText(value);
  if (!soon) return '순이 비어 있어요.';
  return soon.endsWith('순') ? null : "순 이름은 '순'으로 끝나야 해요. (예: 홍길동순)";
};

/**
 * 컬럼명별 검증 규칙 (다음 회기 소속 컬럼만 검사하고, "현재 국/그룹/순"은 참고용이라 검사하지 않음)
 */
const CELL_RULES: Record<string, CellRuleDefinition> = {
  이름: { check: checkName, blocking: false },
  국: { check: checkGook, blocking: true },
  그룹: { check: checkGroup, blocking: true },
  순: { check: checkSoon, blocking: true },
  번호: { check: checkPhone, blocking: false },
  기수: { check: checkBirth, blocking: false },
};

/** 검증 규칙이 있는 컬럼 목록 */
export const VALIDATED_COLUMNS = Object.keys(CELL_RULES);

/**
 * 셀 문제 메시지를 반환합니다. 문제가 없거나 규칙이 없는 컬럼이면 null.
 */
export const getCellWarning = (columnName: string, value: any, rowData?: Record<string, any>): string | null => {
  const rule = CELL_RULES[columnName];
  if (!rule) return null;
  // 이름 없는 행은 적용에서 제외되므로 이름 칸 외의 다른 칸은 검사하지 않음
  if (columnName !== '이름' && rowData && !toText(rowData['이름'])) return null;
  return rule.check(value, rowData);
};

/** 고치기 전에는 회기 변경을 적용할 수 없는 컬럼인지 여부 */
export const isBlockingColumn = (columnName: string): boolean => CELL_RULES[columnName]?.blocking ?? false;

/**
 * 셀 데이터 검증
 * @returns 유효하면 true, 무효하면 false
 */
export const validateCell = (columnName: string, value: any, rowData?: Record<string, any>): boolean =>
  getCellWarning(columnName, value, rowData) === null;

/**
 * @deprecated 대신 validateCell을 사용하세요
 */
export const validateCellData = validateCell;
