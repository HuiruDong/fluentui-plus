import React from 'react';

/**
 * 图片加载状态
 */
export type ImageStatus = 'loading' | 'loaded' | 'error';

/**
 * Image 组件属性
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  /**
   * 图片地址
   */
  src?: string;
  /**
   * 图片描述
   */
  alt?: string;
  /**
   * 图片宽度
   */
  width?: number | string;
  /**
   * 图片高度
   */
  height?: number | string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 是否启用懒加载
   * @default false
   */
  lazy?: boolean;
  /**
   * 加载占位内容
   */
  placeholder?: React.ReactNode;
  /**
   * 加载失败时的容错内容
   */
  fallback?: React.ReactNode;
  /**
   * 是否开启预览
   * @default true
   */
  preview?: boolean;
  /**
   * 自定义预览图地址（默认使用 src）
   */
  previewSrc?: string;
  /**
   * 图片加载完成回调
   */
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  /**
   * 图片加载失败回调
   */
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * 预览图片信息
 */
export interface PreviewImageInfo {
  /**
   * 图片唯一标识
   */
  id: string;
  /**
   * 预览图地址
   */
  src: string;
  /**
   * 图片描述
   */
  alt?: string;
}

/**
 * ImagePreview 组件属性
 */
export interface ImagePreviewProps {
  /**
   * 是否显示预览
   */
  visible: boolean;
  /**
   * 预览图片列表
   */
  images: PreviewImageInfo[];
  /**
   * 当前预览图片索引
   */
  currentIndex: number;
  /**
   * 关闭预览回调
   */
  onClose: () => void;
  /**
   * 切换图片回调
   */
  onIndexChange?: (index: number) => void;
}

/**
 * ImageGroup 组件属性
 */
export interface ImageGroupProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 预览图片数组（优先级高于子组件收集的图片）
   * 设置后点击任意子 Image 都会预览这个数组
   */
  images?: (string | PreviewImageInfo)[];
}

/**
 * ImageContext 上下文值
 */
export interface ImageContextValue {
  /**
   * 是否在 ImageGroup 内
   */
  isGroup: boolean;
  /**
   * 注册图片到相册
   */
  registerImage: (info: PreviewImageInfo) => void;
  /**
   * 取消注册图片
   */
  unregisterImage: (id: string) => void;
  /**
   * 打开预览
   */
  openPreview: (id: string) => void;
}
