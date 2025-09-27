import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 더미 구성원 데이터
const membersData = [
  {
    id: 1,
    이름: '김철수',
    소속국: '1국',
    소속그룹: '김철수 그룹',
    소속순: '1순',
  },
  {
    id: 2,
    이름: '이영희',
    소속국: '1국',
    소속그룹: '이영희 그룹',
    소속순: '2순',
  },
  {
    id: 3,
    이름: '박민수',
    소속국: '2국',
    소속그룹: '박민수 그룹',
    소속순: '3순',
  },
  {
    id: 4,
    이름: '최영수',
    소속국: '2국',
    소속그룹: '최영수 그룹',
    소속순: '4순',
  },
  {
    id: 5,
    이름: '정다은',
    소속국: '3국',
    소속그룹: '정다은 그룹',
    소속순: '5순',
  },
  // 더 많은 더미 데이터...
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    이름: `구성원${i + 6}`,
    소속국: `${(i % 3) + 1}국`,
    소속그룹: `그룹${i + 1}`,
    소속순: `${(i % 10) + 1}순`,
  })),
];

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
    '목사님, 직장에서의 어려움을 하나님께 맡기고 싶습니다.',
  ][index % 10],
}));

// 한줄 기도문 데이터
const prayerData = membersData.map((member, index) => ({
  id: member.id,
  name: member.이름,
  avatar: member.이름.charAt(0),
  meta: `${member.소속국} | ${member.소속그룹} | ${member.소속순}`,
  date: `2024-08-${String(7 + (index % 2)).padStart(2, '0')} 10:00`,
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
    '하나님, 하나님의 영광을 위해 살아갈 수 있도록 도와주세요.',
  ][index % 10],
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ForumManagement: React.FC = () => {
  const query = useQuery();
  const [activeTab, setActiveTab] = useState('forum');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedForum, setSelectedForum] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'forum' 또는 'prayer'

  useEffect(() => {
    const tab = query.get('tab');
    if (tab && tabList.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [query]);

  const handleSearch = () => {
    // 검색 로직
  };

  const handleViewDetails = (id: number, type = 'forum') => {
    if (type === 'prayer') {
      const prayer = prayerData.find(p => p.id === id);
      setSelectedForum(prayer);
      setModalType('prayer');
    } else {
      const forum = forumData.find(f => f.id === id);
      setSelectedForum(forum);
      setModalType('forum');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForum(null);
    setModalType('');
  };

  const handleEdit = () => {
    if (modalType === 'prayer') {
      // 기도문 수정 로직
    } else {
      // 포럼 수정 로직
    }
    // 수정 로직 구현
  };

  const handleDelete = (_id: number) => {
    // 삭제 로직 구현
    // 삭제 로직 구현
  };

  const renderForumTab = () => (
    <div>
      <div className='forum-header'>
        <h1 className='forum-title'>포럼 관리</h1>
        <p className='forum-subtitle'>청년들이 예배 후 작성한 포럼 내용을 조회하고 관리할 수 있습니다</p>
      </div>

      <div className='search-filter-section'>
        <input
          className='search-input'
          type='text'
          placeholder='이름, 국, 그룹, 순으로 검색...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select className='period-select' value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
          <option value='all'>전체기간</option>
          <option value='today'>오늘</option>
          <option value='week'>최근 7일</option>
          <option value='month'>최근 1개월</option>
          <option value='quarter'>최근 3개월</option>
        </select>
        <button className='search-button' onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className='forum-table'>
        <div className='table-header'>
          <div>이름</div>
          <div>등록일</div>
          <div>to. 목사님</div>
          <div>관리</div>
        </div>

        {forumData.slice(0, 10).map(forum => (
          <div key={forum.id} className='table-row'>
            <div className='user-info'>
              <div className='user-avatar'>{forum.avatar}</div>
              <div className='user-details'>
                <div className='user-name'>{forum.name}</div>
                <div className='user-meta'>{forum.meta}</div>
              </div>
            </div>

            <div className='date-text'>{forum.date}</div>

            <div className='message-preview'>{forum.message}</div>

            <div className='action-buttons'>
              <button className='view-button' onClick={() => handleViewDetails(forum.id)}>
                상세보기
              </button>
              <button className='delete-button' onClick={() => handleDelete(forum.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='pagination'>
        <button className='page-button' onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
          &lt; 이전
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            className={`page-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button className='page-button' onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}>
          다음 &gt;
        </button>
      </div>
    </div>
  );

  const renderPrayerTab = () => (
    <div>
      <div className='prayer-header'>
        <h1 className='prayer-title'>한줄 기도문 관리</h1>
        <p className='prayer-subtitle'>청년들이 예배 후 작성한 한줄 기도문을 조회하고 관리할 수 있습니다</p>
      </div>

      <div className='prayer-search-filter-section'>
        <input
          className='prayer-search-input'
          type='text'
          placeholder='이름, 국, 그룹, 순으로 검색...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className='prayer-period-select'
          value={selectedPeriod}
          onChange={e => setSelectedPeriod(e.target.value)}
        >
          <option value='all'>전체기간</option>
          <option value='today'>오늘</option>
          <option value='week'>최근 7일</option>
          <option value='month'>최근 1개월</option>
          <option value='quarter'>최근 3개월</option>
        </select>
        <button className='prayer-search-button' onClick={handleSearch}>
          검색
        </button>
      </div>

      <div className='prayer-table'>
        <div className='prayer-table-header'>
          <div>이름</div>
          <div>등록일</div>
          <div>기도문</div>
          <div>관리</div>
        </div>

        {prayerData.slice(0, 10).map(prayer => (
          <div key={prayer.id} className='prayer-table-row'>
            <div className='user-info'>
              <div className='user-avatar'>{prayer.avatar}</div>
              <div className='user-details'>
                <div className='user-name'>{prayer.name}</div>
                <div className='user-meta'>{prayer.meta}</div>
              </div>
            </div>
            <div className='prayer-date'>{prayer.date}</div>
            <div className='prayer-content'>{prayer.content}</div>
            <div className='prayer-actions'>
              <button className='prayer-view-button' onClick={() => handleViewDetails(prayer.id, 'prayer')}>
                수정
              </button>
              <button className='prayer-delete-button' onClick={() => handleDelete(prayer.id)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='prayer-pagination'>
        <button className='prayer-page-button' onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
          &lt; 이전
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            className={`prayer-page-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button className='prayer-page-button' onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}>
          다음 &gt;
        </button>
      </div>
    </div>
  );

  const renderForumModal = () => {
    if (!selectedForum) return null;

    return (
      <div className='modal-overlay' onClick={handleCloseModal}>
        <div className='modal-content' onClick={e => e.stopPropagation()}>
          <div className='modal-header'>
            <h2 className='modal-title'>{selectedForum.name}님의 예배 나눔</h2>
            <button className='close-button' onClick={handleCloseModal}>
              ×
            </button>
          </div>

          <div className='modal-body'>
            <div className='user-info-box'>
              <div className='user-info-row'>
                <span className='user-info-label'>이름:</span>
                <span className='user-info-value'>{selectedForum.name}</span>
              </div>
              <div className='user-info-row'>
                <span className='user-info-label'>작성일:</span>
                <span className='user-info-value'>{selectedForum.date}</span>
              </div>
              <div className='user-info-row'>
                <span className='user-info-label'>소속:</span>
                <span className='user-info-value'>{selectedForum.meta}</span>
              </div>
            </div>

            <div className='content-section'>
              <h3 className='section-title'>예배드리면서 받은 은혜</h3>
              <p className='section-content'>
                하나님의 사랑을 더 깊이 느낄 수 있었고, 특히 용서에 대한 말씀이 마음에 와 닿았습니다.
              </p>
            </div>

            <div className='content-section'>
              <h3 className='section-title'>말씀속에서 붙잡은 기도제목</h3>
              <p className='section-content'>새로운 직장에서 지혜롭게 일할 수 있도록 기도하겠습니다.</p>
            </div>

            <div className='content-section'>
              <h3 className='section-title'>이번주 실천사항</h3>
              <p className='section-content'>매일 새벽기도 시간을 갖고 하루를 시작하겠습니다.</p>
            </div>

            <div className='content-section'>
              <h3 className='section-title'>목사님께 하고싶은 한마디</h3>
              <p className='section-content'>{selectedForum.message}</p>
            </div>
          </div>

          <div className='modal-footer'>
            <button className='edit-button' onClick={handleEdit}>
              수정하기
            </button>
            <button className='close-modal-button' onClick={handleCloseModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPrayerModal = () => {
    if (!selectedForum) return null;

    const prayer = prayerData.find(p => p.id === selectedForum.id);
    if (!prayer) return null;

    return (
      <div className='prayer-modal-overlay' onClick={handleCloseModal}>
        <div className='prayer-modal-content' onClick={e => e.stopPropagation()}>
          <div className='prayer-modal-header'>
            <h2 className='prayer-modal-title'>{prayer.name}님의 한줄 기도문</h2>
            <button className='prayer-close-button' onClick={handleCloseModal}>
              ×
            </button>
          </div>

          <div className='prayer-modal-body'>
            <div className='prayer-user-info-box'>
              <div className='prayer-user-info-row'>
                <span className='prayer-user-info-label'>이름:</span>
                <span className='prayer-user-info-value'>{prayer.name}</span>
              </div>
              <div className='prayer-user-info-row'>
                <span className='prayer-user-info-label'>소속:</span>
                <span className='prayer-user-info-value'>{prayer.meta}</span>
              </div>
              <div className='prayer-user-info-row'>
                <span className='prayer-user-info-label'>작성일:</span>
                <span className='prayer-user-info-value'>{prayer.date}</span>
              </div>
              <div className='prayer-user-info-row'>
                <span className='prayer-user-info-label'>기도문:</span>
                <textarea
                  className='prayer-textarea'
                  value={prayer.content}
                  onChange={() => {
                    // 수정 로직 구현 필요
                  }}
                  placeholder='기도문을 입력하세요...'
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className='prayer-modal-footer'>
            <button className='prayer-edit-button' onClick={handleEdit}>
              수정하기
            </button>
            <button className='prayer-close-modal-button' onClick={handleCloseModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='main-content-with-sidebar'>
        <div className='forum-management-container'>
          <div className='tab-container'>
            {tabList.map(tab => (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='content'>
            {activeTab === 'forum' && renderForumTab()}
            {activeTab === 'prayer' && renderPrayerTab()}
          </div>

          {isModalOpen && modalType === 'forum' && renderForumModal()}
          {isModalOpen && modalType === 'prayer' && renderPrayerModal()}
        </div>
      </div>
    </>
  );
};

export default ForumManagement;
