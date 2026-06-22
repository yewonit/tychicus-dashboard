import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface Stats {
  total_visitations: number;
  method_stats: Record<string, number>;
  department_stats: Record<string, number>;
  recent_visitations: number;
  this_month_visitations: number;
  this_week_visitations: number;
  today_visitations: number;
}

interface Member {
  id: number;
  이름: string;
  생일연도: string;
  소속국: string;
  소속그룹: string;
  소속순: string;
}

interface Keyword {
  word: string;
  count: number;
}

// 키워드 추출 함수
const extractKeywords = (texts: string[], topN = 5): Keyword[] => {
  if (!texts || texts.length === 0) return [];

  // 한국어 불용어 목록
  const stopWords = [
    '그리고',
    '또는',
    '하지만',
    '그런데',
    '그러나',
    '그래서',
    '그런',
    '이런',
    '저런',
    '있다',
    '없다',
    '하다',
    '되다',
    '있다',
    '없다',
    '그것',
    '이것',
    '저것',
    '무엇',
    '어떤',
    '어떻게',
    '언제',
    '어디서',
    '왜',
    '누가',
    '무엇을',
    '어떤',
    '이런',
    '저런',
    '그런',
    '아무',
    '몇',
    '얼마',
    '얼마나',
    '어느',
    '어떤',
    '어떻게',
    '가',
    '이',
    '은',
    '는',
    '을',
    '를',
    '에',
    '에서',
    '로',
    '으로',
    '와',
    '과',
    '의',
    '에게',
    '한테',
    '께',
    '더',
    '많이',
    '적게',
    '잘',
    '못',
    '안',
    '못',
    '말',
    '것',
    '수',
    '때',
    '곳',
    '일',
    '사람',
    '시간',
    '문제',
    '생각',
    '마음',
  ];

  // 텍스트를 단어로 분리하고 정규화
  const words = texts
    .flatMap((text: string) => text.split(/[\s,.!?]+/))
    .map((word: string) => word.replace(/[^\w가-힣]/g, '').toLowerCase())
    .filter((word: string) => word.length > 1 && !stopWords.includes(word))
    .filter((word: string) => /[가-힣]/.test(word)); // 한글이 포함된 단어만

  // 단어 빈도 계산
  const wordCount: Record<string, number> = {};
  words.forEach((word: string) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // 빈도순으로 정렬하고 상위 N개 반환
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, topN)
    .map(([word, count]) => ({ word, count: count as number }));
};

