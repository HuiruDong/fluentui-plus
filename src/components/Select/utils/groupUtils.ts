import { Option, OptionGroup, GroupedOption } from '../types';

/**
 * 判断是否为分组选项
 */
export const isOptionGroup = (item: GroupedOption): item is OptionGroup => {
  return 'options' in item && Array.isArray(item.options);
};

/**
 * 判断是否为普通选项
 */
export const isOption = (item: GroupedOption): item is Option => {
  return 'value' in item && !('options' in item);
};

/**
 * 从分组选项中提取所有的普通选项
 */
export const flattenOptions = (groupedOptions: GroupedOption[]): Option[] => {
  const result: Option[] = [];

  groupedOptions.forEach(item => {
    if (isOption(item)) {
      result.push(item);
    } else if (isOptionGroup(item)) {
      result.push(...item.options);
    }
  });

  return result;
};

/**
 * 根据值查找对应的选项
 */
export const findOptionByValue = (groupedOptions: GroupedOption[], value: string | number): Option | undefined => {
  const flatOptions = flattenOptions(groupedOptions);
  return flatOptions.find(option => option.value === value);
};

/**
 * 根据值数组查找对应的选项数组
 */
export const findOptionsByValues = (groupedOptions: GroupedOption[], values: (string | number)[]): Option[] => {
  const flatOptions = flattenOptions(groupedOptions);
  return values.map(value => flatOptions.find(option => option.value === value)).filter(Boolean) as Option[];
};

/**
 * 过滤分组选项（兼容普通选项）
 */
export const filterGroupedOptions = (
  groupedOptions: GroupedOption[],
  searchValue: string,
  filterOption?: (input: string, option: Option) => boolean
): GroupedOption[] => {
  if (!searchValue.trim()) {
    return groupedOptions;
  }

  const defaultFilter = (input: string, option: Option): boolean => {
    const searchLower = input.toLowerCase();
    return (
      (option.label?.toLowerCase().includes(searchLower) ?? false) ||
      (option.value?.toString().toLowerCase().includes(searchLower) ?? false)
    );
  };

  const filter = filterOption || defaultFilter;

  return groupedOptions.reduce<GroupedOption[]>((result, item) => {
    if (isOption(item)) {
      if (filter(searchValue, item)) {
        result.push(item);
      }
    } else if (isOptionGroup(item)) {
      const filteredOptions = item.options.filter(option => filter(searchValue, option));
      if (filteredOptions.length > 0) {
        result.push({
          ...item,
          options: filteredOptions,
        });
      }
    }
    return result;
  }, []);
};
