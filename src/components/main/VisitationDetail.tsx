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
      // TODO: API 연동 필요 - 심방 상세 정보 가져오기
      // const response = await api.getVisitationDetail(id);
      // if (response.data) {
      //   setVisitation(response.data);
      //   setEditForm({
      //     심방내용: response.data.심방내용,
      //     심방날짜: response.data.심방날짜,
      //     심방방법: response.data.심방방법,
      //   });
      // } else {
      //   setError('심방 기록을 찾을 수 없습니다.');
      // }

      setError('심방 기록을 찾을 수 없습니다.');
    } catch (error) {
      // 보안: 에러 객체 전체(심방 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
      console.error('심방 상세 정보 조회 오류:', error instanceof Error ? error.message : '알 수 없는 오류');
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
      // TODO: API 연동 필요 - AI 내용 개선 요청
      // const response = await api.improveVisitationContent(editForm.심방내용);
      // setImprovedContent(response.improved_content);

      alert('내용 개선 기능은 현재 준비 중입니다.');
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
