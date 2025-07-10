import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useNavigation } from '../hooks/useNavigation';
import { NavItemType } from '../types';

describe('useNavigation hook', () => {
  const mockNavItems: NavItemType[] = [
    {
      key: 'menu1',
      label: 'Menu 1',
      children: [
        { key: 'submenu1-1', label: 'Submenu 1-1' },
        { key: 'submenu1-2', label: 'Submenu 1-2' },
      ],
    },
    { key: 'menu2', label: 'Menu 2' },
    { key: 'menu3', label: 'Menu 3', disabled: true },
  ];

  describe('初始状态', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
        })
      );

      expect(result.current.selectedKeys).toEqual([]);
      expect(result.current.openKeys).toEqual([]);
      expect(result.current.currentSelectedItem).toBeNull();
    });

    it('should initialize with provided default values', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          defaultSelectedKeys: ['menu1'],
          defaultOpenKeys: ['menu1'],
        })
      );

      expect(result.current.selectedKeys).toEqual(['menu1']);
      expect(result.current.openKeys).toEqual(['menu1']);
    });

    it('should use controlled values when provided', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          selectedKeys: ['menu2'],
          openKeys: ['menu1'],
        })
      );

      expect(result.current.selectedKeys).toEqual(['menu2']);
      expect(result.current.openKeys).toEqual(['menu1']);
    });
  });

  describe('handleItemClick', () => {
    it('should handle item click and update selected keys', () => {
      const onSelect = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          onSelect,
        })
      );

      const menuItem = mockNavItems[1]; // menu2
      act(() => {
        result.current.handleItemClick('menu2', menuItem);
      });

      expect(result.current.selectedKeys).toEqual(['menu2']);
      expect(onSelect).toHaveBeenCalledWith({
        key: 'menu2',
        keyPath: ['menu2'],
        selectedKeys: ['menu2'],
        item: menuItem,
      });
    });

    it('should not handle click for disabled items', () => {
      const onSelect = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          onSelect,
        })
      );

      const disabledItem = mockNavItems[2]; // menu3 (disabled)
      act(() => {
        result.current.handleItemClick('menu3', disabledItem);
      });

      expect(result.current.selectedKeys).toEqual([]);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should not update internal state when controlled', () => {
      const onSelect = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          selectedKeys: ['menu1'],
          onSelect,
        })
      );

      const menuItem = mockNavItems[1]; // menu2
      act(() => {
        result.current.handleItemClick('menu2', menuItem);
      });

      // selectedKeys should remain controlled value
      expect(result.current.selectedKeys).toEqual(['menu1']);
      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe('handleToggleExpand', () => {
    it('should expand closed menu', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleToggleExpand('menu1');
      });

      expect(result.current.openKeys).toEqual(['menu1']);
      expect(onOpenChange).toHaveBeenCalledWith(['menu1']);
    });

    it('should collapse expanded menu', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          defaultOpenKeys: ['menu1'],
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleToggleExpand('menu1');
      });

      expect(result.current.openKeys).toEqual([]);
      expect(onOpenChange).toHaveBeenCalledWith([]);
    });

    it('should not update internal state when controlled', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          openKeys: ['menu1'],
          onOpenChange,
        })
      );

      act(() => {
        result.current.handleToggleExpand('menu1');
      });

      // openKeys should remain controlled value
      expect(result.current.openKeys).toEqual(['menu1']);
      expect(onOpenChange).toHaveBeenCalledWith([]);
    });
  });

  describe('autoExpandParents', () => {
    it('should auto expand parent keys', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          onOpenChange,
        })
      );

      act(() => {
        result.current.autoExpandParents('submenu1-1');
      });

      expect(result.current.openKeys).toEqual(['menu1']);
      expect(onOpenChange).toHaveBeenCalledWith(['menu1']);
    });

    it('should merge with existing open keys', () => {
      const onOpenChange = jest.fn();
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          defaultOpenKeys: ['menu2'],
          onOpenChange,
        })
      );

      act(() => {
        result.current.autoExpandParents('submenu1-1');
      });

      expect(result.current.openKeys).toEqual(['menu2', 'menu1']);
    });
  });

  describe('getItemInfo', () => {
    it('should return correct item info', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
        })
      );

      const itemInfo = result.current.getItemInfo('menu1');
      expect(itemInfo).toEqual(mockNavItems[0]);
    });

    it('should return null for non-existent item', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
        })
      );

      const itemInfo = result.current.getItemInfo('non-existent');
      expect(itemInfo).toBeNull();
    });
  });

  describe('currentSelectedItem', () => {
    it('should return current selected item', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
          defaultSelectedKeys: ['menu1'],
        })
      );

      expect(result.current.currentSelectedItem).toEqual(mockNavItems[0]);
    });

    it('should return null when no item is selected', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
        })
      );

      expect(result.current.currentSelectedItem).toBeNull();
    });

    it('should update when selected keys change', () => {
      const { result } = renderHook(() =>
        useNavigation({
          items: mockNavItems,
        })
      );

      const menuItem = mockNavItems[1]; // menu2
      act(() => {
        result.current.handleItemClick('menu2', menuItem);
      });

      expect(result.current.currentSelectedItem).toEqual(menuItem);
    });
  });
});
