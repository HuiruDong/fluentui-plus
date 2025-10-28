import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../Pagination';

// Mock child components
jest.mock('../PaginationList', () => {
  const MockPaginationList = ({
    current,
    totalPages,
    disabled,
    prefixCls,
  }: {
    current: number;
    totalPages: number;
    disabled: boolean;
    prefixCls: string;
  }) => (
    <div data-testid='pagination-list' className={prefixCls}>
      <span data-testid='current-page'>{current}</span>
      <span data-testid='total-pages'>{totalPages}</span>
      <span data-testid='disabled-state'>{disabled.toString()}</span>
    </div>
  );
  MockPaginationList.displayName = 'MockPaginationList';
  return MockPaginationList;
});

jest.mock('../SimplePagination', () => {
  const MockSimplePagination = ({
    current,
    totalPages,
    disabled,
    prefixCls,
  }: {
    current: number;
    totalPages: number;
    disabled: boolean;
    prefixCls: string;
  }) => (
    <div data-testid='simple-pagination' className={prefixCls}>
      <span data-testid='current-page'>{current}</span>
      <span data-testid='total-pages'>{totalPages}</span>
      <span data-testid='disabled-state'>{disabled.toString()}</span>
    </div>
  );
  MockSimplePagination.displayName = 'MockSimplePagination';
  return MockSimplePagination;
});

jest.mock('../QuickJumper', () => {
  const MockQuickJumper = ({ current, totalPages, disabled, prefixCls }: any) => (
    <div data-testid='quick-jumper' className={prefixCls}>
      <span data-testid='jumper-current'>{current}</span>
      <span data-testid='jumper-total'>{totalPages}</span>
      <span data-testid='jumper-disabled'>{disabled.toString()}</span>
    </div>
  );
  MockQuickJumper.displayName = 'MockQuickJumper';
  return MockQuickJumper;
});

jest.mock('../SizeChanger', () => {
  const MockSizeChanger = ({ pageSize, pageSizeOptions, disabled, prefixCls }: any) => (
    <div data-testid='size-changer' className={prefixCls}>
      <span data-testid='current-size'>{pageSize}</span>
      <span data-testid='size-options'>{pageSizeOptions.join(',')}</span>
      <span data-testid='size-disabled'>{disabled.toString()}</span>
    </div>
  );
  MockSizeChanger.displayName = 'MockSizeChanger';
  return MockSizeChanger;
});

jest.mock('../TotalInfo', () => {
  const MockTotalInfo = ({ showTotal, total, currentRange, prefixCls }: any) => {
    if (!showTotal) return null;
    const content = typeof showTotal === 'function' ? showTotal(total, currentRange) : `共 ${total} 条`;
    return (
      <div data-testid='total-info' className={prefixCls}>
        {content}
      </div>
    );
  };
  MockTotalInfo.displayName = 'MockTotalInfo';
  return MockTotalInfo;
});

// Mock hooks
jest.mock('../hooks', () => ({
  usePaginationState: jest.fn(),
  usePaginationCalculations: jest.fn(),
  usePaginationHandlers: jest.fn(),
}));

