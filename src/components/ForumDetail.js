import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  UserInfoBox,
  UserInfoRow,
  UserInfoLabel,
  UserInfoValue,
  ContentSection,
  SectionTitle,
  SectionContent,
  ResponsivePageContainer,
  ResponsiveAdminHeader,
  ResponsiveCardContainer,
  media
} from './common/CommonStyles';

// 추가 스타일 컴포넌트들
const BackButton = styled.button`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-1px);
  }
`;

const CardHeader = styled.div`
  padding: 24px 24px 0 24px;
  position: relative;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  padding-left: 16px;
  border-left: 4px solid #764ba2;
`;

const CardBody = styled.div`
  padding: 24px;
`;

const CardFooter = styled.div`
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e9ecef;
`;

// EditButton과 DeleteButton 스타일 컴포넌트 제거됨

// 포럼 데이터 - mockData.js의 membersData를 기반으로 생성
const forumData = membersData.map((member, index) => ({
  id: member.id,
  name: member.이름,
  avatar: member.이름.charAt(0),
  meta: `${member.소속국} | ${member.소속그룹} | ${member.소속순}`,
  date: `2024-08-${String(7 + (index % 3)).padStart(2, '0')} ${String(19 + (index % 2)).padStart(2, '0')}:${String((index * 15) % 60).padStart(2, '0')}`,
  message: [
    '목사님, 이번 주 설교 말씀이 정말 은혜가 되었습니다. 하나님의 사랑을 더 깊이 느낄 수 있었어요.',
    '목사님, 진로에 대해 고민이 많은데 기도 부탁드립니다. 하나님의 뜻을 알고 싶어요.',
    '목사님, 이번 주 성경공부가 너무 좋았습니다. 다음 주에도 이런 시간을 가질 수 있을까요?',
    '목사님, 가족을 위한 기도가 필요합니다. 어려운 상황을 겪고 있어서 하나님의 도움이 필요해요.',
    '목사님, 친구가 교회에 오고 싶어한다고 하는데 어떻게 도와드릴까요?',
    '목사님, 이번 주 봉사활동이 정말 의미있었습니다. 다음에도 참여하고 싶어요.',
    '목사님, 개인적인 문제로 고민이 많은데 상담받을 수 있을까요?',
    '목사님, 이번 주 말씀을 통해 새로운 깨달음을 얻었습니다. 감사합니다.',
    '목사님, 가족의 건강을 위해 기도 부탁드립니다.',
    '목사님, 직장에서의 어려움을 하나님께 맡기고 싶습니다.'
  ][index % 10]
}));

const ForumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);

  useEffect(() => {
    const foundForum = forumData.find(f => f.id === parseInt(id));
    if (foundForum) {
      setForum(foundForum);
    } else {
      // 포럼을 찾을 수 없는 경우 목록으로 돌아가기
      navigate('/forum');
    }
  }, [id, navigate]);

  // handleEdit과 handleDelete 함수 제거됨

  const handleBack = () => {
    navigate('/forum');
  };

  if (!forum) {
    return (
      <PageContainer>
        <div>포럼을 찾을 수 없습니다.</div>
      </PageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <ResponsiveAdminHeader>
        <HeaderTop>
          <HeaderLeft>
            <h1>포럼 상세보기</h1>
            <p>{forum.name}님의 예배 나눔 내용을 확인하세요</p>
          </HeaderLeft>
          <HeaderRight>
            {/* 수정하기, 삭제하기 버튼 제거됨 */}
          </HeaderRight>
        </HeaderTop>
        <HeaderBreadcrumb>
          <span>홈</span>
          <span>/</span>
          <span>포럼 관리</span>
          <span>/</span>
          <span className="active">포럼 상세보기</span>
        </HeaderBreadcrumb>
      </ResponsiveAdminHeader>

      <BackButton onClick={handleBack}>
        ← 포럼 목록으로 돌아가기
      </BackButton>

      <ResponsiveCardContainer>
        <CardHeader>
          <CardTitle>{forum.name}님의 예배 나눔</CardTitle>
        </CardHeader>
        
        <CardBody>
          <UserInfoBox>
            <UserInfoRow>
              <UserInfoLabel>이름:</UserInfoLabel>
              <UserInfoValue>{forum.name}</UserInfoValue>
            </UserInfoRow>
            <UserInfoRow>
              <UserInfoLabel>작성일:</UserInfoLabel>
              <UserInfoValue>{forum.date}</UserInfoValue>
            </UserInfoRow>
            <UserInfoRow>
              <UserInfoLabel>소속:</UserInfoLabel>
              <UserInfoValue>{forum.meta}</UserInfoValue>
            </UserInfoRow>
          </UserInfoBox>
          
          <ContentSection>
            <SectionTitle>예배드리면서 받은 은혜</SectionTitle>
            <SectionContent>
              하나님의 사랑을 더 깊이 느낄 수 있었고, 특히 용서에 대한 말씀이 마음에 와 닿았습니다.
            </SectionContent>
          </ContentSection>
          
          <ContentSection>
            <SectionTitle>말씀속에서 붙잡은 기도제목</SectionTitle>
            <SectionContent>
              새로운 직장에서 지혜롭게 일할 수 있도록 기도하겠습니다.
            </SectionContent>
          </ContentSection>
          
          <ContentSection>
            <SectionTitle>이번주 실천사항</SectionTitle>
            <SectionContent>
              매일 새벽기도 시간을 갖고 하루를 시작하겠습니다.
            </SectionContent>
          </ContentSection>
          
          <ContentSection>
            <SectionTitle>목사님께 하고싶은 한마디</SectionTitle>
            <SectionContent>
              {forum.message}
            </SectionContent>
          </ContentSection>
        </CardBody>
        
        {/* 카드 푸터 제거됨 - 수정하기, 삭제하기 버튼이 있었던 부분 */}
      </ResponsiveCardContainer>
    </ResponsivePageContainer>
  );
};

export default ForumDetail;
