/**
 * 회기 변경 엑셀 시트 파서 (순수 함수)
 *
 * 지원하는 형식
 * 1) 첫 행에 컬럼명이 있는 템플릿: 국, 그룹, 순, 이름, 구분, 번호, 직분, 기수
 * 2) 국에서 받는 원본 양식: 위쪽에 빈 행/병합된 그룹 헤더("2026년 소속", "2025년 소속", "기본정보")가 있고
 *    그 아래 행에 "2026년 직분, 국, 그룹, 순, 국, 그룹, 순, 이름, 성별, 기수, 연락처" 컬럼명이 있는 형식
 *    → 연도가 큰 소속을 다음 회기(국/그룹/순), 작은 소속을 현재 회기(현재 국/현재 그룹/현재 순)로 읽습니다.
 */
import { formatPhoneNumber } from '../phoneUtils';
import { CURRENT_ORG_COLUMNS } from './excelFieldMapping';

export interface MergeRange {
  s: { r: number; c: number };
  e: { r: number; c: number };
}

/** 헤더(이름 컬럼)를 찾을 때 위에서부터 살펴볼 행 수 */
const HEADER_SCAN_ROWS = 15;

/** 제로폭 문자·방향 제어 문자(엑셀에서 복사한 번호에 자주 섞이는 U+202D/U+202C 등) */
const INVISIBLE_CHARS = /[​-‏‪-‮⁦-⁩﻿]/g;

/** 원본 컬럼명(공백 제거) → 표준 컬럼명 */
const HEADER_ALIASES: Record<string, string> = {
  이름: '이름',
  성명: '이름',
  구분: '구분',
  기수: '기수',
  국: '국',
  그룹: '그룹',
  순: '순',
  성별: '성별',
  직분: '직분',
  번호: '번호',
  연락처: '번호',
  전화번호: '번호',
  휴대폰: '번호',
  휴대폰번호: '번호',
  핸드폰: '번호',
  핸드폰번호: '번호',
};

const ORG_COLUMN_KEYS: Record<string, keyof typeof CURRENT_ORG_COLUMNS> = {
  국: 'gook',
  그룹: 'group',
  순: 'soon',
};

/** 셀 값을 화면/비교용 문자열로 정리합니다. (보이지 않는 문자 제거, NBSP → 공백, 앞뒤 공백 제거) */
export function cleanCellText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(INVISIBLE_CHARS, '').replace(/ /g, ' ').trim();
}

function canonicalHeader(raw: string): string {
  const compact = raw.replace(/\s+/g, '');
  if (!compact) return '';
  if (HEADER_ALIASES[compact]) return HEADER_ALIASES[compact];
  if (compact.includes('직분')) return '직분'; // "2026년 직분"
  return raw;
}

