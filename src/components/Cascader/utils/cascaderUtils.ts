import type { CascaderOption, CascaderValue, CascaderSearchResult } from '../types';

/**
 * 根据值在选项树中查找对应的路径
 * @param options 选项树
 * @param targetValue 目标值数组
 * @returns 找到的选项路径，如果未找到返回 null
 */
export const findPathByValue = (options: CascaderOption[], targetValue: CascaderValue): CascaderOption[] | null => {
  if (!targetValue || targetValue.length === 0) {
    return null;
  }

  const findPath = (
    nodes: CascaderOption[],
    values: CascaderValue,
    currentPath: CascaderOption[]
  ): CascaderOption[] | null => {
    if (values.length === 0) {
      return currentPath;
    }

    const [currentValue, ...restValues] = values;

    for (const node of nodes) {
      if (node.value === currentValue) {
        const newPath = [...currentPath, node];

        if (restValues.length === 0) {
          return newPath;
        }

        const children = node.children || [];
        const result = findPath(children, restValues, newPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  return findPath(options, targetValue, []);
};

/**
 * 根据选项路径生成值数组
 * @param path 选项路径
 * @returns 值数组
 */
export const getValueFromPath = (path: CascaderOption[]): CascaderValue => {
  return path.map(option => option.value).filter((value): value is string | number => value !== undefined);
};

/**
 * 根据选项路径生成标签数组
 * @param path 选项路径
 * @returns 标签数组
 */
export const getLabelsFromPath = (path: CascaderOption[]): string[] => {
  return path.map(option => option.label || option.value?.toString() || '');
};

/**
 * 扁平化选项树，用于搜索
 * @param options 选项树
 * @param parentPath 父级路径
 * @returns 扁平化的选项列表，每个选项包含完整路径信息
 */
export const flattenOptions = (
  options: CascaderOption[],
  parentPath: CascaderOption[] = []
): CascaderSearchResult[] => {
  const result: CascaderSearchResult[] = [];

  const traverse = (nodes: CascaderOption[], currentPath: CascaderOption[]) => {
    nodes.forEach(node => {
      const fullPath = [...currentPath, node];
      const value = getValueFromPath(fullPath);
      const label = getLabelsFromPath(fullPath).join(' / ');

      result.push({
        option: node,
        path: fullPath,
        value,
        label,
      });

      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children, fullPath);
      }
    });
  };

  traverse(options, parentPath);
  return result;
};

/**
 * 检查选项是否被禁用
 * @param option 选项
 * @returns 是否禁用
 */
export const isOptionDisabled = (option: CascaderOption): boolean => {
  return Boolean(option.disabled);
};

/**
 * 检查选项是否有子选项
 * @param option 选项
 * @returns 是否有子选项
 */
export const hasChildren = (option: CascaderOption): boolean => {
  return Array.isArray(option.children) && option.children.length > 0;
};

/**
 * 获取选项的子选项
 * @param option 选项
 * @returns 子选项数组
 */
export const getChildren = (option: CascaderOption): CascaderOption[] => {
  return Array.isArray(option.children) ? option.children : [];
};

/**
 * 默认过滤函数：检查路径中是否包含搜索关键词
 * @param input 搜索关键词
 * @param path 选项路径
 * @returns 是否匹配
 */
export const defaultFilterOption = (input: string, path: CascaderOption[]): boolean => {
  if (!input) return true;

  const searchText = input.toLowerCase();
  const labels = getLabelsFromPath(path);

  // 检查是否有任何标签包含搜索关键词
  return labels.some(label => label.toLowerCase().includes(searchText));
};

/**
 * 过滤选项，用于搜索功能
 * @param options 选项树
 * @param input 搜索关键词
 * @returns 过滤后的搜索结果
 */
export const filterCascaderOptions = (options: CascaderOption[], input: string): CascaderSearchResult[] => {
  if (!input) return [];

  const flatOptions = flattenOptions(options);

  return flatOptions.filter(item => defaultFilterOption(input, item.path));
};

/**
 * 比较两个值数组是否相等
 * @param a 值数组 A
 * @param b 值数组 B
 * @returns 是否相等
 */
export const isValueEqual = (a?: CascaderValue, b?: CascaderValue): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  return a.every((val, index) => val === b[index]);
};

/**
 * 检查某个值是否在值数组列表中
 * @param value 目标值
 * @param valueList 值数组列表
 * @returns 是否存在
 */
export const isValueInList = (value: CascaderValue, valueList: CascaderValue[]): boolean => {
  return valueList.some(item => isValueEqual(item, value));
};

/**
 * 从值数组列表中移除指定的值
 * @param targetValue 要移除的值
 * @param valueList 值数组列表
 * @returns 移除后的值数组列表
 */
export const removeValueFromList = (targetValue: CascaderValue, valueList: CascaderValue[]): CascaderValue[] => {
  return valueList.filter(item => !isValueEqual(item, targetValue));
};

/**
 * 生成显示文本
 * @param selectedPath 选中的路径
 * @param separator 分隔符
 * @returns 显示文本
 */
export const generateDisplayText = (selectedPath: CascaderOption[], separator: string = ' / '): string => {
  const labels = getLabelsFromPath(selectedPath);
  return labels.join(separator);
};
