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

  // 处理容器创建和销毁，仅依赖 visible 变化
  // props 变化时的重新渲染由下方的 useEffect 处理
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
      // 使用 setTimeout 延迟 unmount，避免在 React 渲染期间同步卸载导致竞态条件
      // 参考: https://github.com/facebook/react/issues/25675
      const root = rootRef.current;
      const container = containerRef.current;
      rootRef.current = null;
      containerRef.current = null;

      setTimeout(() => {
        if (root) {
          root.unmount();
        }
        if (container && document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
