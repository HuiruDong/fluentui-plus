import React, { useCallback, useRef, useEffect } from 'react';
import type { ImagePreviewProps } from './types';
import { prefixCls } from './constants';
import Toolbar from './Toolbar';
import Navigation from './Navigation';
import Counter from './Counter';
import { useTransform, useNavigation, useKeyboardShortcuts, useWheelZoom, useBodyScrollLock } from './hooks';

export interface PreviewContentProps extends ImagePreviewProps {
  /** 销毁回调，用于清理 Portal DOM */
  onDestroy: () => void;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  visible,
  images,
  currentIndex,
  onClose,
  onIndexChange,
  onDestroy,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const current = images[currentIndex];
  const total = images.length;
  const showNavigation = total > 1;

  // 变换状态
  const { scale, rotate, resetTransform, handleZoomIn, handleZoomOut, handleRotateLeft, handleRotateRight } =
    useTransform();

  // 导航状态
  const { internalIndex, handlePrev, handleNext } = useNavigation(currentIndex, total, onIndexChange);

  // 切换图片时重置状态
  useEffect(() => {
    resetTransform();
  }, [internalIndex, resetTransform]);

  // 关闭
  const handleClose = useCallback(() => {
    onClose();
    onDestroy();
  }, [onClose, onDestroy]);

  // 键盘快捷键
  useKeyboardShortcuts({
    onClose: handleClose,
    onPrev: handlePrev,
    onNext: handleNext,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    showNavigation,
  });

  // 滚轮缩放
  useWheelZoom(containerRef, handleZoomIn, handleZoomOut);

  // 禁用 body 滚动
  useBodyScrollLock();

  // 点击遮罩关闭
  const handleMaskClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!visible || !current) return null;

  const currentImage = images[internalIndex];
  const imageStyle: React.CSSProperties = {
    transform: `scale(${scale}) rotate(${rotate}deg)`,
  };

  return (
    <div ref={containerRef} className={prefixCls} onClick={handleMaskClick}>
      {/* 工具栏 */}
      <Toolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onClose={handleClose}
      />

      {/* 图片容器 */}
      <div className={`${prefixCls}-img-wrapper`}>
        <img className={`${prefixCls}-img`} src={currentImage.src} alt={currentImage.alt} style={imageStyle} />
      </div>

      {/* 左右导航 */}
      {showNavigation && (
        <Navigation currentIndex={internalIndex} total={total} onPrev={handlePrev} onNext={handleNext} />
      )}

      {/* 分页指示器 */}
      {showNavigation && <Counter currentIndex={internalIndex} total={total} />}
    </div>
  );
};

export default PreviewContent;
