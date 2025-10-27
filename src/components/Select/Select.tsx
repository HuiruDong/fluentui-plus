import React, { useCallback, useRef } from 'react';
import clsx from 'clsx';
import type { SelectProps, Option } from './types';
import Selector from './Selector';
import Listbox from './Listbox';
import { useSelect } from './hooks';
import { SelectProvider } from './context';
import './index.less';

const prefixCls = 'fluentui-plus-select';

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
  onClear,
  allowClear = false,
  labelRender,
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

  // 处理清除按钮点击
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止事件冒泡，避免触发选择器点击
      selectState.handleClear();
      onClear?.();
    },
    [selectState, onClear]
  );

  // 判断是否显示清除按钮
  const showClear = allowClear && !disabled && selectedOptions.length > 0;

  // 使用重构后的过滤选项
  const displayOptions = selectState.filteredOptions;

  // 准备 Context 值
  const contextValue = {
    // 基础配置状态
    disabled,
    multiple,
    showSearch,
    prefixCls,
    placeholder,

    // 显示状态
    isOpen: currentOpen,
    showClear,

    // 数据状态
    selectedOptions,
    searchValue: selectState.inputManager.inputValue,
    value: currentValue,

    // 渲染函数
    optionRender,
    labelRender,

    // 事件处理方法
    onOptionClick: handleOptionClick,
    onSearchChange: handleSearchChange,
    onSearchFocus: handleSearchFocus,
    onSearchBlur: handleSearchBlur,
    onTagRemove: handleTagRemove,
    onClear: handleClear,
    onClick: handleSelectorClick,

    // Ref 引用
    inputRef: showSearch ? inputRef : undefined,
  };

  return (
    <SelectProvider value={contextValue}>
      <div className={clsx(prefixCls, className)} style={style}>
        <div
          ref={selectorRef}
          className={clsx(`${prefixCls}__selector`, {
            [`${prefixCls}__selector--disabled`]: disabled,
            [`${prefixCls}__selector--multiple`]: multiple,
          })}
        >
          <Selector />
        </div>

        <Listbox
          isOpen={currentOpen}
          triggerRef={selectorRef}
          onClose={handleClose}
          options={displayOptions}
          value={currentValue}
          listHeight={listHeight}
          popupRender={popupRender}
        />
      </div>
    </SelectProvider>
  );
};

export default Select;
export type { SelectProps } from './types';
