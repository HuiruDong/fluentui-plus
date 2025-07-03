import React, { useMemo } from 'react';
import type { TagProps } from '..';
import Tag from './Tag';
import { mergeClasses } from '@fluentui/react-components';
import './index.less';

const prefixCls = 'mm-checkable-tag';

export interface CheckableTagProps extends Omit<TagProps, 'onClick'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

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
