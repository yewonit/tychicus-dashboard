import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { membersData } from '../../data/mockData';

// 목업 심방 데이터 (실제로는 API에서 가져올 데이터)
const mockVisitations = [
  {
    id: 1,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-20',
    심방방법: '만남',
    진행자_이름: '이지은',
    심방내용: '최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다.',
  },
  {
    id: 2,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-15',
    심방방법: '통화',
    진행자_이름: '박서연',
    심방내용: '가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다.',
  },
  {
    id: 3,
    대상자_이름: '김민수',
    대상자_국: '1국',
    대상자_그룹: '김민수 그룹',
    대상자_순: '김민수 순',
    대상자_생일연도: 1995,
    심방날짜: '2024-01-10',
    심방방법: '카카오톡',
    진행자_이름: '최준호',
    심방내용: '최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다.',
  },
];

const MemberDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('department'); // 기본 이력 탭
  const [activeMainTab, setActiveMainTab] = useState('basic'); // 메인 탭 (기본이력/영적흐름)
  const fileInputRef = useRef(null);

  useEffect(() => {
    const foundMember = membersData.find(m => m.id === parseInt(id));
    setMember(foundMember);

    // 로컬 스토리지에서 사진 불러오기
    const savedPhoto = localStorage.getItem(`member_photo_${id}`);
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
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
        // 로컬 스토리지에 저장
        localStorage.setItem(`member_photo_${id}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setPhoto(null);
    localStorage.removeItem(`member_photo_${id}`);
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

  if (!member) {
    return (
      <div className='member-detail-container'>
        <div>구성원을 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 가상의 히스토리 데이터 (실제로는 API에서 가져올 데이터)
  const historyData = {
    departmentHistory: [
      {
        year: '2023',
        department: '청년부',
        group: '김민수 그룹',
        order: '김민수 순',
      },
      {
        year: '2022',
        department: '청년부',
        group: '박준호 그룹',
        order: '박준호 순',
      },
    ],
    absenceHistory: [
      {
        date: '2024-01-14',
        reason: '개인사정',
        type: '주일청년예배',
      },
      {
        date: '2024-01-10',
        reason: '병가',
        type: '수요예배',
      },
    ],
    positionHistory: [
      { year: '2023', position: '그룹장' },
      { year: '2022', position: '부그룹장' },
    ],
    newFamilyHistory: [
      {
        date: '2023-03-15',
        course: '새가족반 1기',
        status: '수료',
      },
    ],
    forumHistory: [
      {
        date: '2024-01-21',
        content: '오늘 말씀을 통해 하나님의 사랑을 더 깊이 체험했습니다.',
      },
      {
        date: '2024-01-14',
        content: '예배를 통해 영적으로 새로워지는 시간이었습니다.',
      },
    ],
    prayerHistory: [
      {
        date: '2024-01-17',
        content: '교회와 성도들을 위해 기도하겠습니다.',
      },
      {
        date: '2024-01-10',
        content: '가족의 건강과 믿음의 성장을 위해 기도합니다.',
      },
    ],
  };

  // 해당 구성원의 심방 내역 필터링
  const memberVisitations = mockVisitations.filter(
    visitation =>
      visitation.대상자_이름 === member.이름 &&
      visitation.대상자_국 === member.소속국 &&
      visitation.대상자_그룹 === member.소속그룹 &&
      visitation.대상자_순 === member.소속순 &&
      visitation.대상자_생일연도 === parseInt(member.생일연도)
  );

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
                <span className='member-detail-info-value'>1995-03-15</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>휴대폰 번호</span>
                <span className='member-detail-info-value'>010-1234-5678</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>현재 소속</span>
                <span className='member-detail-info-value'>
                  {member.소속국} / {member.소속그룹} / {member.소속순}
                </span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>현재 직분</span>
                <span className='member-detail-info-value'>{member.직분}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최초 등록일자</span>
                <span className='member-detail-info-value'>2022-01-15</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>출석 구분</span>
                <span className='member-detail-info-value'>
                  <span className='member-detail-status-badge regular'>정기출석자</span>
                </span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최근 주일청년예배 출석일자</span>
                <span className='member-detail-info-value'>{member.주일청년예배출석일자}</span>
              </div>
              <div className='member-detail-info-item'>
                <span className='member-detail-info-label'>최근 수요제자기도회 출석일자</span>
                <span className='member-detail-info-value'>{member.수요예배출석일자}</span>
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
        <div className='common-empty-state' style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
