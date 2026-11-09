/**
 * 재매칭 다이얼로그
 * 열면 현재 회기(DB) 기준으로 같은 이름의 사람과 각자의 국/그룹/순을 불러오고,
 * 맞는 사람을 클릭하면 바로 그 행에 연결합니다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchRematchCandidates } from '../../../services/seasonUpdateService';
import { RematchCandidate } from '../../../types/seasonUpdate';
import { ROW_USER_ID_FIELD } from '../../../utils/excel/excelFieldMapping';
import {
  describeMatchFailure,
  getRowCurrentOrg,
  getRowMatch,
  isSameOrg,
  normalizeName,
  phoneDigits,
  toBirthYearSuffix,
} from '../../../utils/excel/seasonMatching';
import { formatPhoneNumber } from '../../../utils/phoneUtils';
import { Modal } from '../../ui';

interface RematchModalProps {
  isOpen: boolean;
  /** 재매칭할 엑셀 행 */
  row: Record<string, any> | null;
  /** 행 위치 표시용 */
  sheetName: string;
  rowNumber: number;
  onClose: () => void;
  /** 사람을 클릭하면 바로 호출 */
  onConfirm: (candidate: RematchCandidate) => void;
}

interface AnnotatedCandidate {
  candidate: RematchCandidate;
  orgMatch: boolean;
  phoneMatch: boolean;
  birthMatch: boolean;
  linked: boolean;
}

const joinOrg = (org: RematchCandidate['organizations'][number]) =>
  [org.gook, org.group, org.soon].filter(Boolean).join(' · ');

