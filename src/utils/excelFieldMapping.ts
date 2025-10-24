export const EXCEL_TO_API_FIELD_MAPPING: Record<string, string> = {
  이름: 'name',
  전화번호: 'phoneNumber',
  이메일: 'email',
  성별: 'gender',
  생년월일: 'birthDate',
  교회등록일: 'registrationDate',
  새가족여부: 'isNewMember',
  장기결석여부: 'isLongTermAbsentee',
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
  phoneNumber: '전화번호',
} as const;
