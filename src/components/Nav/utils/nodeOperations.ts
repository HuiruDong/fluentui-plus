import { NavItemType } from '../types';

/**
 * 获取所有子节点的key
 * @param item 菜单项
 * @returns 子节点key数组
 */
export const getAllChildKeys = (item: NavItemType): string[] => {
  const keys: string[] = [];
  if (item.children && item.children.length > 0) {
    for (const child of item.children) {
      keys.push(child.key);
      keys.push(...getAllChildKeys(child));
    }
  }
  return keys;
};

/**
 * 检查是否有子节点（排除分组和分割线类型）
 * @param item 菜单项
 * @returns 是否有子节点
 */
export const hasChildren = (item: NavItemType): boolean => {
  // 分组和分割线类型不应该被视为有可展开的子菜单
  if (item.type === 'group' || item.type === 'divider') {
    return false;
  }
  return Boolean(item.children && item.children.length > 0);
};