const VisitationManagement: React.FC = () => {
  const navigate = useNavigate();
  const [visitations, setVisitations] = useState<Visitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVisitation, setSelectedVisitation] = useState<Visitation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterGroup, setFilterGroup] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');
  const [stats, setStats] = useState<Stats>({} as Stats);
  const [departments, setDepartments] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchVisitations();
    fetchStats();
    loadOrganizationData();
  }, []);

  const fetchVisitations = async () => {
    try {
      // TODO: API 연동 필요 - 심방 데이터 가져오기
      setVisitations([]);
    } catch (error) {
      // 보안: 에러 객체 전체(심방 개인정보 포함 가능)를 출력하지 않고 메시지만 기록
      console.error('심방 데이터 조회 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
      setVisitations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // TODO: API 연동 필요 - 심방 통계 데이터 가져오기
      setStats({
        total_visitations: 0,
        method_stats: {},
        department_stats: {},
        recent_visitations: 0,
        this_month_visitations: 0,
        this_week_visitations: 0,
        today_visitations: 0,
      });
    } catch (error) {
      // 보안: 에러 객체 전체를 출력하지 않고 메시지만 기록
      console.error('심방 통계 조회 실패:', error instanceof Error ? error.message : '알 수 없는 오류');
    }
  };

  const loadOrganizationData = () => {
    // TODO: API 연동 필요 - 조직 데이터 가져오기
    const members: Member[] = [];

    const deptSet = new Set();
    const groupSet = new Set();
    const teamSet = new Set();

    members.forEach(member => {
      deptSet.add(member.소속국);
      groupSet.add(member.소속그룹);
      teamSet.add(member.소속순);
    });

    setDepartments(Array.from(deptSet).sort() as string[]);
    setGroups(Array.from(groupSet).sort() as string[]);
    setTeams(Array.from(teamSet).sort() as string[]);
  };

  const handleCreateVisitation = () => {
    setSelectedVisitation(null);
    setShowModal(true);
  };

  const handleViewVisitation = (visitation: Visitation) => {
    navigate(`/main/visitation/${visitation.id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const visitationData = {
      대상자_이름: formData.get('targetName') as string,
      대상자_국: formData.get('targetDepartment') as string,
      대상자_그룹: formData.get('targetGroup') as string,
      대상자_순: formData.get('targetTeam') as string,
      대상자_생일연도: parseInt(formData.get('targetBirthYear') as string),
      심방날짜: formData.get('visitationDate') as string,
      심방방법: formData.get('visitationMethod') as string,
      진행자_이름: formData.get('conductorName') as string,
      진행자_직분: formData.get('conductorPosition') as string,
      진행자_국: formData.get('conductorDepartment') as string,
      진행자_그룹: formData.get('conductorGroup') as string,
      진행자_순: formData.get('conductorTeam') as string,
      진행자_생일연도: parseInt(formData.get('conductorBirthYear') as string),
      심방내용: formData.get('visitationContent') as string,
    };

    try {
      // 목업: 새 심방 기록 추가
      const newVisitation: Visitation = {
        id: Date.now(),
        ...visitationData,
        대상자_순장: visitationData.대상자_이름, // 기본값으로 대상자 이름 사용
        대상자_사진: null,
        작성일시: new Date().toLocaleString('ko-KR'),
      };

      setVisitations(prev => [newVisitation, ...prev]);
      setShowModal(false);

      // 심방 기록 생성 로직
    } catch (error) {
      // 에러 처리
    }
  };

  const calculateGeneration = (birthYear: number): string => {
    if (!birthYear) return '';
    const yearString = birthYear.toString();
    return yearString.slice(-2);
  };

  const filteredVisitations = visitations.filter(visitation => {
    const matchesSearch = visitation.대상자_이름.includes(searchTerm);
    const matchesDepartment = filterDepartment === '전체' || visitation.대상자_국 === filterDepartment;
    const matchesGroup = filterGroup === '전체' || visitation.대상자_그룹 === filterGroup;
    const matchesTeam = filterTeam === '전체' || visitation.대상자_순 === filterTeam;

    return matchesSearch && matchesDepartment && matchesGroup && matchesTeam;
  });

  if (loading) {
    return (
      <div className='visitation-container'>
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className='visitation-container'>
      <div className='visitation-header'>
        <h1>심방 관리</h1>
        <p>청년들의 심방 활동을 관리하고 기록하세요</p>
      </div>

      <div className='visitation-stats-grid'>
        <div className='visitation-stat-card'>
          <h3>이번 달 심방</h3>
          <div className='visitation-stat-value'>{stats.this_month_visitations || 0}</div>
          <p>최근 30일 내 심방 수</p>
        </div>
        <div className='visitation-stat-card'>
          <h3>이번 주 심방</h3>
          <div className='visitation-stat-value'>{stats.this_week_visitations || 0}</div>
          <p>최근 7일 내 심방 수</p>
        </div>
        <div className='visitation-stat-card'>
          <h3>이번달 심방 내용 주요 키워드</h3>
          <div className='visitation-stat-value'>
            <div className='visitation-keywords-container'>
              {(() => {
                const thisMonthVisitations = visitations.filter(v => {
                  const visitDate = new Date(v.심방날짜);
                  const now = new Date();
                  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                  return visitDate >= startOfMonth;
                });
                const keywords = extractKeywords(
                  thisMonthVisitations.map(v => v.심방내용),
                  3
                );
                return keywords.length > 0 ? (
                  keywords.map((kw, idx) => (
                    <div key={idx} className='visitation-keyword-item'>
                      <span className='visitation-keyword-text'>{kw.word}</span>
                      <span className='visitation-keyword-count'>{kw.count}</span>
                    </div>
                  ))
                ) : (
                  <span className='visitation-no-data'>데이터 없음</span>
                );
              })()}
            </div>
          </div>
          <p>이번 달 심방 내용에서 자주 언급된 키워드</p>
        </div>
        <div className='visitation-stat-card'>
          <h3>이번주 심방 내용 주요 키워드</h3>
          <div className='visitation-stat-value'>
            <div className='visitation-keywords-container'>
              {(() => {
                const thisWeekVisitations = visitations.filter(v => {
                  const visitDate = new Date(v.심방날짜);
                  const now = new Date();
                  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                  startOfWeek.setHours(0, 0, 0, 0);
                  return visitDate >= startOfWeek;
                });
                const keywords = extractKeywords(
                  thisWeekVisitations.map(v => v.심방내용),
                  3
                );
                return keywords.length > 0 ? (
                  keywords.map((kw, idx) => (
                    <div key={idx} className='visitation-keyword-item'>
                      <span className='visitation-keyword-text'>{kw.word}</span>
                      <span className='visitation-keyword-count'>{kw.count}</span>
                    </div>
                  ))
                ) : (
                  <span className='visitation-no-data'>데이터 없음</span>
                );
              })()}
            </div>
          </div>
          <p>이번 주 심방 내용에서 자주 언급된 키워드</p>
        </div>
      </div>

      <div className='visitation-action-bar'>
        <div className='visitation-search-bar'>
          <input
            type='text'
            placeholder='이름으로 검색...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='visitation-search-input'
          />
          <select
            value={filterDepartment}
            onChange={e => setFilterDepartment(e.target.value)}
            className='visitation-filter-select'
          >
            <option value='전체'>소속국</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
            className='visitation-filter-select'
          >
            <option value='전체'>소속그룹</option>
            {groups.map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className='visitation-filter-select'>
            <option value='전체'>소속순</option>
            {teams.map(team => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
        <div className='visitation-view-controls'>
          <button
            onClick={() => setViewMode('table')}
            className={`visitation-view-button ${viewMode === 'table' ? 'active' : ''}`}
          >
            📊 표
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`visitation-view-button ${viewMode === 'cards' ? 'active' : ''}`}
          >
            🃏 카드
          </button>
          <button onClick={handleCreateVisitation} className='visitation-add-button'>
            ✨ 새 심방 기록
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className='visitation-table-container'>
          <table className='visitation-table'>
            <thead>
              <tr>
                <th>심방일자</th>
                <th>대상자 이름</th>
                <th>기수</th>
                <th>국</th>
                <th>그룹</th>
                <th>순</th>
                <th>진행자 이름</th>
                <th>심방방법</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitations.length > 0 ? (
                filteredVisitations
                  .sort((a, b) => new Date(b.심방날짜).getTime() - new Date(a.심방날짜).getTime())
                  .map(visitation => (
                    <tr key={visitation.id} onClick={() => handleViewVisitation(visitation)}>
                      <td className='visitation-table-cell-bold'>{visitation.심방날짜}</td>
                      <td className='visitation-table-cell-bold'>{visitation.대상자_이름}</td>
                      <td className='visitation-table-cell-secondary'>
                        {calculateGeneration(visitation.대상자_생일연도)}
                      </td>
                      <td>{visitation.대상자_국}</td>
                      <td>{visitation.대상자_그룹}</td>
                      <td>{visitation.대상자_순장}</td>
                      <td className='visitation-table-cell-bold'>{visitation.진행자_이름}</td>
                      <td>
                        <span className={`visitation-method-badge ${visitation.심방방법}`}>{visitation.심방방법}</span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8} className='visitation-empty-message'>
                    검색 조건에 맞는 심방 기록이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='visitation-cards-grid'>
          {filteredVisitations.length > 0 ? (
            filteredVisitations
              .sort((a, b) => new Date(b.심방날짜).getTime() - new Date(a.심방날짜).getTime())
              .map(visitation => (
                <div key={visitation.id} className='visitation-card' onClick={() => handleViewVisitation(visitation)}>
                  <div className='visitation-card-header'>
                    <h3>{visitation.대상자_이름} 심방</h3>
                    <span className={`visitation-method-badge ${visitation.심방방법}`}>{visitation.심방방법}</span>
                  </div>
                  <div className='visitation-card-content'>
                    <div className='visitation-info-row'>
                      <span className='visitation-info-label'>심방일자:</span>
                      <span className='visitation-info-value'>{visitation.심방날짜}</span>
                    </div>
                    <div className='visitation-info-row'>
                      <span className='visitation-info-label'>대상자:</span>
                      <span className='visitation-info-value'>
                        {visitation.대상자_이름} ({calculateGeneration(visitation.대상자_생일연도)}기)
                      </span>
                    </div>
                    <div className='visitation-info-row'>
                      <span className='visitation-info-label'>소속:</span>
                      <span className='visitation-info-value'>
                        {visitation.대상자_국} {visitation.대상자_그룹} {visitation.대상자_순장}
                      </span>
                    </div>
                    <div className='visitation-info-row'>
                      <span className='visitation-info-label'>진행자:</span>
                      <span className='visitation-info-value'>
                        {visitation.진행자_이름} ({visitation.진행자_직분})
                      </span>
                    </div>
                    <p className='visitation-content-preview'>{visitation.심방내용}</p>
                  </div>
                  <div className='visitation-card-footer'>
                    <span>작성일시: {visitation.작성일시}</span>
                  </div>
                </div>
              ))
          ) : (
            <div className='visitation-empty-cards'>검색 조건에 맞는 심방 기록이 없습니다.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className='visitation-modal' onClick={() => setShowModal(false)}>
          <div className='visitation-modal-content' onClick={e => e.stopPropagation()}>
            <div className='visitation-modal-header'>
              <h2>{selectedVisitation ? '심방 기록 수정' : '새 심방 기록'}</h2>
              <button onClick={() => setShowModal(false)} className='visitation-modal-close'>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className='visitation-form'>
              <div className='visitation-form-section'>
                <h3>심방 내용</h3>
                <div className='visitation-form-group'>
                  <label>심방 내용 *</label>
                  <textarea
                    name='visitationContent'
                    defaultValue={selectedVisitation?.심방내용}
                    placeholder='심방 내용을 상세히 작성해주세요...'
                    required
                    className='visitation-textarea'
                  />
                </div>
              </div>

              <div className='visitation-form-section'>
                <h3>대상자 정보</h3>
                <div className='visitation-form-group'>
                  <label>대상자 이름 *</label>
                  <input
                    name='targetName'
                    defaultValue={selectedVisitation?.대상자_이름}
                    required
                    className='visitation-input'
                  />
                </div>
                <div className='visitation-form-group'>
                  <label>대상자 생일연도 *</label>
                  <input
                    name='targetBirthYear'
                    type='number'
                    defaultValue={selectedVisitation?.대상자_생일연도}
                    required
                    className='visitation-input'
                  />
                </div>
                <div className='visitation-form-row'>
                  <div className='visitation-form-group'>
                    <label>소속국 *</label>
                    <select
                      name='targetDepartment'
                      defaultValue={selectedVisitation?.대상자_국}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='visitation-form-group'>
                    <label>소속그룹 *</label>
                    <select
                      name='targetGroup'
                      defaultValue={selectedVisitation?.대상자_그룹}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {groups.map(group => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='visitation-form-group'>
                    <label>소속순 *</label>
                    <select
                      name='targetTeam'
                      defaultValue={selectedVisitation?.대상자_순}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {teams.map(team => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='visitation-form-section'>
                <h3>심방 정보</h3>
                <div className='visitation-form-row'>
                  <div className='visitation-form-group'>
                    <label>심방 날짜 *</label>
                    <input
                      name='visitationDate'
                      type='date'
                      defaultValue={selectedVisitation?.심방날짜}
                      required
                      className='visitation-input'
                    />
                  </div>
                  <div className='visitation-form-group'>
                    <label>심방 방법 *</label>
                    <select
                      name='visitationMethod'
                      defaultValue={selectedVisitation?.심방방법}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      <option value='만남'>만남</option>
                      <option value='통화'>통화</option>
                      <option value='카카오톡'>카카오톡</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className='visitation-form-section'>
                <h3>진행자 정보</h3>
                <div className='visitation-form-group'>
                  <label>진행자 이름 *</label>
                  <input
                    name='conductorName'
                    defaultValue={selectedVisitation?.진행자_이름}
                    required
                    className='visitation-input'
                  />
                </div>
                <div className='visitation-form-group'>
                  <label>진행자 직분 *</label>
                  <input
                    name='conductorPosition'
                    defaultValue={selectedVisitation?.진행자_직분}
                    required
                    className='visitation-input'
                  />
                </div>
                <div className='visitation-form-group'>
                  <label>진행자 생일연도 *</label>
                  <input
                    name='conductorBirthYear'
                    type='number'
                    defaultValue={selectedVisitation?.진행자_생일연도}
                    required
                    className='visitation-input'
                  />
                </div>
                <div className='visitation-form-row'>
                  <div className='visitation-form-group'>
                    <label>소속국 *</label>
                    <select
                      name='conductorDepartment'
                      defaultValue={selectedVisitation?.진행자_국}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='visitation-form-group'>
                    <label>소속그룹 *</label>
                    <select
                      name='conductorGroup'
                      defaultValue={selectedVisitation?.진행자_그룹}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {groups.map(group => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='visitation-form-group'>
                    <label>소속순 *</label>
                    <select
                      name='conductorTeam'
                      defaultValue={selectedVisitation?.진행자_순}
                      required
                      className='visitation-select'
                    >
                      <option value=''>선택하세요</option>
                      {teams.map(team => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='visitation-form-buttons'>
                <button type='button' onClick={() => setShowModal(false)} className='visitation-button'>
                  취소
                </button>
                <button type='submit' className='visitation-button primary'>
                  {selectedVisitation ? '수정하기' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitationManagement;
