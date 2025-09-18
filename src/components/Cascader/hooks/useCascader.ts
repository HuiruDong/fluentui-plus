import type { CascaderValue, CascaderOption, CascaderMultipleValue, UseCascaderProps } from '../types';
import { useCascaderState } from './useCascaderState';
import { useCascaderSelection } from './useCascaderSelection';
import { useCascaderMultiple } from './useCascaderMultiple';
import { useCascaderSearch } from './useCascaderSearch';
import { useCascaderNavigation } from './useCascaderNavigation';

/**
 * Cascader 核心状态管理 Hook
 * 职责：组合各个子Hook，管理选择路径、值变更、搜索等核心逻辑，支持单选和多选模式
 */
export const useCascader = ({
  value,
  defaultValue,
  multiple = false,
  showSearch = false,
  options = [],
  expandTrigger = 'click',
  changeOnSelect = false,
  onChange,
  onSearch,
}: UseCascaderProps) => {
  // 基础状态管理
  const stateHook = useCascaderState({
    value,
    defaultValue,
    multiple,
    showSearch,
    options,
  });

  // 单选逻辑
  const selectionHook = useCascaderSelection({
    selectedPath: stateHook.selectedPath,
    setSelectedPath: stateHook.setSelectedPath,
    activePath: stateHook.activePath,
    setActivePath: stateHook.setActivePath,
    searchValue: stateHook.searchValue,
    setSearchValue: stateHook.setSearchValue,
    currentValue: stateHook.currentValue as CascaderValue | undefined,
    multiple,
    changeOnSelect,
    showSearch,
    options,
    onChange: onChange as
      | ((value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void)
      | undefined,
  });

  // 多选逻辑
  const multipleHook = useCascaderMultiple({
    checkedKeys: stateHook.checkedKeys,
    setCheckedKeys: stateHook.setCheckedKeys,
    halfCheckedKeys: stateHook.halfCheckedKeys,
    setHalfCheckedKeys: stateHook.setHalfCheckedKeys,
    searchValue: stateHook.searchValue,
    setSearchValue: stateHook.setSearchValue,
    multiple,
    showSearch,
    options,
    onChange: onChange as
      | ((value: CascaderMultipleValue | undefined, selectedOptions: CascaderOption[][] | null) => void)
      | undefined,
  });

  // 搜索逻辑
  const searchHook = useCascaderSearch({
    searchValue: stateHook.searchValue,
    setSearchValue: stateHook.setSearchValue,
    selectedPath: stateHook.selectedPath,
    setSelectedPath: stateHook.setSelectedPath,
    activePath: stateHook.activePath,
    setActivePath: stateHook.setActivePath,
    checkedKeys: stateHook.checkedKeys,
    multiple,
    showSearch,
    changeOnSelect,
    options,
    onSearch,
    onChange: onChange as
      | ((value: CascaderValue | undefined, selectedOptions: CascaderOption[] | null) => void)
      | undefined,
    handleMultipleSelect: multipleHook.handleMultipleSelect,
  });

  // 导航逻辑
  const navigationHook = useCascaderNavigation({
    activePath: stateHook.activePath,
    checkedKeys: stateHook.checkedKeys,
    halfCheckedKeys: stateHook.halfCheckedKeys,
    searchValue: stateHook.searchValue,
    setSearchValue: stateHook.setSearchValue,
    setSelectedPath: stateHook.setSelectedPath,
    setActivePath: stateHook.setActivePath,
    setCheckedKeys: stateHook.setCheckedKeys,
    setHalfCheckedKeys: stateHook.setHalfCheckedKeys,
    multiple,
    options,
    onChange,
  });

  // 根据模式选择合适的返回值
  const selectedPath = multiple ? multipleHook.currentSelectedPath : selectionHook.currentSelectedPath;
  const currentValue = multiple ? multipleHook.currentValue : stateHook.currentValue;
  const displayText = multiple ? multipleHook.displayText : selectionHook.displayText;

  return {
    // 状态
    selectedPath,
    activePath: stateHook.activePath,
    searchValue: stateHook.searchValue,
    isSearching: stateHook.isSearching,
    currentValue,
    displayText,
    searchResults: searchHook.searchResults,

    // 多选状态
    checkedKeys: stateHook.checkedKeys,
    halfCheckedKeys: stateHook.halfCheckedKeys,

    // 派生状态
    getCurrentLevelOptions: navigationHook.getCurrentLevelOptions,
    getMaxLevel: navigationHook.getMaxLevel,
    isValueSelected: selectionHook.isValueSelected,
    isPathSelected: selectionHook.isPathSelected,
    isPathActive: selectionHook.isPathActive,
    getOptionCheckedStatus: multipleHook.getOptionCheckedStatus,

    // 事件处理
    handlePathChange: selectionHook.handlePathChange,
    handleFinalSelect: selectionHook.handleFinalSelect,
    handleMultipleSelect: multipleHook.handleMultipleSelect,
    handleSearchSelect: searchHook.handleSearchSelect,
    handleSearchChange: searchHook.handleSearchChange,
    handleClear: navigationHook.handleClear,

    // 其他配置
    expandTrigger,
    changeOnSelect,
    multiple,
  };
};
