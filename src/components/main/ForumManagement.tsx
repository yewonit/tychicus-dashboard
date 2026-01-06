import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const tabList = [
  { key: 'forum', label: '포럼' },
  { key: 'prayer', label: '한줄 기도문' },
];

// TODO: API 연동 필요 - 포럼 데이터 가져오기
const forumData: any[] = [];

// TODO: API 연동 필요 - 한줄 기도문 데이터 가져오기
const prayerData: any[] = [];

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
