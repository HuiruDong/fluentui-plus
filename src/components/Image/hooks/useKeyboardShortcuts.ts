import { useEffect } from 'react';

/**
 * 键盘快捷键配置选项
 */
interface KeyboardShortcutsOptions {
  /** 关闭预览回调 */
  onClose: () => void;
  /** 上一张图片回调 */
  onPrev: () => void;
  /** 下一张图片回调 */
  onNext: () => void;
  /** 放大回调 */
  onZoomIn: () => void;
  /** 缩小回调 */
  onZoomOut: () => void;
  /** 是否显示导航（决定左右键是否生效） */
  showNavigation: boolean;
}

/**
 * useKeyboardShortcuts - 键盘快捷键 Hook
 * @description 为图片预览添加键盘快捷键支持
 */
export const useKeyboardShortcuts = ({
  onClose,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  showNavigation,
}: KeyboardShortcutsOptions) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (showNavigation) onPrev();
          break;
        case 'ArrowRight':
          if (showNavigation) onNext();
          break;
        case '+':
        case '=':
          onZoomIn();
          break;
        case '-':
          onZoomOut();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext, onZoomIn, onZoomOut, showNavigation]);
};
