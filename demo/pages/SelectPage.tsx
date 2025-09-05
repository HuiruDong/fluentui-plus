import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Select } from '../../src';

// 定义 Option 类型
type Option = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
};

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
    maxWidth: '300px',
  },
  twoColumnDemo: {
    display: 'grid',
    gridTemplateColumns: '300px 300px',
    gap: '24px',
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

const SelectPage: React.FC = () => {
  const styles = useStyles();

  // 基础用法状态
  const [basicValue, setBasicValue] = useState<string | number>('option2');

  // 多选状态
  const [multipleValue, setMultipleValue] = useState<(string | number)[]>(['option1', 'option3']);

  // 可搜索状态
  const [searchableValue, setSearchableValue] = useState<string | number>('');

  // 禁用状态
  const [disabledValue, setDisabledValue] = useState<string | number>('option1');

  // 自定义选项
  const [customValue, setCustomValue] = useState<string | number>('option2');

  // 基础选项
  const basicOptions: Option[] = [
    { value: 'option1', label: '选项一' },
    { value: 'option2', label: '选项二' },
    { value: 'option3', label: '选项三' },
    { value: 'option4', label: '选项四' },
  ];

  // 带禁用的选项
  const disabledOptions: Option[] = [
    { value: 'option1', label: '选项一' },
    { value: 'option2', label: '选项二（禁用）', disabled: true },
    { value: 'option3', label: '选项三' },
    { value: 'option4', label: '选项四' },
  ];

  // 可搜索选项
  const searchableOptions: Option[] = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' },
    { value: 'hangzhou', label: '杭州' },
    { value: 'nanjing', label: '南京' },
    { value: 'wuhan', label: '武汉' },
    { value: 'chengdu', label: '成都' },
  ];

  // 分组选项
  const groupedOptions: Option[] = [
    { value: 'frontend', label: '前端开发', title: '技术栈' },
    { value: 'backend', label: '后端开发', title: '技术栈' },
    { value: 'mobile', label: '移动开发', title: '技术栈' },
    { value: 'design', label: 'UI设计', title: '设计' },
    { value: 'ux', label: 'UX设计', title: '设计' },
    { value: 'product', label: '产品经理', title: '产品' },
    { value: 'operation', label: '运营', title: '产品' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Select 选择器</div>
        <div className={styles.description}>下拉选择器，支持单选、多选和搜索功能。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，通过 options 数组配置选项。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础选择器</div>
          <div className={styles.demo}>
            <Select
              value={basicValue}
              onChange={value => setBasicValue(value as string)}
              options={basicOptions}
              placeholder='请选择选项'
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(basicValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>多选模式</div>
        <div className={styles.sectionDescription}>通过设置 multiple 属性开启多选模式。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多选选择器</div>
          <div className={styles.demo}>
            <Select
              value={multipleValue}
              onChange={value => setMultipleValue(value as (string | number)[])}
              options={basicOptions}
              placeholder='请选择多个选项'
              multiple
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(multipleValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>可搜索</div>
        <div className={styles.sectionDescription}>通过设置 showSearch 属性开启搜索功能。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可搜索选择器</div>
          <div className={styles.demo}>
            <Select
              value={searchableValue}
              onChange={value => setSearchableValue(value as string)}
              options={searchableOptions}
              placeholder='搜索城市'
              showSearch
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(searchableValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>
          通过 disabled 属性可以禁用整个组件，或者在选项中设置 disabled 禁用特定选项。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用状态对比</div>
          <div className={styles.twoColumnDemo}>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>禁用整个组件</h4>
              <Select
                value={disabledValue}
                onChange={value => setDisabledValue(value as string)}
                options={basicOptions}
                placeholder='禁用状态'
                disabled
              />
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>禁用特定选项</h4>
              <Select
                value=''
                onChange={value => console.log(value)}
                options={disabledOptions}
                placeholder='部分选项禁用'
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>分组选项</div>
        <div className={styles.sectionDescription}>通过 title 属性可以对选项进行分组显示。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>分组选择器</div>
          <div className={styles.demo}>
            <Select
              value={customValue}
              onChange={value => setCustomValue(value as string)}
              options={groupedOptions}
              placeholder='选择岗位类型'
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(customValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Select 组件支持的所有参数配置。</div>
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
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>当前选中的值</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string | number | array</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onChange</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>选中值变化时的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>function</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>options</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>选项数据</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Option[]</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>[]</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>placeholder</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>选择框默认文字</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>multiple</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>支持多选</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>showSearch</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否可搜索</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>disabled</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否禁用</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
