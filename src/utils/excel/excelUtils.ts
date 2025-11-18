/**
 * 엑셀 파일 처리 유틸리티
 */
import * as XLSX from 'xlsx';
import { SheetData } from '../../types';
import { ExcelConversionOptions } from '../../types/seasonUpdate';

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

    // 각 시트를 JSON으로 변환
    const sheets: SheetData[] = workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

      return {
        sheetName,
        rows: jsonData,
      };
    });

    // 최소 로딩 시간 보장
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minLoadingTime) {
      await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
    }

    return sheets;
  } catch (error) {
    console.error('엑셀 파일 변환 오류:', error);
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

    data.forEach(sheetData => {
      const worksheet = XLSX.utils.json_to_sheet(sheetData.rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.sheetName);
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('엑셀 다운로드 오류:', error);
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
