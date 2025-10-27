import React from 'react';
import clsx from 'clsx';
import { ChevronDownRegular, DismissCircleFilled } from '@fluentui/react-icons';
import type { TextDisplayProps } from './types';
import { useSelectContext } from './context';

const TextDisplay: React.FC<TextDisplayProps> = ({ displayText, isPlaceholder, onClick, selectedOption }) => {
  // 从 Context 获取需要的数据和方法
  const { onClear, showClear = false, prefixCls, labelRender } = useSelectContext();
  // 如果有 labelRender 且有选中的选项，使用 labelRender 来生成显示文本
  const finalDisplayText = labelRender && selectedOption && !isPlaceholder ? labelRender(selectedOption) : displayText;
  return (
    <div className={clsx(`${prefixCls}__selector-inner`)} onClick={onClick} title={selectedOption?.title} tabIndex={0}>
      <span
        className={clsx(`${prefixCls}__selector-text`, { [`${prefixCls}__selector-text--placeholder`]: isPlaceholder })}
      >
        {finalDisplayText}
      </span>
      <div className={clsx(`${prefixCls}__selector-suffix`)}>
        {showClear && <DismissCircleFilled className={clsx(`${prefixCls}__selector-clear`)} onClick={onClear} />}
        <ChevronDownRegular className={clsx(`${prefixCls}__selector-arrow`)} />
      </div>
    </div>
  );
};

export default TextDisplay;
