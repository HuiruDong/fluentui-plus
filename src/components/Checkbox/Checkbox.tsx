import React, { useCallback, useMemo } from 'react';
import { Checkbox as FluentUICheckbox } from '@fluentui/react-components';
import clsx from 'clsx';
import type { CheckboxProps, GroupProps } from './types';
import Group from './Group';
import './index.less';

const prefixCls = 'fluentui-plus-checkbox';

interface CheckboxType extends React.FC<CheckboxProps> {
  Group: React.FC<GroupProps>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  defaultChecked,
  onChange,
  indeterminate = false,
  disabled = false,
  className,
  style,
  labelPosition = 'after',
  ...restProps
}) => {
  const actualIndeterminate = useMemo(() => {
    return indeterminate && !checked;
  }, [indeterminate, checked]);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>, data: { checked: boolean | 'mixed' }) => {
      const isChecked = data.checked === true;
      onChange?.(isChecked);
    },
    [onChange]
  );

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--indeterminate`]: actualIndeterminate,
      [`${prefixCls}--checked`]: checked,
      [`${prefixCls}--label-before`]: labelPosition === 'before',
      [`${prefixCls}--label-after`]: labelPosition === 'after',
    },
    className
  );

  const checkboxElement = (
    <FluentUICheckbox
      checked={actualIndeterminate ? 'mixed' : checked}
      defaultChecked={defaultChecked}
      onChange={handleChange}
      disabled={disabled}
      {...restProps}
    />
  );

  const labelElement = children && <span className={`${prefixCls}__label`}>{children}</span>;

  return (
    <label className={classes} style={style}>
      {labelPosition === 'before' ? (
        <>
          {labelElement}
          {checkboxElement}
        </>
      ) : (
        <>
          {checkboxElement}
          {labelElement}
        </>
      )}
    </label>
  );
};

const CheckboxWithGroup = Checkbox as CheckboxType;
CheckboxWithGroup.Group = Group;

export default CheckboxWithGroup;
export type { CheckboxProps, GroupProps } from './types';
