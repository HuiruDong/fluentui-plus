import React, { useState, useCallback, useMemo } from 'react';
import type { RowSelection } from '../types';

interface UseSelectionOptions<RecordType> {
  dataSource: RecordType[];
  rowKey: string | ((record: RecordType) => string);
  rowSelection?: RowSelection<RecordType>;
}

export const useSelection = <RecordType = Record<string, unknown>>({
  dataSource,
  rowKey,
  rowSelection,
}: UseSelectionOptions<RecordType>) => {
  // 内部状态管理选中的 keys
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<React.Key[]>([]);

  // 使用外部传入的 selectedRowKeys 或内部状态
  const selectedRowKeys = rowSelection?.selectedRowKeys ?? internalSelectedKeys;

  // 获取行的唯一 key
  const getRowKey = useCallback(
    (record: RecordType, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return ((record as Record<string, unknown>)[rowKey as string] as string) ?? String(index);
    },
    [rowKey]
  );

  // 获取所有可选择的行 keys（排除禁用的行）
  const selectableKeys = useMemo(() => {
    return dataSource
      .map((record, index) => {
        const key = getRowKey(record, index);
        const checkboxProps = rowSelection?.getCheckboxProps?.(record);
        return checkboxProps?.disabled ? null : key;
      })
      .filter((key): key is string => key !== null);
  }, [dataSource, getRowKey, rowSelection]);

  // 判断是否全选
  const isAllSelected = useMemo(() => {
    if (selectableKeys.length === 0) return false;
    return selectableKeys.every(key => selectedRowKeys.includes(key));
  }, [selectableKeys, selectedRowKeys]);

  // 判断是否半选
  const isIndeterminate = useMemo(() => {
    if (selectableKeys.length === 0) return false;
    const selectedCount = selectableKeys.filter(key => selectedRowKeys.includes(key)).length;
    return selectedCount > 0 && selectedCount < selectableKeys.length;
  }, [selectableKeys, selectedRowKeys]);

  // 处理单行选择
  const handleSelect = useCallback(
    (key: React.Key, selected: boolean) => {
      let newSelectedKeys: React.Key[];

      if (selected) {
        newSelectedKeys = [...selectedRowKeys, key];
      } else {
        newSelectedKeys = selectedRowKeys.filter(k => k !== key);
      }

      // 如果有外部传入的 onChange，调用它
      if (rowSelection?.onChange) {
        const selectedRecords = dataSource.filter((r, index) => {
          const rKey = getRowKey(r, index);
          return newSelectedKeys.includes(rKey);
        });
        rowSelection.onChange(newSelectedKeys, selectedRecords);
      }

      // 更新内部状态
      if (!rowSelection?.selectedRowKeys) {
        setInternalSelectedKeys(newSelectedKeys);
      }
    },
    [dataSource, getRowKey, rowSelection, selectedRowKeys]
  );

  // 处理全选
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      let newSelectedKeys: React.Key[];

      if (selected) {
        // 全选：选择所有可选择的行
        newSelectedKeys = [...selectableKeys];
      } else {
        // 取消全选：清空选择
        newSelectedKeys = [];
      }

      // 如果有外部传入的 onChange，调用它
      if (rowSelection?.onChange) {
        const selectedRecords = dataSource.filter((r, index) => {
          const rKey = getRowKey(r, index);
          return newSelectedKeys.includes(rKey);
        });
        rowSelection.onChange(newSelectedKeys, selectedRecords);
      }

      // 更新内部状态
      if (!rowSelection?.selectedRowKeys) {
        setInternalSelectedKeys(newSelectedKeys);
      }
    },
    [dataSource, getRowKey, rowSelection, selectableKeys]
  );

  return {
    selectedRowKeys,
    isAllSelected,
    isIndeterminate,
    handleSelect,
    handleSelectAll,
    getRowKey,
  };
};
