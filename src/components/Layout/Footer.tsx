import React from 'react';
import clsx from 'clsx';
import type { FooterProps } from './types';

const prefixCls = 'fluentui-plus-layout-footer';

const Footer: React.FC<FooterProps> = ({ children, className, style }) => {
  const classes = clsx(prefixCls, className);

  return (
    <footer className={classes} style={style}>
      {children}
    </footer>
  );
};

export default Footer;
