import { renderHook } from '@testing-library/react';
import { useSelectSearch } from '../../hooks/useSelectSearch';
import type { Option } from '../../types';

// Mock useInputValue hook
jest.mock('../../../../hooks', () => ({
  useInputValue: jest.fn(),
}));

describe('useSelectSearch', () => {
  let mockUseInputValue: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockInputManager: any;

  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
    { value: '4', label: 'Date' },
  ];

  beforeEach(() => {
    mockInputManager = {
      inputValue: '',
      setInputValue: jest.fn(),
      debouncedValue: '',
      clearInput: jest.fn(),
    };

    const hooksModule = jest.requireMock('../../../../hooks');
    mockUseInputValue = hooksModule.useInputValue;
    mockUseInputValue.mockReturnValue(mockInputManager);

    jest.clearAllMocks();
  });

  it('should initialize with empty search value', () => {
    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    expect(result.current.inputManager).toBe(mockInputManager);
    expect(result.current.filteredOptions).toEqual(mockOptions);
    expect(result.current.hasSearchValue).toBe(false);
  });

  it('should return all options when showSearch is false', () => {
    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: false,
        options: mockOptions,
      })
    );

    expect(result.current.filteredOptions).toEqual(mockOptions);
  });

  it('should filter options based on search value', () => {
    mockInputManager.inputValue = 'a';

    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    expect(result.current.filteredOptions).toEqual([
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Banana' },
      { value: '4', label: 'Date' },
    ]);
    expect(result.current.hasSearchValue).toBe(true);
  });

  it('should filter options case-insensitively', () => {
    mockInputManager.inputValue = 'A';

    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    expect(result.current.filteredOptions).toEqual([
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Banana' },
      { value: '4', label: 'Date' },
    ]);
  });

  it('should use custom filter option function', () => {
    mockInputManager.inputValue = 'apple';

    const customFilter = jest.fn((input: string, option: Option) => {
      return option.label === 'Apple';
    });

    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
        filterOption: customFilter,
      })
    );

    expect(result.current.filteredOptions).toEqual([{ value: '1', label: 'Apple' }]);
    expect(customFilter).toHaveBeenCalledWith('apple', expect.any(Object));
  });

  it('should return empty array when no options match search', () => {
    mockInputManager.inputValue = 'xyz';

    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    expect(result.current.filteredOptions).toEqual([]);
    expect(result.current.hasSearchValue).toBe(true);
  });

  it('should call onSearch when input value changes', () => {
    const mockOnSearch = jest.fn();

    renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
        onSearch: mockOnSearch,
      })
    );

    expect(mockUseInputValue).toHaveBeenCalledWith({
      initialValue: '',
      onInputChange: expect.any(Function),
    });

    // Get the onInputChange function that was passed to useInputValue
    const onInputChangeArg = mockUseInputValue.mock.calls[0][0].onInputChange;

    // Call it with a test value
    onInputChangeArg('test search');

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('should handle undefined options', () => {
    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
      })
    );

    expect(result.current.filteredOptions).toEqual([]);
  });

  it('should handle whitespace-only search values', () => {
    mockInputManager.inputValue = '   ';

    const { result } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    expect(result.current.filteredOptions).toEqual(mockOptions);
    expect(result.current.hasSearchValue).toBe(false);
  });

  it('should update filtered options when search value changes', () => {
    const { result, rerender } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    // Initially no search value
    expect(result.current.filteredOptions).toEqual(mockOptions);

    // Change search value
    mockInputManager.inputValue = 'apple';
    rerender();

    expect(result.current.filteredOptions).toEqual([{ value: '1', label: 'Apple' }]);
  });

  it('should update filtered options when options prop changes', () => {
    const { result, rerender } = renderHook(
      ({ options }) =>
        useSelectSearch({
          showSearch: true,
          options,
        }),
      { initialProps: { options: mockOptions } }
    );

    expect(result.current.filteredOptions).toEqual(mockOptions);

    const newOptions: Option[] = [
      { value: '5', label: 'Elderberry' },
      { value: '6', label: 'Fig' },
    ];

    rerender({ options: newOptions });

    expect(result.current.filteredOptions).toEqual(newOptions);
  });

  it('should not call onSearch when onSearch is not provided', () => {
    renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    // Get the onInputChange function that was passed to useInputValue
    const onInputChangeArg = mockUseInputValue.mock.calls[0][0].onInputChange;

    // Should not throw when calling without onSearch
    expect(() => {
      onInputChangeArg('test search');
    }).not.toThrow();
  });

  it('should correctly identify hasSearchValue state', () => {
    const { result, rerender } = renderHook(() =>
      useSelectSearch({
        showSearch: true,
        options: mockOptions,
      })
    );

    // Empty search value
    mockInputManager.inputValue = '';
    rerender();
    expect(result.current.hasSearchValue).toBe(false);

    // Non-empty search value
    mockInputManager.inputValue = 'test';
    rerender();
    expect(result.current.hasSearchValue).toBe(true);

    // Whitespace-only search value
    mockInputManager.inputValue = '   ';
    rerender();
    expect(result.current.hasSearchValue).toBe(false);
  });
});
