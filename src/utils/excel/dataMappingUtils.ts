/**
 * 데이터 매핑 유틸리티
 * API 데이터와 엑셀 데이터 간의 변환 로직
 */
import { SheetData } from '../../types';
import { UserData } from '../../types/seasonUpdate';
import { EXCEL_TO_API_FIELD_MAPPING } from './excelFieldMapping';

/**
 * 엑셀 컬럼명을 API 필드명으로 변환
 * @param excelColumnName 엑셀 컬럼명
 * @returns API 필드명 (매핑이 없으면 undefined)
 */
export function excelColumnToApiField(excelColumnName: string): string | undefined {
  return EXCEL_TO_API_FIELD_MAPPING[excelColumnName];
}

/**
 * 엑셀 행 데이터를 API 요청 형식으로 변환
 * @param excelRow 엑셀 행 데이터
 * @returns API 요청 데이터
 */
export function mapExcelRowToApiData(excelRow: Record<string, any>): Record<string, any> {
  const apiData: Record<string, any> = {};

  Object.entries(excelRow).forEach(([excelColumn, value]) => {
    const apiField = excelColumnToApiField(excelColumn);
    if (apiField) {
      apiData[apiField] = value;
    } else {
      // 매핑되지 않은 컬럼은 그대로 전달
      apiData[excelColumn] = value;
    }
  });

  return apiData;
}

/**
 * 생년월일에서 연도의 끝 두자리만 추출
 * @param birthDate 생년월일 (YYYY-MM-DD 형식)
 * @returns 연도 끝 두자리 (예: 1999 -> "99")
 */
function extractYearSuffix(birthDate: string): string {
  const year = birthDate.split('-')[0];
  return year.slice(-2);
}

/**
 * 서버 데이터를 이용한 세부 동기화
 * @param excelData 엑셀 데이터
 * @param allUsers 서버에서 가져온 전체 유저 데이터
 * @returns 동기화된 엑셀 데이터 및 에러 행 정보
 */
export function syncExcelDataWithUserData(
  excelData: SheetData[],
  allUsers: UserData[]
): { updatedData: SheetData[]; errorRows: Set<string> } {
  const errorRows = new Set<string>();

  const updatedData = excelData.map((sheet, sheetIndex) => {
    const updatedRows = sheet.rows.map((row, rowIndex) => {
      const rowName = row['이름'];
      if (!rowName) {
        return row;
      }

      // 1. 이름으로 서버 데이터에서 검색
      const matchedUsers = allUsers.filter(user => user.name === rowName);

      if (matchedUsers.length === 0) {
        // 서버에 해당 이름이 없으면 그대로 반환
        return row;
      }

      if (matchedUsers.length === 1) {
        // 2. 한 명만 찾은 경우: 빈칸만 채우기
        const userData = matchedUsers[0];
        return fillEmptyFields(row, userData);
      }

      // 3. 여러 명을 찾은 경우: '구분'으로 추가 검색
      const rowNameSuffix = row['구분'];

      if (!rowNameSuffix) {
        // 4. '구분'이 빈칸인 경우: 에러 행으로 표시
        errorRows.add(`${sheetIndex}-${rowIndex}`);
        return row;
      }

      // '이름' + '구분'으로 검색
      const exactMatch = matchedUsers.find(user => user.name_suffix === rowNameSuffix);

      if (exactMatch) {
        // 정확히 한 명 찾음: 빈칸 채우기
        return fillEmptyFields(row, exactMatch);
      }

      // 매칭 실패 시 그대로 반환
      return row;
    });

    return {
      ...sheet,
      rows: updatedRows,
    };
  });

  return { updatedData, errorRows };
}

/**
 * 행의 빈 필드만 서버 데이터로 채우기
 * @param row 엑셀 행 데이터
 * @param userData 서버 유저 데이터
 * @returns 업데이트된 행 데이터
 */
function fillEmptyFields(row: Record<string, any>, userData: UserData): Record<string, any> {
  const updatedRow = { ...row };

  // '구분' (name_suffix) - 빈칸인 경우만 채우기
  if (!updatedRow['구분'] && userData.name_suffix) {
    updatedRow['구분'] = userData.name_suffix;
  }

  // '번호' (phone) - 빈칸인 경우만 채우기
  if (!updatedRow['번호'] && userData.phone) {
    updatedRow['번호'] = userData.phone;
  }

  // '기수' (birth_date) - 빈칸인 경우만 연도 끝 두자리 채우기
  if (!updatedRow['기수'] && userData.birth_date) {
    updatedRow['기수'] = extractYearSuffix(userData.birth_date);
  }

  return updatedRow;
}
