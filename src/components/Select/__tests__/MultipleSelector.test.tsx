import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultipleSelector from '../MultipleSelector';
import { SelectProvider } from '../context';
import type { SelectContextValue } from '../context/SelectContext';
import type { Option } from '../types';

// Mock child components
jest.mock('../../InputTag/TagList', () => {
  const MockTagList = ({
    tags,
    disabled,
    onTagRemove,
  }: {
    tags: string[];
    disabled?: boolean;
    onTagRemove?: (tag: string, index: number) => void;
  }) => (
    <div data-testid='tag-list'>
      {tags.map((tag: string, index: number) => (
        <span key={index} data-testid={`tag-${index}`}>
          {tag}
          {!disabled && (
            <button onClick={() => onTagRemove?.(tag, index)} data-testid={`remove-tag-${index}`}>
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
  MockTagList.displayName = 'MockTagList';
  return MockTagList;
});

jest.mock('../SearchInput', () => {
  const MockSearchInput = ({
    value,
    placeholder,
    disabled,
    onChange,
    onFocus,
    onBlur,
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
  }) => (
    <input
      data-testid='search-input'
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange || (() => {})}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
  MockSearchInput.displayName = 'MockSearchInput';
  return MockSearchInput;
});

// Mock @fluentui/react-components and icons
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

jest.mock('@fluentui/react-icons', () => ({
  ChevronDownRegular: ({ className }: { className?: string }) => (
    <span className={className} data-testid='chevron-down'>
      ▼
    </span>
  ),
}));

describe('MultipleSelector', () => {
  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
  ];

  // Mock context value
  const defaultContextValue: SelectContextValue = {
    prefixCls: 'test-select',
    selectedOptions: [],
    disabled: false,
    multiple: true,
  };

  const renderWithProvider = (contextValue: SelectContextValue = defaultContextValue) => {
    return render(
      <SelectProvider value={contextValue}>
        <MultipleSelector />
      </SelectProvider>
    );
  };

  it('should render TagList with correct tags', () => {
    renderWithProvider({
      ...defaultContextValue,
      selectedOptions: mockOptions.slice(0, 2),
    });

    expect(screen.getByTestId('tag-list')).toBeInTheDocument();
    expect(screen.getByTestId('tag-0')).toHaveTextContent('Apple');
    expect(screen.getByTestId('tag-1')).toHaveTextContent('Banana');
  });

  it('should render chevron down icon', () => {
    renderWithProvider();

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();

    renderWithProvider({
      ...defaultContextValue,
      onClick: mockOnClick,
    });

    fireEvent.click(screen.getByTestId('tag-list').parentElement!);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should handle tag removal', () => {
    const mockOnTagRemove = jest.fn();

    renderWithProvider({
      ...defaultContextValue,
      selectedOptions: mockOptions.slice(0, 2),
      onTagRemove: mockOnTagRemove,
    });

    fireEvent.click(screen.getByTestId('remove-tag-0'));
    expect(mockOnTagRemove).toHaveBeenCalledWith('Apple', 0);
  });

  it('should not show remove buttons when disabled', () => {
    renderWithProvider({
      ...defaultContextValue,
      selectedOptions: mockOptions.slice(0, 2),
      disabled: true,
    });

    expect(screen.queryByTestId('remove-tag-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('remove-tag-1')).not.toBeInTheDocument();
  });

  describe('with showSearch enabled', () => {
    it('should render SearchInput when showSearch is true', () => {
      renderWithProvider({
        ...defaultContextValue,
        showSearch: true,
        searchValue: 'test',
      });

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toHaveValue('test');
    });

    it('should use empty placeholder when items are selected', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: mockOptions.slice(0, 1),
        showSearch: true,
        placeholder: 'Select items',
      });

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', '');
    });

    it('should use provided placeholder when no items are selected', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: [],
        showSearch: true,
        placeholder: 'Select items',
      });

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Select items');
    });

    it('should call search event handlers', () => {
      const mockOnSearchChange = jest.fn();
      const mockOnSearchFocus = jest.fn();
      const mockOnSearchBlur = jest.fn();

      renderWithProvider({
        ...defaultContextValue,
        showSearch: true,
        onSearchChange: mockOnSearchChange,
        onSearchFocus: mockOnSearchFocus,
        onSearchBlur: mockOnSearchBlur,
      });

      const searchInput = screen.getByTestId('search-input');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(mockOnSearchChange).toHaveBeenCalled();

      fireEvent.focus(searchInput);
      expect(mockOnSearchFocus).toHaveBeenCalled();

      fireEvent.blur(searchInput);
      expect(mockOnSearchBlur).toHaveBeenCalled();
    });

    it('should pass disabled prop to SearchInput', () => {
      renderWithProvider({
        ...defaultContextValue,
        showSearch: true,
        disabled: true,
      });

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeDisabled();
    });
  });

  describe('without showSearch', () => {
    it('should show placeholder text when no items selected and no search', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: [],
        showSearch: false,
        placeholder: 'Please select items',
      });

      expect(screen.getByText('Please select items')).toBeInTheDocument();
      expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    });

    it('should not show placeholder when items are selected', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: mockOptions.slice(0, 1),
        showSearch: false,
        placeholder: 'Please select items',
      });

      expect(screen.queryByText('Please select items')).not.toBeInTheDocument();
    });

    it('should not show placeholder when no placeholder provided', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: [],
        showSearch: false,
      });

      expect(screen.queryByText('Please select items')).not.toBeInTheDocument();
    });
  });

  describe('tag creation from options', () => {
    it('should use option labels for tags', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: mockOptions,
      });

      expect(screen.getByTestId('tag-0')).toHaveTextContent('Apple');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('Banana');
      expect(screen.getByTestId('tag-2')).toHaveTextContent('Cherry');
    });

    it('should use option values when labels are not available', () => {
      const optionsWithoutLabels = [{ value: 'value1' }, { value: 'value2' }];

      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: optionsWithoutLabels,
      });

      expect(screen.getByTestId('tag-0')).toHaveTextContent('value1');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('value2');
    });

    it('should handle numeric values', () => {
      const numericOptions = [{ value: 123, label: 'Number Option' }, { value: 456 }];

      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: numericOptions,
      });

      expect(screen.getByTestId('tag-0')).toHaveTextContent('Number Option');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('456');
    });

    it('should memoize tags creation', () => {
      const { rerender } = renderWithProvider({
        ...defaultContextValue,
        selectedOptions: mockOptions.slice(0, 2),
      });

      // Verify initial render
      expect(screen.getByTestId('tag-0')).toHaveTextContent('Apple');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('Banana');

      // Rerender with same options - should not recreate tags unnecessarily
      rerender(
        <SelectProvider value={{ ...defaultContextValue, selectedOptions: mockOptions.slice(0, 2) }}>
          <MultipleSelector />
        </SelectProvider>
      );

      expect(screen.getByTestId('tag-0')).toHaveTextContent('Apple');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('Banana');
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes', () => {
      const fluentuiModule = jest.requireMock('@fluentui/react-components');
      const { mergeClasses } = fluentuiModule;

      renderWithProvider();

      expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-inner', 'test-select__selector-inner--multiple');
      expect(mergeClasses).toHaveBeenCalledWith('test-select__tags-container');
      expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-arrow');
    });

    it('should apply placeholder classes when showing placeholder', () => {
      const fluentuiModule = jest.requireMock('@fluentui/react-components');
      const { mergeClasses } = fluentuiModule;

      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: [],
        showSearch: false,
        placeholder: 'Select items',
      });

      expect(mergeClasses).toHaveBeenCalledWith(
        'test-select__selector-text',
        'test-select__selector-text--placeholder'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty selectedOptions array', () => {
      renderWithProvider({
        ...defaultContextValue,
        selectedOptions: [],
      });

      expect(screen.getByTestId('tag-list')).toBeInTheDocument();
      expect(screen.queryByTestId('tag-0')).not.toBeInTheDocument();
    });

    it('should handle missing event handlers gracefully', () => {
      expect(() => {
        renderWithProvider({
          ...defaultContextValue,
          selectedOptions: mockOptions.slice(0, 1),
        });

        // Try to click without handlers - should not throw
        fireEvent.click(screen.getByTestId('tag-list').parentElement!);
      }).not.toThrow();
    });

    it('should handle undefined searchValue', () => {
      renderWithProvider({
        ...defaultContextValue,
        showSearch: true,
        searchValue: undefined,
      });

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveValue('');
    });
  });
});
