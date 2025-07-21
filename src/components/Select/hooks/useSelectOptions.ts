import { useMemo } from 'react';
import type { Option } from '../types';

interface UseSelectOptionsProps {
  options: Option[];
  searchValue?: string;
  filterOption?: (input: string, option: Option) => boolean;
  showSearch?: boolean;
}

export const useSelectOptions = ({
  options,
  searchValue = '',
  filterOption,
  showSearch = false,
}: UseSelectOptionsProps) => {
  // 默认过滤逻辑
  const defaultFilterOption = (input: string, option: Option): boolean => {
    if (!input.trim()) return true;

    const searchText = input.toLowerCase();
    const label = (option.label || '').toLowerCase();
    const value = String(option.value || '').toLowerCase();

    return label.includes(searchText) || value.includes(searchText);
  };

  // 处理选项过滤
  const processedOptions = useMemo(() => {
    if (!showSearch || !searchValue.trim()) {
      return options;
    }

    const filterFn = filterOption || defaultFilterOption;
    return options.filter(option => filterFn(searchValue, option));
  }, [options, searchValue, filterOption, showSearch]);

  // 获取可用选项（过滤禁用项）
  const availableOptions = useMemo(() => {
    return processedOptions.filter(option => !option.disabled);
  }, [processedOptions]);

  // 获取禁用选项
  const disabledOptions = useMemo(() => {
    return processedOptions.filter(option => option.disabled);
  }, [processedOptions]);

  // 检查选项是否被选中
  const isOptionSelected = (option: Option, selectedValues: (string | number)[]): boolean => {
    return option.value !== undefined && selectedValues.includes(option.value);
  };

  // 获取选项的显示文本
  const getOptionDisplayText = (option: Option): string => {
    return option.label || String(option.value || '');
  };

  // 检查是否有可用选项
  const hasAvailableOptions = availableOptions.length > 0;

  // 检查是否有搜索结果
  const hasSearchResults = processedOptions.length > 0;

  return {
    // 处理后的选项
    processedOptions,
    availableOptions,
    disabledOptions,

    // 状态检查
    hasAvailableOptions,
    hasSearchResults,

    // 工具函数
    isOptionSelected,
    getOptionDisplayText,
  };
};
