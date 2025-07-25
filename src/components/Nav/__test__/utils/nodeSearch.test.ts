import { findParentKeys, findMenuItem } from '../../utils/nodeSearch';
import { NavItemType } from '../../types';

describe('nodeSearch utils', () => {
  // 测试数据
  const mockNavItems: NavItemType[] = [
    {
      key: 'menu1',
      label: 'Menu 1',
      children: [
        {
          key: 'submenu1-1',
          label: 'Submenu 1-1',
          children: [
            { key: 'item1-1-1', label: 'Item 1-1-1' },
            { key: 'item1-1-2', label: 'Item 1-1-2' },
          ],
        },
        { key: 'item1-2', label: 'Item 1-2' },
      ],
    },
    {
      key: 'group1',
      type: 'group',
      label: 'Group 1',
      children: [
        { key: 'group-item1', label: 'Group Item 1' },
        { key: 'group-item2', label: 'Group Item 2' },
      ],
    },
    { key: 'menu2', label: 'Menu 2' },
    { key: 'divider1', type: 'divider' },
    { key: 'menu3', label: 'Menu 3' },
  ];

  describe('findParentKeys', () => {
    it('should return empty array for root level items', () => {
      expect(findParentKeys(mockNavItems, 'menu1')).toEqual([]);
      expect(findParentKeys(mockNavItems, 'menu2')).toEqual([]);
    });

    it('should return parent keys for nested items', () => {
      expect(findParentKeys(mockNavItems, 'submenu1-1')).toEqual(['menu1']);
      expect(findParentKeys(mockNavItems, 'item1-1-1')).toEqual(['menu1', 'submenu1-1']);
      expect(findParentKeys(mockNavItems, 'item1-2')).toEqual(['menu1']);
    });

    it('should exclude group type from parent keys', () => {
      expect(findParentKeys(mockNavItems, 'group-item1')).toEqual([]);
      expect(findParentKeys(mockNavItems, 'group-item2')).toEqual([]);
    });

    it('should return empty array for non-existent keys', () => {
      expect(findParentKeys(mockNavItems, 'non-existent')).toEqual([]);
    });

    it('should handle empty items array', () => {
      expect(findParentKeys([], 'any-key')).toEqual([]);
    });
  });

  describe('findMenuItem', () => {
    it('should find root level items', () => {
      const result = findMenuItem(mockNavItems, 'menu1');
      expect(result).toEqual({
        key: 'menu1',
        label: 'Menu 1',
        children: expect.any(Array),
      });
    });

    it('should find nested items', () => {
      const result = findMenuItem(mockNavItems, 'item1-1-1');
      expect(result).toEqual({
        key: 'item1-1-1',
        label: 'Item 1-1-1',
      });
    });

    it('should find items in group', () => {
      const result = findMenuItem(mockNavItems, 'group-item1');
      expect(result).toEqual({
        key: 'group-item1',
        label: 'Group Item 1',
      });
    });

    it('should return null for non-existent items', () => {
      expect(findMenuItem(mockNavItems, 'non-existent')).toBeNull();
    });

    it('should handle empty items array', () => {
      expect(findMenuItem([], 'any-key')).toBeNull();
    });
  });
});
