/**
 * 회기 변경 엑셀 행 ↔ 기존 인원 매칭
 *
 * 정보 동기화 시 각 행을 서버의 전체 유저와 매칭하고, 결과를 행의 내부 필드(_userId, _match)에 저장합니다.
 * 매칭된 행은 userId가 서버로 전송되어 서버가 이름으로 다시 찾지 않습니다.
 */
import { SheetData } from '../../types';
import { CurrentSeasonMember, MatchFailureReason, RowMatch, UserData } from '../../types/seasonUpdate';
import { formatPhoneNumber } from '../phoneUtils';
import { CURRENT_ORG_COLUMNS, ROW_MATCH_FIELD, ROW_USER_ID_FIELD } from './excelFieldMapping';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

type Row = Record<string, any>;

/** 이름 비교용 정규화 (공백 무시) */
export const normalizeName = (value: unknown): string => String(value ?? '').replace(/\s+/g, '');

/**
 * 전화번호 비교용 정규화: 숫자만 남겨 휴대폰 번호 형식(01X + 8~9자리)일 때만 반환, 아니면 ''
 * ("0", "카톡 보유"처럼 번호가 아닌 값은 비교에 쓰지 않음)
 */
export const phoneDigits = (value: unknown): string => {
  const digits = String(value ?? '').replace(/\D/g, '');
  return /^01\d{8,9}$/.test(digits) ? digits : '';
};

/** 국 비교용 정규화 ("청년1국" = "1국", 공백 무시) */
export const normalizeGook = (value: unknown): string => normalizeName(value).replace(/^청년/, '');

/**
 * 생년월일에서 한국 시간 기준 연도의 끝 두자리만 추출
 * 서버는 DATE를 UTC ISO 문자열로 내려주므로(1996-01-01 KST → "1995-12-31T15:00:00.000Z")
 * 문자열을 그대로 자르면 1월 1일생이 한 해 앞으로 밀립니다. KST로 보정해 연도를 구합니다.
 * @returns 연도 끝 두자리 (예: 1999 -> "99"), 파싱 불가 시 빈 문자열
 */
export function extractYearSuffix(birthDate: string): string {
  const time = new Date(birthDate).getTime();
  if (Number.isNaN(time)) return '';
  return String(new Date(time + KST_OFFSET_MS).getUTCFullYear()).slice(-2);
}

/** 엑셀 기수 값을 두 자리로 맞춥니다. (1996 → 96, 2 → 02, 숫자가 아니면 '') */
export function toBirthYearSuffix(value: unknown): string {
  const digits = String(value ?? '').replace(/[^0-9]/g, '');
  if (digits.length === 4) return digits.slice(-2);
  if (digits.length === 1) return `0${digits}`;
  return digits.length === 2 ? digits : '';
}

/** 행의 매칭 결과 */
export const getRowMatch = (row: Row): RowMatch | undefined => row[ROW_MATCH_FIELD];

/** 이름이 있는 (적용 대상) 행인지 */
export const hasName = (row: Row): boolean => normalizeName(row['이름']) !== '';

/** 행에 적힌 현재 회기 소속 */
export function getRowCurrentOrg(row: Row): { gook: string; group: string; soon: string } {
  return {
    gook: String(row[CURRENT_ORG_COLUMNS.gook] ?? '').trim(),
    group: String(row[CURRENT_ORG_COLUMNS.group] ?? '').trim(),
    soon: String(row[CURRENT_ORG_COLUMNS.soon] ?? '').trim(),
  };
}

/** 구성원의 소속이 행에 적힌 현재 소속과 같은지 (적힌 단계까지만 비교) */
export function isSameOrg(
  member: Pick<CurrentSeasonMember, 'gook' | 'group' | 'soon'>,
  org: { gook: string; group: string; soon: string }
): boolean {
  if (!org.gook && !org.group && !org.soon) return false;
  if (org.gook && normalizeGook(member.gook) !== normalizeGook(org.gook)) return false;
  if (org.group && normalizeName(member.group) !== normalizeName(org.group)) return false;
  if (org.soon && normalizeName(member.soon) !== normalizeName(org.soon)) return false;
  return true;
}

