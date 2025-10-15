import React from 'react';

/**
 * API 表格样式 Hook
 * 提取所有页面中重复的 API 表格样式，统一管理
 */
export const useApiTableStyles = () => {
  // 基础表格样式
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  // 带底部间距的表格样式
  const tableWithMarginStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '32px',
  };

  // 表头单元格样式
  const thStyle: React.CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
  };

  // 表格单元格样式
  const tdStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
  };

  return {
    tableStyle,
    tableWithMarginStyle,
    thStyle,
    tdStyle,
  };
};
