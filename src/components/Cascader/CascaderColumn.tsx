import React, { useCallback } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderColumnProps, CascaderOption as CascaderOptionType } from './types';
import CascaderOption from './CascaderOption';
import { hasChildren } from './utils';

const CascaderColumn: React.FC<CascaderColumnProps> = ({
  options,
  selectedOption,
  level,
  onSelect,
  expandTrigger = 'click',
  optionRender,
  prefixCls,
}) => {
  const handleOptionClick = useCallback(
    (option: CascaderOptionType) => {
      onSelect(option, level);
    },
    [onSelect, level]
  );

  const handleOptionHover = useCallback(
    (option: CascaderOptionType) => {
      // 只有当 expandTrigger 为 hover 且选项有子节点时，才触发展开
      if (expandTrigger === 'hover' && hasChildren(option)) {
        onSelect(option, level);
      }
    },
    [expandTrigger, onSelect, level]
  );

  return (
    <div className={mergeClasses(`${prefixCls}__column`)}>
      {options.map((option, index) => {
        const optionValue = option.value;
        const selectedValue = selectedOption?.value;
        const isSelected = optionValue === selectedValue;
        const isActive = isSelected; // 在当前列中，选中即活跃
        const hasChildrenFlag = hasChildren(option);

        return (
          <CascaderOption
            key={optionValue ?? `option-${level}-${index}`}
            option={option}
            level={level}
            isSelected={isSelected}
            isActive={isActive}
            hasChildren={hasChildrenFlag}
            onClick={() => handleOptionClick(option)}
            onHover={() => handleOptionHover(option)}
            optionRender={optionRender}
            prefixCls={prefixCls}
          />
        );
      })}
    </div>
  );
};

export default CascaderColumn;
