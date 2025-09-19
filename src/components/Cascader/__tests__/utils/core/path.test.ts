import { findPathByValue, getValueFromPath, getLabelsFromPath, generateDisplayText } from '../../../utils/core/path';
import { DEFAULT_SEPARATOR } from '../../../utils/shared/constants';
import type { CascaderOption } from '../../../types';

describe('path.ts', () => {
  // 测试数据
  const mockOptions: CascaderOption[] = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            {
              value: 'xihu',
              label: '西湖',
            },
            {
              value: 'binjiang',
              label: '滨江',
            },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            {
              value: 'haishu',
              label: '海曙',
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'xuanwu',
              label: '玄武',
            },
          ],
        },
      ],
    },
  ];

  const disabledOptions: CascaderOption[] = [
    {
      value: 'option1',
      label: 'Option 1',
      disabled: true,
    },
    {
      value: 'option2',
      label: 'Option 2',
      children: [
        {
          value: 'option2_1',
          label: 'Option 2-1',
        },
      ],
    },
  ];

  describe('findPathByValue', () => {
    test('should find correct path for valid value array', () => {
      const result = findPathByValue(mockOptions, ['zhejiang', 'hangzhou', 'xihu']);

      expect(result).toHaveLength(3);
      expect(result![0].value).toBe('zhejiang');
      expect(result![1].value).toBe('hangzhou');
      expect(result![2].value).toBe('xihu');
    });

    test('should find correct path for single level value', () => {
      const result = findPathByValue(mockOptions, ['zhejiang']);

      expect(result).toHaveLength(1);
      expect(result![0].value).toBe('zhejiang');
    });

    test('should find correct path for two level value', () => {
      const result = findPathByValue(mockOptions, ['jiangsu', 'nanjing']);

      expect(result).toHaveLength(2);
      expect(result![0].value).toBe('jiangsu');
      expect(result![1].value).toBe('nanjing');
    });

    test('should return null for empty value array', () => {
      const result = findPathByValue(mockOptions, []);
      expect(result).toBeNull();
    });

    test('should return null for null/undefined value', () => {
      expect(findPathByValue(mockOptions, null as any)).toBeNull();
      expect(findPathByValue(mockOptions, undefined as any)).toBeNull();
    });

    test('should return null for non-existent value', () => {
      const result = findPathByValue(mockOptions, ['nonexistent']);
      expect(result).toBeNull();
    });

    test('should return null for partially correct path', () => {
      const result = findPathByValue(mockOptions, ['zhejiang', 'hangzhou', 'nonexistent']);
      expect(result).toBeNull();
    });

    test('should return null for incorrect order', () => {
      const result = findPathByValue(mockOptions, ['hangzhou', 'zhejiang']);
      expect(result).toBeNull();
    });

    test('should handle empty options array', () => {
      const result = findPathByValue([], ['value']);
      expect(result).toBeNull();
    });

    test('should work with disabled options', () => {
      const result = findPathByValue(disabledOptions, ['option1']);

      expect(result).toHaveLength(1);
      expect(result![0].value).toBe('option1');
      expect(result![0].disabled).toBe(true);
    });

    test('should find nested path in options with disabled parent', () => {
      const result = findPathByValue(disabledOptions, ['option2', 'option2_1']);

      expect(result).toHaveLength(2);
      expect(result![0].value).toBe('option2');
      expect(result![1].value).toBe('option2_1');
    });
  });

  describe('getValueFromPath', () => {
    test('should extract values from path correctly', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = getValueFromPath(path);
      expect(result).toEqual(['zhejiang', 'hangzhou', 'xihu']);
    });

    test('should handle empty path', () => {
      const result = getValueFromPath([]);
      expect(result).toEqual([]);
    });

    test('should handle path with undefined values', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: undefined, label: '无值' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = getValueFromPath(path);
      expect(result).toEqual(['zhejiang', 'xihu']);
    });

    test('should handle path with null values', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: null as any, label: '空值' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = getValueFromPath(path);
      expect(result).toEqual(['zhejiang', 'xihu']);
    });

    test('should handle mixed value types', () => {
      const path: CascaderOption[] = [
        { value: 'string', label: 'String Value' },
        { value: 123, label: 'Number Value' },
        { value: 0, label: 'Zero Value' },
      ];

      const result = getValueFromPath(path);
      expect(result).toEqual(['string', 123]); // lodash compact removes falsy values like 0
    });
  });

  describe('getLabelsFromPath', () => {
    test('should extract labels from path correctly', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = getLabelsFromPath(path);
      expect(result).toEqual(['浙江', '杭州', '西湖']);
    });

    test('should handle empty path', () => {
      const result = getLabelsFromPath([]);
      expect(result).toEqual([]);
    });

    test('should use value as fallback when label is missing', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = getLabelsFromPath(path);
      expect(result).toEqual(['浙江', 'hangzhou', '西湖']);
    });

    test('should use empty string for options without label and value', () => {
      const path: CascaderOption[] = [{ value: 'zhejiang', label: '浙江' }, {}, { value: 'xihu', label: '西湖' }];

      const result = getLabelsFromPath(path);
      expect(result).toEqual(['浙江', '', '西湖']);
    });

    test('should handle numeric values', () => {
      const path: CascaderOption[] = [{ value: 1, label: 'One' }, { value: 2 }, { value: 0, label: 'Zero' }];

      const result = getLabelsFromPath(path);
      expect(result).toEqual(['One', '2', 'Zero']);
    });

    test('should handle mixed scenarios', () => {
      const path: CascaderOption[] = [
        { value: 'str', label: 'String' },
        { value: 123 },
        { label: 'Label Only' },
        {},
        { value: 0, label: '' },
      ];

      const result = getLabelsFromPath(path);
      expect(result).toEqual(['String', '123', 'Label Only', '', '0']); // 0 converts to '0'
    });
  });

  describe('generateDisplayText', () => {
    test('should generate display text with default separator', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = generateDisplayText(path);
      expect(result).toBe('浙江 / 杭州 / 西湖');
    });

    test('should generate display text with custom separator', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = generateDisplayText(path, ' > ');
      expect(result).toBe('浙江 > 杭州 > 西湖');
    });

    test('should handle empty path', () => {
      const result = generateDisplayText([]);
      expect(result).toBe('');
    });

    test('should handle single level path', () => {
      const path: CascaderOption[] = [{ value: 'zhejiang', label: '浙江' }];

      const result = generateDisplayText(path);
      expect(result).toBe('浙江');
    });

    test('should use default separator constant', () => {
      const path: CascaderOption[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];

      const result = generateDisplayText(path);
      expect(result).toBe(`A${DEFAULT_SEPARATOR}B`);
    });

    test('should handle path with missing labels', () => {
      const path: CascaderOption[] = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou' },
        { value: 'xihu', label: '西湖' },
      ];

      const result = generateDisplayText(path, ' - ');
      expect(result).toBe('浙江 - hangzhou - 西湖');
    });

    test('should handle empty separator', () => {
      const path: CascaderOption[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];

      const result = generateDisplayText(path, '');
      expect(result).toBe('AB');
    });

    test('should handle numeric values in path', () => {
      const path: CascaderOption[] = [{ value: 1, label: 'One' }, { value: 2 }, { value: 3, label: 'Three' }];

      const result = generateDisplayText(path, ' | ');
      expect(result).toBe('One | 2 | Three');
    });
  });
});
