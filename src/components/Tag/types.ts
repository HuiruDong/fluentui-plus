import React, { PropsWithChildren } from 'react';

export interface TagProps extends PropsWithChildren {
  closeIcon?: boolean | React.ReactNode;
  color?: string;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface CheckableTagProps extends Omit<TagProps, 'onClick'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
