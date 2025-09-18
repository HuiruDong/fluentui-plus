import _ from 'lodash';
import type { CascaderOption, CascaderSearchResult } from '../../types';

/**
 * 检查选项是否有子选项
 * @param option 选项
 * @returns 是否有子选项
 */
export const hasChildren = (option: CascaderOption): boolean => {
  return Array.isArray(option.children) && option.children.length > 0;
};

/**
 * 获取选项的子选项
 * @param option 选项
 * @returns 子选项数组
 */
export const getChildren = (option: CascaderOption): CascaderOption[] => {
  return Array.isArray(option.children) ? option.children : [];
};

/**
 * 检查选项是否被禁用
 * @param option 选项
 * @returns 是否禁用
 */
export const isOptionDisabled = (option: CascaderOption): boolean => {
  return Boolean(option.disabled);
};

/**
 * 扁平化选项树，用于搜索
 * @param options 选项树
 * @param parentPath 父级路径
 * @returns 扁平化的选项列表，每个选项包含完整路径信息
 */
export const flattenOptions = (
  options: CascaderOption[],
  parentPath: CascaderOption[] = []
): CascaderSearchResult[] => {
  return _.flatMap(options, node => {
    const fullPath = [...parentPath, node];
    const value = _.compact(fullPath.map(option => option.value));
    const label = fullPath.map(option => option.label || option.value?.toString() || '').join(' / ');

    const result: CascaderSearchResult = {
      option: node,
      path: fullPath,
      value,
      label,
    };

    if (_.isArray(node.children) && node.children.length > 0) {
      return [result, ...flattenOptions(node.children, fullPath)];
    }

    return [result];
  });
};

/**
 * 获取所有叶子节点的keys
 * @param options 选项数组
 * @returns 叶子节点keys的Set
 */
export const getAllLeafKeys = (options: CascaderOption[]): Set<string | number> => {
  const allLeafValues = _.flatMap(options, function flattenLeaf(node): (string | number)[] {
    if (!_.isUndefined(node.value)) {
      if (_.isEmpty(node.children)) {
        // 叶子节点
        return [node.value];
      } else {
        // 非叶子节点，递归遍历子节点
        return _.flatMap(node.children, flattenLeaf);
      }
    }
    return [];
  });

  return new Set(allLeafValues);
};

/**
 * 获取节点的所有子孙叶子节点keys
 * @param option 节点选项
 * @returns 子孙叶子节点keys的Set
 */
export const getDescendantLeafKeys = (option: CascaderOption): Set<string | number> => {
  if (_.isEmpty(option.children)) {
    // 如果是叶子节点，返回自己的key
    return new Set(_.isUndefined(option.value) ? [] : [option.value]);
  }

  const allLeafValues = _.flatMap(option.children, function flattenLeaf(node): (string | number)[] {
    if (!_.isUndefined(node.value)) {
      if (_.isEmpty(node.children)) {
        // 叶子节点
        return [node.value];
      } else {
        // 非叶子节点，递归遍历子节点
        return _.flatMap(node.children, flattenLeaf);
      }
    }
    return [];
  });

  return new Set(allLeafValues);
};

/**
 * 获取节点的所有祖先节点keys
 * @param options 选项树
 * @param targetKey 目标节点key
 * @returns 祖先节点keys的数组（从根到直接父级）
 */
export const getAncestorKeys = (options: CascaderOption[], targetKey: string | number): (string | number)[] => {
  const ancestorKeys: (string | number)[] = [];

  const findAncestors = (nodes: CascaderOption[], currentPath: (string | number)[]): boolean => {
    for (const node of nodes) {
      if (node.value === undefined) continue;

      const newPath = [...currentPath, node.value];

      if (node.value === targetKey) {
        // 找到目标节点，但不包含自己
        ancestorKeys.push(...currentPath);
        return true;
      }

      if (node.children && node.children.length > 0) {
        if (findAncestors(node.children, newPath)) {
          return true;
        }
      }
    }

    return false;
  };

  findAncestors(options, []);
  return ancestorKeys;
};
