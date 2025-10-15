import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import Checkbox from './Checkbox';
import type { GroupProps } from './types';

const prefixCls = 'fluentui-plus-checkbox-group';

const Group: React.FC<GroupProps> = ({
  defaultValue = [],
  disabled = false,
  options = [],
  value,
  className,
  style,
  onChange,
  layout = 'vertical',
}) => {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue || []);

  const actualValue = useMemo(() => {
    return value !== undefined ? value || [] : internalValue;
  }, [value, internalValue]);

  const handleCheckboxChange = useCallback(
    (optionValue: string | number, checked: boolean) => {
      let newValue: (string | number)[];

      if (checked) {
        newValue = [...actualValue, optionValue];
      } else {
        newValue = actualValue.filter(v => v !== optionValue);
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    },
    [actualValue, value, onChange]
  );

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}--horizontal`]: layout === 'horizontal',
      [`${prefixCls}--vertical`]: layout === 'vertical',
      [`${prefixCls}--disabled`]: disabled,
    },
    className
  );

  return (
    <div className={classes} style={style}>
      {options.map(option => (
        <Checkbox
          key={option.value}
          checked={actualValue.includes(option.value)}
          disabled={disabled || option.disabled}
          labelPosition={option.labelPosition}
          onChange={checked => handleCheckboxChange(option.value, checked)}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
};

export default Group;
