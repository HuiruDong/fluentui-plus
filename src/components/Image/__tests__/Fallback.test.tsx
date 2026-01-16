import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Fallback from '../Fallback';

describe('Fallback Component', () => {
  describe('默认渲染', () => {
    it('应正确渲染错误容器', () => {
      const { container } = render(<Fallback />);
      expect(container.querySelector('.fluentui-plus-image-fallback')).toBeInTheDocument();
    });

    it('没有 content 时应显示默认图标', () => {
      const { container } = render(<Fallback />);
      expect(container.querySelector('.fluentui-plus-image-fallback-icon')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('没有 content 时应显示默认错误文本', () => {
      render(<Fallback />);
      expect(screen.getByText('加载失败')).toBeInTheDocument();
    });
  });

  describe('自定义内容', () => {
    it('有 content 时应显示自定义内容', () => {
      render(<Fallback content={<span>Image Failed</span>} />);
      expect(screen.getByText('Image Failed')).toBeInTheDocument();
    });

    it('有 content 时不应显示默认图标和文本', () => {
      const { container } = render(<Fallback content={<span>Custom Error</span>} />);
      expect(container.querySelector('.fluentui-plus-image-fallback-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('加载失败')).not.toBeInTheDocument();
    });

    it('content 可以是字符串', () => {
      render(<Fallback content='图片加载错误' />);
      expect(screen.getByText('图片加载错误')).toBeInTheDocument();
    });

    it('content 可以是复杂组件', () => {
      const CustomFallback = () => (
        <div data-testid='custom-fallback'>
          <button>Retry</button>
          <span>Failed to load</span>
        </div>
      );

      render(<Fallback content={<CustomFallback />} />);
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });
});
