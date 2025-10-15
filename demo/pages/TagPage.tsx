import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Tag } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// TagPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
});

const TagPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };
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
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>标签内容</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>closeIcon</td>
                <td style={apiTableStyles.tdStyle}>设置标签的关闭图标</td>
                <td style={apiTableStyles.tdStyle}>boolean | ReactNode</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>color</td>
                <td style={apiTableStyles.tdStyle}>标签颜色</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>bordered</td>
                <td style={apiTableStyles.tdStyle}>是否有边框</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>true</td>
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
              <tr>
                <td style={apiTableStyles.tdStyle}>onClose</td>
                <td style={apiTableStyles.tdStyle}>关闭时的回调</td>
                <td style={apiTableStyles.tdStyle}>(e: MouseEvent) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onClick</td>
                <td style={apiTableStyles.tdStyle}>点击时的回调</td>
                <td style={apiTableStyles.tdStyle}>(e: MouseEvent) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Tag.CheckableTag
          </h3>
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
                <td style={apiTableStyles.tdStyle}>children</td>
                <td style={apiTableStyles.tdStyle}>标签内容</td>
                <td style={apiTableStyles.tdStyle}>ReactNode</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>checked</td>
                <td style={apiTableStyles.tdStyle}>设置标签的选中状态</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onChange</td>
                <td style={apiTableStyles.tdStyle}>点击标签时的回调</td>
                <td style={apiTableStyles.tdStyle}>(checked: boolean) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>color</td>
                <td style={apiTableStyles.tdStyle}>标签颜色</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>bordered</td>
                <td style={apiTableStyles.tdStyle}>是否有边框</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>true</td>
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

export default TagPage;
