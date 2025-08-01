import { defaultFilterOption, filterOptions } from '../../utils/filterOptions';
import type { Option } from '../../types';

describe('filterOptions', () => {
  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
    { value: '4', label: 'Date' },
    { value: 'orange', label: 'Orange' },
  ];

  describe('defaultFilterOption', () => {
    it('should return true for empty input', () => {
      const option = { value: '1', label: 'Apple' };
      expect(defaultFilterOption('', option)).toBe(true);
      expect(defaultFilterOption('   ', option)).toBe(true);
    });

    it('should match by label case-insensitively', () => {
      const option = { value: '1', label: 'Apple' };
      expect(defaultFilterOption('apple', option)).toBe(true);
      expect(defaultFilterOption('APPLE', option)).toBe(true);
      expect(defaultFilterOption('App', option)).toBe(true);
      expect(defaultFilterOption('ple', option)).toBe(true);
    });

    it('should match by value case-insensitively', () => {
      const option = { value: 'orange', label: 'Orange Fruit' };
      expect(defaultFilterOption('orange', option)).toBe(true);
      expect(defaultFilterOption('ORANGE', option)).toBe(true);
      expect(defaultFilterOption('rang', option)).toBe(true);
    });

    it('should return false for non-matching input', () => {
      const option = { value: '1', label: 'Apple' };
      expect(defaultFilterOption('banana', option)).toBe(false);
      expect(defaultFilterOption('xyz', option)).toBe(false);
    });

    it('should handle options without label or value', () => {
      expect(defaultFilterOption('test', { value: undefined, label: undefined })).toBe(false);
      expect(defaultFilterOption('test', { value: null as unknown as string, label: null as unknown as string })).toBe(
        false
      );
    });

    it('should handle numeric values', () => {
      const option = { value: 123, label: 'Number Option' };
      expect(defaultFilterOption('123', option)).toBe(true);
      expect(defaultFilterOption('23', option)).toBe(true);
    });
  });

  describe('filterOptions', () => {
    it('should return all options for empty search value', () => {
      expect(filterOptions(mockOptions, '')).toEqual(mockOptions);
      expect(filterOptions(mockOptions, '   ')).toEqual(mockOptions);
    });

    it('should filter options using default filter function', () => {
      const result = filterOptions(mockOptions, 'a');
      expect(result).toEqual([
        { value: '1', label: 'Apple' },
        { value: '2', label: 'Banana' },
        { value: '4', label: 'Date' },
        { value: 'orange', label: 'Orange' },
      ]);
    });

    it('should filter options case-insensitively', () => {
      const result = filterOptions(mockOptions, 'A');
      expect(result).toEqual([
        { value: '1', label: 'Apple' },
        { value: '2', label: 'Banana' },
        { value: '4', label: 'Date' },
        { value: 'orange', label: 'Orange' },
      ]);
    });

    it('should use custom filter function when provided', () => {
      const customFilter = (input: string, option: Option) => {
        return option.value === input;
      };

      const result = filterOptions(mockOptions, '1', customFilter);
      expect(result).toEqual([{ value: '1', label: 'Apple' }]);
    });

    it('should return empty array when no options match', () => {
      const result = filterOptions(mockOptions, 'xyz');
      expect(result).toEqual([]);
    });

    it('should handle empty options array', () => {
      expect(filterOptions([], 'test')).toEqual([]);
    });

    it('should filter by partial matches', () => {
      const result = filterOptions(mockOptions, 'an');
      expect(result).toEqual([
        { value: '2', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
      ]);
    });
  });
});
