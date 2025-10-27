import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectionCell from '../SelectionCell';
import type { RowSelection } from '../types';

// Mock Checkbox component
jest.mock('../../Checkbox', () => ({
  __esModule: true,
  default: ({ checked, disabled, onChange, className }: any) => (
    <input
      type='checkbox'
      checked={checked}
      disabled={disabled}
      onChange={e => onChange?.(e.target.checked)}
      data-testid='checkbox'
      className={className}
    />
  ),
}));

describe('SelectionCell', () => {
  interface TestRecord {
    key: string;
    name: string;
    age: number;
  }

  const mockRecord: TestRecord = {
    key: '1',
    name: 'Alice',
    age: 25,
  };

  const defaultProps = {
    record: mockRecord,
    index: 0,
    selected: false,
    onSelect: jest.fn(),
    prefixCls: 'fluentui-plus-table',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应该渲染复选框', () => {
      render(<SelectionCell {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('应该根据 selected 设置复选框状态', () => {
      const { rerender } = render(<SelectionCell {...defaultProps} selected={false} />);

      let checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      rerender(<SelectionCell {...defaultProps} selected={true} />);
      checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('应该正确设置 className', () => {
      render(<SelectionCell {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('fluentui-plus-table-selection-checkbox');
    });
  });

  describe('交互行为', () => {
    it('应该在点击复选框时调用 onSelect', () => {
      const onSelect = jest.fn();
      render(<SelectionCell {...defaultProps} onSelect={onSelect} />);

      const checkbox = screen.getByTestId('checkbox');
      fireEvent.click(checkbox);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(true);
    });

    it('应该在取消选中时调用 onSelect', () => {
      const onSelect = jest.fn();
      render(<SelectionCell {...defaultProps} selected={true} onSelect={onSelect} />);

      const checkbox = screen.getByTestId('checkbox');
      fireEvent.click(checkbox);

      expect(onSelect).toHaveBeenCalledWith(false);
    });

    it('应该正确应用禁用状态', () => {
      const onSelect = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: () => ({
          disabled: true,
        }),
      };

      render(<SelectionCell {...defaultProps} onSelect={onSelect} rowSelection={rowSelection} />);

      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
    });
  });

  describe('getCheckboxProps 支持', () => {
    it('应该应用 getCheckboxProps 返回的 disabled 属性', () => {
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: record => ({
          disabled: record.age > 20,
        }),
      };

      render(<SelectionCell {...defaultProps} rowSelection={rowSelection} />);

      const checkbox = screen.getByTestId('checkbox') as HTMLInputElement;
      expect(checkbox.disabled).toBe(true);
    });

    it('应该支持自定义渲染函数', () => {
      const customRender = jest.fn(() => <span data-testid='custom-checkbox'>Custom</span>);
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: () => ({
          render: customRender,
        }),
      };

      render(<SelectionCell {...defaultProps} rowSelection={rowSelection} />);

      // 应该调用自定义渲染函数
      expect(customRender).toHaveBeenCalledWith(mockRecord, 0);

      // 应该渲染自定义内容
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
      expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
    });

    it('应该在自定义渲染函数中正确传递 index', () => {
      const customRender = jest.fn(() => <span>Custom</span>);
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: () => ({
          render: customRender,
        }),
      };

      render(<SelectionCell {...defaultProps} index={5} rowSelection={rowSelection} />);

      expect(customRender).toHaveBeenCalledWith(mockRecord, 5);
    });
  });

  describe('边界情况', () => {
    it('应该在没有 rowSelection 时正常渲染', () => {
      render(<SelectionCell {...defaultProps} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeDisabled();
    });

    it('应该在 getCheckboxProps 返回 undefined 时正常渲染', () => {
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: () => undefined as any,
      };

      render(<SelectionCell {...defaultProps} rowSelection={rowSelection} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeDisabled();
    });
  });
});
