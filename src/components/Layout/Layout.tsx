import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { LayoutProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-layout';

const Layout: React.FC<LayoutProps> = ({ children, className, style, hasSider }) => {
  // 自动检测是否有 Sider 组件
  const detectHasSider = useMemo(() => {
    if (hasSider !== undefined) {
      return hasSider;
    }

    let has = false;
    React.Children.forEach(children, child => {
      if (React.isValidElement(child) && (child.type as any).__LAYOUT_SIDER__) {
        has = true;
      }
    });
    return has;
  }, [children, hasSider]);

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}-has-sider`]: detectHasSider,
    },
    className
  );

  return (
    <section className={classes} style={style}>
      {children}
    </section>
  );
};

export default Layout;
