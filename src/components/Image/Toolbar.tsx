import React from 'react';
import {
  ZoomIn24Regular,
  ZoomOut24Regular,
  ArrowRotateClockwise24Regular,
  ArrowRotateCounterclockwise24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { prefixCls } from './constants';

export interface ToolbarProps {
  /** 放大回调 */
  onZoomIn: () => void;
  /** 缩小回调 */
  onZoomOut: () => void;
  /** 逆时针旋转回调 */
  onRotateLeft: () => void;
  /** 顺时针旋转回调 */
  onRotateRight: () => void;
  /** 关闭回调 */
  onClose: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onClose }) => (
  <div className={`${prefixCls}-toolbar`}>
    <button className={`${prefixCls}-toolbar-btn`} onClick={onZoomIn} title='放大'>
      <ZoomIn24Regular />
    </button>
    <button className={`${prefixCls}-toolbar-btn`} onClick={onZoomOut} title='缩小'>
      <ZoomOut24Regular />
    </button>
    <button className={`${prefixCls}-toolbar-btn`} onClick={onRotateLeft} title='逆时针旋转'>
      <ArrowRotateCounterclockwise24Regular />
    </button>
    <button className={`${prefixCls}-toolbar-btn`} onClick={onRotateRight} title='顺时针旋转'>
      <ArrowRotateClockwise24Regular />
    </button>
    <button className={`${prefixCls}-toolbar-btn`} onClick={onClose} title='关闭'>
      <Dismiss24Regular />
    </button>
  </div>
);

export default Toolbar;
