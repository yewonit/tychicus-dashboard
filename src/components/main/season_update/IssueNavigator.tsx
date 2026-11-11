/**
 * 남아있는 확인이 필요한 부분 네비게이터
 * git 충돌 해결 화면처럼 남은 개수를 보여주고, 이전/다음 버튼으로 해당 칸으로 바로 이동합니다.
 */
import React, { useEffect, useState } from 'react';
import { IssueLocation, SeasonIssues } from '../../../types/seasonUpdate';

interface IssueNavigatorProps {
  issues: SeasonIssues;
  /** 정보 동기화를 한 번이라도 했는지 (매칭 결과가 있는지) */
  hasMatchResult: boolean;
  /** 위치로 이동 */
  onNavigate: (location: IssueLocation) => void;
}

interface IssueChipProps {
  kind: 'match' | 'value';
  icon: string;
  label: string;
  description: string;
  locations: IssueLocation[];
  onNavigate: (location: IssueLocation) => void;
}

/** 종류별 이동 버튼 (아이콘 + 남은 개수 + 이전/다음) */
const IssueChip: React.FC<IssueChipProps> = ({ kind, icon, label, description, locations, onNavigate }) => {
  const [cursor, setCursor] = useState(-1);
  const count = locations.length;

  // 고쳐서 개수가 줄면 현재 위치가 범위를 벗어나지 않게 조정
  useEffect(() => {
    setCursor(prev => (count === 0 ? -1 : Math.min(prev, count - 1)));
  }, [count]);

  const move = (step: 1 | -1) => {
    if (count === 0) return;
    const next = cursor < 0 ? (step === 1 ? 0 : count - 1) : (cursor + step + count) % count;
    setCursor(next);
    onNavigate(locations[next]);
  };

  if (count === 0) {
    return (
      <div className={`issue-chip issue-chip-${kind} resolved`} title={description}>
        <span className='issue-chip-icon'>✓</span>
        <span className='issue-chip-label'>{label} 없음</span>
      </div>
    );
  }

  return (
    <div className={`issue-chip issue-chip-${kind}`} title={description}>
      <button
        type='button'
        className='issue-chip-main'
        onClick={() => move(1)}
        aria-label={`${label} ${count}개, 다음 위치로 이동`}
      >
        <span className='issue-chip-icon' aria-hidden='true'>
          {icon}
        </span>
        <span className='issue-chip-label'>{label}</span>
        <span className='issue-chip-count'>{count}</span>
        {cursor >= 0 && (
          <span className='issue-chip-position'>
            {cursor + 1}/{count}
          </span>
        )}
      </button>
      <button type='button' className='issue-chip-arrow' onClick={() => move(-1)} aria-label={`이전 ${label}`}>
        ‹
      </button>
      <button type='button' className='issue-chip-arrow' onClick={() => move(1)} aria-label={`다음 ${label}`}>
        ›
      </button>
    </div>
  );
};

const IssueNavigator: React.FC<IssueNavigatorProps> = ({ issues, hasMatchResult, onNavigate }) => {
  const allResolved = hasMatchResult && issues.matchFailures.length === 0 && issues.valueWarnings.length === 0;

  return (
    <div className='issue-navigator'>
      <div className='issue-navigator-row'>
        <span className='issue-navigator-title'>남아있는 확인이 필요한 부분</span>
        <div className='issue-navigator-chips'>
          {hasMatchResult ? (
            <IssueChip
              kind='match'
              icon='🔴'
              label='매칭 실패'
              description='기존 인원과 연결되지 않은 행이에요. 행 앞의 [재매칭] 버튼으로 해결해 주세요.'
              locations={issues.matchFailures}
              onNavigate={onNavigate}
            />
          ) : (
            <span className='issue-navigator-hint'>🔄 정보 동기화를 누르면 기존 인원과의 매칭 결과가 표시돼요</span>
          )}
          <IssueChip
            kind='value'
            icon='⚠️'
            label='값 확인'
            description='형식이 이상한 칸이에요. 칸에 마우스를 올리면 이유가 보여요.'
            locations={issues.valueWarnings}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      {allResolved ? (
        <p className='issue-navigator-legend resolved'>✅ 확인이 필요한 부분이 없어요. 회기 변경을 적용할 수 있어요.</p>
      ) : (
        <ul className='issue-navigator-legend'>
          {hasMatchResult && issues.matchFailures.length > 0 && (
            <li>
              <span className='legend-swatch legend-swatch-match' aria-hidden='true' />
              <strong>빨간 줄</strong>은 기존 인원과 매칭되지 않은 사람이에요. 행 앞의 <strong>[재매칭]</strong>을
              누르면 같은 이름의 사람과 현재 회기 국·그룹·순이 보이고, 맞는 사람을 클릭하면 바로 연결돼요. 모두 해결해야
              적용할 수 있어요.
            </li>
          )}
          {issues.valueWarnings.length > 0 && (
            <li>
              <span className='legend-swatch legend-swatch-value' aria-hidden='true' />
              <strong>노란 칸</strong>은 형식이 이상한 값이에요. 칸에 마우스를 올리면 이유가 보이고, 바로 고칠 수
              있어요. 국·그룹·순 오류는 고쳐야 적용할 수 있어요.
            </li>
          )}
          <li className='legend-tip'>
            개수 버튼이나 ‹ › 를 누르면 해당 칸으로 바로 이동해요. 다른 시트에 있어도 자동으로 넘어가요.
          </li>
        </ul>
      )}
    </div>
  );
};

export default IssueNavigator;
