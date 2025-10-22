import React from 'react';
import type { ToastIntent } from '@fluentui/react-components';

/**
 * Toast dispatch options
 */
export interface ToastDispatchOptions {
  intent?: ToastIntent;
  timeout?: number;
  onStatusChange?: (event: unknown, data: { status: string }) => void;
}

/**
 * Toast dispatch function type
 */
export type ToastDispatch = (content: React.ReactElement, options: ToastDispatchOptions) => void;

export interface MessageOptions {
  /**
   * 消息标题（主要内容）
   */
  title?: React.ReactNode;
  /**
   * 消息内容（详细描述）
   */
  content?: React.ReactNode;
  /**
   * 消息类型
   * @default 'info'
   */
  intent?: ToastIntent;
  /**
   * 自动关闭延迟时间（毫秒）
   * @default 3000
   */
  duration?: number;
  /**
   * 是否显示关闭按钮
   * @default true
   */
  closable?: boolean;
  /**
   * 关闭时的回调函数
   */
  onClose?: () => void;
  /**
   * 自定义操作按钮
   */
  action?: React.ReactNode;
}

export interface MessageInstance {
  /**
   * 关闭当前消息
   */
  close: () => void;
}

export interface MessageApi {
  /**
   * 显示信息消息
   * @param title 消息标题
   * @param options 配置项
   */
  info: (title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>) => MessageInstance;
  /**
   * 显示成功消息
   * @param title 消息标题
   * @param options 配置项
   */
  success: (title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>) => MessageInstance;
  /**
   * 显示警告消息
   * @param title 消息标题
   * @param options 配置项
   */
  warning: (title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>) => MessageInstance;
  /**
   * 显示错误消息
   * @param title 消息标题
   * @param options 配置项
   */
  error: (title: React.ReactNode, options?: Omit<MessageOptions, 'title' | 'intent'>) => MessageInstance;
  /**
   * 显示自定义消息
   */
  open: (options: MessageOptions) => MessageInstance;
  /**
   * 销毁所有消息
   */
  destroy: () => void;
}

export type { MessageOptions as MessageConfig };
