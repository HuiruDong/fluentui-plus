import { useCallback } from 'react';
import type { Option } from '../types';

interface UseOptionSelectionProps {
  value?: string | number | (string | number)[];
  multiple?: boolean;
}

export const useOptionSelection = ({ value, multiple = false }: UseOptionSelectionProps) => {
  // 检查选项是否被选中
  const isOptionSelected = useCallback(
    (option: Option) => {
      if (option.value === undefined) return false;

      if (multiple && Array.isArray(value)) {
        return value.includes(option.value);
      }
      return option.value === value;
    },
    [value, multiple]
  );

  return {
    isOptionSelected,
  };
};
