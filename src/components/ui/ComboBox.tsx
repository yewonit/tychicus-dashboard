import React, { useEffect, useRef, useState } from 'react';

interface ComboBoxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 검색 가능한 콤보박스 컴포넌트
 */
export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색어에 따라 옵션 필터링
  useEffect(() => {
    if (searchTerm) {
      setFilteredOptions(options.filter(opt => opt.includes(searchTerm)));
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  return (
    <div className={`comboBox-container ${className} ${disabled ? 'disabled' : ''}`} ref={containerRef}>
      <div className='comboBox-input-wrapper' onClick={handleToggle}>
        <input
          ref={inputRef}
          type='text'
          className='comboBox-input'
          value={isOpen ? searchTerm : value || ''}
          onChange={e => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            }
          }}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
            }
          }}
          placeholder={value || placeholder}
          disabled={disabled}
          readOnly={!isOpen}
        />
        <span className='comboBox-arrow'>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && !disabled && (
        <div className='comboBox-dropdown'>
          {filteredOptions.length === 0 ? (
            <div className='comboBox-no-results'>검색 결과가 없습니다</div>
          ) : (
            filteredOptions.map(option => (
              <div
                key={option}
                className={`comboBox-option ${value === option ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
