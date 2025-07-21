import React, { useCallback, useEffect } from 'react';

interface UseClickOutsideProps {
  isActive: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  floatingRef: React.RefObject<HTMLElement>;
  onClickOutside?: () => void;
}

export const useClickOutside = ({ isActive, triggerRef, floatingRef, onClickOutside }: UseClickOutsideProps) => {
  // 处理点击外部关闭
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      const triggerElement = triggerRef.current;
      const floatingElement = floatingRef.current;

      if (triggerElement && floatingElement && !triggerElement.contains(target) && !floatingElement.contains(target)) {
        onClickOutside?.();
      }
    },
    [triggerRef, floatingRef, onClickOutside]
  );

  // 设置事件监听
  useEffect(() => {
    if (!isActive) {
      return;
    }

    // 添加事件监听
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // 清理事件监听
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, handleClickOutside]);

  return {
    handleClickOutside,
  };
};
