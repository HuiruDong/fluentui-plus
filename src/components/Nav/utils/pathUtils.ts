import { NavItemType } from '../types';
import { findParentKeys } from './nodeSearch';

/**
 * 生成keyPath，包含当前key及其所有父节点的key
 * @param items 菜单项数组
 * @param targetKey 目标key
 * @returns keyPath数组，从当前key到根节点
 */
export const generateKeyPath = (items: NavItemType[], targetKey: string): string[] => {
  const parentKeys = findParentKeys(items, targetKey);
  // 反转顺序，使其从直接父级到根级
  return [targetKey, ...parentKeys.reverse()];
};
