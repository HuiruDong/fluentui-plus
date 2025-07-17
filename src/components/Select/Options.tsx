import React from 'react';
import type { Option } from './types';
import { CheckmarkRegular } from '@fluentui/react-icons';

interface OptionsProps {
  options?: Option[];
  value?: string | number;
  listHeight?: number;
  onOptionClick?: (option: Option) => void;
  optionRender?: (option: Option) => React.ReactNode;
}

const Options: React.FC<OptionsProps> = ({ options = [], value, listHeight = 256, onOptionClick, optionRender }) => {
  const handleOptionClick = (option: Option) => {
    if (option.disabled) return;
    onOptionClick?.(option);
  };

  return (
    <div className='mm-select__dropdown' style={{ maxHeight: listHeight }}>
      {options.length === 0 ? (
        <div className='mm-select__option mm-select__option--empty'>暂无数据</div>
      ) : (
        options.map((option, index) => {
          const isSelected = option.value === value;
          const isDisabled = option.disabled;

          return (
            <div
              key={option.value !== undefined ? option.value : index}
              className={`mm-select__option  ${isDisabled ? 'mm-select__option--disabled' : ''}`}
              title={option.title ?? option.label}
              onClick={() => handleOptionClick(option)}
            >
              {optionRender ? (
                optionRender(option)
              ) : (
                <div className='mm-select__option-content'>
                  <div className='mm-select__option-checkmark'>{isSelected && <CheckmarkRegular />}</div>
                  <span className='mm-select__option-label'>{option.label || option.value}</span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Options;
