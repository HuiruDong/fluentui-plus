import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverflowMenu from '../OverflowMenu';
import type { TabItem } from '../types';

// Mock FluentUI components
const mockUseOverflowMenu = jest.fn();

jest.mock('@fluentui/react-components', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactModule = require('react') as typeof React;
  const MockButton = ReactModule.forwardRef<HTMLButtonElement, Record<string, unknown>>(
    ({ children, icon, appearance, 'aria-label': ariaLabel, role, ...props }, ref) => (
      <button
        ref={ref}
        data-testid='overflow-button'
        data-appearance={appearance as string}
        aria-label={ariaLabel as string}
        role={role as string}
        {...props}
      >
        {icon as React.ReactNode}
        {children as React.ReactNode}
      </button>
    )
  );
  MockButton.displayName = 'MockButton';

  return {
    Button: MockButton,
    Menu: ({ children, hasIcons }: { children: React.ReactNode; hasIcons?: boolean }) => (
      <div data-testid='menu' data-has-icons={hasIcons?.toString()}>
        {children}
      </div>
    ),
    MenuList: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
      <div data-testid='menu-list' style={style}>
        {children}
      </div>
    ),
    MenuPopover: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-popover'>{children}</div>,
    MenuTrigger: ({
      children,
      disableButtonEnhancement,
    }: {
      children: React.ReactNode;
      disableButtonEnhancement?: boolean;
    }) => (
      <div data-testid='menu-trigger' data-disable-enhancement={disableButtonEnhancement?.toString()}>
        {children}
      </div>
    ),
    useOverflowMenu: () => mockUseOverflowMenu(),
  };
});

// Mock OverflowMenuItem
jest.mock('../OverflowMenuItem', () => {
  const MockOverflowMenuItem = ({ tab, onClick }: { tab: TabItem; onClick: () => void }) => (
    <button data-testid={`overflow-menu-item-${tab.key}`} onClick={onClick}>
      {tab.icon && <span data-testid={`item-icon-${tab.key}`}>{tab.icon as React.ReactNode}</span>}
      {tab.label}
    </button>
  );
  MockOverflowMenuItem.displayName = 'MockOverflowMenuItem';
  return MockOverflowMenuItem;
});

// Mock icons
jest.mock('@fluentui/react-icons', () => ({
  MoreHorizontalRegular: () => <span data-testid='more-icon-regular'>MoreRegular</span>,
  MoreHorizontalFilled: () => <span data-testid='more-icon-filled'>MoreFilled</span>,
  bundleIcon: (_Filled: React.FC, _Regular: React.FC) => () => <span data-testid='more-icon'>MoreIcon</span>,
}));

