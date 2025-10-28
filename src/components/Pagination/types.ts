import React from 'react';
import { PaginationItemType } from './utils';

/**
 * 分页项类型（使用联合类型确保类型安全）
 */
export type PageItem =
  | { type: PaginationItemType.Page; value: number }
  | { type: PaginationItemType.Prev; value: string }
  | { type: PaginationItemType.Next; value: string };

export interface BasePaginationProps {
  current?: number;
  disabled?: boolean;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => React.ReactNode;
}

export interface PaginationListSpecificProps {
  totalPages: number;
  paginationItems: PageItem[];
  onPageItemClick: (pageItem: PageItem) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export interface PaginationListProps extends BasePaginationProps, PaginationListSpecificProps {
  current: number;
  disabled: boolean;
  prefixCls: string;
}

export interface PaginationSpecificProps {
  defaultCurrent?: number;
  total?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  showQuickJumper?: boolean;
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  hideOnSinglePage?: boolean;
  className?: string;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  simple?: boolean;
}

export interface PaginationProps extends Partial<BasePaginationProps>, Partial<PaginationSpecificProps> {}

export interface QuickJumperSpecificProps {
  totalPages: number;
  onJump: (targetPage: number) => void;
}

export interface QuickJumperProps
  extends QuickJumperSpecificProps,
    Required<Pick<BasePaginationProps, 'current'>>,
    Pick<BasePaginationProps, 'disabled'> {
  prefixCls: string;
}

export interface SizeChangerProps {
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (newSize: number) => void;
  disabled?: boolean;
  prefixCls: string;
}

/**
 * 导航按钮渲染函数参数类型
 */
export interface NavigationButtonParams {
  page: number;
  type: 'prev' | 'next';
  isDisabled: boolean;
  onClick: () => void;
  Icon: React.ComponentType;
  ariaLabel: string;
}
