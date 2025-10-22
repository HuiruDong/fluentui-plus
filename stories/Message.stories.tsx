import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@fluentui/react-components';
import { message } from '../src/components';

// Message 是一个全局单例 API，不是 React 组件
// 我们创建一个包装组件用于 Storybook 演示
const MessageDemo: React.FC<{ type?: 'info' | 'success' | 'warning' | 'error' }> = ({ type = 'info' }) => {
  const handleClick = () => {
    switch (type) {
      case 'info':
        message.info('这是一条信息提示');
        break;
      case 'success':
        message.success('操作成功！');
        break;
      case 'warning':
        message.warning('请注意！');
        break;
      case 'error':
        message.error('操作失败！');
        break;
    }
  };

  return <Button onClick={handleClick}>显示{type}消息</Button>;
};

const meta: Meta<typeof MessageDemo> = {
  title: '反馈/Message 全局提示',
  component: MessageDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '全局展示操作反馈信息。基于 FluentUI 的 Toast 组件封装，提供简洁的 API 用于显示不同类型的消息提示。适用于成功、失败、警告等操作反馈场景。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: '消息类型',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    type: 'info',
  },
};

// 不同类型的消息
export const DifferentTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button onClick={() => message.info('这是一条信息提示')}>Info 信息</Button>
      <Button onClick={() => message.success('操作成功！')}>Success 成功</Button>
      <Button onClick={() => message.warning('请注意！')}>Warning 警告</Button>
      <Button onClick={() => message.error('操作失败！')}>Error 错误</Button>
    </div>
  ),
};

// 带详细内容
export const WithContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Button
        onClick={() =>
          message.info('文件上传', {
            content: '您的文件正在后台上传中，请稍候...',
          })
        }
      >
        Info 带内容
      </Button>
      <Button
        onClick={() =>
          message.success('保存成功', {
            content: '您的修改已成功保存到服务器',
          })
        }
      >
        Success 带内容
      </Button>
      <Button
        onClick={() =>
          message.warning('即将过期', {
            content: '您的会话将在 5 分钟后过期，请注意保存',
          })
        }
      >
        Warning 带内容
      </Button>
      <Button
        onClick={() =>
          message.error('网络错误', {
            content: '无法连接到服务器，请检查您的网络连接',
          })
        }
      >
        Error 带内容
      </Button>
    </div>
  ),
};

// 自定义持续时间
export const CustomDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          message.info('1 秒后关闭', {
            duration: 1000,
          })
        }
      >
        1 秒
      </Button>
      <Button
        onClick={() =>
          message.success('3 秒后关闭', {
            duration: 3000,
          })
        }
      >
        3 秒（默认）
      </Button>
      <Button
        onClick={() =>
          message.warning('5 秒后关闭', {
            duration: 5000,
          })
        }
      >
        5 秒
      </Button>
      <Button
        onClick={() =>
          message.error('不自动关闭', {
            duration: 0,
            content: '这条消息需要手动关闭',
          })
        }
      >
        不自动关闭
      </Button>
    </div>
  ),
};

// 带操作按钮
export const WithAction: Story = {
  render: () => {
    const handleUndo = () => {
      message.success('已撤销删除操作');
    };

    const handleViewDetails = () => {
      message.info('跳转到详情页面');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
        <Button
          onClick={() =>
            message.success('删除成功', {
              content: '文件已被删除',
              action: (
                <Button size='small' appearance='transparent' onClick={handleUndo}>
                  撤销
                </Button>
              ),
              duration: 5000,
            })
          }
        >
          带撤销操作
        </Button>

        <Button
          onClick={() =>
            message.info('收到新消息', {
              content: '您有 3 条新的系统通知',
              action: (
                <Button size='small' appearance='primary' onClick={handleViewDetails}>
                  查看详情
                </Button>
              ),
              duration: 5000,
            })
          }
        >
          带查看详情操作
        </Button>

        <Button
          onClick={() =>
            message.warning('即将过期', {
              content: '您的会话将在 5 分钟后过期',
              action: (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button size='small' appearance='primary' onClick={() => message.success('会话已延长')}>
                    延长时间
                  </Button>
                  <Button size='small' appearance='transparent' onClick={() => message.info('已忽略')}>
                    忽略
                  </Button>
                </div>
              ),
              duration: 0,
            })
          }
        >
          带多个操作
        </Button>
      </div>
    );
  },
};

// 关闭回调
export const WithCloseCallback: Story = {
  render: () => (
    <Button
      onClick={() =>
        message.success('保存成功', {
          content: '您的更改已保存',
          onClose: () => {
            console.log('消息已关闭');
            // 可以在这里执行一些清理操作或跳转
          },
        })
      }
    >
      带关闭回调
    </Button>
  ),
};

// 手动关闭消息
export const ManualClose: Story = {
  render: () => {
    let messageInstance: ReturnType<typeof message.info> | null = null;

    return (
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button
          onClick={() => {
            messageInstance = message.info('这是一条持久消息', {
              content: '点击关闭按钮来手动关闭此消息',
              duration: 0,
            });
          }}
        >
          显示持久消息
        </Button>
        <Button
          onClick={() => {
            if (messageInstance) {
              messageInstance.close();
              messageInstance = null;
            }
          }}
        >
          手动关闭
        </Button>
      </div>
    );
  },
};

