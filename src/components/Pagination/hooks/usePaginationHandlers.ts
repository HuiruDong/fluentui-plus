import { useCallback } from 'react';
import { calculateTargetPage } from '../utils';
import type { PageItem } from '../types';

/**
 * 分页事件处理逻辑 Hook
 * 处理所有与用户交互相关的事件处理函数
 */
export const usePaginationHandlers = (
  current: number,
  totalPages: number,
  pageSize: number,
  total: number,
  disabled: boolean,
  setCurrentPage: (page: number, size: number) => void
) => {
  // 处理页码项点击（包括页码、快速跳转前后）
  const handlePageItemClick = useCallback(
    (p: PageItem) => {
      if (disabled || p.value === current) return;

      const newPage = calculateTargetPage(p, current, totalPages);
      setCurrentPage(newPage, pageSize);
    },
    [current, totalPages, pageSize, setCurrentPage, disabled]
  );

  // 处理上一页点击
  const handlePrevClick = useCallback(() => {
    if (disabled || current <= 1) return;

    const newPage = current - 1;
    setCurrentPage(newPage, pageSize);
  }, [current, pageSize, setCurrentPage, disabled]);

  // 处理下一页点击
  const handleNextClick = useCallback(() => {
    if (disabled || current >= totalPages) return;

    const newPage = current + 1;
    setCurrentPage(newPage, pageSize);
  }, [current, totalPages, pageSize, setCurrentPage, disabled]);

  // 处理每页条数变化
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      // 计算新的总页数
      const newTotalPages = Math.ceil(total / newSize);
      // 如果当前页码超出新的总页数，调整到最后一页；否则保持当前页码不变
      const newPage = Math.min(current, newTotalPages);
      setCurrentPage(newPage, newSize);
    },
    [current, total, setCurrentPage]
  );

  return {
    handlePageItemClick,
    handlePrevClick,
    handleNextClick,
    handlePageSizeChange,
  };
};
