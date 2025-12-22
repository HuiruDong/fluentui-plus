import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import type { SiderProps } from './types';
import { ChevronRightFilled, ChevronLeftFilled } from '@fluentui/react-icons';

const prefixCls = 'fluentui-plus-layout-sider';

// 标记组件类型，用于父组件检测
const Sider: React.FC<SiderProps> & { __LAYOUT_SIDER__: boolean } = ({
  children,
  className,
  style,
  width = 200,
  collapsible = false,
  collapsed = false,
  breakpoint,
  onCollapse,
  collapsedWidth = 80,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [below, setBelow] = useState(false);

  useEffect(() => {
    setInternalCollapsed(collapsed);
  }, [collapsed]);

  // 响应式断点处理
  useEffect(() => {
    if (!breakpoint) return;

    const breakpoints = {
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    };

    const checkBreakpoint = () => {
      const isBelowBreakpoint = window.innerWidth < breakpoints[breakpoint];
      setBelow(isBelowBreakpoint);

      if (isBelowBreakpoint !== below && collapsible) {
        const newCollapsed = isBelowBreakpoint;
        setInternalCollapsed(newCollapsed);
        onCollapse?.(newCollapsed);
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint, collapsible, onCollapse, below]);

  const siderWidth = useMemo(() => {
    return internalCollapsed ? collapsedWidth : width;
  }, [internalCollapsed, width, collapsedWidth]);

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}-collapsed`]: internalCollapsed,
      [`${prefixCls}-has-trigger`]: collapsible,
      [`${prefixCls}-below`]: below,
    },
    className
  );

  const siderStyle: React.CSSProperties = {
    ...style,
    flex: `0 0 ${typeof siderWidth === 'number' ? `${siderWidth}px` : siderWidth}`,
    maxWidth: typeof siderWidth === 'number' ? `${siderWidth}px` : siderWidth,
    minWidth: typeof siderWidth === 'number' ? `${siderWidth}px` : siderWidth,
    width: typeof siderWidth === 'number' ? `${siderWidth}px` : siderWidth,
  };

  const handleToggle = () => {
    const newCollapsed = !internalCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  return (
    <aside className={classes} style={siderStyle}>
      <div className={`${prefixCls}-children`}>{children}</div>
      {collapsible && (
        <div className={`${prefixCls}-trigger`} onClick={handleToggle}>
          <span className={`${prefixCls}-trigger-icon`}>
            {internalCollapsed ? <ChevronRightFilled /> : <ChevronLeftFilled />}
          </span>
        </div>
      )}
    </aside>
  );
};

Sider.__LAYOUT_SIDER__ = true;

export default Sider;
