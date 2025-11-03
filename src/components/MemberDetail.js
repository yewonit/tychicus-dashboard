import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { membersData } from '../data/mockData';

// 목업 심방 데이터 (실제로는 API에서 가져올 데이터)
const mockVisitations = [
  {
    id: 1,
    대상자_이름: "김민수",
    대상자_국: "1국",
    대상자_그룹: "김민수 그룹",
    대상자_순: "김민수 순",
    대상자_생일연도: 1995,
    심방날짜: "2024-01-20",
    심방방법: "만남",
    진행자_이름: "이지은",
    심방내용: "최근 직장에서 스트레스가 많다고 하셨습니다. 기도생활이 소홀해진 것 같아 함께 기도하고 격려했습니다."
  },
  {
    id: 2,
    대상자_이름: "김민수",
    대상자_국: "1국",
    대상자_그룹: "김민수 그룹",
    대상자_순: "김민수 순",
    대상자_생일연도: 1995,
    심방날짜: "2024-01-15",
    심방방법: "통화",
    진행자_이름: "박서연",
    심방내용: "가족 문제로 고민이 많다고 하셨습니다. 함께 기도하고 성경 말씀을 나누었습니다."
  },
  {
    id: 3,
    대상자_이름: "김민수",
    대상자_국: "1국",
    대상자_그룹: "김민수 그룹",
    대상자_순: "김민수 순",
    대상자_생일연도: 1995,
    심방날짜: "2024-01-10",
    심방방법: "카카오톡",
    진행자_이름: "최준호",
    심방내용: "최근 시험 준비로 바쁘다고 하셨습니다. 기도생활을 잊지 말고 하나님께 의지하시라고 격려했습니다."
  }
];

const DetailContainer = styled.div`
  padding: 20px;
  /*margin-left: 240px;*/
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--border-color);
  }
`;

const MemberName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
`;

const Section = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: var(--shadow-light);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 30px;
  border-bottom: 2px solid var(--blue-oblivion);
  padding-bottom: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  color: var(--text-primary);
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.status === '정기출석자' ? '#10B981' :
    props.status === '단기결석자' ? '#F59E0B' :
    props.status === '장기결석자' ? '#EF4444' :
    '#6B7280'
  };
  color: white;
  display: inline-block;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 35px;
  padding: 25px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HistoryItem = styled.div`
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-card);
  margin-bottom: 15px;
  transition: all 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: var(--blue-oblivion);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &.visitation-item {
    border-left: 4px solid var(--blue-oblivion);
  }
`;

const HistoryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--blue-oblivion);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--blue-oblivion) 0%, transparent 100%);
  }
`;

const HistoryContent = styled.div`
  color: var(--text-secondary);
  line-height: 1.6;
  
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const HistoryDate = styled.span`
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
`;



const PhotoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
`;

const PhotoDisplay = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--border-color);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 3rem;
`;

const PhotoControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 200px;
`;

const PhotoButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.85rem;
  
  &.primary {
    background: var(--blue-oblivion);
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--border-color);
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoInfo = styled.div`
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 0.8rem;
  line-height: 1.4;
`;

const PhotoPreview = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PhotoPreviewImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
`;

const PhotoPreviewClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
`;



const TabNavigation = styled.div`
  display: flex;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 25px;
`;

const TabButton = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &.active {
    color: var(--blue-oblivion);
    border-bottom-color: var(--blue-oblivion);
  }
  
  &:hover {
    color: var(--text-primary);
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TimelineItem = styled.div`
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: var(--blue-oblivion);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &.visitation-item {
    border-left: 4px solid var(--blue-oblivion);
  }
  
  &.forum-item {
    border-left: 4px solid #10B981;
  }
  
  &.prayer-item {
    border-left: 4px solid #8B5CF6;
  }
`;

const TimelineDate = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 8px;
`;

const TimelineType = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
  
  &.visitation {
    background: #DBEAFE;
    color: #1E40AF;
  }
  
  &.forum {
    background: #D1FAE5;
    color: #065F46;
  }
  
  &.prayer {
    background: #EDE9FE;
    color: #5B21B6;
  }
`;

const TimelineContent = styled.div`
  color: var(--text-secondary);
  line-height: 1.6;
  
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

// 다중 필터 컴포넌트 스타일
const FilterContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--blue-oblivion);
    box-shadow: 0 0 0 2px rgba(38, 58, 153, 0.1);
  }
`;

const FilterCheckboxGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const FilterCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  
  label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    cursor: pointer;
    user-select: none;
  }
