import _ from 'lodash';
import type { CascaderOption } from '../../types';
import { getDescendantLeafKeys } from '../core/tree';

/**
 * 更新选中状态：选中节点时同时选中所有子孙叶子节点
 * @param option 被选中的节点
 * @param checked 是否选中
 * @param currentCheckedKeys 当前选中的keys
 * @returns 更新后的选中keys
 */
export const updateCheckedKeys = (
  option: CascaderOption,
  checked: boolean,
  currentCheckedKeys: Set<string | number>
): Set<string | number> => {
  const newCheckedKeys = new Set(currentCheckedKeys);

  if (_.isUndefined(option.value)) {
    return newCheckedKeys;
  }

  // 获取该节点的所有子孙叶子节点
  const descendantLeafKeys = getDescendantLeafKeys(option);

  if (checked) {
    // 选中：添加所有子孙叶子节点
    descendantLeafKeys.forEach(key => newCheckedKeys.add(key));
  } else {
    // 取消选中：移除所有子孙叶子节点
    descendantLeafKeys.forEach(key => newCheckedKeys.delete(key));
  }

  return newCheckedKeys;
};
