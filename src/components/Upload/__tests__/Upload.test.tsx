import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Upload from '../Upload';

describe('Upload Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(
        <Upload>
          <button>Upload File</button>
        </Upload>
      );

      const button = screen.getByText('Upload File');
      expect(button).toBeInTheDocument();

      const container = button.closest('.fluentui-plus-upload');
      expect(container).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Upload>
          <span>Custom Upload Button</span>
        </Upload>
      );

      expect(screen.getByText('Custom Upload Button')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Upload className='custom-upload'>
          <button>Upload</button>
        </Upload>
      );

      const container = screen.getByText('Upload').closest('.fluentui-plus-upload');
      expect(container).toHaveClass('custom-upload');
    });

    it('should apply custom styles', () => {
      const customStyle = { padding: '20px', margin: '10px' };
      render(
        <Upload style={customStyle}>
          <button>Upload</button>
        </Upload>
      );

      const container = screen.getByText('Upload').closest('.fluentui-plus-upload');
      expect(container).toHaveStyle('padding: 20px');
      expect(container).toHaveStyle('margin: 10px');
    });
  });

  describe('禁用状态', () => {
    it('should apply disabled class when disabled is true', () => {
      render(
        <Upload disabled>
          <button>Upload</button>
        </Upload>
      );

      const container = screen.getByText('Upload').closest('.fluentui-plus-upload');
      expect(container).toHaveClass('fluentui-plus-upload-disabled');
    });

    it('should not trigger file input when disabled', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <Upload disabled onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const button = screen.getByText('Upload');
      await user.click(button);

      // 禁用状态下不应触发 onChange
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should disable file input when disabled is true', () => {
      render(
        <Upload disabled>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeDisabled();
    });
  });

  describe('文件选择', () => {
    it('should trigger file input when clicking trigger element', async () => {
      const user = userEvent.setup();
      render(
        <Upload>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = jest.spyOn(fileInput, 'click');

      const button = screen.getByText('Upload');
      await user.click(button);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should accept specified file types', () => {
      render(
        <Upload accept='image/*'>
          <button>Upload Image</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('should support multiple file selection', () => {
      render(
        <Upload multiple>
          <button>Upload Multiple</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('should not support multiple files by default', () => {
      render(
        <Upload>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).not.toHaveAttribute('multiple');
    });

    it('should call onChange with selected files', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });

    it('should call onChange with multiple files when multiple is true', async () => {
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      render(
        <Upload multiple onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, [file1, file2]);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file1, file2]);
      });
    });

    it('should reset input value after file selection', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(fileInput.value).toBe('');
      });
    });
  });

  describe('beforeUpload 钩子', () => {
    it('should call beforeUpload before onChange', async () => {
      const beforeUpload = jest.fn().mockReturnValue(true);
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

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
        <Upload beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

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
        <Upload beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledWith(file, [file]);
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });

    it('should not call onChange when beforeUpload rejects', async () => {
      const beforeUpload = jest.fn().mockRejectedValue(new Error('Validation failed'));
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledWith(file, [file]);
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should filter files based on beforeUpload validation', async () => {
      const beforeUpload = jest.fn((file: File) => {
        // 只允许 txt 文件通过
        return file.name.endsWith('.txt');
      });
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.jpg', { type: 'image/jpeg' });

      render(
        <Upload multiple beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, [file1, file2]);

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        // 只有 file1 通过验证
        expect(onChange).toHaveBeenCalledWith([file1]);
      });
    });

    it('should not call onChange when all files are filtered by beforeUpload', async () => {
      const beforeUpload = jest.fn().mockReturnValue(false);
      const onChange = jest.fn();
      const file1 = new File(['content1'], 'test1.txt', { type: 'text/plain' });
      const file2 = new File(['content2'], 'test2.txt', { type: 'text/plain' });

      render(
        <Upload multiple beforeUpload={beforeUpload} onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, [file1, file2]);

      await waitFor(() => {
        expect(beforeUpload).toHaveBeenCalledTimes(2);
        expect(onChange).not.toHaveBeenCalled();
      });
    });
  });

  describe('边界情况', () => {
    it('should not call onChange when no files are selected', async () => {
      const onChange = jest.fn();

      render(
        <Upload onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // 模拟选择文件但取消操作（files 为空）
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false,
      });

      fileInput.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(onChange).not.toHaveBeenCalled();
      });
    });

    it('should work without onChange callback', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      // 不应该抛出错误
      expect(async () => {
        await userEvent.upload(fileInput, file);
      }).not.toThrow();
    });

    it('should work without beforeUpload callback', async () => {
      const onChange = jest.fn();
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      render(
        <Upload onChange={onChange}>
          <button>Upload</button>
        </Upload>
      );

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([file]);
      });
    });
  });
});
