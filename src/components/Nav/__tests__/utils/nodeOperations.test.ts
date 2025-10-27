import { getAllChildKeys, hasChildren } from '../../utils/nodeOperations';
import { NavItemType } from '../../types';

describe('nodeOperations utils', () => {
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
  ];

  describe('getAllChildKeys', () => {
    it('should return all child keys recursively', () => {
      const menuItem = mockNavItems[0]; // menu1
      const result = getAllChildKeys(menuItem);
      expect(result).toEqual(['submenu1-1', 'item1-1-1', 'item1-1-2', 'item1-2']);
    });

    it('should return direct child keys only for single level', () => {
      const groupItem = mockNavItems[1]; // group1
      const result = getAllChildKeys(groupItem);
      expect(result).toEqual(['group-item1', 'group-item2']);
    });

    it('should return empty array for items without children', () => {
      const leafItem = { key: 'leaf', label: 'Leaf Item' };
      expect(getAllChildKeys(leafItem)).toEqual([]);
    });

    it('should handle items with empty children array', () => {
      const itemWithEmptyChildren = { key: 'empty', label: 'Empty', children: [] };
      expect(getAllChildKeys(itemWithEmptyChildren)).toEqual([]);
    });
  });

  describe('hasChildren', () => {
    it('should return true for items with children', () => {
      const itemWithChildren = { key: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Child' }] };
      expect(hasChildren(itemWithChildren)).toBe(true);
    });

    it('should return false for items without children', () => {
      const leafItem = { key: 'leaf', label: 'Leaf' };
      expect(hasChildren(leafItem)).toBe(false);
    });

    it('should return false for group type even with children', () => {
      const groupItem = { key: 'group', type: 'group' as const, children: [{ key: 'child', label: 'Child' }] };
      expect(hasChildren(groupItem)).toBe(false);
    });

    it('should return false for divider type', () => {
      const dividerItem = { key: 'divider', type: 'divider' as const };
      expect(hasChildren(dividerItem)).toBe(false);
    });

    it('should return false for items with empty children array', () => {
      const itemWithEmptyChildren = { key: 'empty', label: 'Empty', children: [] };
      expect(hasChildren(itemWithEmptyChildren)).toBe(false);
    });
  });
});
