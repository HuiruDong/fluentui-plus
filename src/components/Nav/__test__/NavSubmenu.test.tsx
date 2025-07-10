import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavSubmenu from '../NavSubmenu';
import { NavItemType } from '../types';

// Mock FluentUI components to control their behavior in tests
jest.mock('@fluentui/react-components', () => ({
  Menu: ({
    children,
    positioning,
    hoverDelay,
  }: {
    children: React.ReactNode;
    positioning?: string;
    hoverDelay?: number;
  }) => (
    <div data-testid='menu' data-positioning={positioning} data-hover-delay={hoverDelay}>
      {children}
    </div>
  ),
  MenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-trigger'>{children}</div>,
  MenuPopover: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-popover'>{children}</div>,
  MenuList: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-list'>{children}</div>,
  MenuItem: ({
    children,
    icon,
    disabled,
    onClick,
  }: {
    children: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <div data-testid='menu-item' data-disabled={disabled} onClick={disabled ? undefined : onClick}>
      {icon && <span data-testid='menu-item-icon'>{icon}</span>}
      {children}
    </div>
  ),
  MenuDivider: () => <div data-testid='menu-divider' role='separator' />,
}));

describe('NavSubmenu Component', () => {
  const mockOnItemClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本渲染', () => {
    const simpleItems: NavItemType[] = [
      { key: 'item1', label: 'Item 1', icon: <span>📄</span> },
      { key: 'item2', label: 'Item 2', disabled: true },
      { key: 'divider1', type: 'divider' },
      { key: 'item3', label: 'Item 3' },
    ];

    it('should render menu items correctly', () => {
      render(<NavSubmenu items={simpleItems} onItemClick={mockOnItemClick} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should render menu item icons', () => {
      render(<NavSubmenu items={simpleItems} onItemClick={mockOnItemClick} />);

      const icons = screen.getAllByTestId('menu-item-icon');
      expect(icons).toHaveLength(1); // Only item1 has an icon
    });

    it('should render dividers', () => {
      render(<NavSubmenu items={simpleItems} onItemClick={mockOnItemClick} />);

      const divider = screen.getByTestId('menu-divider');
      expect(divider).toBeInTheDocument();
      expect(divider).toHaveAttribute('role', 'separator');
    });

    it('should handle disabled items', () => {
      render(<NavSubmenu items={simpleItems} onItemClick={mockOnItemClick} />);

      const disabledItem = screen.getByText('Item 2').closest('[data-testid="menu-item"]');
      expect(disabledItem).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('点击事件处理', () => {
    const clickableItems: NavItemType[] = [
      { key: 'item1', label: 'Item 1' },
      { key: 'item2', label: 'Item 2', disabled: true },
    ];

    it('should handle item click for enabled items', () => {
      render(<NavSubmenu items={clickableItems} onItemClick={mockOnItemClick} />);

      fireEvent.click(screen.getByText('Item 1'));

      expect(mockOnItemClick).toHaveBeenCalledWith('item1', {
        key: 'item1',
        label: 'Item 1',
      });
    });

    it('should not handle click for disabled items', () => {
      render(<NavSubmenu items={clickableItems} onItemClick={mockOnItemClick} />);

      const disabledItem = screen.getByText('Item 2').closest('[data-testid="menu-item"]');
      fireEvent.click(disabledItem!);

      expect(mockOnItemClick).not.toHaveBeenCalled();
    });
  });

  describe('嵌套子菜单', () => {
    const nestedItems: NavItemType[] = [
      {
        key: 'parent1',
        label: 'Parent 1',
        icon: <span>📁</span>,
        children: [
          { key: 'child1-1', label: 'Child 1-1' },
          { key: 'child1-2', label: 'Child 1-2' },
        ],
      },
      { key: 'leaf', label: 'Leaf Item' },
    ];

    it('should render nested menu structure', () => {
      render(<NavSubmenu items={nestedItems} onItemClick={mockOnItemClick} />);

      // Parent items should be rendered as MenuTriggers
      expect(screen.getByText('Parent 1')).toBeInTheDocument();
      expect(screen.getByText('Leaf Item')).toBeInTheDocument();

      // Check for nested menu structure
      const menus = screen.getAllByTestId('menu');
      expect(menus.length).toBeGreaterThan(0);

      const menuTriggers = screen.getAllByTestId('menu-trigger');
      expect(menuTriggers.length).toBeGreaterThan(0);
    });

    it('should set correct positioning for nested menus', () => {
      render(<NavSubmenu items={nestedItems} onItemClick={mockOnItemClick} />);

      const menus = screen.getAllByTestId('menu');
      menus.forEach(menu => {
        expect(menu).toHaveAttribute('data-positioning', 'after-top');
        expect(menu).toHaveAttribute('data-hover-delay', '0.1');
      });
    });
  });

  describe('边界情况', () => {
    it('should handle empty items array', () => {
      render(<NavSubmenu items={[]} onItemClick={mockOnItemClick} />);

      const menuItems = screen.queryAllByTestId('menu-item');
      expect(menuItems).toHaveLength(0);
    });

    it('should handle items with empty children array', () => {
      const itemsWithEmptyChildren: NavItemType[] = [
        {
          key: 'parent',
          label: 'Parent',
          children: [],
        },
      ];

      render(<NavSubmenu items={itemsWithEmptyChildren} onItemClick={mockOnItemClick} />);

      // Should render as a regular menu item since children is empty
      expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('should handle items without labels', () => {
      const itemsWithoutLabels: NavItemType[] = [
        { key: 'item1' }, // No label
        { key: 'item2', label: '' }, // Empty label
      ];

      render(<NavSubmenu items={itemsWithoutLabels} onItemClick={mockOnItemClick} />);

      const menuItems = screen.getAllByTestId('menu-item');
      expect(menuItems).toHaveLength(2);
    });
  });

  describe('可访问性', () => {
    const accessibilityItems: NavItemType[] = [
      { key: 'item1', label: 'Item 1' },
      { key: 'divider1', type: 'divider' },
      { key: 'item2', label: 'Item 2', disabled: true },
    ];

    it('should maintain proper ARIA structure', () => {
      render(<NavSubmenu items={accessibilityItems} onItemClick={mockOnItemClick} />);

      const divider = screen.getByTestId('menu-divider');
      expect(divider).toHaveAttribute('role', 'separator');
    });

    it('should properly indicate disabled state', () => {
      render(<NavSubmenu items={accessibilityItems} onItemClick={mockOnItemClick} />);

      const disabledItem = screen.getByText('Item 2').closest('[data-testid="menu-item"]');
      expect(disabledItem).toHaveAttribute('data-disabled', 'true');
    });
  });
});
