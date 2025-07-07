import React from 'react';
import { Tag } from '..';
import type { TagListProps } from './types';

const prefixCls = 'mm-input-tag__item';

const TagList: React.FC<TagListProps> = ({ tags, disabled = false, tagClosable = true, onTagRemove, renderTag }) => {
  return (
    <>
      {tags.map((tag, index) => {
        const tagKey = `tag-${index}-${tag}-${Math.random().toString(36).substring(2, 8)}`;

        if (renderTag) {
          return (
            <React.Fragment key={tagKey}>
              {renderTag(tag, index, () => !disabled && onTagRemove?.(tag, index))}
            </React.Fragment>
          );
        }

        const handleClose = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          e.stopPropagation();
          if (!disabled) {
            onTagRemove?.(tag, index);
          }
        };

        return (
          <Tag
            key={tagKey}
            className={prefixCls}
            closeIcon={tagClosable && !disabled}
            onClose={!disabled ? handleClose : undefined}
          >
            {tag}
          </Tag>
        );
      })}
    </>
  );
};

export default TagList;
