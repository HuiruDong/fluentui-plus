import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Nav } from '../../src';
import type { NavItemType } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// NavPage 特有样式
const useCustomStyles = makeStyles({
  navDemo: {
    width: '280px',
    height: '400px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  twoColumnDemo: {
    display: 'grid',
    gridTemplateColumns: '280px 280px',
    gap: '24px',
  },
});

const NavPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础导航数据
  const basicNavItems: NavItemType[] = [
    {
      key: '1',
      label: '导航一',
    },
    {
      key: '2',
      label: '导航二',
    },
    {
      key: '3',
      label: '导航三',
    },
  ];

  // 带子菜单的导航数据
  const nestedNavItems: NavItemType[] = [
    {
      key: '1',
      label: '导航一',
      children: [
        { key: '1-1', label: '选项一' },
        { key: '1-2', label: '选项二' },
        { key: '1-3', label: '选项三' },
      ],
    },
    {
      key: '2',
      label: '导航二',
      children: [
        { key: '2-1', label: '选项一' },
        { key: '2-2', label: '选项二' },
      ],
    },
    {
      key: '3',
      label: '导航三',
    },
  ];

  // 复杂的多级导航数据
  const complexNavItems: NavItemType[] = [
    {
      key: '1',
      label: '系统管理',
      children: [
        { key: '1-1', label: '用户管理' },
        { key: '1-2', label: '角色管理' },
        {
          key: '1-3',
          label: '权限管理',
          children: [
            { key: '1-3-1', label: '菜单权限' },
            { key: '1-3-2', label: '数据权限' },
          ],
        },
      ],
    },
    {
      key: '2',
      label: '内容管理',
      children: [
        { key: '2-1', label: '文章管理' },
        { key: '2-2', label: '分类管理' },
      ],
    },
    {
      key: '3',
      label: '数据统计',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Nav 导航菜单</div>
        <div className={styles.description}>为页面和功能提供导航的菜单列表，支持多级嵌套。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，通过 items 数组配置导航项。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础导航</div>
          <div className={styles.navDemo}>
            <Nav items={basicNavItems} selectedKeys={['1']} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>子菜单</div>
        <div className={styles.sectionDescription}>通过 children 属性可以创建带有子菜单的导航项。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>带子菜单的导航</div>
          <div className={styles.navDemo}>
            <Nav items={nestedNavItems} selectedKeys={['1-2']} openKeys={['1']} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>多级嵌套</div>
        <div className={styles.sectionDescription}>支持更深层级的子菜单嵌套。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多级嵌套导航</div>
          <div className={styles.navDemo}>
            <Nav items={complexNavItems} selectedKeys={['1-3-1']} openKeys={['1', '1-3']} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>不同模式对比</div>
        <div className={styles.sectionDescription}>可以通过不同的属性配置来控制导航的展开和选中状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>默认展开 vs 手动控制</div>
          <div className={styles.twoColumnDemo}>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>默认展开第一项</h4>
              <div className={styles.navDemo}>
                <Nav items={nestedNavItems} selectedKeys={['1-1']} openKeys={['1']} />
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>全部收起</h4>
              <div className={styles.navDemo}>
                <Nav items={nestedNavItems} selectedKeys={['2']} openKeys={[]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Nav 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Nav</h3>
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
                <td style={apiTableStyles.tdStyle}>菜单数据</td>
                <td style={apiTableStyles.tdStyle}>NavItemType[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>mode</td>
                <td style={apiTableStyles.tdStyle}>菜单模式</td>
                <td style={apiTableStyles.tdStyle}>'inline'</td>
                <td style={apiTableStyles.tdStyle}>'inline'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>collapsed</td>
                <td style={apiTableStyles.tdStyle}>是否收起菜单</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>selectedKeys</td>
                <td style={apiTableStyles.tdStyle}>当前选中的菜单项</td>
                <td style={apiTableStyles.tdStyle}>string[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>defaultSelectedKeys</td>
                <td style={apiTableStyles.tdStyle}>默认选中的菜单项</td>
                <td style={apiTableStyles.tdStyle}>string[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>openKeys</td>
                <td style={apiTableStyles.tdStyle}>当前展开的子菜单</td>
                <td style={apiTableStyles.tdStyle}>string[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>defaultOpenKeys</td>
                <td style={apiTableStyles.tdStyle}>默认展开的子菜单</td>
                <td style={apiTableStyles.tdStyle}>string[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onSelect</td>
                <td style={apiTableStyles.tdStyle}>被选中时调用</td>
                <td style={apiTableStyles.tdStyle}>function</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onOpenChange</td>
                <td style={apiTableStyles.tdStyle}>SubMenu 展开/关闭的回调</td>
                <td style={apiTableStyles.tdStyle}>(openKeys: string[]) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>expandIcon</td>
                <td style={apiTableStyles.tdStyle}>自定义展开图标</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器的样式类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>容器的样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>NavItemType</h3>
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
                <td style={apiTableStyles.tdStyle}>唯一标识</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>type</td>
                <td style={apiTableStyles.tdStyle}>菜单项类型</td>
                <td style={apiTableStyles.tdStyle}>'item' | 'divider' | 'group'</td>
                <td style={apiTableStyles.tdStyle}>'item'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>label</td>
                <td style={apiTableStyles.tdStyle}>菜单项标题</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>title</td>
                <td style={apiTableStyles.tdStyle}>设置收缩时展示的悬浮标题</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>icon</td>
                <td style={apiTableStyles.tdStyle}>菜单图标</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>disabled</td>
                <td style={apiTableStyles.tdStyle}>是否禁用</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子菜单项</td>
                <td style={apiTableStyles.tdStyle}>NavItemType[]</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>自定义样式类</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>自定义样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NavPage;
