import { useState, useCallback, useMemo, useEffect } from 'react';
import type { CascaderOption, CascaderValue, UseCascaderProps } from '../types';
import { findPathByValue, getValueFromPath, isValueEqual, generateDisplayText, filterCascaderOptions } from '../utils';

/**
 * Cascader 核心状态管理 Hook
 * 职责：管理选择路径、值变更、搜索等核心逻辑
 */
export const useCascader = ({
  value,
  defaultValue,
  showSearch = false,
  options = [],
  expandTrigger = 'click',
  changeOnSelect = false,
  onChange,
  onSearch,
}: UseCascaderProps) => {
  // 当前选中的路径
  const [selectedPath, setSelectedPath] = useState<CascaderOption[]>([]);

  // 初始化选中路径
  useEffect(() => {
    const initialValue = value ?? defaultValue;
    if (initialValue && initialValue.length > 0) {
      const initialPath = findPathByValue(options, initialValue) || [];
      setSelectedPath(initialPath);
    }
  }, [value, defaultValue, options]);

  // 当前活跃的路径（用于展开面板）
  const [activePath, setActivePath] = useState<CascaderOption[]>([]);

  // 搜索关键词
  const [searchValue, setSearchValue] = useState<string>('');

  // 是否处于搜索模式
  const isSearching = showSearch && searchValue.trim().length > 0;

  // 当前值
  const currentValue = useMemo((): CascaderValue | undefined => {
    if (value !== undefined) {
      return value;
    }
    return selectedPath.length > 0 ? getValueFromPath(selectedPath) : undefined;
  }, [value, selectedPath]);

  // 当前选中的选项路径
  const currentSelectedPath = useMemo((): CascaderOption[] => {
    if (value !== undefined && value.length > 0) {
      return findPathByValue(options, value) || [];
    }
    return selectedPath;
  }, [value, selectedPath, options]);

  // 显示文本
  const displayText = useMemo((): string => {
    if (currentSelectedPath.length === 0) {
      return '';
    }
    return generateDisplayText(currentSelectedPath);
  }, [currentSelectedPath]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!isSearching) {
      return [];
    }
    return filterCascaderOptions(options, searchValue);
  }, [isSearching, options, searchValue]);

  // 处理路径变化
  const handlePathChange = useCallback(
    (newPath: CascaderOption[], isLeafNode: boolean = false) => {
      setActivePath(newPath);

      // 如果是叶子节点或者开启了 changeOnSelect，则触发选择
      if (isLeafNode || changeOnSelect) {
        setSelectedPath(newPath);
        const newValue = getValueFromPath(newPath);
        onChange?.(newValue, newPath);
      }
    },
    [changeOnSelect, onChange]
  );

  // 处理最终选择
  const handleFinalSelect = useCallback(
    (option: CascaderOption, path: CascaderOption[]) => {
      const finalPath = [...path, option];
      setSelectedPath(finalPath);
      setActivePath([]);

      const newValue = getValueFromPath(finalPath);
      onChange?.(newValue, finalPath);

      // 清空搜索
      if (showSearch) {
        setSearchValue('');
      }
    },
    [onChange, showSearch]
  );

  // 处理搜索结果选择
  const handleSearchSelect = useCallback(
    (searchResult: { path: CascaderOption[]; value: CascaderValue }) => {
      setSelectedPath(searchResult.path);
      setActivePath([]);

      onChange?.(searchResult.value, searchResult.path);

      // 清空搜索
      setSearchValue('');
    },
    [onChange]
  );

  // 处理搜索输入
  const handleSearchChange = useCallback(
    (searchText: string) => {
      setSearchValue(searchText);
      onSearch?.(searchText);
    },
    [onSearch]
  );

  // 处理清除
  const handleClear = useCallback(() => {
    setSelectedPath([]);
    setActivePath([]);
    setSearchValue('');
    onChange?.(undefined, null);
  }, [onChange]);

  // 检查值是否相等
  const isValueSelected = useCallback(
    (targetValue: CascaderValue): boolean => {
      return isValueEqual(currentValue, targetValue);
    },
    [currentValue]
  );

  // 检查路径是否被选中
  const isPathSelected = useCallback(
    (path: CascaderOption[]): boolean => {
      const pathValue = getValueFromPath(path);
      return isValueSelected(pathValue);
    },
    [isValueSelected]
  );

  // 检查路径是否处于活跃状态
  const isPathActive = useCallback(
    (path: CascaderOption[], level: number): boolean => {
      if (level >= activePath.length) {
        return false;
      }

      for (let i = 0; i <= level; i++) {
        if (!path[i] || !activePath[i]) {
          return false;
        }
        if (path[i].value !== activePath[i].value) {
          return false;
        }
      }

      return true;
    },
    [activePath]
  );

  // 获取当前层级的选项
  const getCurrentLevelOptions = useCallback(
    (level: number): CascaderOption[] => {
      if (level === 0) {
        return options;
      }

      if (level > activePath.length) {
        return [];
      }

      const parentOption = activePath[level - 1];
      return parentOption.children || [];
    },
    [options, activePath]
  );

  // 获取最大展开层级
  const getMaxLevel = useCallback((): number => {
    return Math.max(activePath.length, 0);
  }, [activePath.length]);

  return {
    // 状态
    selectedPath: currentSelectedPath,
    activePath,
    searchValue,
    isSearching,
    currentValue,
    displayText,
    searchResults,

    // 派生状态
    getCurrentLevelOptions,
    getMaxLevel,
    isValueSelected,
    isPathSelected,
    isPathActive,

    // 事件处理
    handlePathChange,
    handleFinalSelect,
    handleSearchSelect,
    handleSearchChange,
    handleClear,

    // 其他配置
    expandTrigger,
    changeOnSelect,
  };
};
