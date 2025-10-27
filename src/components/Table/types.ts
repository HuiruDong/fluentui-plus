import React from 'react';

/**
 * 列定义类型
 */
export interface ColumnType<RecordType = Record<string, unknown>> {
  /**
   * 列的唯一标识
   */
  key: string;
  /**
   * 列头显示的文字
   */
  title: React.ReactNode;
  /**
   * 数据在数据项中对应的路径
   */
  dataIndex?: string | string[];
  /**
   * 列宽度
   */
  width?: number | string;
  /**
   * 自定义渲染函数
   */
  render?: (value: unknown, record: RecordType, index: number) => React.ReactNode;
  /**
   * 列的对齐方式
   */
  align?: 'left' | 'center' | 'right';
  /**
   * 列的类名
   */
  className?: string;
  /**
   * 固定列
   */
  fixed?: 'left' | 'right';
}

/**
 * 滚动配置
 */
export interface ScrollConfig {
  /**
   * 横向滚动宽度
   */
  x?: number | string | true;
  /**
   * 纵向滚动高度
   */
  y?: number | string;
}

/**
 * 选择框配置
 */
export interface CheckboxProps<RecordType = Record<string, unknown>> {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 自定义渲染
   */
  render?: (record: RecordType, index: number) => React.ReactNode;
}

/**
 * 行选择配置
 */
export interface RowSelection<RecordType = Record<string, unknown>> {
  /**
   * 选中的行 key 数组
   */
  selectedRowKeys?: React.Key[];
  /**
   * 选中项发生变化时的回调
   */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: RecordType[]) => void;
  /**
   * 获取选择框的属性
   */
  getCheckboxProps?: (record: RecordType) => CheckboxProps<RecordType>;
  /**
   * 固定选择列
   */
  fixed?: boolean;
  /**
   * 选择列的宽度
   */
  columnWidth?: number | string;
  /**
   * 选择列的标题
   */
  columnTitle?: React.ReactNode;
}

/**
 * Table 组件属性
 */
export interface TableProps<RecordType = Record<string, unknown>> {
  /**
   * 数据源
   */
  dataSource: RecordType[];
  /**
   * 列配置
   */
  columns: ColumnType<RecordType>[];
  /**
   * 数据行的 key，用于优化渲染
   */
  rowKey?: string | ((record: RecordType) => string);
  /**
   * 滚动配置
   */
  scroll?: ScrollConfig;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
  /**
   * 是否显示表头
   */
  showHeader?: boolean;
  /**
   * 表格是否可滚动
   */
  bordered?: boolean;
  /**
   * 是否显示边框
   */
  emptyText?: React.ReactNode;
  /**
   * 行选择配置
   */
  rowSelection?: RowSelection<RecordType>;
}

/**
 * ColGroup 组件属性
 */
export interface ColGroupProps<RecordType = Record<string, unknown>> {
  columns: ColumnType<RecordType>[];
  rowSelection?: RowSelection<RecordType>;
}

/**
 * Header 组件属性
 */
export interface HeaderProps<RecordType = Record<string, unknown>> {
  columns: ColumnType<RecordType>[];
  className?: string;
  prefixCls: string;
  rowSelection?: RowSelection<RecordType>;
  onSelectAll?: (selected: boolean) => void;
  selectedRowKeys?: React.Key[];
  dataSource?: RecordType[];
  rowKey?: string | ((record: RecordType) => string);
}

/**
 * Body 组件属性
 */
export interface BodyProps<RecordType = Record<string, unknown>> {
  columns: ColumnType<RecordType>[];
  dataSource: RecordType[];
  rowKey: string | ((record: RecordType) => string);
  className?: string;
  emptyText?: React.ReactNode;
  prefixCls: string;
  rowSelection?: RowSelection<RecordType>;
  selectedRowKeys?: React.Key[];
  onSelect?: (key: React.Key, selected: boolean) => void;
}

/**
 * Row 组件属性
 */
export interface RowProps<RecordType = Record<string, unknown>> {
  columns: ColumnType<RecordType>[];
  record: RecordType;
  index: number;
  rowKey: string;
  prefixCls: string;
  rowSelection?: RowSelection<RecordType>;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}
