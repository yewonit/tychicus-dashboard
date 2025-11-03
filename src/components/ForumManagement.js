import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { membersData } from '../data/mockData';
import {
  PageContainer,
  AdminHeader,
  HeaderTop,
  HeaderLeft,
  HeaderRight,
  HeaderBreadcrumb,
  CardContainer,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  SmallButton,
  FormInput,
  FormSelect,
  DateRangeContainer,
  DateInputGroup,
  DateLabel,
  DateInput,
  DateSeparator,
  QuickDateButtons,
  OutlineButton,
  TableContainer,
  TableHeader,
  TableTitle,
  TableCount,
  TableActions,
  TableWrapper,
  DataTable,
  TableHead,
  TableBody,
  TableFooter,
  TableInfo,
  TablePagination,
  PageButton,
  PageSizeSelect,
  StatusBadge,
  CategoryBadge,
  Checkbox,
  TabContainer,
  TabButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  UserInfoBox,
  UserInfoRow,
  UserInfoLabel,
  UserInfoValue,
  ContentSection,
  SectionTitle,
  SectionContent,
  FormTextarea,
  IconButton,
  EditIconButton,
  DeleteIconButton,
  ResponsivePageContainer,
  ResponsiveAdminHeader,
  ResponsiveDateRangeContainer,
  ResponsiveTableContainer,
  ResponsiveDataTable,
  ResponsiveTabContainer,
  SuccessButton,
  media
} from './common/CommonStyles';

// 심방관리 스타일의 헤더 컴포넌트 추가
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

// 심방관리 스타일의 탭 컴포넌트 추가
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

// 추가 스타일 컴포넌트들
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const UserMeta = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const DateText = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const MessagePreview = styled.div`
  color: #333;
  line-height: 1.5;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 공통 가이드에 맞는 버튼 크기 스타일 추가
const GuideSizeButton = styled(PrimaryButton)`
  padding: 8px 16px;
  font-size: 0.9rem;
`;

const GuideSizeOutlineButton = styled(OutlineButton)`
  padding: 8px 16px;
  font-size: 0.9rem;
`;

const GuideSizeSuccessButton = styled(SuccessButton)`
  padding: 8px 16px;
  font-size: 0.9rem;
`;

const tabList = [
  { key: 'forum', label: '포럼' },
  { key: 'prayer', label: '한줄 기도문' },
];

// 포럼 데이터 - mockData.js의 membersData를 기반으로 생성
const forumData = membersData.map((member, index) => ({
  id: member.id,
  name: member.이름,
  avatar: member.이름.charAt(0),
  meta: `${member.소속국} | ${member.소속그룹} | ${member.소속순}`,
  date: `2024-08-${String(7 + (index % 3)).padStart(2, '0')}`,
  message: [
    '오늘 설교 말씀을 통해 하나님의 사랑을 더 깊이 느낄 수 있었습니다. 감사합니다.',
    '진로에 대한 고민이 많았는데 말씀을 통해 하나님의 뜻을 알 수 있었습니다.',
    '이번 주 성경공부가 너무 좋았습니다. 하나님의 말씀이 마음에 깊이 새겨졌어요.',
    '가족을 위한 기도가 필요했는데 말씀을 통해 위로를 받았습니다.',
    '오늘 예배를 통해 하나님의 임재를 느꼈습니다. 평안한 마음이 들었어요.',
    '이번 주 봉사활동이 정말 의미있었습니다. 하나님의 사랑을 나눌 수 있어서 기뻤어요.',
    '개인적인 문제로 고민이 많았는데 말씀을 통해 해답을 찾았습니다.',
    '이번 주 말씀을 통해 새로운 깨달음을 얻었습니다. 감사합니다.',
    '가족의 건강을 위해 기도했는데 하나님의 은혜를 느꼈습니다.',
    '직장에서의 어려움을 하나님께 맡기고 싶었는데 말씀이 큰 도움이 되었습니다.'
  ][index % 10]
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// 한줄 기도문 관련 추가 스타일
const PrayerContent = styled.div`
  color: #333;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const PrayerDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;


// 한줄 기도문 모달 관련 추가 스타일
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

const PrayerContentSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PrayerSectionTitle = styled.h3`
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const PrayerSectionContent = styled.p`
  color: #333;
  line-height: 1.6;
  margin: 0;
  padding-left: 16px;
  border-left: 2px solid #764ba2;
  font-size: 1rem;
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

