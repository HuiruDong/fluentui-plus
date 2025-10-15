import React, { useState } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { Checkbox } from '../../src';

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
    alignItems: 'flex-start',
  },
  demoRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

// 受控模式示例组件
const ControlledGroupExample: React.FC = () => {
  const [checkedList, setCheckedList] = useState<(string | number)[]>(['apple']);

  const options = [
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana' },
    { label: '橙子', value: 'orange' },
    { label: '葡萄', value: 'grape' },
  ];

  const handleChange = (values: (string | number)[]) => {
    setCheckedList(values);
  };

  const handleCheckAll = () => {
    setCheckedList(options.map(option => option.value));
  };

  const handleUncheckAll = () => {
    setCheckedList([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleCheckAll}
          style={{
            marginRight: '8px',
            padding: '4px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          全选
        </button>
        <button
          onClick={handleUncheckAll}
          style={{
            marginRight: '16px',
            padding: '4px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          取消全选
        </button>
        <span>已选中: {checkedList.join(', ')}</span>
      </div>
      <Checkbox.Group layout='horizontal' options={options} value={checkedList} onChange={handleChange} />
    </div>
  );
};

const CheckboxPage: React.FC = () => {
  const styles = useStyles();

  // 基础用法状态
  const [basicChecked, setBasicChecked] = useState(false);
  const [basicWithLabelChecked, setBasicWithLabelChecked] = useState(true);

  // indeterminate 状态演示
  const [indeterminateChecked, setIndeterminateChecked] = useState(false);
  const [indeterminateUnchecked, setIndeterminateUnchecked] = useState(false);
  const [normalChecked, setNormalChecked] = useState(true);
  const [normalUnchecked, setNormalUnchecked] = useState(false);

  // 全选示例
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectAllIndeterminate, setSelectAllIndeterminate] = useState(false);
  const [options, setOptions] = useState([
    { id: 1, label: '选项 1', checked: false },
    { id: 2, label: '选项 2', checked: true },
    { id: 3, label: '选项 3', checked: false },
  ]);

  // 处理全选逻辑
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAllChecked(checked);
    setSelectAllIndeterminate(false);
    setOptions(prev => prev.map(option => ({ ...option, checked })));
  };

  // 处理单项选择逻辑
  const handleOptionChange = (id: number, checked: boolean) => {
    const newOptions = options.map(option => (option.id === id ? { ...option, checked } : option));
    setOptions(newOptions);

    const checkedCount = newOptions.filter(option => option.checked).length;
    const totalCount = newOptions.length;

    if (checkedCount === 0) {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(false);
    } else if (checkedCount === totalCount) {
      setSelectAllChecked(true);
      setSelectAllIndeterminate(false);
    } else {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(true);
    }
  };

  // 初始化全选状态
  React.useEffect(() => {
    const checkedCount = options.filter(option => option.checked).length;
    const totalCount = options.length;

    if (checkedCount === 0) {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(false);
    } else if (checkedCount === totalCount) {
      setSelectAllChecked(true);
      setSelectAllIndeterminate(false);
    } else {
      setSelectAllChecked(false);
      setSelectAllIndeterminate(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Checkbox 复选框</div>
        <div className={styles.description}>
          基于 Fluent UI Checkbox 的二次封装，支持 children 内容和 indeterminate 半选中状态。
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，支持通过 children 设置标签内容。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础复选框</div>
          <div className={styles.demo}>
            <div className={styles.demoRow}>
              <Checkbox checked={basicChecked} onChange={setBasicChecked} />
              <span>无标签复选框 (checked: {basicChecked.toString()})</span>
            </div>
            <div className={styles.demoRow}>
              <Checkbox checked={basicWithLabelChecked} onChange={setBasicWithLabelChecked}>
                有标签的复选框
              </Checkbox>
              <span>(checked: {basicWithLabelChecked.toString()})</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Indeterminate 半选中状态</div>
        <div className={styles.sectionDescription}>
          通过 indeterminate 属性控制半选中样式。indeterminate 仅负责样式控制，选中状态仍由 checked 属性控制。
          <br />
          • indeterminate=true, checked=true: 选中状态
          <br />
          • indeterminate=true, checked=false: 半选中状态
          <br />
          • indeterminate=false, checked=true: 选中状态
          <br />• indeterminate=false, checked=false: 未选中状态
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Indeterminate 状态演示</div>
          <div className={styles.demo}>
            <div className={styles.demoRow}>
              <Checkbox checked={indeterminateChecked} indeterminate={true} onChange={setIndeterminateChecked}>
                Indeterminate + Checked: {indeterminateChecked.toString()}
              </Checkbox>
              <span>(显示: {indeterminateChecked ? '选中' : '半选中'})</span>
            </div>
            <div className={styles.demoRow}>
              <Checkbox checked={indeterminateUnchecked} indeterminate={true} onChange={setIndeterminateUnchecked}>
                Indeterminate + Unchecked: {indeterminateUnchecked.toString()}
              </Checkbox>
              <span>(显示: {indeterminateUnchecked ? '选中' : '半选中'})</span>
            </div>
            <div className={styles.demoRow}>
              <Checkbox checked={normalChecked} indeterminate={false} onChange={setNormalChecked}>
                Normal + Checked: {normalChecked.toString()}
              </Checkbox>
              <span>(显示: {normalChecked ? '选中' : '未选中'})</span>
            </div>
            <div className={styles.demoRow}>
              <Checkbox checked={normalUnchecked} indeterminate={false} onChange={setNormalUnchecked}>
                Normal + Unchecked: {normalUnchecked.toString()}
              </Checkbox>
              <span>(显示: {normalUnchecked ? '选中' : '未选中'})</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>全选功能示例</div>
        <div className={styles.sectionDescription}>
          结合 indeterminate 状态实现全选功能，当部分选中时显示半选中状态。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>全选示例</div>
          <div className={styles.demo}>
            <div className={styles.demoRow}>
              <Checkbox
                checked={selectAllChecked}
                indeterminate={selectAllIndeterminate}
                onChange={handleSelectAllChange}
              >
                全选 ({options.filter(o => o.checked).length}/{options.length})
              </Checkbox>
            </div>
            <div style={{ paddingLeft: '24px' }}>
              {options.map(option => (
                <div key={option.id} className={styles.demoRow}>
                  <Checkbox checked={option.checked} onChange={checked => handleOptionChange(option.id, checked)}>
                    {option.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>标签位置</div>
        <div className={styles.sectionDescription}>
          通过 labelPosition 属性控制标签相对于复选框的位置。支持 'before'（标签在前）和 'after'（标签在后，默认）。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>标签位置示例</div>
          <div className={styles.demo}>
            <div className={styles.demoRow}>
              <Checkbox labelPosition='after' checked>
                标签在后 (默认)
              </Checkbox>
            </div>
            <div className={styles.demoRow}>
              <Checkbox labelPosition='before' checked>
                标签在前
              </Checkbox>
            </div>
            <div className={styles.demoRow}>
              <Checkbox labelPosition='after'>标签在后 - 未选中</Checkbox>
            </div>
            <div className={styles.demoRow}>
              <Checkbox labelPosition='before'>标签在前 - 未选中</Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>通过 disabled 属性设置复选框的禁用状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用状态</div>
          <div className={styles.demo}>
            <div className={styles.demoRow}>
              <Checkbox disabled>禁用未选中</Checkbox>
              <Checkbox disabled checked>
                禁用已选中
              </Checkbox>
              <Checkbox disabled indeterminate>
                禁用半选中
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Checkbox.Group 复选框组</div>
        <div className={styles.sectionDescription}>
          复选框组件，用于多选场景。支持受控和非受控模式，可以设置默认选中值和布局方向。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础用法</div>
          <div className={styles.demo}>
            <Checkbox.Group
              options={[
                { label: '苹果', value: 'apple' },
                { label: '香蕉', value: 'banana' },
                { label: '橙子', value: 'orange' },
              ]}
              defaultValue={['apple']}
              onChange={value => console.log('基础用法选中值:', value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>水平布局</div>
        <div className={styles.sectionDescription}>
          通过 layout 属性设置布局方向。默认为垂直布局，可设置为水平布局。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>水平布局示例</div>
          <div className={styles.demo}>
            <Checkbox.Group
              layout='horizontal'
              options={[
                { label: '苹果', value: 'apple' },
                { label: '香蕉', value: 'banana' },
                { label: '橙子', value: 'orange' },
                { label: '葡萄', value: 'grape' },
              ]}
              defaultValue={['apple', 'orange']}
              onChange={value => console.log('水平布局选中值:', value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>受控模式</div>
        <div className={styles.sectionDescription}>
          通过 value 和 onChange 属性实现受控模式，可以通过外部状态控制选中状态。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>受控模式示例</div>
          <div className={styles.demo}>
            <ControlledGroupExample />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Group 标签位置</div>
        <div className={styles.sectionDescription}>
          通过 options 中的 labelPosition 属性控制单个选项的标签位置。支持 'before'（标签在前）和
          'after'（标签在后，默认）。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Group 标签位置示例</div>
          <div className={styles.demo}>
            <Checkbox.Group
              layout='vertical'
              options={[
                { label: '标签在后（默认）', value: 'after', labelPosition: 'after' },
                { label: '标签在前', value: 'before', labelPosition: 'before' },
                { label: '混合样式 - 标签在前', value: 'mixed1', labelPosition: 'before' },
                { label: '混合样式 - 标签在后', value: 'mixed2', labelPosition: 'after' },
              ]}
              defaultValue={['after', 'before']}
              onChange={value => console.log('标签位置示例选中值:', value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>禁用状态</div>
        <div className={styles.sectionDescription}>
          通过 disabled 属性可以禁用整个组，也可以通过 options 中的 disabled 属性禁用单个选项。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>禁用状态示例</div>
          <div className={styles.demo}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '12px', fontWeight: '500' }}>整体禁用:</div>
              <Checkbox.Group
                disabled
                layout='horizontal'
                options={[
                  { label: '苹果', value: 'apple' },
                  { label: '香蕉', value: 'banana' },
                  { label: '橙子', value: 'orange' },
                ]}
                defaultValue={['apple']}
              />
            </div>
            <div>
              <div style={{ marginBottom: '12px', fontWeight: '500' }}>部分禁用:</div>
              <Checkbox.Group
                layout='horizontal'
                options={[
                  { label: '苹果', value: 'apple' },
                  { label: '香蕉（禁用）', value: 'banana', disabled: true },
                  { label: '橙子', value: 'orange' },
                  { label: '葡萄（禁用）', value: 'grape', disabled: true },
                ]}
                defaultValue={['apple', 'banana']}
                onChange={value => console.log('部分禁用选中值:', value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Checkbox 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Checkbox 参数</div>
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>复选框标签内容</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ReactNode</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>checked</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>指定当前是否选中</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>defaultChecked</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>初始是否选中</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onChange</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>变化时回调函数</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(checked: boolean) =&gt; void</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>indeterminate</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>设置半选中状态，仅负责样式控制</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>disabled</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>失效状态</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>labelPosition</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标签位置</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'before' | 'after'</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'after'</td>
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
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Checkbox.Group 参数</div>
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
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>options</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>指定可选项</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Option[]</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>[]</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>value</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>指定选中的选项（受控模式）</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(string | number)[]</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>defaultValue</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>默认选中的选项</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>(string | number)[]</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>[]</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onChange</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>选项变化时的回调函数</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                    (checkedValue: (string | number)[]) =&gt; void
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>disabled</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>整组失效</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>layout</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>布局方向</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'vertical' | 'horizontal'</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>'vertical'</td>
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
            <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
              <strong>Option 类型定义:</strong>
              <pre style={{ backgroundColor: '#f9fafb', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
                {`interface Option {
  label: string;                    // 选项显示文本
  value: string | number;           // 选项值
  disabled?: boolean;               // 是否禁用此选项
  labelPosition?: 'before' | 'after'; // 标签位置，默认 'after'
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckboxPage;
