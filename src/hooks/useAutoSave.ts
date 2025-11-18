/**
 * 자동 저장 기능을 제공하는 커스텀 훅
 * 데이터 변경 후 일정 시간이 지나면 자동으로 저장
 */
import { useEffect, useRef, useState } from 'react';

interface UseAutoSaveOptions<T> {
  /** 저장 함수 */
  onSave: (data: T) => void;
  /** 자동 저장 지연 시간 (ms) */
  delay?: number;
  /** 자동 저장 활성화 여부 */
  enabled?: boolean;
}

/**
 * 자동 저장 훅
 * @param data 저장할 데이터
 * @param options 옵션
 * @returns 저장 관련 상태 및 함수
 */
export function useAutoSave<T>(data: T | null, options: UseAutoSaveOptions<T>) {
  const { onSave, delay = 3000, enabled = true } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataRef = useRef<T | null>(null);

  /**
   * 수동 저장
   */
  const saveNow = () => {
    if (!data) return;

    setIsSaving(true);
    try {
      onSave(data);
      setLastSavedTime(new Date());
      setHasUnsavedChanges(false);
      prevDataRef.current = data;
    } catch (error) {
      console.error('저장 오류:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 자동 저장 효과
   */
  useEffect(() => {
    // 자동 저장이 비활성화되었거나 데이터가 없으면 스킵
    if (!enabled || !data) {
      return;
    }

    // 이전 데이터와 비교 (변경 감지)
    if (prevDataRef.current !== null && prevDataRef.current !== data) {
      setHasUnsavedChanges(true);

      // 기존 타이머 취소
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // 새 타이머 시작
      saveTimerRef.current = setTimeout(() => {
        saveNow();
      }, delay);
    } else if (prevDataRef.current === null) {
      // 최초 데이터 설정 시
      prevDataRef.current = data;
    }

    // 클린업
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [data, enabled, delay]);

  /**
   * 저장 상태 초기화
   */
  const resetSaveState = () => {
    setLastSavedTime(null);
    setHasUnsavedChanges(false);
    prevDataRef.current = null;
  };

  return {
    /** 저장 중 여부 */
    isSaving,
    /** 마지막 저장 시간 */
    lastSavedTime,
    /** 저장되지 않은 변경사항 여부 */
    hasUnsavedChanges,
    /** 수동 저장 */
    saveNow,
    /** 저장 상태 초기화 */
    resetSaveState,
  };
}
