import React from 'react';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { prefixCls } from './constants';

export interface NavigationProps {
  /** 当前图片索引 */
  currentIndex: number;
  /** 图片总数 */
  total: number;
  /** 上一张回调 */
  onPrev: () => void;
  /** 下一张回调 */
  onNext: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentIndex, total, onPrev, onNext }) => (
  <>
    <button className={`${prefixCls}-nav ${prefixCls}-nav-prev`} onClick={onPrev} disabled={currentIndex === 0}>
      <ChevronLeft24Regular />
    </button>
    <button className={`${prefixCls}-nav ${prefixCls}-nav-next`} onClick={onNext} disabled={currentIndex === total - 1}>
      <ChevronRight24Regular />
    </button>
  </>
);

export default Navigation;
