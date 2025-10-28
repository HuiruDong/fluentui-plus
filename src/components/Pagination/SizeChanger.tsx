import React from 'react';
import type { SizeChangerProps } from './types';
import { Dropdown, Option, makeStyles, tokens } from '@fluentui/react-components';

/**
 * 注意：这里使用 makeStyles 而不是 Less 样式
 * 因为 Fluent UI 组件使用 Griffel（CSS-in-JS）样式系统，
 * 外部的 Less/CSS 类名无法穿透到组件内部
 */
const useStyles = makeStyles({
  dropdown: {
    minWidth: 'auto',
  },
  listbox: {
    minWidth: 'auto',
    maxHeight: '260px !important',
  },
  selectedOption: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

const SizeChanger: React.FC<SizeChangerProps> = ({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  disabled = false,
  prefixCls,
}) => {
  const styles = useStyles();
  const componentPrefixCls = `${prefixCls}__size-changer`;

  return (
    <div className={componentPrefixCls}>
      <Dropdown
        value={`${pageSize} 条/页`}
        selectedOptions={[pageSize.toString()]}
        disabled={disabled}
        onOptionSelect={(_, data) => {
          if (data.optionValue) {
            onPageSizeChange(Number(data.optionValue));
          }
        }}
        className={styles.dropdown}
        listbox={{ className: styles.listbox }}
      >
        {pageSizeOptions.map(size => (
          <Option
            key={size}
            value={size.toString()}
            text={`${size} 条/页`}
            checkIcon={null}
            className={size === pageSize ? styles.selectedOption : undefined}
          >
            {size} 条/页
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default SizeChanger;
