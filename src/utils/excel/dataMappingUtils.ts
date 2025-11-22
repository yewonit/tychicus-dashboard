/**
 * 데이터 매핑 유틸리티
 * API 데이터와 엑셀 데이터 간의 변환 로직
 */
import { SheetData } from '../../types';
import { SeasonMemberData, UserData } from '../../types/seasonUpdate';
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
      // 특정 필드는 파싱 적용
      if (excelColumn === '기수') {
        // 기수 컬럼 파싱 적용
        apiData[apiField] = parseBirthDate(value);
      } else if (excelColumn === '번호') {
        // 번호 컬럼 파싱 적용 (하이픈 제거)
        apiData[apiField] = parsePhoneNumber(value);
      } else {
        apiData[apiField] = value;
      }
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
 * 기수 컬럼 값 파싱
 * 규칙:
 * 1. 모든 값은 문자열 값
 * 2. 1996 과 같은 yyyy 포맷일 경우 뒤의 두자리만 남기기 (e.g. 96)
 * 3. 2 와 같이 숫자 하나만 있을 경우 앞에 0 붙이기 (e.g. 02)
 * 4. 02' 나 02" 나 - 와 같이 특수문자가 있을 경우 특수문자는 전부 삭제하기
 * @param value 기수 값
 * @returns 파싱된 기수 값 (문자열)
 */
function parseBirthDate(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // 1. 문자열로 변환
  let strValue = String(value).trim();

  // 4. 특수문자 제거 (숫자만 남기기)
  strValue = strValue.replace(/[^0-9]/g, '');

  // 빈 문자열이면 그대로 반환
  if (!strValue) {
    return '';
  }

  // 2. 4자리 숫자(년도)인 경우 뒤 두 자리만 남기기
  if (strValue.length === 4) {
    strValue = strValue.slice(-2);
  }

  // 3. 1자리 숫자인 경우 앞에 0 붙이기
  if (strValue.length === 1) {
    strValue = '0' + strValue;
  }

  return strValue;
}

/**
 * 번호 컬럼 값 파싱
 * 010-0000-0000 처럼 되어 있으면 모든 -와 띄어쓰기를 제거
 * @param value 번호 값
 * @returns 파싱된 번호 값
 */
function parsePhoneNumber(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  // 문자열로 변환하고 하이픈과 띄어쓰기 제거
  const strValue = String(value).trim();
  return strValue.replace(/[-\s]/g, '');
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

      // 3. 여러 명을 찾은 경우: 먼저 '이름 + 기수'로 검색
      const rowBirthDate = row['기수'];

      if (rowBirthDate) {
        // 엑셀의 기수 값이 있으면 파싱 (이미 파싱된 값일 수도 있지만 안전하게)
        const parsedBirthDate = parseBirthDate(rowBirthDate);

        if (parsedBirthDate) {
          // 서버의 birth_date에서 연도 뒤 두 자리 추출하여 비교
          const birthDateMatch = matchedUsers.find(user => {
            if (!user.birth_date) {
              return false; // 서버에 기수 데이터가 없으면 건너뛰기
            }
            const serverYearSuffix = extractYearSuffix(user.birth_date);
            return serverYearSuffix === parsedBirthDate;
          });

          if (birthDateMatch) {
            // '이름 + 기수'로 정확히 한 명 찾음: 빈칸 채우기
            return fillEmptyFields(row, birthDateMatch);
          }
        }
      }

      // 4. '이름 + 기수'로 매칭 실패 시 '이름 + 구분'으로 검색
      const rowNameSuffix = row['구분'];

      if (!rowNameSuffix) {
        // 5. '구분'이 빈칸인 경우: 에러 행으로 표시
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

  // '번호' (phone_number) - 빈칸인 경우만 채우기
  if (!updatedRow['번호'] && userData.phone_number) {
    updatedRow['번호'] = userData.phone_number;
  }

  // '기수' (birth_date) - 빈칸인 경우만 연도 끝 두자리 채우기
  if (!updatedRow['기수'] && userData.birth_date) {
    updatedRow['기수'] = extractYearSuffix(userData.birth_date);
  }

  return updatedRow;
}

/**
 * 엑셀 데이터를 회기 변경 API 요청 형식으로 변환
 * 시트 이름 오름차순으로 정렬하여 모든 데이터를 하나의 배열로 병합
 * @param excelData 엑셀 데이터 (시트 배열)
 * @returns API 요청용 회원 데이터 배열
 */
export function convertToSeasonUpdateData(excelData: SheetData[]): SeasonMemberData[] {
  // 시트를 이름 기준 오름차순으로 정렬
  const sortedSheets = [...excelData].sort((a, b) => {
    return a.sheetName.localeCompare(b.sheetName, 'ko-KR', { numeric: true });
  });

  // 모든 시트의 데이터를 하나의 배열로 병합
  const allMembers: SeasonMemberData[] = [];

  sortedSheets.forEach(sheet => {
    sheet.rows.forEach(row => {
      const memberData = mapExcelRowToApiData(row) as SeasonMemberData;
      allMembers.push(memberData);
    });
  });

  return allMembers;
}
