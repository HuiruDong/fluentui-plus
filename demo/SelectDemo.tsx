import React, { useState } from 'react';
import { Select } from '../src/components';
import type { Option } from '../src/components/Select/types';

interface SelectDemoProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<SelectDemoProps> = ({ title, description, children }) => (
  <section style={{ marginBottom: '30px' }}>
    <h3 style={{ marginBottom: '8px', color: '#1890ff', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
    {description && <p style={{ marginBottom: '12px', color: '#666', fontSize: '14px' }}>{description}</p>}
    <div style={{ marginBottom: '12px' }}>{children}</div>
  </section>
);

export const SelectDemo: React.FC = () => {
  // 基础选项数据
  const basicOptions: Option[] = [
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
    { value: 'grape', label: '葡萄' },
    { value: 'watermelon', label: '西瓜' },
  ];

  // 城市选项数据
  const cityOptions: Option[] = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' },
    { value: 'hangzhou', label: '杭州' },
    { value: 'nanjing', label: '南京' },
    { value: 'chengdu', label: '成都' },
    { value: 'wuhan', label: '武汉' },
  ];

  // 禁用选项数据
  const disabledOptions: Option[] = [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2', disabled: true },
    { value: 'option3', label: '选项3' },
    { value: 'option4', label: '选项4', disabled: true },
    { value: 'option5', label: '选项5' },
  ];

  // 大量数据选项
  const largeDataOptions: Option[] = Array.from({ length: 50 }, (_, index) => ({
    value: `item${index + 1}`,
    label: `选项 ${index + 1}`,
  }));

  // 状态管理
  const [basicValue, setBasicValue] = useState<string | number | undefined>(undefined);
  const [multipleValue, setMultipleValue] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState<string | number | undefined>(undefined);
  const [customValue, setCustomValue] = useState<string | number | undefined>(undefined);
  const [controlledOpen, setControlledOpen] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Option[]>(basicOptions);
  const [searchInput, setSearchInput] = useState<string>('');

  // 事件处理函数
  const handleBasicChange = (
    value: string | number | (string | number)[],
    selectedOptions: Option | Option[] | null
  ) => {
    setBasicValue(value as string | number);
    console.log('Basic select changed:', value, selectedOptions);
  };

  const handleMultipleChange = (
    value: string | number | (string | number)[],
    selectedOptions: Option | Option[] | null
  ) => {
    setMultipleValue(value as (string | number)[]);
    console.log('Multiple select changed:', value, selectedOptions);
  };

  const handleSearchChange = (
    value: string | number | (string | number)[],
    selectedOptions: Option | Option[] | null
  ) => {
    setSearchValue(value as string | number);
    console.log('Search select changed:', value, selectedOptions);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    console.log('Search input:', value);
  };

  // 自定义过滤函数
  const customFilterOption = (input: string, option: Option) => {
    return (
      (option.label?.toLowerCase() || '').includes(input.toLowerCase()) ||
      (option.value?.toString().toLowerCase() || '').includes(input.toLowerCase())
    );
  };

  // 自定义选项渲染
  const customOptionRender = (option: Option) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{option.label}</span>
      <span style={{ fontSize: '12px', color: '#999' }}>值: {option.value}</span>
    </div>
  );

  // 自定义弹窗渲染
  const customPopupRender = (originNode: React.ReactNode) => (
    <div>
      <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', fontSize: '12px', color: '#666' }}>
        自定义头部
      </div>
      {originNode}
      <div style={{ padding: '8px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#666' }}>
        总共 {dynamicOptions.length} 个选项
      </div>
    </div>
  );

  // 动态添加选项
  const addDynamicOption = () => {
    const newOption: Option = {
      value: `dynamic${Date.now()}`,
      label: `动态选项 ${dynamicOptions.length + 1}`,
    };
    setDynamicOptions([...dynamicOptions, newOption]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '32px', fontWeight: '600', color: '#262626' }}>
        Select 选择器组件完整功能演示
      </h1>

      <DemoSection title='基础选择器' description='最基本的选择器用法，支持单选功能'>
        <div style={{ width: '200px' }}>
          <Select placeholder='请选择水果' options={basicOptions} value={basicValue} onChange={handleBasicChange} />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          当前选中: {basicValue ? JSON.stringify(basicValue) : '未选择'}
        </div>
      </DemoSection>

      <DemoSection title='多选模式' description='支持选择多个选项，已选项以标签形式展示'>
        <div style={{ width: '300px' }}>
          <Select
            placeholder='请选择多个城市'
            options={cityOptions}
            value={multipleValue}
            onChange={handleMultipleChange}
            multiple={true}
          />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          当前选中: {multipleValue.length > 0 ? JSON.stringify(multipleValue) : '未选择'}
        </div>
      </DemoSection>

      <DemoSection title='可搜索选择器' description='支持输入关键词搜索过滤选项'>
        <div style={{ width: '250px' }}>
          <Select
            placeholder='搜索并选择城市'
            options={cityOptions}
            value={searchValue}
            onChange={handleSearchChange}
            showSearch={true}
            onSearch={handleSearch}
            filterOption={customFilterOption}
          />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          搜索关键词: "{searchInput}" | 选中值: {searchValue || '未选择'}
        </div>
      </DemoSection>

      <DemoSection title='多选 + 搜索' description='结合多选和搜索功能的选择器'>
        <div style={{ width: '400px' }}>
          <Select
            placeholder='搜索并选择多个城市'
            options={cityOptions}
            value={multipleValue}
            onChange={handleMultipleChange}
            multiple={true}
            showSearch={true}
            onSearch={handleSearch}
          />
        </div>
      </DemoSection>

      <DemoSection title='带禁用选项' description='部分选项处于禁用状态，无法选择'>
        <div style={{ width: '200px' }}>
          <Select
            placeholder='包含禁用选项'
            options={disabledOptions}
            onChange={(value, options) => console.log('Disabled demo:', value, options)}
          />
        </div>
      </DemoSection>

      <DemoSection title='禁用状态' description='整个选择器处于禁用状态'>
        <div style={{ width: '200px' }}>
          <Select placeholder='禁用的选择器' options={basicOptions} disabled={true} defaultValue='apple' />
        </div>
      </DemoSection>

      <DemoSection title='自定义选项渲染' description='自定义每个选项的显示内容和样式'>
        <div style={{ width: '250px' }}>
          <Select
            placeholder='自定义选项样式'
            options={basicOptions}
            optionRender={customOptionRender}
            onChange={(value, options) => console.log('Custom render:', value, options)}
          />
        </div>
      </DemoSection>

      <DemoSection title='自定义弹窗内容' description='自定义下拉弹窗的整体布局'>
        <div style={{ width: '200px' }}>
          <Select
            placeholder='自定义弹窗'
            options={dynamicOptions}
            value={customValue}
            onChange={value => setCustomValue(value as string | number)}
            popupRender={customPopupRender}
          />
        </div>
        <button
          onClick={addDynamicOption}
          style={{
            marginLeft: '12px',
            padding: '4px 8px',
            fontSize: '12px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          添加选项
        </button>
      </DemoSection>

      <DemoSection title='受控展开状态' description='通过代码控制下拉框的展开和收起'>
        <div style={{ width: '200px' }}>
          <Select
            placeholder='受控展开状态'
            options={basicOptions}
            open={controlledOpen}
            onChange={(value, options) => console.log('Controlled open:', value, options)}
          />
        </div>
        <button
          onClick={() => setControlledOpen(!controlledOpen)}
          style={{
            marginLeft: '12px',
            padding: '4px 8px',
            fontSize: '12px',
            background: controlledOpen ? '#52c41a' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {controlledOpen ? '收起' : '展开'}
        </button>
      </DemoSection>

      <DemoSection title='大数据量' description='处理大量选项的选择器，支持虚拟滚动'>
        <div style={{ width: '200px' }}>
          <Select
            placeholder='选择一个选项'
            options={largeDataOptions}
            showSearch={true}
            listHeight={200}
            onChange={(value, options) => console.log('Large data:', value, options)}
          />
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>共有 {largeDataOptions.length} 个选项</div>
      </DemoSection>

      <DemoSection title='自定义高度' description='设置下拉列表的最大高度'>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 100px</div>
            <div style={{ width: '150px' }}>
              <Select placeholder='高度100' options={cityOptions} listHeight={100} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 200px</div>
            <div style={{ width: '150px' }}>
              <Select placeholder='高度200' options={cityOptions} listHeight={200} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 300px</div>
            <div style={{ width: '150px' }}>
              <Select placeholder='高度300' options={cityOptions} listHeight={300} />
            </div>
          </div>
        </div>
      </DemoSection>

      <DemoSection title='默认值设置' description='设置选择器的默认选中值'>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>单选默认值</div>
            <div style={{ width: '150px' }}>
              <Select placeholder='已有默认值' options={basicOptions} defaultValue='banana' />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>多选默认值</div>
            <div style={{ width: '200px' }}>
              <Select
                placeholder='多选默认值'
                options={cityOptions}
                defaultValue={['beijing', 'shanghai']}
                multiple={true}
              />
            </div>
          </div>
        </div>
      </DemoSection>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#262626' }}>使用场景示例</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>表单场景</h4>
            <Select placeholder='选择所在城市' options={cityOptions} style={{ width: '100%' }} />
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>筛选场景</h4>
            <Select
              placeholder='筛选状态'
              options={[
                { value: 'all', label: '全部' },
                { value: 'pending', label: '待处理' },
                { value: 'processing', label: '处理中' },
                { value: 'completed', label: '已完成' },
              ]}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>配置场景</h4>
            <Select
              placeholder='选择主题'
              options={[
                { value: 'light', label: '浅色主题' },
                { value: 'dark', label: '深色主题' },
                { value: 'auto', label: '跟随系统' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDemo;
