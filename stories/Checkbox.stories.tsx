import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../src/components';

const meta: Meta<typeof Checkbox> = {
  title: '数据录入/Checkbox 复选框',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '复选框用于在一组选项中进行多项选择，或者表示两种状态（选中/未选中）之间的切换。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '是否选中',
    },
    defaultChecked: {
      control: 'boolean',
      description: '初始是否选中',
    },
    indeterminate: {
      control: 'boolean',
      description: '设置 indeterminate 状态，只负责样式控制',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    labelPosition: {
      control: 'radio',
      options: ['before', 'after'],
      description: '文本位置',
    },
    children: {
      control: 'text',
      description: '复选框文本',
    },
  },
  args: {
    children: '复选框',
    labelPosition: 'after',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    children: '默认复选框',
  },
};

// 受控组件
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <Checkbox checked={checked} onChange={setChecked}>
        受控复选框 ({checked ? '已选中' : '未选中'})
      </Checkbox>
    );
  },
};

// 默认选中
export const DefaultChecked: Story = {
  args: {
    children: '默认选中',
    defaultChecked: true,
  },
};

// 禁用状态
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox disabled>禁用状态</Checkbox>
      <Checkbox disabled defaultChecked>
        禁用且选中
      </Checkbox>
      <Checkbox disabled indeterminate>
        禁用且半选
      </Checkbox>
    </div>
  ),
};

// 不确定状态
export const Indeterminate: Story = {
  render: () => {
    const [checkedList, setCheckedList] = React.useState(['Apple']);

    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
    const checkAll = checkedList.length === plainOptions.length;

    const onCheckAllChange = (checked: boolean) => {
      setCheckedList(checked ? plainOptions : []);
    };

    const onChange = (list: (string | number)[]) => {
      setCheckedList(list as string[]);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          全选
        </Checkbox>
        <div style={{ paddingLeft: '24px' }}>
          <Checkbox.Group
            options={plainOptions.map(item => ({ label: item, value: item }))}
            value={checkedList}
            onChange={onChange}
          />
        </div>
      </div>
    );
  },
};

// 文本位置
export const LabelPosition: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox labelPosition='after'>文本在后</Checkbox>
      <Checkbox labelPosition='before'>文本在前</Checkbox>
    </div>
  ),
};

// 复选框组 - 基础用法
export const Group: Story = {
  render: () => {
    const options = [
      { label: '苹果', value: 'apple' },
      { label: '橙子', value: 'orange' },
      { label: '香蕉', value: 'banana' },
      { label: '梨子', value: 'pear' },
    ];

    const [value, setValue] = React.useState<(string | number)[]>(['apple']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h4>选中的值：{JSON.stringify(value)}</h4>
        </div>
        <Checkbox.Group options={options} value={value} onChange={setValue} />
      </div>
    );
  },
};

// 复选框组 - 水平布局
export const GroupHorizontal: Story = {
  render: () => {
    const options = [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ];

    return <Checkbox.Group options={options} defaultValue={['react', 'vue']} layout='horizontal' />;
  },
};

// 复选框组 - 标签位置
export const GroupLabelPosition: Story = {
  render: () => {
    const options = [
      { label: '标签在后（默认）', value: 'default', labelPosition: 'after' as const },
      { label: '标签在前', value: 'before', labelPosition: 'before' as const },
      { label: '混合样式 - 后', value: 'mixed1', labelPosition: 'after' as const },
      { label: '混合样式 - 前', value: 'mixed2', labelPosition: 'before' as const },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h4>Group 中不同的标签位置</h4>
          <Checkbox.Group options={options} defaultValue={['default', 'before']} />
        </div>
        <div>
          <h4>水平布局下的标签位置</h4>
          <Checkbox.Group options={options.slice(0, 3)} defaultValue={['default', 'before']} layout='horizontal' />
        </div>
      </div>
    );
  },
};

// 复选框组 - 禁用选项
export const GroupWithDisabled: Story = {
  render: () => {
    const options = [
      { label: '选项 A', value: 'A' },
      { label: '选项 B（禁用）', value: 'B', disabled: true },
      { label: '选项 C', value: 'C' },
      { label: '选项 D（禁用）', value: 'D', disabled: true },
    ];

    return <Checkbox.Group options={options} defaultValue={['A', 'B']} />;
  },
};

// 复选框组 - 全部禁用
export const GroupAllDisabled: Story = {
  render: () => {
    const options = [
      { label: '选项 1', value: '1' },
      { label: '选项 2', value: '2' },
      { label: '选项 3', value: '3' },
    ];

    return <Checkbox.Group options={options} defaultValue={['1', '3']} disabled />;
  },
};

// 复选框组 - 垂直和水平布局对比
export const GroupLayouts: Story = {
  render: () => {
    const options = [
      { label: '选项 A', value: 'A' },
      { label: '选项 B', value: 'B' },
      { label: '选项 C', value: 'C' },
      { label: '选项 D', value: 'D' },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h4>垂直布局（默认）</h4>
          <Checkbox.Group options={options} defaultValue={['A', 'C']} layout='vertical' />
        </div>
        <div>
          <h4>水平布局</h4>
          <Checkbox.Group options={options} defaultValue={['A', 'C']} layout='horizontal' />
        </div>
      </div>
    );
  },
};

