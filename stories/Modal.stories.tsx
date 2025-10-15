import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@fluentui/react-components';
import { Modal } from '../src/components';

const meta: Meta<typeof Modal> = {
  title: '反馈/Modal 对话框',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '对话框组件，用于在页面上显示重要信息、确认操作或收集用户输入。支持自定义内容、底部按钮和静态方法调用。基于 FluentUI 设计系统，提供企业级的用户体验。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '对话框是否可见',
    },
    title: {
      control: 'text',
      description: '对话框标题',
    },
    okText: {
      control: 'text',
      description: '确认按钮文本',
    },
    okType: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'subtle', 'transparent'],
      description: '确认按钮类型',
    },
    closable: {
      control: 'boolean',
      description: '是否显示关闭按钮',
    },
    mask: {
      control: 'boolean',
      description: '是否显示遮罩层',
    },
    footer: {
      description: '自定义底部内容',
    },
    onOk: {
      action: 'onOk',
      description: '点击确定按钮的回调',
    },
    onCancel: {
      action: 'onCancel',
      description: '点击取消按钮或关闭按钮的回调',
    },
  },
  args: {
    title: '对话框标题',
    okText: '确定',
    okType: 'primary',
    closable: true,
    mask: true,
    children: '这是对话框的内容。',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  render: args => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>打开对话框</Button>
        <Modal {...args} open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
          这是一个基础的对话框示例。点击确定或取消按钮可以关闭对话框。
        </Modal>
      </div>
    );
  },
};

// 自定义内容
export const CustomContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>显示自定义内容</Button>
        <Modal title='用户信息' open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>用户名：</label>
              <input
                type='text'
                placeholder='请输入用户名'
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>邮箱地址：</label>
              <input
                type='email'
                placeholder='请输入邮箱地址'
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>个人简介：</label>
              <textarea
                placeholder='请输入个人简介'
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

// 无底部按钮
export const NoFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>无底部按钮</Button>
        <Modal title='提示信息' open={open} footer={null} onCancel={() => setOpen(false)}>
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', marginBottom: '16px' }}>操作已成功完成！</div>
            <Button appearance='primary' onClick={() => setOpen(false)}>
              我知道了
            </Button>
          </div>
        </Modal>
      </div>
    );
  },
};

// 自定义底部
export const CustomFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
      setLoading(true);
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={() => setOpen(true)}>自定义底部</Button>
        <Modal
          title='确认提交'
          open={open}
          onCancel={() => setOpen(false)}
          footer={(originalNode, { OkBtn, CancelBtn }) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button appearance='subtle'>保存草稿</Button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CancelBtn />
                <Button appearance='primary' disabled={loading} onClick={handleOk}>
                  {loading ? '提交中...' : '确认提交'}
                </Button>
              </div>
            </div>
          )}
        >
          请确认是否要提交当前的表单数据？提交后将无法撤回。
        </Modal>
      </div>
    );
  },
};

// 不可关闭
export const NotClosable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>不可关闭的对话框</Button>
        <Modal
          title='重要提示'
          open={open}
          closable={false}
          okText='我已阅读'
          onOk={() => setOpen(false)}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>这是一个重要的系统通知，请仔细阅读以下内容：</p>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>系统将在今晚 23:00 进行维护升级</li>
              <li>维护期间服务将暂时不可用</li>
              <li>预计维护时间为 2 小时</li>
              <li>请提前保存您的工作内容</li>
            </ul>
            <p style={{ marginTop: '16px', color: '#fa8c16', fontWeight: 'bold' }}>
              点击"我已阅读"按钮确认您已了解此通知。
            </p>
          </div>
        </Modal>
      </div>
    );
  },
};

// 静态方法示例
export const StaticMethods: Story = {
  render: () => {
    const showInfo = () => {
      Modal.info({
        title: '信息提示',
        content: '这是一条信息提示，用于向用户展示一般性的信息内容。',
        onOk: () => console.log('Info modal closed'),
      });
    };

    const showSuccess = () => {
      Modal.success({
        title: '操作成功',
        content: '您的操作已成功完成！数据已保存到系统中。',
        onOk: () => console.log('Success modal closed'),
      });
    };

    const showError = () => {
      Modal.error({
        title: '操作失败',
        content: '很抱歉，操作执行失败。请检查网络连接后重试。',
        onOk: () => console.log('Error modal closed'),
      });
    };

    const showWarning = () => {
      Modal.warning({
        title: '警告提示',
        content: '您即将执行一个可能有风险的操作，请谨慎考虑。',
        onOk: () => console.log('Warning modal closed'),
      });
    };

    const showConfirm = () => {
      Modal.confirm({
        title: '确认删除',
        content: '您确定要删除这条记录吗？删除后将无法恢复。',
        onOk: () => {
          console.log('Confirmed');
          return new Promise(resolve => {
            setTimeout(resolve, 1000);
          });
        },
        onCancel: () => console.log('Cancelled'),
      });
    };

    return (
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={showInfo}>信息提示</Button>
        <Button onClick={showSuccess}>成功提示</Button>
        <Button onClick={showError}>错误提示</Button>
        <Button onClick={showWarning}>警告提示</Button>
        <Button onClick={showConfirm}>确认对话框</Button>
      </div>
    );
  },
};

// 无遮罩层
export const NoMask: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>无遮罩层对话框</Button>
        <Modal title='无遮罩层' open={open} mask={false} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
          这个对话框没有遮罩层，您可以与页面上的其他元素进行交互。
        </Modal>
      </div>
    );
  },
};

