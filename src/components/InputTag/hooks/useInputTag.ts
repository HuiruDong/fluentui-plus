import { useCallback, useState } from 'react';
import { useTagManager } from '@/hooks';

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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 使用通用的标签管理 hook
  const tagManager = useTagManager({
    value,
    defaultValue,
    onChange,
    maxTags,
    allowDuplicates,
  });

  // 重写 getCurrentTags 以支持深拷贝（InputTag 特有需求）
  const getCurrentTags = useCallback(() => {
    return tagManager.getCurrentTags();
  }, [tagManager]);

  // 重写 addTag 以保持原有的行为
  const addTag = useCallback(
    (tag: string) => {
      return tagManager.addTag(tag);
    },
    [tagManager]
  );

  // 扩展 removeTag 以支持删除回调和删除状态
  const removeTag = useCallback(
    (indexToRemove: number) => {
      setIsDeleting(true);

      // 获取要删除的标签
      const currentTags = getCurrentTags();
      if (indexToRemove < 0 || indexToRemove >= currentTags.length) {
        setIsDeleting(false);
        return false;
      }

      const tagToRemove = currentTags[indexToRemove];

      // 调用基础的删除操作
      const result = tagManager.removeTag(indexToRemove);

      if (result) {
        onTagRemove?.(tagToRemove, indexToRemove);
      }

      setTimeout(() => setIsDeleting(false), 0);
      return result;
    },
    [tagManager, getCurrentTags, onTagRemove]
  );

  // 重写 addMultipleTags 以保持原有的行为
  const addMultipleTags = useCallback(
    (tags: string[]) => {
      return tagManager.addMultipleTags(tags);
    },
    [tagManager]
  );

  return {
    getCurrentTags,
    addTag,
    removeTag,
    addMultipleTags,
    isDeleting,
  };
};
