import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import {
  DocumentRegular,
  FolderRegular,
  EditRegular,
  SettingsRegular,
  PersonRegular,
  HomeRegular,
  CalendarRegular,
  MailRegular,
} from '@fluentui/react-icons';
import { Tabs } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// TabsPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tabContent: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginTop: '8px',
  },
  narrowContainer: {
    width: '400px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
  },
  verticalContainer: {
    height: '200px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
  },
});

const TabsPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  const [selectedTab, setSelectedTab] = useState<string>('');

  // 基础标签页数据
  const basicItems = [
    { key: 'tab1', label: '标签一' },
    { key: 'tab2', label: '标签二' },
    { key: 'tab3', label: '标签三' },
  ];

  // 带图标的标签页数据
  const iconItems = [
    { key: 'home', label: '首页', icon: <HomeRegular /> },
    { key: 'documents', label: '文档', icon: <DocumentRegular /> },
    { key: 'folder', label: '文件夹', icon: <FolderRegular /> },
    { key: 'settings', label: '设置', icon: <SettingsRegular /> },
  ];

  // 更多标签页数据（用于溢出演示）
  const overflowItems = [
    { key: 'home', label: '首页', icon: <HomeRegular /> },
    { key: 'documents', label: '文档', icon: <DocumentRegular /> },
    { key: 'folder', label: '文件夹', icon: <FolderRegular /> },
    { key: 'edit', label: '编辑', icon: <EditRegular /> },
    { key: 'person', label: '个人中心', icon: <PersonRegular /> },
    { key: 'calendar', label: '日历', icon: <CalendarRegular /> },
    { key: 'mail', label: '邮件', icon: <MailRegular /> },
    { key: 'settings', label: '设置', icon: <SettingsRegular /> },
  ];

  // 禁用项标签页数据
  const disabledItems = [
    { key: 'tab1', label: '可用标签' },
    { key: 'tab2', label: '禁用标签', disabled: true },
    { key: 'tab3', label: '可用标签' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Tabs 标签页</div>
        <div className={styles.description}>
          选项卡切换组件，用于在不同的内容区域之间进行切换。支持溢出菜单、图标、禁用状态等功能。
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，通过 items 属性设置标签页选项。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础标签页</div>
          <div className={styles.demo}>
            <Tabs items={basicItems} onTabSelect={key => console.log('选中:', key)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>带图标的标签页</div>
        <div className={styles.sectionDescription}>通过设置 items 中的 icon 属性可以为标签页添加图标。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>图标标签页</div>
          <div className={styles.demo}>
            <Tabs items={iconItems} onTabSelect={key => console.log('选中:', key)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>溢出菜单</div>
        <div className={styles.sectionDescription}>
          当标签页过多时，超出容器宽度的标签会自动收起到溢出菜单中。可通过 menuMaxHeight 属性设置菜单最大高度。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>溢出标签页</div>
          <div className={styles.demo}>
            <div className={styles.narrowContainer}>
              <Tabs items={overflowItems} menuMaxHeight='200px' onTabSelect={key => console.log('选中:', key)} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>垂直布局</div>
        <div className={styles.sectionDescription}>通过设置 vertical 属性可以使标签页垂直排列。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>垂直标签页</div>
          <div className={styles.demo}>
            <div className={styles.verticalContainer}>
              <Tabs
                overflowProps={{ minimumVisible: 4 }}
                vertical
                items={iconItems}
                onTabSelect={key => console.log('选中:', key)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>通过设置 items 中的 disabled 属性可以禁用某个标签页。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用标签页</div>
          <div className={styles.demo}>
            <Tabs items={disabledItems} onTabSelect={key => console.log('选中:', key)} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>不同外观</div>
        <div className={styles.sectionDescription}>
          Tabs 组件支持 transparent、subtle 、subtle-circular 和 filled-circular 四种外观样式。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>外观样式</div>
          <div className={styles.demo}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>transparent（默认）</div>
              <Tabs appearance='transparent' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>subtle</div>
              <Tabs appearance='subtle' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>subtle-circular</div>
              <Tabs appearance='subtle-circular' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
            <div>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>filled-circular</div>
              <Tabs appearance='filled-circular' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>不同尺寸</div>
        <div className={styles.sectionDescription}>Tabs 组件支持 small、medium 和 large 三种尺寸。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>尺寸</div>
          <div className={styles.demo}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>small</div>
              <Tabs size='small' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>medium（默认）</div>
              <Tabs size='medium' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
            <div>
              <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>large</div>
              <Tabs size='large' items={basicItems} onTabSelect={key => console.log('选中:', key)} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>事件回调</div>
        <div className={styles.sectionDescription}>通过 onTabSelect 回调可以获取当前选中的标签页。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>选中回调</div>
          <div className={styles.demo}>
            <Tabs items={basicItems} onTabSelect={key => setSelectedTab(key)} />
            <div className={styles.tabContent}>
              当前选中: <strong>{selectedTab || '未选中'}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Tabs 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Tabs</h3>
          <table style={apiTableStyles.tableWithMarginStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={apiTableStyles.thStyle}>参数</th>
                <th style={apiTableStyles.thStyle}>说明</th>
                <th style={apiTableStyles.thStyle}>类型</th>
                <th style={apiTableStyles.thStyle}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={apiTableStyles.tdStyle}>items</td>
                <td style={apiTableStyles.tdStyle}>标签页选项列表</td>
                <td style={apiTableStyles.tdStyle}>Option[]</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>vertical</td>
                <td style={apiTableStyles.tdStyle}>是否垂直排列</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>appearance</td>
                <td style={apiTableStyles.tdStyle}>标签页外观样式</td>
                <td style={apiTableStyles.tdStyle}>'transparent' | 'subtle' | 'subtle-circular' | 'filled-circular'</td>
                <td style={apiTableStyles.tdStyle}>'transparent'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>size</td>
                <td style={apiTableStyles.tdStyle}>标签页尺寸</td>
                <td style={apiTableStyles.tdStyle}>'small' | 'medium' | 'large'</td>
                <td style={apiTableStyles.tdStyle}>'medium'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onTabSelect</td>
                <td style={apiTableStyles.tdStyle}>标签页选择事件回调</td>
                <td style={apiTableStyles.tdStyle}>(activeKey: string) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>overflowProps</td>
                <td style={apiTableStyles.tdStyle}>溢出组件的属性配置</td>
                <td style={apiTableStyles.tdStyle}>Omit&lt;OverflowProps, 'overflowAxis' | 'children'&gt;</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>menuMaxHeight</td>
                <td style={apiTableStyles.tdStyle}>溢出菜单下拉框的最大高度</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>'256px'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>menuTriggerButtonProps</td>
                <td style={apiTableStyles.tdStyle}>溢出菜单触发按钮的属性配置</td>
                <td style={apiTableStyles.tdStyle}>MenuTriggerButtonProps</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Option</h3>
          <table style={apiTableStyles.tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={apiTableStyles.thStyle}>参数</th>
                <th style={apiTableStyles.thStyle}>说明</th>
                <th style={apiTableStyles.thStyle}>类型</th>
                <th style={apiTableStyles.thStyle}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={apiTableStyles.tdStyle}>key</td>
                <td style={apiTableStyles.tdStyle}>唯一标识符</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>label</td>
                <td style={apiTableStyles.tdStyle}>显示文本</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>icon</td>
                <td style={apiTableStyles.tdStyle}>图标</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>disabled</td>
                <td style={apiTableStyles.tdStyle}>是否禁用</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabsPage;
