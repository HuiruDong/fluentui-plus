import React, { useMemo } from 'react';
import clsx from 'clsx';
import ColGroup from './ColGroup';
import type { HeaderProps } from './types';
import { calculateFixedInfo, getFixedCellStyle } from './utils';

/**
 * Header 组件
 * 表格表头，支持固定表头
 */
const Header = <RecordType = Record<string, unknown>,>({ columns, className, prefixCls }: HeaderProps<RecordType>) => {
  const fixedInfo = useMemo(() => calculateFixedInfo(columns), [columns]);

  return (
    <table className={clsx(`${prefixCls}-header`, className)}>
      <ColGroup columns={columns} />
      <thead className={`${prefixCls}-thead`}>
        <tr>
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
