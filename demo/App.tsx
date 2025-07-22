import React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import TagDemo from './TagDemo';
import InputTagDemo from './InputTagDemo';
import NavDemo from './NavDemo';
import './reset.css';

const App = () => {
  const [currentDemo, setCurrentDemo] = React.useState<
    'tag' | 'inputTag' | 'nav' | 'select' | 'refactorTest' | 'overview'
  >('overview');

  const renderOverview = () => (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '32px', fontWeight: '600', color: '#262626' }}>
        FluentUI Plus 组件库演示
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: '#fff',
          }}
          onClick={() => setCurrentDemo('tag')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#1890ff';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#1890ff', fontSize: '18px', fontWeight: '600' }}>Tag 标签</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            用于标记和选择的标签组件，支持多种样式和交互方式。
          </p>
          <div style={{ marginTop: '15px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#f0f0f0',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              基础标签
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#e6f7ff',
                color: '#1890ff',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              可选择
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#fff1f0',
                color: '#ff4d4f',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              可关闭
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: '#fff',
          }}
          onClick={() => setCurrentDemo('inputTag')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#52c41a';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#52c41a', fontSize: '18px', fontWeight: '600' }}>
            InputTag 输入标签
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            支持用户输入和动态管理的标签组件，适用于标签编辑场景。
          </p>
          <div style={{ marginTop: '15px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#f6ffed',
                color: '#52c41a',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              动态输入
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#fff7e6',
                color: '#fa8c16',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              自定义分隔符
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#fff0f6',
                color: '#eb2f96',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              限制数量
            </span>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: '#fff',
          }}
          onClick={() => setCurrentDemo('nav')}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#722ed1';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#722ed1', fontSize: '18px', fontWeight: '600' }}>Nav 导航</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            功能丰富的导航组件，支持多级菜单、收起展开、分组等特性。
          </p>
          <div style={{ marginTop: '15px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#f9f0ff',
                color: '#722ed1',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              多级菜单
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#e6f7ff',
                color: '#1890ff',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '8px',
              }}
            >
              收起展开
            </span>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                background: '#f6ffed',
                color: '#52c41a',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              分组样式
            </span>
          </div>
        </div>
        {/* 预留其他组件的卡片 */}
        <div
          style={{
            padding: '20px',
            border: '1px dashed #d9d9d9',
            borderRadius: '8px',
            background: '#fafafa',
            color: '#999',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#666' }}>更多组件</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>敬请期待...</p>
        </div>
      </div>

      <div
        style={{
          background: '#f0f2f5',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: '600', color: '#262626' }}>快速开始</h3>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>点击上方卡片开始体验各个组件的功能</p>
        <div style={{ fontSize: '14px', color: '#999' }}>本演示页面展示了 FluentUI Plus 组件库的各种组件和功能</div>
      </div>
    </div>
  );

  return (
    <FluentProvider theme={webLightTheme}>
      {/* 导航栏 */}
      <nav
        style={{
          background: '#001529',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentDemo('overview')}
        >
          FluentUI Plus
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            style={{
              background: currentDemo === 'overview' ? '#1890ff' : 'transparent',
              color: '#fff',
              border: '1px solid #1890ff',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => setCurrentDemo('overview')}
          >
            概览
          </button>
          <button
            style={{
              background: currentDemo === 'tag' ? '#1890ff' : 'transparent',
              color: '#fff',
              border: '1px solid #1890ff',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => setCurrentDemo('tag')}
          >
            Tag 标签
          </button>
          <button
            style={{
              background: currentDemo === 'inputTag' ? '#52c41a' : 'transparent',
              color: '#fff',
              border: '1px solid #52c41a',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => setCurrentDemo('inputTag')}
          >
            InputTag 输入标签
          </button>
          <button
            style={{
              background: currentDemo === 'nav' ? '#722ed1' : 'transparent',
              color: '#fff',
              border: '1px solid #722ed1',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => setCurrentDemo('nav')}
          >
            Nav 导航
          </button>
        </div>
      </nav>

      {/* 内容区域 */}
      <main style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f5f5' }}>
        {currentDemo === 'overview' && renderOverview()}
        {currentDemo === 'tag' && <TagDemo />}
        {currentDemo === 'inputTag' && <InputTagDemo />}
        {currentDemo === 'nav' && <NavDemo />}
      </main>
    </FluentProvider>
  );
};

export default App;
