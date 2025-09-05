import {
  isOptionGroup,
  isOption,
  flattenOptions,
  findOptionByValue,
  findOptionsByValues,
  filterGroupedOptions,
} from '../../utils/groupUtils';
import type { Option, OptionGroup, GroupedOption } from '../../types';

describe('groupUtils', () => {
  const mockOption1: Option = { value: 'option1', label: 'Option 1' };
  const mockOption2: Option = { value: 'option2', label: 'Option 2' };
  const mockOption3: Option = { value: 'option3', label: 'Option 3' };
  const mockOption4: Option = { value: 4, label: 'Option 4' }; // numeric value

  const mockGroup1: OptionGroup = {
    label: 'Group 1',
    options: [mockOption1, mockOption2],
  };

  const mockGroup2: OptionGroup = {
    label: 'Group 2',
    options: [mockOption3, mockOption4],
  };

  const mixedGroupedOptions: GroupedOption[] = [mockOption1, mockGroup1, mockOption3, mockGroup2];

  describe('isOptionGroup', () => {
    it('should return true for option group', () => {
      expect(isOptionGroup(mockGroup1)).toBe(true);
    });

    it('should return false for regular option', () => {
      expect(isOptionGroup(mockOption1)).toBe(false);
    });

    it('should return true for empty option group', () => {
      const emptyGroup: OptionGroup = { label: 'Empty', options: [] };
      expect(isOptionGroup(emptyGroup)).toBe(true);
    });

    it('should return false for option with undefined value', () => {
      const optionWithoutValue: Option = { label: 'No value' };
      expect(isOptionGroup(optionWithoutValue)).toBe(false);
    });
  });

  describe('isOption', () => {
    it('should return true for regular option', () => {
      expect(isOption(mockOption1)).toBe(true);
    });

    it('should return false for option group', () => {
      expect(isOption(mockGroup1)).toBe(false);
    });

    it('should return true for option with numeric value', () => {
      expect(isOption(mockOption4)).toBe(true);
    });

    it('should return false for option with undefined value', () => {
      const optionWithoutValue: Option = { label: 'No value' };
      expect(isOption(optionWithoutValue)).toBe(false);
    });

    it('should return false for option group even if it has a value property', () => {
      const groupWithValue = { ...mockGroup1, value: 'test' } as any;
      expect(isOption(groupWithValue)).toBe(false);
    });
  });

  describe('flattenOptions', () => {
    it('should flatten mixed grouped options correctly', () => {
      const result = flattenOptions(mixedGroupedOptions);

      expect(result).toHaveLength(6); // option1 appears twice, option3 appears twice
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption2);
      expect(result).toContain(mockOption3);
      expect(result).toContain(mockOption4);
      // mockOption1 appears twice (once standalone, once in group)
      expect(result.filter(opt => opt === mockOption1)).toHaveLength(2);
      // mockOption3 appears twice (once standalone, once in group)
      expect(result.filter(opt => opt === mockOption3)).toHaveLength(2);
    });

    it('should return empty array for empty input', () => {
      const result = flattenOptions([]);
      expect(result).toEqual([]);
    });

    it('should handle only regular options', () => {
      const result = flattenOptions([mockOption1, mockOption2]);

      expect(result).toHaveLength(2);
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption2);
    });

    it('should handle only option groups', () => {
      const result = flattenOptions([mockGroup1, mockGroup2]);

      expect(result).toHaveLength(4);
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption2);
      expect(result).toContain(mockOption3);
      expect(result).toContain(mockOption4);
    });

    it('should handle empty option groups', () => {
      const emptyGroup: OptionGroup = { label: 'Empty', options: [] };
      const result = flattenOptions([mockOption1, emptyGroup, mockOption2]);

      expect(result).toHaveLength(2);
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption2);
    });
  });

  describe('findOptionByValue', () => {
    it('should find option by string value', () => {
      const result = findOptionByValue(mixedGroupedOptions, 'option2');
      expect(result).toBe(mockOption2);
    });

    it('should find option by numeric value', () => {
      const result = findOptionByValue(mixedGroupedOptions, 4);
      expect(result).toBe(mockOption4);
    });

    it('should return undefined for non-existent value', () => {
      const result = findOptionByValue(mixedGroupedOptions, 'non-existent');
      expect(result).toBeUndefined();
    });

    it('should return first matching option when there are duplicates', () => {
      const result = findOptionByValue(mixedGroupedOptions, 'option1');
      expect(result).toBe(mockOption1);
    });

    it('should return undefined for empty options array', () => {
      const result = findOptionByValue([], 'option1');
      expect(result).toBeUndefined();
    });

    it('should handle searching in option groups only', () => {
      const result = findOptionByValue([mockGroup1, mockGroup2], 'option3');
      expect(result).toBe(mockOption3);
    });
  });

  describe('findOptionsByValues', () => {
    it('should find multiple options by their values', () => {
      const result = findOptionsByValues(mixedGroupedOptions, ['option1', 'option3', 4]);

      expect(result).toHaveLength(3);
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption3);
      expect(result).toContain(mockOption4);
    });

    it('should return empty array for empty values array', () => {
      const result = findOptionsByValues(mixedGroupedOptions, []);
      expect(result).toEqual([]);
    });

    it('should filter out non-existent values', () => {
      const result = findOptionsByValues(mixedGroupedOptions, ['option1', 'non-existent', 'option2']);

      expect(result).toHaveLength(2);
      expect(result).toContain(mockOption1);
      expect(result).toContain(mockOption2);
    });

    it('should handle mixed string and numeric values', () => {
      const result = findOptionsByValues(mixedGroupedOptions, ['option2', 4, 'option3']);

      expect(result).toHaveLength(3);
      expect(result).toContain(mockOption2);
      expect(result).toContain(mockOption4);
      expect(result).toContain(mockOption3);
    });

    it('should return empty array when no options are found', () => {
      const result = findOptionsByValues(mixedGroupedOptions, ['non-existent1', 'non-existent2']);
      expect(result).toEqual([]);
    });

    it('should handle duplicate values in input array', () => {
      const result = findOptionsByValues(mixedGroupedOptions, ['option1', 'option1', 'option2']);

      // Should return first match for each value, including duplicates
      expect(result).toHaveLength(3);
      expect(result.filter(opt => opt === mockOption1)).toHaveLength(2);
      expect(result.filter(opt => opt === mockOption2)).toHaveLength(1);
    });
  });

  describe('filterGroupedOptions', () => {
    const testOptions: GroupedOption[] = [
      { value: 'apple', label: 'Apple' },
      {
        label: 'Fruits',
        options: [
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry' },
        ],
      },
      { value: 'carrot', label: 'Carrot' },
      {
        label: 'Vegetables',
        options: [
          { value: 'broccoli', label: 'Broccoli' },
          { value: 'spinach', label: 'Spinach' },
        ],
      },
    ];

    it('should return all options when search value is empty', () => {
      const result = filterGroupedOptions(testOptions, '');
      expect(result).toEqual(testOptions);
    });

    it('should return all options when search value is only whitespace', () => {
      const result = filterGroupedOptions(testOptions, '   ');
      expect(result).toEqual(testOptions);
    });

    it('should filter standalone options by label', () => {
      const result = filterGroupedOptions(testOptions, 'apple');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'apple', label: 'Apple' });
    });

    it('should filter standalone options by value', () => {
      const result = filterGroupedOptions(testOptions, 'carrot');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'carrot', label: 'Carrot' });
    });

    it('should filter options within groups', () => {
      const result = filterGroupedOptions(testOptions, 'banana');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        label: 'Fruits',
        options: [{ value: 'banana', label: 'Banana' }],
      });
    });

    it('should return multiple matching options in a group', () => {
      const result = filterGroupedOptions(testOptions, 'c');

      // Should match 'Cherry', 'Carrot', 'Broccoli', and 'Spinach' (spinach contains 'c')
      expect(result).toHaveLength(3);

      // Find the fruits group
      const fruitsGroup = result.find(item => isOptionGroup(item) && item.label === 'Fruits') as OptionGroup;
      expect(fruitsGroup?.options).toHaveLength(1);
      expect(fruitsGroup?.options[0]).toEqual({ value: 'cherry', label: 'Cherry' });

      // Find standalone carrot
      const carrotOption = result.find(item => isOption(item) && item.value === 'carrot');
      expect(carrotOption).toEqual({ value: 'carrot', label: 'Carrot' });

      // Find vegetables group with broccoli and spinach (both contain 'c')
      const vegetablesGroup = result.find(item => isOptionGroup(item) && item.label === 'Vegetables') as OptionGroup;
      expect(vegetablesGroup?.options).toHaveLength(2);
      expect(vegetablesGroup?.options).toContainEqual({ value: 'broccoli', label: 'Broccoli' });
      expect(vegetablesGroup?.options).toContainEqual({ value: 'spinach', label: 'Spinach' });
    });

    it('should be case insensitive', () => {
      const result = filterGroupedOptions(testOptions, 'APPLE');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'apple', label: 'Apple' });
    });

    it('should return empty array when no matches found', () => {
      const result = filterGroupedOptions(testOptions, 'xyz');
      expect(result).toEqual([]);
    });

    it('should use custom filter function when provided', () => {
      const customFilter = jest.fn((input: string, option: Option) => {
        return option.value?.toString().includes('a') ?? false;
      });

      const result = filterGroupedOptions(testOptions, 'test', customFilter);

      // Should call custom filter for each option
      expect(customFilter).toHaveBeenCalled();

      // Should return options with 'a' in value: apple, banana, carrot, spinach
      expect(result).toHaveLength(4);
    });

    it('should handle options without labels', () => {
      const optionsWithoutLabels: GroupedOption[] = [
        { value: 'value1' },
        {
          label: 'Group',
          options: [{ value: 'value2' }, { value: 'value3', label: 'Label 3' }],
        },
      ];

      const result = filterGroupedOptions(optionsWithoutLabels, 'value1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'value1' });
    });

    it('should handle numeric values', () => {
      const numericOptions: GroupedOption[] = [
        { value: 123, label: 'Number 123' },
        {
          label: 'Numbers',
          options: [
            { value: 456, label: 'Number 456' },
            { value: 789, label: 'Number 789' },
          ],
        },
      ];

      const result = filterGroupedOptions(numericOptions, '456');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        label: 'Numbers',
        options: [{ value: 456, label: 'Number 456' }],
      });
    });

    it('should handle partial matches', () => {
      const result = filterGroupedOptions(testOptions, 'app');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ value: 'apple', label: 'Apple' });
    });

    it('should not include groups with no matching options', () => {
      const result = filterGroupedOptions(testOptions, 'apple');

      // Should only include the standalone apple option, not any groups
      expect(result).toHaveLength(1);
      expect(isOption(result[0])).toBe(true);
    });

    it('should handle options with undefined labels and values gracefully', () => {
      const problematicOptions: GroupedOption[] = [
        { value: undefined, label: undefined } as any,
        {
          label: 'Group',
          options: [{ value: 'good', label: 'Good Option' }, { value: undefined, label: undefined } as any],
        },
      ];

      // Should not throw error
      expect(() => {
        filterGroupedOptions(problematicOptions, 'good');
      }).not.toThrow();

      const result = filterGroupedOptions(problematicOptions, 'good');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        label: 'Group',
        options: [{ value: 'good', label: 'Good Option' }],
      });
    });
  });
});
