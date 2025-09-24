import React from 'react';

export type Option = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
};

export type OptionGroup = {
  label: string;
  options: Option[];
};

export type GroupedOption = Option | OptionGroup;

export interface ListboxProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  options?: GroupedOption[];
  value?: string | number | (string | number)[];
  listHeight?: number;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SelectorProps {
  // 保留为空接口，因为所有 props 都来自 Context
}

export interface SelectProps {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
  multiple?: boolean;
  showSearch?: boolean;
  options?: GroupedOption[];
  listHeight?: number;
  open?: boolean;
  onChange?: (
    value: string | number | (string | number)[] | undefined,
    selectedOptions: Option | Option[] | null
  ) => void;
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;
  optionRender?: (option: Option) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  onClear?: () => void;
  allowClear?: boolean | { clearIcon?: React.ReactNode };
  labelRender?: (selectedOptions: Option | Option[] | null) => string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MultipleSelectorProps {
  // 保留为空接口，因为所有 props 都来自 Context
}

export interface OptionItemProps {
  option: Option;
  index: number;
  isSelected: boolean;
}

export interface SearchInputProps {
  value: string;
  placeholder: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface TextDisplayProps {
  displayText: string;
  isPlaceholder: boolean;
  onClick?: () => void;
  selectedOption?: Option;
}

export interface OptionGroupProps {
  group: OptionGroup;
  selectedValues?: (string | number)[];
}

// 辅助函数类型
export type isOptionGroup = (item: GroupedOption) => item is OptionGroup;
export type isOption = (item: GroupedOption) => item is Option;
