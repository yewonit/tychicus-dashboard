import { useCallback, useState } from 'react';

/**
 * 범용 폼 상태 관리 훅
 * @template T 폼 데이터 타입
 */
export interface UseFormProps<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, (value: any) => string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T) => void;
  validateField: (field: keyof T) => string;
  validateForm: () => boolean;
  handleChange: (
    field: keyof T
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 단일 필드 값 업데이트
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // 단일 필드 에러 설정
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // 단일 필드 터치 상태 설정
  const setTouched = useCallback((field: keyof T) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
  }, []);

  // 단일 필드 검증
  const validateField = useCallback(
    (field: keyof T): string => {
      const value = values[field];
      const validator = validationRules[field];

      if (validator) {
        return validator(value);
      }
      return '';
    },
    [values, validationRules]
  );

  // 전체 폼 검증
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field as keyof T);
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  // 입력 핸들러
  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(field, value);

      // 실시간 검증
      if (touched[field]) {
        const error = validateField(field);
        setError(field, error);
      }
    },
    [setValue, setError, validateField, touched]
  );

  // 블러 핸들러
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(field);
      const error = validateField(field);
      setError(field, error);
    },
    [setTouched, validateField, setError]
  );

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || !onSubmit) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        // 에러 처리
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSubmit, values]
  );

  // 폼 리셋
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 폼 유효성 계산
  const isValid = Object.keys(validationRules).every(
    field => !validateField(field as keyof T)
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setError,
    setTouched,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
