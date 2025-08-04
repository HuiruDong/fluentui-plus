import React, { useCallback, useEffect, useRef } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useInputTag, useInputHandlers } from './hooks';
import TagList from './TagList';
import Input from './Input';
import type { InputTagProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-input-tag';

const InputTag: React.FC<InputTagProps> = props => {
  const {
    value,
    defaultValue = [],
    onChange,
    onInputChange,
    placeholder,
    disabled = false,
    maxTags,
    allowDuplicates = true,
    delimiter,
    renderTag,
    onTagRemove,
    tagClosable = true,
    className,
    style,
  } = props;
  // 使用自定义 hooks 管理状态和逻辑
  const { getCurrentTags, addTag, removeTag, addMultipleTags, isDeleting } = useInputTag({
    value,
    defaultValue,
    onChange,
    maxTags,
    allowDuplicates,
    onTagRemove,
  });

  const currentTags = getCurrentTags();

  // 输入框宽度管理 refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // 调整输入框宽度
  const adjustInputWidth = useCallback(() => {
    if (!inputRef.current || !containerRef.current || !tagsContainerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const tagsWidth = tagsContainerRef.current.offsetWidth;
    const padding = 16; // 容器的左右内边距总和

    // 计算剩余可用空间
    let remainingWidth = containerWidth - tagsWidth - padding;

    // 设置最小宽度
    remainingWidth = Math.max(remainingWidth, 50);

    inputRef.current.style.width = `${remainingWidth}px`;
  }, []);

  useEffect(() => {
    adjustInputWidth();

    // 监听窗口大小变化重新调整
    window.addEventListener('resize', adjustInputWidth);
    return () => {
      window.removeEventListener('resize', adjustInputWidth);
    };
  }, [currentTags, adjustInputWidth]);
  const {
    inputValue,
    isFocused,
    setIsFocused,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    handleContainerBlur,
    handleInputBlur,
  } = useInputHandlers({
    onInputChange,
    addTag,
    removeTag,
    addMultipleTags,
    getCurrentTags,
    isDeleting,
    delimiter,
  });

  return (
    <div
      className={mergeClasses(
        prefixCls,
        isFocused && `${prefixCls}--focused`,
        disabled && `${prefixCls}--disabled`,
        className
      )}
      style={style}
      ref={containerRef}
      tabIndex={-1}
      onBlur={handleContainerBlur}
    >
      <div className={`${prefixCls}__content`} ref={tagsContainerRef}>
        <TagList
          tags={currentTags}
          disabled={disabled}
          tagClosable={tagClosable}
          onTagRemove={(_, index) => removeTag(index)}
          renderTag={renderTag}
        />
        <Input
          value={inputValue}
          placeholder={currentTags.length === 0 ? placeholder : ''}
          disabled={disabled}
          inputRef={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleInputBlur}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
};

export default InputTag;
export type { InputTagProps };
