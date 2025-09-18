import React, { useCallback, useMemo } from 'react';
import type { CascaderOption, CascaderMultipleValue, CheckedStatus } from '../types';
import {
  getValueFromPath,
  getNodeCheckedStatus,
  updateCheckedKeys,
  getHalfCheckedKeys,
  getCheckedOptions,
  getCheckedPaths,
} from '../utils';

/**
 * Cascader 多选功能 Hook
 * 职责：处理多选模式的逻辑，包括选中状态管理、多选选择等
 */
export interface UseCascaderMultipleProps {
  checkedKeys: Set<string | number>;
  setCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  halfCheckedKeys: Set<string | number>;
  setHalfCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  multiple?: boolean;
  showSearch?: boolean;
  options?: CascaderOption[];
  onChange?: (value: CascaderMultipleValue | undefined, selectedOptions: CascaderOption[][] | null) => void;
}

export interface UseCascaderMultipleReturn {
  // 当前选中的选项路径（多选模式）
  currentSelectedPath: CascaderOption[];

  // 当前值（多选模式）
  currentValue: CascaderMultipleValue;

  // 显示文本（多选模式）
  displayText: string;

  // 事件处理
  handleMultipleSelect: (option: CascaderOption, checked: boolean) => void;

  // 状态检查
  getOptionCheckedStatus: (option: CascaderOption) => CheckedStatus;
}

export const useCascaderMultiple = ({
  checkedKeys,
  setCheckedKeys,
  setHalfCheckedKeys,
  searchValue,
  setSearchValue,
  multiple = false,
  showSearch = false,
  options = [],
  onChange,
}: UseCascaderMultipleProps): UseCascaderMultipleReturn => {
  // 当前选中的选项路径（多选模式）
  const currentSelectedPath = useMemo((): CascaderOption[] => {
    if (!multiple) {
      return [];
    }
    // 多选模式：返回选中的选项
    return getCheckedOptions(options, checkedKeys);
  }, [multiple, options, checkedKeys]);

  // 当前值（多选模式）
  const currentValue = useMemo((): CascaderMultipleValue => {
    if (!multiple) {
      return [];
    }
    // 多选模式：返回所有选中路径的值数组
    const checkedPaths = getCheckedPaths(options, checkedKeys);
    return checkedPaths.map(path => getValueFromPath(path));
  }, [multiple, options, checkedKeys]);

  // 显示文本（多选模式）
  const displayText = useMemo((): string => {
    if (!multiple) {
      return '';
    }
    // 多选模式：显示选中项数量或具体项目
    const checkedOptions = getCheckedOptions(options, checkedKeys);
    if (checkedOptions.length === 0) {
      return '';
    }
    // 可以显示为 "已选择 N 项" 或具体的项目名称
    return `已选择 ${checkedOptions.length} 项`;
  }, [multiple, options, checkedKeys]);

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
    [
      multiple,
      checkedKeys,
      options,
      onChange,
      showSearch,
      searchValue,
      setCheckedKeys,
      setHalfCheckedKeys,
      setSearchValue,
    ]
  );

  // 检查节点的选中状态（多选模式）
  const getOptionCheckedStatus = useCallback(
    (option: CascaderOption): CheckedStatus => {
      if (!multiple) return 'unchecked';
      return getNodeCheckedStatus(option, checkedKeys);
    },
    [multiple, checkedKeys]
  );

  return {
    // 当前选中的选项路径（多选模式）
    currentSelectedPath,

    // 当前值（多选模式）
    currentValue,

    // 显示文本（多选模式）
    displayText,

    // 事件处理
    handleMultipleSelect,

    // 状态检查
    getOptionCheckedStatus,
  };
};
