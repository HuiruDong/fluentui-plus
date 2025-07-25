import { NavItemType } from '../types';

/**
 * 查找所有父节点的key（排除分组类型）
 * @param items 菜单项数组
 * @param targetKey 目标key
 * @param parents 父节点路径
 * @returns 父节点key数组
 */
export const findParentKeys = (items: NavItemType[], targetKey: string, parents: string[] = []): string[] => {
  for (const item of items) {
    if (item.key === targetKey) {
      return parents;
    }
    if (item.children && item.children.length > 0) {
      // 对于分组类型，不将自己添加到 parents 路径中
      const newParents = item.type === 'group' ? parents : [...parents, item.key];
      const result = findParentKeys(item.children, targetKey, newParents);
      if (result.length > 0 || item.children.some(child => child.key === targetKey)) {
        return result.length > 0 ? result : newParents;
      }
    }
  }
  return [];
};

/**
 * 查找菜单项
 * @param items 菜单项数组
 * @param targetKey 目标key
 * @returns 找到的菜单项
 */
export const findMenuItem = (items: NavItemType[], targetKey: string): NavItemType | null => {
  for (const item of items) {
    if (item.key === targetKey) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findMenuItem(item.children, targetKey);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
