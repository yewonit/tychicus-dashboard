import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { membersData } from '../data/mockData';
import { 
  visitationStatsSummary,
  departmentVisitationStats,
  departmentSummaryTable,
  roleBasedStats,
  methodStats,
  keywordAnalysis,
  goalAchievement
} from '../data/visitationStatsData';

// 키워드 추출 함수
const extractKeywords = (texts, topN = 5) => {
  if (!texts || texts.length === 0) return [];
  
  // 한국어 불용어 목록
  const stopWords = [
    '그리고', '또는', '하지만', '그런데', '그러나', '그래서', '그런', '이런', '저런',
    '있다', '없다', '하다', '되다', '있다', '없다', '그것', '이것', '저것', '무엇',
    '어떤', '어떻게', '언제', '어디서', '왜', '누가', '무엇을', '어떤', '이런',
    '저런', '그런', '아무', '몇', '얼마', '얼마나', '어느', '어떤', '어떻게',
    '가', '이', '은', '는', '을', '를', '에', '에서', '로', '으로', '와', '과',
    '의', '에게', '한테', '께', '더', '많이', '적게', '잘', '못', '안', '못',
    '말', '것', '수', '때', '곳', '일', '사람', '시간', '문제', '생각', '마음'
  ];
  
  // 텍스트를 단어로 분리하고 정규화
  const words = texts
    .flatMap(text => text.split(/[\s,.!?]+/))
    .map(word => word.replace(/[^\w가-힣]/g, '').toLowerCase())
    .filter(word => word.length > 1 && !stopWords.includes(word))
    .filter(word => /[가-힣]/.test(word)); // 한글이 포함된 단어만
  
  // 단어 빈도 계산
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // 빈도순으로 정렬하고 상위 N개 반환
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
};

// 목업 심방 데이터 추가 (실제 구성원 데이터와 연동)
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

// 목업 통계 데이터 추가
const mockStats = {
  total_visitations: 6,
  method_stats: {
    "만남": 2,
    "통화": 2,
    "카카오톡": 2
  },
  department_stats: {
    "1국": 1,
    "2국": 2,
    "3국": 2,
    "4국": 1
  },
  recent_visitations: 6,
  this_month_visitations: 6,
  this_week_visitations: 4,
  today_visitations: 1
};

const Container = styled.div`
  padding: 30px;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: var(--background-primary);
  padding: 25px;
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatDescription = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
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
`;

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
  background: var(--background-primary);
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }
`;

const VisitationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const VisitationCard = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  padding: 25px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
    border-color: var(--accent-primary);
    background: linear-gradient(135deg, var(--background-primary) 0%, rgba(38, 58, 153, 0.02) 100%);
  }
  
  &:active {
    transform: translateY(0px);
    box-shadow: var(--shadow-light);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(38, 58, 153, 0.05) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const MethodBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
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

const CardContent = styled.div`
  margin-bottom: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const InfoLabel = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

const ContentPreview = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-light);
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow: hidden;
`;

const ModalContent = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-heavy);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 0 30px;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px 30px 30px;
  overflow-y: auto;
  flex: 1;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-primary);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-medium);
    border-radius: 4px;
    
    &:hover {
      background: var(--text-secondary);
    }
  }
  
  &::-webkit-scrollbar-thumb:active {
    background: var(--text-primary);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
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

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 0.9rem;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  background: var(--background-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
`;

const TextareaContainer = styled.div`
  position: relative;
  width: 100%;
`;

const LLMButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    background: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PhotoUploadContainer = styled.div`
  margin-bottom: 20px;
`;

const PhotoUploadText = styled.div`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const PhotoUploadDescription = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
`;

const PhotoUploadInput = styled.input`
  display: none;
`;

const PhotoUploadButton = styled.button`
  padding: 12px 20px;
  background: var(--background-primary);
  border: 2px dashed var(--border-light);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
`;

const PhotoPreview = styled.div`
  margin-top: 15px;
  text-align: center;
  position: relative;
`;

const PhotoImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: var(--shadow-light);
`;

const NoImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  background: var(--background-primary);
  border: 2px dashed var(--border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0 auto;
  
  &::before {
    content: "📷";
    font-size: 2rem;
    margin-bottom: 8px;
  }
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--error-hover);
  }
`;

const AutoCompleteContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  
  & input {
    width: 100%;
    box-sizing: border-box;
  }
`;

const AutoCompleteDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--background-primary);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: var(--shadow-medium);
  z-index: 1001;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
`;

const AutoCompleteItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.2s ease;
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const AutoCompleteText = styled.span`
  font-weight: 500;
  color: var(--text-primary);
`;

const AutoCompleteSubtext = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const TargetNameContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: flex-start;
`;

const TargetPhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  flex-shrink: 0;
`;

const TargetInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const TargetPhotoPreview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px dashed var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-primary);
`;

const TargetPhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

const TargetNoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-align: center;
  
  &::before {
    content: "📷";
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
`;

const TargetPhotoButton = styled.button`
  padding: 6px 12px;
  background: var(--background-primary);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }
`;

const TargetRemovePhotoButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--error-hover);
  }
`;

const FormSection = styled.div`
  background: var(--background-primary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
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
    height: 20px;
    background: var(--gradient-primary);
    border-radius: 2px;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 15px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FullWidthGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 15px;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const TargetAffiliationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  width: 100%;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 12px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  & > div {
    min-width: 0;
    width: 100%;
    overflow: hidden;
  }
  
  & input, & select {
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }
`;

// 대상자 정보 영역을 위한 새로운 스타일 컴포넌트 추가
const TargetInfoLayout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;
  margin-bottom: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 15px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const TargetPhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  flex-shrink: 0;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    min-width: 100px;
  }
  
  @media (max-width: 768px) {
    min-width: 80px;
  }
`;

const TargetInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-width: 0;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 12px;
  }
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const TargetAffiliationSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 15px;
  border-top: 1px solid var(--border-light);
  padding-top: 15px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    margin-top: 12px;
    padding-top: 12px;
  }
  
  @media (max-width: 768px) {
    margin-top: 10px;
    padding-top: 10px;
  }
`;

// 진행자 정보 가로 배치를 위한 스타일 컴포넌트 추가
const ConductorInfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  align-items: end;
  margin-bottom: 20px;
  width: 100%;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
`;

// 표 형태 스타일 컴포넌트 추가
const TableContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-top: 20px;
  overflow-x: auto;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    margin-top: 15px;
    border-radius: 12px;
  }
  
  @media (max-width: 768px) {
    margin-top: 12px;
    border-radius: 8px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 800px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.85rem;
    min-width: 700px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    min-width: 600px;
  }
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 15px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 12px 10px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 0.8rem;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--border-light);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
  white-space: nowrap;
  text-align: center;
  
  &:last-child {
    border-right: none;
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 10px 8px;
  }
  
  @media (max-width: 768px) {
    padding: 8px 6px;
  }
