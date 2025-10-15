import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { InputTag } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// InputTagPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
  },
});

const InputTagPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础用法状态
  const [basicTags, setBasicTags] = useState<string[]>(['React', 'TypeScript']);

  // 最大标签数量限制
  const [limitedTags, setLimitedTags] = useState<string[]>(['标签1', '标签2']);

  // 预设标签
  const [presetTags, setPresetTags] = useState<string[]>(['JavaScript', 'Vue']);

  // 禁用状态
  const [disabledTags, setDisabledTags] = useState<string[]>(['只读标签']);

  // 自定义分隔符
  const [separatorTags, setSeparatorTags] = useState<string[]>(['tag1', 'tag2']);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>InputTag 标签输入</div>
        <div className={styles.description}>允许用户输入和管理标签的组合型输入组件。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，用户可以输入文本并按 Enter 键添加标签。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础标签输入</div>
          <div className={styles.demo}>
            <InputTag value={basicTags} onChange={setBasicTags} placeholder='输入标签后按回车' />
            <div className={styles.valueDisplay}>当前标签: {JSON.stringify(basicTags)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>最大标签数量</div>
        <div className={styles.sectionDescription}>可以通过 maxTags 属性限制标签的最大数量。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>最多3个标签</div>
          <div className={styles.demo}>
            <InputTag value={limitedTags} onChange={setLimitedTags} placeholder='最多添加3个标签' maxTags={3} />
            <div className={styles.valueDisplay}>
              当前标签: {JSON.stringify(limitedTags)} ({limitedTags.length}/3)
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>预设标签</div>
        <div className={styles.sectionDescription}>可以设置一些预设的默认标签。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>带预设标签</div>
          <div className={styles.demo}>
            <InputTag value={presetTags} onChange={setPresetTags} placeholder='添加编程语言标签' />
            <div className={styles.valueDisplay}>当前标签: {JSON.stringify(presetTags)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>通过 disabled 属性可以禁用整个组件。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用状态</div>
          <div className={styles.demo}>
            <InputTag value={disabledTags} onChange={setDisabledTags} placeholder='禁用状态' disabled />
            <div className={styles.valueDisplay}>当前标签: {JSON.stringify(disabledTags)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义分隔符</div>
        <div className={styles.sectionDescription}>可以通过 delimiter 属性自定义分隔符，支持逗号等字符。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>逗号分隔</div>
          <div className={styles.demo}>
            <InputTag value={separatorTags} onChange={setSeparatorTags} placeholder='使用逗号分隔' delimiter=',' />
            <div className={styles.valueDisplay}>当前标签: {JSON.stringify(separatorTags)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>InputTag 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
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
                <td style={apiTableStyles.tdStyle}>value</td>
                <td style={apiTableStyles.tdStyle}>当前标签数组</td>
                <td style={apiTableStyles.tdStyle}>string[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onChange</td>
                <td style={apiTableStyles.tdStyle}>标签变化时的回调</td>
                <td style={apiTableStyles.tdStyle}>(tags: string[]) =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>placeholder</td>
                <td style={apiTableStyles.tdStyle}>输入框占位符</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>maxTags</td>
                <td style={apiTableStyles.tdStyle}>最大标签数量</td>
                <td style={apiTableStyles.tdStyle}>number</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>disabled</td>
                <td style={apiTableStyles.tdStyle}>是否禁用</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>delimiter</td>
                <td style={apiTableStyles.tdStyle}>分隔符</td>
                <td style={apiTableStyles.tdStyle}>string | RegExp</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InputTagPage;
