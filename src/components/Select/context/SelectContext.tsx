import React, { createContext, useContext, useMemo } from 'react';
import type { Option } from '../types';

// SelectContext 类型定义
interface SelectContextValue {
  // 基础配置状态
  disabled?: boolean;
  multiple?: boolean;
  showSearch?: boolean;
  prefixCls: string;
  placeholder?: string;

  // 显示状态
  isOpen?: boolean;
  showClear?: boolean;

  // 数据状态
  selectedOptions?: Option[];
  searchValue?: string;
  value?: string | number | (string | number)[];

  // 渲染函数
  optionRender?: (option: Option) => React.ReactNode;
  labelRender?: (selectedOptions: Option | Option[] | null) => string;

  // 事件处理方法
  onOptionClick?: (option: Option) => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onTagRemove?: (tag: string, index: number) => void;
  onClear?: (e: React.MouseEvent) => void;
  onClick?: () => void;

  // Ref 引用
  inputRef?: React.RefObject<HTMLInputElement>;
}

// 创建 SelectContext
const SelectContext = createContext<SelectContextValue | undefined>(undefined);

// SelectProvider 组件
export const SelectProvider: React.FC<{
  children: React.ReactNode;
  value: SelectContextValue;
}> = ({ children, value }) => {
  const contextValue = useMemo(() => value, [value]);

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
};

// useSelectContext hook
export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelectContext must be used within SelectProvider');
  }
  return context;
};

export type { SelectContextValue };
