import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import Header from './Header';
import Body from './Body';
import { useSelection, usePagination } from './hooks';
import { Pagination } from '../Pagination';
import type { TableProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-table';

/**
 * Table 组件
 * 基于 rc-table 实现逻辑的基础表格组件
 * 支持数据渲染和 scroll 配置
 */
const Table = <RecordType = Record<string, unknown>,>({
  dataSource = [],
  columns = [],
  rowKey = 'key',
  scroll,
  className,
  style,
  showHeader = true,
  bordered = false,
  emptyText = '暂无数据',
  rowSelection,
  pagination,
}: TableProps<RecordType>) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // 使用分页 hook
  const { paginatedData, paginationConfig, currentPage, pageSize, handlePaginationChange } = usePagination({
    dataSource,
    pagination,
  });

  // 使用选择 hook
  const { selectedRowKeys, handleSelect, handleSelectAll } = useSelection({
    dataSource: paginatedData,
    rowKey,
    rowSelection,
  });

  // 同步表头和表体的横向滚动
  useEffect(() => {
    if (!scroll?.x || !headerRef.current || !bodyRef.current) {
      return;
    }

    const bodyElement = bodyRef.current;
    const headerElement = headerRef.current;
    let rafId: number | null = null;

    const handleScroll = () => {
      // 取消之前的 RAF，避免重复调用
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // 在下一帧同步滚动位置，确保与浏览器渲染同步
      rafId = requestAnimationFrame(() => {
        if (headerElement) {
          headerElement.scrollLeft = bodyElement.scrollLeft;
        }
      });
    };

    bodyElement.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      bodyElement.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scroll?.x]);

  // 计算容器样式
  const containerStyle: React.CSSProperties = { ...style };

  // 处理纵向滚动
  const hasScrollY = scroll?.y !== undefined;
  const bodyStyle: React.CSSProperties = {};
  if (hasScrollY) {
    bodyStyle.maxHeight = typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y;
    bodyStyle.overflowY = 'auto';
  }

  // 处理横向滚动
  const hasScrollX = scroll?.x !== undefined;
  const tableStyle: React.CSSProperties = {};
  if (hasScrollX && scroll.x !== true) {
    // 设置 minWidth 而不是 width，让表格在容器宽度足够时可以撑满
    tableStyle.minWidth = typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x;
    tableStyle.width = '100%';
  }

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--scroll-x`]: hasScrollX,
      [`${prefixCls}--scroll-y`]: hasScrollY,
      [`${prefixCls}--has-selection`]: rowSelection,
    },
    className
  );

  const wrapperClasses = clsx(`${prefixCls}-wrapper`, {
    [`${prefixCls}-wrapper--with-pagination`]: paginationConfig !== false,
  });

  return (
    <div className={wrapperClasses} style={containerStyle}>
      {/* 表格容器 */}
      <div className={classes}>
        {/* 表头容器 */}
        {showHeader && (
          <div
            ref={headerRef}
            className={`${prefixCls}-header-wrapper`}
            style={{
              overflowX: hasScrollX ? 'hidden' : undefined,
              overflowY: hasScrollY ? 'scroll' : undefined,
            }}
          >
            <div style={tableStyle}>
              <Header
                columns={columns}
                prefixCls={prefixCls}
                rowSelection={rowSelection}
                onSelectAll={handleSelectAll}
                selectedRowKeys={selectedRowKeys}
                dataSource={paginatedData}
                rowKey={rowKey}
              />
            </div>
          </div>
        )}

        {/* 表体容器 */}
        <div
          ref={bodyRef}
          className={`${prefixCls}-body-wrapper`}
          style={{
            ...bodyStyle,
            overflowX: hasScrollX ? 'auto' : undefined,
          }}
        >
          <div style={tableStyle}>
            <Body
              columns={columns}
              dataSource={paginatedData}
              rowKey={rowKey}
              emptyText={emptyText}
              prefixCls={prefixCls}
              rowSelection={rowSelection}
              selectedRowKeys={selectedRowKeys}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>

      {/* 分页器 */}
      {paginationConfig !== false && (
        <div className={`${prefixCls}-pagination`}>
          <Pagination
            {...paginationConfig}
            total={dataSource.length}
            current={paginationConfig.current ?? currentPage}
            pageSize={paginationConfig.pageSize ?? pageSize}
            onChange={handlePaginationChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
export type { TableProps, ColumnType, ScrollConfig, RowSelection, CheckboxProps } from './types';
