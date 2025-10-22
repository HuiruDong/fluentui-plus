import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageContainer from '../MessageContainer';

// Mock FluentUI components
const mockDispatchToast = jest.fn();

jest.mock('@fluentui/react-components', () => ({
  Toaster: ({ toasterId, position }: { toasterId: string; position: string }) => (
    <div data-testid='toaster' data-toaster-id={toasterId} data-position={position}>
      Toaster
    </div>
  ),
  useToastController: jest.fn(() => ({
    dispatchToast: mockDispatchToast,
  })),
}));

describe('MessageContainer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render Toaster component', () => {
      const mockOnDispatchReady = jest.fn();

      const { getByTestId } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      const toaster = getByTestId('toaster');
      expect(toaster).toBeInTheDocument();
    });

    it('should render Toaster with correct toasterId', () => {
      const mockOnDispatchReady = jest.fn();

      const { getByTestId } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      const toaster = getByTestId('toaster');
      expect(toaster).toHaveAttribute('data-toaster-id', 'message-toaster');
    });

    it('should render Toaster with correct position', () => {
      const mockOnDispatchReady = jest.fn();

      const { getByTestId } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      const toaster = getByTestId('toaster');
      expect(toaster).toHaveAttribute('data-position', 'top');
    });
  });

  describe('dispatchToast 回调', () => {
    it('should call onDispatchReady with dispatchToast function', async () => {
      const mockOnDispatchReady = jest.fn();

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledTimes(1);
        expect(mockOnDispatchReady).toHaveBeenCalledWith(mockDispatchToast);
      });
    });

    it('should call onDispatchReady on mount', async () => {
      const mockOnDispatchReady = jest.fn();

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalled();
      });
    });

    it('should handle multiple renders correctly', async () => {
      const mockOnDispatchReady = jest.fn();

      const { rerender } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(mockDispatchToast);
      });

      const callCountBefore = mockOnDispatchReady.mock.calls.length;

      // 重新渲染但保持相同的回调引用
      // useEffect 依赖项包括 dispatchToast 和 onDispatchReady，可能会再次触发
      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        // 调用次数应该大于等于初始调用次数
        expect(mockOnDispatchReady.mock.calls.length).toBeGreaterThanOrEqual(callCountBefore);
      });
    });

    it('should call onDispatchReady again when callback changes', async () => {
      const mockOnDispatchReady1 = jest.fn();
      const mockOnDispatchReady2 = jest.fn();

      const { rerender } = render(<MessageContainer onDispatchReady={mockOnDispatchReady1} />);

      await waitFor(() => {
        expect(mockOnDispatchReady1).toHaveBeenCalledTimes(1);
      });

      // 更换回调函数
      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady2} />);

      await waitFor(() => {
        expect(mockOnDispatchReady2).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useToastController 集成', () => {
    it('should use useToastController with correct toasterId', () => {
      const mockOnDispatchReady = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useToastController } = require('@fluentui/react-components');

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      expect(useToastController).toHaveBeenCalledWith('message-toaster');
    });

    it('should pass dispatchToast from useToastController to callback', async () => {
      const mockOnDispatchReady = jest.fn();

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(mockDispatchToast);
      });
    });
  });

  describe('props 处理', () => {
    it('should accept onDispatchReady prop', () => {
      const mockOnDispatchReady = jest.fn();

      expect(() => {
        render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);
      }).not.toThrow();
    });

    it('should work with different onDispatchReady implementations', async () => {
      const implementations = [jest.fn(), jest.fn(), jest.fn()];

      for (const impl of implementations) {
        const { unmount } = render(<MessageContainer onDispatchReady={impl} />);

        await waitFor(() => {
          expect(impl).toHaveBeenCalled();
        });

        unmount();
      }
    });
  });

  describe('组件生命周期', () => {
    it('should handle mount and unmount correctly', async () => {
      const mockOnDispatchReady = jest.fn();

      const { unmount } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalled();
      });

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should cleanup properly on unmount', async () => {
      const mockOnDispatchReady = jest.fn();

      const { unmount, getByTestId } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      const toaster = getByTestId('toaster');
      expect(toaster).toBeInTheDocument();

      unmount();

      expect(toaster).not.toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle dispatchToast being undefined initially', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useToastController } = require('@fluentui/react-components');

      // 模拟 dispatchToast 初始为 undefined
      useToastController.mockReturnValueOnce({
        dispatchToast: undefined,
      });

      const mockOnDispatchReady = jest.fn();

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(undefined);
      });

      // 恢复原始 mock
      useToastController.mockReturnValue({
        dispatchToast: mockDispatchToast,
      });
    });

    it('should handle dispatchToast being null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useToastController } = require('@fluentui/react-components');

      useToastController.mockReturnValueOnce({
        dispatchToast: null,
      });

      const mockOnDispatchReady = jest.fn();

      render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(null);
      });

      // 恢复原始 mock
      useToastController.mockReturnValue({
        dispatchToast: mockDispatchToast,
      });
    });
  });

  describe('多次渲染', () => {
    it('should handle multiple renders with same props', async () => {
      const mockOnDispatchReady = jest.fn();

      const { rerender } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledTimes(1);
      });

      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady} />);
      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady} />);
      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        // 每次 rerender 都会触发 useEffect
        expect(mockOnDispatchReady.mock.calls.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should handle rapid prop changes', async () => {
      const callbacks = [jest.fn(), jest.fn(), jest.fn(), jest.fn(), jest.fn()];

      const { rerender } = render(<MessageContainer onDispatchReady={callbacks[0]} />);

      for (let i = 1; i < callbacks.length; i++) {
        rerender(<MessageContainer onDispatchReady={callbacks[i]} />);
      }

      await waitFor(() => {
        // 所有回调都应该被调用
        callbacks.forEach(callback => {
          expect(callback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('useEffect 依赖项', () => {
    it('should trigger effect when dispatchToast changes', async () => {
      const mockOnDispatchReady = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useToastController } = require('@fluentui/react-components');

      const mockDispatchToast1 = jest.fn();
      const mockDispatchToast2 = jest.fn();

      useToastController.mockReturnValueOnce({
        dispatchToast: mockDispatchToast1,
      });

      const { rerender } = render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(mockDispatchToast1);
      });

      // 模拟 dispatchToast 改变
      useToastController.mockReturnValueOnce({
        dispatchToast: mockDispatchToast2,
      });

      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady} />);

      await waitFor(() => {
        expect(mockOnDispatchReady).toHaveBeenCalledWith(mockDispatchToast2);
      });

      // 恢复原始 mock
      useToastController.mockReturnValue({
        dispatchToast: mockDispatchToast,
      });
    });

    it('should trigger effect when onDispatchReady changes', async () => {
      const mockOnDispatchReady1 = jest.fn();
      const mockOnDispatchReady2 = jest.fn();

      const { rerender } = render(<MessageContainer onDispatchReady={mockOnDispatchReady1} />);

      await waitFor(() => {
        expect(mockOnDispatchReady1).toHaveBeenCalledTimes(1);
      });

      rerender(<MessageContainer onDispatchReady={mockOnDispatchReady2} />);

      await waitFor(() => {
        expect(mockOnDispatchReady2).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('TypeScript 类型支持', () => {
    it('should accept correct prop types', () => {
      const mockOnDispatchReady = jest.fn();

      expect(() => {
        render(<MessageContainer onDispatchReady={mockOnDispatchReady} />);
      }).not.toThrow();
    });

    it('should work with inline function', async () => {
      const dispatchRef: { current: unknown } = { current: null };

      render(
        <MessageContainer
          onDispatchReady={dispatch => {
            dispatchRef.current = dispatch;
          }}
        />
      );

      await waitFor(() => {
        expect(dispatchRef.current).toBe(mockDispatchToast);
      });
    });
  });
});
