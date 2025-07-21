import React from 'react';

// 基础共用属性
interface BaseInputTagProps {
  /** 输入框占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
}

// 标签相关的共用属性
interface BaseTagProps {
  /** 标签是否可关闭 */
  tagClosable?: boolean;
  /** 自定义标签渲染 */
  renderTag?: (tag: string, index: number, onClose: () => void) => React.ReactNode;
  /** 标签被移除时的回调 */
  onTagRemove?: (tag: string, index: number) => void;
}

// 输入框内部组件的属性
export interface InputProps extends BaseInputTagProps {
  value: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义内联样式 */
  style?: React.CSSProperties;
}

// 标签列表内部组件的属性
export interface TagListProps extends Omit<BaseInputTagProps, 'placeholder'>, BaseTagProps {
  tags: string[];
}

// 主组件的属性
export interface InputTagProps extends BaseInputTagProps, BaseTagProps {
  /** 受控模式的标签值 */
  value?: string[];
  /** 非受控模式的默认标签值 */
  defaultValue?: string[];
  /** 标签列表变化时的回调 */
  onChange?: (tags: string[]) => void;
  /** 输入内容变化时的回调 */
  onInputChange?: (value: string) => void;
  /** 最大标签数量 */
  maxTags?: number;
  /** 是否允许重复标签 */
  allowDuplicates?: boolean;
  /** 自定义分隔符，支持字符串或正则表达式，用于自动分割输入内容为标签 */
  delimiter?: string | RegExp;
}
