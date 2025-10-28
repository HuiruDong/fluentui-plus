import React, { useState, useCallback } from 'react';
import { Input } from '@fluentui/react-components';
import type { QuickJumperProps } from './types';

const QuickJumper: React.FC<QuickJumperProps> = ({ current, totalPages, disabled = false, onJump, prefixCls }) => {
  const [jumperValue, setJumperValue] = useState('');
  const componentPrefixCls = `${prefixCls}__jumper`;

  const handleJumperChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
    setJumperValue(data.value);
  }, []);

  const jumpToPage = useCallback(() => {
    if (disabled) return;

    const value = Number(jumperValue);
    if (Number.isNaN(value) || !Number.isInteger(value)) {
      setJumperValue('');
      return;
    }

    const targetPage = Math.min(totalPages, Math.max(1, value));
    if (targetPage === current) {
      setJumperValue('');
      return;
    }
    setJumperValue('');
    onJump(targetPage);
  }, [jumperValue, current, totalPages, onJump, disabled]);

  const handleJumperKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        jumpToPage();
      }
    },
    [jumpToPage]
  );

  return (
    <div className={componentPrefixCls}>
      <span>跳至</span>
      <Input
        className={`${componentPrefixCls}__input`}
        value={jumperValue}
        onChange={handleJumperChange}
        onKeyUp={handleJumperKeyUp}
        disabled={disabled}
        aria-label='Go to Page'
      />
      <span>页</span>
    </div>
  );
};

export default QuickJumper;
