import { renderHook, act } from '@testing-library/react';
import { useInputTag } from '../hooks/useInputTag';

describe('useInputTag', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useInputTag({}));

    expect(result.current.getCurrentTags()).toEqual([]);
    expect(result.current.isDeleting).toBe(false);
  });

  it('initializes with defaultValue', () => {
    const defaultValue = ['tag1', 'tag2'];
    const { result } = renderHook(() => useInputTag({ defaultValue }));

    expect(result.current.getCurrentTags()).toEqual(defaultValue);
  });

  it('uses controlled value when provided', () => {
    const value = ['controlled1', 'controlled2'];
    const { result } = renderHook(() => useInputTag({ value }));

    expect(result.current.getCurrentTags()).toEqual(value);
  });

  it('adds tag successfully', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useInputTag({ onChange }));

    act(() => {
      const success = result.current.addTag('new tag');
      expect(success).toBe(true);
    });

    expect(onChange).toHaveBeenCalledWith(['new tag']);
  });

  it('trims whitespace when adding tag', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useInputTag({ onChange }));

    act(() => {
      const success = result.current.addTag('  spaced tag  ');
      expect(success).toBe(true);
    });

    expect(onChange).toHaveBeenCalledWith(['spaced tag']);
  });

  it('does not add empty or whitespace-only tags', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useInputTag({ onChange }));

    act(() => {
      const success1 = result.current.addTag('');
      const success2 = result.current.addTag('   ');
      const success3 = result.current.addTag('\t\n');

      expect(success1).toBe(false);
      expect(success2).toBe(false);
      expect(success3).toBe(false);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects maxTags limit', () => {
    const onChange = jest.fn();
    const defaultValue = ['existing1', 'existing2'];
    const { result } = renderHook(() => useInputTag({ defaultValue, maxTags: 2, onChange }));

    act(() => {
      const success = result.current.addTag('third tag');
      expect(success).toBe(false);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('prevents duplicate tags when allowDuplicates is false', () => {
    const onChange = jest.fn();
    const defaultValue = ['existing'];
    const { result } = renderHook(() => useInputTag({ defaultValue, allowDuplicates: false, onChange }));

    act(() => {
      const success = result.current.addTag('existing');
      expect(success).toBe(false);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('allows duplicate tags when allowDuplicates is true', () => {
    const onChange = jest.fn();
    const defaultValue = ['existing'];
    const { result } = renderHook(() => useInputTag({ defaultValue, allowDuplicates: true, onChange }));

    act(() => {
      const success = result.current.addTag('existing');
      expect(success).toBe(true);
    });

    expect(onChange).toHaveBeenCalledWith(['existing', 'existing']);
  });

  it('removes tag by index', () => {
    const onChange = jest.fn();
    const onTagRemove = jest.fn();
    const defaultValue = ['tag1', 'tag2', 'tag3'];
    const { result } = renderHook(() => useInputTag({ defaultValue, onChange, onTagRemove }));

    act(() => {
      result.current.removeTag(1);
    });

    expect(onTagRemove).toHaveBeenCalledWith('tag2', 1);
    expect(onChange).toHaveBeenCalledWith(['tag1', 'tag3']);
  });

  it('sets isDeleting flag when removing tag', () => {
    const onChange = jest.fn();
    const defaultValue = ['tag1'];
    const { result } = renderHook(() => useInputTag({ defaultValue, onChange }));

    act(() => {
      result.current.removeTag(0);
    });

    expect(result.current.isDeleting).toBe(true);

    // The flag should reset after a short delay
    setTimeout(() => {
      expect(result.current.isDeleting).toBe(false);
    }, 100);
  });

  it('does not remove tag with invalid index', () => {
    const onChange = jest.fn();
    const onTagRemove = jest.fn();
    const defaultValue = ['tag1', 'tag2'];
    const { result } = renderHook(() => useInputTag({ defaultValue, onChange, onTagRemove }));

    act(() => {
      result.current.removeTag(-1);
      result.current.removeTag(5);
    });

    expect(onTagRemove).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('adds multiple tags at once', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useInputTag({ onChange }));

    act(() => {
      result.current.addMultipleTags(['tag1', 'tag2', 'tag3']);
    });

    expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
  });

  it('filters empty tags when adding multiple', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useInputTag({ onChange }));

    act(() => {
      result.current.addMultipleTags(['tag1', '', '  ', 'tag2', '\t\n']);
    });

    expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2']);
  });

  it('respects maxTags when adding multiple tags', () => {
    const onChange = jest.fn();
    const defaultValue = ['existing'];
    const { result } = renderHook(() => useInputTag({ defaultValue, maxTags: 2, onChange }));

    act(() => {
      result.current.addMultipleTags(['tag1', 'tag2', 'tag3']);
    });

    // Should only add one more tag due to maxTags limit
    expect(onChange).toHaveBeenCalledWith(['existing', 'tag1']);
  });

  it('prevents duplicates when adding multiple tags with allowDuplicates false', () => {
    const onChange = jest.fn();
    const defaultValue = ['existing'];
    const { result } = renderHook(() => useInputTag({ defaultValue, allowDuplicates: false, onChange }));

    act(() => {
      result.current.addMultipleTags(['existing', 'new1', 'new2', 'new1']);
    });

    // Should filter out duplicates
    expect(onChange).toHaveBeenCalledWith(['existing', 'new1', 'new2']);
  });

  it('works in controlled mode', () => {
    const onChange = jest.fn();
    const initialValue = ['initial'];
    const { result, rerender } = renderHook(({ value }) => useInputTag({ value, onChange }), {
      initialProps: { value: initialValue },
    });

    expect(result.current.getCurrentTags()).toEqual(initialValue);

    // Simulate controlled update
    const newValue = ['initial', 'added'];
    rerender({ value: newValue });

    expect(result.current.getCurrentTags()).toEqual(newValue);
  });

  it('calls onChange but does not update internal state in controlled mode', () => {
    const onChange = jest.fn();
    const value = ['controlled'];
    const { result } = renderHook(() => useInputTag({ value, onChange }));

    act(() => {
      result.current.addTag('new tag');
    });

    expect(onChange).toHaveBeenCalledWith(['controlled', 'new tag']);
    // In controlled mode, the hook doesn't update its own state
    expect(result.current.getCurrentTags()).toEqual(value);
  });

  it('handles edge case with empty defaultValue', () => {
    const { result } = renderHook(() => useInputTag({ defaultValue: [] }));

    expect(result.current.getCurrentTags()).toEqual([]);
  });

  it('handles edge case with undefined value and defaultValue', () => {
    const { result } = renderHook(() => useInputTag({}));

    expect(result.current.getCurrentTags()).toEqual([]);
  });
});
