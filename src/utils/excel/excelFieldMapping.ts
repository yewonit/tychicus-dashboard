/**
 * 엑셀 컬럼명을 API 필드명으로 변환하는 매핑
 * 회기 변경 관리 엑셀 업로드용
 */
export const EXCEL_TO_API_FIELD_MAPPING: Record<string, string> = {
  국: 'gook',
  그룹: 'group',
  순: 'soon',
  이름: 'name',
  구분: 'name_suffix',
  번호: 'phone',
  직분: 'role',
  기수: 'birth_date',
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

/**
 * 동기화에 사용할 식별 필드
 * 서버로 보낼 때와 매칭할 때 사용하는 필드
 */
export const SYNC_IDENTIFIER_FIELDS = {
  name: '이름',
  phone: '번호',
} as const;
