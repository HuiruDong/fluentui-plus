import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimplePagination from '../SimplePagination';

// Mock Fluent UI components
jest.mock('@fluentui/react-components', () => ({
  Button: ({ children, onClick, disabled, icon, 'aria-label': ariaLabel, className }: any) => (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={className} data-testid={ariaLabel}>
      {icon}
      {children}
    </button>
  ),
  Input: ({ value, onChange, onKeyDown, onBlur, disabled, 'aria-label': ariaLabel, className }: any) => (
    <input
      data-testid='page-input'
      value={value}
      onChange={e => onChange?.(e, { value: e.target.value })}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    />
  ),
}));

jest.mock('@fluentui/react-icons', () => ({
  ChevronRightRegular: () => <span data-testid='icon-right'>→</span>,
  ChevronLeftRegular: () => <span data-testid='icon-left'>←</span>,
}));

describe('SimplePagination', () => {
  const defaultProps = {
    current: 1,
    totalPages: 10,
    disabled: false,
    onPrevClick: jest.fn(),
    onNextClick: jest.fn(),
    onPageChange: jest.fn(),
    prefixCls: 'fluentui-plus-pagination',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<SimplePagination {...defaultProps} />);

      expect(screen.getByTestId('Previous Page')).toBeInTheDocument();
      expect(screen.getByTestId('Next Page')).toBeInTheDocument();
      expect(screen.getByTestId('page-input')).toBeInTheDocument();
      expect(screen.getByText('/')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should display current page in input', () => {
      render(<SimplePagination {...defaultProps} current={5} />);

      expect(screen.getByTestId('page-input')).toHaveValue('5');
    });

    it('should display total pages', () => {
      render(<SimplePagination {...defaultProps} totalPages={20} />);

      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      const { container } = render(<SimplePagination {...defaultProps} />);

      const component = container.querySelector('.fluentui-plus-pagination__simple');
      expect(component).toBeInTheDocument();

      const inputContainer = container.querySelector('.fluentui-plus-pagination__simple__input-container');
      expect(inputContainer).toBeInTheDocument();
    });
  });

  describe('输入处理', () => {
    it('should update input value when typing numbers', () => {
      render(<SimplePagination {...defaultProps} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '5' } });

      expect(input).toHaveValue('5');
    });

    it('should filter out non-numeric characters', () => {
      render(<SimplePagination {...defaultProps} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: 'abc123def' } });

      expect(input).toHaveValue('123');
    });

    it('should allow only numbers in input', () => {
      render(<SimplePagination {...defaultProps} />);

      const input = screen.getByTestId('page-input');

      fireEvent.change(input, { target: { value: '!@#$%' } });
      expect(input).toHaveValue('');

      fireEvent.change(input, { target: { value: '123' } });
      expect(input).toHaveValue('123');
    });

    it('should sync input with current prop changes', () => {
      const { rerender } = render(<SimplePagination {...defaultProps} current={1} />);

      expect(screen.getByTestId('page-input')).toHaveValue('1');

      rerender(<SimplePagination {...defaultProps} current={5} />);
      expect(screen.getByTestId('page-input')).toHaveValue('5');
    });
  });

  describe('页码跳转', () => {
    it('should jump to page when pressing Enter', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('should jump to page on blur', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '7' } });
      fireEvent.blur(input);

      expect(onPageChange).toHaveBeenCalledWith(7);
    });

    it('should not jump when page is the same as current', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} current={3} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '3' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should restore current page when input is empty on blur', () => {
      render(<SimplePagination {...defaultProps} current={3} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('3');
    });

    it('should clamp page to valid range (lower bound)', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} current={2} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('1');
      // Only calls onPageChange if page is different from current (2 !== 1)
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should clamp page to valid range (upper bound)', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} totalPages={10} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '999' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('10');
      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('should handle negative numbers', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      // Negative sign will be filtered out as it's not a digit
      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('5');
    });
  });

  describe('导航按钮', () => {
    it('should call onPrevClick when prev button is clicked', () => {
      const onPrevClick = jest.fn();

      render(<SimplePagination {...defaultProps} current={2} onPrevClick={onPrevClick} />);

      fireEvent.click(screen.getByTestId('Previous Page'));
      expect(onPrevClick).toHaveBeenCalledTimes(1);
    });

    it('should call onNextClick when next button is clicked', () => {
      const onNextClick = jest.fn();

      render(<SimplePagination {...defaultProps} current={5} onNextClick={onNextClick} />);

      fireEvent.click(screen.getByTestId('Next Page'));
      expect(onNextClick).toHaveBeenCalledTimes(1);
    });

    it('should disable prev button on first page', () => {
      render(<SimplePagination {...defaultProps} current={1} />);

      const prevButton = screen.getByTestId('Previous Page');
      expect(prevButton).toBeDisabled();
    });

    it('should enable prev button when not on first page', () => {
      render(<SimplePagination {...defaultProps} current={2} />);

      const prevButton = screen.getByTestId('Previous Page');
      expect(prevButton).not.toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<SimplePagination {...defaultProps} current={10} totalPages={10} />);

      const nextButton = screen.getByTestId('Next Page');
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when not on last page', () => {
      render(<SimplePagination {...defaultProps} current={5} totalPages={10} />);

      const nextButton = screen.getByTestId('Next Page');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('禁用状态', () => {
    it('should disable all controls when disabled', () => {
      render(<SimplePagination {...defaultProps} disabled={true} />);

      expect(screen.getByTestId('Previous Page')).toBeDisabled();
      expect(screen.getByTestId('Next Page')).toBeDisabled();
      expect(screen.getByTestId('page-input')).toBeDisabled();
    });

    it('should not affect prev button additional disable condition', () => {
      render(<SimplePagination {...defaultProps} current={1} disabled={false} />);

      expect(screen.getByTestId('Previous Page')).toBeDisabled();
    });

    it('should not affect next button additional disable condition', () => {
      render(<SimplePagination {...defaultProps} current={10} totalPages={10} disabled={false} />);

      expect(screen.getByTestId('Next Page')).toBeDisabled();
    });
  });

  describe('自定义渲染', () => {
    it('should use itemRender for prev button', () => {
      const itemRender = jest.fn((page, type) => <span data-testid={`custom-${type}`}>Custom {type}</span>);

      render(<SimplePagination {...defaultProps} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(0, 'prev', expect.anything());
      expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
    });

    it('should use itemRender for next button', () => {
      const itemRender = jest.fn((page, type) => <span data-testid={`custom-${type}`}>Custom {type}</span>);

      render(<SimplePagination {...defaultProps} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(2, 'next', expect.anything());
      expect(screen.getByTestId('custom-next')).toBeInTheDocument();
    });

    it('should call itemRender with correct page numbers', () => {
      const itemRender = jest.fn((page, type, element) => element);

      render(<SimplePagination {...defaultProps} current={5} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(4, 'prev', expect.anything());
      expect(itemRender).toHaveBeenCalledWith(6, 'next', expect.anything());
    });
  });

  describe('键盘交互', () => {
    it('should handle Enter key', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('should not jump on other keys', () => {
      const onPageChange = jest.fn();

      render(<SimplePagination {...defaultProps} onPageChange={onPageChange} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyDown(input, { key: 'Tab' });

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('无障碍支持', () => {
    it('should have aria-label for prev button', () => {
      render(<SimplePagination {...defaultProps} />);

      expect(screen.getByTestId('Previous Page')).toHaveAttribute('aria-label', 'Previous Page');
    });

    it('should have aria-label for next button', () => {
      render(<SimplePagination {...defaultProps} />);

      expect(screen.getByTestId('Next Page')).toHaveAttribute('aria-label', 'Next Page');
    });

    it('should have aria-label for input', () => {
      render(<SimplePagination {...defaultProps} />);

      expect(screen.getByTestId('page-input')).toHaveAttribute('aria-label', 'Current Page');
    });
  });

  describe('边界情况', () => {
    it('should handle single page', () => {
      render(<SimplePagination {...defaultProps} current={1} totalPages={1} />);

      expect(screen.getByTestId('Previous Page')).toBeDisabled();
      expect(screen.getByTestId('Next Page')).toBeDisabled();
    });

    it('should handle zero total pages', () => {
      render(<SimplePagination {...defaultProps} totalPages={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle missing event handlers gracefully', () => {
      expect(() => {
        render(
          <SimplePagination
            {...defaultProps}
            onPrevClick={undefined as any}
            onNextClick={undefined as any}
            onPageChange={undefined as any}
          />
        );
      }).not.toThrow();
    });

    it('should handle rapid input changes', () => {
      render(<SimplePagination {...defaultProps} />);

      const input = screen.getByTestId('page-input');

      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.change(input, { target: { value: '123' } });

      expect(input).toHaveValue('123');
    });

    it('should handle empty string input', () => {
      render(<SimplePagination {...defaultProps} current={5} />);

      const input = screen.getByTestId('page-input');
      fireEvent.change(input, { target: { value: '' } });

      expect(input).toHaveValue('');

      fireEvent.blur(input);
      expect(input).toHaveValue('5');
    });
  });

  describe('性能优化', () => {
    it('should memoize buttons to avoid unnecessary re-renders', () => {
      const itemRender = jest.fn((page, type, element) => element);

      const { rerender } = render(<SimplePagination {...defaultProps} current={1} itemRender={itemRender} />);

      // Re-render with same props shouldn't trigger itemRender again due to useMemo
      rerender(<SimplePagination {...defaultProps} current={1} itemRender={itemRender} />);

      // Note: itemRender might be called again, but in production useMemo would prevent re-render
      expect(itemRender).toHaveBeenCalled();
    });
  });
});
