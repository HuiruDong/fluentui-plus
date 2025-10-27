import type { SpinnerProps } from '@fluentui/react-components';
import type { CSSProperties, ReactNode } from 'react';

export interface SpinProps extends Omit<SpinnerProps, 'size'> {
  /**
   * 自定义描述文案
   */
  tip?: string;

  /**
   * 是否全屏展示
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Spinner 的大小
   * @default 'medium'
   */
  size?: 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: CSSProperties;

  /**
   * 组件是否为加载中状态
   * @default true
   */
  spinning?: boolean;

  /**
   * 延迟显示加载效果的时间（防止闪烁）
   * 单位：毫秒
   */
  delay?: number;

  /**
   * 包裹的内容
   */
  children?: ReactNode;
}
