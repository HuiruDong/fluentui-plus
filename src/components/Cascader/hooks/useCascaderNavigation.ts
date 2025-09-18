import React, { useCallback } from 'react';
import type { CascaderOption, CascaderValue, CascaderMultipleValue } from '../types';

/**
 * Cascader 导航功能 Hook
 * 职责：处理路径导航逻辑，包括层级管理、选项获取等
 */
export interface UseCascaderNavigationProps {
  activePath: CascaderOption[];
  checkedKeys: Set<string | number>;
  halfCheckedKeys: Set<string | number>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  setActivePath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  setCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  setHalfCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  multiple?: boolean;
  options?: CascaderOption[];
  onChange?: (
    value: CascaderValue | CascaderMultipleValue | undefined,
    selectedOptions: CascaderOption[] | CascaderOption[][] | null
  ) => void;
}

export interface UseCascaderNavigationReturn {
  // 导航方法
  getCurrentLevelOptions: (level: number) => CascaderOption[];
  getMaxLevel: () => number;

  // 清除方法
  handleClear: () => void;
}

export const useCascaderNavigation = ({
  activePath,
  setSearchValue,
  setSelectedPath,
  setActivePath,
  setCheckedKeys,
  setHalfCheckedKeys,
  multiple = false,
  options = [],
  onChange,
}: UseCascaderNavigationProps): UseCascaderNavigationReturn => {
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
  }, [multiple, onChange, setSearchValue, setSelectedPath, setActivePath, setCheckedKeys, setHalfCheckedKeys]);

  return {
    // 导航方法
    getCurrentLevelOptions,
    getMaxLevel,

    // 清除方法
    handleClear,
  };
};
