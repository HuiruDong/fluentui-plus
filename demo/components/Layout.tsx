import React from 'react';
import { Outlet, Link, useLocation, ScrollRestoration } from 'react-router-dom';
import { makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#fafafa',
    borderRight: '1px solid #f0f0f0',
    padding: '0',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.02)',
  },
  sidebarHeader: {
    padding: '24px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#ffffff',
  },
  sidebarContent: {
    padding: '16px',
  },
  content: {
    flex: 1,
    marginLeft: '280px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  brandTitle: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    marginBottom: '8px',
    textDecoration: 'none',
    display: 'block',
  },
  brandSubtitle: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  navSection: {
    marginBottom: '32px',
  },
  navTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    paddingLeft: '8px',
  },
  navItem: {
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '2px',
    fontSize: '14px',
    color: '#4b5563',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    border: '1px solid transparent',
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      textDecoration: 'none',
    },
  },
  activeNavItem: {
    backgroundColor: '#667eea',
    color: '#ffffff',
    fontWeight: '600',
    border: '1px solid #667eea',
    '&:hover': {
      backgroundColor: '#5a67d8',
    },
  },
});

const Layout: React.FC = () => {
  const styles = useStyles();
  const location = useLocation();

  const navigationSections = [
    {
      title: '概览',
      items: [{ path: '/', label: '首页' }],
    },
    {
      title: '通用组件',
      items: [{ path: '/tag', label: 'Tag 标签' }],
    },
    { title: '布局组件', items: [{ path: '/layout', label: 'Layout 布局' }] },
    {
      title: '导航组件',
      items: [
        { path: '/nav', label: 'Nav 导航菜单' },
        { path: '/tabs', label: 'Tabs 标签页' },
      ],
    },
    {
      title: '数据录入',
      items: [
        { path: '/checkbox', label: 'Checkbox 复选框' },
        { path: '/inputtag', label: 'InputTag 标签输入' },
        { path: '/select', label: 'Select 选择器' },
        { path: '/cascader', label: 'Cascader 级联选择' },
        { path: '/upload', label: 'Upload 上传' },
      ],
    },
    {
      title: '数据展示',
      items: [
        { path: '/table', label: 'Table 表格' },
        { path: '/pagination', label: 'Pagination 分页' },
      ],
    },
    {
      title: '反馈组件',
      items: [
        { path: '/modal', label: 'Modal 对话框' },
        { path: '/message', label: 'Message 全局提示' },
        { path: '/spin', label: 'Spin 加载中' },
      ],
    },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to='/' className={styles.brandTitle}>
            FluentUI Plus
          </Link>
          <div className={styles.brandSubtitle}>企业级组件库</div>
        </div>

        <div className={styles.sidebarContent}>
          {navigationSections.map(section => (
            <div key={section.title} className={styles.navSection}>
              <div className={styles.navTitle}>{section.title}</div>
              {section.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navItem} ${location.pathname === item.path ? styles.activeNavItem : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <Outlet />
        <ScrollRestoration />
      </div>
    </div>
  );
};

export default Layout;
