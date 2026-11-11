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
  id?: number; // 사용자 ID
  name: string; // 이름
  nameSuffix?: string | null; // 구분 (A, B, C 등)
  phoneNumber?: string | null; // 번호 (하이픈 없는 숫자)
  birthDate?: string | null; // 생년월일 (UTC ISO 문자열, 예: 1996-01-01 KST → 1995-12-31T15:00:00.000Z)
  isDeleted?: boolean; // 삭제(탈퇴) 여부
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
  userId?: number; // 매칭/재매칭으로 확정된 사용자 ID (있으면 서버가 이름 탐색 없이 사용)
  gook: string;
  group: string;
  soon: string;
  name: string;
  nameSuffix?: string;
  phoneNumber?: string;
  role?: string;
  birthDate?: string; // 기수 (두 자리 연도, 예: "96")
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

/**
 * 현재 회기 구성원 (GET /seasons/current/members)
 * 직분이 여러 개인 사용자는 여러 행으로 내려옵니다.
 */
export interface CurrentSeasonMember {
  userId: number;
  name: string;
  nameSuffix: string | null;
  phoneNumber: string;
  birthYear: string | null; // 기수 (두 자리)
  gook: string | null;
  group: string | null;
  soon: string | null;
  role: string;
}

/**
 * 재매칭 후보 (GET /seasons/rematch-candidates)
 * 이름이 같은 사용자와 각자의 현재 회기 소속. 현재 회기 소속이 없으면 organizations가 빈 배열.
 */
export interface RematchCandidate {
  userId: number;
  name: string;
  nameSuffix: string | null;
  phoneNumber: string;
  birthYear: string | null; // 기수 (두 자리)
  organizations: { gook: string | null; group: string | null; soon: string | null; role: string }[];
}

/** 매칭 실패 사유 */
export type MatchFailureReason =
  | 'not_found' // 같은 이름의 구성원이 없음
  | 'ambiguous' // 동명이인을 한 명으로 특정하지 못함
  | 'conflict'; // 이름은 같지만 연락처·기수가 모두 다름

/** 엑셀 행과 기존 인원의 매칭 결과 (행 데이터의 내부 필드로 저장) */
export type RowMatch =
  | { status: 'matched'; source: 'auto' | 'manual' }
  | { status: 'failed'; reason: MatchFailureReason; candidateCount: number };

/** 확인이 필요한 위치 (column이 없으면 행 전체) */
export interface IssueLocation {
  sheetIndex: number;
  rowIndex: number;
  column?: string;
}

/** 회기 변경 화면에서 확인이 필요한 항목 요약 */
export interface SeasonIssues {
  /** 기존 인원과 매칭에 실패한 행 (빨간 줄) */
  matchFailures: IssueLocation[];
  /** 형식 확인이 필요한 칸 (노란 칸) */
  valueWarnings: IssueLocation[];
  /** 노란 칸 중 서버가 거절하는 값(국/그룹/순)이라 적용 전에 반드시 고쳐야 하는 칸 수 */
  blockingWarningCount: number;
  /** 이름이 있지만 아직 정보 동기화(매칭)를 하지 않은 행 수 */
  unverifiedCount: number;
  /** 이름이 비어 있어 적용 대상에서 제외되는 행 수 */
  namelessCount: number;
}

/** 회기 변경 적용 결과 요약 (POST /seasons 응답) */
export interface SeasonApplySummary {
  organizations: { reused: number; created: number; deleted: number };
  userRoles: { kept: number; updated: number; created: number; deleted: number };
}
