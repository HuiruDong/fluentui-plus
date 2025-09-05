import { useCallback } from 'react';
import type { Option, GroupedOption } from '../types';
import { useSelectState } from './useSelectState';
import { useOptionSelection } from './useOptionSelection';
import { useSelectSearch } from './useSelectSearch';

interface UseSelectProps {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  multiple?: boolean;
  showSearch?: boolean;
  open?: boolean;
  options?: GroupedOption[];
  onChange?: (value: string | number | (string | number)[], selectedOptions: Option | Option[] | null) => void;
  onSearch?: (value: string) => void;
  filterOption?: (input: string, option: Option) => boolean;
}

/**
 * Select主组合Hook
 * 职责：组合基础Hook，提供统一的对外接口
 */
export const useSelect = ({
  value,
  defaultValue,
  multiple = false,
  showSearch = false,
  open,
  options = [],
  onChange,
  onSearch,
  filterOption,
}: UseSelectProps) => {
  // 1. UI状态管理
  const stateManager = useSelectState({ open });

  // 2. 选项选择管理
  const selectionManager = useOptionSelection({
    value,
    defaultValue,
    multiple,
    options,
    onChange,
  });

  // 3. 搜索功能管理
  const searchManager = useSelectSearch({
    showSearch,
    options,
    onSearch,
    filterOption,
  });

  // 处理选项选择（增强原有逻辑）
  const handleOptionSelect = useCallback(
    (option: Option) => {
      selectionManager.handleOptionSelect(option);

      // 单选模式选中后关闭下拉框
      if (!multiple) {
        stateManager.closeDropdown();
      }

      // 如果是搜索模式，选中后清空搜索关键词
      if (showSearch) {
        searchManager.inputManager.clearInput();
      }
    },
    [selectionManager, multiple, showSearch, stateManager, searchManager]
  );

  // 处理标签删除（多选模式）
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      selectionManager.handleTagRemove(tag, index);
    },
    [selectionManager]
  );

  // 处理失焦
  const handleBlur = useCallback(() => {
    stateManager.closeDropdown();
    if (showSearch) {
      searchManager.inputManager.clearInput();
    }
  }, [showSearch, stateManager, searchManager]);

  // 处理 Selector 点击
  const handleSelectorClick = useCallback(() => {
    stateManager.toggleOpen();
  }, [stateManager]);

  return {
    // 状态（委托给状态管理器）
    isOpen: stateManager.isOpen,
    focusedIndex: stateManager.focusedIndex,

    // 值管理（委托给选择管理器）
    getCurrentValue: selectionManager.getCurrentValue,
    getSelectedOptions: selectionManager.getSelectedOptions,
    isOptionSelected: selectionManager.isOptionSelected,

    // 搜索管理（委托给搜索管理器）
    inputManager: searchManager.inputManager,
    filteredOptions: searchManager.filteredOptions,

    // 事件处理（组合多个管理器）
    handleOptionSelect,
    handleTagRemove,
    handleBlur,
    handleSelectorClick,

    // 状态控制
    openDropdown: stateManager.openDropdown,
    closeDropdown: stateManager.closeDropdown,
    setFocusedIndex: stateManager.setFocusedIndex,

    // 标签管理（多选功能）
    tagManager: selectionManager.tagManager,
  };
};
