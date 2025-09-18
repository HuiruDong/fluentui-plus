import { useState, useCallback, useMemo, useEffect } from 'react';
import type { CascaderOption, CascaderValue, CascaderMultipleValue, UseCascaderProps, CheckedStatus } from '../types';
import {
  findPathByValue,
  getValueFromPath,
  isValueEqual,
  generateDisplayText,
  filterCascaderOptions,
  getNodeCheckedStatus,
  updateCheckedKeys,
  getHalfCheckedKeys,
  getCheckedOptions,
  getCheckedPaths,
} from '../utils';

/**
 * Cascader 核心状态管理 Hook
 * 职责：管理选择路径、值变更、搜索等核心逻辑，支持单选和多选模式
 */
export const useCascader = ({
  value,
  defaultValue,
  multiple = false,
  showSearch = false,
  options = [],
  expandTrigger = 'click',
  changeOnSelect = false,
  onChange,
  onSearch,
}: UseCascaderProps) => {
  // 单选模式的状态
  const [selectedPath, setSelectedPath] = useState<CascaderOption[]>([]);

  // 多选模式的状态
  const [checkedKeys, setCheckedKeys] = useState<Set<string | number>>(new Set());
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<Set<string | number>>(new Set());

  // 当前活跃的路径（用于展开面板）
  const [activePath, setActivePath] = useState<CascaderOption[]>([]);

  // 搜索关键词
  const [searchValue, setSearchValue] = useState<string>('');

  // 是否处于搜索模式
  const isSearching = showSearch && searchValue.trim().length > 0;

  // 初始化状态
  useEffect(() => {
    if (multiple) {
      // 多选模式初始化
      const initialValue = value ?? defaultValue;
      if (initialValue && Array.isArray(initialValue) && initialValue.length > 0) {
        // 多选模式的值是二维数组
        const multipleValue = initialValue as CascaderMultipleValue;
        const keys = new Set<string | number>();

        multipleValue.forEach(singleValue => {
          if (Array.isArray(singleValue) && singleValue.length > 0) {
            // 获取路径的最后一个值（叶子节点）
            const leafValue = singleValue[singleValue.length - 1];
            if (leafValue !== undefined) {
              keys.add(leafValue);
            }
          }
        });

        setCheckedKeys(keys);
        setHalfCheckedKeys(getHalfCheckedKeys(options, keys));
      }
    } else {
      // 单选模式初始化
      const initialValue = value ?? defaultValue;
      if (initialValue && Array.isArray(initialValue) && initialValue.length > 0) {
        const singleValue = initialValue as CascaderValue;
        const initialPath = findPathByValue(options, singleValue) || [];
        setSelectedPath(initialPath);
      }
    }
  }, [value, defaultValue, multiple, options]);

  // 当前值
  const currentValue = useMemo(() => {
    if (value !== undefined) {
      return value;
    }

    if (multiple) {
      // 多选模式：返回所有选中路径的值数组
      const checkedPaths = getCheckedPaths(options, checkedKeys);
      return checkedPaths.map(path => getValueFromPath(path));
    } else {
      // 单选模式：返回选中路径的值
      return selectedPath.length > 0 ? getValueFromPath(selectedPath) : undefined;
    }
  }, [value, multiple, selectedPath, checkedKeys, options]);

  // 当前选中的选项路径
  const currentSelectedPath = useMemo((): CascaderOption[] => {
    if (multiple) {
      // 多选模式：返回选中的选项
      return getCheckedOptions(options, checkedKeys);
    } else {
      // 单选模式
      if (value !== undefined && Array.isArray(value) && value.length > 0) {
        const singleValue = value as CascaderValue;
        return findPathByValue(options, singleValue) || [];
      }
      return selectedPath;
    }
  }, [value, selectedPath, multiple, options, checkedKeys]);

  // 显示文本
  const displayText = useMemo((): string => {
    if (multiple) {
      // 多选模式：显示选中项数量或具体项目
      const checkedOptions = getCheckedOptions(options, checkedKeys);
      if (checkedOptions.length === 0) {
        return '';
      }
      // 可以显示为 "已选择 N 项" 或具体的项目名称
      return `已选择 ${checkedOptions.length} 项`;
    } else {
      // 单选模式：显示完整路径
      if (currentSelectedPath.length === 0) {
        return '';
      }
      return generateDisplayText(currentSelectedPath);
    }
  }, [multiple, currentSelectedPath, options, checkedKeys]);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!isSearching) {
      return [];
    }
    return filterCascaderOptions(options, searchValue, changeOnSelect);
  }, [isSearching, options, searchValue, changeOnSelect]);

  // 处理路径变化（主要用于单选模式）
  const handlePathChange = useCallback(
    (newPath: CascaderOption[], isLeafNode: boolean = false) => {
      setActivePath(newPath);

      if (!multiple) {
        // 单选模式：如果是叶子节点或者开启了 changeOnSelect，则触发选择
        if (isLeafNode || changeOnSelect) {
          setSelectedPath(newPath);
          const newValue = getValueFromPath(newPath);
          onChange?.(newValue, newPath);
        }
      }
    },
    [multiple, changeOnSelect, onChange]
  );

  // 处理最终选择（主要用于单选模式）
  const handleFinalSelect = useCallback(
    (option: CascaderOption, path: CascaderOption[]) => {
      if (!multiple) {
        const finalPath = [...path, option];
        setSelectedPath(finalPath);
        setActivePath([]);

        const newValue = getValueFromPath(finalPath);
        onChange?.(newValue, finalPath);

        // 清空搜索
        if (showSearch) {
          setSearchValue('');
        }
      }
    },
    [multiple, onChange, showSearch]
  );

  // 处理多选状态变化
  const handleMultipleSelect = useCallback(
    (option: CascaderOption, checked: boolean) => {
      if (!multiple) return;

      const newCheckedKeys = updateCheckedKeys(option, checked, checkedKeys);
      const newHalfCheckedKeys = getHalfCheckedKeys(options, newCheckedKeys);

      setCheckedKeys(newCheckedKeys);
      setHalfCheckedKeys(newHalfCheckedKeys);

      // 获取选中的路径
      const checkedPaths = getCheckedPaths(options, newCheckedKeys);
      const multipleValue = checkedPaths.map(path => getValueFromPath(path));

      onChange?.(multipleValue, checkedPaths);

      // 在搜索模式下，选择项目后清空搜索
      if (showSearch && searchValue) {
        setSearchValue('');
      }
    },
    [multiple, checkedKeys, options, onChange, showSearch, searchValue]
  );

  // 处理搜索结果选择
  const handleSearchSelect = useCallback(
    (searchResult: { path: CascaderOption[]; value: CascaderValue }) => {
      if (multiple) {
        // 多选模式：切换选中状态
        const leafOption = searchResult.path[searchResult.path.length - 1];
        if (leafOption?.value !== undefined) {
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
    [multiple, checkedKeys, handleMultipleSelect, onChange]
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
    if (multiple) {
      setCheckedKeys(new Set());
      setHalfCheckedKeys(new Set());
      onChange?.([], []);
    } else {
      setSelectedPath([]);
      setActivePath([]);
      onChange?.(undefined, null);
    }
    setSearchValue('');
  }, [multiple, onChange]);

  // 检查节点的选中状态（多选模式）
  const getOptionCheckedStatus = useCallback(
    (option: CascaderOption): CheckedStatus => {
      if (!multiple) return 'unchecked';
      return getNodeCheckedStatus(option, checkedKeys);
    },
    [multiple, checkedKeys]
  );

  // 检查值是否相等（单选模式）
  const isValueSelected = useCallback(
    (targetValue: CascaderValue): boolean => {
      if (multiple) return false;
      const current = currentValue as CascaderValue | undefined;
      return isValueEqual(current, targetValue);
    },
    [multiple, currentValue]
  );

  // 检查路径是否被选中（单选模式）
  const isPathSelected = useCallback(
    (path: CascaderOption[]): boolean => {
      if (multiple) return false;
      const pathValue = getValueFromPath(path);
      return isValueSelected(pathValue);
    },
    [multiple, isValueSelected]
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

    // 多选状态
    checkedKeys,
    halfCheckedKeys,

    // 派生状态
    getCurrentLevelOptions,
    getMaxLevel,
    isValueSelected,
    isPathSelected,
    isPathActive,
    getOptionCheckedStatus,

    // 事件处理
    handlePathChange,
    handleFinalSelect,
    handleMultipleSelect,
    handleSearchSelect,
    handleSearchChange,
    handleClear,

    // 其他配置
    expandTrigger,
    changeOnSelect,
    multiple,
  };
};
