import React from 'react';

// 基础级联选项类型，支持树形结构
export type CascaderOption = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
  children?: CascaderOption[]; // 子选项，支持多级嵌套
};

// 多选模式下的选中状态类型
export type CheckedStatus = 'checked' | 'unchecked' | 'indeterminate';

// 多选模式下的节点选中状态信息
export interface NodeCheckedStatus {
  status: CheckedStatus;
  checkedKeys: Set<string | number>;
  halfCheckedKeys: Set<string | number>;
}

// 级联选择的值类型
export type CascaderValue = (string | number)[];

// 多选模式下的级联值类型
export type CascaderMultipleValue = CascaderValue[];

// 级联面板的属性
export interface CascaderPanelProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  options?: CascaderOption[];
  value?: CascaderValue | CascaderMultipleValue;
  selectedPath?: CascaderOption[];
  listHeight?: number;
  multiple?: boolean;
  onPathChange?: (path: CascaderOption[], value: CascaderValue) => void;
  onFinalSelect?: (option: CascaderOption, path: CascaderOption[]) => void;
  onMultipleSelect?: (option: CascaderOption, checked: boolean) => void;
  optionRender?: (option: CascaderOption) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  searchResults?: CascaderSearchResult[];
  onSearch?: (value: string) => void;
  prefixCls: string;
  // 多选相关状态
  checkedKeys?: Set<string | number>;
  halfCheckedKeys?: Set<string | number>;
  // 空状态自定义
  emptyText?: string;
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
  // 多选相关属性
  multiple?: boolean;
  checkedKeys?: Set<string | number>;
  halfCheckedKeys?: Set<string | number>;
  onCheckChange?: (option: CascaderOption, checked: boolean) => void;
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
  // 多选相关属性
  multiple?: boolean;
  checked?: CheckedStatus;
  onCheckChange?: (checked: boolean) => void;
}

// 主 Cascader 组件属性
export interface CascaderProps {
  value?: CascaderValue | CascaderMultipleValue;
  defaultValue?: CascaderValue | CascaderMultipleValue;
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
  onChange?: (
    value: CascaderValue | CascaderMultipleValue | undefined,
    selectedOptions: CascaderOption[] | CascaderOption[][] | null
  ) => void;
  onSearch?: (value: string) => void;
  optionRender?: (option: CascaderOption) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  onClear?: () => void;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  // 多选模式下的 labelRender，用于自定义每个选项的显示文本
  labelRender?: (option: CascaderOption) => string;
}

// 用于 useCascader Hook 的参数
export interface UseCascaderProps {
  value?: CascaderValue | CascaderMultipleValue;
  defaultValue?: CascaderValue | CascaderMultipleValue;
  multiple?: boolean;
  showSearch?: boolean;
  open?: boolean;
  options?: CascaderOption[];
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
  onChange?: (
    value: CascaderValue | CascaderMultipleValue | undefined,
    selectedOptions: CascaderOption[] | CascaderOption[][] | null
  ) => void;
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

// 级联空状态组件属性
export interface CascaderEmptyProps {
  prefixCls: string;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}