`;

// 통합 타임라인 컴포넌트 스타일
const IntegratedTimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const YearSection = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const YearHeader = styled.div`
  background: linear-gradient(135deg, var(--blue-oblivion) 0%, #1e2d7a 100%);
  color: white;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1e2d7a 0%, var(--blue-oblivion) 100%);
  }
`;

const YearContent = styled.div`
  padding: 0;
  max-height: ${props => props.isExpanded ? 'none' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const TimelineEvent = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: var(--bg-hover);
  }
`;

const EventIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  
  &.department {
    background: #DBEAFE;
    color: #1E40AF;
  }
  
  &.position {
    background: #FEF3C7;
    color: #D97706;
  }
  
  &.absence {
    background: #FEE2E2;
    color: #DC2626;
  }
  
  &.newfamily {
    background: #D1FAE5;
    color: #065F46;
  }
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventDate = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 4px;
`;

const EventDescription = styled.div`
  color: var(--text-primary);
  font-weight: 500;
`;

const EventDetails = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 4px;
`;

const EmptyTimeline = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

// 한줄 기도문 팝업 관련 스타일
const PrayerModalOverlay = styled.div`
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
`;

const PrayerModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const PrayerModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  position: relative;
`;

const PrayerModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  padding-left: 16px;
  border-left: 4px solid #764ba2;
`;

const PrayerCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: #f0f0f0;
  }
`;

const PrayerModalBody = styled.div`
  padding: 24px;
`;

const PrayerUserInfoBox = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const PrayerUserInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PrayerUserInfoLabel = styled.span`
  font-weight: 600;
  color: #333;
  min-width: 80px;
  margin-right: 16px;
`;

const PrayerUserInfoValue = styled.span`
  color: #666;
`;

const PrayerTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  color: #333;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const PrayerModalFooter = styled.div`
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
`;

const PrayerCloseModalButton = styled.button`
  background: white;
  color: #666;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
    border-color: #bbb;
  }
