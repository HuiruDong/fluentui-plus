import type { TabListProps, TabProps, OverflowProps, ButtonProps, MenuItemProps } from '@fluentui/react-components';

/** 标签页选项配置 */
export type TabItem = {
  /** 唯一标识符 */
  key: string;
  /** 显示文本 */
  label?: string;
  /** 图标 */
  icon?: TabProps['icon'];
  /** 是否禁用 */
  disabled?: boolean;
};

/** 标签页选择事件处理函数类型 */
export type TabSelectHandler = (activeKey: TabItem['key']) => void;

/** 溢出菜单触发按钮的属性配置 */
export type MenuTriggerButtonProps = Pick<
  ButtonProps,
  | 'appearance'
  | 'icon'
  | 'iconPosition'
  | 'shape'
  | 'size'
  | 'disabled'
  | 'disabledFocusable'
  | 'className'
  | 'style'
  | 'aria-label'
>;

/** 标签页组件属性 */
export interface TabsProps extends Omit<TabListProps, 'onTabSelect'> {
  /** 标签页选择事件回调 */
  onTabSelect?: TabSelectHandler;
  /** 标签页选项列表 */
  items?: TabItem[];
  /** 溢出组件的属性配置（不包含 overflowAxis 和 children） */
  overflowProps?: Omit<OverflowProps, 'overflowAxis' | 'children'>;
  /** 溢出菜单下拉框的最大高度 */
  menuMaxHeight?: string;
  /** 溢出菜单触发按钮的属性配置 */
  menuTriggerButtonProps?: MenuTriggerButtonProps;
}

/** 溢出菜单组件属性 */
export type OverflowMenuProps = Pick<TabsProps, 'onTabSelect' | 'menuMaxHeight'> & {
  /** 标签页选项列表 */
  items: NonNullable<TabsProps['items']>;
  /** 触发按钮的属性配置，默认菜单最大高度为 '256px' */
  buttonProps?: TabsProps['menuTriggerButtonProps'];
};

/** 溢出菜单项组件属性 */
export type OverflowMenuItemProps = {
  /** 标签页选项数据 */
  tab: NonNullable<TabsProps['items']>[number];
  /** 点击事件回调 */
  onClick: MenuItemProps['onClick'];
};
