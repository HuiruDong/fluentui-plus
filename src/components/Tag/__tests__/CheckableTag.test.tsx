import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CheckableTag from '../CheckableTag';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

// Mock Tag component
jest.mock('../Tag', () => {
  return function MockTag({
    children,
    className,
    onClick,
    color,
    style,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    color?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) {
    return (
      <span
        className={className}
        onClick={onClick}
        style={{
          ...style,
          backgroundColor: color ?? style?.backgroundColor,
        }}
        {...props}
      >
        <span className='tag-content'>{children}</span>
      </span>
    );
  };
});

describe('CheckableTag Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<CheckableTag>Checkable Tag</CheckableTag>);
      const content = screen.getByText('Checkable Tag');
      expect(content).toBeInTheDocument();
      const tag = content.closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
    });

    it('should render content correctly', () => {
      render(<CheckableTag>Test Content</CheckableTag>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className along with default classes', () => {
      render(<CheckableTag className='custom-class'>Custom Tag</CheckableTag>);
      const content = screen.getByText('Custom Tag');
      const tag = content.closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
      expect(tag).toHaveClass('custom-class');
    });
  });

  describe('选中状态', () => {
    it('should apply checked class when checked is true', () => {
      render(<CheckableTag checked>Checked Tag</CheckableTag>);
      const content = screen.getByText('Checked Tag');
      const tag = content.closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
      expect(tag).toHaveClass('fluentui-plus-checkable-tag--checked');
    });

    it('should not apply checked class when checked is false', () => {
      render(<CheckableTag checked={false}>Unchecked Tag</CheckableTag>);
      const content = screen.getByText('Unchecked Tag');
      const tag = content.closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
      expect(tag).not.toHaveClass('fluentui-plus-checkable-tag--checked');
    });

    it('should not apply checked class when checked is undefined', () => {
      render(<CheckableTag>Default Tag</CheckableTag>);
      const content = screen.getByText('Default Tag');
      const tag = content.closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
      expect(tag).not.toHaveClass('fluentui-plus-checkable-tag--checked');
    });
  });

  describe('交互功能', () => {
    it('should call onChange with opposite value when clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <CheckableTag checked={false} onChange={onChange}>
          Clickable Tag
        </CheckableTag>
      );

      const tag = screen.getByText('Clickable Tag').closest('span');
      await user.click(tag!);

      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when checked tag is clicked', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <CheckableTag checked={true} onChange={onChange}>
          Checked Tag
        </CheckableTag>
      );

      const tag = screen.getByText('Checked Tag').closest('span');
      await user.click(tag!);

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should not call onChange when onChange is not provided', async () => {
      const user = userEvent.setup();

      render(<CheckableTag checked={false}>No onChange</CheckableTag>);

      const tag = screen.getByText('No onChange').closest('span');
      await user.click(tag!);

      // Should not throw error
      expect(tag).toBeInTheDocument();
    });

    it('should handle multiple clicks correctly', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <CheckableTag checked={false} onChange={onChange}>
          Toggle Tag
        </CheckableTag>
      );

      const tag = screen.getByText('Toggle Tag').closest('span');

      await user.click(tag!);
      expect(onChange).toHaveBeenLastCalledWith(true);

      await user.click(tag!);
      expect(onChange).toHaveBeenLastCalledWith(true); // Always sends opposite of current checked value

      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('属性传递', () => {
    it('should pass through other props to Tag component', () => {
      render(
        <CheckableTag checked={true} color='#ff0000' data-testid='test-tag'>
          Props Tag
        </CheckableTag>
      );

      const tag = screen.getByTestId('test-tag');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' }); // CSS 中颜色会转换为 rgb 格式
    });

    it('should merge className correctly', () => {
      render(
        <CheckableTag checked={true} className='external-class'>
          Merged Classes
        </CheckableTag>
      );

      const tag = screen.getByText('Merged Classes').closest('span')?.parentElement; // 获取外层 span
      expect(tag).toHaveClass('fluentui-plus-checkable-tag');
      expect(tag).toHaveClass('fluentui-plus-checkable-tag--checked');
      expect(tag).toHaveClass('external-class');
    });
  });
});