/** 매칭 실패 사유를 사용자에게 보여줄 문장으로 바꿉니다. */
export function describeMatchFailure(reason: MatchFailureReason, candidateCount: number): string {
  switch (reason) {
    case 'not_found':
      return '같은 이름의 기존 인원이 없어요. 이름 오타이거나 아직 등록되지 않은 사람일 수 있어요.';
    case 'ambiguous':
      return `같은 이름이 ${candidateCount}명 있어 연락처·기수·구분·현재 소속으로도 한 명을 고르지 못했어요.`;
    case 'conflict':
      return '이름은 같지만 연락처와 기수가 모두 달라요. 같은 사람인지 확인이 필요해요.';
    default:
      return '매칭에 실패했어요.';
  }
}

interface MatchContext {
  usersByName: Map<string, UserData[]>;
  usersById: Map<number, UserData>;
  membershipsByUserId: Map<number, CurrentSeasonMember[]>;
}

type MatchResult =
  | { status: 'matched'; user: UserData }
  | { status: 'failed'; reason: MatchFailureReason; candidateCount: number };

function buildContext(allUsers: UserData[], currentMembers: CurrentSeasonMember[]): MatchContext {
  const usersByName = new Map<string, UserData[]>();
  const usersById = new Map<number, UserData>();
  for (const user of allUsers) {
    // 삭제된 유저는 회기 배치 대상이 아니므로(서버도 제외) 매칭하지 않음
    if (user.isDeleted || user.id === undefined) continue;
    usersById.set(user.id, user);
    const key = normalizeName(user.name);
    usersByName.set(key, [...(usersByName.get(key) ?? []), user]);
  }
  const membershipsByUserId = new Map<number, CurrentSeasonMember[]>();
  for (const member of currentMembers) {
    membershipsByUserId.set(member.userId, [...(membershipsByUserId.get(member.userId) ?? []), member]);
  }
  return { usersByName, usersById, membershipsByUserId };
}

/** 연락처와 기수가 양쪽에 모두 있는데 둘 다 다르면 다른 사람일 가능성이 높음 */
function isConflicting(row: Row, user: UserData): boolean {
  const rowPhone = phoneDigits(row['번호']);
  const userPhone = phoneDigits(user.phoneNumber);
  const rowBirth = toBirthYearSuffix(row['기수']);
  const userBirth = user.birthDate ? extractYearSuffix(user.birthDate) : '';
  return !!rowPhone && !!userPhone && rowPhone !== userPhone && !!rowBirth && !!userBirth && rowBirth !== userBirth;
}

/**
 * 한 행을 매칭합니다.
 * 이름이 같은 사람이 여럿이면 연락처 → 기수 → 구분 → (엑셀의) 현재 회기 소속 순서로 후보를 좁힙니다.
 * 어떤 기준으로 후보가 0명이 되면 그 기준은 건너뜁니다. (예: 연락처가 바뀐 경우)
 */
function matchRow(row: Row, ctx: MatchContext): MatchResult {
  const candidates = ctx.usersByName.get(normalizeName(row['이름'])) ?? [];
  if (candidates.length === 0) return { status: 'failed', reason: 'not_found', candidateCount: 0 };

  const rowPhone = phoneDigits(row['번호']);
  const rowBirth = toBirthYearSuffix(row['기수']);
  const rowSuffix = String(row['구분'] ?? '').trim();
  const rowOrg = getRowCurrentOrg(row);

  const criteria: { enabled: boolean; test: (user: UserData) => boolean }[] = [
    { enabled: !!rowPhone, test: user => phoneDigits(user.phoneNumber) === rowPhone },
    { enabled: !!rowBirth, test: user => !!user.birthDate && extractYearSuffix(user.birthDate) === rowBirth },
    { enabled: !!rowSuffix, test: user => (user.nameSuffix ?? '') === rowSuffix },
    {
      enabled: !!(rowOrg.gook || rowOrg.group || rowOrg.soon),
      test: user => (ctx.membershipsByUserId.get(user.id as number) ?? []).some(m => isSameOrg(m, rowOrg)),
    },
  ];

  let pool = candidates;
  for (const { enabled, test } of criteria) {
    if (pool.length === 1) break;
    if (!enabled) continue;
    const narrowed = pool.filter(test);
    if (narrowed.length > 0) pool = narrowed;
  }

  if (pool.length > 1) return { status: 'failed', reason: 'ambiguous', candidateCount: pool.length };
  if (isConflicting(row, pool[0])) return { status: 'failed', reason: 'conflict', candidateCount: candidates.length };
  return { status: 'matched', user: pool[0] };
}

