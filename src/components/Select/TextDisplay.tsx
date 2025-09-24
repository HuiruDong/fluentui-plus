import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { ChevronDownRegular, DismissCircleFilled } from '@fluentui/react-icons';
import type { TextDisplayProps } from './types';
import { useSelectContext } from './context';

const TextDisplay: React.FC<TextDisplayProps> = ({ displayText, isPlaceholder, onClick, selectedOption }) => {
  // 从 Context 获取需要的数据和方法
  const { onClear, showClear = false, prefixCls, labelRender } = useSelectContext();
  // 如果有 labelRender 且有选中的选项，使用 labelRender 来生成显示文本
  const finalDisplayText = labelRender && selectedOption && !isPlaceholder ? labelRender(selectedOption) : displayText;
  return (
    <div
      className={mergeClasses(`${prefixCls}__selector-inner`)}
      onClick={onClick}
      title={selectedOption?.title}
      tabIndex={0}
    >
      <span
        className={mergeClasses(
          `${prefixCls}__selector-text`,
          isPlaceholder && `${prefixCls}__selector-text--placeholder`
        )}
      >
        {finalDisplayText}
      </span>
      <div className={mergeClasses(`${prefixCls}__selector-suffix`)}>
        {showClear && (
          <DismissCircleFilled className={mergeClasses(`${prefixCls}__selector-clear`)} onClick={onClear} />
        )}
        <ChevronDownRegular className={mergeClasses(`${prefixCls}__selector-arrow`)} />
      </div>
    </div>
  );
};

export default TextDisplay;
