import { useEffect } from 'react';

/**
 * useBodyScrollLock - 锁定 body 滚动 Hook
 * @description 组件挂载时禁用 body 滚动，卸载时恢复原状态
 */
export const useBodyScrollLock = () => {
  useEffect(() => {
    // 保存原始 overflow 值
    const originalOverflow = document.body.style.overflow;
    // 禁用滚动
    document.body.style.overflow = 'hidden';
    return () => {
      // 恢复原始值
      document.body.style.overflow = originalOverflow;
    };
  }, []);
};
