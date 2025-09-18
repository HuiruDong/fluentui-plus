import React, { useCallback } from 'react';
import { mergeClasses, Checkbox } from '@fluentui/react-components';
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
  multiple = false,
  checked = 'unchecked',
  onCheckChange,
}) => {
  const handleClick = useCallback(() => {
    if (option.disabled) return;

    if (multiple) {
      if (hasChildrenProp) {
        // 有子节点：点击选项区域展开子节点
        onClick();
      } else {
        // 叶子节点：点击整个选项区域表示选中
        if (onCheckChange) {
          const newChecked = checked !== 'checked';
          onCheckChange(newChecked);
        }
      }
    } else {
      // 单选模式：原有逻辑
      onClick();
    }
  }, [option.disabled, multiple, hasChildrenProp, checked, onCheckChange, onClick]);

  const handleCheckboxChange = useCallback(
    (e: React.MouseEvent) => {
      if (option.disabled) return;

      // 阻止事件冒泡，避免触发选项的点击事件
      e.stopPropagation();

      if (multiple && onCheckChange) {
        // 多选模式：切换选中状态（仅针对有子节点的选项）
        const newChecked = checked !== 'checked';
        onCheckChange(newChecked);
      }
    },
    [option.disabled, multiple, checked, onCheckChange]
  );

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

  // 多选模式下，将 CheckedStatus 转换为 Checkbox 的 checked 属性
  const checkboxChecked = multiple
    ? checked === 'checked'
      ? true
      : checked === 'indeterminate'
        ? 'mixed'
        : false
    : false;

  return (
    <div
      className={mergeClasses(
        `${prefixCls}__option`,
        (isSelected || isActive) && `${prefixCls}__option--selected`,
        option.disabled && `${prefixCls}__option--disabled`,
        multiple && `${prefixCls}__option--multiple`
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      title={option.title}
    >
      {multiple && (
        <Checkbox
          checked={checkboxChecked}
          disabled={option.disabled}
          className={`${prefixCls}__option-checkbox`}
          onClick={hasChildrenProp ? handleCheckboxChange : undefined}
        />
      )}
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
