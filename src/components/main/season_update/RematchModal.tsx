/**
 * 재매칭 다이얼로그
 * 자동 매칭에 실패한 행을, 그 사람의 현재 회기 소속(국/그룹/순)이나 이름으로 기존 인원 중에서 직접 골라 연결합니다.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { CurrentSeasonMember, UserData } from '../../../types/seasonUpdate';
import { ROW_USER_ID_FIELD } from '../../../utils/excel/excelFieldMapping';
import {
  describeMatchFailure,
  extractYearSuffix,
  getRowCurrentOrg,
  getRowMatch,
  normalizeGook,
  normalizeName,
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
  /** 서버 전체 유저 (불러오는 중이면 null) */
  allUsers: UserData[] | null;
  /** 현재 회기 구성원 (불러오는 중이면 null) */
  currentMembers: CurrentSeasonMember[] | null;
  isLoading: boolean;
  loadError: string | null;
  onRetryLoad: () => void;
  onClose: () => void;
  onConfirm: (user: UserData) => void;
}

type SearchMode = 'org' | 'name';

interface Candidate {
  user: UserData;
  memberships: CurrentSeasonMember[];
  birthYear: string;
  nameMatches: boolean;
}

const NAME_SEARCH_LIMIT = 50;

const sortKo = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b, 'ko-KR', { numeric: true }));

const formatOrg = (m: CurrentSeasonMember) => [m.gook, m.group, m.soon].filter(Boolean).join(' · ');

