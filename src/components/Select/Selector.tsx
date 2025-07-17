import React from 'react';
import type { Option } from './types';
import { ChevronDownRegular } from '@fluentui/react-icons';

interface SelectorProps {
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  selectedOption?: Option;
  onClick?: () => void;
}

const Selector: React.FC<SelectorProps> = ({ value, placeholder, disabled, selectedOption, onClick }) => {
  // 显示文本：优先显示 label，其次显示 value，最后显示占位符
  const displayText = selectedOption?.label || (value !== undefined ? String(value) : '') || placeholder || '';

  return (
    <div
      className='mm-select__selector-inner'
      onClick={onClick}
      title={selectedOption?.title}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <span
        className={`mm-select__selector-text ${!selectedOption && !value ? 'mm-select__selector-text--placeholder' : ''}`}
      >
        {displayText}
      </span>
      <ChevronDownRegular className='mm-select__selector-arrow' />
    </div>
  );
};

export default Selector;
