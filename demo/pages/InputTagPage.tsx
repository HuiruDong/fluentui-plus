import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { InputTag } from '../../src';

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
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
  },
  valueDisplay: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
  },
});

const InputTagPage: React.FC = () => {
  const styles = useStyles();

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
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>value</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>当前标签数组</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string[]</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>[]</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onChange</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签变化时的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(tags: string[]) =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>placeholder</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>输入框占位符</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>maxTags</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>最大标签数量</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>number</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>disabled</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否禁用</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>delimiter</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>分隔符</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string | RegExp</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InputTagPage;
