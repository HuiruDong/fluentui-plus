import React, { useCallback, useEffect, useRef } from 'react';
import { computePosition, autoUpdate, offset, flip, shift, size } from '@floating-ui/dom';
import { useClickOutside } from './useClickOutside';

interface UseFloatingPositionProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  onClickOutside?: () => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  offsetDistance?: number;
  shiftPadding?: number;
}

export const useFloatingPosition = ({
  isOpen,
  triggerRef,
  onClickOutside,
  placement = 'bottom-start',
  offsetDistance = 4,
  shiftPadding = 8,
}: UseFloatingPositionProps) => {
  const floatingRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // 使用点击外部关闭 hook
  useClickOutside({
    isActive: isOpen,
    triggerRef,
    floatingRef,
    onClickOutside,
  });

  // 更新浮动元素位置
  const updatePosition = useCallback(() => {
    const triggerElement = triggerRef.current;
    const floatingElement = floatingRef.current;

    if (!triggerElement || !floatingElement) return;

    computePosition(triggerElement, floatingElement, {
      placement,
      middleware: [
        offset(offsetDistance), // 偏移量
        flip(), // 自动翻转到合适位置
        shift({ padding: shiftPadding }), // 确保不会超出视口
        size({
          apply({ availableWidth, availableHeight, elements }) {
            // 设置最大宽度和高度
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
      ],
    }).then(({ x, y }) => {
      Object.assign(floatingElement.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }, [triggerRef, placement, offsetDistance, shiftPadding]);

  // 设置定位和事件监听
  useEffect(() => {
    if (!isOpen) {
      // 清理自动更新
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }

    const triggerElement = triggerRef.current;
    const floatingElement = floatingRef.current;

    if (!triggerElement || !floatingElement) return;

    // 初始定位
    updatePosition();

    // 设置自动更新
    cleanupRef.current = autoUpdate(triggerElement, floatingElement, updatePosition);

    return () => {
      // 清理自动更新
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isOpen, triggerRef, updatePosition]);

  // 同步宽度到触发器宽度
  useEffect(() => {
    if (!isOpen) return;

    const triggerElement = triggerRef.current;
    const floatingElement = floatingRef.current;

    if (!triggerElement || !floatingElement) return;

    const resizeObserver = new ResizeObserver(() => {
      const triggerWidth = triggerElement.getBoundingClientRect().width;
      floatingElement.style.width = `${triggerWidth}px`;
      updatePosition(); // 宽度变化时重新定位
    });

    resizeObserver.observe(triggerElement);

    // 立即设置宽度
    const triggerWidth = triggerElement.getBoundingClientRect().width;
    floatingElement.style.width = `${triggerWidth}px`;

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, triggerRef, updatePosition]);

  return {
    floatingRef,
    updatePosition,
  };
};
