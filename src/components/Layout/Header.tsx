import React from 'react';
import clsx from 'clsx';
import type { HeaderProps } from './types';

const prefixCls = 'fluentui-plus-layout-header';

const Header: React.FC<HeaderProps> = ({ children, className, style }) => {
  const classes = clsx(prefixCls, className);

  return (
    <header className={classes} style={style}>
      {children}
    </header>
  );
};

export default Header;
