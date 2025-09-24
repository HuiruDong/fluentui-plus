import { renderHook, act } from '@testing-library/react';
import { useOptionSelection } from '../../hooks/useOptionSelection';
import type { Option } from '../../types';

// Mock useTagManager hook
jest.mock('../../../../hooks', () => ({
  useTagManager: jest.fn(),
}));

describe('useOptionSelection', () => {
  let mockUseTagManager: jest.Mock;

  let mockTagManager: any;

  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
    { value: 4, label: 'Date' },
  ];

  beforeEach(() => {
    mockTagManager = {
      getCurrentTags: jest.fn(() => []),
      addTag: jest.fn(),
      removeTag: jest.fn(),
    };

    const hooksModule = jest.requireMock('../../../../hooks');
    mockUseTagManager = hooksModule.useTagManager;
    mockUseTagManager.mockReturnValue(mockTagManager);

    jest.clearAllMocks();
  });

  describe('single selection mode', () => {
    it('should initialize with default value in uncontrolled mode', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          defaultValue: '2',
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.getCurrentValue()).toBe('2');
      expect(result.current.getSelectedOptions()).toEqual([{ value: '2', label: 'Banana' }]);
      expect(result.current.isOptionSelected(mockOptions[1])).toBe(true);
      expect(result.current.isOptionSelected(mockOptions[0])).toBe(false);
    });

    it('should use controlled value when provided', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: '3',
          defaultValue: '2',
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.getCurrentValue()).toBe('3');
      expect(result.current.getSelectedOptions()).toEqual([{ value: '3', label: 'Cherry' }]);
    });

    it('should handle option selection', () => {
      const mockOnChange = jest.fn();

      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: mockOptions,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleOptionSelect(mockOptions[1]);
      });

      expect(mockOnChange).toHaveBeenCalledWith('2', mockOptions[1]);
    });

    it('should ignore disabled options', () => {
      const mockOnChange = jest.fn();
      const disabledOption = { value: '5', label: 'Disabled', disabled: true };

      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: [...mockOptions, disabledOption],
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleOptionSelect(disabledOption);
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should ignore options with undefined value', () => {
      const mockOnChange = jest.fn();
      const invalidOption = { label: 'Invalid' };

      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: [...mockOptions, invalidOption],
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleOptionSelect(invalidOption);
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('multiple selection mode', () => {
    beforeEach(() => {
      mockTagManager.getCurrentTags.mockReturnValue(['1', '3']);
    });

    it('should initialize with default values in uncontrolled mode', () => {
      renderHook(() =>
        useOptionSelection({
          defaultValue: ['1', '3'],
          multiple: true,
          options: mockOptions,
        })
      );

      expect(mockUseTagManager).toHaveBeenCalledWith({
        value: undefined,
        defaultValue: ['1', '3'],
        onChange: expect.any(Function),
      });
    });

    it('should use controlled value when provided', () => {
      renderHook(() =>
        useOptionSelection({
          value: ['2', '4'],
          defaultValue: ['1', '3'],
          multiple: true,
          options: mockOptions,
        })
      );

      // 当提供了控制值时，useTagManager应该收到控制值，但defaultValue应该是原始提供的值
      expect(mockUseTagManager).toHaveBeenCalledWith({
        value: ['2', '4'],
        defaultValue: ['1', '3'],
        onChange: expect.any(Function),
      });
    });

    it('should handle option selection for unselected option', () => {
      const mockOnChange = jest.fn();
      mockTagManager.getCurrentTags.mockReturnValue(['1']);

      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: mockOptions,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleOptionSelect(mockOptions[1]); // Select Banana
      });

      expect(mockTagManager.addTag).toHaveBeenCalledWith('2');
    });

    it('should handle option deselection for selected option', () => {
      const mockOnChange = jest.fn();
      mockTagManager.getCurrentTags.mockReturnValue(['1', '2']);

      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: mockOptions,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleOptionSelect(mockOptions[1]); // Deselect Banana
      });

      expect(mockTagManager.removeTag).toHaveBeenCalledWith(1); // Index of '2' in ['1', '2']
    });

    it('should handle tag removal', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: mockOptions,
        })
      );

      act(() => {
        result.current.handleTagRemove('2', 1);
      });

      expect(mockTagManager.removeTag).toHaveBeenCalledWith(1);
    });

    it('should not handle tag removal in single mode', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: mockOptions,
        })
      );

      act(() => {
        result.current.handleTagRemove('2', 1);
      });

      expect(mockTagManager.removeTag).not.toHaveBeenCalled();
    });

    it('should call onChange with correct parameters on tag manager change', () => {
      const mockOnChange = jest.fn();

      renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: mockOptions,
          onChange: mockOnChange,
        })
      );

      // Get the onChange function passed to useTagManager
      const tagManagerOnChange = mockUseTagManager.mock.calls[0][0].onChange;

      // Simulate tag manager calling onChange
      tagManagerOnChange(['1', '3']);

      expect(mockOnChange).toHaveBeenCalledWith(
        ['1', '3'],
        [
          { value: '1', label: 'Apple' },
          { value: '3', label: 'Cherry' },
        ]
      );
    });

    it('should handle numeric values correctly', () => {
      const mockOnChange = jest.fn();

      renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: mockOptions,
          onChange: mockOnChange,
        })
      );

      const tagManagerOnChange = mockUseTagManager.mock.calls[0][0].onChange;

      // Simulate selecting option with numeric value
      tagManagerOnChange(['4']);

      expect(mockOnChange).toHaveBeenCalledWith(
        [4], // Should convert back to original numeric value
        [{ value: 4, label: 'Date' }]
      );
    });

    it('should filter out undefined values in onChange', () => {
      const mockOnChange = jest.fn();
      const optionsWithMissing = [
        { value: '1', label: 'Apple' },
        { value: '2', label: 'Banana' },
      ];

      renderHook(() =>
        useOptionSelection({
          multiple: true,
          options: optionsWithMissing,
          onChange: mockOnChange,
        })
      );

      const tagManagerOnChange = mockUseTagManager.mock.calls[0][0].onChange;

      // Simulate tags that include a value not in options
      tagManagerOnChange(['1', '3']); // '3' doesn't exist in options

      expect(mockOnChange).toHaveBeenCalledWith(
        ['1'], // Only existing values
        [{ value: '1', label: 'Apple' }]
      );
    });
  });

  describe('utility methods', () => {
    it('should return correct current value for single mode', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: '2',
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.getCurrentValue()).toBe('2');
    });

    it('should return correct current value for multiple mode with controlled value', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: ['1', '3'],
          multiple: true,
          options: mockOptions,
        })
      );

      expect(result.current.getCurrentValue()).toEqual(['1', '3']);
    });

    it('should return correct selected options for single mode', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: '2',
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.getSelectedOptions()).toEqual([{ value: '2', label: 'Banana' }]);
    });

    it('should return empty array when no option is selected', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.getSelectedOptions()).toEqual([]);
    });

    it('should correctly identify selected options', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: '2',
          multiple: false,
          options: mockOptions,
        })
      );

      expect(result.current.isOptionSelected(mockOptions[1])).toBe(true);
      expect(result.current.isOptionSelected(mockOptions[0])).toBe(false);
      expect(result.current.isOptionSelected({ label: 'Invalid' })).toBe(false);
    });

    it('should handle empty options array', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          multiple: false,
          options: [],
        })
      );

      expect(result.current.getSelectedOptions()).toEqual([]);
      expect(result.current.getCurrentValue()).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle non-array defaultValue in multiple mode', () => {
      renderHook(() =>
        useOptionSelection({
          defaultValue: '1' as any, // Invalid for multiple mode
          multiple: true,
          options: mockOptions,
        })
      );

      expect(mockUseTagManager).toHaveBeenCalledWith({
        value: undefined,
        defaultValue: [], // Should default to empty array
        onChange: expect.any(Function),
      });
    });

    it('should handle array value in single mode gracefully', () => {
      const { result } = renderHook(() =>
        useOptionSelection({
          value: ['1', '2'] as any, // Invalid for single mode
          multiple: false,
          options: mockOptions,
        })
      );

      // Should use the array as-is since value is provided
      expect(result.current.getCurrentValue()).toEqual(['1', '2']);
    });
  });
});
