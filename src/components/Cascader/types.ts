import React from 'react';

// 基础级联选项类型，支持树形结构
export type CascaderOption = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
  children?: CascaderOption[]; // 子选项，支持多级嵌套
};

// 级联选择的值类型
export type CascaderValue = (string | number)[];

// 级联面板的属性
export interface CascaderPanelProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  options?: CascaderOption[];
  value?: CascaderValue;
  selectedPath?: CascaderOption[];
  listHeight?: number;
  multiple?: boolean;
  onPathChange?: (path: CascaderOption[], value: CascaderValue) => void;
  onFinalSelect?: (option: CascaderOption, path: CascaderOption[]) => void;
  optionRender?: (option: CascaderOption) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  searchResults?: CascaderSearchResult[];
  onSearch?: (value: string) => void;
  prefixCls: string;
}

// 级联列组件属性
export interface CascaderColumnProps {
  options: CascaderOption[];
  selectedOption?: CascaderOption;
  level: number;
  onSelect: (option: CascaderOption, level: number) => void;
  expandTrigger?: 'click' | 'hover';
  optionRender?: (option: CascaderOption) => React.ReactNode;
  prefixCls: string;
}

// 级联选项组件属性
export interface CascaderOptionProps {
  option: CascaderOption;
  level: number;
  isSelected: boolean;
  isActive: boolean;
  hasChildren: boolean;
  onClick: () => void;
  onHover?: () => void;
  optionRender?: (option: CascaderOption) => React.ReactNode;
  prefixCls: string;
}

// 主 Cascader 组件属性
export interface CascaderProps {
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
  showSearch?: boolean;
  options?: CascaderOption[];
  listHeight?: number;
  open?: boolean;
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
  onChange?: (value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void;
  onSearch?: (value: string) => void;
  optionRender?: (option: CascaderOption) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  onClear?: () => void;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
}

// 用于 useCascader Hook 的参数
export interface UseCascaderProps {
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  multiple?: boolean;
  showSearch?: boolean;
  open?: boolean;
  options?: CascaderOption[];
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
  onChange?: (value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void;
  onSearch?: (value: string) => void;
}

// 选择路径信息
export interface SelectionPath {
  options: CascaderOption[];
  values: CascaderValue;
  labels: string[];
}

// 级联搜索结果
export interface CascaderSearchResult {
  option: CascaderOption;
  path: CascaderOption[];
  value: CascaderValue;
  label: string;
}
