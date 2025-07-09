/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Menu, MenuTrigger, MenuPopover, MenuList, MenuItem, MenuDivider } from '@fluentui/react-components';
import { NavItemType } from './types';

interface NavSubmenuProps {
  items: NavItemType[];
  onItemClick: (key: string, item: NavItemType) => void;
}

const NavSubmenu: React.FC<NavSubmenuProps> = ({ items, onItemClick }) => {
  // 递归渲染子菜单项，支持多层级
  const renderSubMenuItems = (items: NavItemType[]): React.ReactNode[] => {
    return items.map(child => {
      if (child.type === 'divider') {
        return <MenuDivider key={child.key} role='separator' />;
      }

      // 如果当前子项还有子菜单，递归创建嵌套菜单
      if (child.children && child.children.length > 0) {
        return (
          <Menu key={child.key} positioning='after-top' hoverDelay={0.1}>
            <MenuTrigger disableButtonEnhancement>
              <MenuItem icon={child.icon as any} disabled={child.disabled}>
                {child.label}
              </MenuItem>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>{renderSubMenuItems(child.children)}</MenuList>
            </MenuPopover>
          </Menu>
        );
      }

      // 叶子节点，直接返回 MenuItem
      return (
        <MenuItem
          key={child.key}
          icon={child.icon as any}
          disabled={child.disabled}
          onClick={() => !child.disabled && onItemClick(child.key, child)}
        >
          {child.label}
        </MenuItem>
      );
    });
  };

  return <>{renderSubMenuItems(items)}</>;
};

export default NavSubmenu;
