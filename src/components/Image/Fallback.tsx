import React from 'react';

const prefixCls = 'fluentui-plus-image';

export interface FallbackProps {
  /** 自定义错误内容，不传则显示默认错误提示 */
  content?: React.ReactNode;
}

const Fallback: React.FC<FallbackProps> = ({ content }) => {
  if (content) {
    return <div className={`${prefixCls}-fallback`}>{content}</div>;
  }
  return (
    <div className={`${prefixCls}-fallback`}>
      <div className={`${prefixCls}-fallback-icon`}>
        <svg viewBox='0 0 1024 1024' width='48' height='48' fill='currentColor'>
          <path d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z' />
        </svg>
      </div>
      <span className={`${prefixCls}-fallback-text`}>加载失败</span>
    </div>
  );
};

export default Fallback;
