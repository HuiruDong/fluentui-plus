import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spin from '../Spin';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  Spinner: ({ label, size }: { label?: string; size?: string }) => (
    <div data-testid='mock-spinner' data-size={size}>
      {label && <span data-testid='spinner-label'>{label}</span>}
    </div>
  ),
}));

describe('Spin Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Spin />);
      const spinner = screen.getByTestId('mock-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('data-size', 'medium');
    });

    it('should apply custom className', () => {
      const { container } = render(<Spin className='custom-spin' />);
      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('custom-spin');
      expect(spinContainer).toHaveClass('fluentui-plus-spin');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      const { container } = render(<Spin style={customStyle} />);
      const spinContainer = container.firstChild as HTMLElement;
      expect(spinContainer).toHaveStyle('background-color: red');
    });
  });

  describe('尺寸配置', () => {
    it('should render with different sizes', () => {
      const sizes: Array<'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge'> = [
        'tiny',
        'extra-small',
        'small',
        'medium',
        'large',
        'extra-large',
        'huge',
      ];

      sizes.forEach(size => {
        const { unmount } = render(<Spin size={size} />);
        const spinner = screen.getByTestId('mock-spinner');
        expect(spinner).toHaveAttribute('data-size', size);
        unmount();
      });
    });
  });

  describe('提示文案', () => {
    it('should render with tip text', () => {
      render(<Spin tip='Loading...' />);
      expect(screen.getByTestId('spinner-label')).toHaveTextContent('Loading...');
    });

    it('should not render tip when not provided', () => {
      render(<Spin />);
      expect(screen.queryByTestId('spinner-label')).not.toBeInTheDocument();
    });
  });

  describe('加载状态控制', () => {
    it('should not render spinner when spinning is false', () => {
      render(<Spin spinning={false} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();
    });

    it('should render spinner when spinning is true', () => {
      render(<Spin spinning={true} />);
      expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
    });

    it('should toggle spinner based on spinning prop', () => {
      const { rerender } = render(<Spin spinning={false} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();

      rerender(<Spin spinning={true} />);
      expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();

      rerender(<Spin spinning={false} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();
    });
  });

  describe('延迟显示', () => {
    it('should show spinner immediately when delay is 0', () => {
      render(<Spin delay={0} />);
      expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
    });

    it('should not show spinner immediately when delay is set', () => {
      render(<Spin delay={500} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();
    });

    it('should show spinner after delay time', async () => {
      render(<Spin delay={500} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
      });
    });

    it('should not show spinner if spinning becomes false before delay', async () => {
      const { rerender } = render(<Spin spinning={true} delay={500} />);
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();

      // 在延迟时间之前将 spinning 设为 false
      jest.advanceTimersByTime(200);
      rerender(<Spin spinning={false} delay={500} />);

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('全屏模式', () => {
    it('should render fullscreen spin', () => {
      const { container } = render(<Spin fullscreen />);
      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('fluentui-plus-spin--fullscreen');
    });

    it('should hide fullscreen spin when spinning is false', () => {
      const { container } = render(<Spin fullscreen spinning={false} />);
      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('fluentui-plus-spin--hidden');
    });

    it('should show fullscreen spin when spinning is true', () => {
      const { container } = render(<Spin fullscreen spinning={true} />);
      const spinContainer = container.firstChild;
      expect(spinContainer).not.toHaveClass('fluentui-plus-spin--hidden');
    });
  });

  describe('嵌套模式', () => {
    it('should render with children', () => {
      render(
        <Spin>
          <div data-testid='content'>Test Content</div>
        </Spin>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should show mask when spinning with children', () => {
      const { container } = render(
        <Spin spinning={true}>
          <div>Content</div>
        </Spin>
      );

      const mask = container.querySelector('.fluentui-plus-spin__mask');
      expect(mask).toBeInTheDocument();
    });

    it('should not show mask when not spinning with children', () => {
      const { container } = render(
        <Spin spinning={false}>
          <div>Content</div>
        </Spin>
      );

      const mask = container.querySelector('.fluentui-plus-spin__mask');
      expect(mask).not.toBeInTheDocument();
    });

    it('should have nested class when wrapping children', () => {
      const { container } = render(
        <Spin>
          <div>Content</div>
        </Spin>
      );

      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('fluentui-plus-spin--nested');
    });

    it('should have spinning class when spinning with children', () => {
      const { container } = render(
        <Spin spinning={true}>
          <div>Content</div>
        </Spin>
      );

      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('fluentui-plus-spin--spinning');
    });

    it('should not have spinning class when not spinning with children', () => {
      const { container } = render(
        <Spin spinning={false}>
          <div>Content</div>
        </Spin>
      );

      const spinContainer = container.firstChild;
      expect(spinContainer).not.toHaveClass('fluentui-plus-spin--spinning');
    });
  });

  describe('简单模式', () => {
    it('should render simple spin without children', () => {
      const { container } = render(<Spin />);
      const spinContainer = container.firstChild;

      expect(spinContainer).toHaveClass('fluentui-plus-spin');
      expect(spinContainer).not.toHaveClass('fluentui-plus-spin--nested');
      expect(spinContainer).not.toHaveClass('fluentui-plus-spin--fullscreen');
    });

    it('should only show spinner without mask in simple mode', () => {
      const { container } = render(<Spin />);

      expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
      const mask = container.querySelector('.fluentui-plus-spin__mask');
      expect(mask).not.toBeInTheDocument();
    });
  });

  describe('组合使用', () => {
    it('should work with fullscreen, delay and custom tip', async () => {
      const { container } = render(<Spin fullscreen delay={300} tip='Loading data...' />);

      // 初始状态：不显示
      expect(screen.queryByTestId('mock-spinner')).not.toBeInTheDocument();

      // 延迟后显示
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
        expect(screen.getByTestId('spinner-label')).toHaveTextContent('Loading data...');
      });

      const spinContainer = container.firstChild;
      expect(spinContainer).toHaveClass('fluentui-plus-spin--fullscreen');
    });

    it('should work with nested mode, custom size and tip', () => {
      render(
        <Spin spinning={true} size='large' tip='Processing...'>
          <div data-testid='content'>Content</div>
        </Spin>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('mock-spinner')).toHaveAttribute('data-size', 'large');
      expect(screen.getByTestId('spinner-label')).toHaveTextContent('Processing...');
    });
  });
});
