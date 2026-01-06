/**
 * 폼 검증 유틸리티
 */

// 기본 검증 규칙
export const validationRules = {
  /**
   * 필수 입력 검증
   */
  required: (value: any, fieldName: string = '필드') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName}을(를) 입력해주세요.`;
    }
    return '';
  },

  /**
   * 이메일 형식 검증
   */
  email: (value: string) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    return '';
  },

  /**
   * 비밀번호 강도 검증
   */
  password: (value: string) => {
    if (!value) return '비밀번호를 입력해주세요.';

    // if (value.length < 8) {
    //   return '비밀번호는 8자 이상이어야 합니다.';
    // }

    // if (!/[a-z]/.test(value)) {
    //   return '영어 소문자를 포함해야 합니다.';
    // }

    // if (!/[0-9]/.test(value)) {
    //   return '숫자를 포함해야 합니다.';
    // }

    // if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    //   return '특수문자를 포함해야 합니다.';
    // }

    return '';
  },

  /**
   * 비밀번호 확인 검증
   */
  confirmPassword: (value: string, originalPassword: string) => {
    if (!value) return '비밀번호 확인을 입력해주세요.';
    if (value !== originalPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  },

  /**
   * 전화번호 검증
   */
  phoneNumber: (value: string) => {
    if (!value) return '';

    // 숫자만 허용
    const numbersOnly = value.replace(/[^0-9]/g, '');

    if (numbersOnly.length < 10 || numbersOnly.length > 11) {
      return '올바른 전화번호를 입력해주세요. (10-11자리)';
    }

    if (!/^01[0-9]/.test(numbersOnly)) {
      return '휴대폰 번호는 010, 011, 016, 017, 018, 019로 시작해야 합니다.';
    }

    return '';
  },

  /**
   * 최소 길이 검증
   */
  minLength: (minLength: number) => (value: string) => {
    if (!value) return '';
    if (value.length < minLength) {
      return `최소 ${minLength}자 이상 입력해주세요.`;
    }
    return '';
  },

  /**
   * 최대 길이 검증
   */
  maxLength: (maxLength: number) => (value: string) => {
    if (!value) return '';
    if (value.length > maxLength) {
      return `최대 ${maxLength}자까지 입력 가능합니다.`;
    }
    return '';
  },

  /**
   * 숫자만 허용
   */
  numbersOnly: (value: string) => {
    if (!value) return '';
    if (!/^\d+$/.test(value)) {
      return '숫자만 입력 가능합니다.';
    }
    return '';
  },

  /**
   * 한글만 허용
   */
  koreanOnly: (value: string) => {
    if (!value) return '';
    if (!/^[ㄱ-ㅎ가-힣\s]+$/.test(value)) {
      return '한글만 입력 가능합니다.';
    }
    return '';
  },

  /**
   * 이름 검증 (한글/영문만 허용)
   */
  name: (value: string) => {
    if (!value) return '';
    const trimmed = value.trim();

    // 최소 길이 검증
    if (trimmed.length < 2) {
      return '이름은 최소 2자 이상 입력해주세요.';
    }

    // 최대 길이 검증
    if (trimmed.length > 20) {
      return '이름은 최대 20자까지 입력 가능합니다.';
    }

    // 한글/영문/공백만 허용
    if (!/^[가-힣a-zA-Z\s]+$/.test(trimmed)) {
      return '이름은 한글 또는 영문만 입력 가능합니다.';
    }

    return '';
  },

  /**
   * 동명이인 구분자 검증 (영문/숫자만 허용)
   */
  nameSuffix: (value: string) => {
    if (!value) return '';
    const trimmed = value.trim();

    // 최대 길이 검증
    if (trimmed.length > 10) {
      return '동명이인 구분자는 최대 10자까지 입력 가능합니다.';
    }

    // 영문/숫자만 허용
    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return '동명이인 구분자는 영문 또는 숫자만 입력 가능합니다.';
    }

    return '';
  },

  /**
   * 생년월일 검증 (YYYY-MM-DD 형식)
   */
  birthDate: (value: string) => {
    if (!value) return '';

    // YYYY-MM-DD 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return '올바른 날짜 형식을 입력해주세요. (YYYY-MM-DD)';
    }

    // 유효한 날짜인지 확인
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜입니다.';
    }

    // 입력된 날짜와 파싱된 날짜가 일치하는지 확인 (예: 2024-13-01 방지)
    const [year, month, day] = value.split('-').map(Number);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return '유효하지 않은 날짜입니다.';
    }

    // 미래 날짜 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return '미래 날짜는 입력할 수 없습니다.';
    }

    // 너무 오래된 날짜 방지 (1900년 이전)
    const minDate = new Date('1900-01-01');
    if (date < minDate) {
      return '1900년 이후의 날짜만 입력 가능합니다.';
    }

    return '';
  },
};

/**
 * 복합 검증 함수 생성기
 */
export const createValidator = (...validators: ((value: any) => string)[]) => {
  return (value: any): string => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return '';
  };
};

/**
 * 자주 사용되는 검증 규칙 조합
 */
export const commonValidators = {
  // 필수 이메일
  requiredEmail: createValidator(value => validationRules.required(value, '이메일'), validationRules.email),

  // 필수 비밀번호
  requiredPassword: createValidator(validationRules.password),

  // 필수 이름
  requiredName: createValidator(value => validationRules.required(value, '이름'), validationRules.koreanOnly),

  // 필수 이름 (한글/영문 허용)
  requiredNameWithEnglish: createValidator(value => validationRules.required(value, '이름'), validationRules.name),

  // 필수 동명이인 구분자
  requiredNameSuffix: createValidator(
    value => validationRules.required(value, '동명이인 구분자'),
    validationRules.nameSuffix
  ),

  // 필수 전화번호
  requiredPhoneNumber: createValidator(
    value => validationRules.required(value, '전화번호'),
    validationRules.phoneNumber
  ),
};
