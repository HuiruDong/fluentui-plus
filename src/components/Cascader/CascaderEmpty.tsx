import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderEmptyProps } from './types';

const CascaderEmpty: React.FC<CascaderEmptyProps> = ({ prefixCls, text = '暂无数据', className, style }) => {
  const emptyClasses = mergeClasses(`${prefixCls}__empty`, className);

  return (
    <div className={emptyClasses} style={style}>
      <div className={`${prefixCls}__empty-text`}>{text}</div>
    </div>
  );
};

export default CascaderEmpty;
