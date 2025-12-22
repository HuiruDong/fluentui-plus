import type { CSSProperties, ReactNode } from 'react';

export interface LayoutProps {
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 是否有 Sider 子元素（自动检测） */
  hasSider?: boolean;
}

export interface HeaderProps {
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

export interface FooterProps {
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

export interface ContentProps {
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
}

export interface SiderProps {
  /** 子元素 */
  children?: ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 宽度 */
  width?: number | string;
  /** 是否可收起 */
  collapsible?: boolean;
  /** 当前收起状态 */
  collapsed?: boolean;
  /** 触发响应式布局的断点 */
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** 收起状态改变时的回调 */
  onCollapse?: (collapsed: boolean) => void;
  /** 收缩宽度 */
  collapsedWidth?: number;
}
