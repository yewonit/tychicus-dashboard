/**
 * 회기 변경 관리 API 서비스
 */
import { SeasonUpdatePayload, UserData } from '../types/seasonUpdate';
import axiosClient from '../utils/axiosClient';

/**
 * 서버에서 전체 유저 데이터 가져오기
 * @returns 전체 유저 데이터 배열
 */
export async function fetchAllUsers(): Promise<UserData[]> {
  try {
    const response = await axiosClient.get<UserData[]>('/users');
    return response.data;
  } catch (error) {
    console.error('전체 유저 데이터 조회 오류:', error);
    throw new Error('전체 유저 데이터를 가져오는 중 오류가 발생했습니다.');
  }
}

/**
 * 회기 변경 적용
 * @param payload 회기 변경 데이터
 * @returns 성공 여부
 */
export async function applySeasonUpdate(payload: SeasonUpdatePayload): Promise<boolean> {
  try {
    const response = await axiosClient.post('/seasons', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000, // 60초
    });

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error('회기 변경 적용 API 오류:', error);
    throw new Error('회기 변경 적용 중 오류가 발생했습니다.');
  }
}
