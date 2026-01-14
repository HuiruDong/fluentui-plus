import * as React from 'react';
import { MenuItem, useIsOverflowItemVisible } from '@fluentui/react-components';
import type { OverflowMenuItemProps } from './types';

const OverflowMenuItem: React.FC<OverflowMenuItemProps> = props => {
  const { tab, onClick } = props;
  const isVisible = useIsOverflowItemVisible(tab.key);

  if (isVisible) {
    return null;
  }

  return (
    <MenuItem key={tab.key} icon={tab.icon} onClick={onClick}>
      <div>{tab.label}</div>
    </MenuItem>
  );
};

export default OverflowMenuItem;
