import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavItem from '../NavItem';
import { NavItemType } from '../types';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
  Tooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div data-testid='tooltip' title={content}>
      {children}
    </div>
  ),
  Menu: ({ children, open }: { children: React.ReactNode; open?: boolean }) => (
    <div data-testid='menu' data-open={open}>
      {children}
    </div>
  ),
  MenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-trigger'>{children}</div>,
  MenuPopover: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-popover'>{children}</div>,
  MenuList: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-list'>{children}</div>,
  Divider: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <div data-testid='divider' className={className} style={style} />
  ),
}));

jest.mock('@fluentui/react-icons', () => ({
  ChevronRightRegular: () => <span data-testid='chevron-icon'>▶</span>,
}));

// Mock NavSubmenu component
jest.mock('../NavSubmenu', () => {
  return function MockNavSubmenu({
    items,
    onItemClick,
  }: {
    items: NavItemType[];
    onItemClick: (key: string, item: NavItemType) => void;
  }) {
    return (
      <div data-testid='nav-submenu'>
        {items.map(item => (
          <div key={item.key} onClick={() => onItemClick(item.key, item)}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };
});

describe('NavItem Component', () => {
  const mockOnItemClick = jest.fn();
  const mockOnToggleExpand = jest.fn();

  const defaultProps = {
    level: 0,
    selectedKeys: [],
    openKeys: [],
    onItemClick: mockOnItemClick,
    onToggleExpand: mockOnToggleExpand,
    prefixCls: 'fluentui-plus-nav',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('普通菜单项', () => {
    const normalItem: NavItemType = {
      key: 'menu1',
      label: 'Menu 1',
      icon: <span data-testid='menu-icon'>📁</span>,
    };

    it('should render normal menu item', () => {
      render(<NavItem {...defaultProps} item={normalItem} />);

      expect(screen.getByText('Menu 1')).toBeInTheDocument();
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('should handle click on normal item', () => {
      render(<NavItem {...defaultProps} item={normalItem} />);

      fireEvent.click(screen.getByText('Menu 1'));

      expect(mockOnItemClick).toHaveBeenCalledWith('menu1', normalItem);
      expect(mockOnToggleExpand).not.toHaveBeenCalled();
    });

    it('should apply selected state', () => {
      render(<NavItem {...defaultProps} item={normalItem} selectedKeys={['menu1']} />);

      const menuItem = screen.getByRole('menuitem');
      expect(menuItem).toHaveClass('fluentui-plus-nav__item--selected');
    });

    it('should apply disabled state', () => {
      const disabledItem = { ...normalItem, disabled: true };
      render(<NavItem {...defaultProps} item={disabledItem} />);

      const menuItem = screen.getByRole('menuitem');
      expect(menuItem).toHaveClass('fluentui-plus-nav__item--disabled');
      expect(menuItem).toHaveAttribute('aria-disabled', 'true');
      expect(menuItem).toHaveAttribute('tabIndex', '-1');

      fireEvent.click(screen.getByText('Menu 1'));
      expect(mockOnItemClick).not.toHaveBeenCalled();
    });

    it('should apply custom className and style', () => {
      const styledItem = { ...normalItem, className: 'custom-class', style: { color: 'red' } };
      render(<NavItem {...defaultProps} item={styledItem} />);

      const menuItem = screen.getByRole('menuitem');
      expect(menuItem).toHaveClass('custom-class');
      expect(menuItem).toHaveStyle('color: red');
    });
  });

  describe('带子菜单的项', () => {
    const itemWithChildren: NavItemType = {
      key: 'parent',
      label: 'Parent Menu',
      children: [
        { key: 'child1', label: 'Child 1' },
        { key: 'child2', label: 'Child 2' },
      ],
    };

    it('should render expand icon for items with children', () => {
      render(<NavItem {...defaultProps} item={itemWithChildren} />);

      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('should use custom expand icon', () => {
      const customExpandIcon = <span data-testid='custom-expand'>⊕</span>;
      render(<NavItem {...defaultProps} item={itemWithChildren} expandIcon={customExpandIcon} />);

      expect(screen.getByTestId('custom-expand')).toBeInTheDocument();
    });

    it('should handle expand/collapse on click', () => {
      render(<NavItem {...defaultProps} item={itemWithChildren} />);

      fireEvent.click(screen.getByText('Parent Menu'));

      expect(mockOnToggleExpand).toHaveBeenCalledWith('parent');
      expect(mockOnItemClick).not.toHaveBeenCalled();
    });

    it('should show children when expanded', () => {
      render(<NavItem {...defaultProps} item={itemWithChildren} openKeys={['parent']} />);

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('should apply expanded arrow class when open', () => {
      render(<NavItem {...defaultProps} item={itemWithChildren} openKeys={['parent']} />);

      const arrow = screen.getByTestId('chevron-icon').parentElement;
      expect(arrow).toHaveClass('fluentui-plus-nav__item__arrow--expanded');
    });
  });

  describe('收起状态', () => {
    const normalItem: NavItemType = {
      key: 'menu1',
      label: 'Menu 1',
      icon: <span data-testid='menu-icon'>📁</span>,
      title: 'Menu Title',
    };

    it('should show tooltip for normal items when collapsed', () => {
      render(<NavItem {...defaultProps} item={normalItem} collapsed />);

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Menu Title');
    });

    it('should use label as tooltip when no title provided', () => {
      const itemWithoutTitle = { ...normalItem, title: undefined };
      render(<NavItem {...defaultProps} item={itemWithoutTitle} collapsed />);

      expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Menu 1');
    });

    it('should show first character when no icon in collapsed mode', () => {
      const itemWithoutIcon = { ...normalItem, icon: undefined };
      render(<NavItem {...defaultProps} item={itemWithoutIcon} collapsed />);

      expect(screen.getByText('M')).toBeInTheDocument(); // First character of "Menu 1"
    });

    it('should hide label in collapsed mode', () => {
      render(<NavItem {...defaultProps} item={normalItem} collapsed />);

      // Label should not be visible in collapsed mode
      const wrapper = screen.getByRole('menuitem');
      expect(wrapper).toHaveClass('fluentui-plus-nav__item--collapsed');
    });

    it('should show menu for items with children when collapsed', () => {
      const itemWithChildren: NavItemType = {
        key: 'parent',
        label: 'Parent Menu',
        children: [{ key: 'child1', label: 'Child 1' }],
      };

      render(<NavItem {...defaultProps} item={itemWithChildren} collapsed />);

      expect(screen.getByTestId('menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-trigger')).toBeInTheDocument();
    });
  });

  describe('分割线类型', () => {
    const dividerItem: NavItemType = {
      key: 'divider1',
      type: 'divider',
      className: 'custom-divider',
      style: { margin: '10px' },
    };

    it('should render divider', () => {
      render(<NavItem {...defaultProps} item={dividerItem} />);

      const divider = screen.getByTestId('divider');
      expect(divider).toBeInTheDocument();
      expect(divider).toHaveClass('custom-divider');
    });
  });

  describe('分组类型', () => {
    const groupItem: NavItemType = {
      key: 'group1',
      type: 'group',
      label: 'Group Title',
      className: 'custom-group',
      style: { padding: '10px' },
      children: [
        { key: 'group-child1', label: 'Group Child 1' },
        { key: 'group-child2', label: 'Group Child 2' },
      ],
    };

    it('should render group with title and children', () => {
      render(<NavItem {...defaultProps} item={groupItem} />);

      expect(screen.getByText('Group Title')).toBeInTheDocument();
      expect(screen.getByText('Group Child 1')).toBeInTheDocument();
      expect(screen.getByText('Group Child 2')).toBeInTheDocument();

      const group = screen.getByText('Group Title').closest('.fluentui-plus-nav__group');
      expect(group).toHaveClass('custom-group');
      expect(group).toHaveStyle('padding: 10px');
    });

    it('should not show group title when collapsed', () => {
      render(<NavItem {...defaultProps} item={groupItem} collapsed />);

      expect(screen.queryByText('Group Title')).not.toBeInTheDocument();
      // In collapsed mode, children are rendered with first character only
      expect(screen.getByTitle('Group Child 1')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for group', () => {
      render(<NavItem {...defaultProps} item={groupItem} />);

      const groupTitle = screen.getByText('Group Title');
      expect(groupTitle).toHaveAttribute('role', 'group');
      expect(groupTitle).toHaveAttribute('aria-label', 'Group Title');
    });
  });

  describe('层级处理', () => {
    const normalItem: NavItemType = {
      key: 'menu1',
      label: 'Menu 1',
    };

    it('should apply correct level class', () => {
      render(<NavItem {...defaultProps} item={normalItem} level={2} />);

      const menuItem = screen.getByRole('menuitem');
      expect(menuItem).toHaveClass('fluentui-plus-nav__item--level-2');
    });

    it('should pass correct level to children', () => {
      const itemWithChildren: NavItemType = {
        key: 'parent',
        label: 'Parent',
        children: [{ key: 'child', label: 'Child' }],
      };

      render(<NavItem {...defaultProps} item={itemWithChildren} level={1} openKeys={['parent']} />);

      const submenu = screen.getByText('Child').closest('.fluentui-plus-nav__submenu');
      expect(submenu).toHaveClass('fluentui-plus-nav__submenu--level-2');
    });
  });

  describe('鼠标悬停行为', () => {
    it('should handle mouse enter/leave for collapsed items with children', () => {
      jest.useFakeTimers();

      const itemWithChildren: NavItemType = {
        key: 'parent',
        label: 'Parent',
        children: [{ key: 'child', label: 'Child' }],
      };

      render(<NavItem {...defaultProps} item={itemWithChildren} collapsed />);

      const wrapper = screen.getByRole('menuitem').closest('.fluentui-plus-nav__item__wrapper');

      // Mouse enter should open menu immediately
      fireEvent.mouseEnter(wrapper!);
      expect(screen.getByTestId('menu')).toHaveAttribute('data-open', 'true');

      // Mouse leave should close menu after delay
      fireEvent.mouseLeave(wrapper!);

      // Use act to wrap timer advancement
      act(() => {
        jest.advanceTimersByTime(100);
      });

      jest.useRealTimers();
    });
  });
});
