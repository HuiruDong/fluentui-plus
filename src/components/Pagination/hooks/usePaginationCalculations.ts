import { useMemo } from 'react';
import { generatePaginationItems } from '../utils';

/**
 * 分页计算逻辑 Hook
 * 处理所有与计算相关的逻辑：总页数、页码列表、当前范围等
 */
export const usePaginationCalculations = (
  current: number,
  total: number,
  pageSize: number,
  hideOnSinglePage: boolean
) => {
  // 计算总页数
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  // 是否隐藏分页器
  const shouldHide = useMemo(() => hideOnSinglePage && totalPages <= 1, [hideOnSinglePage, totalPages]);

  // 生成页码列表
  const paginationItems = useMemo(() => generatePaginationItems(current, totalPages), [current, totalPages]);

  // 计算当前页显示的数据范围
  const currentRange = useMemo<[number, number]>(() => {
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    return [start, end];
  }, [current, pageSize, total]);

  return {
    totalPages,
    shouldHide,
    paginationItems,
    currentRange,
  };
};
