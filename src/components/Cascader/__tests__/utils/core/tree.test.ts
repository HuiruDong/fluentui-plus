import {
  hasChildren,
  getChildren,
  isOptionDisabled,
  flattenOptions,
  getAllLeafKeys,
  getDescendantLeafKeys,
  getAncestorKeys,
} from '../../../utils/core/tree';
import type { CascaderOption } from '../../../types';

describe('tree.ts', () => {
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
              disabled: true,
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
        {
          value: 'suzhou',
          label: '苏州',
        },
      ],
    },
    {
      value: 'beijing',
      label: '北京',
    },
  ];

  const emptyChildrenOptions: CascaderOption[] = [
    {
      value: 'option1',
      label: 'Option 1',
      children: [],
    },
  ];

  const optionsWithUndefinedValues: CascaderOption[] = [
    {
      label: 'No Value',
      children: [
        {
          value: 'child1',
          label: 'Child 1',
        },
      ],
    },
    {
      value: 'parent2',
      label: 'Parent 2',
      children: [
        {
          label: 'Child No Value',
        },
      ],
    },
  ];

  describe('hasChildren', () => {
    test('should return true for option with children array', () => {
      const option = {
        value: 'parent',
        label: 'Parent',
        children: [{ value: 'child', label: 'Child' }],
      };

      expect(hasChildren(option)).toBe(true);
    });

    test('should return false for option without children', () => {
      const option = {
        value: 'leaf',
        label: 'Leaf',
      };

      expect(hasChildren(option)).toBe(false);
    });

    test('should return false for option with empty children array', () => {
      const option = {
        value: 'empty',
        label: 'Empty',
        children: [],
      };

      expect(hasChildren(option)).toBe(false);
    });

    test('should return false for option with null children', () => {
      const option = {
        value: 'null',
        label: 'Null',
        children: null as any,
      };

      expect(hasChildren(option)).toBe(false);
    });

    test('should return false for option with undefined children', () => {
      const option = {
        value: 'undefined',
        label: 'Undefined',
        children: undefined,
      };

      expect(hasChildren(option)).toBe(false);
    });
  });

  describe('getChildren', () => {
    test('should return children array when present', () => {
      const children = [{ value: 'child1', label: 'Child 1' }];
      const option = {
        value: 'parent',
        label: 'Parent',
        children,
      };

      expect(getChildren(option)).toEqual(children);
    });

    test('should return empty array when children is undefined', () => {
      const option = {
        value: 'leaf',
        label: 'Leaf',
      };

      expect(getChildren(option)).toEqual([]);
    });

    test('should return empty array when children is null', () => {
      const option = {
        value: 'null',
        label: 'Null',
        children: null as any,
      };

      expect(getChildren(option)).toEqual([]);
    });

    test('should return empty array when children is not an array', () => {
      const option = {
        value: 'invalid',
        label: 'Invalid',
        children: 'not an array' as any,
      };

      expect(getChildren(option)).toEqual([]);
    });

    test('should return original children array (not a copy)', () => {
      const children = [{ value: 'child1', label: 'Child 1' }];
      const option = {
        value: 'parent',
        label: 'Parent',
        children,
      };

      const result = getChildren(option);
      expect(result).toBe(children); // Same reference
    });
  });

  describe('isOptionDisabled', () => {
    test('should return true for disabled option', () => {
      const option = {
        value: 'disabled',
        label: 'Disabled',
        disabled: true,
      };

      expect(isOptionDisabled(option)).toBe(true);
    });

    test('should return false for enabled option', () => {
      const option = {
        value: 'enabled',
        label: 'Enabled',
        disabled: false,
      };

      expect(isOptionDisabled(option)).toBe(false);
    });

    test('should return false for option without disabled property', () => {
      const option = {
        value: 'normal',
        label: 'Normal',
      };

      expect(isOptionDisabled(option)).toBe(false);
    });

    test('should return false for option with undefined disabled', () => {
      const option = {
        value: 'undefined',
        label: 'Undefined',
        disabled: undefined,
      };

      expect(isOptionDisabled(option)).toBe(false);
    });

    test('should return false for option with null disabled', () => {
      const option = {
        value: 'null',
        label: 'Null',
        disabled: null as any,
      };

      expect(isOptionDisabled(option)).toBe(false);
    });
  });

  describe('flattenOptions', () => {
    test('should flatten nested options correctly', () => {
      const result = flattenOptions(mockOptions);

      expect(result).toHaveLength(11); // All nodes in the tree (including 北京)

      // Check some specific items
      const zhejangItem = result.find(item => item.option.value === 'zhejiang');
      expect(zhejangItem).toBeDefined();
      expect(zhejangItem!.path).toHaveLength(1);
      expect(zhejangItem!.value).toEqual(['zhejiang']);
      expect(zhejangItem!.label).toBe('浙江');

      const xihuItem = result.find(item => item.option.value === 'xihu');
      expect(xihuItem).toBeDefined();
      expect(xihuItem!.path).toHaveLength(3);
      expect(xihuItem!.value).toEqual(['zhejiang', 'hangzhou', 'xihu']);
      expect(xihuItem!.label).toBe('浙江 / 杭州 / 西湖');
    });

    test('should handle empty options array', () => {
      const result = flattenOptions([]);
      expect(result).toEqual([]);
    });

    test('should handle single level options', () => {
      const singleLevel = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      const result = flattenOptions(singleLevel);

      expect(result).toHaveLength(2);
      expect(result[0].path).toHaveLength(1);
      expect(result[0].value).toEqual(['option1']);
      expect(result[1].path).toHaveLength(1);
      expect(result[1].value).toEqual(['option2']);
    });

    test('should work with custom parent path', () => {
      const parentPath = [{ value: 'root', label: 'Root' }];
      const options = [{ value: 'child', label: 'Child' }];

      const result = flattenOptions(options, parentPath);

      expect(result).toHaveLength(1);
      expect(result[0].path).toHaveLength(2);
      expect(result[0].path[0]).toEqual(parentPath[0]);
      expect(result[0].value).toEqual(['root', 'child']);
    });

    test('should handle options with undefined values', () => {
      const result = flattenOptions(optionsWithUndefinedValues);

      // Should filter out undefined values in the value array
      const itemWithUndefinedParent = result.find(item => item.option.value === 'child1');
      expect(itemWithUndefinedParent).toBeDefined();
      expect(itemWithUndefinedParent!.value).toEqual(['child1']); // Undefined parent value filtered out

      const itemWithUndefinedChild = result.find(item => item.option.label === 'Child No Value');
      expect(itemWithUndefinedChild).toBeDefined();
      expect(itemWithUndefinedChild!.value).toEqual(['parent2']); // Undefined child value filtered out
    });

    test('should generate correct labels for options without label', () => {
      const options = [
        {
          value: 'value1',
          children: [
            {
              value: 'value2',
              label: 'Label 2',
            },
          ],
        },
      ];

      const result = flattenOptions(options);

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('value1'); // Uses value as fallback
      expect(result[1].label).toBe('value1 / Label 2');
    });

    test('should handle options with empty string labels', () => {
      const options = [
        {
          value: 'value1',
          label: '',
          children: [
            {
              value: 'value2',
              label: 'Child',
            },
          ],
        },
      ];

      const result = flattenOptions(options);

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('value1'); // Uses value as fallback when label is empty
      expect(result[1].label).toBe('value1 / Child'); // Uses parent value as fallback
    });
  });

  describe('getAllLeafKeys', () => {
    test('should return all leaf node keys', () => {
      const result = getAllLeafKeys(mockOptions);

      const expectedKeys = new Set(['xihu', 'binjiang', 'haishu', 'xuanwu', 'suzhou', 'beijing']);
      expect(result).toEqual(expectedKeys);
    });

    test('should handle empty options array', () => {
      const result = getAllLeafKeys([]);
      expect(result).toEqual(new Set());
    });

    test('should handle options with only non-leaf nodes', () => {
      const nonLeafOptions = [
        {
          value: 'parent',
          children: [
            {
              value: 'child',
              children: [],
            },
          ],
        },
      ];

      const result = getAllLeafKeys(nonLeafOptions);
      expect(result).toEqual(new Set(['child']));
    });

    test('should handle options with undefined values', () => {
      const result = getAllLeafKeys(optionsWithUndefinedValues);

      const expectedKeys = new Set([]); // No valid leaf keys because parent has undefined value
      expect(result).toEqual(expectedKeys);
    });

    test('should handle single level options', () => {
      const singleLevel = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      const result = getAllLeafKeys(singleLevel);
      expect(result).toEqual(new Set(['option1', 'option2']));
    });

    test('should handle empty children arrays', () => {
      const result = getAllLeafKeys(emptyChildrenOptions);
      expect(result).toEqual(new Set(['option1']));
    });
  });

  describe('getDescendantLeafKeys', () => {
    test('should return all descendant leaf keys for non-leaf node', () => {
      const zhejangOption = mockOptions[0]; // Has children
      const result = getDescendantLeafKeys(zhejangOption);

      const expectedKeys = new Set(['xihu', 'binjiang', 'haishu']);
      expect(result).toEqual(expectedKeys);
    });

    test('should return own key for leaf node', () => {
      const leafOption = { value: 'leaf', label: 'Leaf' };
      const result = getDescendantLeafKeys(leafOption);

      expect(result).toEqual(new Set(['leaf']));
    });

    test('should return empty set for node with undefined value', () => {
      const undefinedValueOption = { label: 'No Value' };
      const result = getDescendantLeafKeys(undefinedValueOption);

      expect(result).toEqual(new Set());
    });

    test('should handle node with empty children array', () => {
      const emptyChildrenOption = { value: 'empty', children: [] };
      const result = getDescendantLeafKeys(emptyChildrenOption);

      expect(result).toEqual(new Set(['empty']));
    });

    test('should handle complex nested structure', () => {
      const jiangsuOption = mockOptions[1];
      const result = getDescendantLeafKeys(jiangsuOption);

      const expectedKeys = new Set(['xuanwu', 'suzhou']);
      expect(result).toEqual(expectedKeys);
    });

    test('should filter out undefined values in descendants', () => {
      const optionWithUndefinedChildren = {
        value: 'parent',
        children: [
          { value: 'child1', label: 'Child 1' },
          { label: 'Child 2' }, // No value
          { value: 'child3', children: [] },
        ],
      };

      const result = getDescendantLeafKeys(optionWithUndefinedChildren);
      expect(result).toEqual(new Set(['child1', 'child3']));
    });

    test('should handle deeply nested structure', () => {
      const deepOption = {
        value: 'level1',
        children: [
          {
            value: 'level2',
            children: [
              {
                value: 'level3',
                children: [{ value: 'leaf1' }, { value: 'leaf2' }],
              },
            ],
          },
        ],
      };

      const result = getDescendantLeafKeys(deepOption);
      expect(result).toEqual(new Set(['leaf1', 'leaf2']));
    });
  });

  describe('getAncestorKeys', () => {
    test('should return ancestor keys for nested node', () => {
      const result = getAncestorKeys(mockOptions, 'xihu');

      expect(result).toEqual(['zhejiang', 'hangzhou']);
    });

    test('should return empty array for root level node', () => {
      const result = getAncestorKeys(mockOptions, 'zhejiang');

      expect(result).toEqual([]);
    });

    test('should return empty array for non-existent key', () => {
      const result = getAncestorKeys(mockOptions, 'nonexistent');

      expect(result).toEqual([]);
    });

    test('should return correct ancestors for second level node', () => {
      const result = getAncestorKeys(mockOptions, 'hangzhou');

      expect(result).toEqual(['zhejiang']);
    });

    test('should handle multiple paths correctly', () => {
      const result1 = getAncestorKeys(mockOptions, 'haishu');
      const result2 = getAncestorKeys(mockOptions, 'xuanwu');

      expect(result1).toEqual(['zhejiang', 'ningbo']);
      expect(result2).toEqual(['jiangsu', 'nanjing']);
    });

    test('should handle empty options array', () => {
      const result = getAncestorKeys([], 'anykey');

      expect(result).toEqual([]);
    });

    test('should handle options with undefined values', () => {
      const result = getAncestorKeys(optionsWithUndefinedValues, 'child1');

      expect(result).toEqual([]); // Parent has undefined value, so no ancestor keys
    });

    test('should handle numeric keys', () => {
      const numericOptions = [
        {
          value: 1,
          children: [
            {
              value: 2,
              children: [
                {
                  value: 3,
                },
              ],
            },
          ],
        },
      ];

      const result = getAncestorKeys(numericOptions, 3);
      expect(result).toEqual([1, 2]);
    });

    test('should handle mixed string and numeric keys', () => {
      const mixedOptions = [
        {
          value: 'root',
          children: [
            {
              value: 123,
              children: [
                {
                  value: 'leaf',
                },
              ],
            },
          ],
        },
      ];

      const result = getAncestorKeys(mixedOptions, 'leaf');
      expect(result).toEqual(['root', 123]);
    });

    test('should stop at first match (not search all branches)', () => {
      const duplicateKeyOptions = [
        {
          value: 'parent1',
          children: [
            {
              value: 'duplicate',
            },
          ],
        },
        {
          value: 'parent2',
          children: [
            {
              value: 'duplicate',
            },
          ],
        },
      ];

      const result = getAncestorKeys(duplicateKeyOptions, 'duplicate');
      expect(result).toEqual(['parent1']); // Should find first occurrence
    });
  });
});
