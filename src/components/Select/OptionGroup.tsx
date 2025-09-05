import React from 'react';
import { OptionGroupProps } from './types';
import OptionItem from './OptionItem';

const OptionGroup: React.FC<OptionGroupProps> = ({
  group,
  multiple,
  selectedValues = [],
  onOptionClick,
  optionRender,
  prefixCls,
}) => {
  const groupCls = `${prefixCls}__group`;
  const groupLabelCls = `${groupCls}-label`;

  const renderGroupLabel = () => {
    return (
      <div className={groupLabelCls} title={group.label}>
        {group.label}
      </div>
    );
  };

  const renderOptions = () => {
    return group.options.map((option, index) => {
      const isSelected = selectedValues.includes(option.value!);
      return (
        <OptionItem
          key={option.value ?? index}
          option={option}
          index={index}
          isSelected={isSelected}
          multiple={multiple}
          onOptionClick={onOptionClick}
          optionRender={optionRender}
          prefixCls={prefixCls}
        />
      );
    });
  };

  return (
    <div className={groupCls}>
      {renderGroupLabel()}
      <div className={`${groupCls}-options`}>{renderOptions()}</div>
    </div>
  );
};

export default OptionGroup;
