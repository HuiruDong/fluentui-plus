import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreviewContent from '../PreviewContent';

// Mock hooks
const mockResetTransform = jest.fn();
const mockHandleZoomIn = jest.fn();
const mockHandleZoomOut = jest.fn();
const mockHandleRotateLeft = jest.fn();
const mockHandleRotateRight = jest.fn();
const mockHandlePrev = jest.fn();
const mockHandleNext = jest.fn();

jest.mock('../hooks', () => ({
  useTransform: () => ({
    scale: 1,
    rotate: 0,
    resetTransform: mockResetTransform,
    handleZoomIn: mockHandleZoomIn,
    handleZoomOut: mockHandleZoomOut,
    handleRotateLeft: mockHandleRotateLeft,
    handleRotateRight: mockHandleRotateRight,
  }),
  useNavigation: (currentIndex: number, _total: number, _onIndexChange?: (index: number) => void) => ({
    internalIndex: currentIndex,
    handlePrev: mockHandlePrev,
    handleNext: mockHandleNext,
  }),
  useKeyboardShortcuts: jest.fn(),
  useWheelZoom: jest.fn(),
  useBodyScrollLock: jest.fn(),
}));

// Mock 子组件
jest.mock('../Toolbar', () => {
  const MockToolbar = ({
    onZoomIn,
    onZoomOut,
    onRotateLeft,
    onRotateRight,
    onClose,
  }: {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onClose: () => void;
  }) => (
    <div data-testid='toolbar'>
      <button data-testid='zoom-in' onClick={onZoomIn}>
        Zoom In
      </button>
      <button data-testid='zoom-out' onClick={onZoomOut}>
        Zoom Out
      </button>
      <button data-testid='rotate-left' onClick={onRotateLeft}>
        Rotate Left
      </button>
      <button data-testid='rotate-right' onClick={onRotateRight}>
        Rotate Right
      </button>
      <button data-testid='close' onClick={onClose}>
        Close
      </button>
    </div>
  );
  return MockToolbar;
});

jest.mock('../Navigation', () => {
  const MockNavigation = ({
    currentIndex,
    _total,
    onPrev,
    onNext,
  }: {
    currentIndex: number;
    _total?: number;
    onPrev: () => void;
    onNext: () => void;
  }) => (
    <div data-testid='navigation'>
      <button data-testid='prev' onClick={onPrev}>
        Prev
      </button>
      <span data-testid='nav-index'>{currentIndex}</span>
      <button data-testid='next' onClick={onNext}>
        Next
      </button>
    </div>
  );
  return MockNavigation;
});

jest.mock('../Counter', () => {
  const MockCounter = ({ currentIndex, total }: { currentIndex: number; total: number }) => (
    <div data-testid='counter'>
      {currentIndex + 1} / {total}
    </div>
  );
  return MockCounter;
});

describe('PreviewContent Component', () => {
  const mockImages = [
    { id: '1', src: 'https://example.com/image1.jpg', alt: 'Image 1' },
    { id: '2', src: 'https://example.com/image2.jpg', alt: 'Image 2' },
    { id: '3', src: 'https://example.com/image3.jpg', alt: 'Image 3' },
  ];

  const defaultProps = {
    visible: true,
    images: mockImages,
    currentIndex: 0,
    onClose: jest.fn(),
    onDestroy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('visible 为 true 时应渲染预览内容', () => {
      const { container } = render(<PreviewContent {...defaultProps} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal')).toBeInTheDocument();
    });

    it('visible 为 false 时不应渲染任何内容', () => {
      const { container } = render(<PreviewContent {...defaultProps} visible={false} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal')).not.toBeInTheDocument();
    });

    it('images 为空时不应渲染任何内容', () => {
      const { container } = render(<PreviewContent {...defaultProps} images={[]} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal')).not.toBeInTheDocument();
    });

    it('应渲染工具栏', () => {
      render(<PreviewContent {...defaultProps} />);
      expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    });

    it('应渲染当前图片', () => {
      const { container } = render(<PreviewContent {...defaultProps} />);
      const img = container.querySelector('.fluentui-plus-image-preview-modal-img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockImages[0].src);
      expect(img).toHaveAttribute('alt', mockImages[0].alt);
    });
  });

  describe('导航显示', () => {
    it('多张图片时应显示导航', () => {
      render(<PreviewContent {...defaultProps} />);
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    it('多张图片时应显示计数器', () => {
      render(<PreviewContent {...defaultProps} />);
      expect(screen.getByTestId('counter')).toBeInTheDocument();
    });

    it('只有一张图片时不应显示导航', () => {
      render(<PreviewContent {...defaultProps} images={[mockImages[0]]} />);
      expect(screen.queryByTestId('navigation')).not.toBeInTheDocument();
    });

    it('只有一张图片时不应显示计数器', () => {
      render(<PreviewContent {...defaultProps} images={[mockImages[0]]} />);
      expect(screen.queryByTestId('counter')).not.toBeInTheDocument();
    });
  });

  describe('工具栏交互', () => {
    it('点击放大按钮应触发 handleZoomIn', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('zoom-in'));
      expect(mockHandleZoomIn).toHaveBeenCalled();
    });

    it('点击缩小按钮应触发 handleZoomOut', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('zoom-out'));
      expect(mockHandleZoomOut).toHaveBeenCalled();
    });

    it('点击左旋转按钮应触发 handleRotateLeft', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('rotate-left'));
      expect(mockHandleRotateLeft).toHaveBeenCalled();
    });

    it('点击右旋转按钮应触发 handleRotateRight', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('rotate-right'));
      expect(mockHandleRotateRight).toHaveBeenCalled();
    });

    it('点击关闭按钮应触发 onClose 和 onDestroy', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('close'));
      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.onDestroy).toHaveBeenCalled();
    });
  });

  describe('导航交互', () => {
    it('点击上一张按钮应触发 handlePrev', () => {
      render(<PreviewContent {...defaultProps} currentIndex={1} />);
      fireEvent.click(screen.getByTestId('prev'));
      expect(mockHandlePrev).toHaveBeenCalled();
    });

    it('点击下一张按钮应触发 handleNext', () => {
      render(<PreviewContent {...defaultProps} />);
      fireEvent.click(screen.getByTestId('next'));
      expect(mockHandleNext).toHaveBeenCalled();
    });
  });

  describe('遮罩点击', () => {
    it('点击遮罩应关闭预览', () => {
      const { container } = render(<PreviewContent {...defaultProps} />);
      const mask = container.querySelector('.fluentui-plus-image-preview-modal');

      // 模拟点击遮罩（target 和 currentTarget 相同）
      fireEvent.click(mask!, { target: mask });

      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.onDestroy).toHaveBeenCalled();
    });
  });
});
