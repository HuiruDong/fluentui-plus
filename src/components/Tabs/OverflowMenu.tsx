import * as React from 'react';
import { Button, Menu, MenuList, MenuPopover, MenuTrigger, useOverflowMenu } from '@fluentui/react-components';
import { MoreHorizontalRegular, MoreHorizontalFilled, bundleIcon } from '@fluentui/react-icons';
import type { OverflowMenuProps } from './types';
import OverflowMenuItem from './OverflowMenuItem';

const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

const OverflowMenu: React.FC<OverflowMenuProps> = props => {
  const { onTabSelect, items, menuMaxHeight, buttonProps } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  const onItemClick = (tabId: string) => {
    onTabSelect?.(tabId);
  };

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance='transparent'
          icon={<MoreHorizontal />}
          aria-label={`${overflowCount} more tabs`}
          role='tab'
          {...buttonProps}
          ref={ref}
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList style={{ maxHeight: menuMaxHeight ?? '256px' }}>
          {items?.map(tab => (
            <OverflowMenuItem key={tab.key} tab={tab} onClick={() => onItemClick(tab.key)} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default OverflowMenu;
