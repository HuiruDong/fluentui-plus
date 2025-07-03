import React, { PropsWithChildren, useCallback, useMemo } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { DismissFilled } from '@fluentui/react-icons';
import CheckableTag, { CheckableTagProps } from './CheckableTag';
import './index.less';

const prefixCls = 'mm-tag';

export interface TagProps extends PropsWithChildren {
  closeIcon?: boolean | React.ReactNode;
  color?: string;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Tag: React.FC<TagProps> & { CheckableTag?: typeof CheckableTag } = ({ children, ...props }) => {
  const { closeIcon = false, color, bordered = true, className, style, onClick, onClose } = props;

  const cs = useMemo(
    () => mergeClasses(prefixCls, bordered ? `${prefixCls}--bordered` : `${prefixCls}--borderless`, className),
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
