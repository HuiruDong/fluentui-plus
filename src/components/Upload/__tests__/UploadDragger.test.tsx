import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UploadDragger from '../UploadDragger';

describe('UploadDragger Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(
        <UploadDragger>
          <div>Drag files here</div>
        </UploadDragger>
      );

      const content = screen.getByText('Drag files here');
      expect(content).toBeInTheDocument();

      const container = content.closest('.fluentui-plus-upload-dragger');
      expect(container).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <UploadDragger>
          <span>Drop zone content</span>
        </UploadDragger>
      );

      expect(screen.getByText('Drop zone content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <UploadDragger className='custom-dragger'>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      expect(container).toHaveClass('custom-dragger');
    });

    it('should apply custom styles', () => {
      const customStyle = { padding: '30px', border: '2px dashed red' };
      render(
        <UploadDragger style={customStyle}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      expect(container).toHaveStyle('padding: 30px');
      expect(container).toHaveStyle('border: 2px dashed red');
    });

    it('should apply custom height', () => {
      render(
        <UploadDragger height={300}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      expect(container).toHaveStyle('height: 300px');
    });

    it('should apply height as string', () => {
      render(
        <UploadDragger height='50vh'>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      expect(container).toHaveStyle('height: 50vh');
    });
  });

  describe('禁用状态', () => {
    it('should apply disabled class when disabled is true', () => {
      render(
        <UploadDragger disabled>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      expect(container).toHaveClass('fluentui-plus-upload-dragger-disabled');
    });

    it('should not trigger file input when clicking on disabled dragger', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <UploadDragger disabled onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      await user.click(container!);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not show drag active state when disabled', () => {
      render(
        <UploadDragger disabled>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.dragOver(container!, {
        dataTransfer: {
          files: [],
        },
      });

      expect(container).not.toHaveClass('fluentui-plus-upload-dragger-active');
    });

    it('should disable file input when disabled is true', () => {
      render(
        <UploadDragger disabled>
          <div>Drag files</div>
        </UploadDragger>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeDisabled();
    });
  });

  describe('拖拽交互', () => {
    it('should show active state on drag over', () => {
      render(
        <UploadDragger>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.dragOver(container!, {
        dataTransfer: {
          files: [],
        },
      });

      expect(container).toHaveClass('fluentui-plus-upload-dragger-active');
    });

    it('should remove active state on drag leave', () => {
      render(
        <UploadDragger>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.dragOver(container!, {
        dataTransfer: {
          files: [],
        },
      });
      expect(container).toHaveClass('fluentui-plus-upload-dragger-active');

      fireEvent.dragLeave(container!, {
        dataTransfer: {
          files: [],
        },
      });
      expect(container).not.toHaveClass('fluentui-plus-upload-dragger-active');
    });

    it('should remove active state on drop', () => {
      render(
        <UploadDragger>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.dragOver(container!, {
        dataTransfer: {
          files: [],
        },
      });
      expect(container).toHaveClass('fluentui-plus-upload-dragger-active');

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(container).not.toHaveClass('fluentui-plus-upload-dragger-active');
    });

    it('should call onDrop when files are dropped', () => {
      const onDrop = jest.fn();

      render(
        <UploadDragger onDrop={onDrop}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      expect(onDrop).toHaveBeenCalled();
    });
  });

  describe('文件上传', () => {
    it('should call onChange with dropped files', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });

    it('should support multiple file drop when multiple is true', async () => {
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      render(
        <UploadDragger multiple onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file1, file2],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file1, file2]);
      });
    });

    it('should only accept first file when multiple is false', async () => {
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      render(
        <UploadDragger onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file1, file2],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file1]);
      });
    });

    it('should trigger file input when clicking on dragger', async () => {
      const user = userEvent.setup();
      render(
        <UploadDragger>
          <div>Drag files</div>
        </UploadDragger>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = jest.spyOn(fileInput, 'click');

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');
      await user.click(container!);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should call onChange with clicked files', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });
  });

  describe('文件类型过滤', () => {
    it('should filter files by accept attribute with MIME type', async () => {
      const onChange = jest.fn();
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const imgFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      render(
        <UploadDragger accept='text/plain' onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [txtFile, imgFile],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([txtFile]);
      });
    });

    it('should filter files by accept attribute with file extension', async () => {
      const onChange = jest.fn();
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const pdfFile = new File(['pdf'], 'test.pdf', { type: 'application/pdf' });

      render(
        <UploadDragger accept='.txt' onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [txtFile, pdfFile],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([txtFile]);
      });
    });

    it('should filter files by accept attribute with wildcard MIME type', async () => {
      const onChange = jest.fn();
      const jpgFile = new File(['jpg'], 'test.jpg', { type: 'image/jpeg' });
      const pngFile = new File(['png'], 'test.png', { type: 'image/png' });
      const txtFile = new File(['txt'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger multiple accept='image/*' onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [jpgFile, pngFile, txtFile],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([jpgFile, pngFile]);
      });
    });

    it('should accept multiple file types', async () => {
      const onChange = jest.fn();
      const txtFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const pdfFile = new File(['pdf'], 'test.pdf', { type: 'application/pdf' });
      const jpgFile = new File(['jpg'], 'test.jpg', { type: 'image/jpeg' });

      render(
        <UploadDragger multiple accept='.txt,.pdf' onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [txtFile, pdfFile, jpgFile],
        },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([txtFile, pdfFile]);
      });
    });
  });

  describe('beforeUpload 钩子', () => {
    it('should call beforeUpload before onChange', async () => {
      const beforeUpload = jest.fn().mockReturnValue(true);
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger beforeUpload={beforeUpload} onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledWith(file, [file]);
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });

    it('should not call onChange when beforeUpload returns false', async () => {
      const beforeUpload = jest.fn().mockReturnValue(false);
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger beforeUpload={beforeUpload} onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledWith(file, [file]);
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should support async beforeUpload with Promise', async () => {
      const beforeUpload = jest.fn().mockResolvedValue(true);
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger beforeUpload={beforeUpload} onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledWith(file, [file]);
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });

    it('should filter files based on beforeUpload validation', async () => {
      const beforeUpload = jest.fn((file: File) => {
        return file.name.endsWith('.txt');
      });
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });

      render(
        <UploadDragger multiple beforeUpload={beforeUpload} onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file1, file2],
        },
      });

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenCalledWith([file1]);
      });
    });
  });

  describe('边界情况', () => {
    it('should not call onChange when no files are dropped', async () => {
      const onChange = jest.fn();

      render(
        <UploadDragger onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [],
        },
      });

      await waitFor(() => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should not call onChange when disabled and files are dropped', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger disabled onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should work without onChange callback', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <UploadDragger>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      // 不应该抛出错误
      expect(() => {
        fireEvent.drop(container!, {
          dataTransfer: {
            files: [file],
          },
        });
      }).not.toThrow();
    });

    it('should not call onChange when all files are filtered by accept', async () => {
      const onChange = jest.fn();
      const imgFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

      render(
        <UploadDragger accept='text/plain' onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [imgFile],
        },
      });

      await waitFor(() => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should not call onChange when all files are filtered by beforeUpload', async () => {
      const beforeUpload = jest.fn().mockReturnValue(false);
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      render(
        <UploadDragger multiple beforeUpload={beforeUpload} onChange={onChange}>
          <div>Drag files</div>
        </UploadDragger>
      );

      const container = screen.getByText('Drag files').closest('.fluentui-plus-upload-dragger');

      fireEvent.drop(container!, {
        dataTransfer: {
          files: [file1, file2],
        },
      });

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });
});
