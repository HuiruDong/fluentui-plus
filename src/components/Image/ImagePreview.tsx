import React, { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import type { ImagePreviewProps } from './types';
import { prefixCls } from './constants';
import PreviewContent from './PreviewContent';
import './index.less';

const ImagePreview: React.FC<ImagePreviewProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (props.visible) {
      // 创建容器
      const container = document.createElement('div');
      container.className = `${prefixCls}-root`;
      document.body.appendChild(container);
      containerRef.current = container;

      // 创建 React Root
      const root = createRoot(container);
      rootRef.current = root;

      // 渲染内容
      const handleDestroy = () => {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
        if (containerRef.current) {
          document.body.removeChild(containerRef.current);
          containerRef.current = null;
        }
      };

      root.render(
        <FluentProvider theme={webLightTheme}>
          <PreviewContent {...props} onDestroy={handleDestroy} />
        </FluentProvider>
      );
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current);
        containerRef.current = null;
      }
    };
  }, [props.visible]);

  // 当 props 变化时更新
  useEffect(() => {
    if (props.visible && rootRef.current && containerRef.current) {
      const handleDestroy = () => {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
        if (containerRef.current) {
          document.body.removeChild(containerRef.current);
          containerRef.current = null;
        }
      };

      rootRef.current.render(
        <FluentProvider theme={webLightTheme}>
          <PreviewContent {...props} onDestroy={handleDestroy} />
        </FluentProvider>
      );
    }
  }, [props]);

  return null;
};

export default ImagePreview;