describe('OverflowMenu', () => {
  const basicItems: TabItem[] = [
    { key: 'tab1', label: '标签一' },
    { key: 'tab2', label: '标签二' },
    { key: 'tab3', label: '标签三' },
  ];

  const iconItems: TabItem[] = [
    { key: 'home', label: '首页', icon: <span>🏠</span> },
    { key: 'docs', label: '文档', icon: <span>📄</span> },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: isOverflowing is true
    mockUseOverflowMenu.mockReturnValue({
      ref: { current: null },
      isOverflowing: true,
      overflowCount: 2,
    });
  });

  describe('基础渲染', () => {
    it('should render when isOverflowing is true', () => {
      render(<OverflowMenu items={basicItems} />);

      expect(screen.getByTestId('menu')).toBeInTheDocument();
      expect(screen.getByTestId('overflow-button')).toBeInTheDocument();
    });

    it('should not render when isOverflowing is false', () => {
      mockUseOverflowMenu.mockReturnValue({
        ref: { current: null },
        isOverflowing: false,
        overflowCount: 0,
      });

      const { container } = render(<OverflowMenu items={basicItems} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render all menu items', () => {
      render(<OverflowMenu items={basicItems} />);

      expect(screen.getByTestId('overflow-menu-item-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('overflow-menu-item-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('overflow-menu-item-tab3')).toBeInTheDocument();
    });
  });

  describe('触发按钮', () => {
    it('should render button with transparent appearance by default', () => {
      render(<OverflowMenu items={basicItems} />);

      const button = screen.getByTestId('overflow-button');
      expect(button).toHaveAttribute('data-appearance', 'transparent');
    });

    it('should render button with correct aria-label', () => {
      mockUseOverflowMenu.mockReturnValue({
        ref: { current: null },
        isOverflowing: true,
        overflowCount: 3,
      });

      render(<OverflowMenu items={basicItems} />);

      const button = screen.getByTestId('overflow-button');
      expect(button).toHaveAttribute('aria-label', '3 more tabs');
    });

    it('should render button with role="tab"', () => {
      render(<OverflowMenu items={basicItems} />);

      const button = screen.getByTestId('overflow-button');
      expect(button).toHaveAttribute('role', 'tab');
    });

    it('should render more icon', () => {
      render(<OverflowMenu items={basicItems} />);

      expect(screen.getByTestId('more-icon')).toBeInTheDocument();
    });
  });

  describe('菜单属性', () => {
    it('should render menu with hasIcons', () => {
      render(<OverflowMenu items={basicItems} />);

      const menu = screen.getByTestId('menu');
      expect(menu).toHaveAttribute('data-has-icons', 'true');
    });

    it('should apply default maxHeight to MenuList', () => {
      render(<OverflowMenu items={basicItems} />);

      const menuList = screen.getByTestId('menu-list');
      expect(menuList).toHaveStyle({ maxHeight: '256px' });
    });

    it('should apply custom menuMaxHeight to MenuList', () => {
      render(<OverflowMenu items={basicItems} menuMaxHeight='200px' />);

      const menuList = screen.getByTestId('menu-list');
      expect(menuList).toHaveStyle({ maxHeight: '200px' });
    });
  });

  describe('事件处理', () => {
    it('should call onTabSelect when menu item is clicked', () => {
      const onTabSelect = jest.fn();
      render(<OverflowMenu items={basicItems} onTabSelect={onTabSelect} />);

      fireEvent.click(screen.getByTestId('overflow-menu-item-tab1'));

      expect(onTabSelect).toHaveBeenCalledWith('tab1');
    });

    it('should call onTabSelect with correct key for each item', () => {
      const onTabSelect = jest.fn();
      render(<OverflowMenu items={basicItems} onTabSelect={onTabSelect} />);

      fireEvent.click(screen.getByTestId('overflow-menu-item-tab2'));
      expect(onTabSelect).toHaveBeenCalledWith('tab2');

      fireEvent.click(screen.getByTestId('overflow-menu-item-tab3'));
      expect(onTabSelect).toHaveBeenCalledWith('tab3');
    });

    it('should not throw error when onTabSelect is not provided', () => {
      render(<OverflowMenu items={basicItems} />);

      expect(() => {
        fireEvent.click(screen.getByTestId('overflow-menu-item-tab1'));
      }).not.toThrow();
    });
  });

  describe('带图标的菜单项', () => {
    it('should render menu items with icons', () => {
      render(<OverflowMenu items={iconItems} />);

      expect(screen.getByTestId('item-icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('item-icon-docs')).toBeInTheDocument();
    });
  });

  describe('buttonProps', () => {
    it('should pass buttonProps to Button', () => {
      render(<OverflowMenu items={basicItems} buttonProps={{ appearance: 'subtle', disabled: true }} />);

      const button = screen.getByTestId('overflow-button');
      // buttonProps should override default appearance
      expect(button).toHaveAttribute('data-appearance', 'subtle');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('MenuTrigger', () => {
    it('should render MenuTrigger with disableButtonEnhancement', () => {
      render(<OverflowMenu items={basicItems} />);

      const menuTrigger = screen.getByTestId('menu-trigger');
      expect(menuTrigger).toHaveAttribute('data-disable-enhancement', 'true');
    });
  });

  describe('空数据', () => {
    it('should render with empty items array', () => {
      render(<OverflowMenu items={[]} />);

      expect(screen.getByTestId('menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-list')).toBeInTheDocument();
    });
  });
});