// 批量显示消息
export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button
        onClick={() => {
          message.info('消息 1');
          message.success('消息 2');
          message.warning('消息 3');
        }}
      >
        显示多条消息
      </Button>
      <Button
        onClick={() => {
          for (let i = 1; i <= 5; i++) {
            setTimeout(() => {
              message.info(`消息 ${i}`);
            }, i * 300);
          }
        }}
      >
        连续显示消息
      </Button>
    </div>
  ),
};

// 使用 open 方法
export const UseOpenMethod: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          message.open({
            title: '自定义消息',
            content: '使用 open 方法可以完全自定义消息',
            intent: 'info',
            duration: 3000,
          })
        }
      >
        使用 open 方法
      </Button>
      <Button
        onClick={() =>
          message.open({
            title: '⭐ 收藏成功',
            content: '已添加到您的收藏夹',
            intent: 'success',
            duration: 2000,
          })
        }
      >
        带 Emoji
      </Button>
    </div>
  ),
};

// 销毁所有消息
export const DestroyAll: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button
        onClick={() => {
          message.info('消息 1', { duration: 10000 });
          message.success('消息 2', { duration: 10000 });
          message.warning('消息 3', { duration: 10000 });
        }}
      >
        显示多条长时间消息
      </Button>
      <Button onClick={() => message.destroy()}>销毁所有消息</Button>
    </div>
  ),
};

// 企业级应用场景
export const Enterprise: Story = {
  render: () => {
    const handleSaveForm = () => {
      // 模拟表单保存
      const hide = message.info('正在保存...', {
        duration: 0,
      });

      setTimeout(() => {
        hide.close();
        message.success('保存成功', {
          content: '您的数据已成功保存',
          onClose: () => {
            console.log('Form saved successfully');
          },
        });
      }, 2000);
    };

    const handleFileUpload = () => {
      // 模拟文件上传
      const hide = message.info('文件上传中...', {
        content: '请不要关闭页面',
        duration: 0,
      });

      setTimeout(() => {
        hide.close();
        message.success('上传完成', {
          content: '文件已成功上传到服务器',
          action: (
            <Button size='small' appearance='primary' onClick={() => message.info('查看文件详情')}>
              查看文件
            </Button>
          ),
          duration: 5000,
        });
      }, 3000);
    };

    const handleBatchDelete = () => {
      // 模拟批量删除
      message.warning('确认删除', {
        content: '您正在删除 5 个项目',
        action: (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size='small'
              appearance='primary'
              onClick={() => {
                message.success('删除成功', {
                  content: '已删除 5 个项目',
                  action: (
                    <Button size='small' appearance='transparent' onClick={() => message.info('已恢复删除的项目')}>
                      撤销
                    </Button>
                  ),
                  duration: 5000,
                });
              }}
            >
              确认
            </Button>
            <Button size='small' appearance='transparent' onClick={() => message.info('已取消删除')}>
              取消
            </Button>
          </div>
        ),
        duration: 0,
      });
    };

    const handleNetworkError = () => {
      // 模拟网络错误
      message.error('网络请求失败', {
        content: '无法连接到服务器，请检查您的网络连接',
        action: (
          <Button size='small' appearance='primary' onClick={() => message.info('正在重试...')}>
            重试
          </Button>
        ),
        duration: 0,
      });
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>表单保存</h4>
          <Button onClick={handleSaveForm}>保存表单</Button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>文件上传</h4>
          <Button onClick={handleFileUpload}>上传文件</Button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>批量操作</h4>
          <Button onClick={handleBatchDelete}>批量删除</Button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>错误处理</h4>
          <Button onClick={handleNetworkError}>模拟网络错误</Button>
        </div>
      </div>
    );
  },
};

// 不同场景的最佳实践
export const BestPractices: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>✅ 推荐用法</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onClick={() => message.success('保存成功')}>简短明了</Button>
            <Button
              onClick={() =>
                message.error('保存失败', {
                  content: '服务器连接超时，请稍后重试',
                })
              }
            >
              错误带详情
            </Button>
            <Button
              onClick={() =>
                message.warning('即将过期', {
                  content: '您的会话将在 5 分钟后过期',
                  action: (
                    <Button size='small' appearance='primary' onClick={() => message.success('会话已延长')}>
                      延长
                    </Button>
                  ),
                  duration: 0,
                })
              }
            >
              重要提示带操作
            </Button>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>⚠️ 避免的用法</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button
              onClick={() =>
                message.info('这是一条非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的消息标题')
              }
            >
              标题过长
            </Button>
            <Button
              onClick={() => {
                for (let i = 0; i < 10; i++) {
                  message.info(`消息 ${i + 1}`);
                }
              }}
            >
              同时显示过多
            </Button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            💡 建议：保持消息简短明了，避免同时显示过多消息
          </div>
        </div>
      </div>
    );
  },
};
