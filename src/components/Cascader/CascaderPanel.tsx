import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import type { CascaderPanelProps, CascaderOption as CascaderOptionType } from './types';
import CascaderColumn from './CascaderColumn';
import CascaderEmpty from './CascaderEmpty';
import { useFloatingPosition } from '@/hooks';
import { hasChildren, getChildren, getValueFromPath } from './utils';

const CascaderPanel: React.FC<CascaderPanelProps> = ({
  isOpen,
  triggerRef,
  onClose,
  options = [],
  selectedPath = [],
  listHeight = 256,
  multiple = false,
  onPathChange,
  onFinalSelect,
  onMultipleSelect,
  optionRender,
  popupRender,
  expandTrigger = 'click',
  showSearch = false,
  searchValue = '',
  searchResults = [],
  prefixCls,
  checkedKeys = new Set(),
  halfCheckedKeys = new Set(),
  emptyText = '暂无数据',
}) => {
  // 是否处于搜索模式
  const isSearching = showSearch && searchValue.trim().length > 0;

  // 计算当前展示的列数据
  const columnsData = useMemo(() => {
    if (isSearching) {
      return []; // 搜索模式下不显示列
    }

    // 如果没有根选项，直接返回空数组
    if (options.length === 0) {
      return [];
    }

    const columns: { options: CascaderOptionType[]; selectedOption?: CascaderOptionType }[] = [];

    // 第一列：根选项
    columns.push({
      options,
      selectedOption: selectedPath[0],
    });

    // 后续列：基于选择路径生成
    for (let i = 0; i < selectedPath.length; i++) {
      const currentOption = selectedPath[i];
      const children = getChildren(currentOption);

      if (children.length > 0) {
        columns.push({
          options: children,
          selectedOption: selectedPath[i + 1],
        });
      }
    }

    return columns;
  }, [options, selectedPath, isSearching]);

  // 判断是否为空状态（没有选项或搜索无结果）
  const isEmpty = columnsData.length === 0 || (isSearching && searchResults.length === 0);

  // 使用浮动定位 hook（复用 Select 的）
  const { floatingRef, floatingStyles, getFloatingProps } = useFloatingPosition({
    isOpen,
    triggerRef,
    onClickOutside: onClose,
    matchTriggerWidth: isEmpty, // 空状态时匹配触发器宽度
  });

  // 处理选项选择
  const handleOptionSelect = useCallback(
    (option: CascaderOptionType, level: number) => {
      const newPath = selectedPath.slice(0, level).concat(option);
      const isLeafNode = !hasChildren(option);

      if (multiple) {
        // 多选模式：仅用于展开面板，不直接选择
        if (!isLeafNode) {
          const newValue = getValueFromPath(newPath);
          onPathChange?.(newPath, newValue);
        }
        // 叶子节点的选择通过 checkbox 处理
      } else {
        // 单选模式：原有逻辑不变
        if (isLeafNode) {
          // 叶子节点，最终选择
          onFinalSelect?.(option, selectedPath.slice(0, level));
        } else {
          // 非叶子节点，更新路径
          const newValue = getValueFromPath(newPath);
          onPathChange?.(newPath, newValue);
        }
      }
    },
    [selectedPath, multiple, onPathChange, onFinalSelect]
  );

  // 处理多选状态变化
  const handleCheckChange = useCallback(
    (option: CascaderOptionType, checked: boolean) => {
      if (multiple && onMultipleSelect && option.value !== undefined) {
        // 直接传递选项和选中状态，让外部处理具体逻辑
        onMultipleSelect(option, checked);
      }
    },
    [multiple, onMultipleSelect]
  );

  // 处理搜索结果选择
  const handleSearchResultSelect = useCallback(
    (option: CascaderOptionType) => {
      // 从搜索结果中找到对应的完整信息
      const searchResult = searchResults.find(result => result.option.value === option.value);
      if (!searchResult) return;

      if (multiple) {
        // 多选模式：切换选中状态
        if (option.value !== undefined) {
          // 检查当前是否已选中
          const isCurrentlyChecked = checkedKeys.has(option.value);
          // 调用多选处理函数
          onMultipleSelect?.(option, !isCurrentlyChecked);
        }
      } else {
        // 单选模式：原有逻辑
        onFinalSelect?.(searchResult.option, searchResult.path.slice(0, -1));
      }
    },
    [searchResults, multiple, checkedKeys, onMultipleSelect, onFinalSelect]
  );

  // 为搜索结果创建选项渲染函数
  const createSearchOptionRender = useCallback(
    (option: CascaderOptionType) => {
      // 从搜索结果中找到对应的完整路径标签
      const searchResult = searchResults.find(result => result.option.value === option.value);
      return searchResult?.label || option.label || option.value?.toString() || '';
    },
    [searchResults]
  );

  // 将搜索结果转换为列数据格式
  const searchColumnData = useMemo(() => {
    if (!isSearching || searchResults.length === 0) {
      return null;
    }

    return {
      options: searchResults.map(result => result.option),
      selectedOption: undefined, // 搜索结果不需要选中状态
    };
  }, [isSearching, searchResults]);

  // 渲染搜索结果
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return <CascaderEmpty prefixCls={prefixCls} text={emptyText} />;
    }

    if (!searchColumnData) {
      return null;
    }

    return (
      <div className={`${prefixCls}__search-results`}>
        <CascaderColumn
          options={searchColumnData.options}
          selectedOption={searchColumnData.selectedOption}
          level={0} // 搜索结果级别为 0
          onSelect={handleSearchResultSelect}
          expandTrigger={expandTrigger}
          optionRender={createSearchOptionRender}
          prefixCls={prefixCls}
          multiple={multiple}
          checkedKeys={checkedKeys}
          halfCheckedKeys={halfCheckedKeys}
          onCheckChange={handleCheckChange}
        />
      </div>
    );
  };

  // 渲染级联列
  const renderCascaderColumns = () => {
    if (columnsData.length === 0) {
      return <CascaderEmpty prefixCls={prefixCls} text={emptyText} />;
    }

    return (
      <div className={`${prefixCls}__columns`}>
        {columnsData.map((columnData, level) => (
          <CascaderColumn
            key={level}
            options={columnData.options}
            selectedOption={columnData.selectedOption}
            level={level}
            onSelect={handleOptionSelect}
            expandTrigger={expandTrigger}
            optionRender={optionRender}
            prefixCls={prefixCls}
            multiple={multiple}
            checkedKeys={checkedKeys}
            halfCheckedKeys={halfCheckedKeys}
            onCheckChange={handleCheckChange}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  // 面板内容
  const panelContent = (
    <div className={`${prefixCls}__panel`} style={{ maxHeight: listHeight }}>
      {isSearching ? renderSearchResults() : renderCascaderColumns()}
    </div>
  );

  return (
    <div
      ref={floatingRef}
      className={clsx(`${prefixCls}__popover-surface`)}
      style={{
        ...floatingStyles,
        zIndex: 1000,
        visibility: 'visible',
      }}
      {...getFloatingProps()}
    >
      {popupRender ? popupRender(panelContent) : panelContent}
    </div>
  );
};

export default CascaderPanel;
