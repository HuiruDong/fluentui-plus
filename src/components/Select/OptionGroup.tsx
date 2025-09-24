import React from 'react';
import { OptionGroupProps } from './types';
import OptionItem from './OptionItem';
import { useSelectContext } from './context';

const OptionGroup: React.FC<OptionGroupProps> = ({ group, selectedValues = [] }) => {
  // 从 Context 获取需要的数据和方法
  const { prefixCls } = useSelectContext();
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
      return <OptionItem key={option.value ?? index} option={option} index={index} isSelected={isSelected} />;
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
