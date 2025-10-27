import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { RowProps } from './types';
import { get } from 'lodash';
import { calculateFixedInfo, getFixedCellStyle } from './utils';

/**
 * Row 组件
 * 表格行组件
 */
const Row = <RecordType = Record<string, unknown>,>({
  columns,
  record,
  index,
  rowKey,
  prefixCls,
}: RowProps<RecordType>) => {
  const fixedInfo = useMemo(() => calculateFixedInfo(columns), [columns]);

  return (
    <tr className={`${prefixCls}-row`} data-row-key={rowKey}>
      {columns.map((column, columnIndex) => {
        const info = fixedInfo[columnIndex];

        // 获取单元格的值
        let value: unknown;
        if (column.dataIndex) {
          if (Array.isArray(column.dataIndex)) {
            value = get(record, column.dataIndex);
          } else {
            value = (record as Record<string, unknown>)[column.dataIndex];
          }
        }

        // 渲染单元格内容
        const cellContent: React.ReactNode = column.render
          ? column.render(value, record, index)
          : (value as React.ReactNode);

        // 获取 title 属性值（用于 hover 时显示完整内容）
        const getCellTitle = () => {
          // 如果有自定义渲染函数，不显示 title
          if (column.render) {
            return undefined;
          }
          // 只有当内容是字符串或数字时才显示 title
          if (typeof value === 'string' || typeof value === 'number') {
            return String(value);
          }
          return undefined;
        };

        // 使用工具函数生成固定列样式
        const style = getFixedCellStyle(info, 2);

        return (
          <td
            key={column.key}
            className={clsx(`${prefixCls}-cell`, column.className, {
              [`${prefixCls}-cell-align-${column.align}`]: column.align,
              [`${prefixCls}-cell-fixed-left`]: info.fixed === 'left',
              [`${prefixCls}-cell-fixed-right`]: info.fixed === 'right',
              [`${prefixCls}-cell-fixed-left-last`]: info.isLastLeft,
              [`${prefixCls}-cell-fixed-right-first`]: info.isFirstRight,
            })}
            style={style}
            title={getCellTitle()}
          >
            {cellContent}
          </td>
        );
      })}
    </tr>
  );
};

export default Row;
