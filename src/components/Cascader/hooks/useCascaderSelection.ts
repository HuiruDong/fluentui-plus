import React, { useCallback, useMemo } from 'react';
import _ from 'lodash';
import type { CascaderOption, CascaderValue } from '../types';
import { getValueFromPath, generateDisplayText } from '../utils';

/**
 * Cascader 选择逻辑 Hook
 * 职责：处理单选模式的选择行为，包括路径变化、最终选择等
 */
export interface UseCascaderSelectionProps {
  selectedPath: CascaderOption[];
  setSelectedPath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  activePath: CascaderOption[];
  setActivePath: React.Dispatch<React.SetStateAction<CascaderOption[]>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  currentValue: CascaderValue | undefined;
  multiple?: boolean;
  changeOnSelect?: boolean;
  showSearch?: boolean;
  options?: CascaderOption[];
  onChange?: (value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void;
}

export interface UseCascaderSelectionReturn {
  // 当前选中的选项路径
  currentSelectedPath: CascaderOption[];

  // 显示文本
  displayText: string;

  // 事件处理
  handlePathChange: (newPath: CascaderOption[], isLeafNode?: boolean) => void;
  handleFinalSelect: (option: CascaderOption, path: CascaderOption[]) => void;

  // 状态检查
  isValueSelected: (targetValue: CascaderValue) => boolean;
  isPathSelected: (path: CascaderOption[]) => boolean;
  isPathActive: (path: CascaderOption[], level: number) => boolean;
}

export const useCascaderSelection = ({
  selectedPath,
  setSelectedPath,
  activePath,
  setActivePath,
  setSearchValue,
  currentValue,
  multiple = false,
  changeOnSelect = false,
  showSearch = false,
  onChange,
}: UseCascaderSelectionProps): UseCascaderSelectionReturn => {
  // 当前选中的选项路径
  const currentSelectedPath = useMemo((): CascaderOption[] => {
    if (multiple) {
      // 多选模式在其他模块处理
      return [];
    } else {
      // 单选模式
      return selectedPath;
    }
  }, [selectedPath, multiple]);

  // 显示文本（仅处理单选模式）
  const displayText = useMemo((): string => {
    if (multiple) {
      // 多选模式在其他模块处理
      return '';
    } else {
      // 单选模式：显示完整路径
      if (currentSelectedPath.length === 0) {
        return '';
      }
      return generateDisplayText(currentSelectedPath);
    }
  }, [multiple, currentSelectedPath]);

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
    [multiple, changeOnSelect, onChange, setActivePath, setSelectedPath]
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
    [multiple, onChange, showSearch, setSelectedPath, setActivePath, setSearchValue]
  );

  // 检查值是否相等（单选模式）
  const isValueSelected = useCallback(
    (targetValue: CascaderValue): boolean => {
      if (multiple) return false;
      const current = currentValue as CascaderValue | undefined;
      return _.isEqual(current, targetValue);
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

  return {
    // 当前选中的选项路径
    currentSelectedPath,

    // 显示文本
    displayText,

    // 事件处理
    handlePathChange,
    handleFinalSelect,

    // 状态检查
    isValueSelected,
    isPathSelected,
    isPathActive,
  };
};
