import { calculateTargetPage } from '../../utils/navigation';
import { PaginationItemType, JUMP_STEP } from '../../utils/constants';
import type { PageItem } from '../../types';

describe('calculateTargetPage', () => {
  describe('Page 类型', () => {
    it('should return the page value for Page type', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 5 };
      const result = calculateTargetPage(item, 1, 10);

      expect(result).toBe(5);
    });

    it('should return correct page regardless of current page', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 7 };
      const result = calculateTargetPage(item, 3, 10);

      expect(result).toBe(7);
    });

    it('should handle page 1', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 1 };
      const result = calculateTargetPage(item, 5, 10);

      expect(result).toBe(1);
    });

    it('should handle last page', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 10 };
      const result = calculateTargetPage(item, 1, 10);

      expect(result).toBe(10);
    });

    it('should handle any valid page number', () => {
      for (let i = 1; i <= 20; i++) {
        const item: PageItem = { type: PaginationItemType.Page, value: i };
        const result = calculateTargetPage(item, 1, 20);
        expect(result).toBe(i);
      }
    });
  });

  describe('Prev 类型 (跳转到前5页)', () => {
    it('should jump back 5 pages from current', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 8, 20);

      // 8 - 5 = 3
      expect(result).toBe(3);
    });

    it('should not go below page 1', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 3, 20);

      // 3 - 5 = -2, clamped to 1
      expect(result).toBe(1);
    });

    it('should return page 1 when current is page 1', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 1, 20);

      expect(result).toBe(1);
    });

    it('should return page 1 when current is less than JUMP_STEP', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 4, 20);

      // 4 - 5 = -1, clamped to 1
      expect(result).toBe(1);
    });

    it('should handle current at page 6', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 6, 20);

      // 6 - 5 = 1
      expect(result).toBe(1);
    });

    it('should handle current at page 7', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 7, 20);

      // 7 - 5 = 2
      expect(result).toBe(2);
    });

    it('should use JUMP_STEP constant', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const current = 10;
      const result = calculateTargetPage(item, current, 20);

      // Should jump back exactly JUMP_STEP pages
      expect(result).toBe(current - JUMP_STEP);
    });
  });

  describe('Next 类型 (跳转到后5页)', () => {
    it('should jump forward 5 pages from current', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 3, 20);

      // 3 + 5 = 8
      expect(result).toBe(8);
    });

    it('should not exceed total pages', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 18, 20);

      // 18 + 5 = 23, clamped to 20
      expect(result).toBe(20);
    });

    it('should return last page when current is last page', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 20, 20);

      expect(result).toBe(20);
    });

    it('should return last page when jump would exceed', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 17, 20);

      // 17 + 5 = 22, clamped to 20
      expect(result).toBe(20);
    });

    it('should handle current at page 15', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 15, 20);

      // 15 + 5 = 20
      expect(result).toBe(20);
    });

    it('should handle current at page 14', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 14, 20);

      // 14 + 5 = 19
      expect(result).toBe(19);
    });

    it('should use JUMP_STEP constant', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const current = 5;
      const totalPages = 20;
      const result = calculateTargetPage(item, current, totalPages);

      // Should jump forward exactly JUMP_STEP pages
      expect(result).toBe(current + JUMP_STEP);
    });
  });

  describe('边界情况', () => {
    it('should handle totalPages of 1', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 1 };
      const result = calculateTargetPage(item, 1, 1);

      expect(result).toBe(1);
    });

    it('should handle very large page numbers', () => {
      const item: PageItem = { type: PaginationItemType.Page, value: 99999 };
      const result = calculateTargetPage(item, 1, 100000);

      expect(result).toBe(99999);
    });

    it('should handle Prev with large current page', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 1000, 2000);

      expect(result).toBe(995);
    });

    it('should handle Next with large current page', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 1000, 2000);

      expect(result).toBe(1005);
    });

    it('should handle current page 0 (invalid, but defensive)', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, 0, 10);

      // 0 - 5 = -5, clamped to 1
      expect(result).toBe(1);
    });

    it('should handle negative current page (invalid, but defensive)', () => {
      const item: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const result = calculateTargetPage(item, -5, 10);

      // -5 - 5 = -10, clamped to 1
      expect(result).toBe(1);
    });

    it('should handle current exceeding totalPages', () => {
      const item: PageItem = { type: PaginationItemType.Next, value: '...' };
      const result = calculateTargetPage(item, 25, 10);

      // 25 + 5 = 30, clamped to 10
      expect(result).toBe(10);
    });
  });

  describe('不同的 JUMP_STEP 场景', () => {
    it('should correctly calculate with JUMP_STEP = 5', () => {
      // Assuming JUMP_STEP is 5
      expect(JUMP_STEP).toBe(5);

      const prevItem: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const nextItem: PageItem = { type: PaginationItemType.Next, value: '...' };

      // Test Prev
      expect(calculateTargetPage(prevItem, 10, 20)).toBe(5);
      expect(calculateTargetPage(prevItem, 8, 20)).toBe(3);

      // Test Next
      expect(calculateTargetPage(nextItem, 5, 20)).toBe(10);
      expect(calculateTargetPage(nextItem, 8, 20)).toBe(13);
    });
  });

  describe('返回值一致性', () => {
    it('should always return a number', () => {
      const items: PageItem[] = [
        { type: PaginationItemType.Page, value: 5 },
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Next, value: '...' },
      ];

      items.forEach(item => {
        const result = calculateTargetPage(item, 5, 10);
        expect(typeof result).toBe('number');
        expect(Number.isFinite(result)).toBe(true);
        expect(Number.isInteger(result)).toBe(true);
      });
    });

    it('should always return a value within valid range', () => {
      const totalPages = 10;
      const items: PageItem[] = [
        { type: PaginationItemType.Page, value: 5 },
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Next, value: '...' },
      ];

      for (let current = 1; current <= totalPages; current++) {
        items.forEach(item => {
          const result = calculateTargetPage(item, current, totalPages);
          expect(result).toBeGreaterThanOrEqual(1);
          expect(result).toBeLessThanOrEqual(totalPages);
        });
      }
    });
  });

  describe('对称性测试', () => {
    it('should have symmetric jump behavior', () => {
      const prevItem: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const nextItem: PageItem = { type: PaginationItemType.Next, value: '...' };

      // From page 10, jump back to 5, then jump forward should return to 10
      const afterPrev = calculateTargetPage(prevItem, 10, 20);
      expect(afterPrev).toBe(5);

      const afterNext = calculateTargetPage(nextItem, afterPrev, 20);
      expect(afterNext).toBe(10);
    });

    it('should maintain position when jumping back and forth near boundaries', () => {
      const prevItem: PageItem = { type: PaginationItemType.Prev, value: '...' };
      const nextItem: PageItem = { type: PaginationItemType.Next, value: '...' };

      // At boundary (page 3), jump back to 1, can't jump back further
      const afterPrev = calculateTargetPage(prevItem, 3, 20);
      expect(afterPrev).toBe(1);

      // From page 1, jump forward
      const afterNext = calculateTargetPage(nextItem, afterPrev, 20);
      expect(afterNext).toBe(6);
    });
  });
});
