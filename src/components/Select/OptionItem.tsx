import React from 'react';
import type { Option } from './types';
import { CheckmarkRegular } from '@fluentui/react-icons';
import { Checkbox } from '@fluentui/react-components';

interface OptionItemProps {
  option: Option;
  index: number;
  isSelected: boolean;
  multiple?: boolean;
  onOptionClick?: (option: Option) => void;
  optionRender?: (option: Option) => React.ReactNode;
}

const OptionItem: React.FC<OptionItemProps> = ({
  option,
  index,
  isSelected,
  multiple = false,
  onOptionClick,
  optionRender,
}) => {
  const handleClick = () => {
    if (option.disabled) return;
    onOptionClick?.(option);
  };

  const isDisabled = option.disabled;

  return (
    <div
      key={option.value !== undefined ? option.value : index}
      className={`mm-select__option ${multiple ? 'mm-select__option--multiple' : ''} ${isDisabled ? 'mm-select__option--disabled' : ''}`}
      title={option.title ?? option.label}
      onClick={handleClick}
    >
      {optionRender ? (
        optionRender(option)
      ) : (
        <div className='mm-select__option-content'>
          {multiple ? (
            <div className='mm-select__option-checkbox'>
              <Checkbox checked={isSelected} disabled={isDisabled} />
            </div>
          ) : (
            <div className='mm-select__option-checkmark'>{isSelected && <CheckmarkRegular />}</div>
          )}
          <span className='mm-select__option-label'>{option.label || option.value}</span>
        </div>
      )}
    </div>
  );
};

export default OptionItem;
