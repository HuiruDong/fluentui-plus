import _ from 'lodash';
import type { CascaderOption, CheckedStatus } from '../../types';
import { getDescendantLeafKeys } from '../core/tree';

/**
 * 计算节点的选中状态
 * @param option 节点选项
 * @param checkedKeys 已选中的keys
 * @returns 节点的选中状态
 */
export const getNodeCheckedStatus = (option: CascaderOption, checkedKeys: Set<string | number>): CheckedStatus => {
  if (_.isUndefined(option.value)) {
    return 'unchecked';
  }

  // 如果是叶子节点
  if (_.isEmpty(option.children)) {
    return checkedKeys.has(option.value) ? 'checked' : 'unchecked';
  }

  // 如果是非叶子节点，检查子节点状态
  const descendantLeafKeys = getDescendantLeafKeys(option);
  const checkedCount = _.sumBy(Array.from(descendantLeafKeys), key => (checkedKeys.has(key) ? 1 : 0));

  if (checkedCount === 0) {
    return 'unchecked';
  } else if (checkedCount === descendantLeafKeys.size) {
    return 'checked';
  } else {
    return 'indeterminate';
  }
};

/**
 * 计算半选状态的keys
 * @param options 选项树
 * @param checkedKeys 已选中的keys
 * @returns 半选状态的keys Set
 */
export const getHalfCheckedKeys = (
  options: CascaderOption[],
  checkedKeys: Set<string | number>
): Set<string | number> => {
  const halfCheckedKeys = new Set<string | number>();

  const traverse = (nodes: CascaderOption[]) => {
    nodes.forEach(node => {
      if (node.value !== undefined && node.children && node.children.length > 0) {
        const status = getNodeCheckedStatus(node, checkedKeys);
        if (status === 'indeterminate') {
          halfCheckedKeys.add(node.value);
        }
        // 递归处理子节点
        traverse(node.children);
      }
    });
  };

  traverse(options);
  return halfCheckedKeys;
};
