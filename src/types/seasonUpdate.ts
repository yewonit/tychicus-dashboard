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
 * 회기 변경 적용 요청 페이로드
 */
export interface SeasonUpdatePayload {
  sheets: Array<{
    sheetName: string;
    rows: Record<string, any>[];
  }>;
  timestamp: string;
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
