import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { DismissFilled } from '@fluentui/react-icons';
import CheckableTag from './CheckableTag';
import type { TagProps, CheckableTagProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-tag';

const Tag: React.FC<TagProps> & { CheckableTag?: typeof CheckableTag } = ({ children, ...props }) => {
  const { closeIcon = false, color, bordered = true, className, style, onClick, onClose } = props;

  const cs = useMemo(
    () =>
      clsx(
        prefixCls,
        {
          [`${prefixCls}--bordered`]: bordered,
          [`${prefixCls}--borderless`]: !bordered,
        },
        className
      ),
    [bordered, className]
  );

  const renderCloseIcon = useCallback(() => {
    if (closeIcon) {
      return (
        <span
          className={`${prefixCls}__close`}
          onClick={evt => {
            evt.stopPropagation();
            onClose?.(evt);
          }}
        >
          {typeof closeIcon === 'boolean' ? <DismissFilled /> : closeIcon}
        </span>
      );
    }

    return null;
  }, [closeIcon, onClose]);

  return (
    <span
      className={cs}
      style={{
        ...style,
        backgroundColor: color ?? style?.backgroundColor,
        color: color ? '#fff' : '',
        border: bordered ? '' : 'none',
      }}
      onClick={evt => {
        evt.stopPropagation();
        onClick?.(evt);
      }}
    >
      <span className={`${prefixCls}__content`}>{children}</span>
      {renderCloseIcon()}
    </span>
  );
};

interface TagComponentType extends React.FC<TagProps> {
  CheckableTag: React.FC<CheckableTagProps>;
}

const TagComponent: TagComponentType = Tag as TagComponentType;
TagComponent.CheckableTag = CheckableTag;

export default TagComponent;
export type { TagProps } from './types';
