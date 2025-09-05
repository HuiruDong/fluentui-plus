import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Tag } from '../../src';

const useStyles = makeStyles({
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1f2937',
  },
  description: {
    fontSize: '18px',
    color: '#6b7280',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '48px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937',
  },
  sectionDescription: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  demoContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
  },
  demoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  },
  demo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
});

const TagPage: React.FC = () => {
  const styles = useStyles();
  const [checkedTags, setCheckedTags] = useState<Record<string, boolean>>({
    tag1: true,
    tag2: false,
    tag3: true,
  });

  const handleCheckableTagChange = (key: string, checked: boolean) => {
    setCheckedTags(prev => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Tag 标签</div>
        <div className={styles.description}>用于标记和选择的标签组件，支持多种样式和交互模式。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，通过 children 设置标签内容。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础标签</div>
          <div className={styles.demo}>
            <Tag>标签一</Tag>
            <Tag>标签二</Tag>
            <Tag>标签三</Tag>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>彩色标签</div>
        <div className={styles.sectionDescription}>我们添加了多种预设颜色的标签样式，可以通过 color 属性来设置。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>不同颜色的标签</div>
          <div className={styles.demo}>
            <Tag>默认</Tag>
            <Tag color='#1890ff'>蓝色</Tag>
            <Tag color='#52c41a'>绿色</Tag>
            <Tag color='#fa8c16'>橙色</Tag>
            <Tag color='#f5222d'>红色</Tag>
            <Tag color='#722ed1'>紫色</Tag>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>可关闭的标签</div>
        <div className={styles.sectionDescription}>通过设置 closeIcon 属性可以设置标签为可关闭状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可关闭标签</div>
          <div className={styles.demo}>
            <Tag closeIcon onClose={() => console.log('关闭标签1')}>
              可关闭标签1
            </Tag>
            <Tag closeIcon color='#1890ff' onClose={() => console.log('关闭标签2')}>
              可关闭标签2
            </Tag>
            <Tag closeIcon color='#52c41a' onClose={() => console.log('关闭标签3')}>
              可关闭标签3
            </Tag>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>可选择的标签</div>
        <div className={styles.sectionDescription}>
          CheckableTag 是一个可选择的标签组件，类似复选框。点击切换选中状态。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可选择标签</div>
          <div className={styles.demo}>
            <Tag.CheckableTag
              checked={checkedTags.tag1}
              onChange={checked => handleCheckableTagChange('tag1', checked)}
            >
              标签1
            </Tag.CheckableTag>
            <Tag.CheckableTag
              checked={checkedTags.tag2}
              onChange={checked => handleCheckableTagChange('tag2', checked)}
            >
              标签2
            </Tag.CheckableTag>
            <Tag.CheckableTag
              checked={checkedTags.tag3}
              onChange={checked => handleCheckableTagChange('tag3', checked)}
            >
              标签3
            </Tag.CheckableTag>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>边框样式</div>
        <div className={styles.sectionDescription}>可以通过 bordered 属性控制标签是否显示边框。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>边框样式</div>
          <div className={styles.demo}>
            <Tag>默认标签</Tag>
            <Tag bordered={false}>无边框标签</Tag>
            <Tag color='#1890ff'>有边框蓝色标签</Tag>
            <Tag color='#1890ff' bordered={false}>
              无边框蓝色标签
            </Tag>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Tag 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>Tag</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>参数</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>说明</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>类型</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>children</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签内容</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ReactNode</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>closeIcon</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>设置标签的关闭图标</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean | ReactNode</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>color</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签颜色</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>bordered</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否有边框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>true</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>className</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>自定义样式类名</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>style</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>自定义样式</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>CSSProperties</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onClose</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>关闭时的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(e: MouseEvent) =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onClick</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>点击时的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(e: MouseEvent) =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Tag.CheckableTag
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>参数</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>说明</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>类型</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>默认值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>children</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签内容</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ReactNode</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>checked</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>设置标签的选中状态</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onChange</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>点击标签时的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(checked: boolean) =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>color</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签颜色</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>bordered</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否有边框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>true</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>className</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>自定义样式类名</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>style</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>自定义样式</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>CSSProperties</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
