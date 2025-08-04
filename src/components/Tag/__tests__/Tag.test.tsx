import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Tag from '../Tag';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

jest.mock('@fluentui/react-icons', () => ({
  DismissFilled: () => <span data-testid='dismiss-icon'>×</span>,
}));

describe('Tag Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Tag>Test Tag</Tag>);
      const content = screen.getByText('Test Tag');
      expect(content).toBeInTheDocument();
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveClass('fluentui-plus-tag');
      expect(tag).toHaveClass('fluentui-plus-tag--bordered');
    });

    it('should render content correctly', () => {
      render(<Tag>Tag Content</Tag>);
      expect(screen.getByText('Tag Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Tag className='custom-class'>Test Tag</Tag>);
      const content = screen.getByText('Test Tag');
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const customStyle = { fontSize: '16px', padding: '8px' };
      render(<Tag style={customStyle}>Test Tag</Tag>);
      const content = screen.getByText('Test Tag');
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveStyle('font-size: 16px');
      expect(tag).toHaveStyle('padding: 8px');
    });

    it('should render as borderless when bordered is false', () => {
      render(<Tag bordered={false}>Test Tag</Tag>);
      const content = screen.getByText('Test Tag');
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveClass('fluentui-plus-tag--borderless');
      expect(tag).not.toHaveClass('fluentui-plus-tag--bordered');
    });
  });

  describe('颜色样式', () => {
    it('should apply custom color correctly', () => {
      render(<Tag color='#ff0000'>Red Tag</Tag>);
      const content = screen.getByText('Red Tag');
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveStyle('background-color: #ff0000');
      expect(tag).toHaveStyle('color: #fff');
    });

    it('should handle transparent colors', () => {
      render(<Tag color='rgba(255, 0, 0, 0.5)'>Semi-transparent Tag</Tag>);
      const content = screen.getByText('Semi-transparent Tag');
      const tag = content.closest('span')?.parentElement;
      expect(tag).toHaveStyle('background-color: rgba(255, 0, 0, 0.5)');
    });
  });

  describe('关闭功能', () => {
    it('should show close icon when closeIcon is true', () => {
      render(<Tag closeIcon>Closable Tag</Tag>);
      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      expect(closeIcon).toBeInTheDocument();
      expect(screen.getByTestId('dismiss-icon')).toBeInTheDocument();
    });

    it('should not show close icon by default', () => {
      render(<Tag>Default Tag</Tag>);
      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      expect(closeIcon).not.toBeInTheDocument();
    });

    it('should show custom close icon', () => {
      const customIcon = <span data-testid='custom-close'>X</span>;
      render(<Tag closeIcon={customIcon}>Custom Close</Tag>);

      expect(screen.getByTestId('custom-close')).toBeInTheDocument();
      expect(screen.queryByTestId('dismiss-icon')).not.toBeInTheDocument();
    });

    it('should call onClose when close icon is clicked', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();

      render(
        <Tag closeIcon onClose={onClose}>
          Closable Tag
        </Tag>
      );

      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      await user.click(closeIcon!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation when close icon is clicked', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      const onClick = jest.fn();

      render(
        <Tag closeIcon onClose={onClose} onClick={onClick}>
          Closable Tag
        </Tag>
      );

      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      await user.click(closeIcon!);

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('点击事件', () => {
    it('should call onClick when tag is clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Tag onClick={onClick}>Clickable Tag</Tag>);

      const tag = screen.getByText('Clickable Tag').parentElement;
      await user.click(tag!);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when tag is not clickable', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Tag>Non-clickable Tag</Tag>);

      const tag = screen.getByText('Non-clickable Tag').parentElement;
      await user.click(tag!);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('子组件', () => {
    it('should have CheckableTag as static property', () => {
      expect(Tag.CheckableTag).toBeDefined();
    });
  });
});
