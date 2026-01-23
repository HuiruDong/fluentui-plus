import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import clsx from 'clsx';
import { useImageContext } from './context';
import ImagePreview from './ImagePreview';
import Placeholder from './Placeholder';
import Fallback from './Fallback';
import type { ImageProps, ImageStatus, PreviewImageInfo } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-image';

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  lazy = false,
  placeholder,
  fallback,
  preview = true,
  previewSrc,
  fit = 'none',
  onLoad,
  onError,
  ...restProps
}) => {
  const uniqueId = useId();
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [isInView, setIsInView] = useState(!lazy);
  const [previewVisible, setPreviewVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const imageContext = useImageContext();
  const isInGroup = imageContext?.isGroup ?? false;

  // 注册到 ImageGroup
  useEffect(() => {
    if (!isInGroup || !imageContext) return;

    const imageInfo: PreviewImageInfo = {
      id: uniqueId,
      src: previewSrc || src || '',
      alt,
    };

    imageContext.registerImage(imageInfo);

    return () => {
      imageContext.unregisterImage(uniqueId);
    };
  }, [isInGroup, imageContext, uniqueId, src, previewSrc, alt]);

  // 懒加载 IntersectionObserver
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0,
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy]);

  // 图片加载处理
  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus('loaded');
      onLoad?.(e);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus('error');
      onError?.(e);
    },
    [onError]
  );

  // 点击图片打开预览
  const handleClick = useCallback(() => {
    if (!preview || status === 'error') return;

    if (isInGroup && imageContext) {
      imageContext.openPreview(uniqueId);
    } else {
      setPreviewVisible(true);
    }
  }, [preview, status, isInGroup, imageContext, uniqueId]);

  // 关闭预览
  const handleClosePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  const containerStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  // 只有指定了尺寸才显示 placeholder/fallback
  const hasSize = width !== undefined || height !== undefined;

  const classes = clsx(
    prefixCls,
    {
      [`${prefixCls}-loading`]: status === 'loading',
      [`${prefixCls}-error`]: status === 'error',
      [`${prefixCls}--previewable`]: preview && status === 'loaded',
    },
    className
  );

  const previewImages: PreviewImageInfo[] = [
    {
      id: uniqueId,
      src: previewSrc || src || '',
      alt,
    },
  ];

  return (
    <>
      <div ref={containerRef} className={classes} style={containerStyle} onClick={handleClick}>
        {status === 'error' ? (
          hasSize && <Fallback content={fallback} />
        ) : status === 'loaded' ? (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${prefixCls}-img`}
            style={{ objectFit: fit }}
            onLoad={handleLoad}
            onError={handleError}
            {...restProps}
          />
        ) : (
          <>
            {isInView && src && (
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`${prefixCls}-img`}
                style={{ objectFit: fit }}
                onLoad={handleLoad}
                onError={handleError}
                {...restProps}
              />
            )}
            {hasSize && <Placeholder content={placeholder} />}
          </>
        )}
      </div>
      {!isInGroup && previewVisible && (
        <ImagePreview visible={previewVisible} images={previewImages} currentIndex={0} onClose={handleClosePreview} />
      )}
    </>
  );
};

export default Image;
