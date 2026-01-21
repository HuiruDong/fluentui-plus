import React from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size, useDismiss, useInteractions } from '@floating-ui/react';

interface UseFloatingPositionProps {
  isOpen: boolean;
  triggerRef?: React.RefObject<HTMLElement>;
  onClickOutside?: () => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  offsetDistance?: number;
  shiftPadding?: number;
  matchTriggerWidth?: boolean;
}

export const useFloatingPosition = ({
  isOpen,
  triggerRef,
  onClickOutside,
  placement = 'bottom-start',
  offsetDistance = 0,
  shiftPadding = 8,
  matchTriggerWidth = true,
}: UseFloatingPositionProps) => {
  const { refs, floatingStyles, context, update } = useFloating({
    open: isOpen,
    placement,
    middleware: [
      offset(offsetDistance),
      flip(),
      shift({ padding: shiftPadding }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          const styles: Record<string, string> = {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          };

          // 不在这里设置 width，改为在外部手动控制
          Object.assign(elements.floating.style, styles);
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // 手动控制宽度
  React.useEffect(() => {
    if (isOpen && refs.floating.current && refs.reference.current) {
      const floatingEl = refs.floating.current;
      const referenceEl = refs.reference.current;

      if (matchTriggerWidth) {
        const referenceWidth = referenceEl.getBoundingClientRect().width;
        floatingEl.style.width = `${referenceWidth}px`;
      } else {
        floatingEl.style.width = 'auto';
      }
    }
  }, [isOpen, matchTriggerWidth, refs.floating, refs.reference]);

  // 处理点击外部关闭
  const dismiss = useDismiss(context, {
    outsidePress: () => {
      onClickOutside?.();
      return true;
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  // 如果传入了 triggerRef，则使用传入的 ref
  React.useEffect(() => {
    if (triggerRef?.current) {
      refs.setReference(triggerRef.current);
    }
  }, [triggerRef, refs.setReference]);

  return {
    triggerRef: refs.setReference,
    floatingRef: refs.setFloating,
    floatingStyles,
    updatePosition: update,
    getReferenceProps,
    getFloatingProps,
  };
};
