import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../Navigation';

// Mock Fluent UI Icons
jest.mock('@fluentui/react-icons', () => ({
  ChevronLeft24Regular: () => <span data-testid='chevron-left'>Left</span>,
  ChevronRight24Regular: () => <span data-testid='chevron-right'>Right</span>,
}));

describe('Navigation Component', () => {
  const defaultProps = {
    currentIndex: 1,
    total: 3,
    onPrev: jest.fn(),
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('应渲染上一张和下一张按钮', () => {
      const { container } = render(<Navigation {...defaultProps} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal-nav-prev')).toBeInTheDocument();
      expect(container.querySelector('.fluentui-plus-image-preview-modal-nav-next')).toBeInTheDocument();
    });

    it('应渲染导航图标', () => {
      render(<Navigation {...defaultProps} />);
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    });
  });

  describe('禁用状态', () => {
    it('当 currentIndex 为 0 时上一张按钮应禁用', () => {
      const { container } = render(<Navigation {...defaultProps} currentIndex={0} />);
      const prevButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-prev');
      expect(prevButton).toBeDisabled();
    });

    it('当 currentIndex 为 total - 1 时下一张按钮应禁用', () => {
      const { container } = render(<Navigation {...defaultProps} currentIndex={2} total={3} />);
      const nextButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-next');
      expect(nextButton).toBeDisabled();
    });

    it('在中间位置时两个按钮都应启用', () => {
      const { container } = render(<Navigation {...defaultProps} currentIndex={1} total={3} />);
      const prevButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-prev');
      const nextButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-next');
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('交互', () => {
    it('点击上一张按钮应触发 onPrev', () => {
      const { container } = render(<Navigation {...defaultProps} />);
      const prevButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-prev');
      fireEvent.click(prevButton!);
      expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
    });

    it('点击下一张按钮应触发 onNext', () => {
      const { container } = render(<Navigation {...defaultProps} />);
      const nextButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-next');
      fireEvent.click(nextButton!);
      expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
    });

    it('禁用状态下点击不应触发回调', () => {
      const { container } = render(<Navigation {...defaultProps} currentIndex={0} />);
      const prevButton = container.querySelector('.fluentui-plus-image-preview-modal-nav-prev');
      fireEvent.click(prevButton!);
      // disabled 按钮的 click 事件不会触发
      expect(defaultProps.onPrev).not.toHaveBeenCalled();
    });
  });
});
