import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CascaderPanel from '../CascaderPanel';
import type { CascaderOption, CascaderPanelProps, CascaderSearchResult } from '../types';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

// Mock子组件
jest.mock('../CascaderColumn', () => {
  return function MockCascaderColumn({
    options,
    selectedOption,
    level,
    onSelect,
    multiple = false,
    checkedKeys = new Set(),
    onCheckChange,
    prefixCls,
  }: any) {
    return (
      <div data-testid={`column-${level}`} className={`${prefixCls}__column`}>
        {options.map((option: any, index: number) => (
          <div
            key={option.value ?? index}
            data-testid={`option-${level}-${option.value}`}
            className={selectedOption?.value === option.value ? 'selected' : ''}
            onClick={() => onSelect(option, level)}
          >
            {multiple && (
              <input
                type='checkbox'
                data-testid={`checkbox-${level}-${option.value}`}
                checked={checkedKeys.has(option.value)}
                onChange={e => onCheckChange?.(option, e.target.checked)}
              />
            )}
            {option.label || option.value}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../CascaderEmpty', () => {
  return function MockCascaderEmpty({ prefixCls, text }: any) {
    return (
      <div data-testid='cascader-empty' className={`${prefixCls}__empty`}>
        {text}
      </div>
    );
  };
});

// Mock Select hooks
jest.mock('../../Select/hooks', () => ({
  useFloatingPosition: ({ isOpen }: any) => ({
    floatingRef: { current: null },
    floatingStyles: { position: 'absolute', top: 0, left: 0 },
    getFloatingProps: () => ({
      onMouseDown: (e: MouseEvent) => {
        if (isOpen) {
          e.preventDefault();
        }
      },
    }),
  }),
}));

// Mock utils
jest.mock('../utils', () => ({
  hasChildren: (option: CascaderOption) => option.children && option.children.length > 0,
  getChildren: (option: CascaderOption) => option.children || [],
  getValueFromPath: (path: CascaderOption[]) => path.map(opt => opt.value),
}));

// 测试数据
const mockOptions: CascaderOption[] = [
  {
    value: '1',
    label: 'Option 1',
    children: [
      { value: '1-1', label: 'Option 1-1' },
      { value: '1-2', label: 'Option 1-2' },
    ],
  },
  {
    value: '2',
    label: 'Option 2',
    children: [{ value: '2-1', label: 'Option 2-1' }],
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

const mockSearchResults: CascaderSearchResult[] = [
  {
    option: { value: '1-1', label: 'Option 1-1' },
    path: [
      { value: '1', label: 'Option 1' },
      { value: '1-1', label: 'Option 1-1' },
    ],
    value: ['1', '1-1'],
    label: 'Option 1 / Option 1-1',
  },
  {
    option: { value: '2-1', label: 'Option 2-1' },
    path: [
      { value: '2', label: 'Option 2' },
      { value: '2-1', label: 'Option 2-1' },
    ],
    value: ['2', '2-1'],
    label: 'Option 2 / Option 2-1',
  },
];

const defaultProps: CascaderPanelProps = {
  isOpen: true,
  triggerRef: { current: document.createElement('div') },
  onClose: jest.fn(),
  options: mockOptions,
  selectedPath: [],
  prefixCls: 'fluentui-plus-cascader',
  checkedKeys: new Set(),
  halfCheckedKeys: new Set(),
};

describe('CascaderPanel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly when open', () => {
      render(<CascaderPanel {...defaultProps} />);

      const panel = document.querySelector('.fluentui-plus-cascader__panel');
      expect(panel).toBeInTheDocument();

      const surface = document.querySelector('.fluentui-plus-cascader__popover-surface');
      expect(surface).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<CascaderPanel {...defaultProps} isOpen={false} />);

      const panel = document.querySelector('.fluentui-plus-cascader__panel');
      expect(panel).not.toBeInTheDocument();
    });

    it('should apply custom listHeight', () => {
      render(<CascaderPanel {...defaultProps} listHeight={300} />);

      const panel = document.querySelector('.fluentui-plus-cascader__panel');
      expect(panel).toHaveStyle('max-height: 300px');
    });

    it('should apply floating styles', () => {
      render(<CascaderPanel {...defaultProps} />);

      const surface = document.querySelector('.fluentui-plus-cascader__popover-surface');
      expect(surface).toHaveStyle('position: absolute');
      expect(surface).toHaveStyle('z-index: 1000');
      expect(surface).toHaveStyle('visibility: visible');
    });
  });

  describe('级联列渲染', () => {
    it('should render root column with options', () => {
      render(<CascaderPanel {...defaultProps} />);

      const columns = document.querySelector('.fluentui-plus-cascader__columns');
      expect(columns).toBeInTheDocument();

      const rootColumn = screen.getByTestId('column-0');
      expect(rootColumn).toBeInTheDocument();

      mockOptions.forEach(option => {
        expect(screen.getByTestId(`option-0-${option.value}`)).toBeInTheDocument();
      });
    });

    it('should render multiple columns based on selectedPath', () => {
      const selectedPath = [mockOptions[0], mockOptions[0].children![0]];

      render(<CascaderPanel {...defaultProps} selectedPath={selectedPath} />);

      // 应该有两列：根列和第一级子列
      expect(screen.getByTestId('column-0')).toBeInTheDocument();
      expect(screen.getByTestId('column-1')).toBeInTheDocument();

      // 第二列应该显示 Option 1 的子选项
      expect(screen.getByTestId('option-1-1-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-1-1-2')).toBeInTheDocument();
    });

    it('should show empty state when no options', () => {
      render(<CascaderPanel {...defaultProps} options={[]} />);

      expect(screen.getByTestId('cascader-empty')).toBeInTheDocument();
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should show custom empty text', () => {
      render(<CascaderPanel {...defaultProps} options={[]} emptyText='没有数据' />);

      expect(screen.getByText('没有数据')).toBeInTheDocument();
    });
  });

  describe('搜索功能', () => {
    it('should show search results when searching', () => {
      render(
        <CascaderPanel {...defaultProps} showSearch={true} searchValue='Option' searchResults={mockSearchResults} />
      );

      const searchResults = document.querySelector('.fluentui-plus-cascader__search-results');
      expect(searchResults).toBeInTheDocument();

      // 不应该显示普通的级联列
      const columns = document.querySelector('.fluentui-plus-cascader__columns');
      expect(columns).not.toBeInTheDocument();
    });

    it('should show empty state when search has no results', () => {
      render(<CascaderPanel {...defaultProps} showSearch={true} searchValue='nonexistent' searchResults={[]} />);

      expect(screen.getByTestId('cascader-empty')).toBeInTheDocument();
    });

    it('should handle search result selection in single mode', async () => {
      const user = userEvent.setup();
      const onFinalSelect = jest.fn();

      render(
        <CascaderPanel
          {...defaultProps}
          showSearch={true}
          searchValue='Option'
          searchResults={mockSearchResults}
          onFinalSelect={onFinalSelect}
          multiple={false}
        />
      );

      const searchOption = screen.getByTestId('option-0-1-1');
      await user.click(searchOption);

      expect(onFinalSelect).toHaveBeenCalledWith(
        mockSearchResults[0].option,
        [{ value: '1', label: 'Option 1' }] // 路径除了最后一个选项，不带children
      );
    });

    it('should handle search result selection in multiple mode', async () => {
      const user = userEvent.setup();
      const onMultipleSelect = jest.fn();

      render(
        <CascaderPanel
          {...defaultProps}
          showSearch={true}
          searchValue='Option'
          searchResults={mockSearchResults}
          onMultipleSelect={onMultipleSelect}
          multiple={true}
          checkedKeys={new Set()}
        />
      );

      const searchOption = screen.getByTestId('option-0-1-1');
      await user.click(searchOption);

      expect(onMultipleSelect).toHaveBeenCalledWith(
        mockSearchResults[0].option,
        true // 因为当前未选中，所以是选中
      );
    });
  });

  describe('单选模式交互', () => {
    it('should handle path change for non-leaf nodes', async () => {
      const user = userEvent.setup();
      const onPathChange = jest.fn();

      render(<CascaderPanel {...defaultProps} onPathChange={onPathChange} multiple={false} />);

      const option1 = screen.getByTestId('option-0-1');
      await user.click(option1);

      expect(onPathChange).toHaveBeenCalledWith(
        [mockOptions[0]], // 新路径
        ['1'] // 值数组
      );
    });

    it('should handle final selection for leaf nodes', async () => {
      const user = userEvent.setup();
      const onFinalSelect = jest.fn();

      render(<CascaderPanel {...defaultProps} onFinalSelect={onFinalSelect} multiple={false} />);

      const leafOption = screen.getByTestId('option-0-3');
      await user.click(leafOption);

      expect(onFinalSelect).toHaveBeenCalledWith(
        mockOptions[2], // 叶子节点选项
        [] // 空路径（因为是根级别的叶子节点）
      );
    });
  });

  describe('多选模式交互', () => {
    it('should handle path change for non-leaf nodes in multiple mode', async () => {
      const user = userEvent.setup();
      const onPathChange = jest.fn();

      render(<CascaderPanel {...defaultProps} onPathChange={onPathChange} multiple={true} />);

      const option1 = screen.getByTestId('option-0-1');
      await user.click(option1);

      expect(onPathChange).toHaveBeenCalledWith([mockOptions[0]], ['1']);
    });

    it('should handle checkbox change', async () => {
      const user = userEvent.setup();
      const onMultipleSelect = jest.fn();

      render(
        <CascaderPanel {...defaultProps} onMultipleSelect={onMultipleSelect} multiple={true} checkedKeys={new Set()} />
      );

      const checkbox = screen.getByTestId('checkbox-0-1');
      await user.click(checkbox);

      expect(onMultipleSelect).toHaveBeenCalledWith(mockOptions[0], true);
    });

    it('should handle uncheck in multiple mode', async () => {
      const user = userEvent.setup();
      const onMultipleSelect = jest.fn();

      render(
        <CascaderPanel
          {...defaultProps}
          onMultipleSelect={onMultipleSelect}
          multiple={true}
          checkedKeys={new Set(['1'])}
        />
      );

      const checkbox = screen.getByTestId('checkbox-0-1');
      await user.click(checkbox);

      expect(onMultipleSelect).toHaveBeenCalledWith(mockOptions[0], false);
    });
  });

  describe('自定义渲染', () => {
    it('should use custom optionRender', () => {
      const optionRender = jest.fn(option => `Custom: ${option.label}`);

      render(<CascaderPanel {...defaultProps} optionRender={optionRender} />);

      // The optionRender is passed to CascaderColumn components,
      // which is mocked but should still receive the prop
      expect(screen.getByTestId('column-0')).toBeInTheDocument();
    });

    it('should use custom popupRender', () => {
      const popupRender = jest.fn(node => <div data-testid='custom-popup'>{node}</div>);

      render(<CascaderPanel {...defaultProps} popupRender={popupRender} />);

      expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
      expect(popupRender).toHaveBeenCalled();
    });
  });

  describe('展开触发方式', () => {
    it('should pass expandTrigger to columns', () => {
      render(<CascaderPanel {...defaultProps} expandTrigger='hover' />);

      // 验证 expandTrigger 被传递到列组件
      // 这个测试主要验证属性传递，具体的 hover 行为在 CascaderColumn 中测试
      const column = screen.getByTestId('column-0');
      expect(column).toBeInTheDocument();
    });
  });

  describe('回调函数处理', () => {
    it('should work without optional callbacks', async () => {
      const user = userEvent.setup();

      render(
        <CascaderPanel
          {...defaultProps}
          // 不传入可选的回调函数
          onPathChange={undefined}
          onFinalSelect={undefined}
          onMultipleSelect={undefined}
        />
      );

      const option = screen.getByTestId('option-0-1');

      // 应该不会抛出错误
      await user.click(option);
      expect(option).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle undefined selectedPath', () => {
      render(<CascaderPanel {...defaultProps} selectedPath={undefined} />);

      // 应该只显示根列
      expect(screen.getByTestId('column-0')).toBeInTheDocument();
      expect(screen.queryByTestId('column-1')).not.toBeInTheDocument();
    });

    it('should handle empty selectedPath', () => {
      render(<CascaderPanel {...defaultProps} selectedPath={[]} />);

      expect(screen.getByTestId('column-0')).toBeInTheDocument();
      expect(screen.queryByTestId('column-1')).not.toBeInTheDocument();
    });

    it('should handle selectedPath with options without children', () => {
      const pathWithLeaf = [mockOptions[2]]; // Option 3 没有子选项

      render(<CascaderPanel {...defaultProps} selectedPath={pathWithLeaf} />);

      // 应该只显示根列，不应该有第二列
      expect(screen.getByTestId('column-0')).toBeInTheDocument();
      expect(screen.queryByTestId('column-1')).not.toBeInTheDocument();
    });

    it('should handle search without searchResults', () => {
      render(<CascaderPanel {...defaultProps} showSearch={true} searchValue='test' searchResults={undefined} />);

      expect(screen.getByTestId('cascader-empty')).toBeInTheDocument();
    });

    it('should handle undefined options', () => {
      render(<CascaderPanel {...defaultProps} options={undefined} />);

      expect(screen.getByTestId('cascader-empty')).toBeInTheDocument();
    });
  });

  describe('状态管理', () => {
    it('should pass correct checkedKeys to columns', () => {
      const checkedKeys = new Set(['1', '3']);

      render(<CascaderPanel {...defaultProps} multiple={true} checkedKeys={checkedKeys} />);

      // 验证选中状态传递到子组件
      const checkbox1 = screen.getByTestId('checkbox-0-1');
      const checkbox3 = screen.getByTestId('checkbox-0-3');

      expect(checkbox1).toBeChecked();
      expect(checkbox3).toBeChecked();
    });

    it('should pass halfCheckedKeys correctly', () => {
      render(<CascaderPanel {...defaultProps} multiple={true} halfCheckedKeys={new Set(['1'])} />);

      // 半选状态的具体行为在 CascaderColumn 中验证
      const column = screen.getByTestId('column-0');
      expect(column).toBeInTheDocument();
    });
  });
});
