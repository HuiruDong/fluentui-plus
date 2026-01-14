import * as React from 'react';
import { Tab, TabList, Overflow, OverflowItem } from '@fluentui/react-components';
import type { TabsProps } from './types';
import OverflowMenu from './OverflowMenu';

const Tabs: React.FC<TabsProps> = ({
  vertical,
  onTabSelect,
  items,
  overflowProps,
  menuMaxHeight,
  menuTriggerButtonProps,
  ...props
}) => {
  const [selectedTabId, setSelectedTabId] = React.useState<string>('');

  const onTabSelectHandler = (tabId: string) => {
    setSelectedTabId(tabId);
    onTabSelect?.(tabId);
  };

  return (
    <div>
      <Overflow {...overflowProps} overflowAxis={vertical ? 'vertical' : 'horizontal'}>
        <TabList
          selectedValue={selectedTabId}
          onTabSelect={(_, d) => onTabSelectHandler(d.value as string)}
          vertical={vertical}
          {...props}
        >
          {items?.map(tab => {
            return (
              <OverflowItem key={tab.key} id={tab.key} priority={tab.key === selectedTabId ? 2 : 1}>
                <Tab value={tab.key} icon={tab.icon}>
                  {tab.label}
                </Tab>
              </OverflowItem>
            );
          })}
          <OverflowMenu
            onTabSelect={onTabSelectHandler}
            items={items || []}
            menuMaxHeight={menuMaxHeight}
            buttonProps={menuTriggerButtonProps}
          />
        </TabList>
      </Overflow>
    </div>
  );
};

export default Tabs;
