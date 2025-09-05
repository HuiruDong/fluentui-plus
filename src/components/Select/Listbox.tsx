import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { ListboxProps } from './types';
import OptionItem from './OptionItem';
import OptionGroup from './OptionGroup';
import { useFloatingPosition, useOptionSelection } from './hooks';
import { isOptionGroup } from './utils';

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
  const { floatingRef, floatingStyles, getFloatingProps } = useFloatingPosition({
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
        options.map((item, index) => {
          if (isOptionGroup(item)) {
            // 渲染分组
            const selectedValues = Array.isArray(value) ? value : value !== undefined ? [value] : [];
            return (
              <OptionGroup
                key={`group-${item.label}-${index}`}
                group={item}
                multiple={multiple}
                selectedValues={selectedValues}
                onOptionClick={onOptionClick}
                optionRender={optionRender}
                prefixCls={prefixCls}
              />
            );
          } else {
            // 渲染普通选项
            return (
              <OptionItem
                key={item.value !== undefined ? item.value : `option-${index}`}
                option={item}
                index={index}
                isSelected={isOptionSelected(item)}
                multiple={multiple}
                onOptionClick={onOptionClick}
                optionRender={optionRender}
                prefixCls={prefixCls}
              />
            );
          }
        })
      )}
    </div>
  );

  return (
    <div
      ref={floatingRef}
      className={mergeClasses(`${prefixCls}__popover-surface`)}
      style={{
        ...floatingStyles,
        zIndex: 1000,
        visibility: 'visible',
      }}
      {...getFloatingProps()}
    >
      {popupRender ? popupRender(optionsNode) : optionsNode}
    </div>
  );
};

export default Listbox;