function yearOf(label: string): number | null {
  const match = label.match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

/** "이름" 컬럼이 있는 행을 헤더로 찾습니다. 없으면 처음으로 값이 있는 행을 헤더로 씁니다. */
export function findHeaderRowIndex(rows: unknown[][]): number {
  const limit = Math.min(rows.length, HEADER_SCAN_ROWS);
  for (let r = 0; r < limit; r++) {
    if (rows[r]?.some(cell => canonicalHeader(cleanCellText(cell)) === '이름')) return r;
  }
  return rows.findIndex(row => row?.some(cell => cleanCellText(cell)));
}

/** 헤더 바로 위 행의 그룹 라벨을 컬럼별로 구합니다. (병합 셀은 범위 전체에 같은 라벨) */
function getGroupLabels(rows: unknown[][], headerRow: number, merges: MergeRange[], width: number): string[] {
  const labels: string[] = new Array(width).fill('');
  if (headerRow === 0) return labels;
  const labelRow = headerRow - 1;
  for (let c = 0; c < width; c++) labels[c] = cleanCellText(rows[labelRow]?.[c]);
  for (const m of merges) {
    if (m.s.r > labelRow || m.e.r < labelRow) continue;
    const value = cleanCellText(rows[m.s.r]?.[m.s.c]);
    for (let c = m.s.c; c <= Math.min(m.e.c, width - 1); c++) labels[c] = value;
  }
  return labels;
}

/**
 * 헤더 셀과 그룹 라벨로 최종 컬럼명을 정합니다. 빈 헤더는 null.
 * 국/그룹/순이 연도별로 두 번 나오면 연도가 큰 쪽이 다음 회기, 나머지는 "현재 국/그룹/순"이 됩니다.
 */
export function buildColumnNames(headerCells: string[], groupLabels: string[]): (string | null)[] {
  const canonical = headerCells.map(canonicalHeader);
  const orgYears = canonical.map((h, c) => (ORG_COLUMN_KEYS[h] ? yearOf(groupLabels[c] ?? '') : null));
  const years = orgYears.filter((y): y is number => y !== null);
  const hasMultipleYears = new Set(years).size > 1;
  const nextYear = years.length > 0 ? Math.max(...years) : null;

  const seen = new Map<string, number>();
  return canonical.map((header, c) => {
    if (!header) return null;
    let name = header;
    const orgKey = ORG_COLUMN_KEYS[header];
    if (orgKey) {
      const label = groupLabels[c] ?? '';
      const isCurrent = hasMultipleYears
        ? orgYears[c] !== null && orgYears[c] !== nextYear
        : /현재|기존|이전|올해/.test(label);
      if (isCurrent) name = CURRENT_ORG_COLUMNS[orgKey];
    }
    const count = (seen.get(name) ?? 0) + 1;
    seen.set(name, count);
    return count === 1 ? name : `${name} (${count})`;
  });
}

/**
 * 하이픈·공백만 다른 11자리 휴대폰 번호는 010-0000-0000 형식으로 맞춥니다.
 * 자릿수가 모자란 번호(010-8898-473) 등 그 외 값은 사용자가 확인할 수 있게 그대로 둡니다.
 */
export function normalizePhoneText(text: string): string {
  const digits = text.replace(/[\s-]/g, '');
  if (/^01\d{9}$/.test(digits)) return formatPhoneNumber(digits);
  // 엑셀 숫자 서식 때문에 맨 앞 0이 빠진 경우 (1012345678)
  if (/^1\d{9}$/.test(digits)) return formatPhoneNumber(`0${digits}`);
  return text;
}

/** 네 자리 연도(1996, 2000)와 한 자리 기수(5)는 두 자리로 맞춥니다. 그 외 값은 그대로 둡니다. */
export function normalizeBirthText(text: string): string {
  if (/^(19|20)\d{2}$/.test(text)) return text.slice(-2);
  if (/^\d$/.test(text)) return `0${text}`;
  return text;
}

/**
 * 시트의 2차원 배열(sheet_to_json header:1 결과)을 행 객체 배열로 변환합니다.
 * - 모든 행이 같은 컬럼을 갖도록 빈 칸은 ''로 채웁니다.
 * - 값이 하나도 없는 행은 건너뜁니다.
 * - "구분" 컬럼이 없으면 이름 바로 뒤에 빈 "구분" 컬럼을 추가합니다. (동명이인 구분용)
 */
export function parseSheetRows(rows: unknown[][], merges: MergeRange[] = []): Record<string, string>[] {
  const headerRow = findHeaderRowIndex(rows);
  if (headerRow < 0) return [];

  const width = rows.slice(headerRow).reduce((max, row) => Math.max(max, row?.length ?? 0), 0);
  const headerCells = Array.from({ length: width }, (_, c) => cleanCellText(rows[headerRow]?.[c]));
  const names = buildColumnNames(headerCells, getGroupLabels(rows, headerRow, merges, width));
  const dataRows = rows.slice(headerRow + 1);

  // 헤더는 비었지만 값이 있는 열은 버리지 않고 "열 N"으로 보존
  names.forEach((name, c) => {
    if (name === null && dataRows.some(row => cleanCellText(row?.[c]))) names[c] = `열 ${c + 1}`;
  });
  const hasSuffixColumn = names.includes('구분');

  const result: Record<string, string>[] = [];
  for (const cells of dataRows) {
    const row: Record<string, string> = {};
    let hasValue = false;
    names.forEach((name, c) => {
      if (name === null) return;
      let value = cleanCellText(cells?.[c]);
      if (name === '번호') value = normalizePhoneText(value);
      if (name === '기수') value = normalizeBirthText(value);
      if (value) hasValue = true;
      row[name] = value;
      if (name === '이름' && !hasSuffixColumn) row['구분'] = '';
    });
    if (hasValue) result.push(row);
  }
  return result;
}
