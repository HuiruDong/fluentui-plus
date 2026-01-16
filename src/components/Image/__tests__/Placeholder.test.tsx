import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Placeholder from '../Placeholder';

describe('Placeholder Component', () => {
  describe('默认渲染', () => {
    it('应正确渲染占位符容器', () => {
      const { container } = render(<Placeholder />);
      expect(container.querySelector('.fluentui-plus-image-placeholder')).toBeInTheDocument();
    });

    it('没有 content 时应显示默认图标', () => {
      const { container } = render(<Placeholder />);
      expect(container.querySelector('.fluentui-plus-image-placeholder-icon')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('自定义内容', () => {
    it('有 content 时应显示自定义内容', () => {
      render(<Placeholder content={<span>Loading...</span>} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('有 content 时不应显示默认图标', () => {
      const { container } = render(<Placeholder content={<span>Loading...</span>} />);
      expect(container.querySelector('.fluentui-plus-image-placeholder-icon')).not.toBeInTheDocument();
    });

    it('content 可以是字符串', () => {
      render(<Placeholder content='加载中...' />);
      expect(screen.getByText('加载中...')).toBeInTheDocument();
    });

    it('content 可以是复杂组件', () => {
      const CustomPlaceholder = () => (
        <div data-testid='custom-placeholder'>
          <div className='spinner' />
          <span>Loading image...</span>
        </div>
      );

      render(<Placeholder content={<CustomPlaceholder />} />);
      expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
    });
  });
});
