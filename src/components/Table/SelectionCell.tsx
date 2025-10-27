import React from 'react';
import Checkbox from '../Checkbox';
import type { RowSelection, CheckboxProps } from './types';

interface SelectionCellProps<RecordType = Record<string, unknown>> {
  record: RecordType;
  index: number;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  rowSelection?: RowSelection<RecordType>;
  prefixCls: string;
}

/**
 * SelectionCell 组件
 * 表格行选择单元格
 */
const SelectionCell = <RecordType = Record<string, unknown>,>({
  record,
  index,
  selected,
  onSelect,
  rowSelection,
  prefixCls,
}: SelectionCellProps<RecordType>) => {
  // 获取 checkbox 配置
  const checkboxProps: CheckboxProps<RecordType> | undefined = rowSelection?.getCheckboxProps?.(record);

  // 如果有自定义渲染，使用自定义渲染
  if (checkboxProps?.render) {
    return <>{checkboxProps.render(record, index)}</>;
  }

  // 默认渲染 checkbox
  return (
    <Checkbox
      checked={selected}
      onChange={onSelect}
      disabled={checkboxProps?.disabled}
      className={`${prefixCls}-selection-checkbox`}
    />
  );
};

export default SelectionCell;
