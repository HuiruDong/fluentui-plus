import { renderHook, act } from '@testing-library/react';
import { useTagManager } from '../useTagManager';

describe('useTagManager', () => {
  it('should manage tags correctly', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useTagManager({
        defaultValue: ['tag1'],
        onChange,
        maxTags: 3,
        allowDuplicates: false,
      })
    );

    // 初始状态
    expect(result.current.getCurrentTags()).toEqual(['tag1']);

    // 添加标签
    act(() => {
      result.current.addTag('tag2');
    });

    expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2']);

    // 添加重复标签应该失败
    act(() => {
      const success = result.current.addTag('tag1');
      expect(success).toBe(false);
    });

    // 删除标签
    act(() => {
      result.current.removeTag(0);
    });

    expect(onChange).toHaveBeenCalledWith(['tag2']);

    // 批量添加标签
    act(() => {
      result.current.addMultipleTags(['tag3', 'tag4']);
    });

    expect(onChange).toHaveBeenCalledWith(['tag2', 'tag3', 'tag4']);

    // 超过最大数量应该失败
    act(() => {
      const success = result.current.addTag('tag5');
      expect(success).toBe(false);
    });
  });

  it('should work in controlled mode', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useTagManager({
        value: ['controlled1', 'controlled2'],
        onChange,
      })
    );

    expect(result.current.getCurrentTags()).toEqual(['controlled1', 'controlled2']);

    act(() => {
      result.current.addTag('controlled3');
    });

    expect(onChange).toHaveBeenCalledWith(['controlled1', 'controlled2', 'controlled3']);
  });
});
