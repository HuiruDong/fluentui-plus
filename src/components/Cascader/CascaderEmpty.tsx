import React from 'react';
import clsx from 'clsx';
import type { CascaderEmptyProps } from './types';

const CascaderEmpty: React.FC<CascaderEmptyProps> = ({ prefixCls, text = '暂无数据', className, style }) => {
  const emptyClasses = clsx(`${prefixCls}__empty`, className);

  return (
    <div className={emptyClasses} style={style}>
      <div className={`${prefixCls}__empty-text`}>{text}</div>
    </div>
  );
};

export default CascaderEmpty;
