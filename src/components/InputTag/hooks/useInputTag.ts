import { useCallback, useState } from 'react';
import { cloneDeep } from 'lodash';

export interface UseInputTagProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  allowDuplicates?: boolean;
  onTagRemove?: (tag: string, index: number) => void;
}

export const useInputTag = ({
  value,
  defaultValue = [],
  onChange,
  maxTags,
  allowDuplicates = true,
  onTagRemove,
}: UseInputTagProps) => {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue || []);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 获取当前的标签数组（受控模式严格使用value，非受控模式使用internalTags）
  const getCurrentTags = useCallback(() => {
    const tags = value !== undefined ? value : internalTags;
    return cloneDeep(tags);
  }, [value, internalTags]);

  // 添加标签
  const addTag = useCallback(
    (tag: string) => {
      if (!tag.trim()) return false;

      const currentTags = getCurrentTags();

      // 检查最大标签数量限制
      if (maxTags !== undefined && currentTags.length >= maxTags) {
        return false;
      }

      // 检查是否允许重复标签
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

  // 删除标签
  const removeTag = useCallback(
    (indexToRemove: number) => {
      setIsDeleting(true);

      let tagsToModify: string[];
      if (value !== undefined) {
        tagsToModify = cloneDeep(value);
      } else {
        tagsToModify = cloneDeep(internalTags);
      }

      if (indexToRemove < 0 || indexToRemove >= tagsToModify.length) {
        setIsDeleting(false);
        return false;
      }

      const tagToRemove = tagsToModify[indexToRemove];
      const newTags = [...tagsToModify.slice(0, indexToRemove), ...tagsToModify.slice(indexToRemove + 1)];

      if (value === undefined) {
        setInternalTags(newTags);
      }

      onChange?.(newTags);
      onTagRemove?.(tagToRemove, indexToRemove);

      setTimeout(() => setIsDeleting(false), 0);
      return true;
    },
    [value, internalTags, onChange, onTagRemove]
  );

  // 批量添加标签（用于粘贴功能）
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
    isDeleting,
  };
};
