import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Image from '../Image';

// Mock ImagePreview 组件
jest.mock('../ImagePreview', () => {
  const MockImagePreview = ({
    visible,
    images,
    currentIndex,
    onClose,
  }: {
    visible: boolean;
    images: Array<{ id: string; src: string; alt?: string }>;
    currentIndex: number;
    onClose: () => void;
  }) => {
    if (!visible) return null;
    return (
      <div data-testid='image-preview'>
        <img src={images[currentIndex]?.src} alt={images[currentIndex]?.alt} data-testid='preview-image' />
        <button data-testid='close-preview' onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
  return MockImagePreview;
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation(_callback => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: jest.fn(),
  }));
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Image Component', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test Image',
  };

  describe('基础渲染', () => {
    it('应正确渲染图片容器', () => {
      const { container } = render(<Image {...defaultProps} />);
      expect(container.querySelector('.fluentui-plus-image')).toBeInTheDocument();
    });

    it('应正确设置图片尺寸', () => {
      const { container } = render(<Image {...defaultProps} width={200} height={150} />);
      const imageContainer = container.querySelector('.fluentui-plus-image');
      expect(imageContainer).toHaveStyle({ width: '200px', height: '150px' });
    });

    it('应正确应用自定义类名', () => {
      const { container } = render(<Image {...defaultProps} className='custom-class' />);
      expect(container.querySelector('.fluentui-plus-image')).toHaveClass('custom-class');
    });

    it('应正确应用自定义样式', () => {
      const { container } = render(<Image {...defaultProps} style={{ border: '1px solid red' }} />);
      const imageContainer = container.querySelector('.fluentui-plus-image');
      expect(imageContainer).toHaveStyle({ border: '1px solid red' });
    });
  });

  describe('图片加载状态', () => {
    it('图片加载成功后应显示图片', async () => {
      const { container } = render(<Image {...defaultProps} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      expect(img).toBeInTheDocument();

      // 触发加载成功
      fireEvent.load(img!);

      await waitFor(() => {
        expect(container.querySelector('.fluentui-plus-image')).not.toHaveClass('fluentui-plus-image-loading');
      });
    });

    it('图片加载失败后应显示错误状态', async () => {
      const { container } = render(<Image {...defaultProps} width={200} height={200} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      // 触发加载失败
      fireEvent.error(img!);

      await waitFor(() => {
        expect(container.querySelector('.fluentui-plus-image')).toHaveClass('fluentui-plus-image-error');
      });
    });

    it('应正确触发 onLoad 回调', () => {
      const onLoad = jest.fn();
      const { container } = render(<Image {...defaultProps} onLoad={onLoad} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('应正确触发 onError 回调', () => {
      const onError = jest.fn();
      const { container } = render(<Image {...defaultProps} onError={onError} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.error(img!);

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('懒加载功能', () => {
    it('启用懒加载时应创建 IntersectionObserver', () => {
      render(<Image {...defaultProps} lazy />);
      expect(mockIntersectionObserver).toHaveBeenCalled();
      expect(mockObserve).toHaveBeenCalled();
    });

    it('未启用懒加载时不应创建 IntersectionObserver', () => {
      render(<Image {...defaultProps} lazy={false} />);
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('元素进入视口后应加载图片', () => {
      let intersectionCallback: (entries: Array<{ isIntersecting: boolean }>) => void;

      mockIntersectionObserver.mockImplementation(callback => {
        intersectionCallback = callback;
        return {
          observe: mockObserve,
          disconnect: mockDisconnect,
          unobserve: jest.fn(),
        };
      });

      const { container } = render(<Image {...defaultProps} lazy />);

      // 模拟元素进入视口
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // 图片应该开始加载
      const img = container.querySelector('.fluentui-plus-image-img');
      expect(img).toBeInTheDocument();
    });

    it('组件卸载时应断开 IntersectionObserver', () => {
      const { unmount } = render(<Image {...defaultProps} lazy />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('占位符和错误状态', () => {
    it('加载中且有尺寸时应显示默认占位符', () => {
      const { container } = render(<Image {...defaultProps} width={200} height={200} />);
      expect(container.querySelector('.fluentui-plus-image-placeholder')).toBeInTheDocument();
    });

    it('应显示自定义占位符内容', () => {
      render(<Image {...defaultProps} width={200} height={200} placeholder={<span>Loading...</span>} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('加载失败且有尺寸时应显示默认错误内容', async () => {
      const { container } = render(<Image {...defaultProps} width={200} height={200} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.error(img!);

      await waitFor(() => {
        expect(container.querySelector('.fluentui-plus-image-fallback')).toBeInTheDocument();
      });
    });

    it('应显示自定义错误内容', async () => {
      const { container } = render(
        <Image {...defaultProps} width={200} height={200} fallback={<span>Load Failed</span>} />
      );
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.error(img!);

      await waitFor(() => {
        expect(screen.getByText('Load Failed')).toBeInTheDocument();
      });
    });

    it('没有指定尺寸时不应显示占位符', () => {
      const { container } = render(<Image {...defaultProps} />);
      expect(container.querySelector('.fluentui-plus-image-placeholder')).not.toBeInTheDocument();
    });
  });

  describe('图片预览功能', () => {
    it('点击图片后应打开预览', async () => {
      const { container } = render(<Image {...defaultProps} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      // 先加载成功
      fireEvent.load(img!);

      // 点击打开预览
      fireEvent.click(container.querySelector('.fluentui-plus-image')!);

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });
    });

    it('关闭预览后应隐藏预览弹窗', async () => {
      const { container } = render(<Image {...defaultProps} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(container.querySelector('.fluentui-plus-image')!);

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('close-preview'));

      await waitFor(() => {
        expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
      });
    });

    it('preview 为 false 时点击不应打开预览', async () => {
      const { container } = render(<Image {...defaultProps} preview={false} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(container.querySelector('.fluentui-plus-image')!);

      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });

    it('图片加载失败后点击不应打开预览', async () => {
      const { container } = render(<Image {...defaultProps} width={200} height={200} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.error(img!);
      fireEvent.click(container.querySelector('.fluentui-plus-image')!);

      expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
    });

    it('应使用 previewSrc 作为预览图片地址', async () => {
      const previewSrc = 'https://example.com/preview.jpg';
      const { container } = render(<Image {...defaultProps} previewSrc={previewSrc} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(container.querySelector('.fluentui-plus-image')!);

      await waitFor(() => {
        const previewImage = screen.getByTestId('preview-image');
        expect(previewImage).toHaveAttribute('src', previewSrc);
      });
    });

    it('加载成功后应添加可预览样式类', async () => {
      const { container } = render(<Image {...defaultProps} />);
      const img = container.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);

      await waitFor(() => {
        expect(container.querySelector('.fluentui-plus-image')).toHaveClass('fluentui-plus-image--previewable');
      });
    });
  });

  describe('其他属性透传', () => {
    it('应正确透传 img 原生属性', () => {
      const { container } = render(
        <Image {...defaultProps} data-custom='test' crossOrigin='anonymous' loading='eager' />
      );

      const img = container.querySelector('.fluentui-plus-image-img');

      // 先触发加载让图片显示
      fireEvent.load(img!);

      expect(img).toHaveAttribute('data-custom', 'test');
      expect(img).toHaveAttribute('crossOrigin', 'anonymous');
    });
  });
});
