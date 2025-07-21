import React from 'react';

export type Option = {
  disabled?: boolean;
  title?: string; // 选项上的原生 title 提示
  value?: string | number;
  label?: string; // 选项显示文本
};

export interface SelectProps {
  // 基础属性
  value?: string | number | (string | number)[]; // 单选时为单值，多选时为数组
  defaultValue?: string | number | (string | number)[];
  className?: string; // 自定义样式类
  style?: React.CSSProperties; // 自定义样式
  disabled?: boolean;
  placeholder?: string;

  // 新增功能属性
  multiple?: boolean; // 默认 false
  showSearch?: boolean; // 默认 false

  // 选项相关
  options?: Option[];
  listHeight?: number; // 设置弹窗滚动高度，默认 256
  open?: boolean; // 是否展开下拉菜单

  // 回调函数 - 根据模式动态类型
  onChange?: (value: string | number | (string | number)[], option: Option) => void;

  // 搜索相关
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;

  // 渲染相关
  optionRender?: (option: Option) => React.ReactNode; // 自定义渲染下拉选项
  popupRender?: (originNode: React.ReactNode) => React.ReactNode; // 自定义下拉框内容
}