/** 행의 빈 칸(구분/번호/기수)만 서버 정보로 채웁니다. */
function fillEmptyFields(row: Row, user: UserData): Row {
  const updated = { ...row };
  if (!String(updated['구분'] ?? '').trim() && user.nameSuffix) updated['구분'] = user.nameSuffix;
  // 서버는 하이픈 없는 숫자로 내려주므로 셀 검증 형식(010-0000-0000)에 맞춰 포맷 (전송 시 하이픈은 다시 제거됨)
  if (!String(updated['번호'] ?? '').trim() && user.phoneNumber) updated['번호'] = formatPhoneNumber(user.phoneNumber);
  if (!String(updated['기수'] ?? '').trim() && user.birthDate) {
    const yearSuffix = extractYearSuffix(user.birthDate);
    if (yearSuffix) updated['기수'] = yearSuffix;
  }
  return updated;
}

/** 매칭 결과를 지운 행 (이름을 고쳤을 때 등) */
export function clearRowMatch(row: Row): Row {
  const rest = { ...row };
  delete rest[ROW_MATCH_FIELD];
  delete rest[ROW_USER_ID_FIELD];
  return rest;
}

/**
 * 재매칭 다이얼로그에서 사용자가 고른 사람으로 행을 확정합니다.
 * 이름과 구분은 선택한 사람 기준으로 맞추고, 연락처·기수는 빈 칸만 채웁니다.
 */
export function applyManualMatch(row: Row, user: UserData): Row {
  const updated = fillEmptyFields({ ...row, 이름: user.name }, user);
  if (user.nameSuffix) updated['구분'] = user.nameSuffix;
  updated[ROW_USER_ID_FIELD] = user.id;
  const match: RowMatch = { status: 'matched', source: 'manual' };
  updated[ROW_MATCH_FIELD] = match;
  return updated;
}

export interface MatchSummary {
  matched: number;
  failed: number;
  /** 재매칭으로 확정해 두어 다시 매칭하지 않은 행 */
  keptManual: number;
}

/**
 * 모든 시트의 행을 기존 인원과 매칭합니다.
 * 재매칭 다이얼로그로 확정한 행(source: manual)은 그 사람이 여전히 존재하면 그대로 둡니다.
 */
export function matchSheetsWithUsers(
  sheets: SheetData[],
  allUsers: UserData[],
  currentMembers: CurrentSeasonMember[]
): { sheets: SheetData[]; summary: MatchSummary } {
  const ctx = buildContext(allUsers, currentMembers);
  const summary: MatchSummary = { matched: 0, failed: 0, keptManual: 0 };

  const updatedSheets = sheets.map(sheet => ({
    ...sheet,
    rows: sheet.rows.map(row => {
      if (!hasName(row)) return clearRowMatch(row);

      const previous = getRowMatch(row);
      if (previous?.status === 'matched' && previous.source === 'manual' && ctx.usersById.has(row[ROW_USER_ID_FIELD])) {
        summary.keptManual++;
        return row;
      }

      const result = matchRow(row, ctx);
      if (result.status === 'matched') {
        summary.matched++;
        const match: RowMatch = { status: 'matched', source: 'auto' };
        return { ...fillEmptyFields(row, result.user), [ROW_USER_ID_FIELD]: result.user.id, [ROW_MATCH_FIELD]: match };
      }
      summary.failed++;
      const match: RowMatch = { status: 'failed', reason: result.reason, candidateCount: result.candidateCount };
      return { ...clearRowMatch(row), [ROW_MATCH_FIELD]: match };
    }),
  }));

  return { sheets: updatedSheets, summary };
}
