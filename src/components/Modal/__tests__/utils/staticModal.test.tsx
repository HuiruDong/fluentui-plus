import React from 'react';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { info, success, error, warning, confirm } from '../../utils/staticModal';
import type { StaticModalProps } from '../../types';

// Mock React DOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
    unmount: jest.fn(),
  })),
}));

// Mock FluentProvider
jest.mock('@fluentui/react-components', () => ({
  FluentProvider: ({ children }: { children: React.ReactNode }) => <div data-testid='fluent-provider'>{children}</div>,
  webLightTheme: {},
}));

// Mock Modal component
jest.mock('../../Modal', () => {
  return function MockModal(props: any) {
    return <div data-testid='static-modal' {...props} />;
  };
});

// Mock icons
jest.mock('@fluentui/react-icons', () => ({
  InfoFilled: () => <span data-testid='info-icon'>ℹ</span>,
  CheckmarkCircleFilled: () => <span data-testid='success-icon'>✓</span>,
  ErrorCircleFilled: () => <span data-testid='error-icon'>✗</span>,
  WarningFilled: () => <span data-testid='warning-icon'>⚠</span>,
  QuestionCircleFilled: () => <span data-testid='question-icon'>?</span>,
}));

describe('Static Modal Methods', () => {
  let mockCreateRoot: jest.Mock;
  let mockRender: jest.Mock;
  let mockUnmount: jest.Mock;
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    // Mock DOM methods
    mockContainer = document.createElement('div');
    // 为容器设置 parentNode
    Object.defineProperty(mockContainer, 'parentNode', {
      value: document.body,
      writable: true,
    });

    jest.spyOn(document, 'createElement').mockReturnValue(mockContainer);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockContainer);
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockContainer);

    // Mock createRoot
    mockRender = jest.fn();
    mockUnmount = jest.fn();
    const mockRootObject = {
      render: mockRender,
      unmount: mockUnmount,
    };

    const reactDomClient = jest.requireMock('react-dom/client');
    mockCreateRoot = reactDomClient.createRoot;
    mockCreateRoot.mockReturnValue(mockRootObject);

    // Clear all mocks
    jest.clearAllMocks();

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('基础功能', () => {
    it('should create and mount modal correctly', () => {
      const props: StaticModalProps = {
        content: 'Test content',
      };

      const instance = info(props);

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockContainer);
      expect(mockCreateRoot).toHaveBeenCalledWith(mockContainer);
      expect(mockRender).toHaveBeenCalled();
      expect(instance.destroy).toBeDefined();
    });

    it('should return instance with destroy method', () => {
      const instance = info({ content: 'Test' });

      expect(instance).toHaveProperty('destroy');
      expect(typeof instance.destroy).toBe('function');
    });
  });

  describe('destroy 方法', () => {
    it('should destroy modal correctly', () => {
      const instance = info({ content: 'Test' });

      act(() => {
        instance.destroy();
        jest.advanceTimersByTime(100); // DESTROY_DELAY
      });

      expect(mockUnmount).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockContainer);
    });

    it('should not throw error when destroying multiple times', () => {
      const instance = info({ content: 'Test' });

      expect(() => {
        instance.destroy();
        instance.destroy(); // 第二次调用
      }).not.toThrow();
    });

    it('should handle unmount errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      mockUnmount.mockImplementation(() => {
        throw new Error('Unmount error');
      });

      const instance = info({ content: 'Test' });

      expect(() => {
        act(() => {
          instance.destroy();
          jest.advanceTimersByTime(100);
        });
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith('Modal destroy error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('事件处理', () => {
    it('should handle onOk callback', async () => {
      const onOk = jest.fn().mockResolvedValue(undefined);
      info({ content: 'Test', onOk });

      // 模拟渲染的 Modal 组件的 onOk 调用
      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      await act(async () => {
        await modalProps.onOk();
      });

      expect(onOk).toHaveBeenCalled();
    });

    it('should handle onOk error and not destroy modal', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const onOk = jest.fn().mockRejectedValue(new Error('OK error'));
      info({ content: 'Test', onOk });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      await act(async () => {
        await modalProps.onOk();
      });

      expect(onOk).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Modal onOk error:', expect.any(Error));

      // 验证模态框未被销毁（因为发生错误）
      expect(mockUnmount).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle onCancel callback', () => {
      const onCancel = jest.fn();
      info({ content: 'Test', onCancel });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      act(() => {
        modalProps.onCancel();
        jest.advanceTimersByTime(100);
      });

      expect(onCancel).toHaveBeenCalled();
      expect(mockUnmount).toHaveBeenCalled();
    });

    it('should handle onCancel error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const onCancel = jest.fn().mockImplementation(() => {
        throw new Error('Cancel error');
      });
      info({ content: 'Test', onCancel });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(() => {
        act(() => {
          modalProps.onCancel();
          jest.advanceTimersByTime(100);
        });
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Modal onCancel error:', expect.any(Error));
      expect(mockUnmount).toHaveBeenCalled(); // 即使出错也要销毁

      consoleErrorSpy.mockRestore();
    });
  });

  describe('不同类型的静态方法', () => {
    it('should call info method with correct props', () => {
      const props: StaticModalProps = {
        content: 'Info message',
        title: 'Custom Info Title',
      };

      info(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.open).toBe(true);
      expect(modalProps.closable).toBe(false);
      expect(modalProps.okText).toBe('知道了');
    });

    it('should call success method with correct props', () => {
      const props: StaticModalProps = {
        content: 'Success message',
      };

      success(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.open).toBe(true);
      expect(modalProps.closable).toBe(false);
      expect(modalProps.okText).toBe('知道了');
    });

    it('should call error method with correct props', () => {
      const props: StaticModalProps = {
        content: 'Error message',
      };

      error(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.open).toBe(true);
      expect(modalProps.closable).toBe(false);
      expect(modalProps.okText).toBe('知道了');
    });

    it('should call warning method with correct props', () => {
      const props: StaticModalProps = {
        content: 'Warning message',
      };

      warning(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.open).toBe(true);
      expect(modalProps.closable).toBe(false);
      expect(modalProps.okText).toBe('知道了');
    });

    it('should call confirm method with correct props', () => {
      const props: StaticModalProps = {
        content: 'Confirm message',
      };

      confirm(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.open).toBe(true);
      expect(modalProps.closable).toBe(false);
      expect(modalProps.okText).toBe('确定');
      expect(modalProps.footer).toBeUndefined(); // confirm 类型使用默认 footer
    });
  });

  describe('属性传递', () => {
    it('should pass custom theme correctly', () => {
      const customTheme = { colorPrimary: '#ff0000' };

      info({
        content: 'Test',
        theme: customTheme as any,
      });

      const renderCall = mockRender.mock.calls[0][0];
      expect(renderCall.props.theme).toBe(customTheme);
    });

    it('should pass custom props to Modal', () => {
      const props: StaticModalProps = {
        content: 'Test content',
        title: 'Custom Title',
        okText: 'Custom OK',
        style: { width: '500px' },
        className: 'custom-modal',
      };

      info(props);

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.style).toEqual({ width: '500px' });
      expect(modalProps.className).toBe('custom-modal');
      expect(modalProps.okText).toBe('Custom OK');
    });

    it('should render content correctly', () => {
      const content = <div data-testid='custom-content'>Custom Content</div>;

      info({ content });

      const renderCall = mockRender.mock.calls[0][0];
      const modalChildren = renderCall.props.children.props.children;

      expect(modalChildren.props.className).toBe('fluentui-plus-static-modal__content');
      expect(modalChildren.props.children).toBe(content);
    });
  });

  describe('默认配置', () => {
    it('should use default texts for info modal', () => {
      info({ content: 'Test' });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.okText).toBe('知道了');
    });

    it('should use default texts for confirm modal', () => {
      confirm({ content: 'Test' });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(modalProps.okText).toBe('确定');
    });

    it('should use webLightTheme as default theme', () => {
      info({ content: 'Test' });

      const renderCall = mockRender.mock.calls[0][0];
      expect(renderCall.props.theme).toEqual({});
    });
  });

  describe('特殊情况处理', () => {
    it('should handle missing container parent gracefully', () => {
      Object.defineProperty(mockContainer, 'parentNode', {
        value: null,
        writable: true,
      });

      const instance = info({ content: 'Test' });

      expect(() => {
        act(() => {
          instance.destroy();
          jest.advanceTimersByTime(100);
        });
      }).not.toThrow();
    });

    it('should handle async onOk that resolves', async () => {
      const onOk = jest.fn().mockResolvedValue('success');
      info({ content: 'Test', onOk });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      await act(async () => {
        await modalProps.onOk();
        jest.advanceTimersByTime(100);
      });

      expect(onOk).toHaveBeenCalled();
      expect(mockUnmount).toHaveBeenCalled(); // onOk 成功后应该销毁
    });

    it('should handle missing onOk callback', async () => {
      info({ content: 'Test' });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      await act(async () => {
        await modalProps.onOk();
        jest.advanceTimersByTime(100);
      });

      expect(mockUnmount).toHaveBeenCalled(); // 没有 onOk 也应该销毁
    });

    it('should handle missing onCancel callback', () => {
      info({ content: 'Test' });

      const renderCall = mockRender.mock.calls[0][0];
      const modalProps = renderCall.props.children.props;

      expect(() => {
        act(() => {
          modalProps.onCancel();
          jest.advanceTimersByTime(100);
        });
      }).not.toThrow();

      expect(mockUnmount).toHaveBeenCalled();
    });
  });
});
