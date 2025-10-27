import { generateClassName } from '../../utils/styleUtils';

describe('styleUtils', () => {
  describe('generateClassName', () => {
    it('should generate class name with prefix only', () => {
      expect(generateClassName('nav')).toBe('nav');
    });

    it('should generate class name with prefix and suffix', () => {
      expect(generateClassName('nav', 'item')).toBe('nav-item');
    });

    it('should handle empty strings', () => {
      expect(generateClassName('')).toBe('');
      expect(generateClassName('nav', '')).toBe('nav');
    });

    it('should handle various prefix and suffix combinations', () => {
      expect(generateClassName('component')).toBe('component');
      expect(generateClassName('component', 'active')).toBe('component-active');
      expect(generateClassName('nav-menu', 'item')).toBe('nav-menu-item');
      expect(generateClassName('btn', 'primary')).toBe('btn-primary');
    });

    it('should handle special characters in prefix and suffix', () => {
      expect(generateClassName('nav_menu', 'item')).toBe('nav_menu-item');
      expect(generateClassName('nav', 'item_active')).toBe('nav-item_active');
    });
  });
});
