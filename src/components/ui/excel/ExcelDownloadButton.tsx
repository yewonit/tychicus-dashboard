import React from 'react';
import * as XLSX from 'xlsx';
import { SheetData } from '../../../types';

interface ExcelDownloadButtonProps {
  /** 다운로드할 데이터 (sheets 배열) */
  data: SheetData[];
  /** 기본 파일명 (확장자 제외) */
  fileName?: string;
  /** 버튼 텍스트 */
  buttonText?: string;
  /** 버튼 클래스명 */
  className?: string;
  /** 다운로드 시작 전 콜백 */
  onBeforeDownload?: () => boolean;
  /** 다운로드 완료 후 콜백 */
  onAfterDownload?: () => void;
}

/**
 * JSON 데이터를 엑셀 파일로 다운로드하는 버튼 컴포넌트
 * 파일명과 저장 위치는 브라우저의 다운로드 다이얼로그에서 사용자가 선택
 */
const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({
  data,
  fileName = 'data',
  buttonText = '엑셀 다운로드',
  className = 'excel-download-button',
  onBeforeDownload,
  onAfterDownload,
}) => {
  /**
   * JSON 데이터를 엑셀 파일로 변환하여 다운로드
   */
  const handleDownload = () => {
    // 다운로드 전 콜백 실행
    if (onBeforeDownload && !onBeforeDownload()) {
      return;
    }

    try {
      // 데이터 검증
      if (!data || data.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }

      // 새 워크북 생성
      const workbook = XLSX.utils.book_new();

      // 각 시트 추가
      data.forEach(sheet => {
        const { sheetName, rows } = sheet;

        // rows가 비어있으면 빈 시트 추가
        if (!rows || rows.length === 0) {
          const emptySheet = XLSX.utils.aoa_to_sheet([[]]);
          XLSX.utils.book_append_sheet(workbook, emptySheet, sheetName);
          return;
        }

        // JSON 데이터를 워크시트로 변환
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // 워크북에 워크시트 추가
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      // 파일 다운로드 (사용자가 저장 위치와 파일명 선택 가능)
      XLSX.writeFile(workbook, `${fileName}.xlsx`);

      // 다운로드 완료 후 콜백 실행
      if (onAfterDownload) {
        onAfterDownload();
      }
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      alert('엑셀 파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <button className={className} onClick={handleDownload}>
      {buttonText}
    </button>
  );
};

export default ExcelDownloadButton;
