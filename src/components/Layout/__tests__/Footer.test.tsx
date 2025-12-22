import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

describe('Footer Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Footer>Footer Content</Footer>);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('fluentui-plus-layout-footer');
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Footer>
          <div>Copyright</div>
          <div>Links</div>
        </Footer>
      );
      expect(screen.getByText('Copyright')).toBeInTheDocument();
      expect(screen.getByText('Links')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Footer className='custom-footer'>Test Footer</Footer>);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('custom-footer');
      expect(footer).toHaveClass('fluentui-plus-layout-footer');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'gray', padding: '16px' };
      const { container } = render(<Footer style={customStyle}>Test Footer</Footer>);
      const footer = container.querySelector('footer');
      expect(footer).toHaveStyle('background-color: gray');
      expect(footer).toHaveStyle('padding: 16px');
    });
  });

  describe('内容渲染', () => {
    it('should render text content', () => {
      render(<Footer>© 2024 Company Name</Footer>);
      expect(screen.getByText('© 2024 Company Name')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Footer>
          <div data-testid='copyright'>
            <p>© 2024 Company</p>
          </div>
          <div data-testid='links'>
            <a href='/privacy'>Privacy</a>
            <a href='/terms'>Terms</a>
          </div>
        </Footer>
      );

      expect(screen.getByTestId('copyright')).toBeInTheDocument();
      expect(screen.getByTestId('links')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
    });

    it('should handle empty footer', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      const { container } = render(
        <Footer>
          {null}
          <span>Visible</span>
          {undefined}
        </Footer>
      );
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });
  });

  describe('样式组合', () => {
    it('should combine multiple classNames correctly', () => {
      const { container } = render(<Footer className='custom-class-1 custom-class-2'>Footer</Footer>);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('fluentui-plus-layout-footer');
      expect(footer).toHaveClass('custom-class-1');
      expect(footer).toHaveClass('custom-class-2');
    });

    it('should allow style overrides', () => {
      const customStyle = {
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center' as const,
      };
      const { container } = render(<Footer style={customStyle}>Footer</Footer>);
      const footer = container.querySelector('footer');
      expect(footer).toHaveStyle('background-color: black');
      expect(footer).toHaveStyle('color: white');
      expect(footer).toHaveStyle('text-align: center');
    });
  });

  describe('可访问性', () => {
    it('should render as semantic footer element', () => {
      const { container } = render(<Footer>Footer</Footer>);
      const footer = container.querySelector('footer');
      expect(footer?.tagName).toBe('FOOTER');
    });

    it('should maintain semantic structure with children', () => {
      const { container } = render(
        <Footer>
          <p>Copyright information</p>
          <nav>Footer navigation</nav>
        </Footer>
      );

      const footer = container.querySelector('footer');
      const p = footer?.querySelector('p');
      const nav = footer?.querySelector('nav');

      expect(p).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
    });
  });

  describe('典型用例', () => {
    it('should render footer with copyright and links', () => {
      render(
        <Footer>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2024 My Company. All rights reserved.</span>
            <div>
              <a href='/privacy'>Privacy Policy</a> | <a href='/terms'>Terms of Service</a>
            </div>
          </div>
        </Footer>
      );

      expect(screen.getByText(/© 2024 My Company/)).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should render footer with social links', () => {
      render(
        <Footer>
          <div data-testid='social-links'>
            <a href='https://twitter.com'>Twitter</a>
            <a href='https://facebook.com'>Facebook</a>
            <a href='https://linkedin.com'>LinkedIn</a>
          </div>
        </Footer>
      );

      expect(screen.getByTestId('social-links')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });
  });
});
