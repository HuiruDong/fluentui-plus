import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { SelectProps, Option } from './types';
import { Popover, PopoverTrigger, PopoverSurface } from '@fluentui/react-components';
import Selector from './Selector';
import Options from './Options';
import './index.less';

const prefixCls = 'mm-select';

const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  className,
  style,
  disabled = false,
  listHeight = 256,
  open,
  options = [],
  placeholder,
  onChange,
}) => {
  // 内部状态管理
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);

  // 引用相关元素
  const selectorRef = useRef<HTMLDivElement>(null);
  const popoverSurfaceRef = useRef<HTMLDivElement>(null);

  // 当前值（受控/非受控）
  const currentValue = value !== undefined ? value : internalValue;

  // 当前展开状态（受控/非受控），禁用时强制关闭
  const currentOpen = disabled ? false : open !== undefined ? open : internalOpen;

  // 根据当前值找到对应的选项
  const selectedOption = useMemo(() => {
    return options.find(option => option.value === currentValue);
  }, [options, currentValue]);

  // 处理选项点击
  const handleOptionClick = useCallback(
    (option: Option) => {
      if (option.disabled) return;

      // 更新内部状态
      if (value === undefined) {
        setInternalValue(option.value);
      }

      // 关闭下拉菜单
      if (open === undefined) {
        setInternalOpen(false);
      }

      // 调用回调
      if (onChange && option.value !== undefined) {
        onChange(option.value, option);
      }
    },
    [value, open, onChange]
  );

  // 处理选择器点击
  const handleSelectorClick = useCallback(() => {
    if (disabled) return;

    if (open === undefined) {
      setInternalOpen(!internalOpen);
    }
  }, [disabled, open, internalOpen]);

  // 处理弹窗状态变化
  const handleOpenChange = useCallback(
    (event: any, data: { open: boolean }) => {
      if (disabled) return;

      if (open === undefined) {
        setInternalOpen(data.open);
      }
    },
    [disabled, open]
  );

  // 使用 ResizeObserver 监听 selector 宽度变化并同步到 PopoverSurface
  useEffect(() => {
    const selectorElement = selectorRef.current;
    const popoverSurfaceElement = popoverSurfaceRef.current;

    if (!selectorElement || !popoverSurfaceElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        popoverSurfaceElement.style.width = `${width}px`;
      }
    });

    resizeObserver.observe(selectorElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentOpen]); // 当弹窗状态改变时重新执行，确保在弹窗打开时能正确设置宽度

  return (
    <div className={`${prefixCls} ${className || ''}`} style={style}>
      <Popover open={currentOpen} onOpenChange={handleOpenChange} positioning='below'>
        <PopoverTrigger disableButtonEnhancement>
          <div
            ref={selectorRef}
            className={`${prefixCls}__selector ${disabled ? ` ${prefixCls}__selector--disabled` : ''}`}
          >
            <Selector
              value={currentValue}
              placeholder={placeholder}
              disabled={disabled}
              selectedOption={selectedOption}
              onClick={handleSelectorClick}
            />
          </div>
        </PopoverTrigger>

        <PopoverSurface ref={popoverSurfaceRef} className='popoverSurface'>
          <Options options={options} value={currentValue} listHeight={listHeight} onOptionClick={handleOptionClick} />
        </PopoverSurface>
      </Popover>
    </div>
  );
};

export default Select;
export type { SelectProps } from './types';
