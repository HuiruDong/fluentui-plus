import { generateKeyPath } from '../../utils/pathUtils';
import { NavItemType } from '../../types';

describe('pathUtils', () => {
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

  describe('generateKeyPath', () => {
    it('should generate key path for root level items', () => {
      expect(generateKeyPath(mockNavItems, 'menu1')).toEqual(['menu1']);
      expect(generateKeyPath(mockNavItems, 'menu2')).toEqual(['menu2']);
    });

    it('should generate key path for nested items', () => {
      expect(generateKeyPath(mockNavItems, 'item1-1-1')).toEqual(['item1-1-1', 'submenu1-1', 'menu1']);
      expect(generateKeyPath(mockNavItems, 'item1-2')).toEqual(['item1-2', 'menu1']);
    });

    it('should generate key path for items in group (excluding group from path)', () => {
      expect(generateKeyPath(mockNavItems, 'group-item1')).toEqual(['group-item1']);
    });

    it('should return single item array for non-existent keys', () => {
      expect(generateKeyPath(mockNavItems, 'non-existent')).toEqual(['non-existent']);
    });

    it('should handle empty items array', () => {
      expect(generateKeyPath([], 'any-key')).toEqual(['any-key']);
    });
  });
});
