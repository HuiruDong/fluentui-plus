import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickJumper from '../QuickJumper';

// Mock Fluent UI components
jest.mock('@fluentui/react-components', () => ({
  Input: ({ value, onChange, onKeyUp, disabled, 'aria-label': ariaLabel, className }: any) => (
    <input
      data-testid='jumper-input'
      value={value}
      onChange={e => onChange?.(e, { value: e.target.value })}
      onKeyUp={onKeyUp}
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
    />
  ),
}));

describe('QuickJumper', () => {
  const defaultProps = {
    current: 1,
    totalPages: 10,
    disabled: false,
    onJump: jest.fn(),
    prefixCls: 'fluentui-plus-pagination',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<QuickJumper {...defaultProps} />);

      expect(screen.getByText('跳至')).toBeInTheDocument();
      expect(screen.getByTestId('jumper-input')).toBeInTheDocument();
      expect(screen.getByText('页')).toBeInTheDocument();
    });

    it('should render with empty input initially', () => {
      render(<QuickJumper {...defaultProps} />);

      expect(screen.getByTestId('jumper-input')).toHaveValue('');
    });

    it('should apply correct CSS class', () => {
      const { container } = render(<QuickJumper {...defaultProps} />);

      const jumper = container.querySelector('.fluentui-plus-pagination__jumper');
      expect(jumper).toBeInTheDocument();
    });

    it('should apply correct input CSS class', () => {
      const { container } = render(<QuickJumper {...defaultProps} />);

      const input = container.querySelector('.fluentui-plus-pagination__jumper__input');
      expect(input).toBeInTheDocument();
    });
  });

  describe('输入处理', () => {
    it('should update input value when typing', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });

      expect(input).toHaveValue('5');
    });

    it('should allow typing numbers', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '123' } });

      expect(input).toHaveValue('123');
    });

    it('should allow typing any characters (validation happens on jump)', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(input).toHaveValue('abc');
    });
  });

  describe('页码跳转', () => {
    it('should call onJump with valid page number on Enter', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).toHaveBeenCalledWith(5);
    });

    it('should clear input after successful jump', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '7' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should not call onJump on non-Enter keys', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'Tab' });

      expect(onJump).not.toHaveBeenCalled();
    });

    it('should clamp page to valid range (lower bound)', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} current={2} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      // Clamped to 1, and since current is 2, it should call onJump
      expect(onJump).toHaveBeenCalledWith(1);
    });

    it('should clamp page to valid range (upper bound)', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} totalPages={10} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '999' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).toHaveBeenCalledWith(10);
    });

    it('should handle negative numbers', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} current={2} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      // -5 gets clamped to 1, and since current is 2, should call onJump
      expect(onJump).toHaveBeenCalledWith(1);
    });

    it('should not jump when value is NaN', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('should not jump when value is not an integer', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '3.5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('should not jump when target page equals current page', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} current={5} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('should handle empty input gracefully', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).not.toHaveBeenCalled();
    });
  });

  describe('禁用状态', () => {
    it('should disable input when disabled', () => {
      render(<QuickJumper {...defaultProps} disabled={true} />);

      expect(screen.getByTestId('jumper-input')).toBeDisabled();
    });

    it('should not jump when disabled', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} disabled={true} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).not.toHaveBeenCalled();
    });
  });

  describe('无障碍支持', () => {
    it('should have aria-label for input', () => {
      render(<QuickJumper {...defaultProps} />);

      expect(screen.getByTestId('jumper-input')).toHaveAttribute('aria-label', 'Go to Page');
    });
  });

  describe('边界情况', () => {
    it('should handle totalPages of 1', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} current={1} totalPages={1} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      // 5 gets clamped to 1, but current is already 1, so it shouldn't call onJump
      expect(onJump).not.toHaveBeenCalled();
    });

    it('should handle totalPages of 0', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} totalPages={0} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).toHaveBeenCalledWith(0);
    });

    it('should handle very large page numbers', () => {
      const onJump = jest.fn();

      render(<QuickJumper {...defaultProps} totalPages={1000000} onJump={onJump} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '999999999' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(onJump).toHaveBeenCalledWith(1000000);
    });

    it('should handle missing onJump handler gracefully', () => {
      expect(() => {
        render(<QuickJumper {...defaultProps} onJump={undefined as any} />);
      }).not.toThrow();
    });

    it('should handle rapid input changes', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');

      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.change(input, { target: { value: '123' } });

      expect(input).toHaveValue('123');
    });
  });

  describe('输入清除', () => {
    it('should clear input after invalid value on Enter', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should clear input after jumping to same page', () => {
      render(<QuickJumper {...defaultProps} current={3} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '3' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(input).toHaveValue('');
    });

    it('should preserve input on non-Enter keys', () => {
      render(<QuickJumper {...defaultProps} />);

      const input = screen.getByTestId('jumper-input');
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.keyUp(input, { key: 'a' });

      expect(input).toHaveValue('5');
    });
  });
});
