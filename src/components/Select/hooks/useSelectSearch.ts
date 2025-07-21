import { useMemo } from 'react';
import type { Option } from '../types';

interface UseSelectSearchProps {
  options: Option[];
  searchValue: string;
  filterOption?: (input: string, option: Option) => boolean;
}

export const useSelectSearch = ({ options, searchValue, filterOption }: UseSelectSearchProps) => {
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
    if (!searchValue.trim()) return options;

    const filterFn = filterOption || defaultFilterOption;
    return options.filter(option => filterFn(searchValue, option));
  }, [options, searchValue, filterOption]);

  return {
    filteredOptions,
  };
};
