import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Selector from '../Selector';
import type { Option } from '../types';

// Mock child components
jest.mock('../SearchInput', () => {
  const MockSearchInput = ({
    value,
    placeholder,
    onChange,
    onFocus,
    onBlur,
  }: {
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  }) => (
    <input
      data-testid='search-input'
      value={value}
      placeholder={placeholder}
      onChange={onChange || (() => {})}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
  MockSearchInput.displayName = 'MockSearchInput';
  return MockSearchInput;
});

jest.mock('../TextDisplay', () => {
  const MockTextDisplay = ({
    displayText,
    isPlaceholder,
    onClick,
  }: {
    displayText?: string;
    isPlaceholder?: boolean;
    onClick?: () => void;
  }) => (
    <div data-testid='text-display' onClick={onClick}>
      <span data-testid={isPlaceholder ? 'placeholder-text' : 'display-text'}>{displayText}</span>
    </div>
  );
  MockTextDisplay.displayName = 'MockTextDisplay';
  return MockTextDisplay;
});

jest.mock('../MultipleSelector', () => {
  const MockMultipleSelector = ({
    selectedOptions,
    placeholder,
    onClick,
  }: {
    selectedOptions?: Option[];
    placeholder?: string;
    onClick?: () => void;
  }) => (
    <div data-testid='multiple-selector' onClick={onClick}>
      Multiple: {selectedOptions?.length || 0} selected, placeholder: {placeholder}
    </div>
  );
  MockMultipleSelector.displayName = 'MockMultipleSelector';
  return MockMultipleSelector;
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

describe('Selector', () => {
  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
  ];

  const defaultProps = {
    prefixCls: 'test-select',
  };

  describe('multiple mode', () => {
    it('should render MultipleSelector in multiple mode', () => {
      render(<Selector {...defaultProps} multiple={true} selectedOptions={mockOptions} placeholder='Select items' />);

      expect(screen.getByTestId('multiple-selector')).toBeInTheDocument();
      expect(screen.getByText('Multiple: 2 selected, placeholder: Select items')).toBeInTheDocument();
    });

    it('should pass correct props to MultipleSelector', () => {
      const mockOnClick = jest.fn();
      const mockOnTagRemove = jest.fn();
      const mockOnSearchChange = jest.fn();

      render(
        <Selector
          {...defaultProps}
          multiple={true}
          selectedOptions={mockOptions}
          disabled={true}
          placeholder='Select multiple'
          showSearch={true}
          searchValue='search'
          onClick={mockOnClick}
          onTagRemove={mockOnTagRemove}
          onSearchChange={mockOnSearchChange}
        />
      );

      // MultipleSelector should be rendered
      expect(screen.getByTestId('multiple-selector')).toBeInTheDocument();

      // Click should be passed through
      fireEvent.click(screen.getByTestId('multiple-selector'));
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('single mode', () => {
    it('should render TextDisplay in single mode without search', () => {
      render(
        <Selector {...defaultProps} multiple={false} selectedOptions={[mockOptions[0]]} placeholder='Select item' />
      );

      expect(screen.getByTestId('text-display')).toBeInTheDocument();
      expect(screen.getByTestId('display-text')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('should render placeholder when no option is selected', () => {
      render(<Selector {...defaultProps} multiple={false} selectedOptions={[]} placeholder='Please select' />);

      expect(screen.getByTestId('text-display')).toBeInTheDocument();
      expect(screen.getByTestId('placeholder-text')).toBeInTheDocument();
      expect(screen.getByText('Please select')).toBeInTheDocument();
    });

    it('should use option value when label is not available', () => {
      const optionWithoutLabel = { value: '123' };

      render(<Selector {...defaultProps} multiple={false} selectedOptions={[optionWithoutLabel]} />);

      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should handle value prop in single mode', () => {
      render(<Selector {...defaultProps} multiple={false} value='direct value' selectedOptions={[]} />);

      expect(screen.getByText('direct value')).toBeInTheDocument();
    });
  });

  describe('searchable single mode', () => {
    it('should render SearchInput when showSearch is true and isOpen is true', () => {
      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={true}
          selectedOptions={[mockOptions[0]]}
          searchValue='test'
        />
      );

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    });

    it('should render SearchInput when showSearch is true and searchValue is not empty', () => {
      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={false}
          selectedOptions={[mockOptions[0]]}
          searchValue='test search'
        />
      );

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should render TextDisplay when showSearch is true but not activated', () => {
      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={false}
          selectedOptions={[mockOptions[0]]}
          searchValue=''
        />
      );

      expect(screen.getByTestId('text-display')).toBeInTheDocument();
      expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
    });

    it('should use selected option label as search placeholder', () => {
      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={true}
          selectedOptions={[mockOptions[0]]}
          searchValue=''
        />
      );

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Apple');
    });

    it('should use regular placeholder when no option is selected', () => {
      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={true}
          selectedOptions={[]}
          placeholder='Search...'
          searchValue=''
        />
      );

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toHaveAttribute('placeholder', 'Search...');
    });

    it('should call search event handlers', () => {
      const mockOnSearchChange = jest.fn();
      const mockOnSearchFocus = jest.fn();
      const mockOnSearchBlur = jest.fn();

      render(
        <Selector
          {...defaultProps}
          multiple={false}
          showSearch={true}
          isOpen={true}
          onSearchChange={mockOnSearchChange}
          onSearchFocus={mockOnSearchFocus}
          onSearchBlur={mockOnSearchBlur}
        />
      );

      const searchInput = screen.getByTestId('search-input');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(mockOnSearchChange).toHaveBeenCalled();

      fireEvent.focus(searchInput);
      expect(mockOnSearchFocus).toHaveBeenCalled();

      fireEvent.blur(searchInput);
      expect(mockOnSearchBlur).toHaveBeenCalled();
    });
  });

  describe('click handling', () => {
    it('should call onClick when selector is clicked', () => {
      const mockOnClick = jest.fn();

      render(<Selector {...defaultProps} multiple={false} onClick={mockOnClick} />);

      fireEvent.click(screen.getByTestId('text-display'));
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should call onClick when searchable selector container is clicked', () => {
      const mockOnClick = jest.fn();

      render(<Selector {...defaultProps} multiple={false} showSearch={true} isOpen={true} onClick={mockOnClick} />);

      // Click on the container div
      fireEvent.click(screen.getByTestId('search-input').parentElement!);
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle array value in single mode', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<Selector {...defaultProps} multiple={false} value={['array', 'value'] as any} selectedOptions={[]} />);

      // Should render without crashing
      expect(screen.getByTestId('text-display')).toBeInTheDocument();
    });

    it('should handle undefined selectedOptions', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<Selector {...defaultProps} multiple={false} selectedOptions={undefined as any} />);

      expect(screen.getByTestId('text-display')).toBeInTheDocument();
    });

    it('should handle missing handlers gracefully', () => {
      expect(() => {
        render(<Selector {...defaultProps} multiple={false} showSearch={true} isOpen={true} />);
      }).not.toThrow();
    });
  });
});
