import React from 'react';
import clsx from 'clsx';
import type { PaginationProps } from './types';
import { usePaginationState, usePaginationCalculations, usePaginationHandlers } from './hooks';
import PaginationList from './PaginationList';
import SimplePagination from './SimplePagination';
import QuickJumper from './QuickJumper';
import SizeChanger from './SizeChanger';
import TotalInfo from './TotalInfo';
import './index.less';

const prefixCls = 'fluentui-plus-pagination';

const Pagination: React.FC<PaginationProps> = ({
  current,
  defaultCurrent = 1,
  total = 0,
  pageSize = 10,
  onChange,
  showQuickJumper = false,
  showTotal = false,
  itemRender,
  hideOnSinglePage = false,
  className,
  disabled = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  simple = false,
}) => {
  // 状态管理
  const { current: currentPage, setCurrentPage } = usePaginationState(current, defaultCurrent, onChange);

  // 计算逻辑
  const { totalPages, shouldHide, paginationItems, currentRange } = usePaginationCalculations(
    currentPage,
    total,
    pageSize,
    hideOnSinglePage
  );

  // 事件处理
  const { handlePageItemClick, handlePrevClick, handleNextClick, handlePageSizeChange } = usePaginationHandlers(
    currentPage,
    totalPages,
    pageSize,
    total,
    disabled,
    setCurrentPage
  );

  if (shouldHide) {
    return null;
  }

  return (
    <div className={clsx(prefixCls, className, { [`${prefixCls}--disabled`]: disabled })}>
      <TotalInfo showTotal={showTotal} total={total} currentRange={currentRange} prefixCls={prefixCls} />
      {simple ? (
        <SimplePagination
          current={currentPage}
          totalPages={totalPages}
          disabled={disabled}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          onPageChange={page => setCurrentPage(page, pageSize)}
          itemRender={itemRender}
          prefixCls={prefixCls}
        />
      ) : (
        <PaginationList
          current={currentPage}
          totalPages={totalPages}
          paginationItems={paginationItems}
          disabled={disabled}
          onPageItemClick={handlePageItemClick}
          onPrevClick={handlePrevClick}
          onNextClick={handleNextClick}
          itemRender={itemRender}
          prefixCls={prefixCls}
        />
      )}
      {showSizeChanger && (
        <SizeChanger
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
          disabled={disabled}
          prefixCls={prefixCls}
        />
      )}
      {showQuickJumper && (
        <QuickJumper
          current={currentPage}
          totalPages={totalPages}
          disabled={disabled}
          onJump={targetPage => setCurrentPage(targetPage, pageSize)}
          prefixCls={prefixCls}
        />
      )}
    </div>
  );
};

export default Pagination;
