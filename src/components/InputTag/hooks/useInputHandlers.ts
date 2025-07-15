import React, { useCallback } from 'react';
import { useInputValue } from '@/hooks';

export interface UseInputHandlersProps {
  onInputChange?: (value: string) => void;
  addTag: (tag: string) => boolean;
  removeTag: (index: number) => boolean;
  addMultipleTags: (tags: string[]) => number;
  getCurrentTags: () => string[];
  isDeleting: boolean;
  delimiter?: string | RegExp;
}

export const useInputHandlers = ({
  onInputChange,
  addTag,
  removeTag,
  addMultipleTags,
  getCurrentTags,
  isDeleting,
  delimiter,
}: UseInputHandlersProps) => {
  // 使用通用的输入值管理 hook
  const inputManager = useInputValue({
    onInputChange,
  });

  // 扩展的输入变化处理（包含分隔符处理）
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // 如果设置了 delimiter，检查是否包含分隔符
      if (delimiter) {
        let lastDelimiterIndex = -1;
        let parts: string[] = [];

        if (typeof delimiter === 'string') {
          // 字符串分隔符
          if (newValue.includes(delimiter)) {
            parts = newValue.split(delimiter);
            lastDelimiterIndex = newValue.lastIndexOf(delimiter);
          }
        } else {
          // 正则表达式分隔符
          const matches = Array.from(newValue.matchAll(new RegExp(delimiter, 'g')));
          if (matches.length > 0) {
            parts = newValue.split(delimiter);
            const lastMatch = matches[matches.length - 1];
            lastDelimiterIndex = lastMatch.index! + lastMatch[0].length - 1;
          }
        }

        // 如果找到分隔符，处理分割
        if (lastDelimiterIndex >= 0 && parts.length > 1) {
          const tagsToAdd = parts
            .slice(0, -1)
            .map(tag => tag.trim())
            .filter(tag => tag);
          const remainingText = parts[parts.length - 1];

          if (tagsToAdd.length > 0) {
            addMultipleTags(tagsToAdd);
            inputManager.setInputValue(remainingText);
            onInputChange?.(remainingText);
            return;
          }
        }
      }

      // 使用通用的输入处理
      inputManager.handleInputChange(e);
    },
    [onInputChange, delimiter, addMultipleTags, inputManager]
  ); // 处理按键事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentTags = getCurrentTags();

      if (e.key === 'Enter' && inputManager.inputValue) {
        e.preventDefault();
        addTag(inputManager.inputValue);
        inputManager.setInputValue('');
      } else if (e.key === 'Backspace' && !inputManager.inputValue && currentTags.length > 0) {
        removeTag(currentTags.length - 1);
      }
    },
    [inputManager.inputValue, getCurrentTags, addTag, removeTag, inputManager]
  ); // 处理粘贴事件
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasteText = e.clipboardData.getData('text');

      if (delimiter) {
        // 只有设置了delimiter时才进行自动分割
        e.preventDefault();

        let tags: string[] = [];

        if (typeof delimiter === 'string') {
          tags = pasteText.split(delimiter);
        } else {
          tags = pasteText.split(delimiter);
        }

        const validTags = tags.map(tag => tag.trim()).filter(tag => tag);

        if (addMultipleTags(validTags) > 0) {
          inputManager.setInputValue('');
        }
      }
    },
    [addMultipleTags, delimiter, inputManager]
  );

  // 处理整个组件失焦事件
  const handleContainerBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        inputManager.setIsFocused(false);

        if (inputManager.inputValue && !isDeleting) {
          addTag(inputManager.inputValue);
          inputManager.setInputValue('');
        }
      }
    },
    [inputManager, isDeleting, addTag]
  );

  // 处理输入框失焦事件
  const handleInputBlur = useCallback((_: React.FocusEvent<HTMLInputElement>) => {
    // 移除了 inputProps?.onBlur?.(e) 调用
  }, []);

  return {
    inputValue: inputManager.inputValue,
    isFocused: inputManager.isFocused,
    setIsFocused: inputManager.setIsFocused,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    handleContainerBlur,
    handleInputBlur,
  };
};
