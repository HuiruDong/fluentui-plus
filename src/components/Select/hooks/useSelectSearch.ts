import { useMemo } from 'react';
import { useInputValue } from '../../../hooks';
import type { Option, GroupedOption } from '../types';
import { filterGroupedOptions } from '../utils';

interface UseSelectSearchProps {
  showSearch?: boolean;
  options?: GroupedOption[];
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;
}

/**
 * 搜索功能Hook
 * 职责：管理搜索输入状态、防抖处理、选项过滤
 */
export const useSelectSearch = ({ showSearch = false, options = [], onSearch, filterOption }: UseSelectSearchProps) => {
  // 搜索功能：使用 useInputValue（提取自原useSelect）
  const inputManager = useInputValue({
    initialValue: '',
    onInputChange: (searchValue: string) => {
      onSearch?.(searchValue);
    },
  });

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!showSearch) {
      return options;
    }

    return filterGroupedOptions(options, inputManager.inputValue, filterOption);
  }, [options, inputManager.inputValue, filterOption, showSearch]);

  return {
    // 输入管理
    inputManager,

    // 过滤后的选项
    filteredOptions,

    // 搜索状态
    hasSearchValue: Boolean(inputManager.inputValue.trim()),
  };
};
