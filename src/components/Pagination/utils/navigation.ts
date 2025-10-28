import type { PageItem } from '../types';
import { PaginationItemType, JUMP_STEP } from './constants';

/**
 * 根据分页项计算目标页码
 * @param item 分页项
 * @param current 当前页码
 * @param totalPages 总页数
 * @returns 目标页码
 */
export const calculateTargetPage = (item: PageItem, current: number, totalPages: number): number => {
  switch (item.type) {
    case PaginationItemType.Page:
      // TypeScript 自动推断 item.value 为 number
      return item.value;
    case PaginationItemType.Prev:
      return Math.max(1, current - JUMP_STEP);
    case PaginationItemType.Next:
      return Math.min(totalPages, current + JUMP_STEP);
    default:
      return current;
  }
};
