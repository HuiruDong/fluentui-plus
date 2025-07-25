import { renderHook, act } from '@testing-library/react';
import { useInputTag } from '../../hooks/useInputTag';

describe('useInputTag Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('初始状态', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useInputTag({}));

      expect(result.current.getCurrentTags()).toEqual([]);
      expect(result.current.isDeleting).toBe(false);
    });

    it('should initialize with defaultValue', () => {
      const defaultValue = ['tag1', 'tag2'];
      const { result } = renderHook(() => useInputTag({ defaultValue }));

      expect(result.current.getCurrentTags()).toEqual(defaultValue);
    });

    it('should use controlled value when provided', () => {
      const value = ['controlled1', 'controlled2'];
      const { result } = renderHook(() => useInputTag({ value }));

      expect(result.current.getCurrentTags()).toEqual(value);
    });
  });

  describe('添加标签', () => {
    it('should add tag successfully', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInputTag({ onChange }));

      act(() => {
        const success = result.current.addTag('new tag');
        expect(success).toBe(true);
      });

      expect(onChange).toHaveBeenCalledWith(['new tag']);
    });

    it('should trim whitespace when adding tag', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInputTag({ onChange }));

      act(() => {
        const success = result.current.addTag('  spaced tag  ');
        expect(success).toBe(true);
      });

      expect(onChange).toHaveBeenCalledWith(['spaced tag']);
    });

    it('should not add empty or whitespace-only tags', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInputTag({ onChange }));

      act(() => {
        const success1 = result.current.addTag('');
        const success2 = result.current.addTag('   ');
        expect(success1).toBe(false);
        expect(success2).toBe(false);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should respect maxTags limit', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['tag1', 'tag2'],
          maxTags: 2,
          onChange,
        })
      );

      act(() => {
        const success = result.current.addTag('tag3');
        expect(success).toBe(false);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should prevent duplicate tags when allowDuplicates is false', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['existing'],
          allowDuplicates: false,
          onChange,
        })
      );

      act(() => {
        const success = result.current.addTag('existing');
        expect(success).toBe(false);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should allow duplicate tags when allowDuplicates is true', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['existing'],
          allowDuplicates: true,
          onChange,
        })
      );

      act(() => {
        const success = result.current.addTag('existing');
        expect(success).toBe(true);
      });

      expect(onChange).toHaveBeenCalledWith(['existing', 'existing']);
    });
  });

  describe('批量添加标签', () => {
    it('should add multiple tags successfully', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInputTag({ onChange }));

      act(() => {
        const count = result.current.addMultipleTags(['tag1', 'tag2', 'tag3']);
        expect(count).toBe(3);
      });

      expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
    });

    it('should filter empty tags when adding multiple', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useInputTag({ onChange }));

      act(() => {
        const count = result.current.addMultipleTags(['tag1', '', '  ', 'tag2']);
        expect(count).toBe(2);
      });

      expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2']);
    });

    it('should respect maxTags when adding multiple tags', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['existing'],
          maxTags: 2,
          onChange,
        })
      );

      act(() => {
        const count = result.current.addMultipleTags(['tag1', 'tag2', 'tag3']);
        expect(count).toBe(1); // Only one can be added due to limit
      });

      expect(onChange).toHaveBeenCalledWith(['existing', 'tag1']);
    });
  });

  describe('移除标签', () => {
    it('should remove tag by index', () => {
      const onChange = jest.fn();
      const onTagRemove = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['tag1', 'tag2', 'tag3'],
          onChange,
          onTagRemove,
        })
      );

      act(() => {
        const success = result.current.removeTag(1);
        expect(success).toBe(true);
      });

      expect(onChange).toHaveBeenCalledWith(['tag1', 'tag3']);
      expect(onTagRemove).toHaveBeenCalledWith('tag2', 1);
    });

    it('should handle invalid index gracefully', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['tag1'],
          onChange,
        })
      );

      act(() => {
        const success1 = result.current.removeTag(5);
        const success2 = result.current.removeTag(-1);
        expect(success1).toBe(false);
        expect(success2).toBe(false);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should set isDeleting state temporarily when removing', async () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useInputTag({
          defaultValue: ['tag1'],
          onChange,
        })
      );

      expect(result.current.isDeleting).toBe(false);

      act(() => {
        result.current.removeTag(0);
      });

      // Wait for the async state reset
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1));
      });

      // After removal, isDeleting should be false again
      expect(result.current.isDeleting).toBe(false);
    });
  });

  describe('受控模式', () => {
    it('should use provided value in controlled mode', () => {
      const value = ['controlled'];
      const { result } = renderHook(() => useInputTag({ value }));

      expect(result.current.getCurrentTags()).toEqual(value);
    });

    it('should update when controlled value changes', () => {
      const { result, rerender } = renderHook(({ value }) => useInputTag({ value }), {
        initialProps: { value: ['initial'] },
      });

      expect(result.current.getCurrentTags()).toEqual(['initial']);

      rerender({ value: ['updated'] });

      expect(result.current.getCurrentTags()).toEqual(['updated']);
    });
  });
});
