import React, { useState, useRef } from 'react';
import { mergeClasses, Tooltip, Menu, MenuTrigger, MenuPopover, MenuList, Divider } from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';
import { NavItemProps } from './types';
import { hasChildren } from './utils';
import NavSubmenu from './NavSubmenu';

const NavItem: React.FC<NavItemProps> = ({
  item,
  level,
  collapsed = false,
  selectedKeys,
  openKeys,
  onItemClick,
  onToggleExpand,
  expandIcon,
  prefixCls,
}) => {
  // 用于控制收起状态下菜单的显示
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 如果是分割线类型，直接渲染分割线
  if (item.type === 'divider') {
    return <Divider className={item.className} style={item.style} />;
  }

  // 如果是分组类型，渲染分组标题和分组内容
  if (item.type === 'group') {
    return (
      <div className={mergeClasses(`${prefixCls}__group`, item.className)} style={item.style}>
        {!collapsed && item.label && (
          <div
            className={`${prefixCls}__group__title`}
            role='group'
            aria-label={typeof item.label === 'string' ? item.label : 'Group'}
          >
            {item.label}
          </div>
        )}
        <div className={`${prefixCls}__group__content`}>
          {item.children?.map(child => (
            <NavItem
              key={child.key}
              item={child}
              level={collapsed ? level : level + 1}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onItemClick={onItemClick}
              onToggleExpand={onToggleExpand}
              expandIcon={expandIcon}
              prefixCls={prefixCls}
            />
          ))}
        </div>
      </div>
    );
  }

  const isSelected = selectedKeys.includes(item.key);
  const isOpen = openKeys.includes(item.key);
  const hasSubItems = hasChildren(item);

  const handleClick = () => {
    if (item.disabled) return;

    if (hasSubItems) {
      onToggleExpand(item.key);
    } else {
      onItemClick(item.key, item);
    }
  };

  // 处理鼠标进入
  const handleMouseEnter = () => {
    if (collapsed && hasSubItems) {
      // 清除之前的延时器
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // 立即显示菜单，不设置延时
      setIsMenuOpen(true);
    }
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    if (collapsed && hasSubItems) {
      // 清除延时器
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // 减少延时关闭菜单的时间
      hoverTimeoutRef.current = setTimeout(() => {
        setIsMenuOpen(false);
      }, 100);
    }
  };

  // 处理菜单区域的鼠标进入（保持菜单打开）
  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // 处理菜单区域的鼠标离开（关闭菜单）
  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
  };

  // 统一的图标渲染逻辑
  const renderIcon = () => {
    const iconClassName = `${prefixCls}__item__icon`;

    // 收起状态下的特殊处理
    if (collapsed) {
      if (item.icon) {
        return <span className={iconClassName}>{item.icon}</span>;
      }
      if (item.label) {
        // 如果 label 是字符串，取第一个字符；否则展示 label 本身
        const firstChar = typeof item.label === 'string' ? item.label.charAt(0) : item.label;
        return <span className={iconClassName}>{firstChar}</span>;
      }
      return null;
    }

    // 正常状态下的图标显示
    return item.icon ? <span className={iconClassName}>{item.icon}</span> : null;
  };

  const renderContent = () => {
    return (
      <>
        {renderIcon()}
        {!collapsed && <span className={`${prefixCls}__item__label`}>{item.label}</span>}
        {hasSubItems && !collapsed && (
          <span className={mergeClasses(`${prefixCls}__item__arrow`, isOpen && `${prefixCls}__item__arrow--expanded`)}>
            {expandIcon || <ChevronRightRegular />}
          </span>
        )}
      </>
    );
  };

  const itemWrapper = (
    <div className={`${prefixCls}__item__wrapper`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={mergeClasses(
          `${prefixCls}__item`,
          `${prefixCls}__item--level-${level}`,
          isSelected && `${prefixCls}__item--selected`,
          item.disabled && `${prefixCls}__item--disabled`,
          collapsed && `${prefixCls}__item--collapsed`,
          item.className
        )}
        style={item.style}
        onClick={handleClick}
        role='menuitem'
        tabIndex={item.disabled ? -1 : 0}
        aria-expanded={hasSubItems ? isOpen : undefined}
        aria-disabled={item.disabled}
      >
        {renderContent()}
      </div>

      {hasSubItems && isOpen && !collapsed && (
        <div className={mergeClasses(`${prefixCls}__submenu`, `${prefixCls}__submenu--level-${level + 1}`)}>
          {item.children?.map(child => (
            <NavItem
              key={child.key}
              item={child}
              level={level + 1}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onItemClick={onItemClick}
              onToggleExpand={onToggleExpand}
              expandIcon={expandIcon}
              prefixCls={prefixCls}
            />
          ))}
        </div>
      )}
    </div>
  );

  // 获取 Tooltip 内容的逻辑
  const getTooltipContent = () => {
    // 如果有 title 属性，优先使用 title
    if (item.title) {
      return item.title;
    }

    // 如果没有 title，则看 label 是否为字符串
    if (item.label) {
      if (typeof item.label === 'string') {
        return item.label;
      }
      // 如果 label 不是字符串，则展示为空
      return '';
    }

    // 若没有 label 则展示为空
    return '';
  };

  return collapsed ? (
    hasSubItems ? (
      // 有子菜单时使用 Menu 组件
      <Menu positioning='after-top' open={isMenuOpen} onOpenChange={(e, data) => setIsMenuOpen(data.open)}>
        <MenuTrigger disableButtonEnhancement>{itemWrapper}</MenuTrigger>
        <MenuPopover onMouseEnter={handleMenuMouseEnter} onMouseLeave={handleMenuMouseLeave}>
          <MenuList>{item.children && <NavSubmenu items={item.children} onItemClick={onItemClick} />}</MenuList>
        </MenuPopover>
      </Menu>
    ) : (
      // 没有子菜单时使用 Tooltip
      <Tooltip withArrow positioning='after' content={getTooltipContent()} relationship='label'>
        {itemWrapper}
      </Tooltip>
    )
  ) : (
    itemWrapper
  );
};

export default NavItem;