const RematchModal: React.FC<RematchModalProps> = ({ isOpen, row, sheetName, rowNumber, onClose, onConfirm }) => {
  const rowName = String(row?.['이름'] ?? '').trim();
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [candidates, setCandidates] = useState<RematchCandidate[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (name: string) => {
    const requestId = ++requestIdRef.current;
    setQuery(name);
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRematchCandidates(name);
      if (requestId === requestIdRef.current) setCandidates(result);
    } catch (e) {
      if (requestId === requestIdRef.current) {
        setCandidates(null);
        setError(e instanceof Error ? e.message : '같은 이름의 사람을 불러오지 못했어요.');
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  // 열릴 때마다 행의 이름으로 동명이인 조회
  useEffect(() => {
    if (!isOpen || !rowName) return;
    setSearchInput('');
    setCandidates(null);
    search(rowName);
  }, [isOpen, rowName, search]);

  // 같은 이름이 없으면 바로 다른 이름을 입력할 수 있게 포커스
  useEffect(() => {
    if (candidates && candidates.length === 0) searchInputRef.current?.focus();
  }, [candidates]);

  const annotated = useMemo<AnnotatedCandidate[]>(() => {
    if (!row || !candidates) return [];
    const rowOrg = getRowCurrentOrg(row);
    const rowPhone = phoneDigits(row['번호']);
    const rowBirth = toBirthYearSuffix(row['기수']);
    const linkedId = row[ROW_USER_ID_FIELD];
    return candidates
      .map(candidate => ({
        candidate,
        orgMatch: candidate.organizations.some(org => isSameOrg(org, rowOrg)),
        phoneMatch: !!rowPhone && phoneDigits(candidate.phoneNumber) === rowPhone,
        birthMatch: !!rowBirth && candidate.birthYear === rowBirth,
        linked: candidate.userId === linkedId,
      }))
      .sort(
        (a, b) =>
          Number(b.orgMatch) - Number(a.orgMatch) ||
          Number(b.phoneMatch) - Number(a.phoneMatch) ||
          Number(b.birthMatch) - Number(a.birthMatch) ||
          Number(b.candidate.organizations.length > 0) - Number(a.candidate.organizations.length > 0)
      );
  }, [row, candidates]);

  if (!row) return null;

  const match = getRowMatch(row);
  const currentOrg = getRowCurrentOrg(row);
  const excelCurrentOrg = [currentOrg.gook, currentOrg.group, currentOrg.soon].filter(Boolean).join(' · ');
  const searchingOtherName = normalizeName(query) !== normalizeName(rowName);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const name = searchInput.trim();
    if (name) search(name);
  };

  const renderList = () => {
    if (isLoading) return <p className='rematch-empty'>‘{query}’ 이름의 사람을 불러오는 중이에요...</p>;
    if (error)
      return (
        <div className='rematch-empty'>
          <p>{error}</p>
          <button type='button' className='sync-modal-cancel-button' onClick={() => search(query)}>
            다시 불러오기
          </button>
        </div>
      );
    if (!candidates) return null;
    if (annotated.length === 0)
      return (
        <p className='rematch-empty'>
          현재 DB에 ‘{query}’과(와) 이름이 같은 사람이 없어요.
          <br />
          이름이 다르게 등록되어 있다면 아래에서 다른 이름으로 찾아보세요.
        </p>
      );

    return (
      <ul className='rematch-card-list'>
        {annotated.map(({ candidate: c, orgMatch, phoneMatch, birthMatch, linked }) => (
          <li key={c.userId}>
            <button
              type='button'
              className={`rematch-card ${orgMatch ? 'recommended' : ''} ${linked ? 'linked' : ''}`}
              onClick={() => onConfirm(c)}
            >
              <span className='rematch-card-name'>
                {c.name}
                {c.nameSuffix && <span className='rematch-suffix'>{c.nameSuffix}</span>}
              </span>
              <span className='rematch-card-orgs'>
                {c.organizations.length > 0 ? (
                  c.organizations.map((org, i) => (
                    <span key={i} className='rematch-card-org'>
                      {joinOrg(org)}
                      <span className='rematch-card-role'>{org.role}</span>
                    </span>
                  ))
                ) : (
                  <span className='rematch-card-org none'>현재 회기 소속 없음</span>
                )}
              </span>
              <span className='rematch-card-meta'>
                기수 {c.birthYear || '-'} · {c.phoneNumber ? formatPhoneNumber(c.phoneNumber) : '연락처 없음'}
              </span>
              <span className='rematch-card-badges'>
                {linked && <span className='rematch-badge linked'>현재 연결됨</span>}
                {orgMatch && <span className='rematch-badge'>엑셀 현재 소속과 같음</span>}
                {phoneMatch && <span className='rematch-badge'>연락처 일치</span>}
                {birthMatch && <span className='rematch-badge'>기수 일치</span>}
              </span>
              <span className='rematch-card-action' aria-hidden='true'>
                이 사람으로 연결 →
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Modal isOpen={isOpen} title='재매칭' onClose={onClose} size='large' className='rematch-modal'>
      <div className='rematch-content'>
        {/* 엑셀 행 요약 */}
        <div className='rematch-row-summary'>
          <div className='rematch-row-title'>
            <strong>{rowName}</strong>
            {row['구분'] && <span className='rematch-suffix'>{row['구분']}</span>}
            <span className='rematch-row-location'>
              {sheetName} · {rowNumber}행
            </span>
          </div>
          <dl className='rematch-row-fields'>
            <div>
              <dt>기수</dt>
              <dd>{row['기수'] || '-'}</dd>
            </div>
            <div>
              <dt>연락처</dt>
              <dd>{row['번호'] || '-'}</dd>
            </div>
            <div>
              <dt>다음 회기 소속 (엑셀)</dt>
              <dd>{[row['국'], row['그룹'], row['순']].filter(Boolean).join(' · ') || '-'}</dd>
            </div>
            <div>
              <dt>현재 소속 (엑셀)</dt>
              <dd>{excelCurrentOrg || '없음'}</dd>
            </div>
          </dl>
        </div>

        {match?.status === 'failed' && (
          <p className='rematch-reason'>❗ {describeMatchFailure(match.reason, match.candidateCount)}</p>
        )}

        {(searchingOtherName || annotated.length > 0) && (
          <p className='rematch-instruction'>
            {searchingOtherName ? (
              <>
                ‘{query}’ 이름으로 찾은 사람들이에요. 선택하면 엑셀의 이름도 그 사람 이름으로 바뀌어요.{' '}
                <button type='button' className='rematch-link' onClick={() => search(rowName)}>
                  ‘{rowName}’(으)로 다시 보기
                </button>
              </>
            ) : (
              <>
                <strong>현재 회기(DB)</strong> 기준으로 ‘{rowName}’과(와) 이름이 같은 사람들이에요. 국 · 그룹 · 순을
                보고 맞는 사람을 <strong>클릭하면 바로 연결</strong>돼요.
              </>
            )}
          </p>
        )}

        {renderList()}

        {/* 다른 이름으로 찾기 */}
        <form className='rematch-search' onSubmit={submitSearch}>
          <label htmlFor='rematch-search-input'>찾는 사람이 없나요? 다른 이름으로 찾기</label>
          <div className='rematch-search-row'>
            <input
              id='rematch-search-input'
              ref={searchInputRef}
              type='text'
              value={searchInput}
              placeholder='DB에 등록된 이름 (예: 오타를 고친 이름)'
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type='submit' className='sync-modal-cancel-button' disabled={!searchInput.trim()}>
              찾기
            </button>
          </div>
          <p className='rematch-search-note'>
            그래도 없다면 아직 등록되지 않은 사람이에요. 구성원 관리에서 먼저 등록한 뒤 정보 동기화를 다시 해주세요.
          </p>
        </form>

        <div className='sync-modal-buttons'>
          <button type='button' className='sync-modal-cancel-button' onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RematchModal;
