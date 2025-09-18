import React, { useState, useEffect, useMemo } from 'react';
import type { CascaderOption, CascaderValue, CascaderMultipleValue } from '../types';
import { findPathByValue, getValueFromPath, getHalfCheckedKeys, getCheckedPaths } from '../utils';

/**
 * Cascader 状态管理 Hook
 * 职责：管理基础状态（selectedPath、activePath、checkedKeys等）和初始化逻辑
 */
export interface UseCascaderStateProps {
  value?: CascaderValue | CascaderMultipleValue;
  defaultValue?: CascaderValue | CascaderMultipleValue;
  multiple?: boolean;
  showSearch?: boolean;
  options?: CascaderOption[];
}

export interface UseCascaderStateReturn {
  // 单选模式状态
  selectedPath: CascaderOption[];
  setSelectedPath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;

  // 多选模式状态
  checkedKeys: Set<string | number>;
  setCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;
  halfCheckedKeys: Set<string | number>;
  setHalfCheckedKeys: React.Dispatch<React.SetStateAction<Set<string | number>>>;

  // 导航状态
  activePath: CascaderOption[];
  setActivePath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;

  // 搜索状态
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;

  // 当前值
  currentValue: CascaderValue | CascaderMultipleValue | undefined;
}

export const useCascaderState = ({
  value,
  defaultValue,
  multiple = false,
  showSearch = false,
  options = [],
}: UseCascaderStateProps): UseCascaderStateReturn => {
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

  return {
    // 单选模式状态
    selectedPath,
    setSelectedPath,

    // 多选模式状态
    checkedKeys,
    setCheckedKeys,
    halfCheckedKeys,
    setHalfCheckedKeys,

    // 导航状态
    activePath,
    setActivePath,

    // 搜索状态
    searchValue,
    setSearchValue,
    isSearching,

    // 当前值
    currentValue,
  };
};
