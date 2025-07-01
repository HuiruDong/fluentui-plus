import React from 'react';
import type { TagProps } from './Tag';
import { StyledCheckableTag, TagContent } from './Tag.styles';
import clsx from 'clsx';

export interface CheckableTagProps extends Omit<TagProps, 'onClick'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckableTag: React.FC<CheckableTagProps> = ({
  checked,
  onChange,
  children,
  className,
  ...props
}) => {
  return (
    <StyledCheckableTag 
      {...props} 
      className={clsx('fluentui-plus-checkable-tag', className)} 
      checked={checked}
      onClick={() => onChange?.(!checked)}
    >
      <TagContent>{children}</TagContent>
    </StyledCheckableTag>
  );
};

export default CheckableTag;
