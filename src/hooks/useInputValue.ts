import React, { useCallback, useState } from 'react';

/**
 * useInputValue Hook 的配置参数
 */
export interface UseInputValueProps {
  initialValue?: string;
  onInputChange?: (value: string) => void;
}

/**
 * 输入值管理 Hook
 *
 * 何时使用：需要管理输入框状态（值、焦点状态）的场景
 *
 * @param props - 配置参数
 * @param props.initialValue - 初始输入值
 * @param props.onInputChange - 输入值变化回调
 * @returns 输入管理方法：{ inputValue, setInputValue, isFocused, setIsFocused, handleInputChange, clearInput }
 */
export const useInputValue = ({ initialValue = '', onInputChange }: UseInputValueProps) => {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onInputChange?.(newValue);
    },
    [onInputChange]
  );

  const clearInput = useCallback(() => {
    setInputValue('');
    onInputChange?.('');
  }, [onInputChange]);

  return {
    inputValue,
    setInputValue,
    isFocused,
    setIsFocused,
    handleInputChange,
    clearInput,
  };
};
