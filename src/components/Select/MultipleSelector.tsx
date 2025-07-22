import React, { useMemo } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { ChevronDownRegular } from '@fluentui/react-icons';
import TagList from '../InputTag/TagList';
import SearchInput from './SearchInput';
import type { MultipleSelectorProps } from './types';

const MultipleSelector: React.FC<MultipleSelectorProps> = ({
  selectedOptions,
  disabled,
  placeholder,
  showSearch,
  searchValue = '',
  onClick,
  onTagRemove,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  inputRef,
  prefixCls,
}) => {
  // 使用 useMemo 优化 tags 数组的创建
  const tags = useMemo(() => {
    return selectedOptions.map(option => option.label || String(option.value));
  }, [selectedOptions]);

  const hasSelectedItems = tags.length > 0;

  return (
    <div
      className={mergeClasses(`${prefixCls}__selector-inner`, `${prefixCls}__selector-inner--multiple`)}
      onClick={onClick}
    >
      <div className={mergeClasses(`${prefixCls}__tags-container`)}>
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
          <span className={mergeClasses(`${prefixCls}__selector-text`, `${prefixCls}__selector-text--placeholder`)}>
            {placeholder}
          </span>
        )}
      </div>
      <ChevronDownRegular className={mergeClasses(`${prefixCls}__selector-arrow`)} />
    </div>
  );
};

export default MultipleSelector;
