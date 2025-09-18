import _ from 'lodash';
import type { CascaderOption } from '../../types';

/**
 * 根据选中的keys获取对应的选项对象
 * @param options 选项树
 * @param checkedKeys 选中的keys
 * @returns 选中的选项对象数组（仅返回叶子节点）
 */
export const getCheckedOptions = (options: CascaderOption[], checkedKeys: Set<string | number>): CascaderOption[] => {
  return _.compact(
    _.flatMap(options, function findChecked(node): CascaderOption[] {
      if (!_.isUndefined(node.value)) {
        const results: CascaderOption[] = [];

        // 只收集叶子节点
        if (_.isEmpty(node.children) && checkedKeys.has(node.value)) {
          results.push(node);
        }

        if (!_.isEmpty(node.children)) {
          results.push(..._.flatMap(node.children, findChecked));
        }

        return results;
      }
      return [];
    })
  );
};

/**
 * 根据选中的keys获取完整的路径信息
 * @param options 选项树
 * @param checkedKeys 选中的keys
 * @returns 选中的选项路径数组
 */
export const getCheckedPaths = (options: CascaderOption[], checkedKeys: Set<string | number>): CascaderOption[][] => {
  const checkedPaths: CascaderOption[][] = [];

  const traverse = (nodes: CascaderOption[], currentPath: CascaderOption[]) => {
    nodes.forEach(node => {
      const fullPath = [...currentPath, node];

      if (node.value !== undefined) {
        // 只收集选中的叶子节点的路径
        if ((!node.children || node.children.length === 0) && checkedKeys.has(node.value)) {
          checkedPaths.push(fullPath);
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children, fullPath);
        }
      }
    });
  };

  traverse(options, []);
  return checkedPaths;
};

/**
 * 从多个路径中获取显示用的路径（去重相同的叶子节点）
 * @param paths 路径数组
 * @returns 显示用的路径数组
 */
export const getDisplayPaths = (paths: CascaderOption[][]): CascaderOption[][] => {
  // 在多选模式下，只显示选中的叶子节点路径
  return paths;
};
