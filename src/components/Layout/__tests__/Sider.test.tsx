import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Sider from '../Sider';

// Mock FluentUI icons
jest.mock('@fluentui/react-icons', () => ({
  ChevronRightFilled: () => <span data-testid='chevron-right-icon'>›</span>,
  ChevronLeftFilled: () => <span data-testid='chevron-left-icon'>‹</span>,
}));

describe('Sider Component', () => {
  beforeEach(() => {
    // Reset window size before each test
    global.innerWidth = 1024;
    global.dispatchEvent(new Event('resize'));
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Sider>Sider Content</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
      expect(aside).toHaveClass('fluentui-plus-layout-sider');
      expect(screen.getByText('Sider Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Sider>
          <div>Menu Item 1</div>
          <div>Menu Item 2</div>
        </Sider>
      );
      expect(screen.getByText('Menu Item 1')).toBeInTheDocument();
      expect(screen.getByText('Menu Item 2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Sider className='custom-sider'>Test Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('custom-sider');
      expect(aside).toHaveClass('fluentui-plus-layout-sider');
    });

    it('should have __LAYOUT_SIDER__ marker', () => {
      expect(Sider.__LAYOUT_SIDER__).toBe(true);
    });
  });

  describe('宽度配置', () => {
    it('should apply default width', () => {
      const { container } = render(<Sider>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('width: 200px');
      expect(aside).toHaveStyle('max-width: 200px');
      expect(aside).toHaveStyle('min-width: 200px');
    });

    it('should apply custom width as number', () => {
      const { container } = render(<Sider width={250}>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('width: 250px');
      expect(aside).toHaveStyle('max-width: 250px');
      expect(aside).toHaveStyle('min-width: 250px');
    });

    it('should apply custom width as string', () => {
      const { container } = render(<Sider width='20%'>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('width: 20%');
      expect(aside).toHaveStyle('max-width: 20%');
      expect(aside).toHaveStyle('min-width: 20%');
    });

    it('should apply custom collapsedWidth', () => {
      const { container } = render(
        <Sider collapsible collapsed collapsedWidth={60}>
          Sider
        </Sider>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('width: 60px');
    });
  });

  describe('收起功能', () => {
    it('should not show trigger when collapsible is false', () => {
      render(<Sider collapsible={false}>Sider</Sider>);
      expect(screen.queryByTestId('chevron-left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('chevron-right-icon')).not.toBeInTheDocument();
    });

    it('should show trigger when collapsible is true', () => {
      const { container } = render(<Sider collapsible>Sider</Sider>);
      const trigger = container.querySelector('.fluentui-plus-layout-sider-trigger');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();
    });

    it('should apply collapsed class when collapsed is true', () => {
      const { container } = render(<Sider collapsed>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('fluentui-plus-layout-sider-collapsed');
    });

    it('should toggle collapse state when trigger is clicked', async () => {
      const onCollapse = jest.fn();
      const { container } = render(
        <Sider collapsible onCollapse={onCollapse}>
          Sider
        </Sider>
      );

      const trigger = container.querySelector('.fluentui-plus-layout-sider-trigger');
      expect(trigger).toBeInTheDocument();

      // Initial state: not collapsed
      expect(screen.getByTestId('chevron-left-icon')).toBeInTheDocument();

      // Click to collapse
      fireEvent.click(trigger!);
      expect(onCollapse).toHaveBeenCalledWith(true);

      // After collapse, should show right chevron
      await waitFor(() => {
        expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
      });
    });

    it('should call onCollapse with correct value', async () => {
      const onCollapse = jest.fn();
      const { container } = render(
        <Sider collapsible onCollapse={onCollapse}>
          Sider
        </Sider>
      );

      const trigger = container.querySelector('.fluentui-plus-layout-sider-trigger');

      fireEvent.click(trigger!);
      expect(onCollapse).toHaveBeenCalledWith(true);

      fireEvent.click(trigger!);
      expect(onCollapse).toHaveBeenCalledWith(false);
    });

    it('should change width when collapsed', async () => {
      const { container, rerender } = render(
        <Sider collapsible width={200} collapsedWidth={80}>
          Sider
        </Sider>
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('width: 200px');

      rerender(
        <Sider collapsible collapsed width={200} collapsedWidth={80}>
          Sider
        </Sider>
      );

      expect(aside).toHaveStyle('width: 80px');
    });
  });

  describe('响应式断点', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should handle xs breakpoint', async () => {
      const onCollapse = jest.fn();

      act(() => {
        render(
          <Sider breakpoint='xs' collapsible onCollapse={onCollapse}>
            Sider
          </Sider>
        );
      });

      // Simulate window resize below xs breakpoint (480px)
      act(() => {
        global.innerWidth = 400;
        global.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(onCollapse).toHaveBeenCalledWith(true);
      });
    });

    it('should handle md breakpoint', async () => {
      const onCollapse = jest.fn();

      act(() => {
        render(
          <Sider breakpoint='md' collapsible onCollapse={onCollapse}>
            Sider
          </Sider>
        );
      });

      // Simulate window resize below md breakpoint (768px)
      act(() => {
        global.innerWidth = 700;
        global.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(onCollapse).toHaveBeenCalledWith(true);
      });
    });

    it('should handle lg breakpoint', async () => {
      const onCollapse = jest.fn();

      act(() => {
        render(
          <Sider breakpoint='lg' collapsible onCollapse={onCollapse}>
            Sider
          </Sider>
        );
      });

      // Simulate window resize below lg breakpoint (992px)
      act(() => {
        global.innerWidth = 900;
        global.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(onCollapse).toHaveBeenCalledWith(true);
      });
    });

    it('should add below class when below breakpoint', async () => {
      const { container } = render(
        <Sider breakpoint='md' collapsible>
          Sider
        </Sider>
      );

      act(() => {
        global.innerWidth = 700;
        global.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        const aside = container.querySelector('aside');
        expect(aside).toHaveClass('fluentui-plus-layout-sider-below');
      });
    });
  });

  describe('样式配置', () => {
    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'lightgray', padding: '20px' };
      const { container } = render(<Sider style={customStyle}>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('background-color: lightgray');
      expect(aside).toHaveStyle('padding: 20px');
    });

    it('should merge custom styles with width styles', () => {
      const customStyle = { backgroundColor: 'lightgray' };
      const { container } = render(
        <Sider style={customStyle} width={300}>
          Sider
        </Sider>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle('background-color: lightgray');
      expect(aside).toHaveStyle('width: 300px');
    });
  });

  describe('可访问性', () => {
    it('should render as semantic aside element', () => {
      const { container } = render(<Sider>Sider</Sider>);
      const aside = container.querySelector('aside');
      expect(aside?.tagName).toBe('ASIDE');
    });

    it('should have clickable trigger', async () => {
      const user = userEvent.setup();
      const { container } = render(<Sider collapsible>Sider</Sider>);

      const trigger = container.querySelector('.fluentui-plus-layout-sider-trigger');
      expect(trigger).toBeInTheDocument();

      await user.click(trigger!);
      // Should change icon after click
      await waitFor(() => {
        expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
      });
    });
  });

  describe('边界情况', () => {
    it('should handle empty sider', () => {
      const { container } = render(<Sider />);
      const children = container.querySelector('.fluentui-plus-layout-sider-children');
      expect(children).toBeInTheDocument();
      expect(children).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      const { container } = render(
        <Sider>
          {null}
          <div>Visible</div>
          {undefined}
        </Sider>
      );
      const children = container.querySelector('.fluentui-plus-layout-sider-children');
      expect(children).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });

    it('should handle controlled collapsed state changes', () => {
      const { container, rerender } = render(
        <Sider collapsible collapsed={false}>
          Sider
        </Sider>
      );

      let aside = container.querySelector('aside');
      expect(aside).not.toHaveClass('fluentui-plus-layout-sider-collapsed');

      rerender(
        <Sider collapsible collapsed={true}>
          Sider
        </Sider>
      );

      aside = container.querySelector('aside');
      expect(aside).toHaveClass('fluentui-plus-layout-sider-collapsed');
    });
  });

  describe('子元素渲染', () => {
    it('should wrap children in children container', () => {
      const { container } = render(
        <Sider>
          <nav>Navigation Menu</nav>
        </Sider>
      );

      const childrenContainer = container.querySelector('.fluentui-plus-layout-sider-children');
      expect(childrenContainer).toBeInTheDocument();

      const nav = childrenContainer?.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    });

    it('should render complex navigation structure', () => {
      render(
        <Sider>
          <nav data-testid='nav'>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </nav>
        </Sider>
      );

      expect(screen.getByTestId('nav')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });
});