`;

const TableCellBold = styled(TableCell)`
  font-weight: 600;
  color: var(--text-primary);
`;

const TableCellSecondary = styled(TableCell)`
  color: var(--text-secondary);
  font-size: 0.85rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;


// 토글 스위치 컴포넌트 추가
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 32px;
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--border-medium)'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.02);
    box-shadow: ${props => props.active 
      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(38, 58, 153, 0.1)' 
      : 'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(0, 0, 0, 0.05)'
    };
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.active ? '30px' : '2px'};
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-primary);
  
  &::before {
    content: '${props => props.active ? '표' : '카드'}';
    font-size: 0.7rem;
  }
`;

// 별표 아이콘 스타일 컴포넌트
const StarIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
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

const EmptyTableMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 1rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 30px 15px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    padding: 25px 12px;
    font-size: 0.85rem;
  }
`;

// 심방통계용 새로운 스타일 컴포넌트들
const HierarchicalTableContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-top: 20px;
`;

const DepartmentSection = styled.div`
  border-bottom: 2px solid var(--border-light);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DepartmentHeader = styled.div`
  background: linear-gradient(135deg, var(--royal-blue) 0%, var(--dark-sky-blue) 100%);
  color: white;
  padding: 15px 20px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--dark-sky-blue) 0%, var(--royal-blue) 100%);
  }
`;

const GroupSection = styled.div`
  background: rgba(151, 180, 222, 0.1);
  border-left: 4px solid var(--dark-sky-blue);
`;

const GroupHeader = styled.div`
  background: rgba(151, 180, 222, 0.2);
  padding: 12px 20px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(151, 180, 222, 0.3);
  }
`;

const MemberRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-light);
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const MemberName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
`;

const MemberRole = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const MissionCount = styled.span`
  font-weight: 700;
  color: var(--accent-primary);
  text-align: right;
`;

const ExpandIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SummaryTableContainer = styled.div`
  background: var(--background-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  margin-bottom: 30px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--royal-blue);
    box-shadow: 0 0 0 2px rgba(38, 58, 153, 0.1);
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(38, 58, 153, 0.05);
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid rgba(38, 58, 153, 0.1);
`;

const DateLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
`;

// 기수 계산 함수 추가
const calculateGeneration = (birthYear) => {
  if (!birthYear) return '';
  const yearString = birthYear.toString();
  return yearString.slice(-2); // 뒤의 2자리 추출
};



// 탭 UI 스타일 컴포넌트 추가
const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid var(--border-light);
  margin-bottom: 20px;
  padding: 0 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-secondary)'};
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: ${props => props.active ? 'var(--accent-primary)' : 'var(--text-primary)'};
    background: ${props => props.active ? 'transparent' : 'var(--bg-hover)'};
  }
  
  &:first-child {
    margin-left: 0;
  }
`;

const TabContent = styled.div`
  padding: 20px 40px 20px 0;
  min-height: 400px;
