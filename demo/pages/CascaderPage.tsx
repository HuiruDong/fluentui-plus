import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Cascader } from '../../src';
import type { CascaderOption, CascaderValue, CascaderMultipleValue } from '../../src';
import { useCommonDemoStyles, useApiTableStyles } from '../hooks';

// CascaderPage 特有样式
const useCustomStyles = makeStyles({
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '300px',
  },
});

const CascaderPage: React.FC = () => {
  const commonStyles = useCommonDemoStyles();
  const customStyles = useCustomStyles();
  const apiTableStyles = useApiTableStyles();

  // 合并通用样式和特有样式
  const styles = {
    ...commonStyles,
    ...customStyles,
  };

  // 基础用法状态
  const [basicValue, setBasicValue] = useState<CascaderValue>([]);

  // 可搜索状态
  const [searchableValue, setSearchableValue] = useState<CascaderValue>([]);

  // 禁用状态
  const [disabledValue, setDisabledValue] = useState<CascaderValue>([]);

  // changeOnSelect 状态
  const [changeOnSelectValue, setChangeOnSelectValue] = useState<CascaderValue>([]);

  // expandTrigger 状态
  const [clickTriggerValue, setClickTriggerValue] = useState<CascaderValue>([]);
  const [hoverTriggerValue, setHoverTriggerValue] = useState<CascaderValue>([]);

  // 多选模式状态
  const [multipleValue, setMultipleValue] = useState<CascaderMultipleValue>([]);
  const [multipleSearchValue, setMultipleSearchValue] = useState<CascaderMultipleValue>([]);

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
          label: '朝阳区（禁用）',
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
                setBasicValue((value as CascaderValue) || []);
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
                onChange={value => setSearchableValue((value as CascaderValue) || [])}
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
                onChange={value => setChangeOnSelectValue((value as CascaderValue) || [])}
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
        <div className={styles.sectionTitle}>展开触发方式</div>
        <div className={styles.sectionDescription}>
          通过 expandTrigger
          控制有子节点的选项的展开方式：点击展开（click）或悬停展开（hover）。注意：最终选择行为始终通过点击完成。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>展开触发方式对比</div>
          <div className={styles.twoColumnDemo}>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>点击展开（click）</h4>
              <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                默认方式，需要点击有子节点的选项才会展开下一级，点击叶子节点进行选择
              </p>
              <Cascader
                value={clickTriggerValue}
                onChange={value => setClickTriggerValue((value as CascaderValue) || [])}
                options={basicOptions}
                placeholder='点击展开下级选项'
                expandTrigger='click'
              />
              <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(clickTriggerValue)}</div>
            </div>
            <div>
              <h4 style={{ marginBottom: '12px', color: '#374151' }}>悬停展开（hover）</h4>
              <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                悬停有子节点的选项即可展开下一级，但选择仍需点击。叶子节点悬停不会被选中
              </p>
              <Cascader
                value={hoverTriggerValue}
                onChange={value => setHoverTriggerValue((value as CascaderValue) || [])}
                options={basicOptions}
                placeholder='悬停展开下级选项'
                expandTrigger='hover'
              />
              <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(hoverTriggerValue)}</div>
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
              onChange={value => setSearchableValue((value as CascaderValue) || [])}
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
              onChange={value => setChangeOnSelectValue((value as CascaderValue) || [])}
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
                onChange={value => setDisabledValue((value as CascaderValue) || [])}
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
        <div className={styles.sectionTitle}>多选模式</div>
        <div className={styles.sectionDescription}>
          通过设置 multiple 属性启用多选模式，支持父子节点关联选择和半选状态。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多选级联选择</div>
          <div className={styles.demo}>
            <Cascader
              value={multipleValue}
              onChange={(value, selectedOptions) => {
                setMultipleValue((value as CascaderMultipleValue) || []);
                console.log('Multiple cascader change:', value, selectedOptions);
              }}
              options={basicOptions}
              placeholder='请选择地址（多选）'
              multiple
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(multipleValue)}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>多选 + 搜索</div>
        <div className={styles.sectionDescription}>
          多选模式下支持搜索功能，可以快速定位和选择选项。自定义 labelRender 用于控制每个标签的显示文本。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>多选 + 搜索级联选择</div>
          <div className={styles.demo}>
            <Cascader
              value={multipleSearchValue}
              onChange={(value, selectedOptions) => {
                setMultipleSearchValue((value as CascaderMultipleValue) || []);
                console.log('Multiple search cascader change:', value, selectedOptions);
              }}
              options={basicOptions}
              placeholder='搜索并选择地址（多选）'
              multiple
              showSearch
              labelRender={option => `${option.label}（自定义）`}
            />
            <div className={styles.valueDisplay}>当前选中值: {JSON.stringify(multipleSearchValue)}</div>
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
              onChange={value => setBasicValue((value as CascaderValue) || [])}
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
                <td style={apiTableStyles.tdStyle}>CascaderValue</td>
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
                <td style={apiTableStyles.tdStyle}>级联选项数据</td>
                <td style={apiTableStyles.tdStyle}>CascaderOption[]</td>
                <td style={apiTableStyles.tdStyle}>[]</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>placeholder</td>
                <td style={apiTableStyles.tdStyle}>选择框默认文字</td>
                <td style={apiTableStyles.tdStyle}>string</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>showSearch</td>
                <td style={apiTableStyles.tdStyle}>是否可搜索</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>changeOnSelect</td>
                <td style={apiTableStyles.tdStyle}>是否允许选择任意一级</td>
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
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>expandTrigger</td>
                <td style={apiTableStyles.tdStyle}>有子节点选项的展开方式</td>
                <td style={apiTableStyles.tdStyle}>'click' | 'hover'</td>
                <td style={apiTableStyles.tdStyle}>'click'</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>multiple</td>
                <td style={apiTableStyles.tdStyle}>是否启用多选模式</td>
                <td style={apiTableStyles.tdStyle}>boolean</td>
                <td style={apiTableStyles.tdStyle}>false</td>
              </tr>
              <tr>
                <td style={apiTableStyles.tdStyle}>labelRender</td>
                <td style={apiTableStyles.tdStyle}>自定义标签渲染函数（多选模式）</td>
                <td style={apiTableStyles.tdStyle}>function</td>
                <td style={apiTableStyles.tdStyle}>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CascaderPage;
