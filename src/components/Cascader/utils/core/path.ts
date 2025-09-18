import _ from 'lodash';
import type { CascaderOption, CascaderValue } from '../../types';
import { DEFAULT_SEPARATOR } from '../shared/constants';

/**
 * 根据值在选项树中查找对应的路径
 * @param options 选项树
 * @param targetValue 目标值数组
 * @returns 找到的选项路径，如果未找到返回 null
 */
export const findPathByValue = (options: CascaderOption[], targetValue: CascaderValue): CascaderOption[] | null => {
  if (!targetValue || targetValue.length === 0) {
    return null;
  }

  const findPath = (
    nodes: CascaderOption[],
    values: CascaderValue,
    currentPath: CascaderOption[]
  ): CascaderOption[] | null => {
    if (values.length === 0) {
      return currentPath;
    }

    const [currentValue, ...restValues] = values;

    for (const node of nodes) {
      if (node.value === currentValue) {
        const newPath = [...currentPath, node];

        if (_.isEmpty(restValues)) {
          return newPath;
        }

        const children = _.get(node, 'children', []);
        const result = findPath(children, restValues, newPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return findPath(options, targetValue, []);
};

/**
 * 根据选项路径生成值数组
 * @param path 选项路径
 * @returns 值数组
 */
export const getValueFromPath = (path: CascaderOption[]): CascaderValue => {
  return _.compact(_.map(path, 'value'));
};

/**
 * 根据选项路径生成标签数组
 * @param path 选项路径
 * @returns 标签数组
 */
export const getLabelsFromPath = (path: CascaderOption[]): string[] => {
  return _.map(path, option => option.label || option.value?.toString() || '');
};

/**
 * 生成显示文本
 * @param selectedPath 选中的路径
 * @param separator 分隔符
 * @returns 显示文本
 */
export const generateDisplayText = (selectedPath: CascaderOption[], separator: string = DEFAULT_SEPARATOR): string => {
  const labels = getLabelsFromPath(selectedPath);
  return labels.join(separator);
};
