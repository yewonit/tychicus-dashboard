import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  /** 에러 메시지 */
  error?: string;
  /** 기본 도움말 텍스트 */
  helperText?: string;
  /** 터치 여부 */
  touched?: boolean;
  /** DUGIGO 스타일 사용 여부 */
  dugigo?: boolean;
}

/**
 * 공통 폼 필드 컴포넌트
 * Material-UI TextField를 기반으로 한 공통 스타일 적용
 */
export const FormField: React.FC<FormFieldProps> = ({
  error,
  helperText,
  touched,
  dugigo = false,
  className = '',
  ...props
}) => {
  const hasError = touched && !!error;
  const displayText = hasError ? error : helperText;

  const getClassName = () => {
    const baseClass = dugigo ? 'dugigo-textfield' : 'common-textfield';
    return `${baseClass} ${className}`.trim();
  };

  return <TextField {...props} className={getClassName()} error={hasError} helperText={displayText} />;
};
