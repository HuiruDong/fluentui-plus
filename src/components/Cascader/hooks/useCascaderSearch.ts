import React, { useCallback, useMemo } from 'react';
import type { CascaderOption, CascaderValue, CascaderSearchResult } from '../types';
import { filterCascaderOptions } from '../utils';

/**
 * Cascader 搜索功能 Hook
 * 职责：处理搜索相关逻辑，包括搜索状态管理、搜索结果处理等
 */
export interface UseCascaderSearchProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  selectedPath: CascaderOption[];
  setSelectedPath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  activePath: CascaderOption[];
  setActivePath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  checkedKeys: Set<string | number>;
  multiple?: boolean;
  showSearch?: boolean;
  changeOnSelect?: boolean;
  options?: CascaderOption[];
  onSearch?: (value: string) => void;
  onChange?: (value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void;
  handleMultipleSelect?: (option: CascaderOption, checked: boolean) => void;
}

export interface UseCascaderSearchReturn {
  // 搜索结果
  searchResults: CascaderSearchResult[];

  // 事件处理
  handleSearchChange: (searchText: string) => void;
  handleSearchSelect: (searchResult: { path: CascaderOption[]; value: CascaderValue }) => void;
}

export const useCascaderSearch = ({
  searchValue,
  setSearchValue,
  setSelectedPath,
  setActivePath,
  checkedKeys,
  multiple = false,
  showSearch = false,
  changeOnSelect = false,
  options = [],
  onSearch,
  onChange,
  handleMultipleSelect,
}: UseCascaderSearchProps): UseCascaderSearchReturn => {
  // 是否处于搜索模式
  const isSearching = showSearch && searchValue.trim().length > 0;

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!isSearching) {
      return [];
    }
    return filterCascaderOptions(options, searchValue, changeOnSelect);
  }, [isSearching, options, searchValue, changeOnSelect]);

  // 处理搜索输入
  const handleSearchChange = useCallback(
    (searchText: string) => {
      setSearchValue(searchText);
      onSearch?.(searchText);
    },
    [onSearch, setSearchValue]
  );

  // 处理搜索结果选择
  const handleSearchSelect = useCallback(
    (searchResult: { path: CascaderOption[]; value: CascaderValue }) => {
      if (multiple) {
        // 多选模式：切换选中状态
        const leafOption = searchResult.path[searchResult.path.length - 1];
        if (leafOption?.value !== undefined && handleMultipleSelect) {
          const isCurrentlyChecked = checkedKeys.has(leafOption.value);
          handleMultipleSelect(leafOption, !isCurrentlyChecked);
          // 注意：handleMultipleSelect 已经会清除搜索值，这里不需要重复清除
        }
      } else {
        // 单选模式
        setSelectedPath(searchResult.path);
        setActivePath([]);
        onChange?.(searchResult.value, searchResult.path);
        // 清空搜索
        setSearchValue('');
      }
    },
    [multiple, checkedKeys, handleMultipleSelect, onChange, setSelectedPath, setActivePath, setSearchValue]
  );

  return {
    // 搜索结果
    searchResults,

    // 事件处理
    handleSearchChange,
    handleSearchSelect,
  };
};
