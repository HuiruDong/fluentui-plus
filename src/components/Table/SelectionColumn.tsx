import React from 'react';
import Checkbox from '../Checkbox';
import type { RowSelection } from './types';

interface SelectionColumnProps<RecordType = Record<string, unknown>> {
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (selected: boolean) => void;
  rowSelection?: RowSelection<RecordType>;
  prefixCls: string;
}

/**
 * SelectionColumn 组件
 * 表格选择列表头
 */
const SelectionColumn = <RecordType = Record<string, unknown>,>({
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  rowSelection,
  prefixCls,
}: SelectionColumnProps<RecordType>) => {
  // 自定义标题
  if (rowSelection?.columnTitle !== undefined) {
    return <>{rowSelection.columnTitle}</>;
  }

  // 默认渲染全选 checkbox
  return (
    <Checkbox
      checked={isAllSelected}
      indeterminate={isIndeterminate}
      onChange={onSelectAll}
      className={`${prefixCls}-selection-checkbox`}
    />
  );
};

export default SelectionColumn;
