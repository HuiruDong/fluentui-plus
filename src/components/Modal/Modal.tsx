import React, { useMemo } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
  type DialogProps,
} from '@fluentui/react-components';
import clsx from 'clsx';
import type { ModalProps } from './types';
import { DismissFilled } from '@fluentui/react-icons';
import * as staticMethods from './utils';
import './index.less';

const prefixCls = 'fluentui-plus-modal';

const Modal: React.FC<ModalProps> = ({
  cancelButtonProps,
  closeIcon,
  closable = true,
  mask = true,
  okButtonProps,
  okText = '确定',
  okType = 'primary',
  title,
  open = false,
  onCancel,
  children,
  onOk,
  footer,
  className,
  style,
}) => {
  const modalType: DialogProps['modalType'] = mask ? 'modal' : 'non-modal';

  // 渲染默认的底部按钮
  const defaultFooter = useMemo(() => {
    const OkBtn = () => (
      <Button appearance={okType} onClick={onOk} {...okButtonProps}>
        {okText}
      </Button>
    );

    const CancelBtn = () => (
      <Button appearance='secondary' onClick={onCancel} {...cancelButtonProps}>
        取消
      </Button>
    );

    return (
      <>
        <CancelBtn />
        <OkBtn />
      </>
    );
  }, [okType, onOk, okText, okButtonProps, onCancel, cancelButtonProps]);

  // 处理 footer 渲染
  const renderFooter = () => {
    if (footer === null) {
      return null;
    }

    if (typeof footer === 'function') {
      const OkBtn = () => (
        <Button appearance={okType} onClick={onOk} {...okButtonProps}>
          {okText}
        </Button>
      );

      const CancelBtn = () => (
        <Button appearance='secondary' onClick={onCancel} {...cancelButtonProps}>
          取消
        </Button>
      );

      return footer(defaultFooter, { OkBtn, CancelBtn });
    }

    if (footer) {
      return footer;
    }

    return defaultFooter;
  };

  const classes = clsx(prefixCls, className);

  return (
    <Dialog open={open} modalType={modalType}>
      <DialogSurface className={classes} style={style}>
        <DialogBody>
          {closable && (
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance='subtle'
                icon={closeIcon || <DismissFilled />}
                onClick={onCancel}
                className={`${prefixCls}__close`}
              />
            </DialogTrigger>
          )}

          {title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>{children}</DialogContent>

          {renderFooter() && <DialogActions className={`${prefixCls}__footer`}>{renderFooter()}</DialogActions>}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

// 扩展 Modal 组件的类型以包含静态方法
interface ModalType extends React.FC<ModalProps> {
  info: typeof staticMethods.info;
  success: typeof staticMethods.success;
  error: typeof staticMethods.error;
  warning: typeof staticMethods.warning;
  confirm: typeof staticMethods.confirm;
}

// 创建带有静态方法的 Modal 组件
const ModalWithStaticMethods: ModalType = Modal as ModalType;

// 添加静态方法
ModalWithStaticMethods.info = staticMethods.info;
ModalWithStaticMethods.success = staticMethods.success;
ModalWithStaticMethods.error = staticMethods.error;
ModalWithStaticMethods.warning = staticMethods.warning;
ModalWithStaticMethods.confirm = staticMethods.confirm;

export default ModalWithStaticMethods;
