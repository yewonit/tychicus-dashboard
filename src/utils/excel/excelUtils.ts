/**
 * 엑셀 파일 처리 유틸리티
 */
import * as XLSX from 'xlsx';
import { SheetData } from '../../types';
import { ExcelConversionOptions } from '../../types/seasonUpdate';
import { isInternalField } from './excelFieldMapping';
import { MergeRange, parseSheetRows } from './sheetParser';

/**
 * 워크북의 각 시트를 SheetData로 변환합니다.
 * 헤더 행을 자동으로 찾고, 병합된 그룹 헤더로 다음/현재 회기 소속을 구분합니다.
 */
export function workbookToSheets(workbook: XLSX.WorkBook): SheetData[] {
  return workbook.SheetNames.map(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    // 엑셀 화면에 보이는 텍스트 그대로(raw: false) 읽고, 병합 범위와 행 번호가 맞도록 빈 행도 유지
    const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: true,
    });
    const origin = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']).s : { r: 0, c: 0 };
    const merges: MergeRange[] = (worksheet['!merges'] ?? []).map(m => ({
      s: { r: m.s.r - origin.r, c: m.s.c - origin.c },
      e: { r: m.e.r - origin.r, c: m.e.c - origin.c },
    }));
    return { sheetName, rows: parseSheetRows(rows, merges) };
  });
}

/**
 * 엑셀 파일을 SheetData 배열로 변환
 * @param file 업로드된 엑셀 파일
 * @param options 변환 옵션
 * @returns SheetData 배열
 */
export async function convertExcelToJson(file: File, options: ExcelConversionOptions = {}): Promise<SheetData[]> {
  const { minLoadingTime = 500 } = options;

  const startTime = Date.now();

  try {
    // 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheets = workbookToSheets(workbook);

    // 최소 로딩 시간 보장
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minLoadingTime) {
      await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
    }

    return sheets;
  } catch (error) {
    // 보안: 에러 객체 전체(파일 데이터 포함 가능)를 출력하지 않고 메시지만 기록
    console.error('엑셀 파일 변환 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    throw new Error('엑셀 파일을 읽는 중 오류가 발생했습니다.');
  }
}

/**
 * SheetData 배열을 엑셀 파일로 변환하여 다운로드
 * @param data SheetData 배열
 * @param fileName 파일명 (확장자 제외)
 */
export function downloadExcelFile(data: SheetData[], fileName: string = 'download'): void {
  try {
    const workbook = XLSX.utils.book_new();

    stripInternalFields(data).forEach(sheetData => {
      const worksheet = XLSX.utils.json_to_sheet(sheetData.rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.sheetName);
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    // 보안: 에러 객체 전체(파일 데이터 포함 가능)를 출력하지 않고 메시지만 기록
    console.error('엑셀 다운로드 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    throw new Error('엑셀 파일 다운로드 중 오류가 발생했습니다.');
  }
}

/**
 * 엑셀 데이터의 통계 정보 계산
 * @param data SheetData 배열
 * @returns 시트 수와 총 행 수
 */
export function getExcelDataStats(data: SheetData[]): { sheetCount: number; rowCount: number } {
  return {
    sheetCount: data.length,
    rowCount: data.reduce((sum, sheet) => sum + sheet.rows.length, 0),
  };
}

/**
 * 매칭 결과 등 내부 필드(_로 시작)를 뺀 시트 데이터를 반환합니다. (엑셀 다운로드용)
 */
export function stripInternalFields(data: SheetData[]): SheetData[] {
  return data.map(sheet => ({
    ...sheet,
    rows: sheet.rows.map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !isInternalField(key)))),
  }));
}
