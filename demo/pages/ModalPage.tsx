import React, { useState } from 'react';
import { makeStyles, Button, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { Modal } from '../../src';
import { DeleteFilled, EditFilled, InfoFilled } from '@fluentui/react-icons';

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
    flexDirection: 'row',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  modalContent: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#374151',
  },
  warningContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#374151',
  },
  warningIcon: {
    color: '#f59e0b',
    marginTop: '2px',
  },
});

const ModalPage: React.FC = () => {
  const styles = useStyles();

  // 基础用法状态
  const [basicOpen, setBasicOpen] = useState(false);

  // 自定义按钮文字状态
  const [customButtonOpen, setCustomButtonOpen] = useState(false);

  // 确认对话框状态
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 信息对话框状态
  const [infoOpen, setInfoOpen] = useState(false);

  // 自定义 footer 状态
  const [customFooterOpen, setCustomFooterOpen] = useState(false);

  // 无 footer 状态
  const [noFooterOpen, setNoFooterOpen] = useState(false);

  // 异步确认状态
  const [asyncOpen, setAsyncOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 自定义关闭图标状态
  const [customIconOpen, setCustomIconOpen] = useState(false);

  // 处理异步确认
  const handleAsyncOk = async () => {
    setLoading(true);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setAsyncOpen(false);
    console.log('异步操作完成');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Modal 对话框</div>
        <div className={styles.description}>模态对话框，用于重要信息的确认或复杂表单的填写。</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础用法</div>
        <div className={styles.sectionDescription}>最简单的用法，通过 open 属性控制对话框的显示。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>基础对话框</div>
          <div className={styles.demo}>
            <Button appearance='primary' onClick={() => setBasicOpen(true)}>
              打开基础对话框
            </Button>
            <Modal
              title='基础对话框'
              open={basicOpen}
              onOk={() => {
                console.log('确定按钮被点击');
                setBasicOpen(false);
              }}
              style={{ maxHeight: '400px' }}
              onCancel={() => setBasicOpen(false)}
            >
              <div className={styles.modalContent}>
                {new Array(30).fill(null).map((_, index) => (
                  <p key={`${index}`}>这是一个基础的对话框内容。用户可以在这里查看重要信息，或者进行简单的操作确认。</p>
                ))}
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义按钮</div>
        <div className={styles.sectionDescription}>通过 okText、okType 等属性自定义按钮的文字和样式。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义按钮文字和样式</div>
          <div className={styles.demo}>
            <Button onClick={() => setCustomButtonOpen(true)}>自定义按钮</Button>
            <Modal
              title='自定义按钮'
              open={customButtonOpen}
              okText='保存'
              okType='primary'
              onOk={() => {
                console.log('保存按钮被点击');
                setCustomButtonOpen(false);
              }}
              onCancel={() => setCustomButtonOpen(false)}
              cancelButtonProps={{ children: '放弃' }}
            >
              <div className={styles.modalContent}>自定义按钮文字：确定按钮显示为"保存"，取消按钮显示为"放弃"。</div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>不同类型的对话框</div>
        <div className={styles.sectionDescription}>根据使用场景，可以配置不同类型的对话框。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>确认对话框和信息对话框</div>
          <div className={styles.demo}>
            <div className={styles.buttonGroup}>
              <Button appearance='secondary' onClick={() => setConfirmOpen(true)}>
                删除确认
              </Button>
              <Button onClick={() => setInfoOpen(true)}>查看信息</Button>
            </div>

            {/* 确认对话框 */}
            <Modal
              title='确认删除'
              open={confirmOpen}
              okText='删除'
              okType='primary'
              okButtonProps={{ appearance: 'primary' }}
              onOk={() => {
                console.log('确认删除');
                setConfirmOpen(false);
              }}
              onCancel={() => setConfirmOpen(false)}
            >
              <div className={styles.warningContent}>
                <DeleteFilled className={styles.warningIcon} />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>确定要删除这个项目吗？</div>
                  <div>删除后将无法恢复，请谨慎操作。</div>
                </div>
              </div>
            </Modal>

            {/* 信息对话框 */}
            <Modal
              title='项目信息'
              open={infoOpen}
              okText='知道了'
              footer={
                <Button appearance='primary' onClick={() => setInfoOpen(false)}>
                  知道了
                </Button>
              }
              onCancel={() => setInfoOpen(false)}
            >
              <div className={styles.warningContent}>
                <InfoFilled style={{ color: '#3b82f6', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>FluentUI Plus 组件库</div>
                  <div>
                    基于 Fluent UI 的企业级组件库，专为中后台项目设计。提供高质量的 React 组件，
                    支持主题定制，具有良好的可访问性和国际化支持。
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义 Footer</div>
        <div className={styles.sectionDescription}>通过 footer 属性可以自定义底部内容，设置为 null 可以隐藏底部。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义和隐藏 Footer</div>
          <div className={styles.demo}>
            <div className={styles.buttonGroup}>
              <Button onClick={() => setCustomFooterOpen(true)}>自定义 Footer</Button>
              <Button onClick={() => setNoFooterOpen(true)}>无 Footer</Button>
            </div>

            {/* 自定义 Footer */}
            <Modal
              title='自定义 Footer'
              open={customFooterOpen}
              footer={(originNode, { OkBtn, CancelBtn }) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Button appearance='subtle' onClick={() => console.log('更多选项')}>
                    更多选项
                  </Button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <CancelBtn />
                    <OkBtn />
                  </div>
                </div>
              )}
              onOk={() => {
                console.log('自定义确定');
                setCustomFooterOpen(false);
              }}
              onCancel={() => setCustomFooterOpen(false)}
            >
              <div className={styles.modalContent}>这个对话框使用了自定义的 Footer，左侧添加了"更多选项"按钮。</div>
            </Modal>

            {/* 无 Footer */}
            <Modal title='无 Footer 对话框' open={noFooterOpen} footer={null} onCancel={() => setNoFooterOpen(false)}>
              <div className={styles.modalContent}>
                这个对话框没有底部按钮，只能通过右上角的关闭按钮或按 ESC 键关闭。
                <div style={{ marginTop: '16px' }}>
                  <Button appearance='primary' onClick={() => setNoFooterOpen(false)}>
                    内容区域的关闭按钮
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>异步操作</div>
        <div className={styles.sectionDescription}>处理异步操作时的加载状态。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>异步确认操作</div>
          <div className={styles.demo}>
            <Button onClick={() => setAsyncOpen(true)}>异步操作</Button>
            <Modal
              title='异步操作确认'
              open={asyncOpen}
              okText='提交'
              okButtonProps={{ disabled: loading }}
              onOk={handleAsyncOk}
              onCancel={() => setAsyncOpen(false)}
            >
              <div className={styles.modalContent}>
                点击提交按钮后，会模拟 2 秒的异步操作。期间按钮会被禁用。
                {loading && <div style={{ marginTop: '16px', color: '#3b82f6' }}>正在处理中，请稍候...</div>}
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>静态方法</div>
        <div className={styles.sectionDescription}>
          提供便捷的静态方法快速创建对话框，包括 info、success、error、warning、confirm 五种类型。
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>各种类型的静态方法</div>
          <div className={styles.demo}>
            <div className={styles.buttonGroup}>
              <Button
                onClick={() => {
                  Modal.info({
                    title: '信息提示',
                    content: '这是一条重要的信息提示，请仔细阅读。',
                    onOk: () => console.log('Info Modal 确定'),
                  });
                }}
              >
                信息提示
              </Button>
              <Button
                appearance='primary'
                onClick={() => {
                  Modal.success({
                    title: '操作成功',
                    content: '您的操作已成功完成！',
                    onOk: () => console.log('Success Modal 确定'),
                  });
                }}
              >
                成功提示
              </Button>
              <Button
                onClick={() => {
                  Modal.error({
                    title: '操作失败',
                    content: '操作失败，请检查网络连接或联系管理员。',
                    onOk: () => console.log('Error Modal 确定'),
                  });
                }}
              >
                错误提示
              </Button>
              <Button
                onClick={() => {
                  Modal.warning({
                    title: '警告',
                    content: '您即将执行一个可能有风险的操作，请谨慎处理。',
                    onOk: () => console.log('Warning Modal 确定'),
                  });
                }}
              >
                警告提示
              </Button>
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: '确认操作',
                    content: '确定要删除这个项目吗？删除后将无法恢复。',
                    onOk: () => {
                      console.log('Confirm Modal 确定');
                      // 模拟异步操作
                      return new Promise(resolve => {
                        setTimeout(() => {
                          console.log('异步操作完成');
                          resolve(undefined);
                        }, 1000);
                      });
                    },
                    onCancel: () => console.log('Confirm Modal 取消'),
                  });
                }}
              >
                确认对话框
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>静态方法高级用法</div>
          <div className={styles.demo}>
            <div className={styles.buttonGroup}>
              <Button
                onClick={() => {
                  const modal = Modal.success({
                    title: '可手动关闭',
                    content: (
                      <div>
                        <p>这个弹窗可以通过返回的实例手动关闭。</p>
                        <Button
                          size='small'
                          onClick={() => {
                            modal.destroy();
                            console.log('手动关闭弹窗');
                          }}
                        >
                          手动关闭
                        </Button>
                      </div>
                    ),
                  });
                }}
              >
                手动关闭
              </Button>
              <Button
                onClick={() => {
                  Modal.info({
                    title: '自定义样式',
                    content: '这个弹窗使用了自定义样式。',
                    className: 'custom-modal',
                    style: { border: '2px solid #0078d4' },
                    okText: '明白了',
                    okButtonProps: { appearance: 'outline' },
                  });
                }}
              >
                自定义样式
              </Button>
              <Button
                onClick={() => {
                  Modal.success({
                    title: '深色主题',
                    content: '这个弹窗使用了深色主题。',
                    theme: webDarkTheme,
                    okText: '知道了',
                  });
                }}
              >
                深色主题
              </Button>
              <Button
                onClick={() => {
                  Modal.warning({
                    title: '浅色主题',
                    content: '这个弹窗明确使用了浅色主题。',
                    theme: webLightTheme,
                    okText: '了解',
                  });
                }}
              >
                浅色主题
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>自定义关闭图标</div>
        <div className={styles.sectionDescription}>通过 closeIcon 属性可以自定义右上角的关闭图标。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>自定义关闭图标</div>
          <div className={styles.demo}>
            <Button onClick={() => setCustomIconOpen(true)}>自定义关闭图标</Button>
            <Modal
              title='自定义关闭图标'
              open={customIconOpen}
              closeIcon={<EditFilled />}
              onOk={() => setCustomIconOpen(false)}
              onCancel={() => setCustomIconOpen(false)}
            >
              <div className={styles.modalContent}>这个对话框使用了自定义的关闭图标（编辑图标）。</div>
            </Modal>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API 参数</div>
        <div className={styles.sectionDescription}>Modal 组件支持的所有参数配置。</div>
        <div className={styles.demoContainer}>
          <div className={styles.demoTitle}>Modal 组件参数</div>
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
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>open</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>对话框是否可见</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>false</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>title</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>标题</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onOk</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>点击确定回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>() =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>onCancel</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>点击取消或关闭按钮的回调</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>() =&gt; void</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>okText</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>确认按钮文字</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>string</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>确定</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>okType</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>确认按钮类型</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ButtonProps['appearance']</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>primary</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>okButtonProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>确认按钮的 props</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ButtonProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>cancelButtonProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>取消按钮的 props</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ButtonProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>-</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>closeIcon</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>自定义关闭图标</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ReactNode</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>DismissFilled</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>mask</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>是否展示遮罩</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>boolean</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>true</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>footer</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>底部内容</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ReactNode | null | function</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>默认按钮</td>
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

        <div className={styles.demoContainer} style={{ marginTop: '24px' }}>
          <div className={styles.demoTitle}>静态方法参数</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>方法</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>说明</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>参数类型</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>返回值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Modal.info</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>信息提示对话框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>StaticModalProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ModalInstance</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Modal.success</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>成功提示对话框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>StaticModalProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ModalInstance</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Modal.error</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>错误提示对话框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>StaticModalProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ModalInstance</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Modal.warning</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>警告提示对话框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>StaticModalProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ModalInstance</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>Modal.confirm</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>确认对话框</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>StaticModalProps</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>ModalInstance</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            <p>
              <strong>StaticModalProps 特有参数：</strong>
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <code>content</code>: 弹窗内容 (ReactNode)
              </li>
              <li>
                <code>onOk</code>: 点击确定的回调，支持异步 (() =&gt; void | Promise&lt;void&gt;)
              </li>
              <li>
                <code>onCancel</code>: 点击取消的回调，仅 confirm 方法支持 (() =&gt; void)
              </li>
              <li>
                <code>theme</code>: 主题配置，默认为 webLightTheme (Theme)
              </li>
            </ul>
            <p>
              <strong>ModalInstance 方法：</strong>
            </p>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <code>destroy()</code>: 手动销毁弹窗
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPage;
