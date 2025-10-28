import React from 'react';

interface TotalInfoProps {
  showTotal: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  total: number;
  currentRange: [number, number];
  prefixCls: string;
}

/**
 * 分页总数显示组件
 */
const TotalInfo: React.FC<TotalInfoProps> = ({ showTotal, total, currentRange, prefixCls }) => {
  if (!showTotal) return null;

  const content = typeof showTotal === 'function' ? showTotal(total, currentRange) : `共 ${total} 条`;

  return <div className={`${prefixCls}__total`}>{content}</div>;
};

export default TotalInfo;
