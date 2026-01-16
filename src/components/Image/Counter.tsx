import React from 'react';
import { prefixCls } from './constants';

export interface CounterProps {
  /** 当前图片索引（从 0 开始） */
  currentIndex: number;
  /** 图片总数 */
  total: number;
}

const Counter: React.FC<CounterProps> = ({ currentIndex, total }) => (
  <div className={`${prefixCls}-counter`}>
    第 {currentIndex + 1} / {total} 张
  </div>
);

export default Counter;
