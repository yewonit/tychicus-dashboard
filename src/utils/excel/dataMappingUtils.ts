/**
 * 데이터 매핑 유틸리티
 * API 데이터와 엑셀 데이터 간의 변환 로직
 */
import { SheetData } from '../types';
import { SyncIdentifier, SyncResponse } from '../types/seasonUpdate';
import { API_TO_EXCEL_FIELD_MAPPING, EXCEL_TO_API_FIELD_MAPPING, SYNC_IDENTIFIER_FIELDS } from './excelFieldMapping';

/**
 * 엑셀 데이터에서 동기화용 식별자 추출
 * @param excelData 엑셀 데이터
 * @returns 동기화용 식별자 배열
 */
export function extractSyncIdentifiers(excelData: SheetData[]): SyncIdentifier[] {
  const identifiers: SyncIdentifier[] = [];

  excelData.forEach(sheet => {
    sheet.rows.forEach(row => {
      const name = row[SYNC_IDENTIFIER_FIELDS.name];
      const phone = row[SYNC_IDENTIFIER_FIELDS.phoneNumber];

      if (name && phone) {
        identifiers.push({ name, phone });
      }
    });
  });

  return identifiers;
}

/**
 * API 필드명을 엑셀 컬럼명으로 변환
 * @param apiFieldName API 필드명
 * @returns 엑셀 컬럼명 (매핑이 없으면 undefined)
 */
export function apiFieldToExcelColumn(apiFieldName: string): string | undefined {
  return API_TO_EXCEL_FIELD_MAPPING[apiFieldName];
}

/**
 * 엑셀 컬럼명을 API 필드명으로 변환
 * @param excelColumnName 엑셀 컬럼명
 * @returns API 필드명 (매핑이 없으면 undefined)
 */
export function excelColumnToApiField(excelColumnName: string): string | undefined {
  return EXCEL_TO_API_FIELD_MAPPING[excelColumnName];
}

/**
 * 서버 응답 데이터를 엑셀 행 데이터로 매핑
 * @param serverData 서버 응답 데이터
 * @param existingRow 기존 엑셀 행 데이터
 * @returns 업데이트된 엑셀 행 데이터
 */
export function mapServerDataToExcelRow(
  serverData: SyncResponse,
  existingRow: Record<string, any>
): Record<string, any> {
  const updatedRow = { ...existingRow };

  // 서버 데이터의 각 필드를 엑셀 컬럼명으로 매핑
  Object.entries(serverData).forEach(([apiField, value]) => {
    const excelColumn = apiFieldToExcelColumn(apiField);
    if (excelColumn) {
      updatedRow[excelColumn] = value;
    }
  });

  return updatedRow;
}

/**
 * 엑셀 데이터를 서버 데이터와 동기화
 * @param excelData 엑셀 데이터
 * @param serverDataList 서버 응답 데이터 배열
 * @returns 동기화된 엑셀 데이터
 */
export function syncExcelDataWithServer(excelData: SheetData[], serverDataList: SyncResponse[]): SheetData[] {
  return excelData.map(sheet => {
    const updatedRows = sheet.rows.map(row => {
      const name = row[SYNC_IDENTIFIER_FIELDS.name];
      const phone = row[SYNC_IDENTIFIER_FIELDS.phoneNumber];

      // 서버 데이터에서 해당 행과 일치하는 데이터 찾기
      const matchedServerData = serverDataList.find(
        serverRow => serverRow.name === name && serverRow.phoneNumber === phone
      );

      if (matchedServerData) {
        return mapServerDataToExcelRow(matchedServerData, row);
      }

      return row;
    });

    return {
      ...sheet,
      rows: updatedRows,
    };
  });
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
