import React, { useRef } from 'react';
import Input from '../InputTag/Input';
import type { SearchInputProps } from './types';

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  placeholder,
  disabled,
  inputRef,
  onChange,
  onFocus,
  onBlur,
}) => {
  const localInputRef = useRef<HTMLInputElement>(null);

  return (
    <Input
      inputRef={inputRef || localInputRef}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={e => onChange?.(e)}
      onFocus={() => onFocus?.()}
      onBlur={e => onBlur?.(e)}
      onPaste={() => {}}
      onKeyDown={() => {}}
      style={{ margin: 0 }}
    />
  );
};

export default SearchInput;
