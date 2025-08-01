import { renderHook, act } from '@testing-library/react';
import { useSelect } from '../../hooks/useSelect';
import type { Option } from '../../types';

// Mock the individual hooks
jest.mock('../../hooks/useSelectState');
jest.mock('../../hooks/useOptionSelection');
jest.mock('../../hooks/useSelectSearch');

describe('useSelect', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStateManager: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSelectionManager: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSearchManager: any;

  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
  ];

  beforeEach(() => {
    mockStateManager = {
      isOpen: false,
      focusedIndex: -1,
      toggleOpen: jest.fn(),
      openDropdown: jest.fn(),
      closeDropdown: jest.fn(),
      setFocusedIndex: jest.fn(),
      resetFocusedIndex: jest.fn(),
    };

    mockSelectionManager = {
      getCurrentValue: jest.fn(() => undefined),
      getSelectedOptions: jest.fn(() => []),
      isOptionSelected: jest.fn(() => false),
      handleOptionSelect: jest.fn(),
      handleTagRemove: jest.fn(),
      tagManager: {
        getCurrentTags: jest.fn(() => []),
        addTag: jest.fn(),
        removeTag: jest.fn(),
      },
    };

    mockSearchManager = {
      inputManager: {
        inputValue: '',
        setInputValue: jest.fn(),
        clearInput: jest.fn(),
      },
      filteredOptions: mockOptions,
      hasSearchValue: false,
    };

    const stateModule = jest.requireMock('../../hooks/useSelectState');
    const { useSelectState } = stateModule;
    const selectionModule = jest.requireMock('../../hooks/useOptionSelection');
    const { useOptionSelection } = selectionModule;
    const searchModule = jest.requireMock('../../hooks/useSelectSearch');
    const { useSelectSearch } = searchModule;

    useSelectState.mockReturnValue(mockStateManager);
    useOptionSelection.mockReturnValue(mockSelectionManager);
    useSelectSearch.mockReturnValue(mockSearchManager);

    jest.clearAllMocks();
  });

  it('should initialize with correct default props', () => {
    const { result } = renderHook(() => useSelect({}));

    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
    expect(result.current.getCurrentValue()).toBeUndefined();
    expect(result.current.getSelectedOptions()).toEqual([]);
    expect(result.current.filteredOptions).toEqual(mockOptions);
  });

  it('should initialize hooks with correct parameters', () => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn();
    const mockFilterOption = jest.fn();

    renderHook(() =>
      useSelect({
        value: ['1', '2'],
        defaultValue: ['1'],
        multiple: true,
        showSearch: true,
        open: true,
        options: mockOptions,
        onChange: mockOnChange,
        onSearch: mockOnSearch,
        filterOption: mockFilterOption,
      })
    );

    const stateModule2 = jest.requireMock('../../hooks/useSelectState');
    const { useSelectState } = stateModule2;
    const selectionModule2 = jest.requireMock('../../hooks/useOptionSelection');
    const { useOptionSelection } = selectionModule2;
    const searchModule2 = jest.requireMock('../../hooks/useSelectSearch');
    const { useSelectSearch } = searchModule2;

    expect(useSelectState).toHaveBeenCalledWith({ open: true });
    expect(useOptionSelection).toHaveBeenCalledWith({
      value: ['1', '2'],
      defaultValue: ['1'],
      multiple: true,
      options: mockOptions,
      onChange: mockOnChange,
    });
    expect(useSelectSearch).toHaveBeenCalledWith({
      showSearch: true,
      options: mockOptions,
      onSearch: mockOnSearch,
      filterOption: mockFilterOption,
    });
  });

  it('should handle option selection in single mode', () => {
    const { result } = renderHook(() =>
      useSelect({
        multiple: false,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleOptionSelect(mockOptions[0]);
    });

    expect(mockSelectionManager.handleOptionSelect).toHaveBeenCalledWith(mockOptions[0]);
    expect(mockStateManager.closeDropdown).toHaveBeenCalled();
  });

  it('should handle option selection in multiple mode', () => {
    const { result } = renderHook(() =>
      useSelect({
        multiple: true,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleOptionSelect(mockOptions[0]);
    });

    expect(mockSelectionManager.handleOptionSelect).toHaveBeenCalledWith(mockOptions[0]);
    expect(mockStateManager.closeDropdown).not.toHaveBeenCalled();
  });

  it('should clear input after option selection when showSearch is true', () => {
    const { result } = renderHook(() =>
      useSelect({
        showSearch: true,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleOptionSelect(mockOptions[0]);
    });

    expect(mockSearchManager.inputManager.clearInput).toHaveBeenCalled();
  });

  it('should not clear input after option selection when showSearch is false', () => {
    const { result } = renderHook(() =>
      useSelect({
        showSearch: false,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleOptionSelect(mockOptions[0]);
    });

    expect(mockSearchManager.inputManager.clearInput).not.toHaveBeenCalled();
  });

  it('should handle tag removal', () => {
    const { result } = renderHook(() =>
      useSelect({
        multiple: true,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleTagRemove('1', 0);
    });

    expect(mockSelectionManager.handleTagRemove).toHaveBeenCalledWith('1', 0);
  });

  it('should handle blur event', () => {
    const { result } = renderHook(() =>
      useSelect({
        showSearch: true,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleBlur();
    });

    expect(mockStateManager.closeDropdown).toHaveBeenCalled();
    expect(mockSearchManager.inputManager.clearInput).toHaveBeenCalled();
  });

  it('should handle blur event without clearing input when showSearch is false', () => {
    const { result } = renderHook(() =>
      useSelect({
        showSearch: false,
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleBlur();
    });

    expect(mockStateManager.closeDropdown).toHaveBeenCalled();
    expect(mockSearchManager.inputManager.clearInput).not.toHaveBeenCalled();
  });

  it('should handle selector click', () => {
    const { result } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    act(() => {
      result.current.handleSelectorClick();
    });

    expect(mockStateManager.toggleOpen).toHaveBeenCalled();
  });

  it('should expose all necessary methods and properties', () => {
    const { result } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    // State properties
    expect(result.current.isOpen).toBeDefined();
    expect(result.current.focusedIndex).toBeDefined();

    // Value management methods
    expect(typeof result.current.getCurrentValue).toBe('function');
    expect(typeof result.current.getSelectedOptions).toBe('function');
    expect(typeof result.current.isOptionSelected).toBe('function');

    // Search management
    expect(result.current.inputManager).toBeDefined();
    expect(result.current.filteredOptions).toBeDefined();

    // Event handlers
    expect(typeof result.current.handleOptionSelect).toBe('function');
    expect(typeof result.current.handleTagRemove).toBe('function');
    expect(typeof result.current.handleBlur).toBe('function');
    expect(typeof result.current.handleSelectorClick).toBe('function');

    // State control methods
    expect(typeof result.current.openDropdown).toBe('function');
    expect(typeof result.current.closeDropdown).toBe('function');
    expect(typeof result.current.setFocusedIndex).toBe('function');

    // Tag manager (for multiple mode)
    expect(result.current.tagManager).toBeDefined();
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    const initialHandlers = {
      handleOptionSelect: result.current.handleOptionSelect,
      handleTagRemove: result.current.handleTagRemove,
      handleBlur: result.current.handleBlur,
      handleSelectorClick: result.current.handleSelectorClick,
    };

    rerender();

    // Functions should maintain stable references
    expect(result.current.handleOptionSelect).toBe(initialHandlers.handleOptionSelect);
    expect(result.current.handleTagRemove).toBe(initialHandlers.handleTagRemove);
    expect(result.current.handleBlur).toBe(initialHandlers.handleBlur);
    expect(result.current.handleSelectorClick).toBe(initialHandlers.handleSelectorClick);
  });

  it('should delegate state properties to state manager', () => {
    mockStateManager.isOpen = true;
    mockStateManager.focusedIndex = 2;

    const { result } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    expect(result.current.isOpen).toBe(true);
    expect(result.current.focusedIndex).toBe(2);
  });

  it('should delegate value methods to selection manager', () => {
    const mockValue = '2';
    const mockSelectedOptions = [mockOptions[1]];

    mockSelectionManager.getCurrentValue.mockReturnValue(mockValue);
    mockSelectionManager.getSelectedOptions.mockReturnValue(mockSelectedOptions);
    mockSelectionManager.isOptionSelected.mockReturnValue(true);

    const { result } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    expect(result.current.getCurrentValue()).toBe(mockValue);
    expect(result.current.getSelectedOptions()).toBe(mockSelectedOptions);
    expect(result.current.isOptionSelected(mockOptions[1])).toBe(true);
  });

  it('should delegate search properties to search manager', () => {
    const mockFilteredOptions = [mockOptions[0]];
    mockSearchManager.filteredOptions = mockFilteredOptions;

    const { result } = renderHook(() =>
      useSelect({
        options: mockOptions,
      })
    );

    expect(result.current.inputManager).toBe(mockSearchManager.inputManager);
    expect(result.current.filteredOptions).toBe(mockFilteredOptions);
  });

  it('should use default values for optional props', () => {
    renderHook(() => useSelect({}));

    const stateModule3 = jest.requireMock('../../hooks/useSelectState');
    const { useSelectState } = stateModule3;
    const selectionModule3 = jest.requireMock('../../hooks/useOptionSelection');
    const { useOptionSelection } = selectionModule3;
    const searchModule3 = jest.requireMock('../../hooks/useSelectSearch');
    const { useSelectSearch } = searchModule3;

    expect(useSelectState).toHaveBeenCalledWith({ open: undefined });
    expect(useOptionSelection).toHaveBeenCalledWith({
      value: undefined,
      defaultValue: undefined,
      multiple: false,
      options: [],
      onChange: undefined,
    });
    expect(useSelectSearch).toHaveBeenCalledWith({
      showSearch: false,
      options: [],
      onSearch: undefined,
      filterOption: undefined,
    });
  });
});
