import type { Option } from '../types';

/**
 * 默认的选项过滤函数
 * @param input 搜索关键词
 * @param option 选项对象
 * @returns 是否匹配
 */
export const defaultFilterOption = (input: string, option: Option): boolean => {
  if (!input.trim()) return true;

  const searchText = input.toLowerCase();
  const label = (option.label || '').toLowerCase();
  const value = String(option.value || '').toLowerCase();

  return label.includes(searchText) || value.includes(searchText);
};

/**
 * 过滤选项列表
 * @param options 选项列表
 * @param searchValue 搜索关键词
 * @param filterOption 自定义过滤函数
 * @returns 过滤后的选项列表
 */
export const filterOptions = (
  options: Option[],
  searchValue: string,
  filterOption?: (input: string, option: Option) => boolean
): Option[] => {
  if (!searchValue.trim()) return options;

  const filterFn = filterOption || defaultFilterOption;
  return options.filter(option => filterFn(searchValue, option));
};
