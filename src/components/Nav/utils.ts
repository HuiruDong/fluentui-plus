import { NavItemType } from './types';

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
        return newParents;
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

/**
 * 生成唯一的CSS类名
 * @param prefix 前缀
 * @param suffix 后缀
 * @returns CSS类名
 */
export const generateClassName = (prefix: string, suffix?: string): string => {
  return suffix ? `${prefix}-${suffix}` : prefix;
};

/**
 * 生成keyPath，包含当前key及其所有父节点的key
 * @param items 菜单项数组
 * @param targetKey 目标key
 * @returns keyPath数组，从当前key到根节点
 */
export const generateKeyPath = (items: NavItemType[], targetKey: string): string[] => {
  const parentKeys = findParentKeys(items, targetKey);
  return [targetKey, ...parentKeys];
};
