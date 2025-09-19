import React, { useCallback, useRef } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderProps, CascaderOption } from './types';
import type { Option } from '../Select/types';
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
  labelRender,
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
    // 与 Select 组件保持一致：失焦时清空搜索值
    if (showSearch) {
      cascaderState.handleSearchChange('');
    }
  }, [showSearch, cascaderState]);

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
  const showClear =
    allowClear && !disabled && (multiple ? cascaderState.checkedKeys.size > 0 : cascaderState.selectedPath.length > 0);

  // 准备给 Selector 的选项数据
  const selectorSelectedOptions = React.useMemo(() => {
    if (multiple) {
      // 多选模式：返回选中的选项
      return cascaderState.selectedPath.map(option => ({
        value: option.value,
        label: option.label || option.value?.toString() || '',
      }));
    } else {
      // 单选模式：返回选中路径的最后一个选项
      const lastOption = cascaderState.selectedPath[cascaderState.selectedPath.length - 1];
      return lastOption
        ? [
            {
              value: lastOption.value,
              label: lastOption.label || lastOption.value?.toString() || '',
            },
          ]
        : [];
    }
  }, [multiple, cascaderState.selectedPath]);

  // 处理 tag 移除（多选模式）
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      if (multiple && cascaderState.selectedPath[index]) {
        const optionToRemove = cascaderState.selectedPath[index];
        if (optionToRemove.value !== undefined) {
          cascaderState.handleMultipleSelect(optionToRemove, false);
        }
      }
    },
    [multiple, cascaderState]
  );

  // 自定义 labelRender 函数
  const selectorLabelRender = useCallback(
    (selectedOptions: Option | Option[] | null) => {
      if (multiple) {
        // 多选模式：Selector 期望 labelRender 返回字符串，但多选模式下会对每个选项单独调用
        // 这里我们需要返回单个选项的显示文本
        if (selectedOptions && !Array.isArray(selectedOptions)) {
          const cascaderOption = cascaderState.selectedPath.find(item => item.value === selectedOptions.value);
          if (cascaderOption && labelRender) {
            return labelRender(cascaderOption);
          }
          return selectedOptions.label || selectedOptions.value?.toString() || '';
        }
        return '';
      } else {
        // 单选模式：显示完整路径
        if (cascaderState.selectedPath.length > 0) {
          if (labelRender) {
            // 如果有自定义 labelRender，对最后一个选项调用
            const lastOption = cascaderState.selectedPath[cascaderState.selectedPath.length - 1];
            return labelRender(lastOption);
          }
          // 否则显示完整路径
          return cascaderState.displayText;
        }
        return '';
      }
    },
    [multiple, cascaderState.selectedPath, cascaderState.displayText, labelRender]
  );

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
          value={undefined} // 不传递 value，通过 selectedOptions 和 labelRender 控制显示
          placeholder={placeholder}
          disabled={disabled}
          selectedOptions={selectorSelectedOptions}
          onClick={handleSelectorClick}
          multiple={multiple}
          showSearch={showSearch}
          searchValue={cascaderState.searchValue}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          onSearchBlur={handleSearchBlur}
          onTagRemove={handleTagRemove}
          onClear={handleClear}
          showClear={showClear}
          inputRef={showSearch ? inputRef : undefined}
          isOpen={currentOpen}
          prefixCls={prefixCls}
          labelRender={selectorLabelRender}
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
        onMultipleSelect={(option, checked) => {
          cascaderState.handleMultipleSelect(option, checked);
        }}
        optionRender={optionRender}
        popupRender={popupRender}
        expandTrigger={expandTrigger}
        changeOnSelect={changeOnSelect}
        showSearch={showSearch}
        searchValue={cascaderState.searchValue}
        searchResults={cascaderState.searchResults}
        onSearch={cascaderState.handleSearchChange}
        prefixCls={prefixCls}
        checkedKeys={cascaderState.checkedKeys}
        halfCheckedKeys={cascaderState.halfCheckedKeys}
      />
    </div>
  );
};

export default Cascader;
export type { CascaderProps } from './types';
