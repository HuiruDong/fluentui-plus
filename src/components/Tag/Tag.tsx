import React, { PropsWithChildren, useCallback } from 'react';
import { DismissFilled } from '@fluentui/react-icons';
import CheckableTag, { CheckableTagProps } from './CheckableTag';
import { StyledTag, TagContent, TagClose } from './Tag.styles';
import clsx from 'clsx';

export interface TagProps extends PropsWithChildren {
  closeIcon?: boolean | React.ReactNode;
  color?: string;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const Tag: React.FC<TagProps> & { CheckableTag?: typeof CheckableTag } = ({
  children,
  ...props
}) => {
  const { closeIcon = false, color, bordered = true, className, style, onClick, onClose } = props;

  const renderCloseIcon = useCallback(() => {
    if (closeIcon) {
      return (
        <TagClose
          onClick={(evt) => {
            evt.stopPropagation();
            onClose?.(evt);
          }}
        >
          {typeof closeIcon === 'boolean' ? <DismissFilled /> : closeIcon}
        </TagClose>
      );
    }

    return null;
  }, [closeIcon, onClose]);

  return (
    <StyledTag
      className={clsx('fluentui-plus-tag', className)}
      style={{
        ...style,
        backgroundColor: color ?? style?.backgroundColor,
        color: color ? '#fff' : '',
      }}
      bordered={bordered}
      onClick={(evt) => {
        evt.stopPropagation();
        onClick?.(evt);
      }}
    >
      <TagContent>{children}</TagContent>
      {renderCloseIcon()}
    </StyledTag>
  );
};

interface TagComponent extends React.FC<TagProps> {
  CheckableTag: React.FC<CheckableTagProps>;
}

const TagComponent: TagComponent = Tag as TagComponent;
TagComponent.CheckableTag = CheckableTag;

export default TagComponent;
