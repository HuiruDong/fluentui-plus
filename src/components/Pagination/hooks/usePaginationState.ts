import { useState, useEffect, useCallback } from 'react';

/**
 * 分页状态管理 Hook
 * 处理受控和非受控模式的状态同步
 */
export const usePaginationState = (
  current: number | undefined,
  defaultCurrent: number,
  onChange?: (page: number, pageSize: number) => void
) => {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);

  useEffect(() => {
    if (current !== undefined) {
      setInternalCurrent(current);
    }
  }, [current]);

  const currentPage = current ?? internalCurrent;

  /**
   * 更新当前页码
   * 如果是非受控模式，更新内部状态；无论哪种模式都触发 onChange 回调
   */
  const setCurrentPage = useCallback(
    (newPage: number, pageSize: number) => {
      if (current === undefined) {
        setInternalCurrent(newPage);
      }
      onChange?.(newPage, pageSize);
    },
    [current, onChange]
  );

  return {
    current: currentPage,
    setCurrentPage,
  };
};