describe('Pagination', () => {
  let mockUsePaginationState: jest.Mock;
  let mockUsePaginationCalculations: jest.Mock;
  let mockUsePaginationHandlers: jest.Mock;

  beforeEach(() => {
    const hooksModule = jest.requireMock('../hooks');
    mockUsePaginationState = hooksModule.usePaginationState;
    mockUsePaginationCalculations = hooksModule.usePaginationCalculations;
    mockUsePaginationHandlers = hooksModule.usePaginationHandlers;

    // Default mock implementations
    mockUsePaginationState.mockReturnValue({
      current: 1,
      setCurrentPage: jest.fn(),
    });

    mockUsePaginationCalculations.mockReturnValue({
      totalPages: 10,
      shouldHide: false,
      paginationItems: [],
      currentRange: [1, 10],
    });

    mockUsePaginationHandlers.mockReturnValue({
      handlePageItemClick: jest.fn(),
      handlePrevClick: jest.fn(),
      handleNextClick: jest.fn(),
      handlePageSizeChange: jest.fn(),
    });

    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Pagination total={100} />);

      expect(screen.getByTestId('pagination-list')).toBeInTheDocument();
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('10');
    });

    it('should apply custom className', () => {
      const { container } = render(<Pagination total={100} className='custom-pagination' />);

      const pagination = container.querySelector('.fluentui-plus-pagination');
      expect(pagination).toHaveClass('custom-pagination');
    });

    it('should apply disabled className when disabled', () => {
      const { container } = render(<Pagination total={100} disabled={true} />);

      const pagination = container.querySelector('.fluentui-plus-pagination--disabled');
      expect(pagination).toBeInTheDocument();
    });

    it('should not render when hideOnSinglePage is true and only one page', () => {
      mockUsePaginationCalculations.mockReturnValue({
        totalPages: 1,
        shouldHide: true,
        paginationItems: [],
        currentRange: [1, 10],
      });

      const { container } = render(<Pagination total={5} pageSize={10} hideOnSinglePage={true} />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when hideOnSinglePage is true but multiple pages', () => {
      mockUsePaginationCalculations.mockReturnValue({
        totalPages: 5,
        shouldHide: false,
        paginationItems: [],
        currentRange: [1, 10],
      });

      render(<Pagination total={50} pageSize={10} hideOnSinglePage={true} />);

      expect(screen.getByTestId('pagination-list')).toBeInTheDocument();
    });
  });

  describe('简单模式', () => {
    it('should render SimplePagination when simple is true', () => {
      render(<Pagination total={100} simple={true} />);

      expect(screen.getByTestId('simple-pagination')).toBeInTheDocument();
      expect(screen.queryByTestId('pagination-list')).not.toBeInTheDocument();
    });

    it('should render PaginationList when simple is false', () => {
      render(<Pagination total={100} simple={false} />);

      expect(screen.getByTestId('pagination-list')).toBeInTheDocument();
      expect(screen.queryByTestId('simple-pagination')).not.toBeInTheDocument();
    });
  });

  describe('显示总数', () => {
    it('should render TotalInfo when showTotal is true', () => {
      render(<Pagination total={100} showTotal={true} />);

      expect(screen.getByTestId('total-info')).toBeInTheDocument();
      expect(screen.getByTestId('total-info')).toHaveTextContent('共 100 条');
    });

    it('should render custom TotalInfo with function', () => {
      const customShowTotal = (total: number, range: [number, number]) =>
        `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`;

      render(<Pagination total={100} showTotal={customShowTotal} />);

      expect(screen.getByTestId('total-info')).toBeInTheDocument();
      expect(screen.getByTestId('total-info')).toHaveTextContent('显示 1-10 条，共 100 条');
    });

    it('should not render TotalInfo when showTotal is false', () => {
      render(<Pagination total={100} showTotal={false} />);

      expect(screen.queryByTestId('total-info')).not.toBeInTheDocument();
    });
  });

  describe('快速跳转', () => {
    it('should render QuickJumper when showQuickJumper is true', () => {
      render(<Pagination total={100} showQuickJumper={true} />);

      expect(screen.getByTestId('quick-jumper')).toBeInTheDocument();
      expect(screen.getByTestId('jumper-current')).toHaveTextContent('1');
      expect(screen.getByTestId('jumper-total')).toHaveTextContent('10');
    });

    it('should not render QuickJumper when showQuickJumper is false', () => {
      render(<Pagination total={100} showQuickJumper={false} />);

      expect(screen.queryByTestId('quick-jumper')).not.toBeInTheDocument();
    });

    it('should pass disabled state to QuickJumper', () => {
      render(<Pagination total={100} showQuickJumper={true} disabled={true} />);

      expect(screen.getByTestId('jumper-disabled')).toHaveTextContent('true');
    });
  });

  describe('页码大小切换', () => {
    it('should render SizeChanger when showSizeChanger is true', () => {
      render(<Pagination total={100} showSizeChanger={true} />);

      expect(screen.getByTestId('size-changer')).toBeInTheDocument();
      expect(screen.getByTestId('current-size')).toHaveTextContent('10');
    });

    it('should not render SizeChanger when showSizeChanger is false', () => {
      render(<Pagination total={100} showSizeChanger={false} />);

      expect(screen.queryByTestId('size-changer')).not.toBeInTheDocument();
    });

    it('should pass custom pageSizeOptions to SizeChanger', () => {
      render(<Pagination total={100} showSizeChanger={true} pageSizeOptions={[5, 15, 25]} />);

      expect(screen.getByTestId('size-options')).toHaveTextContent('5,15,25');
    });

    it('should use default pageSizeOptions if not provided', () => {
      render(<Pagination total={100} showSizeChanger={true} />);

      expect(screen.getByTestId('size-options')).toHaveTextContent('10,20,50,100');
    });

    it('should pass disabled state to SizeChanger', () => {
      render(<Pagination total={100} showSizeChanger={true} disabled={true} />);

      expect(screen.getByTestId('size-disabled')).toHaveTextContent('true');
    });
  });

  describe('受控模式', () => {
    it('should initialize with controlled current', () => {
      mockUsePaginationState.mockReturnValue({
        current: 5,
        setCurrentPage: jest.fn(),
      });

      render(<Pagination total={100} current={5} />);

      expect(screen.getByTestId('current-page')).toHaveTextContent('5');
    });

    it('should call onChange when page changes', () => {
      const onChange = jest.fn();
      const setCurrentPage = jest.fn();

      mockUsePaginationState.mockReturnValue({
        current: 1,
        setCurrentPage,
      });

      render(<Pagination total={100} onChange={onChange} />);

      expect(mockUsePaginationState).toHaveBeenCalledWith(undefined, 1, onChange);
    });

    it('should pass current prop to usePaginationState', () => {
      const onChange = jest.fn();

      render(<Pagination total={100} current={3} onChange={onChange} />);

      expect(mockUsePaginationState).toHaveBeenCalledWith(3, 1, onChange);
    });
  });

  describe('非受控模式', () => {
    it('should use defaultCurrent as initial page', () => {
      render(<Pagination total={100} defaultCurrent={3} />);

      expect(mockUsePaginationState).toHaveBeenCalledWith(undefined, 3, undefined);
    });

    it('should use 1 as default initial page', () => {
      render(<Pagination total={100} />);

      expect(mockUsePaginationState).toHaveBeenCalledWith(undefined, 1, undefined);
    });
  });

  describe('属性传递', () => {
    it('should pass correct props to hooks', () => {
      const setCurrentPage = jest.fn();

      mockUsePaginationState.mockReturnValue({
        current: 2,
        setCurrentPage,
      });

      render(<Pagination total={100} pageSize={20} current={2} />);

      expect(mockUsePaginationState).toHaveBeenCalled();
      expect(mockUsePaginationCalculations).toHaveBeenCalledWith(2, 100, 20, false);
      expect(mockUsePaginationHandlers).toHaveBeenCalledWith(2, 10, 20, 100, false, setCurrentPage);
    });

    it('should use default pageSize of 10', () => {
      const setCurrentPage = jest.fn();

      mockUsePaginationState.mockReturnValue({
        current: 1,
        setCurrentPage,
      });

      render(<Pagination total={100} />);

      expect(mockUsePaginationCalculations).toHaveBeenCalledWith(1, 100, 10, false);
    });

    it('should use default total of 0', () => {
      const setCurrentPage = jest.fn();

      mockUsePaginationState.mockReturnValue({
        current: 1,
        setCurrentPage,
      });

      render(<Pagination />);

      expect(mockUsePaginationCalculations).toHaveBeenCalledWith(1, 0, 10, false);
    });
  });

  describe('组合功能', () => {
    it('should render all components when all features are enabled', () => {
      render(<Pagination total={100} showTotal={true} showQuickJumper={true} showSizeChanger={true} simple={false} />);

      expect(screen.getByTestId('total-info')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-list')).toBeInTheDocument();
      expect(screen.getByTestId('quick-jumper')).toBeInTheDocument();
      expect(screen.getByTestId('size-changer')).toBeInTheDocument();
    });

    it('should render simple mode with total and quick jumper', () => {
      render(<Pagination total={100} simple={true} showTotal={true} showQuickJumper={true} />);

      expect(screen.getByTestId('total-info')).toBeInTheDocument();
      expect(screen.getByTestId('simple-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('quick-jumper')).toBeInTheDocument();
      expect(screen.queryByTestId('pagination-list')).not.toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle zero total', () => {
      render(<Pagination total={0} />);

      expect(mockUsePaginationCalculations).toHaveBeenCalledWith(1, 0, 10, false);
    });

    it('should handle very large total', () => {
      const setCurrentPage = jest.fn();

      mockUsePaginationState.mockReturnValue({
        current: 1,
        setCurrentPage,
      });

      mockUsePaginationCalculations.mockReturnValue({
        totalPages: 10000,
        shouldHide: false,
        paginationItems: [],
        currentRange: [1, 10],
      });

      render(<Pagination total={100000} />);

      expect(screen.getByTestId('total-pages')).toHaveTextContent('10000');
    });

    it('should handle pageSize larger than total', () => {
      mockUsePaginationCalculations.mockReturnValue({
        totalPages: 1,
        shouldHide: false,
        paginationItems: [],
        currentRange: [1, 5],
      });

      render(<Pagination total={5} pageSize={10} />);

      expect(screen.getByTestId('total-pages')).toHaveTextContent('1');
    });

    it('should handle undefined optional props', () => {
      expect(() => {
        render(<Pagination total={100} />);
      }).not.toThrow();
    });
  });

  describe('prefixCls 传递', () => {
    it('should pass correct prefixCls to all child components', () => {
      render(<Pagination total={100} showTotal={true} showQuickJumper={true} showSizeChanger={true} simple={false} />);

      // Check that all components receive the correct prefix class
      expect(screen.getByTestId('pagination-list')).toHaveClass('fluentui-plus-pagination');
      expect(screen.getByTestId('total-info')).toHaveClass('fluentui-plus-pagination');
      expect(screen.getByTestId('quick-jumper')).toHaveClass('fluentui-plus-pagination');
      expect(screen.getByTestId('size-changer')).toHaveClass('fluentui-plus-pagination');
    });
  });
});
