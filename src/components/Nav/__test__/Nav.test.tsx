import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Nav from '../Nav';
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
  MenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid='menu-item' onClick={onClick}>
      {children}
    </div>
  ),
  MenuDivider: () => <div data-testid='menu-divider' />,
  Divider: ({ className }: { className?: string }) => <div data-testid='divider' className={className} />,
}));

jest.mock('@fluentui/react-icons', () => ({
  ChevronRightRegular: () => <span data-testid='chevron-icon'>▶</span>,
}));

describe('Nav Component', () => {
  const mockNavItems: NavItemType[] = [
    {
      key: 'menu1',
      label: 'Menu 1',
      icon: <span data-testid='menu1-icon'>📁</span>,
      children: [
        { key: 'submenu1-1', label: 'Submenu 1-1' },
        { key: 'submenu1-2', label: 'Submenu 1-2' },
      ],
    },
    { key: 'menu2', label: 'Menu 2', icon: <span data-testid='menu2-icon'>📄</span> },
    { key: 'menu3', label: 'Menu 3', disabled: true },
    { key: 'divider1', type: 'divider' },
    {
      key: 'group1',
      type: 'group',
      label: 'Group 1',
      children: [
        { key: 'group-item1', label: 'Group Item 1' },
        { key: 'group-item2', label: 'Group Item 2' },
      ],
    },
  ];

  describe('渲染测试', () => {
    it('should render nav component with basic structure', () => {
      render(<Nav items={mockNavItems} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Menu 1')).toBeInTheDocument();
      expect(screen.getByText('Menu 2')).toBeInTheDocument();
      expect(screen.getByText('Menu 3')).toBeInTheDocument();
    });

    it('should render with custom className and style', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<Nav items={mockNavItems} className='custom-nav' style={customStyle} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-nav');
      expect(nav).toHaveStyle('background-color: red');
    });

    it('should render collapsed state', () => {
      render(<Nav items={mockNavItems} collapsed />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('mm-nav--collapsed');
    });

    it('should render divider items', () => {
      render(<Nav items={mockNavItems} />);
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });

    it('should render group items with title', () => {
      render(<Nav items={mockNavItems} />);
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group Item 1')).toBeInTheDocument();
      expect(screen.getByText('Group Item 2')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('should handle item selection', () => {
      const onSelect = jest.fn();
      render(<Nav items={mockNavItems} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('Menu 2'));

      expect(onSelect).toHaveBeenCalledWith({
        key: 'menu2',
        keyPath: ['menu2'],
        selectedKeys: ['menu2'],
        item: expect.objectContaining({ key: 'menu2', label: 'Menu 2' }),
      });
    });

    it('should handle submenu expansion', () => {
      const onOpenChange = jest.fn();
      render(<Nav items={mockNavItems} onOpenChange={onOpenChange} />);

      fireEvent.click(screen.getByText('Menu 1'));

      expect(onOpenChange).toHaveBeenCalledWith(['menu1']);
    });

    it('should not trigger events for disabled items', () => {
      const onSelect = jest.fn();
      render(<Nav items={mockNavItems} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('Menu 3'));

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should display selected item correctly', () => {
      render(<Nav items={mockNavItems} selectedKeys={['menu2']} />);

      const selectedItem = screen.getByText('Menu 2').closest('.mm-nav__item');
      expect(selectedItem).toHaveClass('mm-nav__item--selected');
    });

    it('should display open submenu correctly', () => {
      render(<Nav items={mockNavItems} openKeys={['menu1']} />);

      expect(screen.getByText('Submenu 1-1')).toBeInTheDocument();
      expect(screen.getByText('Submenu 1-2')).toBeInTheDocument();
    });
  });

  describe('受控组件测试', () => {
    it('should work as controlled component for selectedKeys', () => {
      const { rerender } = render(<Nav items={mockNavItems} selectedKeys={['menu1']} />);

      let selectedItem = screen.getByText('Menu 1').closest('.mm-nav__item');
      expect(selectedItem).toHaveClass('mm-nav__item--selected');

      rerender(<Nav items={mockNavItems} selectedKeys={['menu2']} />);

      selectedItem = screen.getByText('Menu 2').closest('.mm-nav__item');
      expect(selectedItem).toHaveClass('mm-nav__item--selected');
    });

    it('should work as controlled component for openKeys', () => {
      const { rerender } = render(<Nav items={mockNavItems} openKeys={['menu1']} />);

      expect(screen.getByText('Submenu 1-1')).toBeInTheDocument();

      rerender(<Nav items={mockNavItems} openKeys={[]} />);

      expect(screen.queryByText('Submenu 1-1')).not.toBeInTheDocument();
    });
  });

  describe('默认值测试', () => {
    it('should use defaultSelectedKeys', () => {
      render(<Nav items={mockNavItems} defaultSelectedKeys={['menu2']} />);

      const selectedItem = screen.getByText('Menu 2').closest('.mm-nav__item');
      expect(selectedItem).toHaveClass('mm-nav__item--selected');
    });

    it('should use defaultOpenKeys', () => {
      render(<Nav items={mockNavItems} defaultOpenKeys={['menu1']} />);

      expect(screen.getByText('Submenu 1-1')).toBeInTheDocument();
      expect(screen.getByText('Submenu 1-2')).toBeInTheDocument();
    });
  });

  describe('图标和展开图标测试', () => {
    it('should render item icons', () => {
      render(<Nav items={mockNavItems} />);

      expect(screen.getByTestId('menu1-icon')).toBeInTheDocument();
      expect(screen.getByTestId('menu2-icon')).toBeInTheDocument();
    });

    it('should render expand icons for items with children', () => {
      render(<Nav items={mockNavItems} />);

      expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('should use custom expand icon', () => {
      const customExpandIcon = <span data-testid='custom-expand'>⊕</span>;
      render(<Nav items={mockNavItems} expandIcon={customExpandIcon} />);

      expect(screen.getByTestId('custom-expand')).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('should have proper ARIA attributes', () => {
      render(<Nav items={mockNavItems} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigation menu');

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should handle keyboard navigation', () => {
      render(<Nav items={mockNavItems} />);

      const menuItem = screen.getByText('Menu 2').closest('.mm-nav__item');
      expect(menuItem).toHaveAttribute('tabIndex', '0');
    });

    it('should disable tabIndex for disabled items', () => {
      render(<Nav items={mockNavItems} />);

      const disabledItem = screen.getByText('Menu 3').closest('.mm-nav__item');
      expect(disabledItem).toHaveAttribute('tabIndex', '-1');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
