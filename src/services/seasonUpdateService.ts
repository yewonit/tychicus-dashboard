/**
 * 회기 변경 관리 API 서비스
 */
import { SeasonUpdatePayload, SyncIdentifier, SyncResponse } from '../types/seasonUpdate';
// import { axiosClient } from '../utils/axiosClient';

/**
 * 서버와 데이터 동기화
 * @param identifiers 동기화할 식별자 배열
 * @returns 서버 응답 데이터
 */
export async function syncWithServer(identifiers: SyncIdentifier[]): Promise<SyncResponse[]> {
  try {
    // TODO: 실제 API 호출
    /*
    const response = await axiosClient.post<SyncResponse[]>('/api/members/sync', identifiers);
    return response.data;
    */

    // 임시: 서버 요청 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 임시 응답 데이터 (실제로는 서버에서 받아옴)
    const mockServerData = identifiers.map(id => ({
      name: id.name,
      phoneNumber: id.phone,
      email: `${id.name}@example.com`,
      gender: 'M',
      // ... 기타 서버에서 받아온 최신 정보
    }));

    return mockServerData;
  } catch (error) {
    console.error('서버 동기화 API 오류:', error);
    throw new Error('서버 동기화 중 오류가 발생했습니다.');
  }
}

/**
 * 회기 변경 적용
 * @param payload 회기 변경 데이터
 * @returns 성공 여부
 */
export async function applySeasonUpdate(payload: SeasonUpdatePayload): Promise<boolean> {
  try {
    // TODO: 실제 API 호출
    // 대용량 JSON 전송을 위한 설정
    /*
    const response = await axiosClient.post('/api/season/update', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000, // 60초
    });

    return response.status === 200;
    */

    // 임시: 성공 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    return true;
  } catch (error) {
    console.error('회기 변경 적용 API 오류:', error);
    throw new Error('회기 변경 적용 중 오류가 발생했습니다.');
  }
}
