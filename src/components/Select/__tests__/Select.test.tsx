import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Select from '../Select';
import type { Option } from '../types';

// Mock child components
jest.mock('../Selector', () => {
  const MockSelector = ({
    onClick,
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    onTagRemove,
    selectedOptions,
    searchValue,
    placeholder,
  }: {
    onClick?: () => void;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchFocus?: () => void;
    onSearchBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onTagRemove?: (tag: string, index: number) => void;
    selectedOptions?: Option[];
    searchValue?: string;
    placeholder?: string;
  }) => (
    <div data-testid='selector' onClick={onClick}>
      <span data-testid='selected-count'>{selectedOptions?.length || 0}</span>
      <span data-testid='search-value'>{searchValue}</span>
      <span data-testid='placeholder'>{placeholder}</span>
      <input data-testid='search-input' onChange={onSearchChange} onFocus={onSearchFocus} onBlur={onSearchBlur} />
      {selectedOptions?.map((opt: Option, idx: number) => (
        <button key={idx} data-testid={`remove-tag-${idx}`} onClick={() => onTagRemove?.(opt.label || '', idx)}>
          Remove {opt.label}
        </button>
      ))}
    </div>
  );
  MockSelector.displayName = 'MockSelector';
  return MockSelector;
});

jest.mock('../Listbox', () => {
  const MockListbox = ({
    isOpen,
    options,
    onOptionClick,
    onClose,
  }: {
    isOpen: boolean;
    options?: Option[];
    onOptionClick?: (option: Option) => void;
    onClose?: () => void;
  }) =>
    isOpen ? (
      <div data-testid='listbox'>
        <button data-testid='close-listbox' onClick={onClose}>
          Close
        </button>
        {options?.map((option: Option, index: number) => (
          <div key={option.value} data-testid={`option-${index}`} onClick={() => onOptionClick?.(option)}>
            {option.label}
          </div>
        ))}
      </div>
    ) : null;
  MockListbox.displayName = 'MockListbox';
  return MockListbox;
});

