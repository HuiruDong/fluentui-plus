import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageGroup from '../ImageGroup';
import Image from '../Image';

// Mock ImagePreview 组件
jest.mock('../ImagePreview', () => {
  const MockImagePreview = ({
    visible,
    images,
    currentIndex,
    onClose,
    onIndexChange,
  }: {
    visible: boolean;
    images: Array<{ id: string; src: string; alt?: string }>;
    currentIndex: number;
    onClose: () => void;
    onIndexChange?: (index: number) => void;
  }) => {
    if (!visible) return null;
    return (
      <div data-testid='image-preview'>
        <img src={images[currentIndex]?.src} alt={images[currentIndex]?.alt} data-testid='preview-image' />
        <span data-testid='current-index'>{currentIndex}</span>
        <span data-testid='total-count'>{images.length}</span>
        <button data-testid='close-preview' onClick={onClose}>
          Close
        </button>
        <button data-testid='prev-btn' onClick={() => onIndexChange?.(currentIndex - 1)} disabled={currentIndex === 0}>
          Prev
        </button>
        <button
          data-testid='next-btn'
          onClick={() => onIndexChange?.(currentIndex + 1)}
          disabled={currentIndex === images.length - 1}
        >
          Next
        </button>
      </div>
    );
  };
  return MockImagePreview;
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
beforeEach(() => {
  mockIntersectionObserver.mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }));
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ImageGroup Component', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  describe('基础渲染', () => {
    it('应正确渲染图片组容器', () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );
      expect(container.querySelector('.fluentui-plus-image-group')).toBeInTheDocument();
    });

    it('应正确应用自定义类名', () => {
      const { container } = render(
        <ImageGroup className='custom-group-class'>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );
      expect(container.querySelector('.fluentui-plus-image-group')).toHaveClass('custom-group-class');
    });

    it('应正确应用自定义样式', () => {
      const { container } = render(
        <ImageGroup style={{ gap: '10px', display: 'flex' }}>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );
      const group = container.querySelector('.fluentui-plus-image-group');
      expect(group).toHaveStyle({ gap: '10px', display: 'flex' });
    });

    it('应正确渲染所有子图片', () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
          <Image src={mockImages[2]} alt='Image 3' />
        </ImageGroup>
      );
      const images = container.querySelectorAll('.fluentui-plus-image');
      expect(images).toHaveLength(3);
    });
  });

  describe('图片预览功能', () => {
    it('点击子图片应打开预览', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');
      const firstImg = images[0].querySelector('.fluentui-plus-image-img');

      // 先加载图片
      fireEvent.load(firstImg!);
      // 点击打开预览
      fireEvent.click(images[0]);

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });
    });

    it('点击第一张图片应显示第一张', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');
      const firstImg = images[0].querySelector('.fluentui-plus-image-img');

      fireEvent.load(firstImg!);
      fireEvent.click(images[0]);

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      });
    });

    it('点击第二张图片应显示第二张', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');

      // 加载两张图片
      fireEvent.load(images[0].querySelector('.fluentui-plus-image-img')!);
      fireEvent.load(images[1].querySelector('.fluentui-plus-image-img')!);

      // 点击第二张
      fireEvent.click(images[1]);

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('1');
      });
    });

    it('关闭预览后应隐藏预览弹窗', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );

      const image = container.querySelector('.fluentui-plus-image');
      const img = image?.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(image!);

      await waitFor(() => {
        expect(screen.getByTestId('image-preview')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('close-preview'));

      await waitFor(() => {
        expect(screen.queryByTestId('image-preview')).not.toBeInTheDocument();
      });
    });

    it('应支持切换到下一张图片', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');

      fireEvent.load(images[0].querySelector('.fluentui-plus-image-img')!);
      fireEvent.load(images[1].querySelector('.fluentui-plus-image-img')!);

      fireEvent.click(images[0]);

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      });

      fireEvent.click(screen.getByTestId('next-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('1');
      });
    });

    it('应支持切换到上一张图片', async () => {
      const { container } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');

      fireEvent.load(images[0].querySelector('.fluentui-plus-image-img')!);
      fireEvent.load(images[1].querySelector('.fluentui-plus-image-img')!);

      // 点击第二张
      fireEvent.click(images[1]);

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('1');
      });

      fireEvent.click(screen.getByTestId('prev-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      });
    });
  });

  describe('images 属性', () => {
    it('使用 images 数组时应优先使用该数组预览', async () => {
      const customImages = ['https://example.com/custom1.jpg', 'https://example.com/custom2.jpg'];

      const { container } = render(
        <ImageGroup images={customImages}>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );

      const image = container.querySelector('.fluentui-plus-image');
      const img = image?.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(image!);

      await waitFor(() => {
        expect(screen.getByTestId('total-count')).toHaveTextContent('2');
        expect(screen.getByTestId('preview-image')).toHaveAttribute('src', customImages[0]);
      });
    });

    it('images 数组支持对象格式', async () => {
      const customImages = [
        { id: '1', src: 'https://example.com/custom1.jpg', alt: 'Custom 1' },
        { id: '2', src: 'https://example.com/custom2.jpg', alt: 'Custom 2' },
      ];

      const { container } = render(
        <ImageGroup images={customImages}>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );

      const image = container.querySelector('.fluentui-plus-image');
      const img = image?.querySelector('.fluentui-plus-image-img');

      fireEvent.load(img!);
      fireEvent.click(image!);

      await waitFor(() => {
        const previewImage = screen.getByTestId('preview-image');
        expect(previewImage).toHaveAttribute('src', customImages[0].src);
        expect(previewImage).toHaveAttribute('alt', customImages[0].alt);
      });
    });

    it('使用 images 属性时点击任意图片都从第一张开始预览', async () => {
      const customImages = ['https://example.com/custom1.jpg', 'https://example.com/custom2.jpg'];

      const { container } = render(
        <ImageGroup images={customImages}>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      const images = container.querySelectorAll('.fluentui-plus-image');

      fireEvent.load(images[0].querySelector('.fluentui-plus-image-img')!);
      fireEvent.load(images[1].querySelector('.fluentui-plus-image-img')!);

      // 点击第二张图片
      fireEvent.click(images[1]);

      await waitFor(() => {
        // 应该从第一张开始
        expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      });
    });
  });

  describe('图片注册与注销', () => {
    it('子图片卸载后应从列表中移除', async () => {
      const { container, rerender } = render(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
          <Image src={mockImages[1]} alt='Image 2' />
        </ImageGroup>
      );

      let images = container.querySelectorAll('.fluentui-plus-image');
      expect(images).toHaveLength(2);

      // 加载图片
      fireEvent.load(images[0].querySelector('.fluentui-plus-image-img')!);
      fireEvent.load(images[1].querySelector('.fluentui-plus-image-img')!);

      // 移除一张图片
      rerender(
        <ImageGroup>
          <Image src={mockImages[0]} alt='Image 1' />
        </ImageGroup>
      );

      images = container.querySelectorAll('.fluentui-plus-image');
      expect(images).toHaveLength(1);

      // 点击打开预览
      fireEvent.click(images[0]);

      await waitFor(() => {
        expect(screen.getByTestId('total-count')).toHaveTextContent('1');
      });
    });
  });
});
