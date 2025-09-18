import type { CascaderOption, CheckedStatus } from '../types';

/**
 * 获取所有叶子节点的keys
 * @param options 选项数组
 * @returns 叶子节点keys的Set
 */
export const getAllLeafKeys = (options: CascaderOption[]): Set<string | number> => {
  const leafKeys = new Set<string | number>();

  const traverse = (nodes: CascaderOption[]) => {
    nodes.forEach(node => {
      if (node.value !== undefined) {
        if (!node.children || node.children.length === 0) {
          // 叶子节点
          leafKeys.add(node.value);
        } else {
          // 非叶子节点，递归遍历子节点
          traverse(node.children);
        }
      }
    });
  };

  traverse(options);
  return leafKeys;
};

/**
 * 获取节点的所有子孙叶子节点keys
 * @param option 节点选项
 * @returns 子孙叶子节点keys的Set
 */
export const getDescendantLeafKeys = (option: CascaderOption): Set<string | number> => {
  const leafKeys = new Set<string | number>();

  if (!option.children || option.children.length === 0) {
    // 如果是叶子节点，返回自己的key
    if (option.value !== undefined) {
      leafKeys.add(option.value);
    }
    return leafKeys;
  }

  const traverse = (nodes: CascaderOption[]) => {
    nodes.forEach(node => {
      if (node.value !== undefined) {
        if (!node.children || node.children.length === 0) {
          // 叶子节点
          leafKeys.add(node.value);
        } else {
          // 非叶子节点，递归遍历子节点
          traverse(node.children);
        }
      }
    });
  };

  traverse(option.children);
  return leafKeys;
};

/**
 * 获取节点的所有祖先节点keys
 * @param options 选项树
 * @param targetKey 目标节点key
 * @returns 祖先节点keys的数组（从根到直接父级）
 */
export const getAncestorKeys = (options: CascaderOption[], targetKey: string | number): (string | number)[] => {
  const ancestorKeys: (string | number)[] = [];

  const findAncestors = (nodes: CascaderOption[], currentPath: (string | number)[]): boolean => {
    for (const node of nodes) {
      if (node.value === undefined) continue;

      const newPath = [...currentPath, node.value];

      if (node.value === targetKey) {
        // 找到目标节点，但不包含自己
        ancestorKeys.push(...currentPath);
        return true;
      }

      if (node.children && node.children.length > 0) {
        if (findAncestors(node.children, newPath)) {
          return true;
        }
      }
    }

    return false;
  };

  findAncestors(options, []);
  return ancestorKeys;
};

/**
 * 计算节点的选中状态
 * @param option 节点选项
 * @param checkedKeys 已选中的keys
 * @returns 节点的选中状态
 */
export const getNodeCheckedStatus = (option: CascaderOption, checkedKeys: Set<string | number>): CheckedStatus => {
  if (option.value === undefined) {
    return 'unchecked';
  }

  // 如果是叶子节点
  if (!option.children || option.children.length === 0) {
    return checkedKeys.has(option.value) ? 'checked' : 'unchecked';
  }

  // 如果是非叶子节点，检查子节点状态
  const descendantLeafKeys = getDescendantLeafKeys(option);
  const checkedCount = Array.from(descendantLeafKeys).filter(key => checkedKeys.has(key)).length;

  if (checkedCount === 0) {
    return 'unchecked';
  } else if (checkedCount === descendantLeafKeys.size) {
    return 'checked';
  } else {
    return 'indeterminate';
  }
};

/**
 * 更新选中状态：选中节点时同时选中所有子孙叶子节点
 * @param option 被选中的节点
 * @param checked 是否选中
 * @param currentCheckedKeys 当前选中的keys
 * @returns 更新后的选中keys
 */
export const updateCheckedKeys = (
  option: CascaderOption,
  checked: boolean,
  currentCheckedKeys: Set<string | number>
): Set<string | number> => {
  const newCheckedKeys = new Set(currentCheckedKeys);

  if (option.value === undefined) {
    return newCheckedKeys;
  }

  // 获取该节点的所有子孙叶子节点
  const descendantLeafKeys = getDescendantLeafKeys(option);

  if (checked) {
    // 选中：添加所有子孙叶子节点
    descendantLeafKeys.forEach(key => newCheckedKeys.add(key));
  } else {
    // 取消选中：移除所有子孙叶子节点
    descendantLeafKeys.forEach(key => newCheckedKeys.delete(key));
  }

  return newCheckedKeys;
};

/**
 * 计算半选状态的keys
 * @param options 选项树
 * @param checkedKeys 已选中的keys
 * @returns 半选状态的keys Set
 */
export const getHalfCheckedKeys = (
  options: CascaderOption[],
  checkedKeys: Set<string | number>
): Set<string | number> => {
  const halfCheckedKeys = new Set<string | number>();

  const traverse = (nodes: CascaderOption[]) => {
    nodes.forEach(node => {
      if (node.value !== undefined && node.children && node.children.length > 0) {
        const status = getNodeCheckedStatus(node, checkedKeys);
        if (status === 'indeterminate') {
          halfCheckedKeys.add(node.value);
        }
        // 递归处理子节点
        traverse(node.children);
      }
    });
  };

  traverse(options);
  return halfCheckedKeys;
};

/**
 * 根据选中的keys获取对应的选项对象
 * @param options 选项树
 * @param checkedKeys 选中的keys
 * @returns 选中的选项对象数组（仅返回叶子节点）
 */
export const getCheckedOptions = (options: CascaderOption[], checkedKeys: Set<string | number>): CascaderOption[] => {
  const checkedOptions: CascaderOption[] = [];

  const traverse = (nodes: CascaderOption[]) => {
    nodes.forEach(node => {
      if (node.value !== undefined) {
        // 只收集叶子节点
        if ((!node.children || node.children.length === 0) && checkedKeys.has(node.value)) {
          checkedOptions.push(node);
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      }
    });
  };

  traverse(options);
  return checkedOptions;
};

/**
 * 根据选中的keys获取完整的路径信息
 * @param options 选项树
 * @param checkedKeys 选中的keys
 * @returns 选中的选项路径数组
 */
export const getCheckedPaths = (options: CascaderOption[], checkedKeys: Set<string | number>): CascaderOption[][] => {
  const checkedPaths: CascaderOption[][] = [];

  const traverse = (nodes: CascaderOption[], currentPath: CascaderOption[]) => {
    nodes.forEach(node => {
      const fullPath = [...currentPath, node];

      if (node.value !== undefined) {
        // 只收集选中的叶子节点的路径
        if ((!node.children || node.children.length === 0) && checkedKeys.has(node.value)) {
          checkedPaths.push(fullPath);
        }

        if (node.children && node.children.length > 0) {
          traverse(node.children, fullPath);
        }
      }
    });
  };

  traverse(options, []);
  return checkedPaths;
};

/**
 * 从多个路径中获取显示用的路径（去重相同的叶子节点）
 * @param paths 路径数组
 * @returns 显示用的路径数组
 */
export const getDisplayPaths = (paths: CascaderOption[][]): CascaderOption[][] => {
  // 在多选模式下，只显示选中的叶子节点路径
  return paths;
};
