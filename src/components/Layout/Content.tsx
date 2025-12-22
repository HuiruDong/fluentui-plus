import React from 'react';
import clsx from 'clsx';
import type { ContentProps } from './types';

const prefixCls = 'fluentui-plus-layout-content';

const Content: React.FC<ContentProps> = ({ children, className, style }) => {
  const classes = clsx(prefixCls, className);

  return (
    <main className={classes} style={style}>
      {children}
    </main>
  );
};

export default Content;
