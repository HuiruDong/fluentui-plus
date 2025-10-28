import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TotalInfo from '../TotalInfo';

describe('TotalInfo', () => {
  const defaultProps = {
    showTotal: false,
    total: 100,
    currentRange: [1, 10] as [number, number],
    prefixCls: 'fluentui-plus-pagination',
  };

  describe('基础渲染', () => {
    it('should not render when showTotal is false', () => {
      const { container } = render(<TotalInfo {...defaultProps} showTotal={false} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render with default text when showTotal is true', () => {
      render(<TotalInfo {...defaultProps} showTotal={true} />);

      expect(screen.getByText('共 100 条')).toBeInTheDocument();
    });

    it('should apply correct CSS class', () => {
      const { container } = render(<TotalInfo {...defaultProps} showTotal={true} />);

      const totalInfo = container.querySelector('.fluentui-plus-pagination__total');
      expect(totalInfo).toBeInTheDocument();
    });
  });

  describe('自定义渲染函数', () => {
    it('should render custom content when showTotal is a function', () => {
      const showTotal = (total: number, range: [number, number]) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`;

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      expect(screen.getByText('显示 1-10 条，共 100 条')).toBeInTheDocument();
    });

    it('should pass correct parameters to showTotal function', () => {
      const showTotal = jest.fn((total: number) => `Total: ${total}`);

      render(<TotalInfo {...defaultProps} total={250} currentRange={[21, 30]} showTotal={showTotal} />);

      expect(showTotal).toHaveBeenCalledWith(250, [21, 30]);
    });

    it('should render JSX element from showTotal function', () => {
      const showTotal = (total: number, range: [number, number]) => (
        <div>
          <strong data-testid='range'>
            {range[0]}-{range[1]}
          </strong>
          <span data-testid='total'> / {total}</span>
        </div>
      );

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      expect(screen.getByTestId('range')).toHaveTextContent('1-10');
      expect(screen.getByTestId('total')).toHaveTextContent('/ 100');
    });

    it('should handle showTotal function returning complex content', () => {
      const showTotal = (total: number, range: [number, number]) => (
        <span>
          第 {range[0]} - {range[1]} 项，共 {total} 项
        </span>
      );

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      expect(screen.getByText('第 1 - 10 项，共 100 项')).toBeInTheDocument();
    });
  });

  describe('不同的数据场景', () => {
    it('should handle zero total', () => {
      render(<TotalInfo {...defaultProps} showTotal={true} total={0} currentRange={[0, 0]} />);

      expect(screen.getByText('共 0 条')).toBeInTheDocument();
    });

    it('should handle single item', () => {
      render(<TotalInfo {...defaultProps} showTotal={true} total={1} currentRange={[1, 1]} />);

      expect(screen.getByText('共 1 条')).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      render(<TotalInfo {...defaultProps} showTotal={true} total={999999} currentRange={[1, 10]} />);

      expect(screen.getByText('共 999999 条')).toBeInTheDocument();
    });

    it('should handle different ranges', () => {
      const showTotal = (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`;

      const { rerender } = render(
        <TotalInfo {...defaultProps} showTotal={showTotal} total={100} currentRange={[1, 10]} />
      );

      expect(screen.getByText('1-10 / 100')).toBeInTheDocument();

      rerender(<TotalInfo {...defaultProps} showTotal={showTotal} total={100} currentRange={[91, 100]} />);

      expect(screen.getByText('91-100 / 100')).toBeInTheDocument();
    });
  });

  describe('prefixCls 应用', () => {
    it('should use custom prefixCls', () => {
      const { container } = render(<TotalInfo {...defaultProps} showTotal={true} prefixCls='custom-prefix' />);

      const totalInfo = container.querySelector('.custom-prefix__total');
      expect(totalInfo).toBeInTheDocument();
    });

    it('should apply prefixCls correctly with different values', () => {
      const { container, rerender } = render(<TotalInfo {...defaultProps} showTotal={true} prefixCls='prefix-1' />);

      expect(container.querySelector('.prefix-1__total')).toBeInTheDocument();

      rerender(<TotalInfo {...defaultProps} showTotal={true} prefixCls='prefix-2' />);

      expect(container.querySelector('.prefix-2__total')).toBeInTheDocument();
      expect(container.querySelector('.prefix-1__total')).not.toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle showTotal function that returns null', () => {
      const showTotal = () => null;

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      const container = screen.queryByText(/./); // Query for any text
      expect(container).not.toBeInTheDocument();
    });

    it('should handle showTotal function that returns empty string', () => {
      const showTotal = () => '';

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      // Component should render but be empty
      const { container } = render(<TotalInfo {...defaultProps} showTotal={showTotal} />);
      const totalInfo = container.querySelector('.fluentui-plus-pagination__total');
      expect(totalInfo).toBeInTheDocument();
      expect(totalInfo).toHaveTextContent('');
    });

    it('should handle negative range values', () => {
      const showTotal = (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`;

      render(<TotalInfo {...defaultProps} showTotal={showTotal} total={100} currentRange={[-1, -1]} />);

      expect(screen.getByText('-1--1 / 100')).toBeInTheDocument();
    });

    it('should handle range where start is greater than end', () => {
      const showTotal = (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total}`;

      render(<TotalInfo {...defaultProps} showTotal={showTotal} total={100} currentRange={[10, 1]} />);

      expect(screen.getByText('10-1 / 100')).toBeInTheDocument();
    });
  });

  describe('类型检查', () => {
    it('should correctly identify showTotal as boolean', () => {
      const { container: container1 } = render(<TotalInfo {...defaultProps} showTotal={true} />);
      expect(container1.querySelector('.fluentui-plus-pagination__total')).toBeInTheDocument();

      const { container: container2 } = render(<TotalInfo {...defaultProps} showTotal={false} />);
      expect(container2.firstChild).toBeNull();
    });

    it('should correctly identify showTotal as function', () => {
      const showTotal = (total: number) => `Total: ${total}`;

      render(<TotalInfo {...defaultProps} showTotal={showTotal} />);

      expect(screen.getByText('Total: 100')).toBeInTheDocument();
    });
  });

  describe('重新渲染', () => {
    it('should update when total changes', () => {
      const { rerender } = render(<TotalInfo {...defaultProps} showTotal={true} total={100} />);

      expect(screen.getByText('共 100 条')).toBeInTheDocument();

      rerender(<TotalInfo {...defaultProps} showTotal={true} total={200} />);

      expect(screen.getByText('共 200 条')).toBeInTheDocument();
      expect(screen.queryByText('共 100 条')).not.toBeInTheDocument();
    });

    it('should update when currentRange changes', () => {
      const showTotal = (total: number, range: [number, number]) => `${range[0]}-${range[1]}`;

      const { rerender } = render(<TotalInfo {...defaultProps} showTotal={showTotal} currentRange={[1, 10]} />);

      expect(screen.getByText('1-10')).toBeInTheDocument();

      rerender(<TotalInfo {...defaultProps} showTotal={showTotal} currentRange={[11, 20]} />);

      expect(screen.getByText('11-20')).toBeInTheDocument();
      expect(screen.queryByText('1-10')).not.toBeInTheDocument();
    });

    it('should show/hide when showTotal toggles', () => {
      const { container, rerender } = render(<TotalInfo {...defaultProps} showTotal={false} />);

      expect(container.firstChild).toBeNull();

      rerender(<TotalInfo {...defaultProps} showTotal={true} />);

      expect(screen.getByText('共 100 条')).toBeInTheDocument();

      rerender(<TotalInfo {...defaultProps} showTotal={false} />);

      expect(screen.queryByText('共 100 条')).not.toBeInTheDocument();
    });
  });
});
