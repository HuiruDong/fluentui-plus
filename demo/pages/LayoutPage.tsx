import React, { useState } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Layout } from '../../src/components';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

const { Header, Footer, Sider, Content } = Layout;

// LayoutPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    marginBottom: '24px',
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '20px',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
  },
  sider: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  siderContent: {
    ...shorthands.padding('16px'),
    color: tokens.colorNeutralForeground1,
  },
  content: {
    minHeight: '280px',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  logo: {
    height: '32px',
    lineHeight: '32px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  menu: {
    listStyle: 'none',
    ...shorthands.padding('0'),
    ...shorthands.margin('0'),
    '& li': {
      ...shorthands.padding('12px', '16px'),
      cursor: 'pointer',
      ...shorthands.borderRadius('4px'),
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground4Hover,
      },
    },
  },
});

const LayoutPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>Layout 布局</div>
        <div className={styles.description}>协助进行页面级整体布局。</div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础布局</div>
        <div className={styles.sectionDescription}>最基础的页面布局，包含头部、内容区和底部。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础布局示例</div>
          <div className={styles.demo}>
            <Layout>
              <Header className={styles.header}>Header</Header>
              <Content className={styles.content}>Content</Content>
              <Footer className={styles.footer}>Footer</Footer>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>上中下布局</div>
        <div className={styles.sectionDescription}>带有嵌套布局的上中下结构。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>上中下布局示例</div>
          <div className={styles.demo}>
            <Layout>
              <Header className={styles.header}>Header</Header>
              <Layout>
                <Content className={styles.content}>Content</Content>
              </Layout>
              <Footer className={styles.footer}>Footer</Footer>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>侧边布局</div>
        <div className={styles.sectionDescription}>带有侧边栏的布局结构，侧边栏可以放置导航菜单。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>左侧边栏布局</div>
          <div className={styles.demo}>
            <Layout>
              <Sider className={styles.sider} width={200}>
                <div className={styles.siderContent}>
                  <div className={styles.logo}>Logo</div>
                  <ul className={styles.menu}>
                    <li>菜单项 1</li>
                    <li>菜单项 2</li>
                    <li>菜单项 3</li>
                    <li>菜单项 4</li>
                  </ul>
                </div>
              </Sider>
              <Layout>
                <Header className={styles.header}>Header</Header>
                <Content className={styles.content}>Content</Content>
                <Footer className={styles.footer}>Footer</Footer>
              </Layout>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>可收起侧边栏</div>
        <div className={styles.sectionDescription}>侧边栏支持收起和展开功能，可以节省空间。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可收起侧边栏示例</div>
          <div className={styles.demo}>
            <Layout>
              <Sider
                className={styles.sider}
                width={200}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                collapsedWidth={80}
              >
                <div className={styles.siderContent}>
                  <div className={styles.logo}>{collapsed ? 'L' : 'Logo'}</div>
                  <ul className={styles.menu}>
                    <li>{collapsed ? '1' : '菜单项 1'}</li>
                    <li>{collapsed ? '2' : '菜单项 2'}</li>
                    <li>{collapsed ? '3' : '菜单项 3'}</li>
                    <li>{collapsed ? '4' : '菜单项 4'}</li>
                  </ul>
                </div>
              </Sider>
              <Layout>
                <Header className={styles.header}>Header</Header>
                <Content className={styles.content}>Content</Content>
                <Footer className={styles.footer}>Footer</Footer>
              </Layout>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>侧边布局（右侧）</div>
        <div className={styles.sectionDescription}>侧边栏也可以放置在右侧。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>右侧边栏布局</div>
          <div className={styles.demo}>
            <Layout>
              <Layout>
                <Header className={styles.header}>Header</Header>
                <Content className={styles.content}>Content</Content>
                <Footer className={styles.footer}>Footer</Footer>
              </Layout>
              <Sider className={styles.sider} width={200}>
                <div className={styles.siderContent}>
                  <div className={styles.logo}>Logo</div>
                  <ul className={styles.menu}>
                    <li>菜单项 1</li>
                    <li>菜单项 2</li>
                    <li>菜单项 3</li>
                    <li>菜单项 4</li>
                  </ul>
                </div>
              </Sider>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>响应式侧边栏</div>
        <div className={styles.sectionDescription}>
          侧边栏支持响应式布局，可在不同屏幕尺寸下自动收起。尝试调整浏览器窗口大小查看效果。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>响应式侧边栏示例</div>
          <div className={styles.demo}>
            <Layout>
              <Sider
                className={styles.sider}
                width={200}
                collapsible
                breakpoint='lg'
                collapsedWidth={80}
                onCollapse={(collapsed: boolean) => console.log('Collapsed:', collapsed)}
              >
                <div className={styles.siderContent}>
                  <div className={styles.logo}>Logo</div>
                  <ul className={styles.menu}>
                    <li>菜单项 1</li>
                    <li>菜单项 2</li>
                    <li>菜单项 3</li>
                    <li>菜单项 4</li>
                  </ul>
                </div>
              </Sider>
              <Layout>
                <Header className={styles.header}>Header</Header>
                <Content className={styles.content}>Content</Content>
                <Footer className={styles.footer}>Footer</Footer>
              </Layout>
            </Layout>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Layout 组件及其子组件支持的所有参数配置。</div>

        <div className={styles.demoContainer}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Layout</h3>
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
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>指定样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子元素</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Sider</h3>
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
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>指定样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>width</td>
                <td style={apiTableStyles.tdStyle}>侧边栏宽度</td>
                <td style={apiTableStyles.tdStyle}>number | string</td>
                <td style={apiTableStyles.tdStyle}>200</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>collapsible</td>
                <td style={apiTableStyles.tdStyle}>是否可收起</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>collapsed</td>
                <td style={apiTableStyles.tdStyle}>当前收起状态</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>collapsedWidth</td>
                <td style={apiTableStyles.tdStyle}>收缩宽度</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>80</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onCollapse</td>
                <td style={apiTableStyles.tdStyle}>收起展开的回调函数</td>
                <td style={apiTableStyles.tdStyle}>(collapsed: boolean) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>breakpoint</td>
                <td style={apiTableStyles.tdStyle}>触发响应式布局的断点</td>
                <td style={apiTableStyles.tdStyle}>'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子元素</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Header</h3>
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
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>指定样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子元素</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Content</h3>
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
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>指定样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子元素</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Footer</h3>
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
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>容器类名</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>style</td>
                <td style={apiTableStyles.tdStyle}>指定样式</td>
                <td style={apiTableStyles.tdStyle}>CSSProperties</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>子元素</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>{' '}
    </div>
  );
};

export default LayoutPage;
