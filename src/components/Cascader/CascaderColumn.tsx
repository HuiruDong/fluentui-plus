import React, { useCallback } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import type { CascaderColumnProps, CascaderOption as CascaderOptionType, CheckedStatus } from './types';
import CascaderOption from './CascaderOption';
import { hasChildren, getNodeCheckedStatus } from './utils';

const CascaderColumn: React.FC<CascaderColumnProps> = ({
  options,
  selectedOption,
  level,
  onSelect,
  expandTrigger = 'click',
  optionRender,
  prefixCls,
  multiple = false,
  checkedKeys = new Set(),
  onCheckChange,
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

  const handleCheckChange = useCallback(
    (option: CascaderOptionType, checked: boolean) => {
      onCheckChange?.(option, checked);
    },
    [onCheckChange]
  );

  return (
    <div className={mergeClasses(`${prefixCls}__column`)}>
      {options.map((option, index) => {
        const optionValue = option.value;
        const selectedValue = selectedOption?.value;
        const isSelected = optionValue === selectedValue;
        const isActive = isSelected; // 在当前列中，选中即活跃
        const hasChildrenFlag = hasChildren(option);

        // 计算多选状态
        let checkedStatus: CheckedStatus = 'unchecked';
        if (multiple && optionValue !== undefined) {
          checkedStatus = getNodeCheckedStatus(option, checkedKeys);
        }

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
            multiple={multiple}
            checked={checkedStatus}
            onCheckChange={checked => handleCheckChange(option, checked)}
          />
        );
      })}
    </div>
  );
};

export default CascaderColumn;
