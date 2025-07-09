import { useState, useCallback, useMemo } from 'react';
import { NavItemType } from '../types';
import { findParentKeys, findMenuItem, generateKeyPath } from '../utils';

export interface UseNavigationProps {
  items: NavItemType[];
  defaultSelectedKeys?: string[];
  defaultOpenKeys?: string[];
  selectedKeys?: string[];
  openKeys?: string[];
  onSelect?: (info: { key: string; keyPath: string[]; selectedKeys: string[]; item: NavItemType }) => void;
  onOpenChange?: (openKeys: string[]) => void;
}

export const useNavigation = ({
  items,
  defaultSelectedKeys = [],
  defaultOpenKeys = [],
  selectedKeys: controlledSelectedKeys,
  openKeys: controlledOpenKeys,
  onSelect,
  onOpenChange,
}: UseNavigationProps) => {
  // 内部状态
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys);
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);

  // 使用受控或非受控的值
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys;
  const openKeys = controlledOpenKeys ?? internalOpenKeys;

  // 处理菜单项点击
  const handleItemClick = useCallback(
    (key: string, item: NavItemType) => {
      if (item.disabled) return;

      const newSelectedKeys = [key];
      const keyPath = generateKeyPath(items, key);

      if (!controlledSelectedKeys) {
        setInternalSelectedKeys(newSelectedKeys);
      }

      onSelect?.({
        key,
        keyPath,
        selectedKeys: newSelectedKeys,
        item,
      });
    },
    [controlledSelectedKeys, onSelect, items]
  );

  // 处理展开/收起切换
  const handleToggleExpand = useCallback(
    (key: string) => {
      const newOpenKeys = openKeys.includes(key) ? openKeys.filter(k => k !== key) : [...openKeys, key];

      if (!controlledOpenKeys) {
        setInternalOpenKeys(newOpenKeys);
      }

      onOpenChange?.(newOpenKeys);
    },
    [openKeys, controlledOpenKeys, onOpenChange]
  );

  // 获取展开的父节点路径
  const getExpandedParentKeys = useCallback(
    (selectedKey: string): string[] => {
      return findParentKeys(items, selectedKey);
    },
    [items]
  );

  // 自动展开选中项的父节点
  const autoExpandParents = useCallback(
    (selectedKey: string) => {
      const parentKeys = getExpandedParentKeys(selectedKey);
      const newOpenKeys = Array.from(new Set([...openKeys, ...parentKeys]));

      if (!controlledOpenKeys) {
        setInternalOpenKeys(newOpenKeys);
      }

      onOpenChange?.(newOpenKeys);
    },
    [openKeys, controlledOpenKeys, onOpenChange, getExpandedParentKeys]
  );

  // 获取菜单项信息
  const getItemInfo = useCallback((key: string) => findMenuItem(items, key), [items]);

  // 计算当前选中的菜单项
  const currentSelectedItem = useMemo(() => {
    const selectedKey = selectedKeys[0];
    return selectedKey ? getItemInfo(selectedKey) : null;
  }, [selectedKeys, getItemInfo]);

  return {
    selectedKeys,
    openKeys,
    handleItemClick,
    handleToggleExpand,
    autoExpandParents,
    getItemInfo,
    currentSelectedItem,
  };
};
