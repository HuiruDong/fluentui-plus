import React, { useRef, useCallback, useState } from 'react';
import clsx from 'clsx';
import type { UploadDraggerProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-upload';

const UploadDragger: React.FC<UploadDraggerProps> = ({
  accept,
  multiple = false,
  disabled = false,
  beforeUpload,
  onChange,
  onDrop,
  className,
  style,
  height,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // 根据 accept 属性过滤文件类型
  const filterFilesByAccept = useCallback(
    (files: File[]): File[] => {
      if (!accept) return files;

      const acceptTypes = accept.split(',').map(t => t.trim());
      return files.filter(file => {
        return acceptTypes.some(type => {
          if (type.startsWith('.')) {
            // 文件扩展名匹配
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.endsWith('/*')) {
            // MIME 类型通配符匹配
            return file.type.startsWith(type.slice(0, -2));
          } else {
            // 完整 MIME 类型匹配
            return file.type === type;
          }
        });
      });
    },
    [accept]
  );

  // 使用 beforeUpload 验证文件
  const validateFiles = useCallback(
    async (files: File[]): Promise<File[]> => {
      if (!beforeUpload) return files;

      const validationResults = await Promise.all(
        files.map(async file => {
          try {
            const result = await beforeUpload(file, files);
            return result ? file : null;
          } catch {
            return null;
          }
        })
      );
      return validationResults.filter((file): file is File => file !== null);
    },
    [beforeUpload]
  );

  // 统一处理文件：验证并触发 onChange
  const processFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const validFiles = await validateFiles(files);

      if (validFiles.length > 0 && onChange) {
        onChange(validFiles);
      }
    },
    [validateFiles, onChange]
  );

  // 处理文件选择（点击上传）
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (files.length === 0) return;

      // 如果不支持多选，只取第一个文件
      const selectedFiles = multiple ? files : [files[0]];

      // 根据 accept 过滤文件类型
      const filteredFiles = filterFilesByAccept(selectedFiles);

      // 统一处理文件
      await processFiles(filteredFiles);

      // 重置 input，允许选择相同的文件
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [multiple, filterFilesByAccept, processFiles]
  );

  // 点击触发文件选择
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  }, [disabled]);

  // 拖拽进入
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setDragActive(true);
      }
    },
    [disabled]
  );

  // 拖拽离开
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  // 文件放下
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) {
        return;
      }

      // 触发 onDrop 回调
      if (onDrop) {
        onDrop(e);
      }

      const files = Array.from(e.dataTransfer.files);

      if (files.length === 0) {
        return;
      }

      // 如果不支持多选，只取第一个文件
      const selectedFiles = multiple ? files : [files[0]];

      // 根据 accept 过滤文件类型
      const filteredFiles = filterFilesByAccept(selectedFiles);

      // 统一处理文件
      await processFiles(filteredFiles);
    },
    [disabled, multiple, onDrop, filterFilesByAccept, processFiles]
  );

  return (
    <div
      className={clsx(
        prefixCls,
        `${prefixCls}-dragger`,
        {
          [`${prefixCls}-dragger-active`]: dragActive,
          [`${prefixCls}-dragger-disabled`]: disabled,
        },
        className
      )}
      style={{ ...style, height }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className={`${prefixCls}-input`}
      />
      <div className={`${prefixCls}-dragger-content`}>{children}</div>
    </div>
  );
};

export default UploadDragger;
