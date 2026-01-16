import { useState, useCallback } from 'react';
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../constants';

/**
 * useTransform - 图片变换 Hook
 * @description 提供图片的缩放和旋转功能
 * @returns 包含缩放比例、旋转角度及操作方法的对象
 */
export const useTransform = () => {
  /** 缩放比例 */
  const [scale, setScale] = useState(1);
  /** 旋转角度 */
  const [rotate, setRotate] = useState(0);

  // 重置变换状态
  const resetTransform = useCallback(() => {
    setScale(1);
    setRotate(0);
  }, []);

  // 放大
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + SCALE_STEP, MAX_SCALE));
  }, []);

  // 缩小
  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - SCALE_STEP, MIN_SCALE));
  }, []);

  // 左旋转
  const handleRotateLeft = useCallback(() => {
    setRotate(prev => prev - 90);
  }, []);

  // 右旋转
  const handleRotateRight = useCallback(() => {
    setRotate(prev => prev + 90);
  }, []);

  return {
    scale,
    rotate,
    resetTransform,
    handleZoomIn,
    handleZoomOut,
    handleRotateLeft,
    handleRotateRight,
  };
};
