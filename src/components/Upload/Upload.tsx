import React, { useRef, useCallback } from 'react';
import clsx from 'clsx';
import type { UploadProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-upload';

const Upload: React.FC<UploadProps> = ({
  accept,
  multiple = false,
  disabled = false,
  beforeUpload,
  onChange,
  className,
  style,
  children,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (files.length === 0) {
        return;
      }

      // 如果有 beforeUpload，对每个文件进行验证
      let validFiles = files;
      if (beforeUpload) {
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
        validFiles = validationResults.filter((file): file is File => file !== null);
      }

      // 触发 onChange，传入通过验证的文件
      if (validFiles.length > 0 && onChange) {
        onChange(validFiles);
      }

      // 重置 input，允许选择相同的文件
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [beforeUpload, onChange]
  );

  // 点击触发文件选择
  const handleClick = useCallback(() => {
    if (disabled) {
      return;
    }
    inputRef.current?.click();
  }, [disabled]);

  return (
    <div
      className={clsx(
        prefixCls,
        {
          [`${prefixCls}-disabled`]: disabled,
        },
        className
      )}
      style={style}
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
      <div className={`${prefixCls}-trigger`} onClick={handleClick}>
        {children}
      </div>
    </div>
  );
};

export default Upload;
