import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverflowMenuItem from '../OverflowMenuItem';
import type { TabItem } from '../types';

// Mock FluentUI components
const mockUseIsOverflowItemVisible = jest.fn();

jest.mock('@fluentui/react-components', () => ({
  MenuItem: ({
    children,
    icon,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid='menu-item' onClick={onClick} {...props}>
      {icon && <span data-testid='menu-item-icon'>{icon}</span>}
      {children}
    </button>
  ),
  useIsOverflowItemVisible: (id: string) => mockUseIsOverflowItemVisible(id),
}));

describe('OverflowMenuItem', () => {
  const basicTab: TabItem = {
    key: 'tab1',
    label: '标签一',
  };

  const tabWithIcon: TabItem = {
    key: 'home',
    label: '首页',
    icon: <span data-testid='custom-icon'>🏠</span>,
  };

  const disabledTab: TabItem = {
    key: 'disabled',
    label: '禁用标签',
    disabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: item is not visible (should be shown in overflow menu)
    mockUseIsOverflowItemVisible.mockReturnValue(false);
  });

  describe('可见性', () => {
    it('should render when item is not visible in main tab list', () => {
      mockUseIsOverflowItemVisible.mockReturnValue(false);

      render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      expect(screen.getByTestId('menu-item')).toBeInTheDocument();
    });

    it('should not render when item is visible in main tab list', () => {
      mockUseIsOverflowItemVisible.mockReturnValue(true);

      const { container } = render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      expect(container.firstChild).toBeNull();
    });

    it('should call useIsOverflowItemVisible with correct key', () => {
      render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      expect(mockUseIsOverflowItemVisible).toHaveBeenCalledWith('tab1');
    });
  });

  describe('基础渲染', () => {
    it('should render tab label', () => {
      render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      expect(screen.getByText('标签一')).toBeInTheDocument();
    });

    it('should render label inside a div', () => {
      render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      const labelDiv = screen.getByText('标签一');
      expect(labelDiv.tagName).toBe('DIV');
    });
  });

  describe('图标渲染', () => {
    it('should render icon when provided', () => {
      render(<OverflowMenuItem tab={tabWithIcon} onClick={jest.fn()} />);

      expect(screen.getByTestId('menu-item-icon')).toBeInTheDocument();
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should not render icon container when icon is not provided', () => {
      render(<OverflowMenuItem tab={basicTab} onClick={jest.fn()} />);

      expect(screen.queryByTestId('menu-item-icon')).not.toBeInTheDocument();
    });
  });

  describe('点击事件', () => {
    it('should call onClick when menu item is clicked', () => {
      const onClick = jest.fn();
      render(<OverflowMenuItem tab={basicTab} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('menu-item'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', () => {
      const onClick = jest.fn();
      render(<OverflowMenuItem tab={basicTab} onClick={onClick} />);

      const menuItem = screen.getByTestId('menu-item');
      fireEvent.click(menuItem);
      fireEvent.click(menuItem);
      fireEvent.click(menuItem);

      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('禁用状态', () => {
    it('should render disabled tab', () => {
      render(<OverflowMenuItem tab={disabledTab} onClick={jest.fn()} />);

      expect(screen.getByText('禁用标签')).toBeInTheDocument();
    });
  });

  describe('不同 key 的处理', () => {
    it('should handle tabs with different keys', () => {
      const tabs = [
        { key: 'key-1', label: 'Label 1' },
        { key: 'key-2', label: 'Label 2' },
        { key: 'special_key', label: 'Special' },
      ];

      tabs.forEach(tab => {
        mockUseIsOverflowItemVisible.mockReturnValue(false);
        const { unmount } = render(<OverflowMenuItem tab={tab} onClick={jest.fn()} />);

        expect(mockUseIsOverflowItemVisible).toHaveBeenCalledWith(tab.key);
        expect(screen.getByText(tab.label)).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('空值处理', () => {
    it('should handle tab with empty label', () => {
      const emptyLabelTab: TabItem = {
        key: 'empty',
        label: '',
      };

      render(<OverflowMenuItem tab={emptyLabelTab} onClick={jest.fn()} />);

      expect(screen.getByTestId('menu-item')).toBeInTheDocument();
    });

    it('should handle tab with undefined label', () => {
      const undefinedLabelTab: TabItem = {
        key: 'undefined',
      };

      render(<OverflowMenuItem tab={undefinedLabelTab} onClick={jest.fn()} />);

      expect(screen.getByTestId('menu-item')).toBeInTheDocument();
    });
  });
});
