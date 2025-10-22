import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FluentProvider, webLightTheme, Toast, ToastTitle, ToastBody } from '@fluentui/react-components';
import MessageContainer from './MessageContainer';
import type { MessageOptions, MessageInstance, MessageApi, ToastDispatch, ToastDispatchOptions } from './types';

class MessageManager {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private dispatchToast: ToastDispatch | null = null;
  private toastIds: Map<string, string> = new Map();
  private counter = 0;

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.root = createRoot(this.container);
      this.root.render(
        <FluentProvider theme={webLightTheme}>
          <MessageContainer onDispatchReady={this.setDispatchToast} />
        </FluentProvider>
      );
    }
  }

  private setDispatchToast = (dispatch: ToastDispatch) => {
    this.dispatchToast = dispatch;
  };

  private add(options: MessageOptions): MessageInstance {
    this.ensureContainer();

    // 等待 dispatchToast 就绪
    const id = `message-${Date.now()}-${this.counter++}`;

    const executeDispatch = () => {
      if (!this.dispatchToast) {
        setTimeout(executeDispatch, 10);
        return;
      }

      this.dispatchToast(
        <Toast>
          <ToastTitle>{options.title}</ToastTitle>
          {options.content && <ToastBody>{options.content}</ToastBody>}
          {options.action && (
            <ToastBody>
              <div style={{ marginTop: 8 }}>{options.action}</div>
            </ToastBody>
          )}
        </Toast>,
        {
          intent: options.intent || 'info',
          timeout: options.duration === 0 ? -1 : options.duration || 3000,
          onStatusChange: (_event: unknown, data: { status: string }) => {
            if (data.status === 'dismissed' && options.onClose) {
              options.onClose();
            }
          },
        } as ToastDispatchOptions
      );

      this.toastIds.set(id, id);
    };

    executeDispatch();

    return {
      close: () => {
        // Toast 会自动关闭，这里只是提供一个接口
        this.toastIds.delete(id);
      },
    };
  }

  public open(options: MessageOptions): MessageInstance {
    return this.add(options);
  }

  public info(title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>): MessageInstance {
    return this.add({
      ...options,
      title,
      intent: 'info',
    });
  }

  public success(title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>): MessageInstance {
    return this.add({
      ...options,
      title,
      intent: 'success',
    });
  }

  public warning(title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>): MessageInstance {
    return this.add({
      ...options,
      title,
      intent: 'warning',
    });
  }

  public error(title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>): MessageInstance {
    return this.add({
      ...options,
      title,
      intent: 'error',
    });
  }

  public destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    this.dispatchToast = null;
    this.toastIds.clear();
  }
}

// 创建单例实例
const messageManager = new MessageManager();

// 导出静态 API
const message: MessageApi = {
  info: (title, options) => messageManager.info(title, options),
  success: (title, options) => messageManager.success(title, options),
  warning: (title, options) => messageManager.warning(title, options),
  error: (title, options) => messageManager.error(title, options),
  open: options => messageManager.open(options),
  destroy: () => messageManager.destroy(),
};

export default message;
