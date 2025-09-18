import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Cascader } from '../../src';
import type { CascaderOption, CascaderValue } from '../../src';

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

const CascaderPage: React.FC = () => {
  const styles = useStyles();

  // 基础用法状态
  const [basicValue, setBasicValue] = useState<CascaderValue>([]);

  // 可搜索状态
  const [searchableValue, setSearchableValue] = useState<CascaderValue>([]);

  // 禁用状态
  const [disabledValue, setDisabledValue] = useState<CascaderValue>([]);

  // changeOnSelect 状态
  const [changeOnSelectValue, setChangeOnSelectValue] = useState<CascaderValue>([]);

  // 基础选项数据
  const basicOptions: CascaderOption[] = [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'haidian',
          label: '海淀区',
          children: [
            { value: 'zhongguancun', label: '中关村' },
            { value: 'wudaokou', label: '五道口' },
          ],
        },
        {
          value: 'chaoyang',
          label: '朝阳区',
          children: [
            { value: 'sanlitun', label: '三里屯' },
            { value: 'guomao', label: '国贸' },
          ],
        },
      ],
    },
    {
      value: 'shanghai',
      label: '上海',
      children: [
        {
          value: 'huangpu',
          label: '黄浦区',
          children: [
            { value: 'nanjingdonglu', label: '南京东路' },
            { value: 'waitan', label: '外滩' },
          ],
        },
        {
          value: 'pudong',
          label: '浦东新区',
          children: [
            { value: 'lujiazui', label: '陆家嘴' },
            { value: 'zhangjiang', label: '张江' },
          ],
        },
      ],
    },
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖区' },
            { value: 'gongshu', label: '拱墅区' },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            { value: 'haishu', label: '海曙区' },
            { value: 'jiangbei', label: '江北区' },
          ],
        },
      ],
    },
  ];

  // 带禁用选项的数据
  const disabledOptions: CascaderOption[] = [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'haidian',
          label: '海淀区',
          children: [
            { value: 'zhongguancun', label: '中关村' },
            { value: 'wudaokou', label: '五道口', disabled: true },
          ],
        },
        {
          value: 'chaoyang',
          label: '朝阳区（禁用）朝阳区（禁用）朝阳区（禁用）朝阳区（禁用）',
          disabled: true,
          children: [
            { value: 'sanlitun', label: '三里屯' },
            { value: 'guomao', label: '国贸' },
          ],
        },
      ],
    },
    {
      value: 'shanghai',
      label: '上海',
      children: [
        {
          value: 'huangpu',
          label: '黄浦区',
          children: [
            { value: 'nanjingdonglu', label: '南京东路' },
            { value: 'waitan', label: '外滩' },
          ],
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Cascader 级联选择</div>
        <div className={styles.description}>级联选择框，用于多层级数据的选择，典型场景如省市区选择。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，默认点击选中叶子节点。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础级联选择</div>
          <div className={styles.demo}>
            <Cascader
              value={basicValue}
              onChange={(value, selectedOptions) => {
                setBasicValue(value || []);
                console.log('Basic cascader change:', value, selectedOptions);
              }}
              options={basicOptions}
              placeholder='请选择地址'
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(basicValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>搜索行为对比 (changeOnSelect 影响)</div>
        <div className={styles.sectionDescription}>
          当 changeOnSelect 为 true 时，搜索结果包含所有匹配的路径层级；为 false 时，只显示叶子节点。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>搜索行为对比</div>
          <div className={styles.twoColumnDemo}>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>changeOnSelect=false (默认)</h4>
              <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                搜索"北京"只显示叶子节点：中关村、五道口、三里屯、国贸
              </p>
              <Cascader
                value={searchableValue}
                onChange={value => setSearchableValue(value || [])}
                options={basicOptions}
                placeholder='搜索地址 (只显示叶子节点)'
                showSearch
                changeOnSelect={false}
              />
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>changeOnSelect=true</h4>
              <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                搜索"北京"显示所有层级：北京、北京/海淀区、北京/海淀区/中关村等
              </p>
              <Cascader
                value={changeOnSelectValue}
                onChange={value => setChangeOnSelectValue(value || [])}
                options={basicOptions}
                placeholder='搜索地址 (显示所有层级)'
                showSearch
                changeOnSelect={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>可搜索</div>
        <div className={styles.sectionDescription}>通过设置 showSearch 属性开启搜索功能，支持搜索选项路径。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可搜索级联选择</div>
          <div className={styles.demo}>
            <Cascader
              value={searchableValue}
              onChange={value => setSearchableValue(value || [])}
              options={basicOptions}
              placeholder='搜索地址'
              showSearch
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(searchableValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>选择即改变</div>
        <div className={styles.sectionDescription}>通过设置 changeOnSelect 为 true，可以允许选择任意一级。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>选择即改变</div>
          <div className={styles.demo}>
            <Cascader
              value={changeOnSelectValue}
              onChange={value => setChangeOnSelectValue(value || [])}
              options={basicOptions}
              placeholder='可选择任意级别'
              changeOnSelect
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(changeOnSelectValue)}</div>
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
              <Cascader
                value={disabledValue}
                onChange={value => setDisabledValue(value || [])}
                options={basicOptions}
                placeholder='禁用状态'
                disabled
                allowClear
              />
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>禁用特定选项</h4>
              <Cascader
                value={[]}
                onChange={value => console.log('Disabled options change:', value)}
                options={disabledOptions}
                placeholder='部分选项禁用'
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>清除功能</div>
        <div className={styles.sectionDescription}>通过设置 allowClear 属性可以显示清除按钮。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>可清除级联选择</div>
          <div className={styles.demo}>
            <Cascader
              value={basicValue}
              onChange={value => setBasicValue(value || [])}
              options={basicOptions}
              placeholder='可清除选择'
              allowClear
              onClear={() => console.log('Cascader cleared')}
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(basicValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Cascader 组件支持的所有参数配置。</div>
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
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>CascaderValue</td>
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
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>级联选项数据</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>CascaderOption[]</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>[]</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>placeholder</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>选择框默认文字</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>showSearch</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否可搜索</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>changeOnSelect</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否允许选择任意一级</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>disabled</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否禁用</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>allowClear</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否显示清除按钮</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>expandTrigger</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>展开方式</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'click' | 'hover'</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'click'</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CascaderPage;
