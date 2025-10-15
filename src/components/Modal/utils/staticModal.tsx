import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  InfoFilled,
  CheckmarkCircleFilled,
  ErrorCircleFilled,
  WarningFilled,
  QuestionCircleFilled,
} from '@fluentui/react-icons';
import clsx from 'clsx';
import Modal from '../Modal';
import type { ModalProps, StaticModalProps, ModalInstance, StaticModalType } from '../types';
import { STATIC_MODAL_TYPES } from '../types';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { DEFAULT_TEXTS, DESTROY_DELAY } from './constants';

const prefixCls = 'fluentui-plus-static-modal';

// 图标组件映射 - 使用函数避免不必要的渲染
const getIconComponent = (type: StaticModalType): React.ReactElement => {
  const iconClass = `${prefixCls}__title-icon--${type}`;

  switch (type) {
    case STATIC_MODAL_TYPES.INFO:
      return <InfoFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
    case STATIC_MODAL_TYPES.SUCCESS:
      return <CheckmarkCircleFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
    case STATIC_MODAL_TYPES.ERROR:
      return <ErrorCircleFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
    case STATIC_MODAL_TYPES.WARNING:
      return <WarningFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
    case STATIC_MODAL_TYPES.CONFIRM:
      return <QuestionCircleFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
    default:
      return <InfoFilled className={clsx(`${prefixCls}__title-icon`, iconClass)} />;
  }
};

// 标题组件
const ModalTitle: React.FC<{ type: StaticModalType; title?: React.ReactNode }> = ({ type, title }) => {
  const defaultTitle = useMemo(() => DEFAULT_TEXTS[type].title, [type]);
  const displayTitle = title || defaultTitle;

  return (
    <div className={`${prefixCls}__title`}>
      {getIconComponent(type)}
      <span>{displayTitle}</span>
    </div>
  );
};

// 通用的静态方法实现
const createStaticMethod = (type: StaticModalType) => {
  return (props: StaticModalProps): ModalInstance => {
    const { content, onOk, onCancel, theme = webLightTheme, ...restProps } = props;

    // 创建容器
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    let isDestroying = false;

    // 销毁方法 - 添加防重复调用
    const destroy = () => {
      if (isDestroying) return;
      isDestroying = true;

      setTimeout(() => {
        try {
          root.unmount();
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        } catch (error) {
          console.warn('Modal destroy error:', error);
        }
      }, DESTROY_DELAY);
    };

    // 处理确定按钮点击 - 改进错误处理
    const handleOk = async () => {
      if (onOk) {
        try {
          await onOk();
        } catch (error) {
          console.error('Modal onOk error:', error);
          // 这里可以根据需要添加用户提示逻辑
          // 错误时不自动关闭弹窗，让用户决定下一步操作
          return;
        }
      }
      destroy();
    };

    // 处理取消按钮点击
    const handleCancel = () => {
      try {
        if (onCancel) {
          onCancel();
        }
      } catch (error) {
        console.error('Modal onCancel error:', error);
      } finally {
        destroy();
      }
    };

    // 根据类型设置默认属性
    const defaultProps: Partial<ModalProps> = {
      okText: DEFAULT_TEXTS[type].okText,
      ...(type === STATIC_MODAL_TYPES.CONFIRM && {
        cancelButtonProps: {
          children: DEFAULT_TEXTS[STATIC_MODAL_TYPES.CONFIRM].cancelText,
        },
      }),
    };

    // 渲染 Modal
    root.render(
      <FluentProvider theme={theme}>
        <Modal
          {...defaultProps}
          {...restProps}
          open={true}
          closable={false}
          title={<ModalTitle type={type} title={restProps.title} />}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={type === STATIC_MODAL_TYPES.CONFIRM ? undefined : (originNode, { OkBtn }) => <OkBtn />}
        >
          <div className={`${prefixCls}__content`}>{content}</div>
        </Modal>
      </FluentProvider>
    );

    return { destroy };
  };
};

// 导出各种静态方法
export const info = createStaticMethod(STATIC_MODAL_TYPES.INFO);
export const success = createStaticMethod(STATIC_MODAL_TYPES.SUCCESS);
export const error = createStaticMethod(STATIC_MODAL_TYPES.ERROR);
export const warning = createStaticMethod(STATIC_MODAL_TYPES.WARNING);
export const confirm = createStaticMethod(STATIC_MODAL_TYPES.CONFIRM);
