import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { OptionItemProps } from './types';
import { CheckmarkRegular } from '@fluentui/react-icons';
import { Checkbox } from '@fluentui/react-components';

const OptionItem: React.FC<OptionItemProps> = ({
  option,
  index,
  isSelected,
  multiple = false,
  onOptionClick,
  optionRender,
  prefixCls,
}) => {
  const handleClick = () => {
    if (option.disabled) return;
    onOptionClick?.(option);
  };

  const isDisabled = option.disabled;

  return (
    <div
      key={option.value !== undefined ? option.value : index}
      className={mergeClasses(
        `${prefixCls}__option`,
        multiple && `${prefixCls}__option--multiple`,
        isDisabled && `${prefixCls}__option--disabled`
      )}
      title={option.title ?? option.label}
      onClick={handleClick}
    >
      {optionRender ? (
        optionRender(option)
      ) : (
        <div className={mergeClasses(`${prefixCls}__option-content`)}>
          {multiple ? (
            <div className={mergeClasses(`${prefixCls}__option-checkbox`)}>
              <Checkbox checked={isSelected} disabled={isDisabled} />
            </div>
          ) : (
            <div className={mergeClasses(`${prefixCls}__option-checkmark`)}>{isSelected && <CheckmarkRegular />}</div>
          )}
          <span className={mergeClasses(`${prefixCls}__option-label`)}>{option.label || option.value}</span>
        </div>
      )}
    </div>
  );
};

export default OptionItem;