// 한줄 기도문 데이터 - mockData.js의 membersData를 기반으로 생성
const PrayerData = membersData.map((member, index) => ({
  id: member.id,
  name: member.이름,
  avatar: member.이름.charAt(0),
  meta: `${member.소속국} | ${member.소속그룹} | ${member.소속순}`,
  date: `2024-08-${String(7 + (index % 2)).padStart(2, '0')}`,
  content: [
    '하나님, 오늘 하루도 주께 맡기고 싶습니다. 주님의 뜻을 따라 살아가겠습니다.',
    '하나님, 가족의 건강과 평안을 위해 기도합니다.',
    '하나님, 직장에서의 지혜를 구합니다.',
    '하나님, 친구들에게 복음을 전할 수 있도록 도와주세요.',
    '하나님, 교회를 위해 봉사할 수 있는 마음을 주세요.',
    '하나님, 매일 말씀을 통해 성장할 수 있도록 도와주세요.',
    '하나님, 어려운 상황에서도 믿음을 잃지 않도록 도와주세요.',
    '하나님, 이웃을 사랑할 수 있는 마음을 주세요.',
    '하나님, 감사한 마음으로 하루를 시작할 수 있도록 도와주세요.',
    '하나님, 하나님의 영광을 위해 살아갈 수 있도록 도와주세요.'
  ][index % 10]
}));

