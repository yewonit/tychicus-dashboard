import { useCallback, useEffect, useState } from 'react';

/**
 * 로컬 스토리지 상태 관리 훅
 * @template T 저장할 데이터 타입
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [값, 설정 함수, 제거 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 로컬 스토리지에서 값을 가져오거나 초기값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 로컬 스토리지에 값을 저장하는 함수
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 함수인 경우 현재 값을 인자로 전달
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        // 로컬 스토리지에 저장
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // 로컬 스토리지에서 값을 제거하는 함수
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 다른 탭에서 로컬 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * 로컬 스토리지 값만 읽기 전용으로 사용하는 훅
 * @template T 읽을 데이터 타입
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns 저장된 값
 */
export function useLocalStorageValue<T>(key: string, initialValue: T): T {
  const [storedValue] = useLocalStorage(key, initialValue);
  return storedValue;
}
