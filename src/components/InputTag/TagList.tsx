import React, { useCallback } from 'react';
import { Tag } from '..';
import type { TagListProps } from './types';

const prefixCls = 'fluentui-plus-input-tag__item';

const TagList: React.FC<TagListProps> = ({ tags, disabled = false, tagClosable = true, onTagRemove, renderTag }) => {
  // 使用 useCallback 优化标签移除处理函数
  const handleTagRemove = useCallback(
    (tag: string, index: number) => {
      return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        if (!disabled) {
          onTagRemove?.(tag, index);
        }
      };
    },
    [disabled, onTagRemove]
  );

  return (
    <>
      {tags.map((tag, index) => {
        // 优化 key 生成，避免使用随机数
        const tagKey = `tag-${index}-${tag}`;

        if (renderTag) {
          return (
            <React.Fragment key={tagKey}>
              {renderTag(tag, index, () => !disabled && onTagRemove?.(tag, index))}
            </React.Fragment>
          );
        }

        return (
          <Tag
            key={tagKey}
            className={prefixCls}
            closeIcon={tagClosable && !disabled}
            onClose={!disabled ? handleTagRemove(tag, index) : undefined}
          >
            {tag}
          </Tag>
        );
      })}
    </>
  );
};

export default TagList;
