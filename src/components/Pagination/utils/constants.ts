export enum PaginationItemType {
  Page = 'Page',
  Prev = 'Prev',
  Next = 'Next',
}

export const JUMP_STEP = 5;

/**
 * 分页项类型配置映射
 */
export const ITEM_TYPE_CONFIG = {
  [PaginationItemType.Prev]: {
    itemType: 'jump-prev' as const,
    ariaLabel: 'Previous 5 Pages',
  },
  [PaginationItemType.Next]: {
    itemType: 'jump-next' as const,
    ariaLabel: 'Next 5 Pages',
  },
  [PaginationItemType.Page]: {
    itemType: 'page' as const,
    getAriaLabel: (value: number) => `Page ${value}`,
  },
};
