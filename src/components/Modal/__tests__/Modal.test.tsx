import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../Modal';

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  Dialog: ({ children, open, modalType }: { children: React.ReactNode; open: boolean; modalType: string }) =>
    open ? (
      <div data-testid='dialog' data-modal-type={modalType}>
        {children}
      </div>
    ) : null,
  DialogSurface: ({
    children,
    className,
    style,
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div data-testid='dialog-surface' className={className} style={style}>
      {children}
    </div>
  ),
  DialogBody: ({ children }: { children: React.ReactNode }) => <div data-testid='dialog-body'>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div data-testid='dialog-title'>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid='dialog-content'>{children}</div>,
  DialogActions: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid='dialog-actions' className={className}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid='dialog-trigger'>{children}</div>,
  Button: ({
    children,
    appearance,
    onClick,
    icon,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    appearance?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }) => (
    <button data-testid='button' data-appearance={appearance} onClick={onClick} className={className} {...props}>
      {icon}
      {children}
    </button>
  ),
}));

// Mock @fluentui/react-icons
jest.mock('@fluentui/react-icons', () => ({
  DismissFilled: () => <span data-testid='dismiss-icon'>×</span>,
}));

// Mock static methods
jest.mock('../utils', () => ({
  info: jest.fn(() => ({ destroy: jest.fn() })),
  success: jest.fn(() => ({ destroy: jest.fn() })),
  error: jest.fn(() => ({ destroy: jest.fn() })),
  warning: jest.fn(() => ({ destroy: jest.fn() })),
  confirm: jest.fn(() => ({ destroy: jest.fn() })),
}));

