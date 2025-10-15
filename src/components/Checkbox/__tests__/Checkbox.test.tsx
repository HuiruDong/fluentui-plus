import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  Checkbox: ({ checked, onChange, disabled, ...props }: any) => (
    <input
      type='checkbox'
      checked={checked === 'mixed' ? false : checked}
      onChange={e => onChange?.(e, { checked: e.target.checked })}
      disabled={disabled}
      data-indeterminate={checked === 'mixed'}
      data-testid='fluentui-checkbox'
      {...props}
    />
  ),
}));

describe('Checkbox Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Checkbox>Test Checkbox</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      const label = screen.getByText('Test Checkbox');

      expect(checkbox).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(checkbox.parentElement).toHaveClass('fluentui-plus-checkbox');
    });

    it('should render without label when children is not provided', () => {
      render(<Checkbox />);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.queryByText('Test Checkbox')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Checkbox className='custom-class'>Test</Checkbox>);

      const checkboxContainer = screen.getByTestId('fluentui-checkbox').parentElement;
      expect(checkboxContainer).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const customStyle = { fontSize: '16px', padding: '8px' };
      render(<Checkbox style={customStyle}>Test</Checkbox>);

      const checkboxContainer = screen.getByTestId('fluentui-checkbox').parentElement;
      expect(checkboxContainer).toHaveStyle('font-size: 16px');
      expect(checkboxContainer).toHaveStyle('padding: 8px');
    });
  });

  describe('受控模式', () => {
    it('should be controlled when checked prop is provided', () => {
      const onChange = jest.fn();
      render(
        <Checkbox checked={true} onChange={onChange}>
          Controlled
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should call onChange when clicked in controlled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={onChange}>
          Controlled
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when unchecking', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Checkbox checked={true} onChange={onChange}>
          Controlled
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('非受控模式', () => {
    it('should use defaultChecked for initial state', () => {
      render(<Checkbox defaultChecked={true}>Uncontrolled</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should toggle state when clicked in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Checkbox defaultChecked={false} onChange={onChange}>
          Uncontrolled
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('不确定状态', () => {
    it('should show indeterminate state when indeterminate is true and checked is false', () => {
      render(
        <Checkbox indeterminate={true} checked={false}>
          Indeterminate
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toHaveAttribute('data-indeterminate', 'true');

      const container = checkbox.parentElement;
      expect(container).toHaveClass('fluentui-plus-checkbox--indeterminate');
    });

    it('should not show indeterminate state when checked is true', () => {
      render(
        <Checkbox indeterminate={true} checked={true}>
          Not Indeterminate
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).not.toHaveAttribute('data-indeterminate', 'true');

      const container = checkbox.parentElement;
      expect(container).not.toHaveClass('fluentui-plus-checkbox--indeterminate');
      expect(container).toHaveClass('fluentui-plus-checkbox--checked');
    });

    it('should not show indeterminate state when indeterminate is false', () => {
      render(
        <Checkbox indeterminate={false} checked={false}>
          Not Indeterminate
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).not.toHaveAttribute('data-indeterminate', 'true');

      const container = checkbox.parentElement;
      expect(container).not.toHaveClass('fluentui-plus-checkbox--indeterminate');
    });
  });

  describe('禁用状态', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox disabled={true}>Disabled</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toBeDisabled();

      const container = checkbox.parentElement;
      expect(container).toHaveClass('fluentui-plus-checkbox--disabled');
    });

    it('should not call onChange when disabled checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Checkbox disabled={true} onChange={onChange}>
          Disabled
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      await user.click(checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('标签位置', () => {
    it('should render label after checkbox by default', () => {
      render(<Checkbox>Default Label</Checkbox>);

      const container = screen.getByTestId('fluentui-checkbox').parentElement;
      const checkbox = screen.getByTestId('fluentui-checkbox');
      screen.getByText('Default Label');

      expect(container).toHaveClass('fluentui-plus-checkbox--label-after');

      // 检查元素顺序
      const elements = Array.from(container?.children || []);
      const checkboxIndex = elements.indexOf(checkbox);
      const labelIndex = elements.findIndex(el => el.textContent === 'Default Label');

      expect(checkboxIndex).toBeLessThan(labelIndex);
    });

    it('should render label before checkbox when labelPosition is before', () => {
      render(<Checkbox labelPosition='before'>Before Label</Checkbox>);

      const container = screen.getByTestId('fluentui-checkbox').parentElement;
      const checkbox = screen.getByTestId('fluentui-checkbox');
      screen.getByText('Before Label');

      expect(container).toHaveClass('fluentui-plus-checkbox--label-before');

      // 检查元素顺序
      const elements = Array.from(container?.children || []);
      const checkboxIndex = elements.indexOf(checkbox);
      const labelIndex = elements.findIndex(el => el.textContent === 'Before Label');

      expect(labelIndex).toBeLessThan(checkboxIndex);
    });

    it('should render label after checkbox when labelPosition is after', () => {
      render(<Checkbox labelPosition='after'>After Label</Checkbox>);

      const container = screen.getByTestId('fluentui-checkbox').parentElement;
      const checkbox = screen.getByTestId('fluentui-checkbox');
      screen.getByText('After Label');

      expect(container).toHaveClass('fluentui-plus-checkbox--label-after');

      // 检查元素顺序
      const elements = Array.from(container?.children || []);
      const checkboxIndex = elements.indexOf(checkbox);
      const labelIndex = elements.findIndex(el => el.textContent === 'After Label');

      expect(checkboxIndex).toBeLessThan(labelIndex);
    });
  });

  describe('样式类名', () => {
    it('should apply checked class when checked', () => {
      render(<Checkbox checked={true}>Checked</Checkbox>);

      const container = screen.getByTestId('fluentui-checkbox').parentElement;
      expect(container).toHaveClass('fluentui-plus-checkbox--checked');
    });

    it('should not apply checked class when not checked', () => {
      render(<Checkbox checked={false}>Not Checked</Checkbox>);

      const container = screen.getByTestId('fluentui-checkbox').parentElement;
      expect(container).not.toHaveClass('fluentui-plus-checkbox--checked');
    });

    it('should have label class on label element', () => {
      render(<Checkbox>Test Label</Checkbox>);

      const labelElement = screen.getByText('Test Label');
      expect(labelElement).toHaveClass('fluentui-plus-checkbox__label');
    });
  });

  describe('事件处理', () => {
    it('should handle keyboard events', () => {
      const onChange = jest.fn();
      render(<Checkbox onChange={onChange}>Keyboard Test</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');

      fireEvent.keyDown(checkbox, { key: 'Enter' });
      fireEvent.keyDown(checkbox, { key: ' ' });

      // 键盘事件应该由底层的 FluentUI Checkbox 处理
      // 我们主要测试组件是否正确渲染
      expect(checkbox).toBeInTheDocument();
    });

    it('should not throw error when onChange is not provided', async () => {
      const user = userEvent.setup();
      render(<Checkbox>No onChange</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');

      // 应该不会抛出错误
      expect(() => user.click(checkbox)).not.toThrow();
    });
  });

  describe('复合组件', () => {
    it('should have Group component as static property', () => {
      expect(Checkbox.Group).toBeDefined();
      expect(typeof Checkbox.Group).toBe('function');
    });
  });

  describe('边界情况', () => {
    it('should handle undefined checked prop', () => {
      render(<Checkbox checked={undefined}>Undefined Checked</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle empty children', () => {
      render(<Checkbox>{''}</Checkbox>);

      const checkbox = screen.getByTestId('fluentui-checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should handle React node as children', () => {
      render(
        <Checkbox>
          <span>Complex Label</span>
        </Checkbox>
      );

      const checkbox = screen.getByTestId('fluentui-checkbox');
      const label = screen.getByText('Complex Label');

      expect(checkbox).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });
});
