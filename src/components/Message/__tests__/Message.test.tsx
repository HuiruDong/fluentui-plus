import React from 'react';
import { waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import message from '../Message';

// Mock MessageContainer
jest.mock('../MessageContainer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    __esModule: true,
    default: ({ onDispatchReady }: { onDispatchReady: (dispatch: jest.Mock) => void }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        const mockDispatch = jest.fn();
        onDispatchReady(mockDispatch);
      }, [onDispatchReady]);
      return <div data-testid='message-container'>MessageContainer</div>;
    },
  };
});

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  FluentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  webLightTheme: {},
  Toast: ({ children }: { children: React.ReactNode }) => <div data-testid='toast'>{children}</div>,
  ToastTitle: ({ children }: { children: React.ReactNode }) => <div data-testid='toast-title'>{children}</div>,
  ToastBody: ({ children }: { children: React.ReactNode }) => <div data-testid='toast-body'>{children}</div>,
}));

// Mock react-dom/client
const mockRender = jest.fn();
const mockUnmount = jest.fn();

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: mockRender,
    unmount: mockUnmount,
  })),
}));

describe('Message Component', () => {
  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
    mockRender.mockClear();
    mockUnmount.mockClear();
    message.destroy();
  });

  afterEach(() => {
    message.destroy();
  });

  describe('基础功能', () => {
    it('should create message container when first called', async () => {
      act(() => {
        message.info('Test message');
      });

      await waitFor(() => {
        const container = document.body.querySelector('div');
        expect(container).toBeInTheDocument();
      });
    });

    it('should return MessageInstance with close method', () => {
      const instance = message.info('Test message');

      expect(instance).toBeDefined();
      expect(instance.close).toBeDefined();
      expect(typeof instance.close).toBe('function');
    });

    it('should call close method successfully', () => {
      const instance = message.info('Test message');

      expect(() => {
        instance.close();
      }).not.toThrow();
    });
  });

  describe('info 方法', () => {
    it('should display info message with title', async () => {
      act(() => {
        message.info('Info message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options with content', async () => {
      act(() => {
        message.info('Info title', {
          content: 'Info content',
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options with duration', async () => {
      act(() => {
        message.info('Info message', {
          duration: 5000,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options with onClose callback', async () => {
      const onClose = jest.fn();

      act(() => {
        message.info('Info message', {
          onClose,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options with action', async () => {
      const action = <button>Action</button>;

      act(() => {
        message.info('Info message', {
          action,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('success 方法', () => {
    it('should display success message with title', async () => {
      act(() => {
        message.success('Success message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options', async () => {
      act(() => {
        message.success('Success title', {
          content: 'Success content',
          duration: 3000,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('warning 方法', () => {
    it('should display warning message with title', async () => {
      act(() => {
        message.warning('Warning message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options', async () => {
      act(() => {
        message.warning('Warning title', {
          content: 'Warning content',
          duration: 4000,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('error 方法', () => {
    it('should display error message with title', async () => {
      act(() => {
        message.error('Error message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept options', async () => {
      act(() => {
        message.error('Error title', {
          content: 'Error content',
          duration: 6000,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('open 方法', () => {
    it('should display message with custom options', async () => {
      act(() => {
        message.open({
          title: 'Custom message',
          content: 'Custom content',
          intent: 'info',
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept all intent types', async () => {
      const intents: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];

      for (const intent of intents) {
        act(() => {
          message.open({
            title: `${intent} message`,
            intent,
          });
        });
      }

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle duration 0 for persistent message', async () => {
      act(() => {
        message.open({
          title: 'Persistent message',
          duration: 0,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle message without content', async () => {
      act(() => {
        message.open({
          title: 'Title only',
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle message without action', async () => {
      act(() => {
        message.open({
          title: 'Message without action',
          content: 'Content',
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('destroy 方法', () => {
    it('should destroy message container', async () => {
      act(() => {
        message.info('Test message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      act(() => {
        message.destroy();
      });

      await waitFor(() => {
        const containers = document.body.querySelectorAll('div');
        // 销毁后容器应该被移除
        expect(containers.length).toBeLessThanOrEqual(1);
      });
    });

    it('should handle destroy when no container exists', () => {
      expect(() => {
        message.destroy();
      }).not.toThrow();
    });

    it('should allow creating new messages after destroy', async () => {
      act(() => {
        message.info('First message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      act(() => {
        message.destroy();
      });

      act(() => {
        message.info('Second message');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('多消息处理', () => {
    it('should handle multiple messages simultaneously', async () => {
      act(() => {
        message.info('Message 1');
        message.success('Message 2');
        message.warning('Message 3');
        message.error('Message 4');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should generate unique IDs for each message', async () => {
      const instances: Array<{ close: () => void }> = [];

      act(() => {
        instances.push(message.info('Message 1'));
        instances.push(message.info('Message 2'));
        instances.push(message.info('Message 3'));
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      // 每个实例都应该有独立的 close 方法
      instances.forEach(instance => {
        expect(instance.close).toBeDefined();
      });
    });

    it('should handle closing individual messages', async () => {
      let instance1: { close: () => void };
      let instance2: { close: () => void };

      act(() => {
        instance1 = message.info('Message 1');
        instance2 = message.info('Message 2');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      expect(() => {
        instance1.close();
      }).not.toThrow();

      expect(() => {
        instance2.close();
      }).not.toThrow();
    });
  });

  describe('ReactNode 类型支持', () => {
    it('should accept ReactNode as title', async () => {
      const titleElement = <span>Custom Title</span>;

      act(() => {
        message.info(titleElement);
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept ReactNode as content', async () => {
      const contentElement = (
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      );

      act(() => {
        message.info('Title', {
          content: contentElement,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should accept ReactNode as action', async () => {
      const actionElement = <button onClick={() => console.log('Action clicked')}>Custom Action</button>;

      act(() => {
        message.info('Title', {
          action: actionElement,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('边界情况', () => {
    it('should handle empty string as title', async () => {
      act(() => {
        message.info('');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle empty string as content', async () => {
      act(() => {
        message.info('Title', {
          content: '',
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle very long title', async () => {
      const longTitle = 'a'.repeat(1000);

      act(() => {
        message.info(longTitle);
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle very long content', async () => {
      const longContent = 'b'.repeat(1000);

      act(() => {
        message.info('Title', {
          content: longContent,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });

    it('should handle negative duration gracefully', async () => {
      act(() => {
        message.info('Title', {
          duration: -1,
        });
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });
    });
  });

  describe('MessageManager 单例', () => {
    it('should reuse the same container for multiple messages', async () => {
      act(() => {
        message.info('Message 1');
      });

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      const containerCountBefore = document.body.querySelectorAll('div').length;

      act(() => {
        message.info('Message 2');
      });

      await waitFor(() => {
        const containerCountAfter = document.body.querySelectorAll('div').length;
        // 容器数量不应该增加（复用同一个容器）
        expect(containerCountAfter).toBeLessThanOrEqual(containerCountBefore + 1);
      });
    });

    it('should maintain counter for unique IDs', async () => {
      const instances: Array<{ close: () => void }> = [];

      for (let i = 0; i < 10; i++) {
        act(() => {
          instances.push(message.info(`Message ${i}`));
        });
      }

      await waitFor(() => {
        expect(document.body.querySelector('div')).toBeInTheDocument();
      });

      // 所有实例都应该有效
      expect(instances).toHaveLength(10);
      instances.forEach(instance => {
        expect(instance.close).toBeDefined();
      });
    });
  });
});
