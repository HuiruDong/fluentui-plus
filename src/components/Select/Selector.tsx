import React, { useRef } from 'react';
import type { Option } from './types';
import { ChevronDownRegular } from '@fluentui/react-icons';
import TagList from '../InputTag/TagList';
import Input from '../InputTag/Input';

interface SelectorProps {
  // 基础属性
  value?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  selectedOptions?: Option[];
  onClick?: () => void;

  // 模式控制
  multiple?: boolean;
  showSearch?: boolean;

  // 搜索相关
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isOpen?: boolean; // 新增：下拉框是否打开

  // 多选标签处理
  onTagRemove?: (tag: string, index: number) => void;
}

const Selector: React.FC<SelectorProps> = ({
  value,
  placeholder,
  disabled,
  selectedOptions = [],
  onClick,
  multiple = false,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  inputRef,
  onTagRemove,
  isOpen = false, // 新增参数，默认为false
}) => {
  const localInputRef = useRef<HTMLInputElement>(null);

  // 多选模式
  if (multiple) {
    const tags = selectedOptions.map(option => option.label || String(option.value));
    const hasSelectedItems = tags.length > 0;

    return (
      <div className='mm-select__selector-inner mm-select__selector-inner--multiple' onClick={onClick}>
        <div className='mm-select__tags-container'>
          <TagList tags={tags} disabled={disabled} onTagRemove={onTagRemove} />

          {/* 搜索模式：通过 Input 组件显示 placeholder */}
          {showSearch && (
            <Input
              inputRef={inputRef || localInputRef}
              value={searchValue}
              placeholder={hasSelectedItems ? '' : placeholder}
              disabled={disabled}
              onChange={onSearchChange || (() => {})}
              onFocus={onSearchFocus || (() => {})}
              onBlur={onSearchBlur || (() => {})}
              onPaste={() => {}} // 必需属性，空实现
              onKeyDown={() => {}} // Input 组件必需属性，Select 组件不处理键盘事件
              style={{ margin: 0 }} // 自定义样式：移除 margin
            />
          )}

          {/* 非搜索模式：当没有选中项时显示 placeholder */}
          {!showSearch && !hasSelectedItems && placeholder && (
            <span className='mm-select__selector-text mm-select__selector-text--placeholder'>{placeholder}</span>
          )}
        </div>
        <ChevronDownRegular className='mm-select__selector-arrow' />
      </div>
    );
  }

  // 单选模式
  const selectedOption = selectedOptions[0];

  // 单选 + 搜索模式
  if (showSearch) {
    // 判断是否激活了input：下拉框打开 或 有搜索内容
    const inputActivated = isOpen || searchValue !== '';

    if (inputActivated) {
      // 激活了input：用placeholder显示选中文本
      const searchPlaceholder = selectedOption ? selectedOption.label || String(selectedOption.value) : placeholder;

      return (
        <div className='mm-select__selector-inner' onClick={onClick}>
          <Input
            inputRef={inputRef || localInputRef}
            value={searchValue}
            placeholder={searchPlaceholder}
            disabled={disabled}
            onChange={onSearchChange || (() => {})}
            onFocus={onSearchFocus || (() => {})}
            onBlur={onSearchBlur || (() => {})}
            onPaste={() => {}} // 必需属性，空实现
            onKeyDown={() => {}} // Input 组件必需属性，Select 组件不处理键盘事件
            style={{ margin: 0 }} // 自定义样式：移除 margin
          />
          <ChevronDownRegular className='mm-select__selector-arrow' />
        </div>
      );
    } else {
      // 没有激活input：使用基础模式的逻辑，用span显示截断的选中文本
      const displayText =
        selectedOption?.label ||
        (selectedOption?.value !== undefined ? String(selectedOption.value) : '') ||
        placeholder ||
        '';

      return (
        <div className='mm-select__selector-inner' onClick={onClick} title={selectedOption?.title}>
          <span
            className={`mm-select__selector-text ${!selectedOption ? 'mm-select__selector-text--placeholder' : ''}`}
          >
            {displayText}
          </span>
          <ChevronDownRegular className='mm-select__selector-arrow' />
        </div>
      );
    }
  }

  // 单选模式（原有实现）
  const displayText = selectedOption?.label || (value !== undefined ? String(value) : '') || placeholder || '';

  return (
    <div className='mm-select__selector-inner' onClick={onClick} title={selectedOption?.title}>
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
