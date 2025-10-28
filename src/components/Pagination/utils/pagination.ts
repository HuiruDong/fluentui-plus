import { PageItem } from '../types';
import { PaginationItemType } from './constants';

// 常量定义
const DISPLAY_THRESHOLD = 5; // 全部显示的阈值
const BOUNDARY_RANGE = 3; // 边界范围（前3页或后3页）
const CENTER_RANGE = 2; // 中心页码的左右范围
const START_PAGE_COUNT = 5; // 开始位置显示的页数

/**
 * 生成分页项数组
 * @param current 当前页码
 * @param totalPages 总页数
 * @returns 分页项数组
 */
export const generatePaginationItems = (current: number, totalPages: number): PageItem[] => {
  // 边界处理：非法页数返回第一页
  if (totalPages <= 0) {
    return [{ value: 1, type: PaginationItemType.Page }];
  }

  const currentPage = Math.max(1, Math.min(current, totalPages));

  // 页数较少时，显示所有页码
  if (totalPages <= DISPLAY_THRESHOLD) {
    return createPageRange(1, totalPages);
  }

  // 根据当前页位置选择不同策略
  if (currentPage <= BOUNDARY_RANGE) {
    return generateStartItems(totalPages);
  }

  if (currentPage >= totalPages - CENTER_RANGE) {
    return generateEndItems(totalPages);
  }

  return generateMiddleItems(currentPage, totalPages);
};

/**
 * 创建连续页码范围
 */
const createPageRange = (start: number, end: number): PageItem[] => {
  const items: PageItem[] = [];
  for (let i = start; i <= end; i++) {
    items.push({ value: i, type: PaginationItemType.Page });
  }
  return items;
};

/**
 * 创建页码项
 */
const createPageItem = (value: number): PageItem => ({
  value,
  type: PaginationItemType.Page,
});

/**
 * 创建省略号项
 */
const createEllipsisItem = (type: PaginationItemType.Prev | PaginationItemType.Next): PageItem => ({
  value: '...',
  type,
});

/**
 * 生成开始位置的分页项（当前页在前3页）
 * 格式: 1 2 3 4 5 ... 10
 */
const generateStartItems = (totalPages: number): PageItem[] => {
  const items: PageItem[] = createPageRange(1, START_PAGE_COUNT);

  // 如果总页数大于6页，添加省略号和最后一页
  if (totalPages > START_PAGE_COUNT + 1) {
    items.push(createEllipsisItem(PaginationItemType.Next));
    items.push(createPageItem(totalPages));
  } else if (totalPages === START_PAGE_COUNT + 1) {
    items.push(createPageItem(totalPages));
  }

  return items;
};

/**
 * 生成结束位置的分页项（当前页在后3页）
 * 格式: 1 ... 6 7 8 9 10
 */
const generateEndItems = (totalPages: number): PageItem[] => {
  const items: PageItem[] = [createPageItem(1)];
  const startPage = totalPages - 4;

  if (startPage > 2) {
    items.push(createEllipsisItem(PaginationItemType.Prev));
  }

  items.push(...createPageRange(startPage, totalPages));

  return items;
};

/**
 * 生成中间位置的分页项（当前页在中间）
 * 格式: 1 ... 4 5 6 7 8 ... 10
 */
const generateMiddleItems = (currentPage: number, totalPages: number): PageItem[] => {
  const items: PageItem[] = [createPageItem(1)];

  const startPage = currentPage - CENTER_RANGE;
  const endPage = currentPage + CENTER_RANGE;

  // 添加前省略号
  if (startPage > 2) {
    items.push(createEllipsisItem(PaginationItemType.Prev));
  }

  // 添加中间页码
  items.push(...createPageRange(startPage, endPage));

  // 添加后省略号
  if (endPage < totalPages - 1) {
    items.push(createEllipsisItem(PaginationItemType.Next));
  }

  // 添加最后一页
  if (endPage < totalPages) {
    items.push(createPageItem(totalPages));
  }

  return items;
};
