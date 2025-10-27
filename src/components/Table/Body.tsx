import React from 'react';
import clsx from 'clsx';
import ColGroup from './ColGroup';
import Row from './Row';
import type { BodyProps } from './types';

/**
 * Body 组件
 * 表格主体，支持虚拟滚动（基础版本暂时渲染所有行）
 */
const Body = <RecordType = Record<string, unknown>,>({
  columns,
  dataSource,
  rowKey,
  className,
  emptyText = '暂无数据',
  prefixCls,
  rowSelection,
  selectedRowKeys,
  onSelect,
}: BodyProps<RecordType>) => {
  // 获取行的唯一 key
  const getRowKey = (record: RecordType, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return ((record as Record<string, unknown>)[rowKey as string] as string) ?? String(index);
  };

  // 空状态
  const isEmpty = dataSource.length === 0;

  return (
    <table className={clsx(`${prefixCls}-body`, className)}>
      <ColGroup columns={columns} rowSelection={rowSelection} />
      <tbody className={`${prefixCls}-tbody`}>
        {isEmpty ? (
          <tr className={`${prefixCls}-empty-row`}>
            <td colSpan={columns.length + (rowSelection ? 1 : 0)} className={`${prefixCls}-empty`}>
              {emptyText}
            </td>
          </tr>
        ) : (
          dataSource.map((record, index) => {
            const key = getRowKey(record, index);
            const selected = selectedRowKeys?.includes(key) || false;

            return (
              <Row
                key={key}
                columns={columns}
                record={record}
                index={index}
                rowKey={key}
                prefixCls={prefixCls}
                rowSelection={rowSelection}
                selected={selected}
                onSelect={
                  onSelect
                    ? (checked: boolean) => {
                        onSelect(key, checked);
                      }
                    : undefined
                }
              />
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default Body;
