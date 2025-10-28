import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, Input } from '@fluentui/react-components';
import type { InputOnChangeData } from '@fluentui/react-components';
import { ChevronRightRegular, ChevronLeftRegular } from '@fluentui/react-icons';
import type { BasePaginationProps } from './types';

export interface SimplePaginationProps extends BasePaginationProps {
  current: number;
  totalPages: number;
  disabled?: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  onPageChange: (page: number) => void;
  prefixCls: string;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  current,
  totalPages,
  disabled = false,
  onPrevClick,
  onNextClick,
  onPageChange,
  itemRender,
  prefixCls,
}) => {
  const [inputValue, setInputValue] = useState<string>(current.toString());
  const componentPrefixCls = `${prefixCls}__simple`;

  // 同步 current 到 inputValue
  useEffect(() => {
    setInputValue(current.toString());
  }, [current]);

  // 处理输入变化，只允许数字
  const handleInputChange = useCallback((_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    // 只保留数字字符
    setInputValue(data.value.replace(/\D/g, ''));
  }, []);

  // 验证并应用页码跳转
  const validateAndJumpToPage = useCallback(() => {
    // 空值时恢复当前页
    if (!inputValue) {
      setInputValue(current.toString());
      return;
    }

    const value = Number(inputValue);

    // 边界处理：限制在 [1, totalPages] 范围内
    const targetPage = Math.min(totalPages, Math.max(1, value));
    setInputValue(targetPage.toString());

    // 只在页码真正改变时触发回调
    if (targetPage !== current) {
      onPageChange(targetPage);
    }
  }, [inputValue, current, totalPages, onPageChange]);

  // 处理键盘事件
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        validateAndJumpToPage();
      }
    },
    [validateAndJumpToPage]
  );

  // 缓存上一页按钮，避免不必要的重新渲染
  const prevButton = useMemo(() => {
    const element = (
      <Button
        appearance='subtle'
        disabled={disabled || current <= 1}
        onClick={onPrevClick}
        icon={<ChevronLeftRegular />}
        aria-label='Previous Page'
        className={`${componentPrefixCls}__button`}
      />
    );

    return itemRender ? itemRender(current - 1, 'prev', element) : element;
  }, [disabled, current, onPrevClick, itemRender, componentPrefixCls]);

  // 缓存下一页按钮，避免不必要的重新渲染
  const nextButton = useMemo(() => {
    const element = (
      <Button
        appearance='subtle'
        disabled={disabled || current >= totalPages}
        onClick={onNextClick}
        icon={<ChevronRightRegular />}
        aria-label='Next Page'
        className={`${componentPrefixCls}__button`}
      />
    );

    return itemRender ? itemRender(current + 1, 'next', element) : element;
  }, [disabled, current, totalPages, onNextClick, itemRender, componentPrefixCls]);

  return (
    <div className={componentPrefixCls}>
      {prevButton}
      <div className={`${componentPrefixCls}__input-container`}>
        <Input
          className={`${componentPrefixCls}__input`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={validateAndJumpToPage}
          disabled={disabled}
          aria-label='Current Page'
        />
        <span className={`${componentPrefixCls}__separator`}>/</span>
        <span className={`${componentPrefixCls}__total`}>{totalPages}</span>
      </div>
      {nextButton}
    </div>
  );
};

export default SimplePagination;
