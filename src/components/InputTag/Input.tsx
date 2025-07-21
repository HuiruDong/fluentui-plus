import React from 'react';
import type { InputProps } from './types';

const prefixCls = 'mm-input-tag__input';

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  disabled = false,
  inputRef,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onPaste,
  className,
  style,
}) => {
  const inputClassName = className ? `${prefixCls} ${className}` : prefixCls;

  return (
    <input
      ref={inputRef}
      className={inputClassName}
      style={style}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onPaste={onPaste}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Input;
