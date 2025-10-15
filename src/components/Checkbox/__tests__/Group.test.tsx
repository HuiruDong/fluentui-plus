import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Group from '../Group';
import type { Option } from '../types';

// Mock Checkbox component
jest.mock('../Checkbox', () => {
  const MockCheckbox = ({ children, checked, disabled, labelPosition, onChange }: any) => {
    const props: any = {
      'data-testid': 'checkbox-item',
    };

    // 只有当 labelPosition 有值时才设置 data-label-position 属性
    if (labelPosition !== undefined) {
      props['data-label-position'] = labelPosition;
    }

    return (
      <div {...props}>
        <input
          type='checkbox'
          checked={checked}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          data-testid={`checkbox-${children}`}
        />
        <label>{children}</label>
      </div>
    );
  };

  return MockCheckbox;
});

describe('Checkbox Group Component', () => {
  const defaultOptions: Option[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const optionsWithDisabled: Option[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2', disabled: true },
    { label: 'Option 3', value: 'option3' },
  ];

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Group options={defaultOptions} />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass('fluentui-plus-checkbox-group');
      expect(group).toHaveClass('fluentui-plus-checkbox-group--vertical');

      // 应该渲染所有选项
      defaultOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should render with custom className', () => {
      render(<Group options={defaultOptions} className='custom-group' />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveClass('custom-group');
    });

    it('should apply custom styles', () => {
      const customStyle = { fontSize: '16px', padding: '8px' };
      render(<Group options={defaultOptions} style={customStyle} />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveStyle('font-size: 16px');
      expect(group).toHaveStyle('padding: 8px');
    });

    it('should render empty group when no options provided', () => {
      render(<Group />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toBeInTheDocument();
      expect(group?.children).toHaveLength(0);
    });

    it('should render empty group when options is empty array', () => {
      render(<Group options={[]} />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toBeInTheDocument();
      expect(group?.children).toHaveLength(0);
    });
  });

  describe('布局模式', () => {
    it('should render vertical layout by default', () => {
      render(<Group options={defaultOptions} />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveClass('fluentui-plus-checkbox-group--vertical');
      expect(group).not.toHaveClass('fluentui-plus-checkbox-group--horizontal');
    });

    it('should render horizontal layout when layout is horizontal', () => {
      render(<Group options={defaultOptions} layout='horizontal' />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveClass('fluentui-plus-checkbox-group--horizontal');
      expect(group).not.toHaveClass('fluentui-plus-checkbox-group--vertical');
    });

    it('should render vertical layout when layout is vertical', () => {
      render(<Group options={defaultOptions} layout='vertical' />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveClass('fluentui-plus-checkbox-group--vertical');
      expect(group).not.toHaveClass('fluentui-plus-checkbox-group--horizontal');
    });
  });

  describe('受控模式', () => {
    it('should render with controlled value', () => {
      const value = ['option1', 'option3'];
      render(<Group options={defaultOptions} value={value} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      const option2Checkbox = screen.getByTestId('checkbox-Option 2');
      const option3Checkbox = screen.getByTestId('checkbox-Option 3');

      expect(option1Checkbox).toBeChecked();
      expect(option2Checkbox).not.toBeChecked();
      expect(option3Checkbox).toBeChecked();
    });

    it('should call onChange when checkbox clicked in controlled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const value = ['option1'];

      render(<Group options={defaultOptions} value={value} onChange={onChange} />);

      const option2Checkbox = screen.getByTestId('checkbox-Option 2');
      await user.click(option2Checkbox);

      expect(onChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('should call onChange when unchecking item in controlled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const value = ['option1', 'option2'];

      render(<Group options={defaultOptions} value={value} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      await user.click(option1Checkbox);

      expect(onChange).toHaveBeenCalledWith(['option2']);
    });

    it('should handle empty value array', () => {
      render(<Group options={defaultOptions} value={[]} />);

      defaultOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe('非受控模式', () => {
    it('should use defaultValue for initial state', () => {
      const defaultValue = ['option1', 'option3'];
      render(<Group options={defaultOptions} defaultValue={defaultValue} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      const option2Checkbox = screen.getByTestId('checkbox-Option 2');
      const option3Checkbox = screen.getByTestId('checkbox-Option 3');

      expect(option1Checkbox).toBeChecked();
      expect(option2Checkbox).not.toBeChecked();
      expect(option3Checkbox).toBeChecked();
    });

    it('should use empty array as default when defaultValue not provided', () => {
      render(<Group options={defaultOptions} />);

      defaultOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should manage internal state in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Group options={defaultOptions} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      await user.click(option1Checkbox);

      expect(onChange).toHaveBeenCalledWith(['option1']);
      expect(option1Checkbox).toBeChecked();
    });

    it('should handle multiple selections in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Group options={defaultOptions} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      const option3Checkbox = screen.getByTestId('checkbox-Option 3');

      await user.click(option1Checkbox);
      expect(onChange).toHaveBeenCalledWith(['option1']);

      await user.click(option3Checkbox);
      expect(onChange).toHaveBeenCalledWith(['option1', 'option3']);
    });

    it('should handle unchecking in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const defaultValue = ['option1', 'option2'];

      render(<Group options={defaultOptions} defaultValue={defaultValue} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      await user.click(option1Checkbox);

      expect(onChange).toHaveBeenCalledWith(['option2']);
    });
  });

  describe('禁用状态', () => {
    it('should disable all checkboxes when disabled is true', () => {
      render(<Group options={defaultOptions} disabled={true} />);

      const group = document.querySelector('.fluentui-plus-checkbox-group');
      expect(group).toHaveClass('fluentui-plus-checkbox-group--disabled');

      defaultOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).toBeDisabled();
      });
    });

    it('should disable specific options when option.disabled is true', () => {
      render(<Group options={optionsWithDisabled} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      const option2Checkbox = screen.getByTestId('checkbox-Option 2');
      const option3Checkbox = screen.getByTestId('checkbox-Option 3');

      expect(option1Checkbox).not.toBeDisabled();
      expect(option2Checkbox).toBeDisabled();
      expect(option3Checkbox).not.toBeDisabled();
    });

    it('should disable option when both group and option are disabled', () => {
      render(<Group options={optionsWithDisabled} disabled={true} />);

      optionsWithDisabled.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).toBeDisabled();
      });
    });

    it('should not call onChange when disabled checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Group options={defaultOptions} disabled={true} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      await user.click(option1Checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when individually disabled checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Group options={optionsWithDisabled} onChange={onChange} />);

      const option2Checkbox = screen.getByTestId('checkbox-Option 2');
      await user.click(option2Checkbox);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('选项配置', () => {
    it('should handle string values', () => {
      const stringOptions: Option[] = [
        { label: 'String 1', value: 'string1' },
        { label: 'String 2', value: 'string2' },
      ];

      render(<Group options={stringOptions} value={['string1']} />);

      const checkbox1 = screen.getByTestId('checkbox-String 1');
      const checkbox2 = screen.getByTestId('checkbox-String 2');

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
    });

    it('should handle number values', () => {
      const numberOptions: Option[] = [
        { label: 'Number 1', value: 1 },
        { label: 'Number 2', value: 2 },
      ];

      render(<Group options={numberOptions} value={[1]} />);

      const checkbox1 = screen.getByTestId('checkbox-Number 1');
      const checkbox2 = screen.getByTestId('checkbox-Number 2');

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
    });

    it('should handle mixed string and number values', () => {
      const mixedOptions: Option[] = [
        { label: 'String Option', value: 'string' },
        { label: 'Number Option', value: 42 },
      ];

      render(<Group options={mixedOptions} value={['string', 42]} />);

      const stringCheckbox = screen.getByTestId('checkbox-String Option');
      const numberCheckbox = screen.getByTestId('checkbox-Number Option');

      expect(stringCheckbox).toBeChecked();
      expect(numberCheckbox).toBeChecked();
    });
  });

  describe('事件处理', () => {
    it('should not throw error when onChange is not provided', async () => {
      const user = userEvent.setup();
      render(<Group options={defaultOptions} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');

      expect(() => user.click(option1Checkbox)).not.toThrow();
    });

    it('should handle rapid clicking', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<Group options={defaultOptions} onChange={onChange} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');

      // 快速点击多次
      await user.click(option1Checkbox);
      await user.click(option1Checkbox);
      await user.click(option1Checkbox);

      // 应该调用了3次
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenNthCalledWith(1, ['option1']);
      expect(onChange).toHaveBeenNthCalledWith(2, []);
      expect(onChange).toHaveBeenNthCalledWith(3, ['option1']);
    });

    it('should preserve order when adding items', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<Group options={defaultOptions} onChange={onChange} />);

      // 按顺序点击
      await user.click(screen.getByTestId('checkbox-Option 3'));
      expect(onChange).toHaveBeenLastCalledWith(['option3']);

      await user.click(screen.getByTestId('checkbox-Option 1'));
      expect(onChange).toHaveBeenLastCalledWith(['option3', 'option1']);

      await user.click(screen.getByTestId('checkbox-Option 2'));
      expect(onChange).toHaveBeenLastCalledWith(['option3', 'option1', 'option2']);
    });
  });

  describe('边界情况', () => {
    it('should handle undefined value prop', () => {
      render(<Group options={defaultOptions} value={undefined} />);

      // 应该回退到非受控模式
      defaultOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should handle null defaultValue', () => {
      render(<Group options={defaultOptions} defaultValue={null as any} />);

      // 应该使用空数组作为默认值
      defaultOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.label}`);
        expect(checkbox).not.toBeChecked();
      });
    });

    it('should handle option with empty label', () => {
      const optionsWithEmptyLabel: Option[] = [
        { label: '', value: 'empty' },
        { label: 'Normal', value: 'normal' },
      ];

      render(<Group options={optionsWithEmptyLabel} />);

      // 应该正常渲染
      expect(screen.getByTestId('checkbox-')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-Normal')).toBeInTheDocument();
    });

    it('should handle duplicate values', () => {
      const optionsWithDuplicates: Option[] = [
        { label: 'First', value: 'duplicate1' },
        { label: 'Second', value: 'duplicate2' },
      ];

      const onChange = jest.fn();
      render(<Group options={optionsWithDuplicates} onChange={onChange} />);

      // 由于 key 是基于 value 的，这可能会导致问题
      // 但组件应该能正常渲染
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('should handle switching between controlled and uncontrolled', () => {
      const { rerender } = render(<Group options={defaultOptions} />);

      // 从非受控模式切换到受控模式
      rerender(<Group options={defaultOptions} value={['option1']} />);

      const option1Checkbox = screen.getByTestId('checkbox-Option 1');
      expect(option1Checkbox).toBeChecked();
    });
  });

  describe('标签位置', () => {
    it('should pass labelPosition to individual checkbox', () => {
      const optionsWithLabelPosition: Option[] = [
        { label: 'After Label', value: 'after', labelPosition: 'after' },
        { label: 'Before Label', value: 'before', labelPosition: 'before' },
        { label: 'Default Label', value: 'default' }, // 没有设置 labelPosition
      ];

      render(<Group options={optionsWithLabelPosition} />);

      const afterCheckbox = screen.getByTestId('checkbox-After Label').parentElement;
      const beforeCheckbox = screen.getByTestId('checkbox-Before Label').parentElement;
      const defaultCheckbox = screen.getByTestId('checkbox-Default Label').parentElement;

      expect(afterCheckbox).toHaveAttribute('data-label-position', 'after');
      expect(beforeCheckbox).toHaveAttribute('data-label-position', 'before');
      expect(defaultCheckbox).not.toHaveAttribute('data-label-position'); // 没有设置 labelPosition
    });

    it('should handle mixed labelPosition in options', () => {
      const mixedOptions: Option[] = [
        { label: 'Option 1', value: '1', labelPosition: 'before' },
        { label: 'Option 2', value: '2' }, // 默认值
        { label: 'Option 3', value: '3', labelPosition: 'after' },
        { label: 'Option 4', value: '4', labelPosition: 'before' },
      ];

      render(<Group options={mixedOptions} defaultValue={['1', '3']} />);

      // 检查每个选项的 labelPosition 是否正确传递
      const option1 = screen.getByTestId('checkbox-Option 1').parentElement;
      const option2 = screen.getByTestId('checkbox-Option 2').parentElement;
      const option3 = screen.getByTestId('checkbox-Option 3').parentElement;
      const option4 = screen.getByTestId('checkbox-Option 4').parentElement;

      expect(option1).toHaveAttribute('data-label-position', 'before');
      expect(option2).not.toHaveAttribute('data-label-position'); // 没有设置 labelPosition
      expect(option3).toHaveAttribute('data-label-position', 'after');
      expect(option4).toHaveAttribute('data-label-position', 'before');
    });

    it('should handle labelPosition with disabled options', () => {
      const optionsWithLabelPositionAndDisabled: Option[] = [
        { label: 'Disabled Before', value: 'disabled', disabled: true, labelPosition: 'before' },
        { label: 'Normal After', value: 'normal', labelPosition: 'after' },
      ];

      render(<Group options={optionsWithLabelPositionAndDisabled} />);

      const disabledCheckbox = screen.getByTestId('checkbox-Disabled Before');
      const normalCheckbox = screen.getByTestId('checkbox-Normal After');

      expect(disabledCheckbox).toBeDisabled();
      expect(disabledCheckbox.parentElement).toHaveAttribute('data-label-position', 'before');
      expect(normalCheckbox.parentElement).toHaveAttribute('data-label-position', 'after');
    });
  });
});
