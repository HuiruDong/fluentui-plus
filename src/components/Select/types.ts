import React from 'react';

export type Option = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
};

export interface ListboxProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  options?: Option[];
  value?: string | number | (string | number)[];
  listHeight?: number;
  multiple?: boolean;
  onOptionClick?: (option: Option) => void;
  optionRender?: (option: Option) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
  prefixCls: string;
}

export interface SelectorProps {
  value?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  selectedOptions?: Option[];
  onClick?: () => void;
  multiple?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  isOpen?: boolean;
  onTagRemove?: (tag: string, index: number) => void;
  prefixCls: string;
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
  options?: Option[];
  listHeight?: number;
  open?: boolean;
  onChange?: (value: string | number | (string | number)[], selectedOptions: Option | Option[] | null) => void;
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;
  optionRender?: (option: Option) => React.ReactNode;
  popupRender?: (originNode: React.ReactNode) => React.ReactNode;
}

export interface MultipleSelectorProps {
  selectedOptions: Option[];
  disabled?: boolean;
  placeholder?: string;
  showSearch?: boolean;
  searchValue?: string;
  onClick?: () => void;
  onTagRemove?: (tag: string, index: number) => void;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  prefixCls: string;
}

export interface OptionItemProps {
  option: Option;
  index: number;
  isSelected: boolean;
  multiple?: boolean;
  onOptionClick?: (option: Option) => void;
  optionRender?: (option: Option) => React.ReactNode;
  prefixCls: string;
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
  title?: string;
  selectedOption?: Option;
  prefixCls: string;
}
