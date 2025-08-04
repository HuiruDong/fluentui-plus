import React, { useMemo } from 'react';
import type { CheckableTagProps } from './types';
import Tag from './Tag';
import { mergeClasses } from '@fluentui/react-components';
import './index.less';

const prefixCls = 'fluentui-plus-checkable-tag';

const CheckableTag: React.FC<CheckableTagProps> = ({ checked, onChange, children, className, ...props }) => {
  const cs = useMemo(
    () => mergeClasses(prefixCls, checked && `${prefixCls}--checked`, className),
    [checked, className]
  );

  return (
    <Tag {...props} className={cs} onClick={() => onChange?.(!checked)}>
      {children}
    </Tag>
  );
};

export default CheckableTag;
export type { CheckableTagProps } from './types';
