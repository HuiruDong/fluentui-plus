import React from 'react';
import { Button, Field, Input, makeStyles, tokens } from '@fluentui/react-components';
import { message } from '../../src';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    padding: tokens.spacingVerticalXXL,
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalM,
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  customContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

const MessagePage: React.FC = () => {
  const styles = useStyles();
  const [customContent, setCustomContent] = React.useState('这是一条自定义消息');

  const showInfo = () => {
    message.info('这是一条普通信息');
  };

  const showSuccess = () => {
    message.success('操作成功！');
  };

  const showWarning = () => {
    message.warning('请注意检查输入内容');
  };

  const showError = () => {
    message.error('操作失败，请重试');
  };

  const showCustomDuration = () => {
    message.info('这条消息会在 5 秒后自动关闭', {
      duration: 5000,
    });
  };

  const showWithTitle = () => {
    message.success('操作成功', {
      content: '您的更改已成功保存到服务器',
    });
  };

  const showWithAction = () => {
    message.warning('检测到新版本', {
      content: '发现新版本 v2.0.0，建议立即更新以获得更好的体验',
      action: (
        <Button
          size='small'
          onClick={() => {
            alert('开始更新...');
          }}
        >
          立即更新
        </Button>
      ),
      duration: 0, // 不自动关闭
    });
  };

  const showWithCallback = () => {
    message.info('这条消息关闭时会触发回调', {
      onClose: () => {
        console.log('消息已关闭');
      },
    });
  };

  const showManualClose = () => {
    const instance = message.info('这条消息需要手动关闭', {
      duration: 0,
    });

    setTimeout(() => {
      instance.close();
    }, 3000);
  };

  const showCustomContent = () => {
    message.open({
      title: customContent || '自定义标题',
      content: '这是消息的详细内容描述',
      intent: 'info',
      duration: 3000,
    });
  };

  const showMultiple = () => {
    message.success('第一条消息');
    setTimeout(() => message.info('第二条消息'), 500);
    setTimeout(() => message.warning('第三条消息'), 1000);
    setTimeout(() => message.error('第四条消息'), 1500);
  };

  const destroyAll = () => {
    message.destroy();
  };

  // 模拟 axios 拦截器场景
  const simulateAxiosError = () => {
    // 模拟 axios 错误拦截器
    setTimeout(() => {
      message.error('网络请求失败，请检查网络连接');
    }, 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>基础用法</h2>
        <div className={styles.buttonGroup}>
          <Button appearance='primary' onClick={showInfo}>
            普通信息
          </Button>
          <Button appearance='primary' onClick={showSuccess}>
            成功消息
          </Button>
          <Button appearance='primary' onClick={showWarning}>
            警告消息
          </Button>
          <Button appearance='primary' onClick={showError}>
            错误消息
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>自定义持续时间</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={showCustomDuration}>5 秒后关闭</Button>
          <Button onClick={showManualClose}>3 秒后自动关闭（通过实例）</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>带详细内容的消息</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={showWithTitle}>标题 + 详细内容</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>带操作按钮</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={showWithAction}>带操作按钮（不自动关闭）</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>回调函数</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={showWithCallback}>关闭时触发回调</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>自定义配置</h2>
        <div className={styles.customContent}>
          <Field label='消息标题'>
            <Input
              value={customContent}
              onChange={(e, data) => setCustomContent(data.value)}
              placeholder='输入自定义标题'
            />
          </Field>
          <Button onClick={showCustomContent}>显示自定义消息</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>多条消息</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={showMultiple}>连续显示多条消息</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>应用场景示例</h2>
        <div className={styles.buttonGroup}>
          <Button appearance='primary' onClick={simulateAxiosError}>
            模拟 Axios 错误拦截器
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.title}>全局操作</h2>
        <div className={styles.buttonGroup}>
          <Button appearance='secondary' onClick={destroyAll}>
            销毁所有消息
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