`;

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('department'); // 기본 이력 탭
  const [activeMainTab, setActiveMainTab] = useState('basic'); // 메인 탭 (기본이력/영적흐름)
  const fileInputRef = useRef(null);
  
  // 기본이력 필터 상태
  const [selectedYear, setSelectedYear] = useState('전체');
  const [selectedTypes, setSelectedTypes] = useState({
    department: true,
    position: true,
    absence: true,
    newfamily: true
  });
  const [expandedYears, setExpandedYears] = useState({});

  // 영적 흐름 필터 상태
  const [spiritualSelectedYear, setSpiritualSelectedYear] = useState('전체');
  const [spiritualSelectedTypes, setSpiritualSelectedTypes] = useState({
    visitation: true,
    forum: true,
    prayer: true
  });
  const [spiritualExpandedYears, setSpiritualExpandedYears] = useState({});
  
  // 한줄 기도문 팝업 상태
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

  // 가상의 히스토리 데이터 (실제로는 API에서 가져올 데이터)
  const historyData = {
    departmentHistory: [
      { year: '2023', department: '청년부', group: '김민수 그룹', order: '김민수 순' },
      { year: '2022', department: '청년부', group: '박준호 그룹', order: '박준호 순' }
    ],
    absenceHistory: [
      { date: '2024-01-14', reason: '개인사정', type: '주일청년예배' },
      { date: '2024-01-10', reason: '병가', type: '수요예배' }
    ],
    positionHistory: [
      { year: '2023', position: '그룹장' },
      { year: '2022', position: '부그룹장' }
    ],
    newFamilyHistory: [
      { date: '2023-03-15', course: '새가족반 1기', status: '수료' }
    ],
    forumHistory: [
      { date: '2024-01-21', content: '오늘 말씀을 통해 하나님의 사랑을 더 깊이 체험했습니다.', forumId: 1 },
      { date: '2024-01-14', content: '예배를 통해 영적으로 새로워지는 시간이었습니다.', forumId: 2 }
    ],
    prayerHistory: [
      { date: '2024-01-17', content: '교회와 성도들을 위해 기도하겠습니다.', prayerId: 1 },
      { date: '2024-01-10', content: '가족의 건강과 믿음의 성장을 위해 기도합니다.', prayerId: 2 }
    ]
  };

  useEffect(() => {
    const foundMember = membersData.find(m => m.id === parseInt(id));
    setMember(foundMember);
    
    // 로컬 스토리지에서 사진 불러오기
    const savedPhoto = localStorage.getItem(`member_photo_${id}`);
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, [id]);

  // 소속 변경 이벤트 리스너
  useEffect(() => {
    const handleAffiliationChange = (event) => {
      const { memberIds, newDepartment, newGroup, newTeam } = event.detail;
      
      // 현재 구성원이 변경된 구성원 목록에 있는 경우
      if (memberIds.includes(parseInt(id)) && member) {
        setMember(prevMember => ({
          ...prevMember,
          소속국: newDepartment,
          소속그룹: newGroup,
          소속순: newTeam
        }));
      }
    };

    window.addEventListener('memberAffiliationChanged', handleAffiliationChange);
    
    return () => {
      window.removeEventListener('memberAffiliationChanged', handleAffiliationChange);
    };
  }, [id, member]);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
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
      reader.onload = (e) => {
        setPhoto(e.target.result);
        // 로컬 스토리지에 저장
        localStorage.setItem(`member_photo_${id}`, e.target.result);
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

  // 기본이력 필터 핸들러
  const handleTypeFilterChange = (type) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 영적 흐름 필터 핸들러
  const handleSpiritualTypeFilterChange = (type) => {
    setSpiritualSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleYearExpansion = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  const toggleSpiritualYearExpansion = (year) => {
    setSpiritualExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  // 한줄 기도문 팝업 핸들러
  const handlePrayerClick = (prayerId) => {
    // 해당 구성원의 기도문 데이터 생성
    const prayerData = {
      id: member.id,
      name: member.이름,
      avatar: member.이름.charAt(0),
      meta: `${member.소속국} | ${member.소속그룹} | ${member.소속순}`,
      date: historyData.prayerHistory.find(p => p.prayerId === prayerId)?.date || '',
      content: historyData.prayerHistory.find(p => p.prayerId === prayerId)?.content || ''
    };
    
    setSelectedPrayer(prayerData);
    setIsPrayerModalOpen(true);
  };

  const handleClosePrayerModal = () => {
    setIsPrayerModalOpen(false);
    setSelectedPrayer(null);
  };

  // 한줄 기도문 팝업 렌더링
  const renderPrayerModal = () => {
    if (!selectedPrayer) return null;

    return (
      <PrayerModalOverlay onClick={handleClosePrayerModal}>
        <PrayerModalContent onClick={(e) => e.stopPropagation()}>
          <PrayerModalHeader>
            <PrayerModalTitle>{selectedPrayer.name}님의 한줄 기도문</PrayerModalTitle>
            <PrayerCloseButton onClick={handleClosePrayerModal}>×</PrayerCloseButton>
          </PrayerModalHeader>
          
          <PrayerModalBody>
            <PrayerUserInfoBox>
              <PrayerUserInfoRow>
                <PrayerUserInfoLabel>이름:</PrayerUserInfoLabel>
                <PrayerUserInfoValue>{selectedPrayer.name}</PrayerUserInfoValue>
              </PrayerUserInfoRow>
              <PrayerUserInfoRow>
                <PrayerUserInfoLabel>소속:</PrayerUserInfoLabel>
                <PrayerUserInfoValue>{selectedPrayer.meta}</PrayerUserInfoValue>
              </PrayerUserInfoRow>
              <PrayerUserInfoRow>
                <PrayerUserInfoLabel>작성일:</PrayerUserInfoLabel>
                <PrayerUserInfoValue>{selectedPrayer.date}</PrayerUserInfoValue>
              </PrayerUserInfoRow>
              <PrayerUserInfoRow>
                <PrayerUserInfoLabel>기도문:</PrayerUserInfoLabel>
                <PrayerTextarea 
                  value={selectedPrayer.content} 
                  readOnly
                  placeholder="기도문을 입력하세요..."
                  rows={4}
                />
              </PrayerUserInfoRow>
            </PrayerUserInfoBox>
          </PrayerModalBody>
          
          <PrayerModalFooter>
            <PrayerCloseModalButton onClick={handleClosePrayerModal}>닫기</PrayerCloseModalButton>
          </PrayerModalFooter>
        </PrayerModalContent>
      </PrayerModalOverlay>
    );
  };

  // 통합 타임라인 데이터 생성
  const generateIntegratedTimeline = () => {
    const allEvents = [];
    
    // 소속 변경 이력
    if (selectedTypes.department) {
      historyData.departmentHistory.forEach(item => {
        allEvents.push({
          id: `dept-${item.year}`,
          year: item.year,
          date: `${item.year}-01-01`,
          type: 'department',
          icon: '🏢',
          title: '소속 변경',
          description: `${item.department} - ${item.group} - ${item.order}`,
          details: ''
        });
      });
    }
    
    // 직분 이력
    if (selectedTypes.position) {
      historyData.positionHistory.forEach(item => {
        allEvents.push({
          id: `pos-${item.year}`,
          year: item.year,
          date: `${item.year}-01-01`,
          type: 'position',
          icon: '👑',
          title: '직분 변경',
          description: item.position,
          details: ''
        });
      });
    }
    
    // 결석 이력
    if (selectedTypes.absence) {
      historyData.absenceHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allEvents.push({
          id: `abs-${item.date}`,
          year: year,
          date: item.date,
          type: 'absence',
          icon: '❌',
          title: '결석',
          description: `${item.type} - ${item.reason}`,
          details: item.date
        });
      });
    }
    
    // 새가족 수료 이력
    if (selectedTypes.newfamily) {
      historyData.newFamilyHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allEvents.push({
          id: `nf-${item.date}`,
          year: year,
          date: item.date,
          type: 'newfamily',
          icon: '🎓',
          title: '수료',
          description: `${item.course} - ${item.status}`,
          details: item.date
        });
      });
    }
    
    // 연도별로 그룹화
    const eventsByYear = {};
    allEvents.forEach(event => {
      if (selectedYear === '전체' || event.year === selectedYear) {
        if (!eventsByYear[event.year]) {
          eventsByYear[event.year] = [];
        }
        eventsByYear[event.year].push(event);
      }
    });
    
    // 각 연도별로 날짜순 정렬
    Object.keys(eventsByYear).forEach(year => {
      eventsByYear[year].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    return eventsByYear;
  };

  // 기본이력 사용 가능한 연도 목록 생성
  const getAvailableYears = () => {
    const years = new Set();
    [...historyData.departmentHistory, ...historyData.positionHistory].forEach(item => {
      years.add(item.year);
    });
    [...historyData.absenceHistory, ...historyData.newFamilyHistory].forEach(item => {
      years.add(item.date.split('-')[0]);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // 영적 흐름 사용 가능한 연도 목록 생성
  const getSpiritualAvailableYears = () => {
    if (!member) return [];
    
    const years = new Set();
    [...historyData.forumHistory, ...historyData.prayerHistory].forEach(item => {
      years.add(item.date.split('-')[0]);
    });
    
    // 해당 구성원의 심방 내역 필터링
    const currentMemberVisitations = mockVisitations.filter(visitation => 
      visitation.대상자_이름 === member.이름 &&
      visitation.대상자_국 === member.소속국 &&
      visitation.대상자_그룹 === member.소속그룹 &&
      visitation.대상자_순 === member.소속순 &&
      visitation.대상자_생일연도 === parseInt(member.생일연도)
    );
    
    currentMemberVisitations.forEach(visitation => {
      years.add(visitation.심방날짜.split('-')[0]);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // 영적 흐름 연도별 그룹화 데이터 생성
  const generateSpiritualTimeline = () => {
    if (!member) return {};
    
    // 해당 구성원의 심방 내역 필터링
    const currentMemberVisitations = mockVisitations.filter(visitation => 
      visitation.대상자_이름 === member.이름 &&
      visitation.대상자_국 === member.소속국 &&
      visitation.대상자_그룹 === member.소속그룹 &&
      visitation.대상자_순 === member.소속순 &&
      visitation.대상자_생일연도 === parseInt(member.생일연도)
    );
    
    const allActivities = [];
    
    // 심방 내역
    if (spiritualSelectedTypes.visitation) {
      currentMemberVisitations.forEach(visitation => {
        const year = visitation.심방날짜.split('-')[0];
        allActivities.push({
          id: `visitation-${visitation.id}`,
          year: year,
          date: visitation.심방날짜,
          type: 'visitation',
          icon: '💙',
          title: '심방',
          description: `심방방법: ${visitation.심방방법} | 진행자: ${visitation.진행자_이름}`,
          details: visitation.심방내용,
          onClick: () => navigate(`/visitation/${visitation.id}`)
        });
      });
    }
    
    // 포럼 내역
    if (spiritualSelectedTypes.forum) {
      historyData.forumHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allActivities.push({
          id: `forum-${item.date}`,
          year: year,
          date: item.date,
          type: 'forum',
          icon: '💚',
          title: '포럼',
          description: item.content,
          details: '',
          onClick: () => navigate(`/forum/${item.forumId}`)
        });
      });
    }
    
    // 한줄 기도문 내역
    if (spiritualSelectedTypes.prayer) {
      historyData.prayerHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allActivities.push({
          id: `prayer-${item.date}`,
          year: year,
          date: item.date,
          type: 'prayer',
          icon: '💜',
          title: '기도문',
          description: item.content,
          details: '',
          onClick: () => handlePrayerClick(item.prayerId)
        });
      });
    }
    
    // 연도별로 그룹화
    const activitiesByYear = {};
    allActivities.forEach(activity => {
      if (spiritualSelectedYear === '전체' || activity.year === spiritualSelectedYear) {
        if (!activitiesByYear[activity.year]) {
          activitiesByYear[activity.year] = [];
        }
        activitiesByYear[activity.year].push(activity);
      }
    });
    
    // 각 연도별로 날짜순 정렬 (최신순)
    Object.keys(activitiesByYear).forEach(year => {
      activitiesByYear[year].sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    
    return activitiesByYear;
  };

  // 기본이력 모든 연도를 기본적으로 펼친 상태로 설정
  useEffect(() => {
    const allEvents = [];
    
    // 소속 변경 이력
    if (selectedTypes.department) {
      historyData.departmentHistory.forEach(item => {
        allEvents.push({
          year: item.year,
          date: `${item.year}-01-01`,
          type: 'department'
        });
      });
    }
    
    // 직분 이력
    if (selectedTypes.position) {
      historyData.positionHistory.forEach(item => {
        allEvents.push({
          year: item.year,
          date: `${item.year}-01-01`,
          type: 'position'
        });
      });
    }
    
    // 결석 이력
    if (selectedTypes.absence) {
      historyData.absenceHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allEvents.push({
          year: year,
          date: item.date,
          type: 'absence'
        });
      });
    }
    
    // 새가족 수료 이력
    if (selectedTypes.newfamily) {
      historyData.newFamilyHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allEvents.push({
          year: year,
          date: item.date,
          type: 'newfamily'
        });
      });
    }
    
    // 연도별로 그룹화
    const eventsByYear = {};
    allEvents.forEach(event => {
      if (selectedYear === '전체' || event.year === selectedYear) {
        if (!eventsByYear[event.year]) {
          eventsByYear[event.year] = [];
        }
        eventsByYear[event.year].push(event);
      }
    });
    
    const years = Object.keys(eventsByYear);
    const defaultExpanded = {};
    years.forEach(year => {
      defaultExpanded[year] = true;
    });
    setExpandedYears(defaultExpanded);
  }, [selectedYear, selectedTypes]);

  // 해당 구성원의 심방 내역 필터링
  const memberVisitations = mockVisitations.filter(visitation => 
    visitation.대상자_이름 === member?.이름 &&
    visitation.대상자_국 === member?.소속국 &&
    visitation.대상자_그룹 === member?.소속그룹 &&
    visitation.대상자_순 === member?.소속순 &&
    visitation.대상자_생일연도 === parseInt(member?.생일연도)
  );

  // 영적 흐름 모든 연도를 기본적으로 펼친 상태로 설정
  useEffect(() => {
    if (!member) return;
    
    // 해당 구성원의 심방 내역 필터링
    const currentMemberVisitations = mockVisitations.filter(visitation => 
      visitation.대상자_이름 === member.이름 &&
      visitation.대상자_국 === member.소속국 &&
      visitation.대상자_그룹 === member.소속그룹 &&
      visitation.대상자_순 === member.소속순 &&
      visitation.대상자_생일연도 === parseInt(member.생일연도)
    );
    
    const allActivities = [];
    
    // 심방 내역
    if (spiritualSelectedTypes.visitation) {
      currentMemberVisitations.forEach(visitation => {
        const year = visitation.심방날짜.split('-')[0];
        allActivities.push({
          year: year,
          date: visitation.심방날짜,
          type: 'visitation'
        });
      });
    }
    
    // 포럼 내역
    if (spiritualSelectedTypes.forum) {
      historyData.forumHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allActivities.push({
          year: year,
          date: item.date,
          type: 'forum'
        });
      });
    }
    
    // 한줄 기도문 내역
    if (spiritualSelectedTypes.prayer) {
      historyData.prayerHistory.forEach(item => {
        const year = item.date.split('-')[0];
        allActivities.push({
          year: year,
          date: item.date,
          type: 'prayer'
        });
      });
    }
    
    // 연도별로 그룹화
    const activitiesByYear = {};
    allActivities.forEach(activity => {
      if (spiritualSelectedYear === '전체' || activity.year === spiritualSelectedYear) {
        if (!activitiesByYear[activity.year]) {
          activitiesByYear[activity.year] = [];
        }
        activitiesByYear[activity.year].push(activity);
      }
    });
    
    const years = Object.keys(activitiesByYear);
    const defaultExpanded = {};
    years.forEach(year => {
      defaultExpanded[year] = true;
    });
    setSpiritualExpandedYears(defaultExpanded);
  }, [spiritualSelectedYear, spiritualSelectedTypes, member]);

  if (!member) {
    return (
      <DetailContainer>
        <div>구성원을 찾을 수 없습니다.</div>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <Header>
        <BackButton onClick={() => navigate('/members')}>
          ← 목록으로
        </BackButton>
        <MemberName>{member.이름}님 상세정보</MemberName>
      </Header>

      {/* 프로필 사진과 청년 정보를 나란히 배치 */}
      <Section>
        <SectionTitle>청년 정보</SectionTitle>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          {/* 프로필 사진 영역 */}
          <div style={{ flexShrink: 0 }}>
            <PhotoContainer>
              <PhotoDisplay onClick={handlePhotoClick} style={{ cursor: photo ? 'pointer' : 'default' }}>
                {photo ? (
                  <PhotoImage src={photo} alt={`${member.이름}님의 프로필 사진`} />
                ) : (
                  <PhotoPlaceholder>👤</PhotoPlaceholder>
                )}
              </PhotoDisplay>
              <PhotoControls>
                <PhotoButton className="primary" onClick={handlePhotoEdit}>
                  {photo ? '사진 변경' : '사진 등록'}
                </PhotoButton>
                {photo && (
                  <>
                    <PhotoButton className="secondary" onClick={handlePhotoClick}>
                      사진 보기
                    </PhotoButton>
                    <PhotoButton className="danger" onClick={handlePhotoRemove}>
                      사진 삭제
                    </PhotoButton>
                  </>
                )}
                <PhotoInfo>
                  • 지원 형식: JPG, PNG, GIF<br/>
                  • 최대 파일 크기: 5MB<br/>
                  • 권장 크기: 300x300 픽셀 이상
                </PhotoInfo>
              </PhotoControls>
            </PhotoContainer>
            <PhotoInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* 청년 정보 영역 */}
          <div style={{ flex: 1 }}>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>이름</InfoLabel>
                <InfoValue>{member.이름}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>생년월일</InfoLabel>
                <InfoValue>1995-03-15</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>휴대폰 번호</InfoLabel>
                <InfoValue>010-1234-5678</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>현재 소속</InfoLabel>
                <InfoValue>{member.소속국} / {member.소속그룹} / {member.소속순}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>현재 직분</InfoLabel>
                <InfoValue>{member.직분}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>최초 등록일자</InfoLabel>
                <InfoValue>2022-01-15</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>출석 구분</InfoLabel>
                <InfoValue>
                  <StatusBadge status="정기출석자">정기출석자</StatusBadge>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>최근 주일청년예배 출석일자</InfoLabel>
                <InfoValue>{member.주일청년예배출석일자}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>최근 수요제자기도회 출석일자</InfoLabel>
                <InfoValue>{member.수요예배출석일자}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>최근 두란노사역자모임 출석일자</InfoLabel>
                <InfoValue>2024-01-19</InfoValue>
              </InfoItem>
            </InfoGrid>
          </div>
        </div>
      </Section>

      {/* 히스토리 섹션 - 메인 탭 구조로 변경 */}
      <Section>
        <SectionTitle>히스토리</SectionTitle>
        
        {/* 메인 탭 네비게이션 */}
        <TabNavigation style={{ marginBottom: '25px' }}>
          <TabButton 
            className={activeMainTab === 'basic' ? 'active' : ''}
            onClick={() => setActiveMainTab('basic')}
          >
            기본이력
          </TabButton>
          <TabButton 
            className={activeMainTab === 'spiritual' ? 'active' : ''}
            onClick={() => setActiveMainTab('spiritual')}
          >
            영적 흐름
          </TabButton>
        </TabNavigation>

        {/* 메인 탭 내용 */}
        {activeMainTab === 'basic' && (
          <div>
            {/* 다중 필터 옵션 */}
            <FilterContainer>
              <FilterTitle>
                🔍 통합 필터
              </FilterTitle>
              <FilterRow>
                <FilterGroup>
                  <FilterLabel>기간</FilterLabel>
                  <FilterSelect 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="전체">전체</option>
                    {getAvailableYears().map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
                
                <FilterGroup>
                  <FilterLabel>유형</FilterLabel>
                  <FilterCheckboxGroup>
                    <FilterCheckbox onClick={() => handleTypeFilterChange('department')}>
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.department}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>🏢 소속변경</label>
                    </FilterCheckbox>
                    <FilterCheckbox onClick={() => handleTypeFilterChange('position')}>
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.position}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>👑 직분변경</label>
                    </FilterCheckbox>
                    <FilterCheckbox onClick={() => handleTypeFilterChange('absence')}>
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.absence}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>❌ 결석</label>
                    </FilterCheckbox>
                    <FilterCheckbox onClick={() => handleTypeFilterChange('newfamily')}>
                      <input 
                        type="checkbox" 
                        checked={selectedTypes.newfamily}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>🎓 수료</label>
                    </FilterCheckbox>
                  </FilterCheckboxGroup>
                </FilterGroup>
              </FilterRow>
            </FilterContainer>

            {/* 연도별 통합 타임라인 */}
            <IntegratedTimelineContainer>
              {(() => {
                const timelineData = generateIntegratedTimeline();
                const years = Object.keys(timelineData).sort((a, b) => b - a);
                
                if (years.length === 0) {
                  return (
                    <EmptyTimeline>
                      선택한 조건에 해당하는 이력이 없습니다.
                    </EmptyTimeline>
                  );
                }
                
                return years.map(year => (
                  <YearSection key={year}>
                    <YearHeader onClick={() => toggleYearExpansion(year)}>
                      <span>📅 {year}년 ({timelineData[year].length}건)</span>
                      <span>{expandedYears[year] ? '▼' : '▶'}</span>
                    </YearHeader>
                    <YearContent isExpanded={expandedYears[year]}>
                      {timelineData[year].map(event => (
                        <TimelineEvent key={event.id}>
                          <EventIcon className={event.type}>
                            {event.icon}
                          </EventIcon>
                          <EventContent>
                            <EventDate>{event.details || event.date}</EventDate>
                            <EventDescription>{event.title}</EventDescription>
                            <EventDetails>{event.description}</EventDetails>
                          </EventContent>
                        </TimelineEvent>
                      ))}
                    </YearContent>
                  </YearSection>
                ));
              })()}
            </IntegratedTimelineContainer>
          </div>
        )}

        {activeMainTab === 'spiritual' && (
          <div>
            {/* 영적 흐름 통합 필터 */}
            <FilterContainer>
              <FilterTitle>
                🔍 영적 흐름 필터
              </FilterTitle>
              <FilterRow>
                <FilterGroup>
                  <FilterLabel>기간</FilterLabel>
                  <FilterSelect 
                    value={spiritualSelectedYear} 
                    onChange={(e) => setSpiritualSelectedYear(e.target.value)}
                  >
                    <option value="전체">전체</option>
                    {getSpiritualAvailableYears().map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
                
                <FilterGroup>
                  <FilterLabel>활동 유형</FilterLabel>
                  <FilterCheckboxGroup>
                    <FilterCheckbox onClick={() => handleSpiritualTypeFilterChange('visitation')}>
                      <input 
                        type="checkbox" 
                        checked={spiritualSelectedTypes.visitation}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>💙 심방</label>
                    </FilterCheckbox>
                    <FilterCheckbox onClick={() => handleSpiritualTypeFilterChange('forum')}>
                      <input 
                        type="checkbox" 
                        checked={spiritualSelectedTypes.forum}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>💚 포럼</label>
                    </FilterCheckbox>
                    <FilterCheckbox onClick={() => handleSpiritualTypeFilterChange('prayer')}>
                      <input 
                        type="checkbox" 
                        checked={spiritualSelectedTypes.prayer}
                        onChange={() => {}} // onClick으로 처리
                      />
                      <label>💜 기도문</label>
                    </FilterCheckbox>
                  </FilterCheckboxGroup>
                </FilterGroup>
              </FilterRow>
            </FilterContainer>

            {/* 연도별 통합 타임라인 */}
            <IntegratedTimelineContainer>
              {(() => {
                const timelineData = generateSpiritualTimeline();
                const years = Object.keys(timelineData).sort((a, b) => b - a);
                
                if (years.length === 0) {
                  return (
                    <EmptyTimeline>
                      선택한 조건에 해당하는 영적 활동 내역이 없습니다.
                    </EmptyTimeline>
                  );
                }
                
                return years.map(year => (
                  <YearSection key={year}>
                    <YearHeader onClick={() => toggleSpiritualYearExpansion(year)}>
                      <span>📅 {year}년 ({timelineData[year].length}건)</span>
                      <span>{spiritualExpandedYears[year] ? '▼' : '▶'}</span>
                    </YearHeader>
                    <YearContent isExpanded={spiritualExpandedYears[year]}>
                      {timelineData[year].map(activity => (
                        <TimelineEvent key={activity.id} onClick={activity.onClick} style={{ cursor: 'pointer' }}>
                          <EventIcon className={activity.type}>
                            {activity.icon}
                          </EventIcon>
                          <EventContent>
                            <EventDate>{activity.date}</EventDate>
                            <EventDescription>{activity.title}</EventDescription>
                            <EventDetails>{activity.description}</EventDetails>
                            {activity.details && (
                              <EventDetails style={{ marginTop: '8px', fontStyle: 'italic' }}>
                                {activity.details}
                              </EventDetails>
                            )}
                          </EventContent>
                        </TimelineEvent>
                      ))}
                    </YearContent>
                  </YearSection>
                ));
              })()}
            </IntegratedTimelineContainer>
          </div>
        )}
      </Section>

      {/* 사진 미리보기 모달 */}
      {showPreview && photo && (
        <PhotoPreview onClick={() => setShowPreview(false)}>
          <PhotoPreviewImage src={photo} alt="프로필 사진 미리보기" />
          <PhotoPreviewClose onClick={() => setShowPreview(false)}>×</PhotoPreviewClose>
        </PhotoPreview>
      )}

      {/* 한줄 기도문 팝업 */}
      {isPrayerModalOpen && renderPrayerModal()}
    </DetailContainer>
  );
};

export default MemberDetail; 