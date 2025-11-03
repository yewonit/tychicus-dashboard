import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 30px;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-light);
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  background: var(--background-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-medium);
    transform: translateY(-2px);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const MainContent = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
`;

const SideContent = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  padding: 30px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  height: fit-content;
`;

const Section = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: "";
    width: 4px;
    height: 24px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const MethodBadge = styled.span`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  
  ${props => {
    switch(props.method) {
      case '만남':
        return 'background: rgba(151, 180, 222, 0.2); color: var(--dark-sky-blue);';
      case '통화':
        return 'background: rgba(38, 58, 153, 0.2); color: var(--royal-blue);';
      case '카카오톡':
        return 'background: rgba(220, 208, 190, 0.3); color: var(--charleston-green);';
      default:
        return 'background: rgba(240, 235, 229, 0.5); color: var(--text-secondary);';
    }
  }}
`;

const ContentText = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--background-secondary);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  white-space: pre-wrap;
  min-height: 200px;
  display: flex;
  align-items: flex-start;
`;

const PhotoImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 12px;
  box-shadow: var(--shadow-medium);
`;

const NoPhotoMessage = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  background: var(--background-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border-light);
  box-sizing: border-box;
  
  &::before {
    content: "📷";
    font-size: 1.5rem;
    display: block;
    margin-bottom: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.primary && `
    background: var(--gradient-primary);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
  `}
  
  ${props => !props.primary && `
    background: var(--background-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    
    &:hover {
      background: var(--bg-hover);
      border-color: var(--border-medium);
    }
  `}
  
  ${props => props.danger && `
    background: var(--error-color);
    color: white;
    
    &:hover {
      background: var(--error-hover);
    }
  `}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: var(--text-secondary);
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--error-color);
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  padding: 20px;
  border: 2px solid var(--accent-primary);
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--background-primary);
  font-family: inherit;
  resize: vertical;
  min-height: 200px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;

const EditableInput = styled.input`
  padding: 12px 16px;
  border: 2px solid var(--accent-primary);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--background-primary);
  color: var(--text-primary);
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;

const EditableSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid var(--accent-primary);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;


// 별표 아이콘 스타일 컴포넌트
const StarIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: scale(1.1);
  }
  
  ${props => props.favorited ? `
    color: #FFD700; // 금색 (채워진 별)
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    animation: starGlow 2s ease-in-out infinite;
    
    @keyframes starGlow {
      0%, 100% { 
        transform: scale(1);
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
      }
      50% { 
        transform: scale(1.05);
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
      }
    }
  ` : `
    color: #CCCCCC; // 회색 (빈 별)
    &:hover {
      color: #FFD700;
      text-shadow: 0 0 4px rgba(255, 215, 0, 0.4);
    }
  `}
`;

const FavoriteTooltip = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--text-primary);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

// 기수 계산 함수
const calculateGeneration = (birthYear) => {
  if (!birthYear) return '';
  const yearString = birthYear.toString();
  return yearString.slice(-2); // 뒤의 2자리 추출
};

const VisitationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitation, setVisitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    심방내용: '',
    심방날짜: '',
    심방방법: ''
  });
  const [isImproving, setIsImproving] = useState(false);
  const [improvedContent, setImprovedContent] = useState('');
  const [lastModified, setLastModified] = useState(null);
  
  // 찜하기 관련 상태 추가
  const [isFavorited, setIsFavorited] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchVisitationDetail();
    loadFavoriteStatus();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 찜하기 상태 변경 이벤트 리스너
  useEffect(() => {
    const handleFavoriteChange = (event) => {
      const { visitationId, isFavorited } = event.detail;
      if (visitationId === parseInt(id)) {
        setIsFavorited(isFavorited);
      }
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange);
    };
  }, [id]);

  // 찜하기 상태 로드 함수
  const loadFavoriteStatus = () => {
    const favoriteVisitations = JSON.parse(localStorage.getItem('favoriteVisitations') || '[]');
    setIsFavorited(favoriteVisitations.includes(parseInt(id)));
  };

  // 찜하기 토글 함수
  const toggleFavorite = () => {
    const favoriteVisitations = JSON.parse(localStorage.getItem('favoriteVisitations') || '[]');
    const visitationId = parseInt(id);
    
    let updatedFavorites;
    if (isFavorited) {
      // 찜하기 해제
      updatedFavorites = favoriteVisitations.filter(id => id !== visitationId);
      setIsFavorited(false);
    } else {
      // 찜하기 추가
      updatedFavorites = [...favoriteVisitations, visitationId];
      setIsFavorited(true);
    }
    
    localStorage.setItem('favoriteVisitations', JSON.stringify(updatedFavorites));
    
    // 커스텀 이벤트 발생 (관리 페이지에서 감지)
    window.dispatchEvent(new CustomEvent('favoriteChanged', {
      detail: { visitationId, isFavorited: !isFavorited }
    }));
    
    // 툴팁 표시
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  useEffect(() => {
    if (visitation && !isEditing) {
      setEditForm({
        심방내용: visitation.심방내용,
        심방날짜: visitation.심방날짜,
        심방방법: visitation.심방방법
      });
    }
  }, [visitation, isEditing]);

  const fetchVisitationDetail = async () => {
    try {
      setLoading(true);
      // 실제 API 호출 대신 목업 데이터 사용
      const mockVisitations = [
        {
          id: 1,
          대상자_이름: "김민수",
          대상자_국: "1국",
          대상자_그룹: "김민수 그룹",
          대상자_순: "김민수 순",
          대상자_순장: "김민수",
          대상자_생일연도: 1995,
          심방날짜: "2024-01-20",
          심방방법: "만남",
          진행자_이름: "이지은",
          진행자_직분: "부그룹장",
          진행자_국: "1국",
          진행자_그룹: "김민수 그룹",
          진행자_순: "이지은 순",
          진행자_생일연도: 1997,
          심방내용: "최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다. 다음 주일 예배 참석을 약속하셨습니다.",
          대상자_사진: null,
          작성일시: "2024-01-20 15:30"
        },
        {
          id: 2,
          대상자_이름: "박준호",
          대상자_국: "2국",
          대상자_그룹: "박준호 그룹",
          대상자_순: "박준호 순",
          대상자_순장: "박준호",
          대상자_생일연도: 1994,
          심방날짜: "2024-01-19",
          심방방법: "통화",
          진행자_이름: "정현우",
          진행자_직분: "그룹장",
          진행자_국: "3국",
          진행자_그룹: "정현우 그룹",
          진행자_순: "정현우 순",
          진행자_생일연도: 1995,
          심방내용: "가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다. 정기적인 심방을 통해 지속적인 관심을 기울이기로 했습니다.",
          대상자_사진: null,
          작성일시: "2024-01-19 20:15"
        },
        {
          id: 3,
          대상자_이름: "최수진",
          대상자_국: "2국",
          대상자_그룹: "박준호 그룹",
          대상자_순: "최수진 순",
          대상자_순장: "최수진",
          대상자_생일연도: 1996,
          심방날짜: "2024-01-18",
          심방방법: "카카오톡",
          진행자_이름: "한소영",
          진행자_직분: "부그룹장",
          진행자_국: "3국",
          진행자_그룹: "정현우 그룹",
          진행자_순: "한소영 순",
          진행자_생일연도: 1998,
          심방내용: "최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다. 시험 후 정기적인 예배 참석을 약속하셨습니다.",
          대상자_사진: null,
          작성일시: "2024-01-18 22:45"
        },
        {
          id: 4,
          대상자_이름: "정현우",
          대상자_국: "3국",
          대상자_그룹: "정현우 그룹",
          대상자_순: "정현우 순",
          대상자_순장: "정현우",
          대상자_생일연도: 1995,
          심방날짜: "2024-01-25",
          심방방법: "만남",
          진행자_이름: "김민수",
          진행자_직분: "그룹장",
          진행자_국: "1국",
          진행자_그룹: "김민수 그룹",
          진행자_순: "김민수 순",
          진행자_생일연도: 1995,
          심방내용: "최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다. 다음 주일 예배 참석을 약속하셨습니다. 특히 가족 문제로 고민이 많다고 하셔서 함께 기도하고 성경 말씀을 나누었습니다.",
          대상자_사진: "visitation_photo_20240125_143022.jpg",
          작성일시: "2024-01-25 14:30:22"
        },
        {
          id: 5,
          대상자_이름: "한소영",
          대상자_국: "3국",
          대상자_그룹: "정현우 그룹",
          대상자_순: "한소영 순",
          대상자_순장: "한소영",
          대상자_생일연도: 1998,
          심방날짜: "2024-01-24",
          심방방법: "통화",
          진행자_이름: "박준호",
          진행자_직분: "그룹장",
          진행자_국: "2국",
          진행자_그룹: "박준호 그룹",
          진행자_순: "박준호 순",
          진행자_생일연도: 1994,
          심방내용: "최근 건강 문제로 고민이 많다고 하셨습니다. 함께 기도하고 병원 검진을 권유했습니다. 정기적인 예배 참석과 기도생활을 통해 건강을 회복하시길 바랍니다.",
          대상자_사진: null,
          작성일시: "2024-01-24 16:45"
        }
      ];

      const foundVisitation = mockVisitations.find(v => v.id === parseInt(id));
      
             if (foundVisitation) {
         setVisitation(foundVisitation);
         setEditForm({
           심방내용: foundVisitation.심방내용,
           심방날짜: foundVisitation.심방날짜,
           심방방법: foundVisitation.심방방법
         });
       } else {
         setError('심방 기록을 찾을 수 없습니다.');
       }
    } catch (error) {
      console.error('심방 상세 정보를 불러오는데 실패했습니다:', error);
      setError('심방 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // 실제 API 호출 대신 목업 업데이트
      const currentTime = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const updatedVisitation = {
        ...visitation,
        ...editForm
      };
      
      setVisitation(updatedVisitation);
      setLastModified(currentTime);
      setIsEditing(false);
      
      // 성공 메시지
      alert('심방 기록이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('심방 기록 수정에 실패했습니다:', error);
      alert('심방 기록 수정에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setEditForm({
      심방내용: visitation.심방내용,
      심방날짜: visitation.심방날짜,
      심방방법: visitation.심방방법
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('이 심방 기록을 삭제하시겠습니까?')) {
      // 삭제 로직 구현
      navigate('/visitation');
    }
  };

  const handleBack = () => {
    navigate('/visitation');
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
        improved_content: editForm.심방내용 + '\n\n[개선된 내용]\n' + 
          '맞춤법과 문법을 검토하여 더 명확하고 읽기 쉬운 내용으로 개선되었습니다. ' +
          '특히 문장 구조와 표현을 자연스럽게 다듬었으며, 불필요한 반복을 줄이고 ' +
          '핵심 내용이 잘 전달되도록 수정했습니다.'
      };

      // 실제 API 호출 시 사용할 코드
      // const response = await fetch('/api/improve-content', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: editForm.심방내용 })
      // });
      // const data = await response.json();

      setImprovedContent(mockResponse.improved_content);
      alert('내용이 성공적으로 개선되었습니다!');
    } catch (error) {
      console.error('내용 개선에 실패했습니다:', error);
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
      <Container>
        <LoadingContainer>심방 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <Button onClick={handleBack}>목록으로 돌아가기</Button>
        </ErrorContainer>
      </Container>
    );
  }

  if (!visitation) {
    return (
      <Container>
        <ErrorContainer>
          <h2>심방 기록을 찾을 수 없습니다</h2>
          <Button onClick={handleBack}>목록으로 돌아가기</Button>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>{visitation.대상자_이름}님 심방 상세</Title>
          <div style={{ position: 'relative' }}>
            <StarIcon 
              favorited={isFavorited}
              onClick={toggleFavorite}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {isFavorited ? '★' : '☆'}
            </StarIcon>
            {showTooltip && (
              <FavoriteTooltip>
                {isFavorited ? '찜하기 해제' : '찜하기'}
              </FavoriteTooltip>
            )}
          </div>
        </HeaderLeft>
        
        <HeaderRight>
          <BackButton onClick={handleBack}>
            ← 목록으로 돌아가기
          </BackButton>
        </HeaderRight>
      </Header>

      <ContentGrid>
        <MainContent>
                               <Section>
            <SectionTitle>심방 내용</SectionTitle>
            {isEditing ? (
              <>
                <EditableTextarea
                  value={editForm.심방내용}
                  onChange={(e) => setEditForm(prev => ({ ...prev, 심방내용: e.target.value }))}
                  placeholder="심방 내용을 입력하세요..."
                />
                
                {/* 맞춤법 개선 버튼 */}
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Button 
                    onClick={improveContent} 
                    disabled={isImproving || !editForm.심방내용.trim()}
                    style={{ 
                      fontSize: '0.9rem', 
                      padding: '8px 16px',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                                         {isImproving ? '🔄 개선 중...' : '✨ 맞춤법 및 문체 개선'}
                  </Button>
                  
                  {improvedContent && (
                    <Button 
                      onClick={applyImprovedContent}
                      style={{ 
                        fontSize: '0.9rem', 
                        padding: '8px 16px',
                        background: 'var(--success-color, #28a745)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      💾 개선된 내용 적용
                    </Button>
                  )}
                </div>

                {/* 개선된 내용 표시 영역 */}
                {improvedContent && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    background: 'var(--background-secondary)', 
                    border: '2px solid var(--accent-primary)',
                    borderRadius: '12px',
                    borderLeft: '4px solid var(--accent-primary)'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 15px 0', 
                      color: 'var(--accent-primary)',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}>
                      ✨ 개선된 내용 미리보기
                    </h4>
                    <div style={{ 
                      whiteSpace: 'pre-wrap', 
                      lineHeight: '1.6',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}>
                      {improvedContent}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ContentText>{visitation.심방내용}</ContentText>
            )}
          </Section>

                     <Section>
             <SectionTitle>심방 정보</SectionTitle>
             <InfoGrid>
               <InfoItem>
                 <InfoLabel>심방 날짜</InfoLabel>
                 {isEditing ? (
                   <EditableInput
                     type="date"
                     value={editForm.심방날짜}
                     onChange={(e) => setEditForm(prev => ({ ...prev, 심방날짜: e.target.value }))}
                   />
                 ) : (
                   <InfoValue>{visitation.심방날짜}</InfoValue>
                 )}
               </InfoItem>
               <InfoItem>
                 <InfoLabel>심방 방법</InfoLabel>
                 {isEditing ? (
                   <EditableSelect
                     value={editForm.심방방법}
                     onChange={(e) => setEditForm(prev => ({ ...prev, 심방방법: e.target.value }))}
                   >
                     <option value="만남">만남</option>
                     <option value="통화">통화</option>
                     <option value="카카오톡">카카오톡</option>
                   </EditableSelect>
                 ) : (
                   <InfoValue>
                     <MethodBadge method={visitation.심방방법}>
                       {visitation.심방방법}
                     </MethodBadge>
                   </InfoValue>
                 )}
               </InfoItem>
                               <InfoItem>
                  <InfoLabel>작성일시</InfoLabel>
                  <InfoValue>{visitation.작성일시}</InfoValue>
                </InfoItem>
                                 <InfoItem>
                   <InfoLabel>최근 수정일시</InfoLabel>
                   <InfoValue>
                     {lastModified ? (
                       <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>
                         {lastModified}
                       </span>
                     ) : (
                       <span style={{ color: 'var(--text-secondary)' }}>
                         -
                       </span>
                     )}
                   </InfoValue>
                 </InfoItem>
             </InfoGrid>
           </Section>
        </MainContent>

        <SideContent>
                     <Section>
             <SectionTitle>대상자 정보</SectionTitle>
             
                           {/* 프로필 사진 영역 */}
              <div style={{ marginBottom: '20px' }}>
                {visitation.대상자_사진 ? (
                  <PhotoImage 
                    src={`http://localhost:8000/uploads/${visitation.대상자_사진}`} 
                    alt="프로필 사진" 
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <NoPhotoMessage>
                    프로필 사진이 없습니다
                  </NoPhotoMessage>
                )}
              </div>
             
             <InfoGrid>
               <InfoItem>
                 <InfoLabel>이름</InfoLabel>
                 <InfoValue>{visitation.대상자_이름}</InfoValue>
               </InfoItem>
               <InfoItem>
                 <InfoLabel>기수</InfoLabel>
                 <InfoValue>{calculateGeneration(visitation.대상자_생일연도)}기</InfoValue>
               </InfoItem>
               <InfoItem>
                 <InfoLabel>소속국</InfoLabel>
                 <InfoValue>{visitation.대상자_국}</InfoValue>
               </InfoItem>
               <InfoItem>
                 <InfoLabel>소속그룹</InfoLabel>
                 <InfoValue>{visitation.대상자_그룹}</InfoValue>
               </InfoItem>
               <InfoItem>
                 <InfoLabel>소속순</InfoLabel>
                 <InfoValue>{visitation.대상자_순장}</InfoValue>
               </InfoItem>
               <InfoItem>
                 <InfoLabel>생일연도</InfoLabel>
                 <InfoValue>{visitation.대상자_생일연도}년</InfoValue>
               </InfoItem>
             </InfoGrid>
           </Section>

          <Section>
            <SectionTitle>진행자 정보</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>이름</InfoLabel>
                <InfoValue>{visitation.진행자_이름}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>직분</InfoLabel>
                <InfoValue>{visitation.진행자_직분}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>소속국</InfoLabel>
                <InfoValue>{visitation.진행자_국}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>소속그룹</InfoLabel>
                <InfoValue>{visitation.진행자_그룹}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>소속순</InfoLabel>
                <InfoValue>{visitation.진행자_순}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>생일연도</InfoLabel>
                <InfoValue>{visitation.진행자_생일연도}년</InfoValue>
              </InfoItem>
            </InfoGrid>
          </Section>

                     <ActionButtons>
             {isEditing ? (
               <>
                 <Button onClick={handleSave} primary>
                   💾 저장하기
                 </Button>
                 <Button onClick={handleCancel}>
                   ❌ 취소하기
                 </Button>
               </>
             ) : (
               <>
                 <Button onClick={handleEdit} primary>
                   ✏️ 수정하기
                 </Button>
                 <Button onClick={handleDelete} danger>
                   🗑️ 삭제하기
                 </Button>
               </>
             )}
           </ActionButtons>
        </SideContent>
      </ContentGrid>
    </Container>
  );
};

export default VisitationDetail;
