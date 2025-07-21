import React from 'react';
import type { Option } from './types';
import OptionItem from './OptionItem';
import { useFloatingPosition, useOptionSelection } from './hooks';

interface ListboxProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  options?: Option[];
  value?: string | number | (string | number)[];
  listHeight?: number;
  multiple?: boolean;
  onOptionClick?: (option: Option) => void;
  optionRender?: (option: Option) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
}

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
    <div className='mm-select__listbox' style={{ maxHeight: listHeight }}>
      {options.length === 0 ? (
        <div className='mm-select__option mm-select__option--empty'>暂无数据</div>
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
          />
        ))
      )}
    </div>
  );

  return (
    <div
      ref={floatingRef}
      className='mm-select__popover-surface'
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
