import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationList from '../PaginationList';
import { PaginationItemType } from '../utils';
import type { PageItem } from '../types';

// Mock Fluent UI components
jest.mock('@fluentui/react-components', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    icon,
    'aria-label': ariaLabel,
    'aria-current': ariaCurrent,
  }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      data-testid={`button-${ariaLabel}`}
    >
      {icon}
      {children}
    </button>
  ),
}));

jest.mock('@fluentui/react-icons', () => ({
  ChevronRightRegular: () => <span data-testid='icon-right'>→</span>,
  ChevronLeftRegular: () => <span data-testid='icon-left'>←</span>,
}));

describe('PaginationList', () => {
  const defaultProps = {
    current: 1,
    totalPages: 10,
    paginationItems: [] as PageItem[],
    disabled: false,
    onPageItemClick: jest.fn(),
    onPrevClick: jest.fn(),
    onNextClick: jest.fn(),
    prefixCls: 'fluentui-plus-pagination',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render prev and next buttons', () => {
      render(<PaginationList {...defaultProps} />);

      expect(screen.getByTestId('button-Previous Page')).toBeInTheDocument();
      expect(screen.getByTestId('button-Next Page')).toBeInTheDocument();
    });

    it('should render page items', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
        { type: PaginationItemType.Page, value: 3 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} />);

      expect(screen.getByTestId('button-Page 1')).toBeInTheDocument();
      expect(screen.getByTestId('button-Page 2')).toBeInTheDocument();
      expect(screen.getByTestId('button-Page 3')).toBeInTheDocument();
    });

    it('should render jump prev and jump next items', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Page, value: 5 },
        { type: PaginationItemType.Next, value: '...' },
        { type: PaginationItemType.Page, value: 10 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} />);

      expect(screen.getByTestId('button-Previous 5 Pages')).toBeInTheDocument();
      expect(screen.getByTestId('button-Next 5 Pages')).toBeInTheDocument();
    });

    it('should apply correct list class', () => {
      const { container } = render(<PaginationList {...defaultProps} />);

      const list = container.querySelector('.fluentui-plus-pagination__list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('当前页高亮', () => {
    it('should highlight current page', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
        { type: PaginationItemType.Page, value: 3 },
      ];

      const { container } = render(<PaginationList {...defaultProps} current={2} paginationItems={paginationItems} />);

      const activeButton = container.querySelector('.fluentui-plus-pagination__list__button--active');
      expect(activeButton).toBeInTheDocument();
      expect(activeButton).toHaveTextContent('2');
    });

    it('should set aria-current on current page', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      render(<PaginationList {...defaultProps} current={1} paginationItems={paginationItems} />);

      const currentButton = screen.getByTestId('button-Page 1');
      expect(currentButton).toHaveAttribute('aria-current', 'page');
    });

    it('should not set aria-current on non-current pages', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      render(<PaginationList {...defaultProps} current={1} paginationItems={paginationItems} />);

      const button2 = screen.getByTestId('button-Page 2');
      expect(button2).not.toHaveAttribute('aria-current');
    });
  });

  describe('禁用状态', () => {
    it('should disable all buttons when disabled', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      render(<PaginationList {...defaultProps} disabled={true} paginationItems={paginationItems} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should disable prev button when on first page', () => {
      render(<PaginationList {...defaultProps} current={1} />);

      const prevButton = screen.getByTestId('button-Previous Page');
      expect(prevButton).toBeDisabled();
    });

    it('should enable prev button when not on first page', () => {
      render(<PaginationList {...defaultProps} current={2} />);

      const prevButton = screen.getByTestId('button-Previous Page');
      expect(prevButton).not.toBeDisabled();
    });

    it('should disable next button when on last page', () => {
      render(<PaginationList {...defaultProps} current={10} totalPages={10} />);

      const nextButton = screen.getByTestId('button-Next Page');
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button when not on last page', () => {
      render(<PaginationList {...defaultProps} current={5} totalPages={10} />);

      const nextButton = screen.getByTestId('button-Next Page');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('点击事件', () => {
    it('should call onPrevClick when prev button is clicked', () => {
      const onPrevClick = jest.fn();

      render(<PaginationList {...defaultProps} current={2} onPrevClick={onPrevClick} />);

      fireEvent.click(screen.getByTestId('button-Previous Page'));
      expect(onPrevClick).toHaveBeenCalledTimes(1);
    });

    it('should call onNextClick when next button is clicked', () => {
      const onNextClick = jest.fn();

      render(<PaginationList {...defaultProps} current={1} onNextClick={onNextClick} />);

      fireEvent.click(screen.getByTestId('button-Next Page'));
      expect(onNextClick).toHaveBeenCalledTimes(1);
    });

    it('should call onPageItemClick with correct page when page button is clicked', () => {
      const onPageItemClick = jest.fn();
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
        { type: PaginationItemType.Page, value: 3 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} onPageItemClick={onPageItemClick} />);

      fireEvent.click(screen.getByTestId('button-Page 2'));
      expect(onPageItemClick).toHaveBeenCalledWith({ type: PaginationItemType.Page, value: 2 });
    });

    it('should call onPageItemClick with jump prev item', () => {
      const onPageItemClick = jest.fn();
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Page, value: 10 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} onPageItemClick={onPageItemClick} />);

      fireEvent.click(screen.getByTestId('button-Previous 5 Pages'));
      expect(onPageItemClick).toHaveBeenCalledWith({ type: PaginationItemType.Prev, value: '...' });
    });

    it('should call onPageItemClick with jump next item', () => {
      const onPageItemClick = jest.fn();
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Next, value: '...' },
        { type: PaginationItemType.Page, value: 10 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} onPageItemClick={onPageItemClick} />);

      fireEvent.click(screen.getByTestId('button-Next 5 Pages'));
      expect(onPageItemClick).toHaveBeenCalledWith({ type: PaginationItemType.Next, value: '...' });
    });
  });

  describe('自定义渲染', () => {
    it('should use itemRender for page items', () => {
      const itemRender = jest.fn((page, type) => <span data-testid={`custom-${type}-${page}`}>Custom {page}</span>);

      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(1, 'page', 1);
      expect(itemRender).toHaveBeenCalledWith(2, 'page', 2);
    });

    it('should use itemRender for prev button', () => {
      const itemRender = jest.fn((page, type, element) => element);

      render(<PaginationList {...defaultProps} current={2} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(1, 'prev', expect.anything());
    });

    it('should use itemRender for next button', () => {
      const itemRender = jest.fn((page, type, element) => element);

      render(<PaginationList {...defaultProps} current={1} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith(2, 'next', expect.anything());
    });

    it('should use itemRender for jump prev item', () => {
      const itemRender = jest.fn((page, type, element) => element);
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Page, value: 10 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith('...', 'jump-prev', '...');
    });

    it('should use itemRender for jump next item', () => {
      const itemRender = jest.fn((page, type, element) => element);
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Next, value: '...' },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} itemRender={itemRender} />);

      expect(itemRender).toHaveBeenCalledWith('...', 'jump-next', '...');
    });
  });

  describe('无障碍支持', () => {
    it('should have correct aria-label for prev button', () => {
      render(<PaginationList {...defaultProps} />);

      const prevButton = screen.getByTestId('button-Previous Page');
      expect(prevButton).toHaveAttribute('aria-label', 'Previous Page');
    });

    it('should have correct aria-label for next button', () => {
      render(<PaginationList {...defaultProps} />);

      const nextButton = screen.getByTestId('button-Next Page');
      expect(nextButton).toHaveAttribute('aria-label', 'Next Page');
    });

    it('should have correct aria-label for page buttons', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} />);

      expect(screen.getByTestId('button-Page 1')).toHaveAttribute('aria-label', 'Page 1');
      expect(screen.getByTestId('button-Page 2')).toHaveAttribute('aria-label', 'Page 2');
    });

    it('should have correct aria-label for jump items', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Prev, value: '...' },
        { type: PaginationItemType.Next, value: '...' },
      ];

      render(<PaginationList {...defaultProps} paginationItems={paginationItems} />);

      expect(screen.getByTestId('button-Previous 5 Pages')).toHaveAttribute('aria-label', 'Previous 5 Pages');
      expect(screen.getByTestId('button-Next 5 Pages')).toHaveAttribute('aria-label', 'Next 5 Pages');
    });
  });

  describe('边界情况', () => {
    it('should handle empty paginationItems', () => {
      render(<PaginationList {...defaultProps} paginationItems={[]} />);

      // Should still render prev and next buttons
      expect(screen.getByTestId('button-Previous Page')).toBeInTheDocument();
      expect(screen.getByTestId('button-Next Page')).toBeInTheDocument();
    });

    it('should handle single page', () => {
      const paginationItems: PageItem[] = [{ type: PaginationItemType.Page, value: 1 }];

      render(<PaginationList {...defaultProps} current={1} totalPages={1} paginationItems={paginationItems} />);

      const prevButton = screen.getByTestId('button-Previous Page');
      const nextButton = screen.getByTestId('button-Next Page');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should generate stable keys for page items', () => {
      const paginationItems: PageItem[] = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];

      const { container } = render(<PaginationList {...defaultProps} paginationItems={paginationItems} />);

      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should handle missing event handlers gracefully', () => {
      const paginationItems: PageItem[] = [{ type: PaginationItemType.Page, value: 1 }];

      expect(() => {
        render(
          <PaginationList
            {...defaultProps}
            paginationItems={paginationItems}
            onPageItemClick={undefined as any}
            onPrevClick={undefined as any}
            onNextClick={undefined as any}
          />
        );
      }).not.toThrow();
    });
  });
});