// 长内容
export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const longContent = `
      这是一个包含大量文本内容的对话框示例。在实际应用中，您可能需要显示详细的说明文档、用户协议、隐私政策等长文本内容。

      第一段：Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

      第二段：Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      第三段：Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

      第四段：Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

      第五段：Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
    `;

    return (
      <div>
        <Button onClick={() => setOpen(true)}>长内容对话框</Button>
        <Modal
          title='服务条款'
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          style={{ top: '50px' }}
        >
          <div style={{ maxHeight: '400px', overflow: 'auto', lineHeight: '1.6' }}>
            {longContent.split('\n').map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} style={{ marginBottom: '16px' }}>
                    {paragraph.trim()}
                  </p>
                )
            )}
          </div>
        </Modal>
      </div>
    );
  },
};

// 企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      department: '',
      employee: '',
      reason: '',
      urgency: 'normal',
    });

    const closeModal = () => setCurrentModal(null);

    // 审批流程对话框
    const ApprovalModal = () => (
      <Modal
        title='提交审批申请'
        open={currentModal === 'approval'}
        onOk={closeModal}
        onCancel={closeModal}
        okText='提交申请'
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>申请部门：</label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value=''>请选择部门</option>
              <option value='tech'>技术部</option>
              <option value='hr'>人力资源部</option>
              <option value='finance'>财务部</option>
              <option value='marketing'>市场部</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>申请人：</label>
            <input
              type='text'
              value={formData.employee}
              onChange={e => setFormData({ ...formData, employee: e.target.value })}
              placeholder='请输入申请人姓名'
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>申请事由：</label>
            <textarea
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
              placeholder='请详细说明申请事由'
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>紧急程度：</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { value: 'low', label: '一般' },
                { value: 'normal', label: '普通' },
                { value: 'high', label: '紧急' },
                { value: 'urgent', label: '特急' },
              ].map(option => (
                <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type='radio'
                    name='urgency'
                    value={option.value}
                    checked={formData.urgency === option.value}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    );

    // 数据删除确认对话框
    const DeleteConfirmModal = () => (
      <Modal
        title='确认删除数据'
        open={currentModal === 'delete'}
        onOk={() => {
          Modal.success({
            title: '删除成功',
            content: '选中的数据已成功删除。',
          });
          closeModal();
        }}
        onCancel={closeModal}
        okText='确认删除'
        okType='primary'
      >
        <div style={{ padding: '16px 0' }}>
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '4px',
            }}
          >
            <strong style={{ color: '#fa8c16' }}>⚠️ 重要提示</strong>
            <p style={{ margin: '8px 0 0', color: '#8c5704' }}>
              此操作将永久删除以下数据，且无法恢复。请确认您真的要继续执行此操作。
            </p>
          </div>
          <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>即将删除的数据：</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>用户记录：3 条</li>
              <li>订单记录：12 条</li>
              <li>关联文件：8 个</li>
              <li>历史日志：45 条</li>
            </ul>
          </div>
        </div>
      </Modal>
    );

    // 系统维护通知
    const MaintenanceModal = () => (
      <Modal
        title='系统维护通知'
        open={currentModal === 'maintenance'}
        closable={false}
        onOk={closeModal}
        okText='我已了解'
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', color: '#faad14', marginBottom: '8px' }}>🔧</div>
            <h3 style={{ margin: 0, color: '#262626' }}>系统维护通知</h3>
          </div>
          <div
            style={{
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <h4 style={{ margin: '0 0 12px', color: '#389e0d' }}>维护信息</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#52c41a' }}>
              <p>
                <strong>维护时间：</strong>2025年10月15日 02:00 - 04:00
              </p>
              <p>
                <strong>影响范围：</strong>全系统功能暂时不可用
              </p>
              <p>
                <strong>维护内容：</strong>数据库升级、安全补丁更新
              </p>
            </div>
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <p>
              <strong>温馨提示：</strong>
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>请在维护开始前保存您的工作内容</li>
              <li>维护期间无法访问系统任何功能</li>
              <li>如有紧急情况，请联系系统管理员</li>
              <li>维护完成后系统将自动恢复服务</li>
            </ul>
          </div>
        </div>
      </Modal>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
        <div>
          <h3>企业级应用场景</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={() => setCurrentModal('approval')}>审批申请</Button>
            <Button onClick={() => setCurrentModal('delete')}>删除确认</Button>
            <Button onClick={() => setCurrentModal('maintenance')}>系统通知</Button>
          </div>
        </div>

        <div>
          <h3>静态方法调用</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button
              onClick={() =>
                Modal.confirm({
                  title: '权限确认',
                  content: '您确定要将此用户的权限提升为管理员吗？',
                  onOk: () => console.log('权限已提升'),
                })
              }
            >
              权限确认
            </Button>
            <Button
              onClick={() =>
                Modal.info({
                  title: '操作指南',
                  content: '首次使用系统，建议您先阅读操作指南以便更好地使用各项功能。',
                })
              }
            >
              操作指南
            </Button>
            <Button
              onClick={() =>
                Modal.warning({
                  title: '数据同步警告',
                  content: '检测到您的本地数据与服务器数据不一致，建议立即同步以避免数据丢失。',
                })
              }
            >
              同步警告
            </Button>
          </div>
        </div>

        <ApprovalModal />
        <DeleteConfirmModal />
        <MaintenanceModal />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
