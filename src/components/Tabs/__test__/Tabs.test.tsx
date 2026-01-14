import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tabs from '../Tabs';
import type { TabItem } from '../types';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  Tab: ({ children, value, icon }: { children: React.ReactNode; value: string; icon?: React.ReactNode }) => (
    <button data-testid={`tab-${value}`} data-value={value} role='tab'>
      {icon && <span data-testid={`tab-icon-${value}`}>{icon}</span>}
      {children}
    </button>
  ),
  TabList: ({
    children,
    selectedValue,
    onTabSelect,
    vertical,
    ...props
  }: {
    children: React.ReactNode;
    selectedValue: string;
    onTabSelect: (e: any, data: { value: string }) => void;
    vertical?: boolean;
  }) => (
    <div
      data-testid='tab-list'
      data-selected={selectedValue}
      data-vertical={vertical?.toString()}
      onClick={(e: any) => {
        const target = e.target as HTMLElement;
        const value = target.getAttribute('data-value');
        if (value) {
          onTabSelect(e, { value });
        }
      }}
      {...props}
    >
      {children}
    </div>
  ),
  Overflow: ({ children, overflowAxis }: { children: React.ReactNode; overflowAxis: string }) => (
    <div data-testid='overflow' data-axis={overflowAxis}>
      {children}
    </div>
  ),
  OverflowItem: ({ children, id, priority }: { children: React.ReactNode; id: string; priority: number }) => (
    <div data-testid={`overflow-item-${id}`} data-priority={priority}>
      {children}
    </div>
  ),
}));

// Mock OverflowMenu component
jest.mock('../OverflowMenu', () => {
  const MockOverflowMenu = ({
    onTabSelect,
    items,
    menuMaxHeight,
  }: {
    onTabSelect: (key: string) => void;
    items: TabItem[];
    menuMaxHeight?: string;
  }) => (
    <div data-testid='overflow-menu' data-max-height={menuMaxHeight} data-items-count={items.length}>
      {items.map(item => (
        <button key={item.key} data-testid={`menu-item-${item.key}`} onClick={() => onTabSelect(item.key)}>
          {item.label}
        </button>
      ))}
    </div>
  );
  MockOverflowMenu.displayName = 'MockOverflowMenu';
  return MockOverflowMenu;
});

