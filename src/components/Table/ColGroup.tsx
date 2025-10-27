import React from 'react';
import type { ColGroupProps } from './types';

/**
 * ColGroup 组件
 * 用于定义表格列宽，确保表头和表体列对齐
 */
const ColGroup = <RecordType = Record<string, unknown>,>({ columns, rowSelection }: ColGroupProps<RecordType>) => {
  return (
    <colgroup>
      {/* 选择列 */}
      {rowSelection && <col style={{ width: rowSelection.columnWidth || 60 }} />}

      {/* 数据列 */}
      {columns.map(column => {
        const style: React.CSSProperties = {};
        if (column.width) {
          style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
        }
        return <col key={column.key} style={style} />;
      })}
    </colgroup>
  );
};

export default ColGroup;
