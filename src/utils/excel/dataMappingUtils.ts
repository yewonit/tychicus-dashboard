/**
 * 데이터 매핑 유틸리티
 * 엑셀 데이터를 회기 변경 API 요청 형식으로 변환하는 로직
 */
import { SheetData } from '../../types';
import { SeasonMemberData } from '../../types/seasonUpdate';
import { ROW_USER_ID_FIELD } from './excelFieldMapping';
import { hasName, toBirthYearSuffix } from './seasonMatching';

/**
 * 엑셀 행을 회기 변경 API 요청 항목으로 변환합니다.
 * - 매칭된 행은 userId를 함께 보내 서버가 이름으로 다시 찾지 않게 합니다.
 * - 서버가 거절하는 형식의 연락처·기수는 보내지 않습니다. (userId가 있으면 매칭에 필요 없음)
 * - 현재 소속·성별 등 API에 없는 컬럼은 보내지 않습니다.
 */
export function toSeasonMemberData(row: Record<string, any>): SeasonMemberData {
  const text = (value: unknown) => String(value ?? '').trim();
  const member: SeasonMemberData = {
    gook: text(row['국']),
    group: text(row['그룹']),
    soon: text(row['순']),
    name: text(row['이름']),
  };

  const userId = Number(row[ROW_USER_ID_FIELD]);
  if (Number.isInteger(userId) && userId > 0) member.userId = userId;

  const nameSuffix = text(row['구분']);
  if (nameSuffix) member.nameSuffix = nameSuffix;

  const role = text(row['직분']);
  if (role) member.role = role;

  const phone = text(row['번호']).replace(/\D/g, '');
  if (/^01\d{8,9}$/.test(phone)) member.phoneNumber = phone;

  const birth = toBirthYearSuffix(row['기수']);
  if (birth) member.birthDate = birth;

  return member;
}

/**
 * 엑셀 데이터를 회기 변경 API 요청 형식으로 변환
 * 시트 이름 오름차순으로 정렬하여 모든 데이터를 하나의 배열로 병합하고, 이름이 없는 행은 제외합니다.
 * @param excelData 엑셀 데이터 (시트 배열)
 * @returns API 요청용 회원 데이터 배열
 */
export function convertToSeasonUpdateData(excelData: SheetData[]): SeasonMemberData[] {
  const sortedSheets = [...excelData].sort((a, b) =>
    a.sheetName.localeCompare(b.sheetName, 'ko-KR', { numeric: true })
  );
  return sortedSheets.flatMap(sheet => sheet.rows.filter(hasName).map(toSeasonMemberData));
}