describe('Tabs', () => {
  const basicItems: TabItem[] = [
    { key: 'tab1', label: '标签一' },
    { key: 'tab2', label: '标签二' },
    { key: 'tab3', label: '标签三' },
  ];

  const iconItems: TabItem[] = [
    { key: 'home', label: '首页', icon: <span>🏠</span> },
    { key: 'docs', label: '文档', icon: <span>📄</span> },
  ];

  const disabledItems: TabItem[] = [
    { key: 'tab1', label: '可用标签' },
    { key: 'tab2', label: '禁用标签', disabled: true },
    { key: 'tab3', label: '可用标签' },
  ];

  describe('基础渲染', () => {
    it('should render correctly with basic items', () => {
      render(<Tabs items={basicItems} />);

      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab1')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab2')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tab3')).toBeInTheDocument();
    });

    it('should render tab labels correctly', () => {
      render(<Tabs items={basicItems} />);

      // 使用 getAllByText 因为标签会同时出现在 Tab 和 OverflowMenu 中
      expect(screen.getAllByText('标签一').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('标签二').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('标签三').length).toBeGreaterThanOrEqual(1);
    });

    it('should render with empty items array', () => {
      render(<Tabs items={[]} />);

      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
      expect(screen.getByTestId('overflow-menu')).toHaveAttribute('data-items-count', '0');
    });

    it('should render without items prop', () => {
      render(<Tabs />);

      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });
  });

  describe('带图标的标签页', () => {
    it('should render tabs with icons', () => {
      render(<Tabs items={iconItems} />);

      expect(screen.getByTestId('tab-icon-home')).toBeInTheDocument();
      expect(screen.getByTestId('tab-icon-docs')).toBeInTheDocument();
    });

    it('should render icon content correctly', () => {
      render(<Tabs items={iconItems} />);

      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('📄')).toBeInTheDocument();
    });
  });

  describe('垂直布局', () => {
    it('should set vertical overflow axis when vertical is true', () => {
      render(<Tabs items={basicItems} vertical />);

      const overflow = screen.getByTestId('overflow');
      expect(overflow).toHaveAttribute('data-axis', 'vertical');
    });

    it('should set horizontal overflow axis when vertical is false', () => {
      render(<Tabs items={basicItems} vertical={false} />);

      const overflow = screen.getByTestId('overflow');
      expect(overflow).toHaveAttribute('data-axis', 'horizontal');
    });

    it('should default to horizontal overflow axis', () => {
      render(<Tabs items={basicItems} />);

      const overflow = screen.getByTestId('overflow');
      expect(overflow).toHaveAttribute('data-axis', 'horizontal');
    });

    it('should pass vertical prop to TabList', () => {
      render(<Tabs items={basicItems} vertical />);

      const tabList = screen.getByTestId('tab-list');
      expect(tabList).toHaveAttribute('data-vertical', 'true');
    });
  });

  describe('溢出菜单', () => {
    it('should render overflow menu', () => {
      render(<Tabs items={basicItems} />);

      expect(screen.getByTestId('overflow-menu')).toBeInTheDocument();
    });

    it('should pass menuMaxHeight to overflow menu', () => {
      render(<Tabs items={basicItems} menuMaxHeight='200px' />);

      const overflowMenu = screen.getByTestId('overflow-menu');
      expect(overflowMenu).toHaveAttribute('data-max-height', '200px');
    });

    it('should pass items to overflow menu', () => {
      render(<Tabs items={basicItems} />);

      const overflowMenu = screen.getByTestId('overflow-menu');
      expect(overflowMenu).toHaveAttribute('data-items-count', '3');
    });
  });

  describe('事件回调', () => {
    it('should call onTabSelect when tab is clicked', () => {
      const onTabSelect = jest.fn();
      render(<Tabs items={basicItems} onTabSelect={onTabSelect} />);

      fireEvent.click(screen.getByTestId('tab-tab1'));

      expect(onTabSelect).toHaveBeenCalledWith('tab1');
    });

    it('should call onTabSelect when different tabs are clicked', () => {
      const onTabSelect = jest.fn();
      render(<Tabs items={basicItems} onTabSelect={onTabSelect} />);

      fireEvent.click(screen.getByTestId('tab-tab2'));
      expect(onTabSelect).toHaveBeenCalledWith('tab2');

      fireEvent.click(screen.getByTestId('tab-tab3'));
      expect(onTabSelect).toHaveBeenCalledWith('tab3');
    });

    it('should call onTabSelect when overflow menu item is clicked', () => {
      const onTabSelect = jest.fn();
      render(<Tabs items={basicItems} onTabSelect={onTabSelect} />);

      fireEvent.click(screen.getByTestId('menu-item-tab1'));

      expect(onTabSelect).toHaveBeenCalledWith('tab1');
    });

    it('should not throw error when onTabSelect is not provided', () => {
      render(<Tabs items={basicItems} />);

      expect(() => {
        fireEvent.click(screen.getByTestId('tab-tab1'));
      }).not.toThrow();
    });
  });

  describe('OverflowItem 优先级', () => {
    it('should set priority 1 for non-selected tabs', () => {
      render(<Tabs items={basicItems} />);

      const item1 = screen.getByTestId('overflow-item-tab1');
      const item2 = screen.getByTestId('overflow-item-tab2');
      const item3 = screen.getByTestId('overflow-item-tab3');

      // Initially no tab is selected, all should have priority 1
      expect(item1).toHaveAttribute('data-priority', '1');
      expect(item2).toHaveAttribute('data-priority', '1');
      expect(item3).toHaveAttribute('data-priority', '1');
    });

    it('should update priority when tab is selected', () => {
      render(<Tabs items={basicItems} />);

      // Select tab1
      fireEvent.click(screen.getByTestId('tab-tab1'));

      const item1 = screen.getByTestId('overflow-item-tab1');
      expect(item1).toHaveAttribute('data-priority', '2');
    });
  });

  describe('overflowProps', () => {
    it('should pass overflowProps to Overflow component', () => {
      render(<Tabs items={basicItems} overflowProps={{ minimumVisible: 4 }} />);

      expect(screen.getByTestId('overflow')).toBeInTheDocument();
    });
  });

  describe('禁用项', () => {
    it('should render disabled items', () => {
      render(<Tabs items={disabledItems} />);

      // 使用 getAllByText 因为标签会同时出现在 Tab 和 OverflowMenu 中
      expect(screen.getAllByText('禁用标签').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('其他属性传递', () => {
    it('should pass additional props to TabList', () => {
      render(<Tabs items={basicItems} data-custom='test-value' />);

      const tabList = screen.getByTestId('tab-list');
      expect(tabList).toHaveAttribute('data-custom', 'test-value');
    });
  });
});
