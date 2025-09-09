import React from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { ChevronDownRegular, DismissCircleFilled } from '@fluentui/react-icons';
import type { TextDisplayProps } from './types';

const TextDisplay: React.FC<TextDisplayProps> = ({
  displayText,
  isPlaceholder,
  onClick,
  selectedOption,
  onClear,
  showClear = false,
  prefixCls,
}) => {
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
        {displayText}
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
