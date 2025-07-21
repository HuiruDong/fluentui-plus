import { useState, useCallback, useMemo } from 'react';
import { useTagManager } from '../../../hooks';
import type { Option } from '../types';

interface UseSelectValueProps {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  multiple?: boolean;
  options?: Option[];
  onChange?: (value: string | number | (string | number)[], option: Option) => void;
}

export const useSelectValue = ({
  value,
  defaultValue,
  multiple = false,
  options = [],
  onChange,
}: UseSelectValueProps) => {
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
        const convertedValues = tags.map(tag => {
          const originalOption = options.find(opt => String(opt.value) === tag);
          return originalOption?.value || tag;
        });
        // 暂时传递第一个选项作为占位符
        const firstOption = options[0];
        if (firstOption) {
          onChange(convertedValues, firstOption);
        }
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
        const originalOption = options.find(opt => String(opt.value) === tag);
        return originalOption?.value || tag;
      });
    }
    return value !== undefined ? value : singleValue;
  }, [multiple, value, singleValue, tagManager, options]);

  // 获取选中的选项
  const getSelectedOptions = useCallback(() => {
    const currentValue = getCurrentValue();
    if (multiple && Array.isArray(currentValue)) {
      return currentValue.map(val => options.find(opt => opt.value === val)).filter(Boolean) as Option[];
    }
    const option = options.find(opt => opt.value === currentValue);
    return option ? [option] : [];
  }, [getCurrentValue, multiple, options]);

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
          // 手动触发 onChange 回调
          if (onChange) {
            const newTags = currentTags.filter(tag => tag !== tagValue);
            const convertedValues = newTags.map(tag => {
              const originalOption = options.find(opt => String(opt.value) === tag);
              return originalOption?.value || tag;
            });
            onChange(convertedValues, option);
          }
        } else {
          // 未选中，添加
          tagManager.addTag(tagValue);
          // 手动触发 onChange 回调
          if (onChange) {
            const newTags = [...currentTags, tagValue];
            const convertedValues = newTags.map(tag => {
              const originalOption = options.find(opt => String(opt.value) === tag);
              return originalOption?.value || tag;
            });
            onChange(convertedValues, option);
          }
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
        const currentTags = tagManager.getCurrentTags();
        const removedTag = currentTags[index];

        tagManager.removeTag(index);

        // 手动触发 onChange 回调
        if (onChange && removedTag) {
          const newTags = currentTags.filter((_, i) => i !== index);
          const convertedValues = newTags.map(tag => {
            const originalOption = options.find(opt => String(opt.value) === tag);
            return originalOption?.value || tag;
          });
          const removedOption = options.find(opt => String(opt.value) === removedTag);
          if (removedOption) {
            onChange(convertedValues, removedOption);
          }
        }
      }
    },
    [multiple, tagManager, onChange, options]
  );

  return {
    // 值相关
    getCurrentValue,
    getSelectedOptions,

    // 事件处理
    handleOptionSelect,
    handleTagRemove,

    // 标签管理（多选模式）
    tagManager,
  };
};
