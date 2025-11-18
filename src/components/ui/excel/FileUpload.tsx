import React, { useRef, useState } from 'react';

interface FileUploadProps {
  /** 파일 선택 시 호출되는 콜백 */
  onFileSelect: (file: File) => void;
  /** 허용할 파일 확장자 (기본값: .xlsx, .xls) */
  acceptedExtensions?: string[];
  /** 표시할 안내 문구 */
  message?: string;
}

/**
 * 엑셀 파일 업로드 컴포넌트
 * 클릭 또는 드래그 앤 드롭으로 파일 업로드 지원
 */
const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedExtensions = ['.xlsx', '.xls'],
  message = '클릭 또는 드래그해서 엑셀 파일을 넣어주세요',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * 파일 타입 검증
   */
  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    const isValidExtension = acceptedExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExtension) {
      setError(`허용된 파일 형식: ${acceptedExtensions.join(', ')}`);
      return false;
    }

    setError('');
    return true;
  };

  /**
   * 파일 선택 처리
   */
  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  /**
   * 파일 입력 변경 이벤트
   */
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * 드래그 오버 이벤트
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  /**
   * 드래그 나가기 이벤트
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  /**
   * 드롭 이벤트
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * 클릭 이벤트 - 파일 선택 다이얼로그 열기
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='file-upload-wrapper'>
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className='file-upload-icon'>📄</div>
        <p className='file-upload-message'>{message}</p>
        {error && <p className='file-upload-error'>{error}</p>}
        <input
          ref={fileInputRef}
          type='file'
          accept={acceptedExtensions.join(',')}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default FileUpload;
