import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

describe('useBodyScrollLock Hook', () => {
  const originalOverflow = document.body.style.overflow;

  afterEach(() => {
    // 恢复原始状态
    document.body.style.overflow = originalOverflow;
  });

  describe('滚动锁定', () => {
    it('挂载时应设置 body overflow 为 hidden', () => {
      renderHook(() => useBodyScrollLock());

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('卸载时应恢复 body 原始 overflow 值', () => {
      document.body.style.overflow = 'auto';

      const { unmount } = renderHook(() => useBodyScrollLock());

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('auto');
    });

    it('原始 overflow 为空时卸载后应恢复为空', () => {
      document.body.style.overflow = '';

      const { unmount } = renderHook(() => useBodyScrollLock());

      unmount();

      expect(document.body.style.overflow).toBe('');
    });

    it('原始 overflow 为 scroll 时卸载后应恢复为 scroll', () => {
      document.body.style.overflow = 'scroll';

      const { unmount } = renderHook(() => useBodyScrollLock());

      unmount();

      expect(document.body.style.overflow).toBe('scroll');
    });
  });

  describe('多次挂载卸载', () => {
    it('多次挂载卸载应正确恢复状态', () => {
      document.body.style.overflow = 'visible';

      const { unmount: unmount1 } = renderHook(() => useBodyScrollLock());
      expect(document.body.style.overflow).toBe('hidden');
      unmount1();
      expect(document.body.style.overflow).toBe('visible');

      const { unmount: unmount2 } = renderHook(() => useBodyScrollLock());
      expect(document.body.style.overflow).toBe('hidden');
      unmount2();
      expect(document.body.style.overflow).toBe('visible');
    });
  });
});
