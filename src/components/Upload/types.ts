import type React from 'react';

/**
 * Upload 组件属性
 */
export interface UploadProps {
  /**
   * 接受上传的文件类型
   * @example 'image/*' | '.jpg,.png' | 'image/png,image/jpeg'
   */
  accept?: string;

  /**
   * 是否支持多选文件
   * @default false
   */
  multiple?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 上传文件之前的钩子，用于文件验证
   * 返回 false 或 Promise.reject 则停止上传（不会触发 onChange）
   * @param file 当前文件
   * @param fileList 所有选中的文件列表
   * @returns true/Promise.resolve 表示验证通过，false/Promise.reject 表示验证失败
   */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>;

  /**
   * 文件选择后的回调（只包含通过 beforeUpload 验证的文件）
   * 用户在此处理上传逻辑
   * @param files 通过验证的文件列表
   */
  onChange?: (files: File[]) => void;

  /**
   * 当文件被拖入上传区域时执行的回调
   * @param e 拖拽事件
   */
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  style?: React.CSSProperties;

  /**
   * 子元素（上传按钮/拖拽区域）
   */
  children?: React.ReactNode;
}

/**
 * UploadDragger 组件属性
 */
export interface UploadDraggerProps extends UploadProps {
  /**
   * 拖拽区域的高度
   */
  height?: number | string;
}
