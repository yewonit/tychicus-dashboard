import { useCallback, useState } from 'react';

/**
 * 토글 상태 관리 훅
 * @param initialValue 초기값 (기본: false)
 * @returns [현재 상태, 토글 함수, 직접 설정 함수]
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
}
