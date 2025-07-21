import { useState, useCallback } from 'react';
import { useInputValue } from '../../../hooks';
import { useSelectValue } from './useSelectValue';
import type { Option } from '../types';

interface UseSelectProps {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  multiple?: boolean;
  showSearch?: boolean;
  options?: Option[];
  onChange?: (value: string | number | (string | number)[], option: Option) => void;
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;
}

export const useSelect = ({
  value,
  defaultValue,
  multiple = false,
  showSearch = false,
  options = [],
  onChange,
  onSearch,
}: UseSelectProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // 使用值管理 hook
  const valueManager = useSelectValue({
    value,
    defaultValue,
    multiple,
    options,
    onChange,
  });

  // 搜索功能：使用 useInputValue
  const inputManager = useInputValue({
    initialValue: '',
    onInputChange: (searchValue: string) => {
      onSearch?.(searchValue);
    },
  });

  // 处理选项选择（包装值管理器的方法）
  const handleOptionSelect = useCallback(
    (option: Option) => {
      valueManager.handleOptionSelect(option);

      // 单选模式选中后关闭下拉框
      if (!multiple) {
        setInternalOpen(false);
      }

      // 如果是搜索模式，选中后清空搜索关键词
      if (showSearch) {
        inputManager.clearInput();
      }
    },
    [valueManager, multiple, showSearch, inputManager]
  );

  // 处理标签删除（多选模式）
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      valueManager.handleTagRemove(tag, index);
    },
    [valueManager]
  );

  // 处理失焦
  const handleBlur = useCallback(() => {
    setInternalOpen(false);
    if (showSearch) {
      inputManager.clearInput();
    }
  }, [showSearch, inputManager]);

  // 处理 Selector 点击
  const handleSelectorClick = useCallback(() => {
    setInternalOpen(prev => !prev);
  }, []);

  return {
    // 状态
    internalOpen,
    setInternalOpen,

    // 值管理（委托给 valueManager）
    getCurrentValue: valueManager.getCurrentValue,
    getSelectedOptions: valueManager.getSelectedOptions,

    // 事件处理
    handleOptionSelect,
    handleTagRemove,
    handleBlur,
    handleSelectorClick,

    // 输入管理（搜索功能）
    inputManager,

    // 标签管理（多选功能）
    tagManager: valueManager.tagManager,
  };
};
