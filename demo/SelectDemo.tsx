import React, { useState } from 'react';
import { Select } from '@/components';
import type { Option } from '@/components/Select/types';

const SelectDemo: React.FC = () => {
  const [value, setValue] = useState<string | number>();

  const options: Option[] = [
    { value: 'option1', label: '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3', disabled: true },
    { value: 'option4', label: '选项4', title: '这是选项4的提示' },
  ];

  const handleChange = (value: string | number, option: Option) => {
    console.log('Selected:', value, option);
    setValue(value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Select 组件示例</h3>

      <div style={{ marginBottom: '20px' }}>
        <h4>基础用法</h4>
        <Select placeholder='请选择选项' options={options} style={{ width: '200px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>受控模式</h4>
        <Select
          value={value}
          placeholder='请选择选项'
          options={options}
          onChange={handleChange}
          style={{ width: '200px' }}
        />
        <p>当前值: {value}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>默认值</h4>
        <Select defaultValue='option2' options={options} style={{ width: '200px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>禁用状态</h4>
        <Select disabled value='option1' options={options} style={{ width: '200px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>自定义列表高度</h4>
        <Select
          listHeight={400}
          options={[
            ...options,
            { value: 'option5', label: '选项5' },
            { value: 'option6', label: '选项6' },
            { value: 'option7', label: '选项7选项7选项7选项7选项7选项7选项7选项7选项7选项7选项7' },
          ]}
          style={{ width: '200px' }}
          placeholder='请选择'
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>自定义选项渲染 (optionRender)</h4>
        <Select
          options={options}
          style={{ width: '250px' }}
          placeholder='请选择'
          optionRender={option => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                background: option.disabled ? '#f5f5f5' : 'transparent',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: option.disabled ? '#ccc' : '#0078d4',
                  marginRight: '8px',
                }}
              />
              <span
                style={{
                  fontWeight: option.value === 'option1' ? 'bold' : 'normal',
                  color: option.disabled ? '#999' : '#000',
                }}
              >
                {option.label}
              </span>
              {option.value === 'option1' && (
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '12px',
                    color: '#0078d4',
                    fontWeight: 'normal',
                  }}
                >
                  (推荐)
                </span>
              )}
            </div>
          )}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>自定义弹窗内容 (popupRender)</h4>
        <Select
          options={options}
          style={{ width: '250px' }}
          placeholder='请选择'
          popupRender={originNode => (
            <div>
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #e0e0e0',
                  background: '#f8f9fa',
                  fontSize: '12px',
                  color: '#666',
                }}
              >
                共 {options.length} 个选项
              </div>
              {originNode}
              <div
                style={{
                  padding: '8px 12px',
                  borderTop: '1px solid #e0e0e0',
                  background: '#f8f9fa',
                  fontSize: '12px',
                  color: '#666',
                  textAlign: 'center',
                }}
              >
                <a href='#' style={{ color: '#0078d4', textDecoration: 'none' }}>
                  查看更多选项
                </a>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SelectDemo;
