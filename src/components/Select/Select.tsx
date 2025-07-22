import React, { useCallback, useRef } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { SelectProps, Option } from './types';
import Selector from './Selector';
import Listbox from './Listbox';
import { useSelect } from './hooks';
import './index.less';

const prefixCls = 'mm-select';

const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  className,
  style,
  disabled = false,
  listHeight = 256,
  open,
  options = [],
  placeholder,
  multiple = false,
  showSearch = false,
  onChange,
  onSearch,
  filterOption,
  optionRender,
  popupRender,
}) => {
  // 使用重构后的新 hook 管理状态
  const selectState = useSelect({
    value,
    defaultValue,
    multiple,
    showSearch,
    open,
    options,
    onChange,
    onSearch,
    filterOption,
  });

  // 引用相关元素
  const selectorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当前值和展开状态
  const currentValue = selectState.getCurrentValue();
  const currentOpen = disabled ? false : selectState.isOpen;
  const selectedOptions = selectState.getSelectedOptions();

  // 处理选项点击
  const handleOptionClick = useCallback(
    (option: Option) => {
      if (option.disabled) return;
      selectState.handleOptionSelect(option);

      // 多选+搜索模式下，选择选项后重新聚焦输入框
      if (multiple && showSearch) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    },
    [selectState, multiple, showSearch]
  );

  // 处理选择器点击
  const handleSelectorClick = useCallback(() => {
    if (disabled) return;

    if (open === undefined) {
      selectState.handleSelectorClick();
    }

    // 搜索模式下异步聚焦输入框
    if (showSearch) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [disabled, open, showSearch, selectState]);

  // 处理弹窗关闭
  const handleClose = useCallback(() => {
    if (disabled) return;

    selectState.closeDropdown();
    selectState.handleBlur();
  }, [disabled, selectState]);

  // 处理搜索输入变化
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      selectState.inputManager.handleInputChange(e);
    },
    [selectState.inputManager]
  );

  // 处理搜索聚焦
  const handleSearchFocus = useCallback(() => {
    selectState.inputManager.setIsFocused(true);
  }, [selectState.inputManager]);

  // 处理搜索失焦
  const handleSearchBlur = useCallback(() => {
    selectState.inputManager.setIsFocused(false);
  }, [selectState.inputManager]);

  // 处理标签删除（多选模式）
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      selectState.handleTagRemove(tag, index);
    },
    [selectState]
  );

  // 使用重构后的过滤选项
  const displayOptions = selectState.filteredOptions;

  return (
    <div className={mergeClasses(prefixCls, className)} style={style}>
      <div
        ref={selectorRef}
        className={mergeClasses(
          `${prefixCls}__selector`,
          disabled && `${prefixCls}__selector--disabled`,
          multiple && `${prefixCls}__selector--multiple`
        )}
      >
        <Selector
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          selectedOptions={selectedOptions}
          onClick={handleSelectorClick}
          multiple={multiple}
          showSearch={showSearch}
          searchValue={selectState.inputManager.inputValue}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          onSearchBlur={handleSearchBlur}
          onTagRemove={handleTagRemove}
          inputRef={showSearch ? inputRef : undefined}
          isOpen={currentOpen}
          prefixCls={prefixCls}
        />
      </div>

      <Listbox
        isOpen={currentOpen}
        triggerRef={selectorRef}
        onClose={handleClose}
        options={displayOptions}
        value={currentValue}
        listHeight={listHeight}
        multiple={multiple}
        onOptionClick={handleOptionClick}
        optionRender={optionRender}
        popupRender={popupRender}
        prefixCls={prefixCls}
      />
    </div>
  );
};

export default Select;
export type { SelectProps } from './types';
