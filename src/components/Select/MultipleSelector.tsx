import React, { useMemo } from 'react';
import clsx from 'clsx';
import { ChevronDownRegular, DismissCircleFilled } from '@fluentui/react-icons';
import TagList from '../InputTag/TagList';
import SearchInput from './SearchInput';
import { useSelectContext } from './context';

const MultipleSelector: React.FC = () => {
  // 从 Context 获取所有需要的数据和方法
  const {
    selectedOptions = [],
    disabled,
    placeholder,
    showSearch,
    searchValue = '',
    onClick,
    onTagRemove,
    onClear,
    showClear = false,
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    inputRef,
    prefixCls,
    labelRender,
  } = useSelectContext();
  // 使用 useMemo 优化 tags 数组的创建
  const tags = useMemo(() => {
    // 如果有 labelRender，对每个选项单独调用 labelRender
    if (labelRender) {
      return selectedOptions.map(option => labelRender(option));
    }
    return selectedOptions.map(option => option.label || String(option.value));
  }, [selectedOptions, labelRender]);

  const hasSelectedItems = tags.length > 0;

  return (
    <div
      className={clsx(`${prefixCls}__selector-inner`, `${prefixCls}__selector-inner--multiple`)}
      onClick={onClick}
      tabIndex={showSearch ? undefined : 0}
    >
      <div className={clsx(`${prefixCls}__tags-container`)}>
        <TagList tags={tags} disabled={disabled} onTagRemove={onTagRemove} />

        {showSearch && (
          <SearchInput
            value={searchValue}
            placeholder={hasSelectedItems ? '' : placeholder || ''}
            disabled={disabled}
            inputRef={inputRef}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
        )}

        {!showSearch && !hasSelectedItems && placeholder && (
          <span className={clsx(`${prefixCls}__selector-text`, `${prefixCls}__selector-text--placeholder`)}>
            {placeholder}
          </span>
        )}
      </div>
      <div className={clsx(`${prefixCls}__selector-suffix`)}>
        {showClear && <DismissCircleFilled className={clsx(`${prefixCls}__selector-clear`)} onClick={onClear} />}
        <ChevronDownRegular className={clsx(`${prefixCls}__selector-arrow`)} />
      </div>
    </div>
  );
};

export default MultipleSelector;
