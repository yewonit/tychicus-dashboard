/**
 * 회기 변경 관리 API 서비스
 */
import { CurrentSeasonMember, SeasonApplySummary, SeasonUpdatePayload, UserData } from '../types/seasonUpdate';
import { getApiErrorMessage } from '../utils/apiError';
import axiosClient from '../utils/axiosClient';

/**
 * 서버에서 전체 유저 데이터 가져오기
 * @returns 전체 유저 데이터 배열
 */
export async function fetchAllUsers(): Promise<UserData[]> {
  try {
    const response = await axiosClient.get('/users');
    return response.data.data as UserData[];
  } catch (error) {
    // 보안: 에러 객체 전체(유저 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
    console.error('전체 유저 데이터 조회 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    throw new Error(getApiErrorMessage(error, '전체 유저 데이터를 가져오는 중 오류가 발생했습니다.'));
  }
}

/**
 * 현재 회기 구성원과 소속(국/그룹/순) 가져오기 — 재매칭용
 * @returns 현재 회기 구성원 배열 (직분이 여러 개인 사용자는 여러 행)
 */
export async function fetchCurrentSeasonMembers(): Promise<CurrentSeasonMember[]> {
  try {
    const response = await axiosClient.get('/seasons/current/members', { timeout: 30000 });
    return response.data.data as CurrentSeasonMember[];
  } catch (error) {
    console.error('현재 회기 구성원 조회 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    throw new Error(getApiErrorMessage(error, '현재 회기 구성원을 가져오는 중 오류가 발생했습니다.'));
  }
}

/**
 * 회기 변경 적용
 * @param payload 회기 변경 데이터
 * @returns 적용 결과 요약 (조직/직분을 얼마나 재사용·생성·삭제했는지, 서버가 주지 않으면 null)
 */
export async function applySeasonUpdate(payload: SeasonUpdatePayload): Promise<SeasonApplySummary | null> {
  try {
    const response = await axiosClient.post('/seasons', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000, // 60초
    });

    return (response.data?.summary as SeasonApplySummary | undefined) ?? null;
  } catch (error) {
    // 보안: 에러 객체 전체(요청 본문에 유저 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
    console.error('회기 변경 적용 API 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
    // 백엔드 검증 메시지(예: "홍길동 (전화번호: ...) 사용자를 찾을 수 없습니다.")를 그대로 보여줘야 어느 행이 문제인지 알 수 있음
    throw new Error(getApiErrorMessage(error, '회기 변경 적용 중 오류가 발생했습니다.'));
  }
}
