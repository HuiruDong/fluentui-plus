import { useCallback, useState } from 'react';
import { cloneDeep } from 'lodash';

export interface UseTagManagerProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  allowDuplicates?: boolean;
}

/**
 * 标签管理 Hook
 *
 * 何时使用：需要管理标签数组（添加、删除、批量操作）的场景
 *
 * @param props - 配置参数
 * @param props.value - 受控模式：标签数组
 * @param props.defaultValue - 非受控模式：默认标签数组
 * @param props.onChange - 标签变化回调
 * @param props.maxTags - 最大标签数量
 * @param props.allowDuplicates - 是否允许重复标签
 * @returns 标签管理方法：{ getCurrentTags, addTag, removeTag, addMultipleTags }
 */
export const useTagManager = ({
  value,
  defaultValue = [],
  onChange,
  maxTags,
  allowDuplicates = true,
}: UseTagManagerProps) => {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue || []);

  const getCurrentTags = useCallback(() => {
    const tags = value !== undefined ? value : internalTags;
    return cloneDeep(tags);
  }, [value, internalTags]);

  const addTag = useCallback(
    (tag: string) => {
      if (!tag.trim()) return false;

      const currentTags = getCurrentTags();

      if (maxTags !== undefined && currentTags.length >= maxTags) {
        return false;
      }

      if (!allowDuplicates && currentTags.includes(tag)) {
        return false;
      }

      const newTags = [...currentTags, tag.trim()];
      if (value === undefined) {
        setInternalTags(newTags);
      }
      onChange?.(newTags);
      return true;
    },
    [getCurrentTags, maxTags, allowDuplicates, value, onChange]
  );

  const removeTag = useCallback(
    (indexToRemove: number) => {
      let tagsToModify: string[];
      if (value !== undefined) {
        tagsToModify = cloneDeep(value);
      } else {
        tagsToModify = cloneDeep(internalTags);
      }

      if (indexToRemove < 0 || indexToRemove >= tagsToModify.length) {
        return false;
      }

      const newTags = [...tagsToModify.slice(0, indexToRemove), ...tagsToModify.slice(indexToRemove + 1)];

      if (value === undefined) {
        setInternalTags(newTags);
      }

      onChange?.(newTags);
      return true;
    },
    [value, internalTags, onChange]
  );

  const addMultipleTags = useCallback(
    (tags: string[]) => {
      const newTags = [...getCurrentTags()];
      let addedCount = 0;

      tags.forEach(tag => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        if (maxTags !== undefined && newTags.length >= maxTags) return;
        if (allowDuplicates || !newTags.includes(trimmedTag)) {
          newTags.push(trimmedTag);
          addedCount++;
        }
      });

      if (addedCount > 0) {
        if (value === undefined) {
          setInternalTags(newTags);
        }
        onChange?.(newTags);
      }

      return addedCount;
    },
    [getCurrentTags, maxTags, allowDuplicates, value, onChange]
  );

  return {
    getCurrentTags,
    addTag,
    removeTag,
    addMultipleTags,
  };
};
