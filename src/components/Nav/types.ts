import React from 'react';

export interface NavItemType {
  key: string; // 唯一标识
  type?: 'item' | 'divider' | 'group'; // 菜单项类型
  label?: React.ReactNode; // 菜单项标题（group 类型时作为分组标题）
  title?: string; // 设置收缩时展示的悬浮标题
  icon?: React.ReactNode; // 菜单图标
  disabled?: boolean; // 是否禁用
  children?: NavItemType[]; // 子菜单项（group 类型时作为分组的菜单项）
  className?: string; // 自定义样式类
  style?: React.CSSProperties; // 自定义样式
}

export interface NavProps {
  items: NavItemType[]; // 菜单数据
  mode?: 'inline'; // 菜单模式
  collapsed?: boolean; // 是否收起
  selectedKeys?: string[]; // 当前选中的菜单项
  defaultSelectedKeys?: string[]; // 默认选中的菜单项
  openKeys?: string[]; // 当前展开的子菜单
  defaultOpenKeys?: string[]; // 默认展开的子菜单
  onSelect?: (info: { key: string; keyPath: string[]; selectedKeys: string[]; item: NavItemType }) => void;
  onOpenChange?: (openKeys: string[]) => void;
  expandIcon?: React.ReactNode; // 自定义展开图标
  className?: string; // 容器样式类
  style?: React.CSSProperties; // 容器样式
}

export interface NavItemProps {
  item: NavItemType;
  level: number;
  collapsed?: boolean;
  selectedKeys: string[];
  openKeys: string[];
  onItemClick: (key: string, item: NavItemType) => void;
  onToggleExpand: (key: string) => void;
  expandIcon?: React.ReactNode;
  prefixCls: string;
}
