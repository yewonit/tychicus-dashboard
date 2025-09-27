import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 타입 정의
interface Visitation {
  id: number;
  대상자_이름: string;
  대상자_국: string;
  대상자_그룹: string;
  대상자_순: string;
  대상자_순장: string;
  대상자_생일연도: number;
  심방날짜: string;
  심방방법: string;
  진행자_이름: string;
  진행자_직분: string;
  진행자_국: string;
  진행자_그룹: string;
  진행자_순: string;
  진행자_생일연도: number;
  심방내용: string;
  대상자_사진: string | null;
  작성일시: string;
}

// 기수 계산 함수
const calculateGeneration = (birthYear: number): string => {
  if (!birthYear) return '';
  const yearString = birthYear.toString();
  return yearString.slice(-2); // 뒤의 2자리 추출
};

const VisitationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitation, setVisitation] = useState<Visitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    심방내용: '',
    심방날짜: '',
    심방방법: '',
  });
  const [isImproving, setIsImproving] = useState(false);
  const [improvedContent, setImprovedContent] = useState('');
  const [lastModified, setLastModified] = useState<string | null>(null);

  const fetchVisitationDetail = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      // 실제 API 호출 대신 목업 데이터 사용
      const mockVisitations: Visitation[] = [
        {
          id: 1,
          대상자_이름: '김민수',
          대상자_국: '1국',
          대상자_그룹: '김민수 그룹',
          대상자_순: '김민수 순',
          대상자_순장: '김민수',
          대상자_생일연도: 1995,
          심방날짜: '2024-01-20',
          심방방법: '만남',
          진행자_이름: '이지은',
          진행자_직분: '부그룹장',
          진행자_국: '1국',
          진행자_그룹: '김민수 그룹',
          진행자_순: '이지은 순',
          진행자_생일연도: 1997,
          심방내용:
            '최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다. 다음 주일 예배 참석을 약속하셨습니다.',
          대상자_사진: null,
          작성일시: '2024-01-20 15:30',
        },
        {
          id: 2,
          대상자_이름: '박준호',
          대상자_국: '2국',
          대상자_그룹: '박준호 그룹',
          대상자_순: '박준호 순',
          대상자_순장: '박준호',
          대상자_생일연도: 1994,
          심방날짜: '2024-01-19',
          심방방법: '통화',
          진행자_이름: '정현우',
          진행자_직분: '그룹장',
          진행자_국: '3국',
          진행자_그룹: '정현우 그룹',
          진행자_순: '정현우 순',
          진행자_생일연도: 1995,
          심방내용:
            '가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다. 정기적인 심방을 통해 지속적인 관심을 기울이기로 했습니다.',
          대상자_사진: null,
          작성일시: '2024-01-19 20:15',
        },
        {
          id: 3,
          대상자_이름: '최수진',
          대상자_국: '2국',
          대상자_그룹: '박준호 그룹',
          대상자_순: '최수진 순',
          대상자_순장: '최수진',
          대상자_생일연도: 1996,
          심방날짜: '2024-01-18',
          심방방법: '카카오톡',
          진행자_이름: '한소영',
          진행자_직분: '부그룹장',
          진행자_국: '3국',
          진행자_그룹: '정현우 그룹',
          진행자_순: '한소영 순',
          진행자_생일연도: 1998,
          심방내용:
            '최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다. 시험 후 정기적인 예배 참석을 약속하셨습니다.',
          대상자_사진: null,
          작성일시: '2024-01-18 22:45',
        },
        {
          id: 4,
          대상자_이름: '정현우',
          대상자_국: '3국',
          대상자_그룹: '정현우 그룹',
          대상자_순: '정현우 순',
          대상자_순장: '정현우',
          대상자_생일연도: 1995,
          심방날짜: '2024-01-25',
          심방방법: '만남',
          진행자_이름: '김민수',
          진행자_직분: '그룹장',
          진행자_국: '1국',
          진행자_그룹: '김민수 그룹',
          진행자_순: '김민수 순',
          진행자_생일연도: 1995,
          심방내용:
            '최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다. 다음 주일 예배 참석을 약속하셨습니다. 특히 가족 문제로 고민이 많다고 하셔서 함께 기도하고 성경 말씀을 나누었습니다.',
          대상자_사진: 'visitation_photo_20240125_143022.jpg',
          작성일시: '2024-01-25 14:30:22',
        },
        {
          id: 5,
          대상자_이름: '한소영',
          대상자_국: '3국',
          대상자_그룹: '정현우 그룹',
          대상자_순: '한소영 순',
          대상자_순장: '한소영',
          대상자_생일연도: 1998,
          심방날짜: '2024-01-24',
          심방방법: '통화',
          진행자_이름: '박준호',
          진행자_직분: '그룹장',
          진행자_국: '2국',
          진행자_그룹: '박준호 그룹',
          진행자_순: '박준호 순',
          진행자_생일연도: 1994,
          심방내용:
            '최근 건강 문제로 고민이 많다고 하셨습니다. 함께 기도하고 병원 검진을 권유했습니다. 정기적인 예배 참석과 기도생활을 통해 건강을 회복하시길 바랍니다.',
          대상자_사진: null,
          작성일시: '2024-01-24 16:45',
        },
      ];

      const foundVisitation = mockVisitations.find(v => v.id === parseInt(id));

      if (foundVisitation) {
        setVisitation(foundVisitation);
        setEditForm({
          심방내용: foundVisitation.심방내용,
          심방날짜: foundVisitation.심방날짜,
          심방방법: foundVisitation.심방방법,
        });
      } else {
        setError('심방 기록을 찾을 수 없습니다.');
      }
    } catch (error) {
      setError('심방 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVisitationDetail();
  }, [fetchVisitationDetail]);

  useEffect(() => {
    if (visitation && !isEditing) {
      setEditForm({
        심방내용: visitation.심방내용,
        심방날짜: visitation.심방날짜,
        심방방법: visitation.심방방법,
      });
    }
  }, [visitation, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!visitation) return;

    try {
      // 실제 API 호출 대신 목업 업데이트
      const currentTime = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const updatedVisitation: Visitation = {
        ...visitation,
        ...editForm,
      };

      setVisitation(updatedVisitation);
      setLastModified(currentTime);
      setIsEditing(false);

      // 성공 메시지
      alert('심방 기록이 성공적으로 수정되었습니다.');
    } catch (error) {
      alert('심방 기록 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    if (!visitation) return;

    setEditForm({
      심방내용: visitation.심방내용,
      심방날짜: visitation.심방날짜,
      심방방법: visitation.심방방법,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!visitation) return;

    if (window.confirm('이 심방 기록을 삭제하시겠습니까?')) {
      // 삭제 로직 구현
      navigate('/main/visitation');
    }
  };

  const handleBack = () => {
    navigate('/main/visitation');
  };

  const improveContent = async () => {
    if (!editForm.심방내용.trim()) {
      alert('심방 내용을 먼저 입력해주세요.');
      return;
    }

    setIsImproving(true);
    try {
      // 실제 API 호출 대신 목업 응답 사용
      const mockResponse = {
        improved_content:
          editForm.심방내용 +
          '\n\n[개선된 내용]\n' +
          '맞춤법과 문법을 검토하여 더 명확하고 읽기 쉬운 내용으로 개선되었습니다. ' +
          '특히 문장 구조와 표현을 자연스럽게 다듬었으며, 불필요한 반복을 줄이고 ' +
          '핵심 내용이 잘 전달되도록 수정했습니다.',
      };

      setImprovedContent(mockResponse.improved_content);

      // 내용 개선 로직

      alert('내용이 성공적으로 개선되었습니다!');
    } catch (error) {
      alert('내용 개선에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsImproving(false);
    }
  };

  const applyImprovedContent = () => {
    if (improvedContent) {
      setEditForm(prev => ({ ...prev, 심방내용: improvedContent }));
      setImprovedContent('');

      alert('개선된 내용이 적용되었습니다.');
    }
  };

  if (loading) {
    return (
      <div className='visitation-detail-container'>
        <div className='visitation-detail-loading'>심방 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='visitation-detail-container'>
        <div className='visitation-detail-error'>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={handleBack} className='visitation-detail-button'>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!visitation) {
    return (
      <div className='visitation-detail-container'>
        <div className='visitation-detail-error'>
          <h2>심방 기록을 찾을 수 없습니다</h2>
          <button onClick={handleBack} className='visitation-detail-button'>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='visitation-detail-container'>
      <div className='visitation-detail-header'>
        <h1>{visitation.대상자_이름}님 심방 상세</h1>
        <button onClick={handleBack} className='visitation-detail-back-button'>
          ← 목록으로 돌아가기
        </button>
      </div>

      <div className='visitation-detail-content-grid'>
        <div className='visitation-detail-main-content'>
          <div className='visitation-detail-section'>
            <h3>심방 내용</h3>
            {isEditing ? (
              <>
                <textarea
                  className='visitation-detail-editable-textarea'
                  value={editForm.심방내용}
                  onChange={e =>
                    setEditForm(prev => ({
                      ...prev,
                      심방내용: e.target.value,
                    }))
                  }
                  placeholder='심방 내용을 입력하세요...'
                />

                {/* 맞춤법 개선 버튼 */}
                <div className='visitation-detail-improve-section'>
                  <button
                    onClick={improveContent}
                    disabled={isImproving || !editForm.심방내용.trim()}
                    className='visitation-detail-improve-button'
                  >
                    {isImproving ? '🔄 개선 중...' : '✨ 맞춤법 및 문체 개선'}
                  </button>

                  {improvedContent && (
                    <button onClick={applyImprovedContent} className='visitation-detail-apply-button'>
                      💾 개선된 내용 적용
                    </button>
                  )}
                </div>

                {/* 개선된 내용 표시 영역 */}
                {improvedContent && (
                  <div className='visitation-detail-improved-preview'>
                    <h4>✨ 개선된 내용 미리보기</h4>
                    <div className='visitation-detail-improved-content'>{improvedContent}</div>
                  </div>
                )}
              </>
            ) : (
              <div className='visitation-detail-content-text'>{visitation.심방내용}</div>
            )}
          </div>

          <div className='visitation-detail-section'>
            <h3>심방 정보</h3>
            <div className='visitation-detail-info-grid'>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>심방 날짜</span>
                {isEditing ? (
                  <input
                    type='date'
                    className='visitation-detail-editable-input'
                    value={editForm.심방날짜}
                    onChange={e =>
                      setEditForm(prev => ({
                        ...prev,
                        심방날짜: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <span className='visitation-detail-info-value'>{visitation.심방날짜}</span>
                )}
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>심방 방법</span>
                {isEditing ? (
                  <select
                    className='visitation-detail-editable-select'
                    value={editForm.심방방법}
                    onChange={e =>
                      setEditForm(prev => ({
                        ...prev,
                        심방방법: e.target.value,
                      }))
                    }
                  >
                    <option value='만남'>만남</option>
                    <option value='통화'>통화</option>
                    <option value='카카오톡'>카카오톡</option>
                  </select>
                ) : (
                  <span className='visitation-detail-info-value'>
                    <span className={`visitation-detail-method-badge ${visitation.심방방법}`}>
                      {visitation.심방방법}
                    </span>
                  </span>
                )}
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>작성일시</span>
                <span className='visitation-detail-info-value'>{visitation.작성일시}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>최근 수정일시</span>
                <span className='visitation-detail-info-value'>
                  {lastModified ? (
                    <span className='visitation-detail-last-modified'>{lastModified}</span>
                  ) : (
                    <span className='visitation-detail-no-modification'>-</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='visitation-detail-side-content'>
          <div className='visitation-detail-section'>
            <h3>대상자 정보</h3>

            {/* 프로필 사진 영역 */}
            <div className='visitation-detail-photo-section'>
              {visitation.대상자_사진 ? (
                <img
                  src={`http://localhost:8000/uploads/${visitation.대상자_사진}`}
                  alt='프로필 사진'
                  className='visitation-detail-photo-image'
                />
              ) : (
                <div className='visitation-detail-no-photo'>프로필 사진이 없습니다</div>
              )}
            </div>

            <div className='visitation-detail-info-grid'>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>이름</span>
                <span className='visitation-detail-info-value'>{visitation.대상자_이름}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>기수</span>
                <span className='visitation-detail-info-value'>
                  {calculateGeneration(visitation.대상자_생일연도)}기
                </span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속국</span>
                <span className='visitation-detail-info-value'>{visitation.대상자_국}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속그룹</span>
                <span className='visitation-detail-info-value'>{visitation.대상자_그룹}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속순</span>
                <span className='visitation-detail-info-value'>{visitation.대상자_순장}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>생일연도</span>
                <span className='visitation-detail-info-value'>{visitation.대상자_생일연도}년</span>
              </div>
            </div>
          </div>

          <div className='visitation-detail-section'>
            <h3>진행자 정보</h3>
            <div className='visitation-detail-info-grid'>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>이름</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_이름}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>직분</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_직분}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속국</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_국}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속그룹</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_그룹}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>소속순</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_순}</span>
              </div>
              <div className='visitation-detail-info-item'>
                <span className='visitation-detail-info-label'>생일연도</span>
                <span className='visitation-detail-info-value'>{visitation.진행자_생일연도}년</span>
              </div>
            </div>
          </div>

          <div className='visitation-detail-action-buttons'>
            {isEditing ? (
              <>
                <button onClick={handleSave} className='visitation-detail-button primary'>
                  💾 저장하기
                </button>
                <button onClick={handleCancel} className='visitation-detail-button'>
                  ❌ 취소하기
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className='visitation-detail-button primary'>
                  ✏️ 수정하기
                </button>
                <button onClick={handleDelete} className='visitation-detail-button danger'>
                  🗑️ 삭제하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitationDetail;
