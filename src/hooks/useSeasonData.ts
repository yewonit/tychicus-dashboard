/**
 * 회기 변경 데이터 관리 훅
 * localStorage를 사용한 데이터 영속성 관리
 */
import { useEffect, useState } from 'react';
import { SheetData } from '../types';

const STORAGE_KEY = 'seasonUpdateData';

/**
 * 회기 변경 데이터를 관리하는 커스텀 훅
 */
export function useSeasonData() {
  const [data, setData] = useState<SheetData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * localStorage에서 데이터 불러오기
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * localStorage에서 데이터 로드
   */
  const loadData = () => {
    setIsLoading(true);
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData) as SheetData[];
        setData(parsedData);
      }
    } catch (error) {
      console.error('저장된 데이터 파싱 오류:', error);
      // 파싱 실패 시 localStorage 클리어
      localStorage.removeItem(STORAGE_KEY);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데이터를 상태와 localStorage에 저장
   */
  const saveData = (newData: SheetData[]) => {
    try {
      setData(newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error('데이터 저장 오류:', error);
      throw new Error('데이터 저장 중 오류가 발생했습니다.');
    }
  };

  /**
   * 데이터 초기화
   */
  const clearData = () => {
    setData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * 데이터 업데이트 (기존 데이터를 수정)
   */
  const updateData = (updater: (prevData: SheetData[]) => SheetData[]) => {
    if (data) {
      const newData = updater(data);
      saveData(newData);
    }
  };

  return {
    /** 현재 데이터 */
    data,
    /** 로딩 상태 */
    isLoading,
    /** 데이터 저장 */
    saveData,
    /** 데이터 초기화 */
    clearData,
    /** 데이터 업데이트 */
    updateData,
    /** 데이터 다시 로드 */
    loadData,
  };
}
