import _ from 'lodash';
import type { CascaderOption, CascaderSearchResult } from '../../types';
import { flattenOptions, hasChildren } from './tree';
import { getLabelsFromPath } from './path';

/**
 * 默认过滤函数：检查路径中是否包含搜索关键词
 * @param input 搜索关键词
 * @param path 选项路径
 * @returns 是否匹配
 */
export const defaultFilterOption = (input: string, path: CascaderOption[]): boolean => {
  if (!input) return true;

  const searchText = input.toLowerCase();
  const labels = getLabelsFromPath(path);

  // 检查是否有任何标签包含搜索关键词
  return _.some(labels, label => _.includes(label.toLowerCase(), searchText));
};

/**
 * 过滤选项，用于搜索功能
 * @param options 选项树
 * @param input 搜索关键词
 * @param changeOnSelect 是否允许选择任意一级
 * @returns 过滤后的搜索结果
 */
export const filterCascaderOptions = (
  options: CascaderOption[],
  input: string,
  changeOnSelect: boolean = false
): CascaderSearchResult[] => {
  if (!input) return [];

  const flatOptions = flattenOptions(options);
  const filteredOptions = _.filter(flatOptions, item => defaultFilterOption(input, item.path));

  // 如果 changeOnSelect 为 false，只返回叶子节点（没有子节点的选项）
  if (!changeOnSelect) {
    return _.filter(filteredOptions, item => !hasChildren(item.option));
  }

  // 如果 changeOnSelect 为 true，返回所有匹配的选项
  return filteredOptions;
};
