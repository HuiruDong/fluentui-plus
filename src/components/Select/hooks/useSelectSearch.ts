import { useMemo } from 'react';
import { useInputValue } from '../../../hooks';
import type { Option } from '../types';

interface UseSelectSearchProps {
  showSearch?: boolean;
  options?: Option[];
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

  // 默认过滤逻辑
  const defaultFilterOption = (input: string, option: Option): boolean => {
    if (!input.trim()) return true;

    const searchText = input.toLowerCase();
    const label = (option.label || '').toLowerCase();
    const value = String(option.value || '').toLowerCase();

    return label.includes(searchText) || value.includes(searchText);
  };

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!showSearch || !inputManager.inputValue.trim()) {
      return options;
    }

    const filterFn = filterOption || defaultFilterOption;
    return options.filter(option => filterFn(inputManager.inputValue, option));
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
