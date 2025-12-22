import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Content from '../Content';

describe('Content Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Content>Main Content</Content>);
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('fluentui-plus-layout-content');
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Content>
          <div>Section 1</div>
          <div>Section 2</div>
        </Content>
      );
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Content className='custom-content'>Test Content</Content>);
      const main = container.querySelector('main');
      expect(main).toHaveClass('custom-content');
      expect(main).toHaveClass('fluentui-plus-layout-content');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'white', padding: '24px' };
      const { container } = render(<Content style={customStyle}>Test Content</Content>);
      const main = container.querySelector('main');
      expect(main).toHaveStyle('background-color: white');
      expect(main).toHaveStyle('padding: 24px');
    });
  });

  describe('内容渲染', () => {
    it('should render text content', () => {
      render(<Content>Simple text content</Content>);
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Content>
          <article data-testid='article'>
            <h1>Article Title</h1>
            <p>Article content</p>
          </article>
          <section data-testid='section'>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
        </Content>
      );

      expect(screen.getByTestId('article')).toBeInTheDocument();
      expect(screen.getByTestId('section')).toBeInTheDocument();
      expect(screen.getByText('Article Title')).toBeInTheDocument();
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      const { container } = render(<Content />);
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      const { container } = render(
        <Content>
          {null}
          <div>Visible</div>
          {undefined}
        </Content>
      );
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });
  });

  describe('样式组合', () => {
    it('should combine multiple classNames correctly', () => {
      const { container } = render(<Content className='custom-class-1 custom-class-2'>Content</Content>);
      const main = container.querySelector('main');
      expect(main).toHaveClass('fluentui-plus-layout-content');
      expect(main).toHaveClass('custom-class-1');
      expect(main).toHaveClass('custom-class-2');
    });

    it('should allow style overrides', () => {
      const customStyle = {
        minHeight: '280px',
        backgroundColor: '#f5f5f5',
        padding: '24px',
      };
      const { container } = render(<Content style={customStyle}>Content</Content>);
      const main = container.querySelector('main');
      expect(main).toHaveStyle('min-height: 280px');
      expect(main).toHaveStyle('background-color: #f5f5f5');
      expect(main).toHaveStyle('padding: 24px');
    });
  });

  describe('可访问性', () => {
    it('should render as semantic main element', () => {
      const { container } = render(<Content>Content</Content>);
      const main = container.querySelector('main');
      expect(main?.tagName).toBe('MAIN');
    });

    it('should maintain semantic structure with children', () => {
      const { container } = render(
        <Content>
          <article>
            <h1>Main Article</h1>
          </article>
          <aside>Sidebar</aside>
        </Content>
      );

      const main = container.querySelector('main');
      const article = main?.querySelector('article');
      const aside = main?.querySelector('aside');

      expect(article).toBeInTheDocument();
      expect(aside).toBeInTheDocument();
    });
  });

  describe('典型用例', () => {
    it('should render content with heading and paragraphs', () => {
      render(
        <Content>
          <h1>Page Title</h1>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </Content>
      );

      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should render content with multiple sections', () => {
      render(
        <Content>
          <section>
            <h2>Section 1</h2>
            <p>Content 1</p>
          </section>
          <section>
            <h2>Section 2</h2>
            <p>Content 2</p>
          </section>
        </Content>
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should render content with forms and tables', () => {
      render(
        <Content>
          <form data-testid='form'>
            <input type='text' placeholder='Enter name' />
          </form>
          <table data-testid='table'>
            <thead>
              <tr>
                <th>Header</th>
              </tr>
            </thead>
          </table>
        </Content>
      );

      expect(screen.getByTestId('form')).toBeInTheDocument();
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('动态内容', () => {
    it('should handle content updates', () => {
      const { rerender } = render(<Content>Initial Content</Content>);
      expect(screen.getByText('Initial Content')).toBeInTheDocument();

      rerender(<Content>Updated Content</Content>);
      expect(screen.queryByText('Initial Content')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Content')).toBeInTheDocument();
    });

    it('should handle conditional rendering', () => {
      const showHidden = false;
      const { rerender } = render(
        <Content>
          {showHidden && <div>Hidden</div>}
          <div>Visible</div>
        </Content>
      );

      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();

      const showNow = true;
      rerender(
        <Content>
          {showNow && <div>Now Shown</div>}
          <div>Visible</div>
        </Content>
      );

      expect(screen.getByText('Now Shown')).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });
  });
});
