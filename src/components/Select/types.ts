import React from 'react';

export type Option = {
  disabled?: boolean;
  title?: string; // 选项上的原生 title 提示
  value?: string | number;
  label?: string; // 选项显示文本
};

export interface SelectProps {
  value?: string | number;
  defaultValue?: string | number;
  className?: string; // 自定义样式类
  style?: React.CSSProperties; // 自定义样式
  disabled?: boolean;
  listHeight?: number; // 设置弹窗滚动高度，默认 256
  open?: boolean; // 是否展开下拉菜单
  options?: Option[];
  placeholder?: string;
  onChange?: (value: string | number, option: Option) => void; // 值变化回调
  optionRender?: (option: Option) => React.ReactNode; // 自定义渲染下拉选项
  popupRender?: (originNode: React.ReactNode) => React.ReactNode; // 自定义下拉框内容
}
