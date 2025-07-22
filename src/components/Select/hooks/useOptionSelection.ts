import { useState, useCallback, useMemo } from 'react';
import { useTagManager } from '../../../hooks';
import type { Option } from '../types';

interface UseOptionSelectionProps {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  multiple?: boolean;
  options?: Option[];
  onChange?: (value: string | number | (string | number)[], selectedOptions: Option | Option[] | null) => void;
}

/**
 * 选项选择管理Hook
 * 职责：管理选中状态、处理单选/多选逻辑、触发onChange回调
 */
export const useOptionSelection = ({
  value,
  defaultValue,
  multiple = false,
  options = [],
  onChange,
}: UseOptionSelectionProps) => {
  // 处理单选和多选的默认值
  const normalizedDefaultValue = useMemo(() => {
    if (multiple) {
      return Array.isArray(defaultValue) ? defaultValue.map(String) : [];
    }
    return defaultValue;
  }, [defaultValue, multiple]);

  // 单选模式：使用简单状态管理
  const [singleValue, setSingleValue] = useState<string | number | undefined>(
    multiple ? undefined : (normalizedDefaultValue as string | number | undefined)
  );

  // 多选模式：使用 useTagManager
  const tagManager = useTagManager({
    value: multiple && Array.isArray(value) ? value.map(String) : undefined,
    defaultValue: multiple ? (normalizedDefaultValue as string[]) : [],
    onChange: (tags: string[]) => {
      if (multiple && onChange) {
        const convertedValues = tags
          .map(tag => {
            const originalOption = options.find((opt: Option) => String(opt.value) === tag);
            return originalOption?.value;
          })
          .filter(v => v !== undefined) as (string | number)[];

        const selectedOptions = convertedValues
          .map(val => options.find((opt: Option) => opt.value === val))
          .filter(Boolean) as Option[];

        onChange(convertedValues, selectedOptions);
      }
    },
  });

  // 获取当前值
  const getCurrentValue = useCallback(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        return value;
      }
      return tagManager.getCurrentTags().map(tag => {
        const originalOption = options.find((opt: Option) => String(opt.value) === tag);
        return originalOption?.value || tag;
      });
    }
    return value !== undefined ? value : singleValue;
  }, [multiple, value, singleValue, tagManager, options]);

  // 获取选中的选项
  const getSelectedOptions = useCallback(() => {
    const currentValue = getCurrentValue();
    if (multiple && Array.isArray(currentValue)) {
      return currentValue.map(val => options.find((opt: Option) => opt.value === val)).filter(Boolean) as Option[];
    }
    const option = options.find((opt: Option) => opt.value === currentValue);
    return option ? [option] : [];
  }, [getCurrentValue, multiple, options]);

  // 检查选项是否被选中
  const isOptionSelected = useCallback(
    (option: Option) => {
      if (option.value === undefined) return false;
      const currentValue = getCurrentValue();

      if (multiple && Array.isArray(currentValue)) {
        return currentValue.includes(option.value);
      }
      return option.value === currentValue;
    },
    [getCurrentValue, multiple]
  );

  // 处理选项选择
  const handleOptionSelect = useCallback(
    (option: Option) => {
      if (option.disabled || option.value === undefined) return;

      if (multiple) {
        const currentTags = tagManager.getCurrentTags();
        const tagValue = String(option.value);

        if (currentTags.includes(tagValue)) {
          // 已选中，移除
          const index = currentTags.indexOf(tagValue);
          tagManager.removeTag(index);
          // tagManager.removeTag 会自动触发 onChange 回调，无需手动调用
        } else {
          // 未选中，添加
          tagManager.addTag(tagValue);
          // tagManager.addTag 会自动触发 onChange 回调，无需手动调用
        }
      } else {
        // 单选模式
        if (value === undefined) {
          setSingleValue(option.value);
        }
        onChange?.(option.value, option);
      }
    },
    [multiple, value, onChange, tagManager, options]
  );

  // 处理标签删除（多选模式）
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      if (multiple) {
        tagManager.removeTag(index);
        // tagManager.removeTag 会自动触发 onChange 回调，无需手动调用
      }
    },
    [multiple, tagManager]
  );

  return {
    // 值相关
    getCurrentValue,
    getSelectedOptions,
    isOptionSelected,

    // 事件处理
    handleOptionSelect,
    handleTagRemove,

    // 标签管理（多选模式）
    tagManager,
  };
};
