import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { ListboxProps } from './types';
import OptionItem from './OptionItem';
import { useFloatingPosition, useOptionSelection } from './hooks';

const Listbox: React.FC<ListboxProps> = ({
  isOpen,
  triggerRef,
  onClose,
  options = [],
  value,
  listHeight = 256,
  multiple = false,
  onOptionClick,
  optionRender,
  popupRender,
  prefixCls,
}) => {
  // 使用浮动定位 hook
  const { floatingRef } = useFloatingPosition({
    isOpen,
    triggerRef,
    onClickOutside: onClose,
  });

  // 使用选项选择 hook
  const { isOptionSelected } = useOptionSelection({
    value,
    multiple,
  });

  if (!isOpen) {
    return null;
  }

  // 原始选项列表节点
  const optionsNode = (
    <div className={mergeClasses(`${prefixCls}__listbox`)} style={{ maxHeight: listHeight }}>
      {options.length === 0 ? (
        <div className={mergeClasses(`${prefixCls}__option`, `${prefixCls}__option--empty`)}>暂无数据</div>
      ) : (
        options.map((option, index) => (
          <OptionItem
            key={option.value !== undefined ? option.value : index}
            option={option}
            index={index}
            isSelected={isOptionSelected(option)}
            multiple={multiple}
            onOptionClick={onOptionClick}
            optionRender={optionRender}
            prefixCls={prefixCls}
          />
        ))
      )}
    </div>
  );

  return (
    <div
      ref={floatingRef}
      className={mergeClasses(`${prefixCls}__popover-surface`)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
        visibility: 'visible',
      }}
    >
      {popupRender ? popupRender(optionsNode) : optionsNode}
    </div>
  );
};

export default Listbox;
