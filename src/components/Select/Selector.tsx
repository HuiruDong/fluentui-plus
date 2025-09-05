import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { SelectorProps, Option } from './types';
import { ChevronDownRegular } from '@fluentui/react-icons';
import SearchInput from './SearchInput';
import TextDisplay from './TextDisplay';
import MultipleSelector from './MultipleSelector';

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
  isOpen = false,
  prefixCls,
}) => {
  // 多选模式 - 早期返回
  if (multiple) {
    return (
      <MultipleSelector
        selectedOptions={selectedOptions}
        disabled={disabled}
        placeholder={placeholder}
        showSearch={showSearch}
        searchValue={searchValue}
        onClick={onClick}
        onTagRemove={onTagRemove}
        onSearchChange={onSearchChange}
        onSearchFocus={onSearchFocus}
        onSearchBlur={onSearchBlur}
        inputRef={inputRef}
        prefixCls={prefixCls}
      />
    );
  }

  // 单选模式处理
  return renderSingleSelector({
    value,
    placeholder,
    disabled,
    selectedOptions,
    onClick,
    showSearch,
    searchValue,
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    inputRef,
    isOpen,
    prefixCls,
  });
};

// 单选模式渲染逻辑
const renderSingleSelector = ({
  value,
  placeholder,
  disabled,
  selectedOptions,
  onClick,
  showSearch,
  searchValue,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  inputRef,
  isOpen,
  prefixCls,
}: Omit<SelectorProps, 'multiple' | 'onTagRemove'>) => {
  const selectedOption = selectedOptions?.[0];

  // 显示搜索输入框模式
  if (showSearch) {
    return renderSearchableSelector({
      selectedOption,
      placeholder,
      disabled,
      onClick,
      searchValue,
      onSearchChange,
      onSearchFocus,
      onSearchBlur,
      inputRef,
      isOpen,
      prefixCls,
    });
  }

  // 普通显示模式
  const displayText = getDisplayText(selectedOption, Array.isArray(value) ? undefined : value, placeholder);

  return (
    <TextDisplay
      displayText={displayText}
      isPlaceholder={!selectedOption && (value === undefined || value === null)}
      onClick={onClick}
      selectedOption={selectedOption}
      prefixCls={prefixCls}
    />
  );
};

// 可搜索选择器渲染逻辑
const renderSearchableSelector = ({
  selectedOption,
  placeholder,
  disabled,
  onClick,
  searchValue,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  inputRef,
  isOpen,
  prefixCls,
}: {
  selectedOption?: Option;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isOpen?: boolean;
  prefixCls: string;
}) => {
  const inputActivated = isOpen || searchValue !== '';

  // 输入框激活状态 - 显示搜索输入框
  if (inputActivated) {
    const searchPlaceholder = selectedOption ? selectedOption.label || String(selectedOption.value) : placeholder || '';

    return (
      <div className={mergeClasses(`${prefixCls}__selector-inner`)} onClick={onClick}>
        <SearchInput
          value={searchValue || ''}
          placeholder={searchPlaceholder}
          disabled={disabled}
          inputRef={inputRef}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
        />
        <ChevronDownRegular className={mergeClasses(`${prefixCls}__selector-arrow`)} />
      </div>
    );
  }

  // 输入框未激活状态 - 显示文本
  const displayText = getDisplayText(selectedOption, undefined, placeholder);

  return (
    <TextDisplay
      displayText={displayText}
      isPlaceholder={!selectedOption || selectedOption.value === undefined || selectedOption.value === null}
      onClick={onClick}
      selectedOption={selectedOption}
      prefixCls={prefixCls}
    />
  );
};

// 获取显示文本的工具函数
const getDisplayText = (selectedOption?: Option, value?: string | number | null, placeholder?: string): string => {
  if (selectedOption?.label) {
    return selectedOption.label;
  }

  if (selectedOption?.value !== undefined && selectedOption?.value !== null) {
    return String(selectedOption.value);
  }

  if (value !== undefined && value !== null) {
    return String(value);
  }

  return placeholder || '';
};

export default Selector;
