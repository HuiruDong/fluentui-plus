import React from 'react';
import { Button } from '@fluentui/react-components';
import clsx from 'clsx';
import { ChevronRightRegular, ChevronLeftRegular } from '@fluentui/react-icons';
import { PaginationItemType, ITEM_TYPE_CONFIG } from './utils';
import type { PageItem, PaginationListProps, NavigationButtonParams } from './types';

const PaginationList: React.FC<PaginationListProps> = ({
  current,
  totalPages,
  paginationItems,
  disabled,
  onPageItemClick,
  onPrevClick,
  onNextClick,
  itemRender,
  prefixCls,
}) => {
  const listPrefixCls = `${prefixCls}__list`;

  /**
   * 渲染自定义项目（如果提供了 itemRender）
   */
  const renderCustomItem = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => {
    return itemRender ? itemRender(page, type, element) : element;
  };

  /**
   * 渲染导航按钮（上一页/下一页）
   */
  const renderNavigationButton = ({ page, type, isDisabled, onClick, Icon, ariaLabel }: NavigationButtonParams) => {
    return renderCustomItem(
      page,
      type,
      <Button
        appearance='outline'
        disabled={isDisabled}
        onClick={onClick}
        icon={<Icon />}
        aria-label={ariaLabel}
        className={`${listPrefixCls}__button`}
      />
    );
  };

  /**
   * 渲染分页项按钮
   */
  const renderPageItemButton = (item: PageItem) => {
    let ariaLabel: string;
    let itemType: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

    if (item.type === PaginationItemType.Page) {
      const config = ITEM_TYPE_CONFIG[PaginationItemType.Page];
      ariaLabel = config.getAriaLabel(item.value as number);
      itemType = config.itemType;
    } else {
      const config = ITEM_TYPE_CONFIG[item.type];
      ariaLabel = config.ariaLabel;
      itemType = config.itemType;
    }

    // 生成稳定的 key 值
    const key = item.type === PaginationItemType.Page ? `page-${item.value}` : `${item.type}`;

    return (
      <li key={key}>
        <Button
          className={clsx(`${listPrefixCls}__button`, {
            [`${listPrefixCls}__button--active`]: item.value === current,
          })}
          appearance='outline'
          onClick={() => onPageItemClick(item)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-current={item.value === current ? 'page' : undefined}
        >
          {renderCustomItem(item.value as number, itemType, item.value)}
        </Button>
      </li>
    );
  };

  return (
    <ul className={listPrefixCls}>
      <li>
        {renderNavigationButton({
          page: current - 1,
          type: 'prev',
          isDisabled: disabled || current <= 1,
          onClick: onPrevClick,
          Icon: ChevronLeftRegular,
          ariaLabel: 'Previous Page',
        })}
      </li>
      {paginationItems.map(item => renderPageItemButton(item))}
      <li>
        {renderNavigationButton({
          page: current + 1,
          type: 'next',
          isDisabled: disabled || current === totalPages,
          onClick: onNextClick,
          Icon: ChevronRightRegular,
          ariaLabel: 'Next Page',
        })}
      </li>
    </ul>
  );
};

export default PaginationList;
