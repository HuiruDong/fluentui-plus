import React from 'react';
import type { ColumnType } from '../types';

/**
 * 固定列的位置信息
 */
export interface FixedInfo {
  fixed?: 'left' | 'right';
  left?: number;
  right?: number;
  isLastLeft?: boolean;
  isFirstRight?: boolean;
}

/**
 * 计算列宽度（转换为数字）
 */
const getColumnWidth = <RecordType = Record<string, unknown>>(column: ColumnType<RecordType>): number => {
  if (typeof column.width === 'number') {
    return column.width;
  }
  if (typeof column.width === 'string') {
    return parseInt(column.width, 10) || 0;
  }
  return 0;
};

/**
 * 计算固定列的偏移量信息
 * @param columns 列配置
 * @returns 每列的固定信息数组
 */
export const calculateFixedInfo = <RecordType = Record<string, unknown>>(
  columns: ColumnType<RecordType>[]
): FixedInfo[] => {
  const fixedInfo: FixedInfo[] = [];

  let leftOffset = 0;
  let rightOffset = 0;

  // 找到最后一个左固定列和第一个右固定列的索引
  let lastLeftIndex = -1;
  let firstRightIndex = -1;

  columns.forEach((column, index) => {
    if (column.fixed === 'left') {
      lastLeftIndex = index;
    }
    if (column.fixed === 'right' && firstRightIndex === -1) {
      firstRightIndex = index;
    }
  });

  // 从左到右计算左固定列的偏移量
  columns.forEach((column, index) => {
    const info: FixedInfo = {
      fixed: column.fixed,
    };

    if (column.fixed === 'left') {
      info.left = leftOffset;
      info.isLastLeft = index === lastLeftIndex;
      leftOffset += getColumnWidth(column);
    }

    fixedInfo.push(info);
  });

  // 从右到左计算右固定列的偏移量
  for (let i = columns.length - 1; i >= 0; i--) {
    const column = columns[i];

    if (column.fixed === 'right') {
      fixedInfo[i].right = rightOffset;
      fixedInfo[i].isFirstRight = i === firstRightIndex;
      rightOffset += getColumnWidth(column);
    }
  }

  return fixedInfo;
};

/**
 * 获取固定列的样式
 * @param info 固定列信息
 * @param zIndex z-index 值（表头和表体可能不同）
 * @returns CSS 样式对象
 */
export const getFixedCellStyle = (info: FixedInfo, zIndex: number): React.CSSProperties => {
  if (!info.fixed) {
    return {};
  }

  const style: React.CSSProperties = {
    position: 'sticky',
    zIndex,
  };

  if (info.fixed === 'left' && info.left !== undefined) {
    style.left = info.left;
  }

  if (info.fixed === 'right' && info.right !== undefined) {
    style.right = info.right;
  }

  return style;
};
