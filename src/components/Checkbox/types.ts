import React from 'react';
import type { CheckboxProps as FluentUICheckboxProps } from '@fluentui/react-components';

export interface CheckboxProps extends React.PropsWithChildren, Pick<FluentUICheckboxProps, 'labelPosition'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface Option extends Pick<FluentUICheckboxProps, 'labelPosition'> {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface GroupProps {
  defaultValue?: (string | number)[];
  disabled?: boolean;
  options?: Option[];
  value?: (string | number)[];
  className?: string;
  style?: React.CSSProperties;
  onChange?: (checkedValue: (string | number)[]) => void;
  layout?: 'vertical' | 'horizontal';
}