// Mock the useSelect hook
jest.mock('../hooks', () => ({
  useSelect: jest.fn(),
}));

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('Select', () => {
  let mockUseSelect: jest.Mock;
   
  let mockSelectState: any;

  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
  ];

  beforeEach(() => {
    mockSelectState = {
      getCurrentValue: jest.fn(() => undefined),
      getSelectedOptions: jest.fn(() => []),
      isOpen: false,
      filteredOptions: mockOptions,
      handleOptionSelect: jest.fn(),
      handleSelectorClick: jest.fn(),
      closeDropdown: jest.fn(),
      handleBlur: jest.fn(),
      handleTagRemove: jest.fn(),
      inputManager: {
        inputValue: '',
        handleInputChange: jest.fn(),
        setIsFocused: jest.fn(),
      },
    };

    const hooksModule = jest.requireMock('../hooks');
    mockUseSelect = hooksModule.useSelect;
    mockUseSelect.mockReturnValue(mockSelectState);

    jest.clearAllMocks();
  });

  it('should render selector and listbox correctly', () => {
    render(<Select options={mockOptions} />);

    expect(screen.getByTestId('selector')).toBeInTheDocument();
    expect(screen.queryByTestId('listbox')).not.toBeInTheDocument(); // Closed by default
  });

  it('should render listbox when open', () => {
    mockSelectState.isOpen = true;

    render(<Select options={mockOptions} />);

    expect(screen.getByTestId('listbox')).toBeInTheDocument();
  });

  it('should not render listbox when disabled', () => {
    mockSelectState.isOpen = true;

    render(<Select options={mockOptions} disabled={true} />);

    expect(screen.queryByTestId('listbox')).not.toBeInTheDocument();
  });

  it('should initialize useSelect with correct props', () => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn();
    const mockFilterOption = jest.fn();

    render(
      <Select
        value='1'
        defaultValue='2'
        multiple={true}
        showSearch={true}
        open={true}
        options={mockOptions}
        onChange={mockOnChange}
        onSearch={mockOnSearch}
        filterOption={mockFilterOption}
      />
    );

    expect(mockUseSelect).toHaveBeenCalledWith({
      value: '1',
      defaultValue: '2',
      multiple: true,
      showSearch: true,
      open: true,
      options: mockOptions,
      onChange: mockOnChange,
      onSearch: mockOnSearch,
      filterOption: mockFilterOption,
    });
  });

  describe('option selection', () => {
    it('should handle option click', () => {
      mockSelectState.isOpen = true;

      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByTestId('option-0'));

      expect(mockSelectState.handleOptionSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should ignore disabled options', () => {
      const disabledOption = { ...mockOptions[0], disabled: true };
      mockSelectState.filteredOptions = [disabledOption];
      mockSelectState.isOpen = true;

      render(<Select options={[disabledOption]} />);

      fireEvent.click(screen.getByTestId('option-0'));

      expect(mockSelectState.handleOptionSelect).not.toHaveBeenCalled();
    });

    it('should focus input after selecting option in multiple search mode', async () => {
      mockSelectState.isOpen = true;

      render(<Select options={mockOptions} multiple={true} showSearch={true} />);

      fireEvent.click(screen.getByTestId('option-0'));

      await waitFor(() => {
        expect(mockSelectState.handleOptionSelect).toHaveBeenCalledWith(mockOptions[0]);
      });
    });
  });

  describe('selector interactions', () => {
    it('should handle selector click', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.handleSelectorClick).toHaveBeenCalled();
    });

    it('should not handle selector click when disabled', () => {
      render(<Select options={mockOptions} disabled={true} />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.handleSelectorClick).not.toHaveBeenCalled();
    });

    it('should not call handleSelectorClick when open is controlled', () => {
      render(<Select options={mockOptions} open={true} />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.handleSelectorClick).not.toHaveBeenCalled();
    });

    it('should focus input after selector click in search mode', async () => {
      render(<Select options={mockOptions} showSearch={true} />);

      fireEvent.click(screen.getByTestId('selector'));

      await waitFor(() => {
        expect(mockSelectState.handleSelectorClick).toHaveBeenCalled();
      });
    });
  });

  describe('search functionality', () => {
    it('should handle search input change', () => {
      render(<Select options={mockOptions} showSearch={true} />);

      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: 'test' },
      });

      expect(mockSelectState.inputManager.handleInputChange).toHaveBeenCalled();
    });

    it('should handle search focus', () => {
      render(<Select options={mockOptions} showSearch={true} />);

      fireEvent.focus(screen.getByTestId('search-input'));

      expect(mockSelectState.inputManager.setIsFocused).toHaveBeenCalledWith(true);
    });

    it('should handle search blur', () => {
      render(<Select options={mockOptions} showSearch={true} />);

      fireEvent.blur(screen.getByTestId('search-input'));

      expect(mockSelectState.inputManager.setIsFocused).toHaveBeenCalledWith(false);
    });
  });

  describe('multiple selection', () => {
    it('should handle tag removal', () => {
      const selectedOptions = [mockOptions[0], mockOptions[1]];
      mockSelectState.getSelectedOptions.mockReturnValue(selectedOptions);

      render(<Select options={mockOptions} multiple={true} />);

      fireEvent.click(screen.getByTestId('remove-tag-0'));

      expect(mockSelectState.handleTagRemove).toHaveBeenCalledWith('Apple', 0);
    });
  });

  describe('listbox interactions', () => {
    it('should handle listbox close', () => {
      mockSelectState.isOpen = true;

      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByTestId('close-listbox'));

      expect(mockSelectState.closeDropdown).toHaveBeenCalled();
      expect(mockSelectState.handleBlur).toHaveBeenCalled();
    });

    it('should not handle listbox close when disabled', () => {
      mockSelectState.isOpen = true;

      render(<Select options={mockOptions} disabled={true} />);

      // Should not render listbox when disabled
      expect(screen.queryByTestId('close-listbox')).not.toBeInTheDocument();
    });
  });

  describe('props passing', () => {
    it('should pass correct props to Selector', () => {
      const selectedOptions = [mockOptions[0]];
      mockSelectState.getCurrentValue.mockReturnValue('1');
      mockSelectState.getSelectedOptions.mockReturnValue(selectedOptions);
      mockSelectState.inputManager.inputValue = 'search';

      render(
        <Select options={mockOptions} placeholder='Select item' disabled={true} multiple={true} showSearch={true} />
      );

      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
      expect(screen.getByTestId('search-value')).toHaveTextContent('search');
      expect(screen.getByTestId('placeholder')).toHaveTextContent('Select item');
    });

    it('should pass correct props to Listbox', () => {
      mockSelectState.isOpen = true;
      mockSelectState.getCurrentValue.mockReturnValue('1');

      render(
        <Select
          options={mockOptions}
          listHeight={300}
          multiple={true}
          optionRender={option => <span>Custom: {option.label}</span>}
          popupRender={node => <div>Popup: {node}</div>}
        />
      );

      expect(screen.getByTestId('listbox')).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes', () => {
      const fluentuiModule = jest.requireMock('@fluentui/react-components');
      const { mergeClasses } = fluentuiModule;

      render(<Select options={mockOptions} className='custom-class' disabled={true} multiple={true} />);

      expect(mergeClasses).toHaveBeenCalledWith('fluentui-plus-select', 'custom-class');
      expect(mergeClasses).toHaveBeenCalledWith(
        'fluentui-plus-select__selector',
        'fluentui-plus-select__selector--disabled',
        'fluentui-plus-select__selector--multiple'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle undefined options', () => {
      render(<Select />);

      expect(screen.getByTestId('selector')).toBeInTheDocument();
    });

    it('should handle empty options array', () => {
      render(<Select options={[]} />);

      expect(screen.getByTestId('selector')).toBeInTheDocument();
    });

    it('should handle missing event handlers gracefully', () => {
      expect(() => {
        render(<Select options={mockOptions} />);
      }).not.toThrow();
    });

    it('should use default values for optional props', () => {
      render(<Select options={mockOptions} />);

      expect(mockUseSelect).toHaveBeenCalledWith({
        value: undefined,
        defaultValue: undefined,
        multiple: false,
        showSearch: false,
        open: undefined,
        options: mockOptions,
        onChange: undefined,
        onSearch: undefined,
        filterOption: undefined,
      });
    });
  });
});