describe('Modal Component', () => {
  describe('基础渲染', () => {
    it('should render correctly when open', () => {
      render(
        <Modal open={true} title='Test Modal'>
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-surface')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Modal');
      expect(screen.getByTestId('dialog-content')).toHaveTextContent('Modal content');
    });

    it('should not render when closed', () => {
      render(
        <Modal open={false} title='Test Modal'>
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('should render with default open state (false)', () => {
      render(
        <Modal title='Test Modal'>
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('should apply custom className and style', () => {
      const customStyle = { width: '600px', height: '400px' };
      render(
        <Modal open={true} className='custom-modal' style={customStyle}>
          <div>Content</div>
        </Modal>
      );

      const surface = screen.getByTestId('dialog-surface');
      expect(surface).toHaveClass('fluentui-plus-modal', 'custom-modal');
      expect(surface).toHaveStyle('width: 600px');
      expect(surface).toHaveStyle('height: 400px');
    });
  });

  describe('关闭功能', () => {
    it('should render close button when closable is true (default)', () => {
      render(
        <Modal open={true} title='Test Modal'>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('dismiss-icon')).toBeInTheDocument();
    });

    it('should not render close button when closable is false', () => {
      render(
        <Modal open={true} closable={false} title='Test Modal'>
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByTestId('dialog-trigger')).not.toBeInTheDocument();
      expect(screen.queryByTestId('dismiss-icon')).not.toBeInTheDocument();
    });

    it('should call onCancel when close button is clicked', () => {
      const handleCancel = jest.fn();
      render(
        <Modal open={true} onCancel={handleCancel}>
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getAllByTestId('button').find(btn => btn.className?.includes('close'));
      fireEvent.click(closeButton!);

      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should render custom close icon', () => {
      const CustomIcon = () => <span data-testid='custom-close-icon'>✕</span>;
      render(
        <Modal open={true} closeIcon={<CustomIcon />}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('custom-close-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('dismiss-icon')).not.toBeInTheDocument();
    });
  });

  describe('模态类型', () => {
    it('should render as modal when mask is true (default)', () => {
      render(
        <Modal open={true}>
          <div>Content</div>
        </Modal>
      );

      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-modal-type', 'modal');
    });

    it('should render as non-modal when mask is false', () => {
      render(
        <Modal open={true} mask={false}>
          <div>Content</div>
        </Modal>
      );

      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-modal-type', 'non-modal');
    });
  });

  describe('标题渲染', () => {
    it('should render title when provided', () => {
      render(
        <Modal open={true} title='Modal Title'>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Modal Title');
    });

    it('should render React node as title', () => {
      render(
        <Modal open={true} title={<span data-testid='custom-title'>Custom Title</span>}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('custom-title')).toHaveTextContent('Custom Title');
    });

    it('should not render DialogTitle when title is not provided', () => {
      render(
        <Modal open={true}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByTestId('dialog-title')).not.toBeInTheDocument();
    });
  });

  describe('底部操作区', () => {
    it('should render default footer with OK and Cancel buttons', () => {
      render(
        <Modal open={true}>
          <div>Content</div>
        </Modal>
      );

      const buttons = screen.getAllByTestId('button').filter(
        btn => !btn.className?.includes('close') // 排除关闭按钮
      );

      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('取消');
      expect(buttons[0]).toHaveAttribute('data-appearance', 'secondary');
      expect(buttons[1]).toHaveTextContent('确定');
      expect(buttons[1]).toHaveAttribute('data-appearance', 'primary');
    });

    it('should customize OK button text and type', () => {
      render(
        <Modal open={true} okText='保存' okType='outline'>
          <div>Content</div>
        </Modal>
      );

      const buttons = screen.getAllByTestId('button').filter(btn => !btn.className?.includes('close'));

      const okButton = buttons.find(btn => btn.textContent === '保存');
      expect(okButton).toHaveAttribute('data-appearance', 'outline');
    });

    it('should call onOk when OK button is clicked', () => {
      const handleOk = jest.fn();
      render(
        <Modal open={true} onOk={handleOk}>
          <div>Content</div>
        </Modal>
      );

      const buttons = screen.getAllByTestId('button').filter(btn => !btn.className?.includes('close'));
      const okButton = buttons.find(btn => btn.textContent === '确定');

      fireEvent.click(okButton!);
      expect(handleOk).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when Cancel button is clicked', () => {
      const handleCancel = jest.fn();
      render(
        <Modal open={true} onCancel={handleCancel}>
          <div>Content</div>
        </Modal>
      );

      const buttons = screen.getAllByTestId('button').filter(btn => !btn.className?.includes('close'));
      const cancelButton = buttons.find(btn => btn.textContent === '取消');

      fireEvent.click(cancelButton!);
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should pass button props correctly', () => {
      render(
        <Modal open={true} okButtonProps={{ disabled: true } as any} cancelButtonProps={{ disabled: true } as any}>
          <div>Content</div>
        </Modal>
      );

      const buttons = screen.getAllByTestId('button').filter(btn => !btn.className?.includes('close'));

      expect(buttons[0]).toBeDisabled(); // Cancel button
      expect(buttons[1]).toBeDisabled(); // OK button
    });
  });

  describe('自定义底部', () => {
    it('should not render footer when footer is null', () => {
      render(
        <Modal open={true} footer={null}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.queryByTestId('dialog-actions')).not.toBeInTheDocument();
    });

    it('should render custom footer element', () => {
      render(
        <Modal open={true} footer={<div data-testid='custom-footer'>Custom Footer</div>}>
          <div>Content</div>
        </Modal>
      );

      expect(screen.getByTestId('custom-footer')).toHaveTextContent('Custom Footer');
      expect(screen.getByTestId('dialog-actions')).toBeInTheDocument();
    });

    it('should render footer function with original node and components', () => {
      const footerRender = jest.fn((originNode, { OkBtn, CancelBtn }) => (
        <div data-testid='custom-footer'>
          <CancelBtn />
          <span>Custom Content</span>
          <OkBtn />
        </div>
      ));

      render(
        <Modal open={true} footer={footerRender}>
          <div>Content</div>
        </Modal>
      );

      expect(footerRender).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          OkBtn: expect.any(Function),
          CancelBtn: expect.any(Function),
        })
      );
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('CSS 类名', () => {
    it('should apply correct CSS classes', () => {
      render(
        <Modal open={true} className='custom-class'>
          <div>Content</div>
        </Modal>
      );

      const surface = screen.getByTestId('dialog-surface');
      expect(surface).toHaveClass('fluentui-plus-modal');
      expect(surface).toHaveClass('custom-class');
    });

    it('should apply close button class', () => {
      render(
        <Modal open={true}>
          <div>Content</div>
        </Modal>
      );

      const closeButton = screen.getAllByTestId('button').find(btn => btn.className?.includes('close'));
      expect(closeButton).toHaveClass('fluentui-plus-modal__close');
    });

    it('should apply footer class', () => {
      render(
        <Modal open={true}>
          <div>Content</div>
        </Modal>
      );

      const footer = screen.getByTestId('dialog-actions');
      expect(footer).toHaveClass('fluentui-plus-modal__footer');
    });
  });

  describe('静态方法', () => {
    it('should have static methods attached', () => {
      expect(Modal.info).toBeDefined();
      expect(Modal.success).toBeDefined();
      expect(Modal.error).toBeDefined();
      expect(Modal.warning).toBeDefined();
      expect(Modal.confirm).toBeDefined();
    });

    it('should call static methods correctly', () => {
      const mockInfo = jest.requireMock('../utils').info;

      Modal.info({ content: 'Info message' });

      expect(mockInfo).toHaveBeenCalledWith({ content: 'Info message' });
    });
  });

  describe('边界情况', () => {
    it('should handle missing event handlers gracefully', () => {
      expect(() => {
        render(
          <Modal open={true}>
            <div>Content</div>
          </Modal>
        );
      }).not.toThrow();
    });

    it('should handle empty children', () => {
      render(<Modal open={true} />);

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-content')).toBeEmptyDOMElement();
    });

    it('should handle complex children content', () => {
      render(
        <Modal open={true}>
          <div>
            <h2>Title</h2>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </Modal>
      );

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Title');
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
    });
  });
});
