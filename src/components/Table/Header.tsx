import React, { useMemo } from 'react';
import clsx from 'clsx';
import ColGroup from './ColGroup';
import SelectionColumn from './SelectionColumn';
import type { HeaderProps } from './types';
import { calculateFixedInfo, getFixedCellStyle } from './utils';

/**
 * Header 组件
 * 表格表头，支持固定表头
 */
const Header = <RecordType = Record<string, unknown>,>({
  columns,
  className,
  prefixCls,
  rowSelection,
  onSelectAll,
  selectedRowKeys,
  dataSource,
  rowKey,
}: HeaderProps<RecordType>) => {
  const fixedInfo = useMemo(() => calculateFixedInfo(columns), [columns]);

  // 计算选择状态
  const { isAllSelected, isIndeterminate } = useMemo(() => {
    if (!rowSelection || !dataSource || dataSource.length === 0) {
      return { isAllSelected: false, isIndeterminate: false };
    }

    const getRowKey = (record: RecordType, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return ((record as Record<string, unknown>)[rowKey as string] as string) ?? String(index);
    };

    const selectableKeys = dataSource
      .map((record, index) => {
        const key = getRowKey(record, index);
        const checkboxProps = rowSelection.getCheckboxProps?.(record);
        return checkboxProps?.disabled ? null : key;
      })
      .filter((key): key is string => key !== null);

    if (selectableKeys.length === 0) {
      return { isAllSelected: false, isIndeterminate: false };
    }

    const isAllSelected = selectableKeys.every(key => selectedRowKeys?.includes(key));
    const selectedCount = selectableKeys.filter(key => selectedRowKeys?.includes(key)).length;
    const isIndeterminate = selectedCount > 0 && selectedCount < selectableKeys.length;

    return { isAllSelected, isIndeterminate };
  }, [rowSelection, dataSource, selectedRowKeys, rowKey]);

  return (
    <table className={clsx(`${prefixCls}-header`, className)}>
      <ColGroup columns={columns} rowSelection={rowSelection} />
      <thead className={`${prefixCls}-thead`}>
        <tr>
          {/* 选择列 */}
          {rowSelection && (
            <th
              className={clsx(`${prefixCls}-cell`, `${prefixCls}-cell-header`, `${prefixCls}-cell-selection`, {
                [`${prefixCls}-cell-fixed-left`]: rowSelection.fixed,
              })}
              style={{
                width: rowSelection.columnWidth || 60,
                position: rowSelection.fixed ? 'sticky' : undefined,
                left: rowSelection.fixed ? 0 : undefined,
                zIndex: rowSelection.fixed ? 3 : undefined,
              }}
            >
              <SelectionColumn
                isAllSelected={isAllSelected}
                isIndeterminate={isIndeterminate}
                onSelectAll={onSelectAll!}
                rowSelection={rowSelection}
                prefixCls={prefixCls}
              />
            </th>
          )}

          {columns.map((column, index) => {
            const info = fixedInfo[index];
            // 使用工具函数生成固定列样式
            const style = getFixedCellStyle(info, 3);

            return (
              <th
                key={column.key}
                className={clsx(`${prefixCls}-cell`, `${prefixCls}-cell-header`, column.className, {
                  [`${prefixCls}-cell-align-${column.align}`]: column.align,
                  [`${prefixCls}-cell-fixed-left`]: info.fixed === 'left',
                  [`${prefixCls}-cell-fixed-right`]: info.fixed === 'right',
                  [`${prefixCls}-cell-fixed-left-last`]: info.isLastLeft,
                  [`${prefixCls}-cell-fixed-right-first`]: info.isFirstRight,
                })}
                style={style}
                title={typeof column.title === 'string' ? column.title : undefined}
              >
                {column.title}
              </th>
            );
          })}
        </tr>
      </thead>
    </table>
  );
};

export default Header;