const RematchModal: React.FC<RematchModalProps> = ({
  isOpen,
  row,
  sheetName,
  rowNumber,
  allUsers,
  currentMembers,
  isLoading,
  loadError,
  onRetryLoad,
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<SearchMode>('org');
  const [gook, setGook] = useState('');
  const [group, setGroup] = useState('');
  const [soon, setSoon] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const members = useMemo(() => currentMembers ?? [], [currentMembers]);
  const usersById = useMemo(
    () => new Map((allUsers ?? []).filter(u => !u.isDeleted && u.id !== undefined).map(u => [u.id as number, u])),
    [allUsers]
  );
  const membershipsByUserId = useMemo(() => {
    const map = new Map<number, CurrentSeasonMember[]>();
    members.forEach(m => map.set(m.userId, [...(map.get(m.userId) ?? []), m]));
    return map;
  }, [members]);

  const gookOptions = useMemo(() => sortKo(members.map(m => m.gook ?? '').filter(Boolean)), [members]);
  const groupOptions = useMemo(
    () =>
      sortKo(
        members
          .filter(m => m.gook === gook)
          .map(m => m.group ?? '')
          .filter(Boolean)
      ),
    [members, gook]
  );
  const soonOptions = useMemo(
    () =>
      sortKo(
        members
          .filter(m => m.gook === gook && m.group === group)
          .map(m => m.soon ?? '')
          .filter(Boolean)
      ),
    [members, gook, group]
  );

  const rowName = String(row?.['이름'] ?? '').trim();
  const match = row ? getRowMatch(row) : undefined;

  // 열 때마다 엑셀의 현재 소속으로 미리 선택
  useEffect(() => {
    if (!isOpen || !row) return;
    const org = getRowCurrentOrg(row);
    const pickedGook = gookOptions.find(o => org.gook && normalizeGook(o) === normalizeGook(org.gook)) ?? '';
    const groupsOfGook = sortKo(
      members
        .filter(m => m.gook === pickedGook)
        .map(m => m.group ?? '')
        .filter(Boolean)
    );
    const pickedGroup = groupsOfGook.find(o => org.group && normalizeName(o) === normalizeName(org.group)) ?? '';
    const soonsOfGroup = sortKo(
      members
        .filter(m => m.gook === pickedGook && m.group === pickedGroup)
        .map(m => m.soon ?? '')
        .filter(Boolean)
    );
    const pickedSoon = soonsOfGroup.find(o => org.soon && normalizeName(o) === normalizeName(org.soon)) ?? '';

    setGook(pickedGook);
    setGroup(pickedGroup);
    setSoon(pickedSoon);
    setNameQuery(String(row['이름'] ?? '').trim());
    setSelectedUserId(typeof row[ROW_USER_ID_FIELD] === 'number' ? row[ROW_USER_ID_FIELD] : null);
    // 현재 소속을 알 수 없으면 이름으로 찾기부터 보여줌
    setMode(pickedGook ? 'org' : 'name');
  }, [isOpen, row, gookOptions, members]);

  const toCandidate = (user: UserData, memberships: CurrentSeasonMember[]): Candidate => ({
    user,
    memberships,
    birthYear: memberships[0]?.birthYear ?? (user.birthDate ? extractYearSuffix(user.birthDate) : ''),
    nameMatches: normalizeName(user.name) === normalizeName(rowName),
  });

  const sortCandidates = (list: Candidate[]) =>
    list.sort(
      (a, b) => Number(b.nameMatches) - Number(a.nameMatches) || a.user.name.localeCompare(b.user.name, 'ko-KR')
    );

  const orgCandidates = useMemo(() => {
    if (!gook || !group) return [];
    const inOrg = members.filter(m => m.gook === gook && m.group === group && (!soon || m.soon === soon));
    const userIds = [...new Set(inOrg.map(m => m.userId))];
    return sortCandidates(
      userIds.map(userId => {
        const memberships = inOrg.filter(m => m.userId === userId);
        const first = memberships[0];
        const user = usersById.get(userId) ?? {
          id: userId,
          name: first.name,
          nameSuffix: first.nameSuffix,
          phoneNumber: first.phoneNumber,
        };
        return toCandidate(user, membershipsByUserId.get(userId) ?? memberships);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, gook, group, soon, usersById, membershipsByUserId, rowName]);

  const nameCandidates = useMemo(() => {
    const query = normalizeName(nameQuery);
    if (!query) return [];
    const found = [...usersById.values()].filter(u => normalizeName(u.name).includes(query));
    return sortCandidates(found.map(u => toCandidate(u, membershipsByUserId.get(u.id as number) ?? []))).slice(
      0,
      NAME_SEARCH_LIMIT
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameQuery, usersById, membershipsByUserId, rowName]);

  const candidates = mode === 'org' ? orgCandidates : nameCandidates;
  const selected =
    selectedUserId !== null
      ? (candidates.find(c => c.user.id === selectedUserId) ??
        (usersById.has(selectedUserId)
          ? toCandidate(usersById.get(selectedUserId) as UserData, membershipsByUserId.get(selectedUserId) ?? [])
          : undefined))
      : undefined;
  const willRename = !!selected && normalizeName(selected.user.name) !== normalizeName(rowName);

  if (!row) return null;

  const renderCandidates = () => {
    if (isLoading) return <p className='rematch-empty'>기존 인원 정보를 불러오는 중이에요...</p>;
    if (loadError)
      return (
        <div className='rematch-empty'>
          <p>{loadError}</p>
          <button type='button' className='sync-modal-cancel-button' onClick={onRetryLoad}>
            다시 불러오기
          </button>
        </div>
      );
    if (mode === 'org' && (!gook || !group))
      return (
        <p className='rematch-empty'>국과 그룹을 선택하면 그 소속의 구성원이 보여요. (순까지 고르면 더 좁혀져요)</p>
      );
    if (mode === 'name' && !normalizeName(nameQuery))
      return <p className='rematch-empty'>찾을 이름을 입력해 주세요.</p>;
    if (candidates.length === 0)
      return (
        <p className='rematch-empty'>
          {mode === 'org'
            ? '이 소속에 구성원이 없어요. 소속을 바꾸거나 이름으로 찾아보세요.'
            : '일치하는 사람이 없어요. 아직 등록되지 않았다면 구성원 관리에서 먼저 등록한 뒤 정보 동기화를 다시 해주세요.'}
        </p>
      );

    return (
      <div className='rematch-candidates' role='radiogroup' aria-label='매칭할 사람 선택'>
        <div className='rematch-candidate rematch-candidate-head' aria-hidden='true'>
          <span />
          <span>이름</span>
          <span>기수</span>
          <span>연락처</span>
          <span>현재 소속 · 직분</span>
        </div>
        {candidates.map(c => {
          const id = c.user.id as number;
          const isSelected = id === selectedUserId;
          return (
            <label key={id} className={`rematch-candidate ${isSelected ? 'selected' : ''}`}>
              <input
                type='radio'
                name='rematch-candidate'
                checked={isSelected}
                onChange={() => setSelectedUserId(id)}
              />
              <span className='rematch-candidate-name'>
                {c.user.name}
                {c.user.nameSuffix ? <span className='rematch-suffix'>{c.user.nameSuffix}</span> : null}
                {c.nameMatches && <span className='rematch-badge'>이름 일치</span>}
              </span>
              <span>{c.birthYear || '-'}</span>
              <span>{c.user.phoneNumber ? formatPhoneNumber(c.user.phoneNumber) : '-'}</span>
              <span className='rematch-candidate-org'>
                {c.memberships.length > 0
                  ? c.memberships.map(m => `${formatOrg(m)} · ${m.role}`).join(' / ')
                  : '현재 회기 소속 없음'}
              </span>
            </label>
          );
        })}
        {mode === 'name' && candidates.length === NAME_SEARCH_LIMIT && (
          <p className='rematch-more'>최대 {NAME_SEARCH_LIMIT}명까지 보여요. 이름을 더 정확히 입력해 주세요.</p>
        )}
      </div>
    );
  };

  const currentOrg = getRowCurrentOrg(row);
  const excelCurrentOrg = [currentOrg.gook, currentOrg.group, currentOrg.soon].filter(Boolean).join(' · ');

  return (
    <Modal isOpen={isOpen} title='재매칭' onClose={onClose} size='large' className='rematch-modal'>
      <div className='rematch-content'>
        {/* 엑셀 행 요약 */}
        <div className='rematch-row-summary'>
          <div className='rematch-row-title'>
            <strong>{rowName || '(이름 없음)'}</strong>
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
              <dt>다음 회기 소속</dt>
              <dd>{[row['국'], row['그룹'], row['순']].filter(Boolean).join(' · ') || '-'}</dd>
            </div>
            <div>
              <dt>엑셀의 현재 소속</dt>
              <dd>{excelCurrentOrg || '없음'}</dd>
            </div>
          </dl>
        </div>

        {match?.status === 'failed' && (
          <p className='rematch-reason'>❗ {describeMatchFailure(match.reason, match.candidateCount)}</p>
        )}
        {match?.status === 'matched' && (
          <p className='rematch-reason matched'>
            이미 {match.source === 'manual' ? '직접' : '자동으로'} 매칭된 행이에요. 다른 사람으로 바꾸려면 아래에서
            선택하세요.
          </p>
        )}

        {/* 재매칭 안내 */}
        <details className='rematch-guide' open={match?.status === 'failed'}>
          <summary>💡 재매칭은 이렇게 해요</summary>
          <ol>
            <li>
              이 사람이 <strong>현재 회기(지금 다니는)</strong> 국 · 그룹 · 순을 고르면, 그 소속 구성원 목록에서 같은
              사람을 찾을 수 있어요. 엑셀에 현재 소속이 적혀 있으면 미리 선택해 두었어요.
            </li>
            <li>
              새가족이나 오랜만에 돌아온 사람처럼 현재 회기 소속이 없으면 <strong>이름으로 찾기</strong>를 이용하세요.
            </li>
            <li>
              목록에서 사람을 고르고 <strong>이 사람으로 매칭</strong>을 누르면 빨간 줄이 사라져요. 고른 사람은 정보
              동기화를 다시 해도 유지돼요.
            </li>
            <li>
              목록에 없다면 아직 등록되지 않은 사람이에요. 구성원 관리에서 먼저 등록한 뒤 정보 동기화를 다시 해주세요.
            </li>
          </ol>
        </details>

        {/* 찾기 방식 */}
        <div className='rematch-tabs' role='tablist'>
          <button
            type='button'
            role='tab'
            aria-selected={mode === 'org'}
            className={`rematch-tab ${mode === 'org' ? 'active' : ''}`}
            onClick={() => setMode('org')}
          >
            현재 소속으로 찾기
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={mode === 'name'}
            className={`rematch-tab ${mode === 'name' ? 'active' : ''}`}
            onClick={() => setMode('name')}
          >
            이름으로 찾기
          </button>
        </div>

        {mode === 'org' ? (
          <div className='rematch-filters'>
            <label>
              <span>국</span>
              <select
                value={gook}
                onChange={e => {
                  setGook(e.target.value);
                  setGroup('');
                  setSoon('');
                }}
              >
                <option value=''>선택</option>
                {gookOptions.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>그룹</span>
              <select
                value={group}
                disabled={!gook}
                onChange={e => {
                  setGroup(e.target.value);
                  setSoon('');
                }}
              >
                <option value=''>선택</option>
                {groupOptions.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>순</span>
              <select value={soon} disabled={!group} onChange={e => setSoon(e.target.value)}>
                <option value=''>전체</option>
                {soonOptions.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className='rematch-filters'>
            <label className='rematch-name-search'>
              <span>이름</span>
              <input
                type='text'
                value={nameQuery}
                placeholder='이름 일부만 입력해도 돼요'
                onChange={e => setNameQuery(e.target.value)}
              />
            </label>
          </div>
        )}

        {renderCandidates()}

        {selected && (
          <p className='rematch-selected'>
            선택한 사람: <strong>{selected.user.name}</strong>
            {selected.user.nameSuffix ? ` (${selected.user.nameSuffix})` : ''} · 기수 {selected.birthYear || '-'} ·{' '}
            {selected.memberships.length > 0 ? selected.memberships.map(formatOrg).join(' / ') : '현재 회기 소속 없음'}
          </p>
        )}
        {willRename && selected && (
          <p className='rematch-rename-note'>
            ✏️ 엑셀의 이름 &apos;{rowName}&apos;이(가) 선택한 사람의 이름 &apos;{selected.user.name}&apos;(으)로
            바뀌어요.
          </p>
        )}

        <div className='sync-modal-buttons'>
          <button type='button' className='sync-modal-cancel-button' onClick={onClose}>
            취소
          </button>
          <button
            type='button'
            className='sync-modal-confirm-button'
            disabled={!selected}
            onClick={() => selected && onConfirm(selected.user)}
          >
            이 사람으로 매칭
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RematchModal;
