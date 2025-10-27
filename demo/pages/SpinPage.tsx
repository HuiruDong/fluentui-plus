import React, { useState } from 'react';
import { makeStyles, Button, Switch, Label } from '@fluentui/react-components';
import { Spin } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// SpinPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  spinContainer: {
    padding: '24px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nestedContainer: {
    padding: '24px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
});

const SpinPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  const [spinning, setSpinning] = useState(true);
  const [nestedSpinning, setNestedSpinning] = useState(false);
  const [fullscreenSpinning, setFullscreenSpinning] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Spin 加载中</div>
        <div className={styles.description}>用于页面和区块的加载中状态。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的加载状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础加载</div>
          <div className={styles.demo}>
            <Spin />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>不同尺寸</div>
        <div className={styles.sectionDescription}>通过 size 属性设置不同的加载图标尺寸。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>尺寸大小</div>
          <div className={styles.demo}>
            <Spin size='tiny' />
            <Spin size='extra-small' />
            <Spin size='small' />
            <Spin size='medium' />
            <Spin size='large' />
            <Spin size='extra-large' />
            <Spin size='huge' />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义描述文案</div>
        <div className={styles.sectionDescription}>通过 tip 属性添加加载提示文字。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>带文案</div>
          <div className={styles.spinContainer}>
            <Spin tip='加载中...' size='large' />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>嵌套模式</div>
        <div className={styles.sectionDescription}>可以嵌套在任何元素中，为其增加加载效果。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>包裹内容</div>
          <div className={styles.controlRow}>
            <Label>加载状态：</Label>
            <Switch checked={nestedSpinning} onChange={(_, data) => setNestedSpinning(data.checked)} />
          </div>
          <Spin spinning={nestedSpinning} tip='加载中...'>
            <div className={styles.nestedContainer}>
              <h3 style={{ marginBottom: '12px', color: '#1f2937' }}>卡片内容</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                这是一段示例内容。当加载状态开启时，会显示半透明遮罩层和加载图标。
              </p>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginTop: '8px' }}>
                用户可以看到内容，但无法与之交互，直到加载完成。
              </p>
            </div>
          </Spin>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>延迟显示</div>
        <div className={styles.sectionDescription}>
          延迟显示 loading 效果，避免闪烁。当 spinning 状态在 delay 时间内结束，则不显示加载状态。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>延迟显示</div>
          <div className={styles.controlRow}>
            <Button onClick={() => setSpinning(!spinning)}>切换加载状态</Button>
          </div>
          <div className={styles.spinContainer}>
            <Spin spinning={spinning} delay={500} tip='延迟 500ms 显示' size='large' />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>全屏加载</div>
        <div className={styles.sectionDescription}>使用 fullscreen 属性可以显示全屏的加载状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>全屏模式</div>
          <Button appearance='primary' onClick={() => setFullscreenSpinning(true)}>
            显示全屏加载
          </Button>
          <Spin fullscreen spinning={fullscreenSpinning} tip='正在加载...' size='extra-large' />
          {fullscreenSpinning && (
            <Button appearance='primary' onClick={() => setFullscreenSpinning(false)} style={{ marginLeft: '12px' }}>
              关闭加载
            </Button>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Spin 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Spin</h3>
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
                <td style={apiTableStyles.tdStyle}>spinning</td>
                <td style={apiTableStyles.tdStyle}>是否为加载中状态</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>true</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>size</td>
                <td style={apiTableStyles.tdStyle}>组件大小</td>
                <td style={apiTableStyles.tdStyle}>
                  'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge'
                </td>
                <td style={apiTableStyles.tdStyle}>medium</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>tip</td>
                <td style={apiTableStyles.tdStyle}>自定义描述文案</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>delay</td>
                <td style={apiTableStyles.tdStyle}>延迟显示加载效果的时间（防止闪烁），单位：毫秒</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>0</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>fullscreen</td>
                <td style={apiTableStyles.tdStyle}>是否全屏展示</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>包裹的内容</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>className</td>
                <td style={apiTableStyles.tdStyle}>自定义样式类名</td>
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

export default SpinPage;
