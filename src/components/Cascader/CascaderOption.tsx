import React, { useCallback } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderOptionProps } from './types';

const CascaderOption: React.FC<CascaderOptionProps> = ({
  option,
  isSelected,
  isActive,
  hasChildren: hasChildrenProp,
  onClick,
  onHover,
  optionRender,
  prefixCls,
}) => {
  const handleClick = useCallback(() => {
    if (option.disabled) return;
    onClick();
  }, [option.disabled, onClick]);

  const handleMouseEnter = useCallback(() => {
    if (option.disabled) return;
    onHover?.();
  }, [option.disabled, onHover]);

  const label = option.label || option.value?.toString() || '';

  // 渲染选项内容
  const renderContent = () => {
    if (optionRender) {
      return optionRender(option);
    }
    return label;
  };

  return (
    <div
      className={mergeClasses(
        `${prefixCls}__option`,
        (isSelected || isActive) && `${prefixCls}__option--selected`,
        // isActive && `${prefixCls}__option--active`,
        option.disabled && `${prefixCls}__option--disabled`
        // hasChildrenProp && `${prefixCls}__option--has-children`
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      title={option.title}
    >
      <span className={`${prefixCls}__option-label`}>{renderContent()}</span>
      {hasChildrenProp && (
        <span className={`${prefixCls}__option-arrow`}>
          <svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M6 4L10 8L6 12' stroke='currentColor' strokeWidth='1.5' fill='none' />
          </svg>
        </span>
      )}
    </div>
  );
};

export default CascaderOption;
