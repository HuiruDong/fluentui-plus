import React, { useMemo } from 'react';
import clsx from 'clsx';
import { NavProps } from './types';
import { useNavigation } from './hooks/useNavigation';
import NavItem from './NavItem';
import './index.less';

const prefixCls = 'fluentui-plus-nav';

// 主导航组件
const Nav: React.FC<NavProps> = ({
  items,
  mode = 'inline',
  collapsed = false,
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  openKeys: controlledOpenKeys,
  defaultOpenKeys,
  onSelect,
  onOpenChange,
  expandIcon,
  className,
  style,
}) => {
  const { selectedKeys, openKeys, handleItemClick, handleToggleExpand } = useNavigation({
    items,
    defaultSelectedKeys,
    defaultOpenKeys,
    selectedKeys: controlledSelectedKeys,
    openKeys: controlledOpenKeys,
    onSelect,
    onOpenChange,
  });

  const navClasses = useMemo(
    () => clsx(prefixCls, `${prefixCls}--${mode}`, { [`${prefixCls}--collapsed`]: collapsed }, className),
    [mode, collapsed, className]
  );

  return (
    <nav className={navClasses} style={style} role='navigation' aria-label='Navigation menu'>
      <div className={`${prefixCls}__list`} role='menu'>
        {items.map(item => (
          <NavItem
            key={item.key}
            item={item}
            level={0}
            collapsed={collapsed}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onItemClick={handleItemClick}
            onToggleExpand={handleToggleExpand}
            expandIcon={expandIcon}
            prefixCls={prefixCls}
          />
        ))}
      </div>
    </nav>
  );
};

export default Nav;
export type { NavProps } from './types';
