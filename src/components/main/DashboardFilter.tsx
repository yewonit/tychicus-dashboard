import React from 'react';
import { Gook, Group } from '../../types';

interface DashboardFilterProps {
  selectedGukId: number | '전체';
  selectedGroupId: number | '전체';
  selectedGroupName: string;
  gooks: Gook[];
  groups: Group[];
  availableGroups: { value: number | '전체'; label: string }[];
  loading: {
    gooks: boolean;
    groups: boolean;
  };
  error: {
    gooks: string | null;
    groups: string | null;
  };
  onGukChange: (value: number | '전체') => void;
  onGroupChange: (value: number | '전체') => void;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({
  selectedGukId,
  selectedGroupId,
  selectedGroupName,
  gooks,
  groups: _groups,
  availableGroups,
  loading,
  error,
  onGukChange,
  onGroupChange,
}) => {
  const guks: { value: number | '전체'; label: string }[] = [
    { value: '전체', label: '전체' },
    ...(Array.isArray(gooks)
      ? gooks.map(gook => ({
          value: gook.id as number,
          label: gook.name,
        }))
      : []),
  ];

  return (
    <div className='dashboard-filter-section'>
      <div className='filter-group'>
        <label className='filter-label'>국 선택:</label>
        <select
          className='filter-select'
          value={selectedGukId}
          onChange={e => {
            const value = e.target.value === '전체' ? '전체' : Number(e.target.value);
            onGukChange(value);
          }}
          disabled={loading.gooks}
        >
          {loading.gooks ? (
            <option value='전체'>로딩 중...</option>
          ) : (
            guks.map(guk => (
              <option key={guk.value} value={guk.value}>
                {guk.label}
              </option>
            ))
          )}
        </select>
        {error.gooks && <div className='error-message'>⚠️ {error.gooks}</div>}
      </div>

      <div className='filter-group'>
        <label className='filter-label'>그룹 선택:</label>
        <select
          className='filter-select'
          value={selectedGroupId}
          title={selectedGroupName}
          onChange={e => {
            const value = e.target.value === '전체' ? '전체' : Number(e.target.value);
            onGroupChange(value);
          }}
          disabled={loading.groups || selectedGukId === '전체'}
        >
          {loading.groups ? (
            <option value='전체'>로딩 중...</option>
          ) : availableGroups.length === 0 ? (
            <option value='전체'>그룹이 없습니다</option>
          ) : (
            availableGroups.map(group => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))
          )}
        </select>
        {error.groups && <div className='error-message'>⚠️ {error.groups}</div>}
      </div>
    </div>
  );
};

export default DashboardFilter;
