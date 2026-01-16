import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagePreview from '../ImagePreview';
import type { ImagePreviewProps } from '../types';

// Mock FluentProvider
jest.mock('@fluentui/react-components', () => ({
  FluentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  webLightTheme: {},
}));

// Mock PreviewContent
jest.mock('../PreviewContent', () => {
  const MockPreviewContent = ({
    visible,
    images,
    currentIndex,
    onClose,
    onDestroy,
  }: {
    visible: boolean;
    images: Array<{ id: string; src: string; alt?: string }>;
    currentIndex: number;
    onClose: () => void;
    onDestroy: () => void;
  }) => {
    if (!visible) return null;
    return (
      <div data-testid='preview-content'>
        <img src={images[currentIndex]?.src} alt={images[currentIndex]?.alt} data-testid='preview-image' />
        <span data-testid='current-index'>{currentIndex}</span>
        <span data-testid='total-images'>{images.length}</span>
        <button
          data-testid='close-preview'
          onClick={() => {
            onClose();
            onDestroy();
          }}
        >
          Close
        </button>
      </div>
    );
  };
  return MockPreviewContent;
});

describe('ImagePreview Component', () => {
  const mockImages = [
    { id: '1', src: 'https://example.com/image1.jpg', alt: 'Image 1' },
    { id: '2', src: 'https://example.com/image2.jpg', alt: 'Image 2' },
  ];

  const defaultProps: ImagePreviewProps = {
    visible: true,
    images: mockImages,
    currentIndex: 0,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 清理 Portal 容器
    const portals = document.querySelectorAll('.fluentui-plus-image-preview-modal-root');
    portals.forEach(portal => portal.remove());
  });

  describe('显示/隐藏', () => {
    it('visible 为 true 时应创建 Portal 容器', async () => {
      render(<ImagePreview {...defaultProps} />);

      await waitFor(() => {
        expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).toBeInTheDocument();
      });
    });

    it('visible 为 false 时不应创建 Portal 容器', () => {
      render(<ImagePreview {...defaultProps} visible={false} />);
      expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).not.toBeInTheDocument();
    });

    it('从 visible=true 变为 false 时应清理容器', async () => {
      const { rerender } = render(<ImagePreview {...defaultProps} />);

      await waitFor(() => {
        expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).toBeInTheDocument();
      });

      rerender(<ImagePreview {...defaultProps} visible={false} />);

      await waitFor(() => {
        expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).not.toBeInTheDocument();
      });
    });
  });

  describe('组件卸载', () => {
    it('组件卸载时应清理 Portal 容器', async () => {
      const { unmount } = render(<ImagePreview {...defaultProps} />);

      await waitFor(() => {
        expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).toBeInTheDocument();
      });

      unmount();

      await waitFor(() => {
        expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).not.toBeInTheDocument();
      });
    });
  });

  describe('渲染行为', () => {
    it('组件应返回 null', () => {
      const { container } = render(<ImagePreview {...defaultProps} />);
      // ImagePreview 组件自身返回 null，通过 Portal 渲染内容
      expect(container.firstChild).toBeNull();
    });

    it('visible 为 false 时不应有任何副作用', () => {
      const { container } = render(<ImagePreview {...defaultProps} visible={false} />);
      expect(container.firstChild).toBeNull();
      expect(document.querySelector('.fluentui-plus-image-preview-modal-root')).not.toBeInTheDocument();
    });
  });
});