`;

const VisitationManagement = () => {
  const navigate = useNavigate();
  const [visitations, setVisitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisitation, setSelectedVisitation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [visitationToDelete, setVisitationToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  // 찜하기 관련 상태 추가
  const [favoriteVisitations, setFavoriteVisitations] = useState(new Set());
  const [favoriteFilter, setFavoriteFilter] = useState('all');
  
  // 자동완성을 위한 상태 추가
  const [members, setMembers] = useState([]);
  const [targetSearchResults, setTargetSearchResults] = useState([]);
  const [conductorSearchResults, setConductorSearchResults] = useState([]);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [showConductorDropdown, setShowConductorDropdown] = useState(false);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(-1);
  const [selectedConductorIndex, setSelectedConductorIndex] = useState(-1);

  // LLM 기능을 위한 상태 추가
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  
  // 탭 관련 상태 추가
  const [activeTab, setActiveTab] = useState('management'); // 'management' or 'statistics'
  
  // 심방통계 관련 상태 추가
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState('전체');
  const [sortBy, setSortBy] = useState('name');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchVisitations();
    fetchStats();
    loadOrganizationData();
    loadMembersData();
    loadFavoriteVisitations();
  }, []);

  // 찜하기 상태 변경 이벤트 리스너
  useEffect(() => {
    const handleFavoriteChange = (event) => {
      const { visitationId, isFavorited } = event.detail;
      setFavoriteVisitations(prev => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.add(visitationId);
        } else {
          newFavorites.delete(visitationId);
        }
        return newFavorites;
      });
    };

    window.addEventListener('favoriteChanged', handleFavoriteChange);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange);
    };
  }, []);

  // 찜하기 목록 로드
  const loadFavoriteVisitations = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteVisitations') || '[]');
    setFavoriteVisitations(new Set(favorites));
  };

  // 찜하기 토글 함수
  const toggleFavorite = (visitationId) => {
    setFavoriteVisitations(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(visitationId)) {
        newFavorites.delete(visitationId);
      } else {
        newFavorites.add(visitationId);
      }
      
      // localStorage에 저장
      localStorage.setItem('favoriteVisitations', JSON.stringify([...newFavorites]));
      
      // 커스텀 이벤트 발생 (상세 페이지에서 감지)
      window.dispatchEvent(new CustomEvent('favoriteChanged', {
        detail: { visitationId, isFavorited: newFavorites.has(visitationId) }
      }));
      
      return newFavorites;
    });
  };

  const fetchVisitations = async () => {
    try {
      // 목업 데이터 사용
      setVisitations(mockVisitations);
    } catch (error) {
      console.error('심방 데이터를 불러오는데 실패했습니다:', error);
      // 에러 시에도 목업 데이터 사용
      setVisitations(mockVisitations);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // 목업 데이터 사용
      setStats(mockStats);
    } catch (error) {
      console.error('심방 통계를 불러오는데 실패했습니다:', error);
      // 에러 시에도 목업 데이터 사용
      setStats(mockStats);
    }
  };

  // 조직 데이터 로드
  const loadOrganizationData = () => {
    // 실제 구성원 관리 데이터 사용
    const members = membersData;
    
    // 국별 데이터 추출
    const deptSet = new Set();
    const groupSet = new Set();
    const teamSet = new Set();
    
    members.forEach(member => {
      deptSet.add(member.소속국);
      groupSet.add(member.소속그룹);
      teamSet.add(member.소속순);
    });
    
    setDepartments(Array.from(deptSet).sort());
    setGroups(Array.from(groupSet).sort());
    setTeams(Array.from(teamSet).sort());
  };

  // 멤버 데이터 로드
  const loadMembersData = () => {
    // 실제 구성원 관리 데이터 사용
    setMembers(membersData);
  };

  // 대상자 검색 함수
  const searchTarget = (searchTerm) => {
    if (!searchTerm.trim()) {
      setTargetSearchResults([]);
      setShowTargetDropdown(false);
      setSelectedTargetIndex(-1);
      return;
    }

    const results = members.filter(member => 
      member.이름.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // 최대 5개 결과만 표시

    setTargetSearchResults(results);
    setShowTargetDropdown(results.length > 0);
    setSelectedTargetIndex(-1);
  };

  // 진행자 검색 함수
  const searchConductor = (searchTerm) => {
    if (!searchTerm.trim()) {
      setConductorSearchResults([]);
      setShowConductorDropdown(false);
      setSelectedConductorIndex(-1);
      return;
    }

    const results = members.filter(member => 
      member.이름.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // 최대 5개 결과만 표시

    setConductorSearchResults(results);
    setShowConductorDropdown(results.length > 0);
    setSelectedConductorIndex(-1);
  };

  // 대상자 자동완성 선택
  const selectTarget = async (member) => {
    const form = document.querySelector('form');
    if (form) {
      const targetNameInput = form.querySelector('input[name="targetName"]');
      const targetDepartmentSelect = form.querySelector('select[name="targetDepartment"]');
      const targetGroupSelect = form.querySelector('select[name="targetGroup"]');
      const targetTeamSelect = form.querySelector('select[name="targetTeam"]');
      const targetBirthYearInput = form.querySelector('input[name="targetBirthYear"]');
      
      if (targetNameInput) targetNameInput.value = member.이름;
      if (targetDepartmentSelect) targetDepartmentSelect.value = member.소속국;
      if (targetGroupSelect) targetGroupSelect.value = member.소속그룹;
      if (targetTeamSelect) targetTeamSelect.value = member.소속순;
      if (targetBirthYearInput) targetBirthYearInput.value = member.생일연도 || '';
      
      // 구성원의 프로필 사진 자동 로드
      await loadMemberProfilePhoto(member.id);
    }
    setTargetSearchResults([]);
    setShowTargetDropdown(false);
    setSelectedTargetIndex(-1);
  };

  // 구성원 프로필 사진 로드 함수
  const loadMemberProfilePhoto = async (memberId) => {
    // 먼저 localStorage에서 확인
    const memberPhoto = localStorage.getItem(`member_photo_${memberId}`);
    if (memberPhoto) {
      setPhotoPreview(memberPhoto);
      const tempFilename = `member_${memberId}_profile_${Date.now()}.jpg`;
      setUploadedPhoto(tempFilename);
      
      // 프로필 사진이 자동으로 로드되었음을 알림
      setTimeout(() => {
        alert('구성원의 프로필 사진이 자동으로 등록되었습니다.');
      }, 100);
      return;
    }

    // localStorage에 없으면 no-image 상태로 설정
    setPhotoPreview('no-image');
    const tempFilename = `member_${memberId}_no_image_${Date.now()}.jpg`;
    setUploadedPhoto(tempFilename);

    // 백그라운드에서 API 확인 (선택사항)
    try {
      const response = await fetch(`http://localhost:8000/api/members/${memberId}/profile-photo`);
      if (response.ok) {
        const data = await response.json();
        console.log('프로필 사진 정보:', data);
        // 실제 구현에서는 여기서 프로필 사진을 처리할 수 있습니다.
      }
    } catch (error) {
      console.log('프로필 사진을 가져올 수 없습니다:', error);
    }
  };

  // 진행자 자동완성 선택
  const selectConductor = (member) => {
    const form = document.querySelector('form');
    if (form) {
      const conductorNameInput = form.querySelector('input[name="conductorName"]');
      const conductorPositionInput = form.querySelector('input[name="conductorPosition"]');
      const conductorDepartmentSelect = form.querySelector('select[name="conductorDepartment"]');
      const conductorGroupSelect = form.querySelector('select[name="conductorGroup"]');
      const conductorTeamSelect = form.querySelector('select[name="conductorTeam"]');
      const conductorBirthYearInput = form.querySelector('input[name="conductorBirthYear"]');
      
      if (conductorNameInput) conductorNameInput.value = member.이름;
      if (conductorPositionInput) conductorPositionInput.value = member.직분;
      if (conductorDepartmentSelect) conductorDepartmentSelect.value = member.소속국;
      if (conductorGroupSelect) conductorGroupSelect.value = member.소속그룹;
      if (conductorTeamSelect) conductorTeamSelect.value = member.소속순;
      if (conductorBirthYearInput) conductorBirthYearInput.value = member.생일연도 || '';
    }
    setConductorSearchResults([]);
    setShowConductorDropdown(false);
    setSelectedConductorIndex(-1);
  };

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.auto-complete-container')) {
        setShowTargetDropdown(false);
        setShowConductorDropdown(false);
        setSelectedTargetIndex(-1);
        setSelectedConductorIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateVisitation = () => {
    setSelectedVisitation(null);
    setShowModal(true);
    setUploadedPhoto(null);
    setPhotoPreview(null);
    setTargetSearchResults([]);
    setConductorSearchResults([]);
    setShowTargetDropdown(false);
    setShowConductorDropdown(false);
    setSelectedTargetIndex(-1);
    setSelectedConductorIndex(-1);
  };

  const handleViewVisitation = (visitation) => {
    navigate(`/visitation/${visitation.id}`);
  };


  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('지원하는 파일 형식은 JPG, PNG, GIF입니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/visitation/upload-photo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedPhoto(result.filename);
        setPhotoPreview(URL.createObjectURL(file));
      } else {
        alert('사진 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('사진 업로드 오류:', error);
      alert('사진 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const visitationData = {
      대상자_이름: formData.get('targetName'),
      대상자_국: formData.get('targetDepartment'),
      대상자_그룹: formData.get('targetGroup'),
      대상자_순: formData.get('targetTeam'),
      대상자_생일연도: parseInt(formData.get('targetBirthYear')),
      심방날짜: formData.get('visitationDate'),
      심방방법: formData.get('visitationMethod'),
      진행자_이름: formData.get('conductorName'),
      진행자_직분: formData.get('conductorPosition'),
      진행자_국: formData.get('conductorDepartment'),
      진행자_그룹: formData.get('conductorGroup'),
      진행자_순: formData.get('conductorTeam'),
      진행자_생일연도: parseInt(formData.get('conductorBirthYear')),
      심방내용: formData.get('visitationContent'),
      대상자_사진: uploadedPhoto
    };

    try {
      const url = selectedVisitation 
        ? `http://localhost:8000/api/visitation/${selectedVisitation.id}`
        : 'http://localhost:8000/api/visitation';
      
      const method = selectedVisitation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitationData),
      });

      if (response.ok) {
        setShowModal(false);
        fetchVisitations();
        fetchStats();
      }
    } catch (error) {
      console.error('심방 기록 저장에 실패했습니다:', error);
    }
  };


  const confirmDelete = async () => {
    if (!visitationToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/visitation/${visitationToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVisitations(prev => prev.filter(v => v.id !== visitationToDelete.id));
        fetchStats();
        setShowDeleteConfirm(false);
        setVisitationToDelete(null);
      } else {
        alert('심방 기록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('심방 기록 삭제 오류:', error);
      alert('심방 기록 삭제 중 오류가 발생했습니다.');
    }
  };



  // 필터링 및 정렬 함수
  const getFilteredAndSortedVisitations = () => {
    let filtered = visitations.filter(visitation => {
      const matchesSearch = visitation.대상자_이름.includes(searchTerm);
      const matchesDepartment = filterDepartment === '전체' || visitation.대상자_국 === filterDepartment;
      const matchesGroup = filterGroup === '전체' || visitation.대상자_그룹 === filterGroup;
      const matchesTeam = filterTeam === '전체' || visitation.대상자_순 === filterTeam;
      const matchesFavorite = favoriteFilter === 'all' || favoriteVisitations.has(visitation.id);
      
      return matchesSearch && matchesDepartment && matchesGroup && matchesTeam && matchesFavorite;
    });

    // 찜한 심방만 필터링된 경우 정렬 적용
    if (favoriteFilter === 'favorited') {
      filtered = filtered.sort((a, b) => {
        // 1차: 국별 오름차순
        if (a.대상자_국 !== b.대상자_국) {
          return a.대상자_국.localeCompare(b.대상자_국);
        }
        // 2차: 그룹별 오름차순
        if (a.대상자_그룹 !== b.대상자_그룹) {
          return a.대상자_그룹.localeCompare(b.대상자_그룹);
        }
        // 3차: 순별 오름차순
        return a.대상자_순.localeCompare(b.대상자_순);
      });
    } else {
      // 일반적인 경우 최신 날짜순 정렬
      filtered = filtered.sort((a, b) => new Date(b.심방날짜) - new Date(a.심방날짜));
    }

    return filtered;
  };

  const filteredVisitations = getFilteredAndSortedVisitations();

  // 심방통계 관련 함수들
  const toggleDepartment = (departmentName) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentName)) {
        newSet.delete(departmentName);
      } else {
        newSet.add(departmentName);
      }
      return newSet;
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  // 필터링된 데이터
  const filteredStatsData = selectedDepartment === '전체' 
    ? departmentVisitationStats 
    : departmentVisitationStats.filter(dept => dept.department === selectedDepartment);

  // 직분 우선순위 정의
  const rolePriority = {
    '국장': 1,
    '부국장': 2,
    '그룹장': 3,
    '부그룹장': 4,
    '순장': 5,
    'EBS': 6
  };

  // 평면적인 데이터로 변환 및 정렬
  const flattenedData = filteredStatsData.flatMap(department => {
    const departmentData = [
      {
        국: department.department,
        그룹: '',
        이름: department.departmentHead.name,
        직분: department.departmentHead.role,
        팀사역갯수: department.departmentHead.teamMissionCount,
        rolePriority: rolePriority[department.departmentHead.role] || 999
      },
      {
        국: department.department,
        그룹: '',
        이름: department.deputyHead.name,
        직분: department.deputyHead.role,
        팀사역갯수: department.deputyHead.teamMissionCount,
        rolePriority: rolePriority[department.deputyHead.role] || 999
      }
    ];

    const groupData = department.groups.flatMap(group => {
      const groupMembers = [
        {
          국: department.department,
          그룹: group.groupName,
          이름: group.groupLeader.name,
          직분: group.groupLeader.role,
          팀사역갯수: group.groupLeader.teamMissionCount,
          rolePriority: rolePriority[group.groupLeader.role] || 999
        },
        ...group.deputyLeaders.map(deputy => ({
          국: department.department,
          그룹: group.groupName,
          이름: deputy.name,
          직분: deputy.role,
          팀사역갯수: deputy.teamMissionCount,
          rolePriority: rolePriority[deputy.role] || 999
        })),
        ...group.teamLeaders.map(leader => ({
          국: department.department,
          그룹: group.groupName,
          이름: leader.name,
          직분: leader.role,
          팀사역갯수: leader.teamMissionCount,
          rolePriority: rolePriority[leader.role] || 999
        })),
        ...group.members.map(member => ({
          국: department.department,
          그룹: group.groupName,
          이름: member.name,
          직분: member.role || '구성원',
          팀사역갯수: member.teamMissionCount,
          rolePriority: rolePriority[member.role] || 999
        }))
      ];
      return groupMembers;
    });

    return [...departmentData, ...groupData];
  });

  // 정렬된 데이터 (국 오름차순 → 그룹 오름차순 → 직분 정렬 → 이름 오름차순)
  const sortedStatsData = flattenedData.sort((a, b) => {
    // 1차: 국 오름차순
    if (a.국 !== b.국) {
      return a.국.localeCompare(b.국);
    }
    // 2차: 그룹 오름차순
    if (a.그룹 !== b.그룹) {
      return a.그룹.localeCompare(b.그룹);
    }
    // 3차: 직분 정렬
    if (a.rolePriority !== b.rolePriority) {
      return a.rolePriority - b.rolePriority;
    }
    // 4차: 이름 오름차순
    return a.이름.localeCompare(b.이름);
  });

  // 날짜 범위 필터링 함수
  const filterDataByDateRange = (data) => {
    if (!startDate && !endDate) return data;
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    return data.filter(item => {
      // 심방 데이터의 날짜 필드가 있다고 가정 (실제 데이터 구조에 맞게 수정 필요)
      const itemDate = new Date(item.date || item.createdAt || new Date());
      
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      
      return true;
    });
  };

  // 날짜 범위 조회 함수
  const handleDateRangeSearch = () => {
    // 날짜 범위가 설정되었을 때 데이터를 다시 필터링
    // 실제 구현에서는 서버에서 해당 기간의 데이터를 가져오거나
    // 클라이언트에서 필터링된 데이터를 사용
    console.log('조회 기간:', startDate, '~', endDate);
  };

  // 날짜 범위 초기화 함수
  const resetDateRange = () => {
    setStartDate('');
    setEndDate('');
  };

  // CSV 내보내기 함수
  const exportToCSV = () => {
    const csvData = [];
    
    // 조회 조건 정보 추가
    const dateRange = startDate && endDate ? `${startDate} ~ ${endDate}` : '전체 기간';
    const department = selectedDepartment === '전체' ? '전체 국' : selectedDepartment;
    
    csvData.push(['=== 심방 통계 리포트 ===']);
    csvData.push(['조회 기간', dateRange]);
    csvData.push(['조회 국', department]);
    csvData.push(['생성일시', new Date().toLocaleString('ko-KR')]);
    csvData.push([]); // 빈 행
    
    // 국별 요약 표 데이터 추가
    csvData.push(['=== 국별 요약 표 ===']);
    csvData.push(['국', ...departmentSummaryTable.map(dept => dept.department)]);
    csvData.push(['팀사역 갯수', ...departmentSummaryTable.map(dept => dept.teamMissionCount)]);
    csvData.push([]); // 빈 행
    
    // 상세 표 데이터 추가
    csvData.push(['=== 상세 표 ===']);
    csvData.push(['국', '그룹', '이름', '직분', '팀사역 갯수']);
    
    sortedStatsData.forEach(member => {
      csvData.push([
        member.국,
        member.그룹,
        member.이름,
        member.직분,
        member.팀사역갯수
      ]);
    });
    
    // 합계 행 추가
    const totalMissions = sortedStatsData.reduce((sum, member) => sum + member.팀사역갯수, 0);
    csvData.push(['합계', '', '', '', totalMissions]);
    
    // CSV 문자열 생성
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // 파일 다운로드
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `심방통계_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 탭 목록 정의
  const tabList = [
    { key: 'management', label: '심방관리' },
    { key: 'statistics', label: '심방통계' },
  ];

  // 심방관리 탭 렌더링 함수
  const renderManagementTab = () => (
    <div>
      <ActionBar>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="전체">소속국</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="전체">소속그룹</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
            <option value="전체">소속순</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </FilterSelect>
        </SearchBar>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button 
            onClick={() => setFavoriteFilter(favoriteFilter === 'favorited' ? 'all' : 'favorited')}
            style={{ 
              background: favoriteFilter === 'favorited' 
                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                : 'var(--background-primary)',
              color: favoriteFilter === 'favorited' ? 'white' : 'var(--text-primary)',
              border: favoriteFilter === 'favorited' 
                ? 'none' 
                : '1px solid var(--border-light)'
            }}
          >
            {favoriteFilter === 'favorited' ? '★ 찜한 심방' : '☆ 찜한 심방'}
          </Button>

          {favoriteFilter === 'favorited' && (
            <Button 
              onClick={exportFavoritedVisitationsToCSV}
              style={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                color: 'white'
              }}
            >
              📊 CSV 내보내기
            </Button>
          )}

          <Button primary onClick={handleCreateVisitation}>
            ✨ 새 심방 기록
          </Button>

          <ToggleContainer>
            <ToggleSwitch 
              active={viewMode === 'table'}
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            >
              <ToggleSlider active={viewMode === 'table'} />
            </ToggleSwitch>
          </ToggleContainer>
        </div>
      </ActionBar>

      {viewMode === 'table' ? (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>찜하기</TableHeaderCell>
                <TableHeaderCell>심방일자</TableHeaderCell>
                <TableHeaderCell>대상자 이름</TableHeaderCell>
                <TableHeaderCell>기수</TableHeaderCell>
                <TableHeaderCell>국</TableHeaderCell>
                <TableHeaderCell>그룹</TableHeaderCell>
                <TableHeaderCell>순</TableHeaderCell>
                <TableHeaderCell>진행자 이름</TableHeaderCell>
                <TableHeaderCell>심방방법</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredVisitations.length > 0 ? (
                filteredVisitations.map((visitation) => (
                  <TableRow key={visitation.id}>
                    <TableCell>
                      <StarIcon 
                        favorited={favoriteVisitations.has(visitation.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(visitation.id);
                        }}
                        title={favoriteVisitations.has(visitation.id) ? '찜하기 해제' : '찜하기'}
                      >
                        {favoriteVisitations.has(visitation.id) ? '★' : '☆'}
                      </StarIcon>
                    </TableCell>
                    <TableCellBold onClick={() => handleViewVisitation(visitation)} style={{ cursor: 'pointer' }}>
                      {visitation.심방날짜}
                    </TableCellBold>
                    <TableCellBold onClick={() => handleViewVisitation(visitation)} style={{ cursor: 'pointer' }}>
                      {visitation.대상자_이름}
                    </TableCellBold>
                    <TableCellSecondary>{calculateGeneration(visitation.대상자_생일연도)}</TableCellSecondary>
                    <TableCell>{visitation.대상자_국}</TableCell>
                    <TableCell>{visitation.대상자_그룹}</TableCell>
                    <TableCell>{visitation.대상자_순장}</TableCell>
                    <TableCellBold>{visitation.진행자_이름}</TableCellBold>
                    <TableCell>
                      <MethodBadge method={visitation.심방방법}>
                        {visitation.심방방법}
                      </MethodBadge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="9">
                    <EmptyTableMessage>
                      아직 등록된 심방 기록이 없습니다.
                    </EmptyTableMessage>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <VisitationGrid>
          {filteredVisitations.length > 0 ? (
            filteredVisitations
              .sort((a, b) => new Date(b.심방날짜) - new Date(a.심방날짜))
              .map((visitation) => (
              <VisitationCard 
                key={visitation.id}
                onClick={() => handleViewVisitation(visitation)}
                style={{ cursor: 'pointer' }}
              >
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <StarIcon 
                      favorited={favoriteVisitations.has(visitation.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(visitation.id);
                      }}
                      title={favoriteVisitations.has(visitation.id) ? '찜하기 해제' : '찜하기'}
                    >
                      {favoriteVisitations.has(visitation.id) ? '★' : '☆'}
                    </StarIcon>
                    <CardTitle>
                      {visitation.대상자_이름} 심방
                    </CardTitle>
                  </div>
                  <MethodBadge method={visitation.심방방법}>
                    {visitation.심방방법}
                  </MethodBadge>
                </CardHeader>
                <CardContent>
                  <InfoRow>
                    <InfoLabel>심방일자:</InfoLabel>
                    <InfoValue>{visitation.심방날짜}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>대상자:</InfoLabel>
                    <InfoValue>{visitation.대상자_이름} ({calculateGeneration(visitation.대상자_생일연도)}기)</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>소속:</InfoLabel>
                    <InfoValue>{visitation.대상자_국} {visitation.대상자_그룹} {visitation.대상자_순장}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>진행자:</InfoLabel>
                    <InfoValue>{visitation.진행자_이름} ({visitation.진행자_직분})</InfoValue>
                  </InfoRow>
                  <ContentPreview>{visitation.심방내용}</ContentPreview>
                </CardContent>
                <CardFooter>
                  <span>작성일시: {visitation.작성일시}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: 'var(--accent-primary)', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    상세보기 →
                  </span>
                </CardFooter>
              </VisitationCard>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--text-secondary)'
            }}>
              아직 등록된 심방 기록이 없습니다.
            </div>
          )}
        </VisitationGrid>
      )}
    </div>
  );

  // 심방통계 탭 렌더링 함수
  const renderStatisticsTab = () => (
    <div>
      {/* 국별 요약 표 */}
      <SummaryTableContainer>
        <Table>
          <TableHeader>
            <tr>
              {departmentSummaryTable.map(dept => (
                <TableHeaderCell key={dept.department}>{dept.department}</TableHeaderCell>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            <TableRow>
              {departmentSummaryTable.map(dept => (
                <TableCellBold key={dept.department}>{dept.teamMissionCount}</TableCellBold>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </SummaryTableContainer>

      {/* 필터 컨트롤 */}
      <FilterControls>
        {/* 날짜 범위 선택 */}
        <DateRangeContainer>
          <DateLabel>조회 기간:</DateLabel>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="시작일"
          />
          <DateLabel>~</DateLabel>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="종료일"
          />
          <button 
            onClick={handleDateRangeSearch}
            style={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔍 조회
          </button>
          <button 
            onClick={resetDateRange}
            style={{
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🔄 초기화
          </button>
        </DateRangeContainer>

        {/* 국 선택 */}
        <FilterSelect 
          value={selectedDepartment} 
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="전체">전체 국</option>
          <option value="1국">1국</option>
          <option value="2국">2국</option>
          <option value="3국">3국</option>
          <option value="4국">4국</option>
          <option value="5국">5국</option>
        </FilterSelect>
        
        {/* CSV 내보내기 */}
        <button 
          onClick={exportToCSV}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          📊 CSV 내보내기
        </button>
      </FilterControls>

      {/* 상세 표 */}
      <SummaryTableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>국</TableHeaderCell>
              <TableHeaderCell>그룹</TableHeaderCell>
              <TableHeaderCell>이름</TableHeaderCell>
              <TableHeaderCell>직분</TableHeaderCell>
              <TableHeaderCell>팀사역 갯수</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {sortedStatsData.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.국}</TableCell>
                <TableCell>{member.그룹}</TableCell>
                <TableCellBold>{member.이름}</TableCellBold>
                <TableCell>{member.직분}</TableCell>
                <TableCellBold>{member.팀사역갯수}</TableCellBold>
              </TableRow>
            ))}
            {/* 합계 행 */}
            <TableRow style={{ 
              backgroundColor: 'rgba(38, 58, 153, 0.1)', 
              borderTop: '2px solid var(--royal-blue)',
              fontWeight: 'bold'
            }}>
              <TableCellBold style={{ textAlign: 'center' }}>합계</TableCellBold>
              <TableCellBold></TableCellBold>
              <TableCellBold></TableCellBold>
              <TableCellBold></TableCellBold>
              <TableCellBold style={{ 
                color: 'var(--royal-blue)', 
                textAlign: 'center'
              }}>
                {sortedStatsData.reduce((sum, member) => sum + member.팀사역갯수, 0)}
              </TableCellBold>
            </TableRow>
          </TableBody>
        </Table>
      </SummaryTableContainer>

      {/* 요약 통계 카드 */}
      <StatsGrid style={{ marginTop: '30px' }}>
        <StatCard>
          <StatTitle>총 팀사역 수</StatTitle>
          <StatValue>{visitationStatsSummary.totalTeamMissions}</StatValue>
          <StatDescription>전체 팀사역 합계</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>평균 팀사역</StatTitle>
          <StatValue>{visitationStatsSummary.averagePerDepartment}</StatValue>
          <StatDescription>국별 평균 팀사역</StatDescription>
        </StatCard>
        <StatCard>
          <StatTitle>최고 팀사역</StatTitle>
          <StatValue>{visitationStatsSummary.highestDepartment.count}</StatValue>
          <StatDescription>{visitationStatsSummary.highestDepartment.name} 팀사역</StatDescription>
        </StatCard>
      </StatsGrid>

      {/* 추가 통계 섹션 */}
      <StatsGrid style={{ marginTop: '30px' }}>
        <StatCard>
          <StatTitle>심방 방법별 통계</StatTitle>
          <StatValue>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              {Object.entries(methodStats).map(([method, data]) => (
                <div key={method} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{method}</span>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {data.count}건 ({data.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </StatValue>
          <StatDescription>심방 방법별 현황</StatDescription>
        </StatCard>
        
        <StatCard>
          <StatTitle>직분별 팀사역 통계</StatTitle>
          <StatValue>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
              {Object.entries(roleBasedStats).map(([role, data]) => (
                <div key={role} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{role}</span>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {data.totalMissions}건
                  </span>
                </div>
              ))}
            </div>
          </StatValue>
          <StatDescription>직분별 팀사역 현황</StatDescription>
        </StatCard>
        
        <StatCard>
          <StatTitle>이번 달 주요 키워드</StatTitle>
          <StatValue>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              {keywordAnalysis.thisMonth.slice(0, 3).map((kw, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                  <span style={{ fontWeight: 'bold' }}>{kw.keyword}</span>
                      <span style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '0.6rem',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        {kw.count}
                      </span>
                    </div>
              ))}
            </div>
          </StatValue>
          <StatDescription>이번 달 심방 내용에서 자주 언급된 키워드</StatDescription>
        </StatCard>
      </StatsGrid>
    </div>
  );

  // LLM 기능 구현 (목업)
  const handleLLMImprovement = async () => {
    const textarea = document.querySelector('textarea[name="visitationContent"]');
    if (!textarea || !textarea.value.trim()) {
      alert('심방 내용을 먼저 입력해주세요.');
      return;
    }

    setIsLLMLoading(true);

    try {
      // 목업: 2초 후에 개선된 텍스트 반환
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const originalText = textarea.value;
      const improvedText = improveTextWithLLM(originalText);
      
      textarea.value = improvedText;
      
      // 성공 메시지
              alert('맞춤법 및 문체 개선이 완료되었습니다!');
      
    } catch (error) {
      console.error('텍스트 개선 중 오류가 발생했습니다:', error);
      alert('텍스트 개선 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLLMLoading(false);
    }
  };

  // 목업 LLM 텍스트 개선 함수
  const improveTextWithLLM = (text) => {
    // 간단한 목업 개선 로직
    let improved = text;
    
    // 맞춤법 수정 (간단한 예시)
    improved = improved.replace(/되요/g, '돼요');
    improved = improved.replace(/안되요/g, '안돼요');
    improved = improved.replace(/해요/g, '해요');
    improved = improved.replace(/이에요/g, '이에요');
    
    // 문체 개선 (객관적 + 간결한 + 설명형 + 부드러운 문체)
    improved = improved.replace(/~라고 하셨습니다/g, '~라고 하셨습니다');
    improved = improved.replace(/~것 같아/g, '~것 같습니다');
    improved = improved.replace(/~했어요/g, '~했습니다');
    improved = improved.replace(/~해요/g, '~합니다');
    
    // 문장 끝 개선
    improved = improved.replace(/\.$/g, '');
    improved = improved.replace(/!$/g, '');
    improved = improved.replace(/\?$/g, '');
    improved = improved + '.';
    
    // 추가적인 문체 개선
    improved = improved.replace(/정말/g, '매우');
    improved = improved.replace(/너무/g, '매우');
    improved = improved.replace(/아주/g, '매우');
    
    return improved;
  };

  // CSV 내보내기 함수
  const exportFavoritedVisitationsToCSV = () => {
    if (favoriteFilter !== 'favorited') {
      alert('찜한 심방만 필터링된 상태에서만 내보내기가 가능합니다.');
      return;
    }

    const favoritedVisitations = getFilteredAndSortedVisitations();
    
    if (favoritedVisitations.length === 0) {
      alert('내보낼 찜한 심방이 없습니다.');
      return;
    }

    try {
      // CSV 헤더
      const headers = [
        '심방일자',
        '대상자이름',
        '기수',
        '소속국',
        '소속그룹',
        '소속순',
        '진행자이름',
        '진행자직분',
        '심방방법',
        '심방내용',
        '작성일시'
      ];

      // CSV 데이터 생성
      const csvData = favoritedVisitations.map(visitation => [
        visitation.심방날짜,
        visitation.대상자_이름,
        calculateGeneration(visitation.대상자_생일연도),
        visitation.대상자_국,
        visitation.대상자_그룹,
        visitation.대상자_순장,
        visitation.진행자_이름,
        visitation.진행자_직분,
        visitation.심방방법,
        `"${visitation.심방내용.replace(/"/g, '""')}"`, // 따옴표 이스케이프
        visitation.작성일시
      ]);

      // CSV 문자열 생성
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      // BOM 추가 (한글 깨짐 방지)
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // 파일 다운로드
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `찜한심방내역_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`${favoritedVisitations.length}건의 찜한 심방이 CSV 파일로 내보내졌습니다.`);
      
    } catch (error) {
      console.error('CSV 내보내기 오류:', error);
      alert('CSV 내보내기 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <Container>
        <div>로딩 중...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>심방 관리</Title>
        <Subtitle>청년들의 심방 활동을 관리하고 기록하세요</Subtitle>
      </Header>

      <TabContainer>
        {tabList.map(tab => (
          <Tab
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabContainer>
      
      <TabContent>
        {activeTab === 'management' && renderManagementTab()}
        {activeTab === 'statistics' && renderStatisticsTab()}
      </TabContent>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <Modal onClick={() => setShowDeleteConfirm(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <ModalHeader>
              <ModalTitle>심방 기록 삭제</ModalTitle>
              <CloseButton onClick={() => setShowDeleteConfirm(false)}>×</CloseButton>
            </ModalHeader>
            <div style={{ padding: '20px 30px 30px 30px' }}>
              <p style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>
                <strong>{visitationToDelete?.대상자_이름}</strong>님의 심방 기록을 삭제하시겠습니까?
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                이 작업은 되돌릴 수 없습니다.
              </p>
              <ButtonGroup>
                <Button onClick={() => setShowDeleteConfirm(false)}>
                  취소
                </Button>
                <Button 
                  onClick={confirmDelete}
                  style={{ 
                    background: 'var(--error-color)',
                    color: 'white'
                  }}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </div>
          </ModalContent>
        </Modal>
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {selectedVisitation ? '심방 기록 수정' : '새 심방 기록'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>심방 작성</SectionTitle>
                <FullWidthGrid>
                  <FormGroup>
                    <FormLabel>심방 내용 *</FormLabel>
                    <TextareaContainer>
                      <Textarea
                        name="visitationContent"
                        defaultValue={selectedVisitation?.심방내용}
                        placeholder="심방 내용을 상세히 작성해주세요..."
                        required
                      />
                    </TextareaContainer>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <LLMButton
                        type="button"
                        onClick={handleLLMImprovement}
                        disabled={isLLMLoading}
                      >
                        {isLLMLoading ? (
                          <>
                            <LoadingSpinner />
                            처리 중...
                          </>
                        ) : (
                          '맞춤법 및 문체 개선'
                        )}
                      </LLMButton>
                    </div>
                  </FormGroup>
                </FullWidthGrid>
              </FormSection>
              
              <FormSection>
                <SectionTitle>대상자 정보</SectionTitle>
                <TargetInfoLayout>
                  <TargetPhotoSection>
                    <TargetPhotoPreview>
                      {photoPreview ? (
                        photoPreview === 'no-image' ? (
                          <TargetNoImagePlaceholder>
                            프로필 사진이 없습니다.
                          </TargetNoImagePlaceholder>
                        ) : (
                          <TargetPhotoImage src={photoPreview} alt="프로필 사진" />
                        )
                      ) : (
                        <TargetNoImagePlaceholder>
                          사진 없음
                        </TargetNoImagePlaceholder>
                      )}
                      {photoPreview && (
                        <TargetRemovePhotoButton
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setUploadedPhoto(null);
                          }}
                        >
                          ×
                        </TargetRemovePhotoButton>
                      )}
                    </TargetPhotoPreview>
                    <PhotoUploadInput
                      type="file"
                      id="targetPhotoUpload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <TargetPhotoButton
                      type="button"
                      onClick={() => document.getElementById('targetPhotoUpload').click()}
                    >
                      {photoPreview ? '사진 변경' : '사진 업로드'}
                    </TargetPhotoButton>
                  </TargetPhotoSection>
                  
                  <TargetInfoSection>
                    <FormGroup>
                      <FormLabel>대상자 이름 *</FormLabel>
                      <AutoCompleteContainer className="auto-complete-container">
                        <Input
                          name="targetName"
                          defaultValue={selectedVisitation?.대상자_이름}
                          required
                          onChange={(e) => searchTarget(e.target.value)}
                          onFocus={() => setShowTargetDropdown(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setSelectedTargetIndex(prev => 
                                prev < targetSearchResults.length - 1 ? prev + 1 : prev
                              );
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setSelectedTargetIndex(prev => prev > 0 ? prev - 1 : -1);
                            } else if (e.key === 'Enter') {
                              e.preventDefault();
                              if (selectedTargetIndex >= 0 && targetSearchResults[selectedTargetIndex]) {
                                selectTarget(targetSearchResults[selectedTargetIndex]);
                              }
                            } else if (e.key === 'Escape') {
                              setShowTargetDropdown(false);
                              setSelectedTargetIndex(-1);
                            }
                          }}
                        />
                        {showTargetDropdown && targetSearchResults.length > 0 && (
                          <AutoCompleteDropdown>
                            {targetSearchResults.map((member, index) => (
                              <AutoCompleteItem
                                key={member.id}
                                onClick={() => selectTarget(member)}
                                style={{
                                  background: index === selectedTargetIndex ? 'var(--bg-hover)' : 'transparent'
                                }}
                              >
                                <AutoCompleteText>{member.이름}</AutoCompleteText>
                                <AutoCompleteSubtext>
                                  ({member.소속국} {member.소속그룹} {member.소속순})
                                </AutoCompleteSubtext>
                              </AutoCompleteItem>
                            ))}
                          </AutoCompleteDropdown>
                        )}
                        {showTargetDropdown && targetSearchResults.length === 0 && (
                          <AutoCompleteDropdown>
                            <AutoCompleteItem style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                              검색 결과 없음
                            </AutoCompleteItem>
                          </AutoCompleteDropdown>
                        )}
                      </AutoCompleteContainer>
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>대상자 생일연도 *</FormLabel>
                      <Input
                        name="targetBirthYear"
                        type="number"
                        defaultValue={selectedVisitation?.대상자_생일연도}
                        required
                      />
                    </FormGroup>
                  </TargetInfoSection>
                </TargetInfoLayout>
                
                <TargetAffiliationSection>
                  <TargetAffiliationContainer>
                    <FormGroup>
                      <FormLabel>소속국 *</FormLabel>
                      <Select name="targetDepartment" defaultValue={selectedVisitation?.대상자_국} required>
                        <option value="">선택하세요</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>소속그룹 *</FormLabel>
                      <Select name="targetGroup" defaultValue={selectedVisitation?.대상자_그룹} required>
                        <option value="">선택하세요</option>
                        {groups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>소속순 *</FormLabel>
                      <Select name="targetTeam" defaultValue={selectedVisitation?.대상자_순} required>
                        <option value="">선택하세요</option>
                        {teams.map(team => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </Select>
                    </FormGroup>
                  </TargetAffiliationContainer>
                </TargetAffiliationSection>
              </FormSection>
              
              <FormSection>
                <SectionTitle>심방 정보</SectionTitle>
                <SectionGrid>
                  <FormGroup>
                    <FormLabel>심방 날짜 *</FormLabel>
                    <Input
                      name="visitationDate"
                      type="date"
                      defaultValue={selectedVisitation?.심방날짜}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>심방 방법 *</FormLabel>
                    <Select name="visitationMethod" defaultValue={selectedVisitation?.심방방법} required>
                      <option value="">선택하세요</option>
                      <option value="만남">만남</option>
                      <option value="통화">통화</option>
                      <option value="카카오톡">카카오톡</option>
                    </Select>
                  </FormGroup>
                </SectionGrid>
              </FormSection>
              
              <FormSection>
                <SectionTitle>진행자 정보</SectionTitle>
                <ConductorInfoRow>
                  <FormGroup>
                    <FormLabel>진행자 이름 *</FormLabel>
                    <AutoCompleteContainer className="auto-complete-container">
                      <Input
                        name="conductorName"
                        defaultValue={selectedVisitation?.진행자_이름}
                        required
                        onChange={(e) => searchConductor(e.target.value)}
                        onFocus={() => setShowConductorDropdown(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setSelectedConductorIndex(prev => 
                              prev < conductorSearchResults.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setSelectedConductorIndex(prev => prev > 0 ? prev - 1 : -1);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            if (selectedConductorIndex >= 0 && conductorSearchResults[selectedConductorIndex]) {
                              selectConductor(conductorSearchResults[selectedConductorIndex]);
                            }
                          } else if (e.key === 'Escape') {
                            setShowConductorDropdown(false);
                            setSelectedConductorIndex(-1);
                          }
                        }}
                      />
                      {showConductorDropdown && conductorSearchResults.length > 0 && (
                        <AutoCompleteDropdown>
                          {conductorSearchResults.map((member, index) => (
                            <AutoCompleteItem
                              key={member.id}
                              onClick={() => selectConductor(member)}
                              style={{
                                background: index === selectedConductorIndex ? 'var(--bg-hover)' : 'transparent'
                              }}
                            >
                              <AutoCompleteText>{member.이름}</AutoCompleteText>
                              <AutoCompleteSubtext>
                                ({member.소속국} {member.소속그룹} {member.소속순})
                              </AutoCompleteSubtext>
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteDropdown>
                      )}
                      {showConductorDropdown && conductorSearchResults.length === 0 && (
                        <AutoCompleteDropdown>
                          <AutoCompleteItem style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            검색 결과 없음
                          </AutoCompleteItem>
                        </AutoCompleteDropdown>
                      )}
                    </AutoCompleteContainer>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>진행자 직분 *</FormLabel>
                    <Input
                      name="conductorPosition"
                      defaultValue={selectedVisitation?.진행자_직분}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>진행자 생일연도 *</FormLabel>
                    <Input
                      name="conductorBirthYear"
                      type="number"
                      defaultValue={selectedVisitation?.진행자_생일연도}
                      required
                    />
                  </FormGroup>
                </ConductorInfoRow>
                
                <TargetAffiliationContainer>
                  <FormGroup>
                    <FormLabel>소속국 *</FormLabel>
                    <Select name="conductorDepartment" defaultValue={selectedVisitation?.진행자_국} required>
                      <option value="">선택하세요</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>소속그룹 *</FormLabel>
                    <Select name="conductorGroup" defaultValue={selectedVisitation?.진행자_그룹} required>
                      <option value="">선택하세요</option>
                      {groups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>소속순 *</FormLabel>
                    <Select name="conductorTeam" defaultValue={selectedVisitation?.진행자_순} required>
                      <option value="">선택하세요</option>
                      {teams.map(team => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </TargetAffiliationContainer>
              </FormSection>
              
              <ButtonGroup>
                <Button type="button" onClick={() => setShowModal(false)}>
                  취소
                </Button>
                <Button type="submit" primary>
                  {selectedVisitation ? '수정하기' : '저장하기'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default VisitationManagement; 