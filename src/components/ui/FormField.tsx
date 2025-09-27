import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  /** 에러 메시지 */
  error?: string;
  /** 기본 도움말 텍스트 */
  helperText?: string;
  /** 터치 여부 */
  touched?: boolean;
}

/**
 * 공통 폼 필드 컴포넌트
 * Material-UI TextField를 기반으로 한 공통 스타일 적용
 */
export const FormField: React.FC<FormFieldProps> = ({ error, helperText, touched, className = '', ...props }) => {
  const hasError = touched && !!error;
  const displayText = hasError ? error : helperText;

  return <TextField {...props} className={`common-textfield ${className}`} error={hasError} helperText={displayText} />;
};
