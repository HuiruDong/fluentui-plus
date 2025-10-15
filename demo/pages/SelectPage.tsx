import React, { useEffect, useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Select } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// 定义 Option 类型
type Option = {
  disabled?: boolean;
  title?: string;
  value?: string | number;
  label?: string;
};

// 定义 GroupOption 类型
type GroupOption = {
  label: string;
  options: Option[];
};

// SelectPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '300px',
  },
});

const SelectPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础用法状态
  const [basicValue, setBasicValue] = useState<string | number | undefined>('option2');

  // 多选状态
  const [multipleValue, setMultipleValue] = useState<(string | number)[]>(['option1', 'option3']);

  // 可搜索状态
  const [searchableValue, setSearchableValue] = useState<string | number | undefined>('');

  // 禁用状态
  const [disabledValue, setDisabledValue] = useState<string | number | undefined>('option1');

  // 自定义选项
  const [customValue, setCustomValue] = useState<string | number | undefined>('frontend');

  // labelRender 状态
  const [labelRenderValue, setLabelRenderValue] = useState<string | number | undefined>('user1');
  const [labelRenderMultipleValue, setLabelRenderMultipleValue] = useState<(string | number)[]>(['user1', 'user2']);

  // 清除功能状态
  const [clearableValue, setClearableValue] = useState<string | number | undefined>('option2');
  const [clearableMultipleValue, setClearableMultipleValue] = useState<(string | number)[]>(['option1', 'option3']);

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
  const groupedOptions: GroupOption[] = [
    {
      label: '技术栈',
      options: [
        { value: 'frontend', label: '前端开发' },
        { value: 'backend', label: '后端开发' },
        { value: 'mobile', label: '移动开发' },
      ],
    },
    {
      label: '设计',
      options: [
        { value: 'design', label: 'UI设计' },
        { value: 'ux', label: 'UX设计' },
      ],
    },
    {
      label: '产品',
      options: [
        { value: 'product', label: '产品经理' },
        { value: 'operation', label: '运营' },
      ],
    },
  ];

  // labelRender 示例选项
  const userOptions: Option[] = [
    { value: 'user1', label: 'John Doe', title: 'Senior Developer' },
    { value: 'user2', label: 'Jane Smith', title: 'Product Manager' },
    { value: 'user3', label: 'Bob Johnson', title: 'Designer' },
    { value: 'user4', label: 'Alice Wilson', title: 'Tech Lead' },
  ];

  // 自定义单选显示格式
  const singleLabelRender = (selectedOptions: Option | Option[] | null) => {
    if (!selectedOptions || Array.isArray(selectedOptions)) return '';
    return `${selectedOptions.label} (${selectedOptions.title})`;
  };

  // 自定义多选显示格式
  const multipleLabelRender = (selectedOptions: Option | Option[] | null) => {
    if (!selectedOptions) return '';
    if (!Array.isArray(selectedOptions)) {
      return `👤 ${selectedOptions.label}`;
    }
    return `${selectedOptions.length} users selected`;
  };

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
              onChange={value => setBasicValue(value as string | number | undefined)}
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
              onChange={value => setSearchableValue(value as string | number | undefined)}
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
                onChange={value => setDisabledValue(value as string | number | undefined)}
                options={basicOptions}
                placeholder='禁用状态'
                disabled
                allowClear
              />
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>禁用特定选项</h4>
              <Select
                value={undefined}
                onChange={value => console.log(value)}
                options={disabledOptions}
                placeholder='部分选项禁用'
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>清除功能</div>
        <div className={styles.sectionDescription}>
          通过设置 allowClear 属性可以显示清除按钮，点击清除按钮可以清空当前选中的内容。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可清除选择器</div>
          <div className={styles.twoColumnDemo}>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>单选模式清除</h4>
              <Select
                value={clearableValue}
                onChange={value => setClearableValue(value as string | number | undefined)}
                options={basicOptions}
                placeholder='请选择选项'
                allowClear
                onClear={() => console.log('单选清除按钮被点击')}
              />
              <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(clearableValue)}</div>
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>多选模式清除</h4>
              <Select
                value={clearableMultipleValue}
                onChange={value => setClearableMultipleValue(value as (string | number)[])}
                options={basicOptions}
                placeholder='请选择多个选项'
                multiple
                allowClear
                onClear={() => console.log('多选清除按钮被点击')}
              />
              <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(clearableMultipleValue)}</div>
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
              onChange={value => setCustomValue(value as string | number | undefined)}
              options={groupedOptions}
              placeholder='选择岗位类型'
              allowClear
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(customValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义标签显示 (labelRender)</div>
        <div className={styles.sectionDescription}>
          通过 labelRender 属性可以自定义选中项的显示格式，支持单选和多选模式。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>单选模式 - 显示格式：姓名 (职位)</div>
          <div className={styles.demo}>
            <Select
              value={labelRenderValue}
              onChange={value => setLabelRenderValue(value as string | number | undefined)}
              options={userOptions}
              labelRender={singleLabelRender}
              placeholder='选择用户'
              allowClear
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(labelRenderValue)}</div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多选模式 - 显示格式：👤 姓名</div>
          <div className={styles.demo}>
            <Select
              value={labelRenderMultipleValue}
              onChange={value => setLabelRenderMultipleValue(value as (string | number)[])}
              options={userOptions}
              multiple
              labelRender={multipleLabelRender}
              placeholder='选择多个用户'
              allowClear
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(labelRenderMultipleValue)}</div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>搜索模式 - labelRender 也影响搜索占位符</div>
          <div className={styles.demo}>
            <Select
              value={labelRenderValue}
              onChange={value => setLabelRenderValue(value as string | number | undefined)}
              options={userOptions}
              showSearch
              labelRender={singleLabelRender}
              placeholder='搜索用户'
              allowClear
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(labelRenderValue)}</div>
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>对比：默认显示（不使用 labelRender）</div>
          <div className={styles.demo}>
            <Select
              value={labelRenderValue}
              onChange={value => setLabelRenderValue(value as string | number | undefined)}
              options={userOptions}
              placeholder='选择用户（默认显示）'
              allowClear
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(labelRenderValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Select 组件支持的所有参数配置。</div>
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
                <td style={apiTableStyles.tdStyle}>当前选中的值</td>
                <td style={apiTableStyles.tdStyle}>string | number | array</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onChange</td>
                <td style={apiTableStyles.tdStyle}>选中值变化时的回调</td>
                <td style={apiTableStyles.tdStyle}>function</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>options</td>
                <td style={apiTableStyles.tdStyle}>选项数据</td>
                <td style={apiTableStyles.tdStyle}>Option[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>placeholder</td>
                <td style={apiTableStyles.tdStyle}>选择框默认文字</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>multiple</td>
                <td style={apiTableStyles.tdStyle}>支持多选</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showSearch</td>
                <td style={apiTableStyles.tdStyle}>是否可搜索</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>disabled</td>
                <td style={apiTableStyles.tdStyle}>是否禁用</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>allowClear</td>
                <td style={apiTableStyles.tdStyle}>是否显示清除按钮</td>
                <td style={apiTableStyles.tdStyle}>
                  boolean | {'{'} clearIcon?: ReactNode {'}'}
                </td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>onClear</td>
                <td style={apiTableStyles.tdStyle}>清除按钮点击回调</td>
                <td style={apiTableStyles.tdStyle}>() =&gt; void</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>labelRender</td>
                <td style={apiTableStyles.tdStyle}>自定义选中项显示内容</td>
                <td style={apiTableStyles.tdStyle}>(selectedOptions: Option | Option[] | null) =&gt; string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
