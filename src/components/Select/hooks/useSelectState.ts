import { useState, useCallback } from 'react';

interface UseSelectStateProps {
  open?: boolean;
}

/**
 * Select UI状态管理Hook
 * 职责：管理下拉框开关状态、焦点索引等UI相关状态
 */
export const useSelectState = ({ open }: UseSelectStateProps = {}) => {
  // 下拉框开关状态（提取自原useSelect的internalOpen逻辑）
  const [internalOpen, setInternalOpen] = useState(false);

  // 焦点索引状态（为键盘导航预留）
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // 实际的打开状态（受控/非受控）
  const isOpen = open !== undefined ? open : internalOpen;

  // 处理下拉框开关
  const toggleOpen = useCallback(() => {
    if (open === undefined) {
      setInternalOpen(prev => !prev);
    }
  }, [open]);

  // 打开下拉框
  const openDropdown = useCallback(() => {
    if (open === undefined) {
      setInternalOpen(true);
    }
  }, [open]);

  // 关闭下拉框
  const closeDropdown = useCallback(() => {
    if (open === undefined) {
      setInternalOpen(false);
    }
  }, [open]);

  // 重置焦点索引
  const resetFocusedIndex = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  return {
    // 状态
    isOpen,
    focusedIndex,

    // 控制方法
    toggleOpen,
    openDropdown,
    closeDropdown,
    setFocusedIndex,
    resetFocusedIndex,
  };
};
