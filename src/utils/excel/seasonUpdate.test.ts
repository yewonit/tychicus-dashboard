import { describe, expect, it } from '@jest/globals';
import { SheetData } from '../../types';
import { CurrentSeasonMember, UserData } from '../../types/seasonUpdate';
import { convertToSeasonUpdateData, toSeasonMemberData } from './dataMappingUtils';
import { ROW_MATCH_FIELD, ROW_USER_ID_FIELD } from './excelFieldMapping';
import { collectSeasonIssues, hasBlockingIssues } from './seasonIssues';
import {
  applyManualMatch,
  clearRowMatch,
  extractYearSuffix,
  getRowMatch,
  matchSheetsWithUsers,
} from './seasonMatching';
import { normalizeBirthText, normalizePhoneText, parseSheetRows } from './sheetParser';

describe('parseSheetRows', () => {
  // 국에서 받는 원본 양식: 빈 행 + 병합된 연도별 그룹 헤더 + 컬럼명 행
  const rawRows = [
    [],
    ['', '2026년 소속', '', '', '2025년 소속', '', '', '기본정보', '', '', ''],
    ['2026년 직분', '국', '그룹', '순', '국', '그룹', '순', '이름', '성별', '기수', '연락처'],
    ['그룹장', '청년1국', '강그룹', '강순', '1국', '김그룹', '이순', ' 강병관 ', '남', '1987', '010 9031 4726'],
    ['', '청년1국', '강그룹', '강순', '2국', '송그룹', '허순', '유은지', '여', '90', '‭010-3742-1801‬'],
    ['', '', '', '', '', '', '', '', '', '', ''],
  ];
  const merges = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
    { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } },
    { s: { r: 1, c: 7 }, e: { r: 1, c: 10 } },
  ];

  it('연도가 큰 소속은 다음 회기, 작은 소속은 현재 회기 컬럼으로 읽고 구분 컬럼을 추가한다', () => {
    const rows = parseSheetRows(rawRows, merges);
    expect(rows).toHaveLength(2); // 빈 행 제외
    expect(Object.keys(rows[0])).toEqual([
      '직분',
      '국',
      '그룹',
      '순',
      '현재 국',
      '현재 그룹',
      '현재 순',
      '이름',
      '구분',
      '성별',
      '기수',
      '번호',
    ]);
    expect(rows[0]).toMatchObject({ 직분: '그룹장', 국: '청년1국', '현재 국': '1국', 이름: '강병관', 기수: '87' });
  });

  it('형식만 다른 연락처는 010-0000-0000으로 맞추고 보이지 않는 문자를 지운다', () => {
    const rows = parseSheetRows(rawRows, merges);
    expect(rows[0]['번호']).toBe('010-9031-4726');
    expect(rows[1]['번호']).toBe('010-3742-1801');
  });

  it('첫 행에 컬럼명이 있는 템플릿도 그대로 읽는다', () => {
    const rows = parseSheetRows([
      ['국', '그룹', '순', '이름', '구분', '번호', '직분', '기수'],
      ['1국', '김그룹', '이순', '홍길동', 'A', '01012345678', '순원', '96'],
    ]);
    expect(rows).toEqual([
      {
        국: '1국',
        그룹: '김그룹',
        순: '이순',
        이름: '홍길동',
        구분: 'A',
        번호: '010-1234-5678',
        직분: '순원',
        기수: '96',
      },
    ]);
  });
});

describe('normalizePhoneText / normalizeBirthText', () => {
  it.each([
    ['010-42686170', '010-4268-6170'],
    ['1012345678', '010-1234-5678'],
    ['010-8898-473', '010-8898-473'],
    ['카톡 보유', '카톡 보유'],
  ])('연락처 %s → %s', (input, expected) => expect(normalizePhoneText(input)).toBe(expected));

  it.each([
    ['2000', '00'],
    ['5', '05'],
    ['96', '96'],
    ['X', 'X'],
  ])('기수 %s → %s', (input, expected) => expect(normalizeBirthText(input)).toBe(expected));
});

describe('extractYearSuffix', () => {
  it('1월 1일생(UTC 전날 15시)도 KST 연도로 계산한다', () => {
    expect(extractYearSuffix('1995-12-31T15:00:00.000Z')).toBe('96');
  });
});