// 企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px' }}>
      <div>
        <h3>权限管理</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Checkbox defaultChecked>查看权限</Checkbox>
          <Checkbox defaultChecked>编辑权限</Checkbox>
          <Checkbox>删除权限</Checkbox>
          <Checkbox disabled>管理员权限（需要特殊授权）</Checkbox>
        </div>
      </div>

      <div>
        <h3>通知设置</h3>
        <Checkbox.Group
          options={[
            { label: '邮件通知', value: 'email' },
            { label: '短信通知', value: 'sms' },
            { label: '微信通知', value: 'wechat' },
            { label: '系统通知', value: 'system' },
            { label: '桌面通知', value: 'desktop' },
          ]}
          defaultValue={['email', 'system']}
          layout='horizontal'
        />
      </div>

      <div>
        <h3>数据筛选</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h4>状态筛选</h4>
            <Checkbox.Group
              options={[
                { label: '进行中', value: 'progress' },
                { label: '已完成', value: 'completed' },
                { label: '已暂停', value: 'paused' },
                { label: '已取消', value: 'cancelled' },
              ]}
              defaultValue={['progress', 'completed']}
            />
          </div>
          <div>
            <h4>类型筛选</h4>
            <Checkbox.Group
              options={[
                { label: '任务', value: 'task' },
                { label: '缺陷', value: 'bug' },
                { label: '需求', value: 'requirement' },
                { label: '改进', value: 'improvement' },
              ]}
              defaultValue={['task', 'bug']}
            />
          </div>
        </div>
      </div>

      <div>
        <h3>批量操作</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Checkbox indeterminate>全选（3/5 项已选中）</Checkbox>
          <div style={{ paddingLeft: '24px' }}>
            <Checkbox.Group
              options={[
                { label: '项目 A', value: 'a' },
                { label: '项目 B', value: 'b' },
                { label: '项目 C', value: 'c' },
                { label: '项目 D（已锁定）', value: 'd', disabled: true },
                { label: '项目 E', value: 'e' },
              ]}
              defaultValue={['a', 'b', 'c']}
            />
          </div>
        </div>
      </div>

      <div>
        <h3>表单验证场景</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Checkbox>我已阅读并同意《用户协议》</Checkbox>
          <Checkbox>我已阅读并同意《隐私政策》</Checkbox>
          <Checkbox defaultChecked>订阅产品更新通知</Checkbox>
        </div>
      </div>

      <div>
        <h3>多级选择</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Checkbox indeterminate>所有部门</Checkbox>
          <div style={{ paddingLeft: '20px' }}>
            <Checkbox defaultChecked>技术部</Checkbox>
            <div style={{ paddingLeft: '20px' }}>
              <Checkbox.Group
                options={[
                  { label: '前端组', value: 'frontend' },
                  { label: '后端组', value: 'backend' },
                  { label: 'DevOps 组', value: 'devops' },
                ]}
                defaultValue={['frontend', 'backend']}
                layout='horizontal'
              />
            </div>
            <Checkbox>产品部</Checkbox>
            <div style={{ paddingLeft: '20px' }}>
              <Checkbox.Group
                options={[
                  { label: '产品组', value: 'product' },
                  { label: '运营组', value: 'operation' },
                ]}
                layout='horizontal'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// 自定义样式
export const CustomStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox style={{ fontSize: '14px' }}>默认大小</Checkbox>
      <Checkbox style={{ fontSize: '16px', fontWeight: 'bold' }}>大号字体</Checkbox>
      <Checkbox style={{ color: '#1890ff' }}>自定义颜色</Checkbox>
      <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
        <Checkbox defaultChecked>背景色区域中的复选框</Checkbox>
      </div>
    </div>
  ),
};

// 交互示例
export const Interactive: Story = {
  render: () => {
    const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>({
      item1: false,
      item2: true,
      item3: false,
    });

    const [groupValue, setGroupValue] = React.useState<(string | number)[]>(['option1']);

    const handleSingleChange = (key: string, checked: boolean) => {
      setCheckedItems(prev => ({
        ...prev,
        [key]: checked,
      }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4>单个复选框交互</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox checked={checkedItems.item1} onChange={checked => handleSingleChange('item1', checked)}>
              选项 1 ({checkedItems.item1 ? '已选中' : '未选中'})
            </Checkbox>
            <Checkbox checked={checkedItems.item2} onChange={checked => handleSingleChange('item2', checked)}>
              选项 2 ({checkedItems.item2 ? '已选中' : '未选中'})
            </Checkbox>
            <Checkbox checked={checkedItems.item3} onChange={checked => handleSingleChange('item3', checked)}>
              选项 3 ({checkedItems.item3 ? '已选中' : '未选中'})
            </Checkbox>
          </div>
        </div>

        <div>
          <h4>复选框组交互</h4>
          <p>当前选中: {JSON.stringify(groupValue)}</p>
          <Checkbox.Group
            options={[
              { label: '选项 A', value: 'option1' },
              { label: '选项 B', value: 'option2' },
              { label: '选项 C', value: 'option3' },
              { label: '选项 D', value: 'option4' },
            ]}
            value={groupValue}
            onChange={setGroupValue}
            layout='horizontal'
          />
        </div>

        <div>
          <h4>实时统计</h4>
          <p>单个复选框选中数量: {Object.values(checkedItems).filter(Boolean).length}/3</p>
          <p>复选框组选中数量: {groupValue.length}/4</p>
        </div>
      </div>
    );
  },
};
