import { useState, useCallback, useEffect } from 'react';

/**
 * useNavigation - 图片导航 Hook
 * @description 管理图片索引状态，提供上一张/下一张切换功能
 * @param currentIndex - 当前图片索引
 * @param total - 图片总数
 * @param onIndexChange - 索引变化回调
 * @returns 包含内部索引及导航方法的对象
 */
export const useNavigation = (currentIndex: number, total: number, onIndexChange?: (index: number) => void) => {
  /** 内部维护的图片索引 */
  const [internalIndex, setInternalIndex] = useState(currentIndex);

  // 同步外部索引
  useEffect(() => {
    setInternalIndex(currentIndex);
  }, [currentIndex]);

  // 上一张
  const handlePrev = useCallback(() => {
    if (internalIndex > 0) {
      const newIndex = internalIndex - 1;
      setInternalIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [internalIndex, onIndexChange]);

  // 下一张
  const handleNext = useCallback(() => {
    if (internalIndex < total - 1) {
      const newIndex = internalIndex + 1;
      setInternalIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  }, [internalIndex, total, onIndexChange]);

  return {
    internalIndex,
    handlePrev,
    handleNext,
  };
};