describe('matchSheetsWithUsers', () => {
  const users: UserData[] = [
    { id: 1, name: '홍길동', nameSuffix: 'A', phoneNumber: '01011112222', birthDate: '1995-12-31T15:00:00.000Z' },
    { id: 2, name: '홍길동', nameSuffix: 'B', phoneNumber: '01033334444', birthDate: '1997-12-31T15:00:00.000Z' },
    { id: 3, name: '홍길동', nameSuffix: 'C', phoneNumber: '01055556666', birthDate: '1995-12-31T15:00:00.000Z' },
    { id: 4, name: '김철수', nameSuffix: 'A', phoneNumber: '01077778888', birthDate: '1989-12-31T15:00:00.000Z' },
    { id: 5, name: '이영희', nameSuffix: 'A', phoneNumber: '', birthDate: null, isDeleted: true },
  ];
  const members: CurrentSeasonMember[] = [
    {
      userId: 3,
      name: '홍길동',
      nameSuffix: 'C',
      phoneNumber: '01055556666',
      birthYear: '96',
      gook: '1국',
      group: '김그룹',
      soon: '이순',
      role: '순원',
    },
  ];
  const sheet = (rows: Record<string, any>[]): SheetData[] => [{ sheetName: 's', rows }];
  const match = (rows: Record<string, any>[]) => matchSheetsWithUsers(sheet(rows), users, members).sheets[0].rows;

  it('동명이인은 연락처로 특정한다', () => {
    const [row] = match([{ 이름: '홍길동', 번호: '010-3333-4444' }]);
    expect(row[ROW_USER_ID_FIELD]).toBe(2);
    expect(getRowMatch(row)).toEqual({ status: 'matched', source: 'auto' });
    expect(row['구분']).toBe('B'); // 빈 칸 채움
  });

  it('기수가 같은 동명이인이 여럿이면 엑셀의 현재 소속으로 좁힌다', () => {
    const [row] = match([
      { 이름: '홍길동', 기수: '96', '현재 국': '청년1국', '현재 그룹': '김그룹', '현재 순': '이순' },
    ]);
    expect(row[ROW_USER_ID_FIELD]).toBe(3);
  });

  it('끝까지 한 명으로 좁히지 못하면 ambiguous로 실패한다', () => {
    const [row] = match([{ 이름: '홍길동', 기수: '96' }]);
    expect(getRowMatch(row)).toEqual({ status: 'failed', reason: 'ambiguous', candidateCount: 2 });
    expect(row[ROW_USER_ID_FIELD]).toBeUndefined();
  });

  it('같은 이름이 없거나 삭제된 유저뿐이면 not_found', () => {
    expect(getRowMatch(match([{ 이름: '이영희' }])[0])).toMatchObject({ status: 'failed', reason: 'not_found' });
  });

  it('한 명뿐이어도 연락처와 기수가 모두 다르면 conflict로 실패한다', () => {
    expect(getRowMatch(match([{ 이름: '김철수', 번호: '010-0000-1111', 기수: '99' }])[0])).toMatchObject({
      status: 'failed',
      reason: 'conflict',
    });
  });

  it('휴대폰 형식이 아닌 연락처("0")는 비교하지 않는다', () => {
    expect(getRowMatch(match([{ 이름: '김철수', 번호: '0', 기수: '99' }])[0])).toEqual({
      status: 'matched',
      source: 'auto',
    });
  });

  it('직접 매칭한 행은 다시 동기화해도 유지한다', () => {
    const manual = applyManualMatch({ 이름: '홍길둥', 기수: '96' }, users[0]);
    expect(manual).toMatchObject({ 이름: '홍길동', 구분: 'A', [ROW_USER_ID_FIELD]: 1 });
    const result = matchSheetsWithUsers(sheet([manual]), users, members);
    expect(result.summary.keptManual).toBe(1);
    expect(result.sheets[0].rows[0][ROW_USER_ID_FIELD]).toBe(1);
  });

  it('이름을 고치면(clearRowMatch) 매칭 결과가 지워진다', () => {
    const cleared = clearRowMatch(applyManualMatch({ 이름: '홍길동' }, users[0]));
    expect(cleared[ROW_MATCH_FIELD]).toBeUndefined();
    expect(cleared[ROW_USER_ID_FIELD]).toBeUndefined();
  });
});

describe('collectSeasonIssues / toSeasonMemberData', () => {
  it('매칭 실패·미동기화·국그룹순 오류가 있으면 적용을 막는다', () => {
    const issues = collectSeasonIssues([
      {
        sheetName: 's',
        rows: [
          {
            국: '1국',
            그룹: '김그룹',
            순: '이순',
            이름: '가',
            기수: '96',
            [ROW_MATCH_FIELD]: { status: 'failed', reason: 'not_found', candidateCount: 0 },
          },
          {
            국: '1국',
            그룹: '김',
            순: '이순',
            이름: '나',
            기수: '96',
            [ROW_MATCH_FIELD]: { status: 'matched', source: 'auto' },
          },
          { 국: '1국', 그룹: '김그룹', 순: '이순', 이름: '다', 기수: 'X' },
          { 국: '', 그룹: '', 순: '', 이름: '' },
        ],
      },
    ]);
    expect(issues.matchFailures).toEqual([{ sheetIndex: 0, rowIndex: 0 }]);
    expect(issues.blockingWarningCount).toBe(1); // '김'은 '그룹'으로 끝나지 않음
    expect(issues.unverifiedCount).toBe(1);
    expect(issues.namelessCount).toBe(1);
    expect(issues.valueWarnings.map(w => w.column)).toEqual(['그룹', '기수', '이름']);
    expect(hasBlockingIssues(issues)).toBe(true);
  });

  it('API 항목에는 userId를 넣고 서버가 거절할 연락처·기수와 참고용 컬럼은 빼며, 이름 없는 행은 제외한다', () => {
    const row = {
      국: '청년1국',
      그룹: '김그룹',
      순: '이순',
      이름: '홍길동',
      구분: '',
      번호: '카톡 보유',
      기수: 'X',
      '현재 국': '2국',
      [ROW_USER_ID_FIELD]: 7,
    };
    expect(toSeasonMemberData(row)).toEqual({
      gook: '청년1국',
      group: '김그룹',
      soon: '이순',
      name: '홍길동',
      userId: 7,
    });
    expect(convertToSeasonUpdateData([{ sheetName: 's', rows: [row, { 이름: '' }] }])).toHaveLength(1);
  });
});
