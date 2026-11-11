/**
 * 엑셀 컬럼명을 API 필드명으로 변환하는 매핑
 * 회기 변경 관리 엑셀 업로드용
 */
export const EXCEL_TO_API_FIELD_MAPPING: Record<string, string> = {
  국: 'gook',
  그룹: 'group',
  순: 'soon',
  이름: 'name',
  구분: 'nameSuffix',
  번호: 'phoneNumber',
  직분: 'role',
  기수: 'birthDate',
};

/**
 * API 필드명을 엑셀 컬럼명으로 변환하는 역매핑
 */
export const API_TO_EXCEL_FIELD_MAPPING: Record<string, string> = Object.entries(EXCEL_TO_API_FIELD_MAPPING).reduce(
  (acc, [excelField, apiField]) => {
    acc[apiField] = excelField;
    return acc;
  },
  {} as Record<string, string>
);

/** 다음 회기 소속 컬럼 (API로 전송) */
export const NEXT_ORG_COLUMNS = { gook: '국', group: '그룹', soon: '순' } as const;

/**
 * 현재 회기 소속 컬럼 (재매칭 참고용, 전송하지 않음)
 * 엑셀에 "2026년 소속 / 2025년 소속"처럼 연도별 소속이 있으면 이전 연도 쪽이 이 컬럼으로 들어옵니다.
 */
export const CURRENT_ORG_COLUMNS = { gook: '현재 국', group: '현재 그룹', soon: '현재 순' } as const;

/**
 * 행 데이터에 저장하는 내부 필드 (테이블·엑셀 다운로드·API 전송에서 숨김)
 * localStorage 자동 저장에 함께 저장되어 새로고침해도 매칭 결과가 유지됩니다.
 */
export const ROW_USER_ID_FIELD = '_userId';
export const ROW_MATCH_FIELD = '_match';

/** 내부 필드 여부 */
export const isInternalField = (key: string): boolean => key.startsWith('_');
