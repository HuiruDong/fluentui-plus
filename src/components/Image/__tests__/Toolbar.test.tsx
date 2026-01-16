import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toolbar from '../Toolbar';

// Mock Fluent UI Icons
jest.mock('@fluentui/react-icons', () => ({
  ZoomIn24Regular: () => <span data-testid='zoom-in-icon'>ZoomIn</span>,
  ZoomOut24Regular: () => <span data-testid='zoom-out-icon'>ZoomOut</span>,
  ArrowRotateClockwise24Regular: () => <span data-testid='rotate-right-icon'>RotateRight</span>,
  ArrowRotateCounterclockwise24Regular: () => <span data-testid='rotate-left-icon'>RotateLeft</span>,
  Dismiss24Regular: () => <span data-testid='close-icon'>Close</span>,
}));

describe('Toolbar Component', () => {
  const defaultProps = {
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    onRotateLeft: jest.fn(),
    onRotateRight: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('应正确渲染工具栏容器', () => {
      const { container } = render(<Toolbar {...defaultProps} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal-toolbar')).toBeInTheDocument();
    });

    it('应渲染所有工具按钮', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByTestId('zoom-in-icon')).toBeInTheDocument();
      expect(screen.getByTestId('zoom-out-icon')).toBeInTheDocument();
      expect(screen.getByTestId('rotate-left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('rotate-right-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('应正确设置按钮标题', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByTitle('放大')).toBeInTheDocument();
      expect(screen.getByTitle('缩小')).toBeInTheDocument();
      expect(screen.getByTitle('逆时针旋转')).toBeInTheDocument();
      expect(screen.getByTitle('顺时针旋转')).toBeInTheDocument();
      expect(screen.getByTitle('关闭')).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('点击放大按钮应触发 onZoomIn', () => {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByTitle('放大'));
      expect(defaultProps.onZoomIn).toHaveBeenCalledTimes(1);
    });

    it('点击缩小按钮应触发 onZoomOut', () => {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByTitle('缩小'));
      expect(defaultProps.onZoomOut).toHaveBeenCalledTimes(1);
    });

    it('点击逆时针旋转按钮应触发 onRotateLeft', () => {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByTitle('逆时针旋转'));
      expect(defaultProps.onRotateLeft).toHaveBeenCalledTimes(1);
    });

    it('点击顺时针旋转按钮应触发 onRotateRight', () => {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByTitle('顺时针旋转'));
      expect(defaultProps.onRotateRight).toHaveBeenCalledTimes(1);
    });

    it('点击关闭按钮应触发 onClose', () => {
      render(<Toolbar {...defaultProps} />);
      fireEvent.click(screen.getByTitle('关闭'));
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
