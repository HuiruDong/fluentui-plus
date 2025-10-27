import React from 'react';
import clsx from 'clsx';
import type { Option } from './types';
import { ChevronDownRegular, DismissRegular } from '@fluentui/react-icons';
import SearchInput from './SearchInput';
import TextDisplay from './TextDisplay';
import MultipleSelector from './MultipleSelector';
import { useSelectContext } from './context';

const Selector: React.FC = () => {
  // 从 Context 获取所有需要的数据和方法
  const {
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
    onClear,
    showClear = false,
    isOpen = false,
    prefixCls,
    labelRender,
  } = useSelectContext();

  // 获取显示文本的工具函数
  const getDisplayText = (
    selectedOption?: Option,
    value?: string | number | null,
    placeholder?: string,
    labelRender?: (selectedOptions: Option | Option[] | null) => string
  ): string => {
    // 如果有自定义 labelRender，优先使用
    if (labelRender && selectedOption) {
      return labelRender(selectedOption);
    }

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

  // 可搜索选择器渲染逻辑
  const renderSearchableSelector = () => {
    const selectedOption = selectedOptions[0];
    const inputActivated = isOpen || searchValue !== '';

    // 输入框激活状态 - 显示搜索输入框
    if (inputActivated) {
      const searchPlaceholder = selectedOption
        ? labelRender
          ? labelRender(selectedOption)
          : selectedOption.label || String(selectedOption.value)
        : placeholder || '';

      return (
        <div className={clsx(`${prefixCls}__selector-inner`)} onClick={onClick}>
          <SearchInput
            value={searchValue || ''}
            placeholder={searchPlaceholder}
            disabled={disabled}
            inputRef={inputRef}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
          <div className={clsx(`${prefixCls}__selector-suffix`)}>
            {showClear && <DismissRegular className={clsx(`${prefixCls}__selector-clear`)} onClick={onClear} />}
            <ChevronDownRegular className={clsx(`${prefixCls}__selector-arrow`)} />
          </div>
        </div>
      );
    }

    // 输入框未激活状态 - 显示文本
    const displayText = getDisplayText(selectedOption, undefined, placeholder, labelRender);

    return (
      <TextDisplay
        displayText={displayText}
        isPlaceholder={!selectedOption || selectedOption.value === undefined || selectedOption.value === null}
        onClick={onClick}
        selectedOption={selectedOption}
      />
    );
  };

  // 单选模式渲染逻辑
  const renderSingleSelector = () => {
    const selectedOption = selectedOptions?.[0];

    // 显示搜索输入框模式
    if (showSearch) {
      return renderSearchableSelector();
    }

    // 普通显示模式
    const displayText = getDisplayText(
      selectedOption,
      Array.isArray(value) ? undefined : value,
      placeholder,
      labelRender
    );

    return (
      <TextDisplay
        displayText={displayText}
        isPlaceholder={!selectedOption && (value === undefined || value === null)}
        onClick={onClick}
        selectedOption={selectedOption}
      />
    );
  };

  // 多选模式 - 早期返回
  if (multiple) {
    return <MultipleSelector />;
  }

  // 单选模式处理
  return renderSingleSelector();
};

export default Selector;
