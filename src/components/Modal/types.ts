import React from 'react';
import type { ButtonProps, Theme } from '@fluentui/react-components';

export interface ModalProps extends React.PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
  cancelButtonProps?: ButtonProps;
  closeIcon?: ButtonProps['icon'];
  closable?: boolean;
  mask?: boolean;
  okButtonProps?: ButtonProps;
  okText?: string;
  okType?: ButtonProps['appearance'];
  title?: React.ReactNode;
  open?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  footer?:
    | React.ReactNode
    | null
    | ((
        originNode: React.ReactNode,
        extra: { OkBtn: React.ComponentType; CancelBtn: React.ComponentType }
      ) => React.ReactNode);
}

// 静态方法的参数类型
export interface StaticModalProps extends Omit<ModalProps, 'open' | 'onCancel'> {
  content?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  theme?: Theme;
}

// 静态方法的类型定义
export const STATIC_MODAL_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  CONFIRM: 'confirm',
} as const;

export type StaticModalType = (typeof STATIC_MODAL_TYPES)[keyof typeof STATIC_MODAL_TYPES];

// 静态方法返回的实例类型
export interface ModalInstance {
  destroy: () => void;
}
