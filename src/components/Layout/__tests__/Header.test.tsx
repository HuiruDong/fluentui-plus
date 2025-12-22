import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Header>Header Content</Header>);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('fluentui-plus-layout-header');
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Header>
          <div>Logo</div>
          <div>Navigation</div>
        </Header>
      );
      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Header className='custom-header'>Test Header</Header>);
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('fluentui-plus-layout-header');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'blue', height: '64px' };
      const { container } = render(<Header style={customStyle}>Test Header</Header>);
      const header = container.querySelector('header');
      expect(header).toHaveStyle('background-color: blue');
      expect(header).toHaveStyle('height: 64px');
    });
  });

  describe('内容渲染', () => {
    it('should render text content', () => {
      render(<Header>Simple Text Header</Header>);
      expect(screen.getByText('Simple Text Header')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Header>
          <div data-testid='logo'>
            <img src='logo.png' alt='Logo' />
          </div>
          <nav data-testid='navigation'>
            <a href='/home'>Home</a>
            <a href='/about'>About</a>
          </nav>
        </Header>
      );

      expect(screen.getByTestId('logo')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should handle empty header', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      const { container } = render(
        <Header>
          {null}
          <span>Visible</span>
          {undefined}
        </Header>
      );
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });
  });

  describe('样式组合', () => {
    it('should combine multiple classNames correctly', () => {
      const { container } = render(<Header className='custom-class-1 custom-class-2'>Header</Header>);
      const header = container.querySelector('header');
      expect(header).toHaveClass('fluentui-plus-layout-header');
      expect(header).toHaveClass('custom-class-1');
      expect(header).toHaveClass('custom-class-2');
    });

    it('should allow style overrides', () => {
      const customStyle = {
        backgroundColor: 'red',
        padding: '20px',
        fontSize: '18px',
      };
      const { container } = render(<Header style={customStyle}>Header</Header>);
      const header = container.querySelector('header');
      expect(header).toHaveStyle('background-color: red');
      expect(header).toHaveStyle('padding: 20px');
      expect(header).toHaveStyle('font-size: 18px');
    });
  });

  describe('可访问性', () => {
    it('should render as semantic header element', () => {
      const { container } = render(<Header>Header</Header>);
      const header = container.querySelector('header');
      expect(header?.tagName).toBe('HEADER');
    });

    it('should maintain semantic structure with children', () => {
      const { container } = render(
        <Header>
          <h1>Page Title</h1>
          <nav>Navigation</nav>
        </Header>
      );

      const header = container.querySelector('header');
      const h1 = header?.querySelector('h1');
      const nav = header?.querySelector('nav');

      expect(h1).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
    });
  });
});
