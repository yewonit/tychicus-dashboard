import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetMemberDetailResponse } from '../../types/api';
import { memberService } from '../../services/memberService';

const MemberDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<GetMemberDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMemberDetail = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await memberService.getMemberDetail(parseInt(id));
        setMember(data);

        // 로컬 스토리지에서 사진 불러오기 (임시)
        const savedPhoto = localStorage.getItem(`member_photo_${id}`);
        if (savedPhoto) {
          setPhoto(savedPhoto);
        } else if (data.프로필사진) {
          setPhoto(data.프로필사진);
        }
      } catch (err) {
        // 보안: 에러 객체 전체(구성원 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
        console.error('Failed to fetch member detail:', err instanceof Error ? err.message : '알 수 없는 오류');
        setError('구성원 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [id]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setPhoto(result);
        // 로컬 스토리지에 저장 (임시)
        if (id) {
          localStorage.setItem(`member_photo_${id}`, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setPhoto(null);
    if (id) {
      localStorage.removeItem(`member_photo_${id}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePhotoEdit = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoClick = () => {
    if (photo) {
      setShowPreview(true);
    }
  };

  if (loading) {
    return (
      <div className='member-detail-container'>
        <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className='member-detail-container'>
        <div className='members-empty-state'>{error || '구성원을 찾을 수 없습니다.'}</div>
        <button
          className='member-detail-back-button'
          onClick={() => navigate('/main/member-management')}
          style={{ marginTop: '20px' }}
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className='member-detail-container'>
      <div className='member-detail-header'>
        <button className='member-detail-back-button' onClick={() => navigate('/main/member-management')}>
          ← 목록으로
        </button>
        <h1 className='member-detail-title'>{member.이름}님 상세정보</h1>
      </div>

      {/* 프로필 사진과 청년 정보를 나란히 배치 */}
      <div className='member-detail-section'>
        <h2 className='member-detail-section-title'>청년 정보</h2>
        <div className='member-detail-info-layout'>
          {/* 프로필 사진 영역 */}
          <div className='member-detail-photo-area'>
            <div className='member-detail-photo-container'>
              <div
                className={`member-detail-photo-display ${photo ? 'has-photo clickable' : 'non-clickable'}`}
                onClick={handlePhotoClick}
              >
                {photo ? (
                  <img src={photo} alt={`${member.이름}님의 프로필 사진`} className='member-detail-photo-image' />
                ) : (
                  <div className='member-detail-photo-placeholder'>👤</div>
                )}
              </div>
              <div className='member-detail-photo-controls'>
                <button className='member-detail-photo-button primary' onClick={handlePhotoEdit}>
                  {photo ? '사진 변경' : '사진 등록'}
                </button>
                {photo && (
                  <>
                    <button className='member-detail-photo-button secondary' onClick={handlePhotoClick}>
                      사진 보기
                    </button>
                    <button className='member-detail-photo-button danger' onClick={handlePhotoRemove}>
                      사진 삭제
                    </button>
                  </>
                )}
                <div className='member-detail-photo-info'>
                  • 지원 형식: JPG, PNG, GIF
                  <br />
                  • 최대 파일 크기: 5MB
                  <br />• 권장 크기: 300x300 픽셀 이상
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handlePhotoUpload}
              className='member-detail-photo-input'
            />
          </div>

          {/* 청년 정보 영역 */}
          <div className='member-detail-info-area'>
            <div className='member-detail-info-grid'>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>이름</span>
                <span className='member-detail-info-value'>{member.이름}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>생년월일</span>
                <span className='member-detail-info-value'>
                  {member.생일연도 ? `${member.생일연도}-03-15 (임시)` : '-'}
                </span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>휴대폰 번호</span>
                <span className='member-detail-info-value'>{member.휴대폰번호 || '-'}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>현재 소속</span>
                <span className='member-detail-info-value'>
                  {member.소속국} / {member.소속그룹} / {member.소속순}
                </span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>현재 직분</span>
                <span className='member-detail-info-value'>{member.직분 || '-'}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최초 등록일자</span>
                <span className='member-detail-info-value'>{member.최초등록일자 || '2022-01-15'}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>출석 구분</span>
                <span className='member-detail-info-value'>
                  <span className='member-detail-status-badge regular'>{member.출석구분 || '정기출석자'}</span>
                </span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최근 주일청년예배 출석일자</span>
                <span className='member-detail-info-value'>{member.주일청년예배출석일자 || '-'}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최근 수요제자기도회 출석일자</span>
                <span className='member-detail-info-value'>{member.수요예배출석일자 || '-'}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최근 두란노사역자모임 출석일자</span>
                <span className='member-detail-info-value'>2024-01-19</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 히스토리 섹션 - 추후 개발 예정으로 비활성화 */}
      <div className='member-detail-section'>
        <h2 className='member-detail-section-title'>히스토리</h2>
        <div
          className='common-empty-state'
          style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
          <h3>히스토리 기능 준비 중</h3>
          <p>구성원의 히스토리 및 영적 흐름 관리 기능은 추후 업데이트될 예정입니다.</p>
        </div>
      </div>

      {/* 사진 미리보기 모달 */}
      {showPreview && photo && (
        <div className='member-detail-photo-preview' onClick={() => setShowPreview(false)}>
          <img src={photo} alt='프로필 사진 미리보기' className='member-detail-photo-preview-image' />
          <button className='member-detail-photo-preview-close' onClick={() => setShowPreview(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberDetail;
