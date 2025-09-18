import React, { useCallback, useRef } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderProps, CascaderOption } from './types';
import CascaderPanel from './CascaderPanel';
import Selector from '../Select/Selector';
import { useSelectState } from '../Select/hooks';
import { useCascader } from './hooks';
import './index.less';

const prefixCls = 'fluentui-plus-cascader';

const Cascader: React.FC<CascaderProps> = ({
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
  expandTrigger = 'click',
  changeOnSelect = false,
  onChange,
  onSearch,
  optionRender,
  popupRender,
  onClear,
  allowClear = false,
}) => {
  // 使用下拉状态管理（复用 Select 的）
  const stateManager = useSelectState({ open });

  // 使用 Cascader 核心逻辑
  const cascaderState = useCascader({
    value,
    defaultValue,
    multiple,
    showSearch,
    options,
    expandTrigger,
    changeOnSelect,
    onChange,
    onSearch,
  });

  // 引用相关元素
  const selectorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 当前展开状态
  const currentOpen = disabled ? false : stateManager.isOpen;

  // 处理选择器点击
  const handleSelectorClick = useCallback(() => {
    if (disabled) return;

    if (open === undefined) {
      stateManager.toggleOpen();
    }

    // 搜索模式下异步聚焦输入框
    if (showSearch) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [disabled, open, showSearch, stateManager]);

  // 处理面板关闭
  const handleClose = useCallback(() => {
    if (disabled) return;
    stateManager.closeDropdown();
  }, [disabled, stateManager]);

  // 处理路径变化
  const handlePathChange = useCallback(
    (path: CascaderOption[]) => {
      cascaderState.handlePathChange(path, false);
    },
    [cascaderState]
  );

  // 处理最终选择
  const handleFinalSelect = useCallback(
    (option: CascaderOption, path: CascaderOption[]) => {
      cascaderState.handleFinalSelect(option, path);

      // 单选模式选中后关闭下拉框
      if (!multiple) {
        stateManager.closeDropdown();
      }
    },
    [cascaderState, multiple, stateManager]
  );

  // 处理搜索输入变化
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      cascaderState.handleSearchChange(e.target.value);
    },
    [cascaderState]
  );

  // 处理搜索聚焦
  const handleSearchFocus = useCallback(() => {
    // 可以在此处添加聚焦逻辑
  }, []);

  // 处理搜索失焦
  const handleSearchBlur = useCallback(() => {
    // 可以在此处添加失焦逻辑
  }, []);

  // 处理清除按钮点击
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      cascaderState.handleClear();
      onClear?.();
    },
    [cascaderState, onClear]
  );

  // 判断是否显示清除按钮
  const showClear = allowClear && !disabled && cascaderState.selectedPath.length > 0;

  // 构建 Selector 的 props
  const selectorProps = {
    // 确保当没有选中值时，value 为 undefined 以正确显示 placeholder
    value: cascaderState.currentValue && cascaderState.currentValue.length > 0 ? cascaderState.currentValue : undefined,
    placeholder,
    disabled,
    selectedOptions: cascaderState.selectedPath,
    onClick: handleSelectorClick,
    multiple,
    showSearch,
    searchValue: cascaderState.searchValue,
    onSearchChange: handleSearchChange,
    onSearchFocus: handleSearchFocus,
    onSearchBlur: handleSearchBlur,
    onClear: handleClear,
    showClear,
    inputRef: showSearch ? inputRef : undefined,
    isOpen: currentOpen,
    prefixCls,
  };

  // 自定义 labelRender 函数：确保显示 Cascader 的完整路径文本
  const labelRender = useCallback(() => {
    return cascaderState.displayText || '';
  }, [cascaderState.displayText]);

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
          {...selectorProps}
          // 重写显示文本逻辑：使用 labelRender 确保显示 Cascader 生成的完整路径文本
          labelRender={labelRender}
        />
      </div>

      <CascaderPanel
        isOpen={currentOpen}
        triggerRef={selectorRef}
        onClose={handleClose}
        options={options}
        value={cascaderState.currentValue}
        selectedPath={cascaderState.activePath}
        listHeight={listHeight}
        multiple={multiple}
        onPathChange={handlePathChange}
        onFinalSelect={handleFinalSelect}
        optionRender={optionRender}
        popupRender={popupRender}
        expandTrigger={expandTrigger}
        changeOnSelect={changeOnSelect}
        showSearch={showSearch}
        searchValue={cascaderState.searchValue}
        searchResults={cascaderState.searchResults}
        onSearch={cascaderState.handleSearchChange}
        prefixCls={prefixCls}
      />
    </div>
  );
};

export default Cascader;
export type { CascaderProps } from './types';
