import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { ImageProvider } from './context/ImageContext';
import ImagePreview from './ImagePreview';
import type { ImageGroupProps, ImageContextValue, PreviewImageInfo } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-image-group';

const ImageGroup: React.FC<ImageGroupProps> = ({ children, className, style, images: propImages }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesRef = useRef<Map<string, PreviewImageInfo>>(new Map());
  const orderRef = useRef<string[]>([]);

  // 将 propImages 转换为 PreviewImageInfo 数组
  const normalizedPropImages: PreviewImageInfo[] | undefined = propImages?.map((item, index) => {
    if (typeof item === 'string') {
      return { id: `prop-image-${index}`, src: item };
    }
    return item;
  });

  // 注册图片
  const registerImage = useCallback((info: PreviewImageInfo) => {
    if (!imagesRef.current.has(info.id)) {
      orderRef.current.push(info.id);
    }
    imagesRef.current.set(info.id, info);
  }, []);

  // 取消注册图片
  const unregisterImage = useCallback((id: string) => {
    imagesRef.current.delete(id);
    orderRef.current = orderRef.current.filter(item => item !== id);
  }, []);

  // 打开预览
  const openPreview = useCallback(
    (id: string) => {
      // 如果设置了 propImages，始终从第一张开始预览
      if (normalizedPropImages && normalizedPropImages.length > 0) {
        setCurrentIndex(0);
        setPreviewVisible(true);
        return;
      }
      const index = orderRef.current.indexOf(id);
      if (index !== -1) {
        setCurrentIndex(index);
        setPreviewVisible(true);
      }
    },
    [normalizedPropImages]
  );

  // 关闭预览
  const handleClosePreview = useCallback(() => {
    setPreviewVisible(false);
  }, []);

  // 切换索引
  const handleIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 获取图片列表（优先使用 propImages，否则按注册顺序）
  const getImageList = useCallback((): PreviewImageInfo[] => {
    if (normalizedPropImages && normalizedPropImages.length > 0) {
      return normalizedPropImages;
    }
    return orderRef.current.map(id => imagesRef.current.get(id)).filter((item): item is PreviewImageInfo => !!item);
  }, [normalizedPropImages]);

  const contextValue: ImageContextValue = {
    isGroup: true,
    registerImage,
    unregisterImage,
    openPreview,
  };

  const classes = clsx(prefixCls, className);

  return (
    <ImageProvider value={contextValue}>
      <div className={classes} style={style}>
        {children}
      </div>
      {previewVisible && (
        <ImagePreview
          visible={previewVisible}
          images={getImageList()}
          currentIndex={currentIndex}
          onClose={handleClosePreview}
          onIndexChange={handleIndexChange}
        />
      )}
    </ImageProvider>
  );
};

export default ImageGroup;
