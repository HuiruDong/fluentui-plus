import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { ChevronDownRegular } from '@fluentui/react-icons';
import type { TextDisplayProps } from './types';

const TextDisplay: React.FC<TextDisplayProps> = ({
  displayText,
  isPlaceholder,
  onClick,
  selectedOption,
  prefixCls,
}) => {
  return (
    <div className={mergeClasses(`${prefixCls}__selector-inner`)} onClick={onClick} title={selectedOption?.title}>
      <span
        className={mergeClasses(
          `${prefixCls}__selector-text`,
          isPlaceholder && `${prefixCls}__selector-text--placeholder`
        )}
      >
        {displayText}
      </span>
      <ChevronDownRegular className={mergeClasses(`${prefixCls}__selector-arrow`)} />
    </div>
  );
};

export default TextDisplay;
