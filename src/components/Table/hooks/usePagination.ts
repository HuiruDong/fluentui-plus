import { useState, useMemo, useCallback } from 'react';
import type { PaginationProps } from '../../Pagination';

interface UsePaginationOptions<RecordType> {
  dataSource: RecordType[];
  pagination?: false | PaginationProps;
}

interface UsePaginationResult<RecordType> {
  /**
   * 分页后的数据
   */
  paginatedData: RecordType[];
  /**
   * 分页配置（处理后的）
   */
  paginationConfig: false | PaginationProps;
  /**
   * 当前页码
   */
  currentPage: number;
  /**
   * 每页大小
   */
  pageSize: number;
  /**
   * 处理分页变化
   */
  handlePaginationChange: (page: number, newPageSize: number) => void;
}

/**
 * 表格分页 Hook
 * 封装分页状态管理和数据切片逻辑
 */
export const usePagination = <RecordType = Record<string, unknown>>({
  dataSource,
  pagination,
}: UsePaginationOptions<RecordType>): UsePaginationResult<RecordType> => {
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 处理分页配置
  const paginationConfig = useMemo(() => {
    if (pagination === false || pagination === undefined) {
      return false;
    }
    // 只设置未明确指定的默认值
    const config: PaginationProps = {
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: true,
      ...pagination,
    };
    // 如果没有指定 pageSize，不设置默认值，让 Hook 使用内部状态
    if (config.pageSize === undefined) {
      config.pageSize = 10;
    }
    return config;
  }, [pagination]);

  // 判断是否为受控模式
  const isControlledCurrent = pagination !== false && pagination !== undefined && 'current' in pagination;
  const isControlledPageSize = pagination !== false && pagination !== undefined && 'pageSize' in pagination;

  // 计算实际使用的页码和页大小
  const actualCurrent =
    isControlledCurrent && paginationConfig !== false ? (paginationConfig.current ?? currentPage) : currentPage;

  const actualPageSize =
    isControlledPageSize && paginationConfig !== false ? (paginationConfig.pageSize ?? pageSize) : pageSize;

  // 计算分页数据
  const paginatedData = useMemo(() => {
    if (paginationConfig === false) {
      return dataSource;
    }

    const start = (actualCurrent - 1) * actualPageSize;
    const end = start + actualPageSize;

    return dataSource.slice(start, end);
  }, [dataSource, paginationConfig, actualCurrent, actualPageSize]);

  // 处理分页变化
  const handlePaginationChange = useCallback(
    (page: number, newPageSize: number) => {
      setCurrentPage(page);
      setPageSize(newPageSize);
      if (paginationConfig !== false) {
        paginationConfig.onChange?.(page, newPageSize);
      }
    },
    [paginationConfig]
  );

  return {
    paginatedData,
    paginationConfig,
    currentPage,
    pageSize,
    handlePaginationChange,
  };
};
