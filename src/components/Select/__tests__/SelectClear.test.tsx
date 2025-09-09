import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from '../index';
import type { Option } from '../types';

describe('Select Clear Functionality', () => {
  const options: Option[] = [
    { value: 'option1', label: '选项一' },
    { value: 'option2', label: '选项二' },
    { value: 'option3', label: '选项三' },
  ];

  describe('Single Select', () => {
    it('should show clear button when allowClear is true and has selected value', () => {
      render(<Select value='option1' options={options} allowClear onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when allowClear is false', () => {
      render(<Select value='option1' options={options} allowClear={false} onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).not.toBeInTheDocument();

      const dropdownArrow = document.querySelector('.fluentui-plus-select__selector-arrow');
      expect(dropdownArrow).toBeInTheDocument();
    });

    it('should not show clear button when no value is selected', () => {
      render(<Select value='' options={options} allowClear onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).not.toBeInTheDocument();

      const dropdownArrow = document.querySelector('.fluentui-plus-select__selector-arrow');
      expect(dropdownArrow).toBeInTheDocument();
    });

    it('should clear single selection when clear button is clicked', () => {
      const mockOnChange = jest.fn();
      const mockOnClear = jest.fn();

      render(<Select value='option1' options={options} allowClear onChange={mockOnChange} onClear={mockOnClear} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).toBeInTheDocument();
      fireEvent.click(clearButton!);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(undefined, null);
    });
  });

  describe('Multiple Select', () => {
    it('should show clear button when allowClear is true and has selected values', () => {
      render(<Select value={['option1', 'option2']} options={options} allowClear multiple onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).toBeInTheDocument();
    });

    it('should not show clear button when no values are selected', () => {
      render(<Select value={[]} options={options} allowClear multiple onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).not.toBeInTheDocument();

      const dropdownArrow = document.querySelector('.fluentui-plus-select__selector-arrow');
      expect(dropdownArrow).toBeInTheDocument();
    });

    it('should clear multiple selections when clear button is clicked', () => {
      const mockOnChange = jest.fn();
      const mockOnClear = jest.fn();

      render(
        <Select
          value={['option1', 'option2']}
          options={options}
          allowClear
          multiple
          onChange={mockOnChange}
          onClear={mockOnClear}
        />
      );

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).toBeInTheDocument();
      fireEvent.click(clearButton!);

      expect(mockOnClear).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith([], []);
    });
  });

  describe('Disabled State', () => {
    it('should not show clear button when component is disabled', () => {
      render(<Select value='option1' options={options} allowClear disabled onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).not.toBeInTheDocument();

      const dropdownArrow = document.querySelector('.fluentui-plus-select__selector-arrow');
      expect(dropdownArrow).toBeInTheDocument();
    });
  });

  describe('Search Mode', () => {
    it('should show clear button in search mode when allowClear is true', () => {
      render(<Select value='option1' options={options} allowClear showSearch onChange={() => {}} />);

      const clearButton = document.querySelector('.fluentui-plus-select__selector-clear');
      expect(clearButton).toBeInTheDocument();
    });
  });
});
