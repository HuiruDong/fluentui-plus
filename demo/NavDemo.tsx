import React, { useState } from 'react';
import { Nav } from '../src/components';
import type { NavItemType } from '../src/components';

// 为深色主题添加样式
const darkNavStyles = `
  .dark-nav {
    background: #001529 !important;
  }
  .dark-nav .fluentui-plus-nav__item {
    color: rgba(255, 255, 255, 0.65) !important;
  }
  .dark-nav .fluentui-plus-nav__item:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #fff !important;
  }
  .dark-nav .fluentui-plus-nav__item--selected {
    background: #1890ff !important;
    color: #fff !important;
  }
  .dark-nav .fluentui-plus-nav__group-title {
    color: rgba(255, 255, 255, 0.45) !important;
  }
  .dark-nav .fluentui-plus-nav__divider {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
`;

// 注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = darkNavStyles;
  document.head.appendChild(styleElement);
}

const NavDemo = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);
  const [collapsed, setCollapsed] = useState(false);

  // 基础导航数据
  const basicItems: NavItemType[] = [
    {
      key: '1',
      label: '首页',
      icon: '🏠',
      title: '首页',
    },
    {
      key: '2',
      label: '工作台',
      icon: '💼',
      title: '工作台',
    },
    {
      key: '3',
      label: '数据统计',
      icon: '📊',
      title: '数据统计',
    },
    {
      key: '4',
      label: '设置',
      icon: '⚙️',
      title: '设置',
    },
  ];

  // 带子菜单的导航数据
  const nestedItems: NavItemType[] = [
    {
      key: '1',
      label: '首页',
      icon: '🏠',
      title: '首页',
    },
    {
      key: 'sub1',
      label: '产品管理',
      icon: '📦',
      title: '产品管理',
      children: [
        {
          key: '2',
          label: '产品列表',
          icon: '📋',
          title: '产品列表',
        },
        {
          key: '3',
          label: '添加产品',
          icon: '➕',
          title: '添加产品',
        },
        {
          key: '4',
          label: '产品分类',
          icon: '🏷️',
          title: '产品分类',
        },
      ],
    },
    {
      key: 'sub2',
      label: '用户管理',
      icon: '👥',
      title: '用户管理',
      children: [
        {
          key: '5',
          label: '用户列表',
          icon: '👤',
          title: '用户列表',
        },
        {
          key: '6',
          label: '权限管理',
          icon: '🔐',
          title: '权限管理',
        },
      ],
    },
    {
      key: 'sub3',
      label: '系统设置',
      icon: '⚙️',
      title: '系统设置',
      children: [
        {
          key: '7',
          label: '基础配置',
          icon: '🔧',
          title: '基础配置',
        },
        {
          key: '8',
          label: '安全设置',
          icon: '🛡️',
          title: '安全设置',
        },
        {
          key: 'sub4',
          label: '高级设置',
          icon: '🔬',
          title: '高级设置',
          children: [
            {
              key: '9',
              label: '系统监控',
              icon: '📈',
              title: '系统监控',
            },
            {
              key: '10',
              label: '日志管理',
              icon: '📝',
              title: '日志管理',
            },
          ],
        },
      ],
    },
  ];

  // 带分组的导航数据
  const groupedItems: NavItemType[] = [
    {
      key: 'group1',
      type: 'group',
      label: '工作空间',
      children: [
        {
          key: '1',
          label: '我的项目',
          icon: '📁',
          title: '我的项目',
        },
        {
          key: '2',
          label: '团队项目',
          icon: '👥',
          title: '团队项目',
        },
        {
          key: '3',
          label: '最近访问',
          icon: '🕒',
          title: '最近访问',
        },
      ],
    },
    {
      key: 'divider1',
      type: 'divider',
    },
    {
      key: 'group2',
      type: 'group',
      label: '管理中心',
      children: [
        {
          key: '4',
          label: '用户管理',
          icon: '👤',
          title: '用户管理',
        },
        {
          key: '5',
          label: '权限控制',
          icon: '🔐',
          title: '权限控制',
        },
        {
          key: 'sub1',
          label: '系统配置',
          icon: '⚙️',
          title: '系统配置',
          children: [
            {
              key: '6',
              label: '基础设置',
              icon: '🔧',
              title: '基础设置',
            },
            {
              key: '7',
              label: '高级设置',
              icon: '🔬',
              title: '高级设置',
            },
          ],
        },
      ],
    },
  ];

  const handleSelect = (info: any) => {
    console.log('Selected:', info);
    setSelectedKeys(info.selectedKeys);
  };

  const handleOpenChange = (keys: string[]) => {
    console.log('Open keys changed:', keys);
    setOpenKeys(keys);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '32px',
          fontWeight: '600',
          color: '#262626',
        }}
      >
        Nav 导航组件演示
      </h1>

      {/* 基础导航 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>基础导航</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '260px',
              minHeight: '300px',
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            <Nav items={basicItems} selectedKeys={['1']} onSelect={info => console.log('Basic nav selected:', info)} />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            <div>
              <h3>简单的导航菜单</h3>
              <p>适用于简单的页面导航场景</p>
            </div>
          </div>
        </div>
      </div>

      {/* 嵌套导航 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>嵌套子菜单</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '260px',
              minHeight: '400px',
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            <Nav
              items={nestedItems}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onSelect={handleSelect}
              onOpenChange={handleOpenChange}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3>多级导航菜单</h3>
              <p>支持无限层级的子菜单嵌套</p>
            </div>
            <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px' }}>
              <h4>当前状态：</h4>
              <p>
                <strong>选中项：</strong> {selectedKeys.join(', ')}
              </p>
              <p>
                <strong>展开项：</strong> {openKeys.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 收起状态 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>收起状态</h2>
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {collapsed ? '展开菜单' : '收起菜单'}
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: collapsed ? '80px' : '260px',
              minHeight: '400px',
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9',
              transition: 'width 0.3s ease',
            }}
          >
            <Nav
              items={nestedItems}
              collapsed={collapsed}
              selectedKeys={['2']}
              defaultOpenKeys={['sub1']}
              onSelect={info => console.log('Collapsed nav selected:', info)}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
            }}
          >
            <div>
              <h3>收起模式</h3>
              <p>适用于需要更多内容空间的场景</p>
              <p>收起时显示图标，hover 显示完整标题</p>
            </div>
          </div>
        </div>
      </div>

      {/* 分组导航 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>分组导航</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '260px',
              minHeight: '400px',
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            <Nav
              items={groupedItems}
              selectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              onSelect={info => console.log('Grouped nav selected:', info)}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
            }}
          >
            <div>
              <h3>分组和分割线</h3>
              <p>使用分组和分割线来组织复杂的导航结构</p>
              <p>支持 group 类型的分组标题和 divider 类型的分割线</p>
            </div>
          </div>
        </div>
      </div>

      {/* 样式演示 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>自定义样式</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '260px',
              minHeight: '300px',
              background: '#001529',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            <Nav
              items={basicItems}
              selectedKeys={['2']}
              className='dark-nav'
              style={{ background: '#001529' }}
              onSelect={info => console.log('Dark nav selected:', info)}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
            }}
          >
            <div>
              <h3>深色主题</h3>
              <p>通过自定义 className 和 style 实现深色主题</p>
              <p>可以配合 CSS 变量进行主题定制</p>
            </div>
          </div>
        </div>
      </div>

      {/* 禁用状态 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>禁用状态</h2>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '260px',
              minHeight: '300px',
              background: '#fafafa',
              borderRight: '1px solid #d9d9d9',
            }}
          >
            <Nav
              items={[
                {
                  key: '1',
                  label: '正常选项',
                  icon: '✅',
                  title: '正常选项',
                },
                {
                  key: '2',
                  label: '禁用选项',
                  icon: '❌',
                  title: '禁用选项',
                  disabled: true,
                },
                {
                  key: 'sub1',
                  label: '部分禁用',
                  icon: '⚠️',
                  title: '部分禁用',
                  children: [
                    {
                      key: '3',
                      label: '可用子项',
                      icon: '✅',
                      title: '可用子项',
                    },
                    {
                      key: '4',
                      label: '禁用子项',
                      icon: '❌',
                      title: '禁用子项',
                      disabled: true,
                    },
                  ],
                },
              ]}
              selectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              onSelect={info => console.log('Disabled nav selected:', info)}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: '20px',
            }}
          >
            <div>
              <h3>禁用状态</h3>
              <p>某些菜单项可以设置为禁用状态</p>
              <p>禁用的菜单项不可点击，样式变灰</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavDemo;
