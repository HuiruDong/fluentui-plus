import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from '../src/components';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

const { Header, Footer, Sider, Content } = Layout;

const useStyles = makeStyles({
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

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    docs: {
      description: {
        component: '协助进行页面级整体布局。',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Basic: Story = {
  render: () => {
    const styles = useStyles();
    return (
      <Layout>
        <Header className={styles.header}>Header</Header>
        <Content className={styles.content}>Content</Content>
        <Footer className={styles.footer}>Footer</Footer>
      </Layout>
    );
  },
};

export const WithSider: Story = {
  render: () => {
    const styles = useStyles();
    return (
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
    );
  },
};

export const CollapsibleSider: Story = {
  render: () => {
    const styles = useStyles();
    const [collapsed, setCollapsed] = React.useState(false);

    return (
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
    );
  },
};

export const RightSider: Story = {
  render: () => {
    const styles = useStyles();
    return (
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
    );
  },
};

export const ResponsiveSider: Story = {
  render: () => {
    const styles = useStyles();
    return (
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
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const styles = useStyles();
    return (
      <Layout>
        <Sider className={styles.sider} width={250}>
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
    );
  },
};
