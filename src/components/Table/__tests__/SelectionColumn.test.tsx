import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectionColumn from '../SelectionColumn';

// Mock Checkbox component
jest.mock('../../Checkbox', () => ({
  __esModule: true,
  default: ({ checked, indeterminate, onChange, className }: any) => (
    <input
      type='checkbox'
      checked={checked}
      data-indeterminate={indeterminate}
      onChange={e => onChange?.(e.target.checked)}
      data-testid='checkbox'
      className={className}
    />
  ),
}));

describe('SelectionColumn', () => {
  const defaultProps = {
    isAllSelected: false,
    isIndeterminate: false,
    onSelectAll: jest.fn(),
    prefixCls: 'fluentui-plus-table',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该渲染复选框', () => {
      render(<SelectionColumn {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('应该正确设置 className', () => {
      render(<SelectionColumn {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('fluentui-plus-table-selection-checkbox');
    });
  });

  describe('全选状态', () => {
    it('应该根据 isAllSelected 设置复选框状态', () => {
      const { rerender } = render(<SelectionColumn {...defaultProps} isAllSelected={false} />);

      let checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      rerender(<SelectionColumn {...defaultProps} isAllSelected={true} />);
      checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('应该支持半选状态', () => {
      render(<SelectionColumn {...defaultProps} isIndeterminate={true} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
    });

    it('应该在全选和半选同时存在时优先显示全选', () => {
      render(<SelectionColumn {...defaultProps} isAllSelected={true} isIndeterminate={true} />);

      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      // indeterminate 属性仍然会传递，但视觉上应该显示为全选
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
    });
  });

  describe('交互行为', () => {
    it('应该在点击时调用 onSelectAll 选中所有', () => {
      const onSelectAll = jest.fn();
      render(<SelectionColumn {...defaultProps} onSelectAll={onSelectAll} />);

      const checkbox = screen.getByTestId('checkbox');
      fireEvent.click(checkbox);

      expect(onSelectAll).toHaveBeenCalledTimes(1);
      expect(onSelectAll).toHaveBeenCalledWith(true);
    });

    it('应该在已全选时点击取消全选', () => {
      const onSelectAll = jest.fn();
      render(<SelectionColumn {...defaultProps} isAllSelected={true} onSelectAll={onSelectAll} />);

      const checkbox = screen.getByTestId('checkbox');
      fireEvent.click(checkbox);

      expect(onSelectAll).toHaveBeenCalledWith(false);
    });

    it('应该在半选状态下点击全选', () => {
      const onSelectAll = jest.fn();
      render(<SelectionColumn {...defaultProps} isIndeterminate={true} onSelectAll={onSelectAll} />);

      const checkbox = screen.getByTestId('checkbox');
      fireEvent.click(checkbox);

      // 半选状态下点击应该全选
      expect(onSelectAll).toHaveBeenCalledWith(true);
    });
  });

  describe('边界情况', () => {
    it('应该在没有 onSelectAll 回调时不报错', () => {
      render(
        <SelectionColumn
          isAllSelected={false}
          isIndeterminate={false}
          onSelectAll={undefined as any}
          prefixCls='fluentui-plus-table'
        />
      );

      const checkbox = screen.getByTestId('checkbox');

      // 不应该抛出错误
      expect(() => {
        fireEvent.click(checkbox);
      }).not.toThrow();
    });
  });
});
