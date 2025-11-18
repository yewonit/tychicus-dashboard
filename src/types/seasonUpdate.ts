/**
 * 회기 변경 관리 관련 타입 정의
 */

/**
 * 동기화 요청 시 사용하는 식별자
 */
export interface SyncIdentifier {
  name: string;
  phone: string;
}

/**
 * 서버에서 받아오는 유저 데이터
 */
export interface UserData {
  name: string; // 이름
  name_suffix?: string; // 구분 (A, B, C 등)
  phone_number?: string; // 번호 (서버 필드명: phone_number)
  birth_date?: string; // 생년월일 (YYYY-MM-DD 형식)
  [key: string]: any; // 추가 필드 허용
}

/**
 * 서버 동기화 응답 데이터
 * TODO: 실제 API 응답 구조에 맞춰 수정 필요
 */
export interface SyncResponse {
  name: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  registrationDate?: string;
  isNewMember?: string;
  isLongTermAbsentee?: string;
  [key: string]: any; // 추가 필드 허용
}

/**
 * 동기화 결과
 */
export interface SyncResult {
  /** 업데이트된 행 인덱스 */
  updatedRowIndex: number;
  /** 업데이트된 시트 인덱스 */
  sheetIndex: number;
  /** 에러 여부 */
  hasError: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
}

/**
 * 회원 데이터 (API 전송용)
 */
export interface SeasonMemberData {
  gook: string;
  group: string;
  soon: string;
  name: string;
  name_suffix: string;
  phone_number: string; // 서버 필드명: phone_number
  role: string;
  birth_date: string;
}

/**
 * 회기 변경 적용 요청 페이로드
 */
export interface SeasonUpdatePayload {
  data: SeasonMemberData[];
}

/**
 * 엑셀 변환 옵션
 */
export interface ExcelConversionOptions {
  /** 최소 로딩 시간 (ms) */
  minLoadingTime?: number;
}

/**
 * 데이터 매핑 결과
 */
export interface MappingResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
