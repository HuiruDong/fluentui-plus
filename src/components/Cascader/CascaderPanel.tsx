import React, { useCallback, useMemo } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderPanelProps, CascaderOption as CascaderOptionType, CascaderSearchResult } from './types';
import CascaderColumn from './CascaderColumn';
import { useFloatingPosition } from '../Select/hooks';
import { hasChildren, getChildren, getValueFromPath } from './utils';

const CascaderPanel: React.FC<CascaderPanelProps> = ({
  isOpen,
  triggerRef,
  onClose,
  options = [],
  selectedPath = [],
  listHeight = 256,
  onPathChange,
  onFinalSelect,
  optionRender,
  popupRender,
  expandTrigger = 'click',
  showSearch = false,
  searchValue = '',
  prefixCls,
}) => {
  // 使用浮动定位 hook（复用 Select 的）
  const { floatingRef, floatingStyles, getFloatingProps } = useFloatingPosition({
    isOpen,
    triggerRef,
    onClickOutside: onClose,
    matchTriggerWidth: false,
  });

  // 是否处于搜索模式
  const isSearching = showSearch && searchValue.trim().length > 0;

  // 计算当前展示的列数据
  const columnsData = useMemo(() => {
    if (isSearching) {
      return []; // 搜索模式下不显示列
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

  // 处理选项选择
  const handleOptionSelect = useCallback(
    (option: CascaderOptionType, level: number) => {
      const newPath = selectedPath.slice(0, level).concat(option);
      const isLeafNode = !hasChildren(option);

      if (isLeafNode) {
        // 叶子节点，最终选择
        onFinalSelect?.(option, selectedPath.slice(0, level));
      } else {
        // 非叶子节点，更新路径
        const newValue = getValueFromPath(newPath);
        onPathChange?.(newPath, newValue);
      }
    },
    [selectedPath, onPathChange, onFinalSelect]
  );

  // 处理搜索结果选择
  const handleSearchResultSelect = useCallback(
    (searchResult: CascaderSearchResult) => {
      onFinalSelect?.(searchResult.option, searchResult.path.slice(0, -1));
    },
    [onFinalSelect]
  );

  // 渲染搜索结果
  const renderSearchResults = () => {
    // 这里需要从 useCascader Hook 获取搜索结果
    // 暂时返回空的搜索结果
    const searchResults: CascaderSearchResult[] = [];

    if (searchResults.length === 0) {
      return <div className={`${prefixCls}__search-empty`}>暂无数据</div>;
    }

    return (
      <div className={`${prefixCls}__search-results`}>
        {searchResults.map((result, index) => (
          <div
            key={`${result.value.join('-')}-${index}`}
            className={`${prefixCls}__search-item`}
            onClick={() => handleSearchResultSelect(result)}
          >
            {result.label}
          </div>
        ))}
      </div>
    );
  };

  // 渲染级联列
  const renderCascaderColumns = () => {
    if (columnsData.length === 0) {
      return <div className={`${prefixCls}__empty`}>暂无数据</div>;
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
      className={mergeClasses(`${prefixCls}__popover-surface`)}
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