const ForumManagement = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forum');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);

  useEffect(() => {
    const tab = query.get('tab');
    if (tab && tabList.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [query]);

  const handleSearch = () => {
    console.log('검색:', searchTerm, selectedPeriod);
  };

  const handleViewDetails = (id, type = 'forum') => {
    if (type === 'prayer') {
      // 한줄 기도문은 여전히 모달로 처리
      const prayer = PrayerData.find(p => p.id === id);
      setSelectedPrayer(prayer);
      setIsPrayerModalOpen(true);
    } else {
      // 포럼은 페이지로 이동
      navigate(`/forum/${id}`);
    }
  };

  const handleClosePrayerModal = () => {
    setIsPrayerModalOpen(false);
    setSelectedPrayer(null);
  };


  const handleDelete = (id) => {
    console.log('삭제:', id);
    // 삭제 로직 구현
  };

  const handleExportPrayerCSV = () => {
    // CSV 헤더
    const headers = ['이름', '소속', '기도문', '등록일'];
    
    // CSV 데이터 생성
    const csvData = PrayerData.map(prayer => [
      prayer.name,
      prayer.meta,
      prayer.content,
      prayer.date
    ]);
    
    // CSV 문자열 생성
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    // BOM 추가 (한글 깨짐 방지)
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    // 파일 다운로드
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `한줄기도문_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderForumTab = () => (
    <div>
      <ResponsiveDateRangeContainer>
        <DateInputGroup>
          <DateLabel>시작일</DateLabel>
          <DateInput type="date" />
        </DateInputGroup>
        <DateSeparator>~</DateSeparator>
        <DateInputGroup>
          <DateLabel>종료일</DateLabel>
          <DateInput type="date" />
        </DateInputGroup>
        <GuideSizeButton>조회</GuideSizeButton>
        <QuickDateButtons>
          <GuideSizeOutlineButton>오늘</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>이번 주</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>이번 달</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>지난 3개월</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>올해</GuideSizeOutlineButton>
        </QuickDateButtons>
      </ResponsiveDateRangeContainer>

      <ResponsiveTableContainer>
        <TableHeader>
          <TableTitle>
            <h4>포럼 목록</h4>
            <TableCount>총 {forumData.length}개</TableCount>
          </TableTitle>
        </TableHeader>
        
        <TableWrapper>
          <ResponsiveDataTable>
            <TableHead>
              <tr>
                <th className="sortable-column">이름</th>
                <th className="sortable-column">예배드리면서 받은 은혜</th>
                <th className="sortable-column">등록일</th>
              </tr>
            </TableHead>
            <TableBody>
              {forumData.map((forum) => (
                <tr 
                  key={forum.id}
                  onClick={() => handleViewDetails(forum.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <UserInfo>
                      <UserAvatar>{forum.avatar}</UserAvatar>
                      <UserDetails>
                        <UserName>{forum.name}</UserName>
                        <UserMeta>{forum.meta}</UserMeta>
                      </UserDetails>
                    </UserInfo>
                  </td>
                  <td><MessagePreview>{forum.message}</MessagePreview></td>
                  <td><DateText>{forum.date}</DateText></td>
                </tr>
              ))}
            </TableBody>
          </ResponsiveDataTable>
        </TableWrapper>
        
        <TableFooter>
          <TableInfo>
            <span>1-{forumData.length} / {forumData.length}개 항목</span>
          </TableInfo>
          <TablePagination>
            <PageButton disabled>◀</PageButton>
            <PageButton className="active">1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>4</PageButton>
            <PageButton>5</PageButton>
            <PageButton>▶</PageButton>
          </TablePagination>
          <PageSizeSelect>
            <option>10개씩</option>
            <option>20개씩</option>
            <option>50개씩</option>
          </PageSizeSelect>
        </TableFooter>
      </ResponsiveTableContainer>
    </div>
  );

  const renderPrayerTab = () => (
    <div>
      <ResponsiveDateRangeContainer>
        <DateInputGroup>
          <DateLabel>시작일</DateLabel>
          <DateInput type="date" />
        </DateInputGroup>
        <DateSeparator>~</DateSeparator>
        <DateInputGroup>
          <DateLabel>종료일</DateLabel>
          <DateInput type="date" />
        </DateInputGroup>
        <GuideSizeButton>조회</GuideSizeButton>
        <QuickDateButtons>
          <GuideSizeOutlineButton>오늘</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>이번 주</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>이번 달</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>지난 3개월</GuideSizeOutlineButton>
          <GuideSizeOutlineButton>올해</GuideSizeOutlineButton>
          <GuideSizeSuccessButton onClick={handleExportPrayerCSV}>CSV 내보내기</GuideSizeSuccessButton>
        </QuickDateButtons>
      </ResponsiveDateRangeContainer>

      <ResponsiveTableContainer>
        <TableHeader>
          <TableTitle>
            <h4>한줄 기도문 목록</h4>
            <TableCount>총 {PrayerData.length}개</TableCount>
          </TableTitle>
        </TableHeader>
        
        <TableWrapper>
          <ResponsiveDataTable>
            <TableHead>
              <tr>
                <th className="sortable-column">이름</th>
                <th className="sortable-column">기도문</th>
                <th className="sortable-column">등록일</th>
              </tr>
            </TableHead>
            <TableBody>
              {PrayerData.map((prayer) => (
                <tr 
                  key={prayer.id}
                  onClick={() => handleViewDetails(prayer.id, 'prayer')}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <UserInfo>
                      <UserAvatar>{prayer.avatar}</UserAvatar>
                      <UserDetails>
                        <UserName>{prayer.name}</UserName>
                        <UserMeta>{prayer.meta}</UserMeta>
                      </UserDetails>
                    </UserInfo>
                  </td>
                  <td><PrayerContent>{prayer.content}</PrayerContent></td>
                  <td><PrayerDate>{prayer.date}</PrayerDate></td>
                </tr>
              ))}
            </TableBody>
          </ResponsiveDataTable>
        </TableWrapper>
        
        <TableFooter>
          <TableInfo>
            <span>1-{PrayerData.length} / {PrayerData.length}개 항목</span>
          </TableInfo>
          <TablePagination>
            <PageButton disabled>◀</PageButton>
            <PageButton className="active">1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>4</PageButton>
            <PageButton>5</PageButton>
            <PageButton>▶</PageButton>
          </TablePagination>
          <PageSizeSelect>
            <option>10개씩</option>
            <option>20개씩</option>
            <option>50개씩</option>
          </PageSizeSelect>
        </TableFooter>
      </ResponsiveTableContainer>
    </div>
  );



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
                onChange={(e) => {
                  // 여기서 실제로는 상태를 업데이트해야 하지만, 
                  // 현재는 하드코딩된 데이터이므로 읽기 전용으로 표시
                }}
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

  return (
    <Container>
      <Header>
        <Title>포럼 관리</Title>
        <Subtitle>청년들이 예배 후 작성한 포럼과 기도문을 관리하세요</Subtitle>
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
        {activeTab === 'forum' && renderForumTab()}
        {activeTab === 'prayer' && renderPrayerTab()}
      </TabContent>
      
      {isPrayerModalOpen && renderPrayerModal()}
    </Container>
  );
};

export default ForumManagement;

