import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';
import Sider from '../Sider';
import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';

describe('Layout Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(<Layout>Test Content</Layout>);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('fluentui-plus-layout');
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <Layout>
          <div>Child 1</div>
          <div>Child 2</div>
        </Layout>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Layout className='custom-class'>Test Layout</Layout>);
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
      expect(section).toHaveClass('fluentui-plus-layout');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red', padding: '20px' };
      const { container } = render(<Layout style={customStyle}>Test Layout</Layout>);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('background-color: red');
      expect(section).toHaveStyle('padding: 20px');
    });
  });

  describe('Sider 检测', () => {
    it('should auto-detect Sider component', () => {
      const { container } = render(
        <Layout>
          <Sider>Sider Content</Sider>
          <Content>Main Content</Content>
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('fluentui-plus-layout-has-sider');
    });

    it('should not add has-sider class when no Sider component', () => {
      const { container } = render(
        <Layout>
          <Header>Header</Header>
          <Content>Content</Content>
          <Footer>Footer</Footer>
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).not.toHaveClass('fluentui-plus-layout-has-sider');
    });

    it('should respect hasSider prop when true', () => {
      const { container } = render(
        <Layout hasSider={true}>
          <Header>Header</Header>
          <Content>Content</Content>
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('fluentui-plus-layout-has-sider');
    });

    it('should respect hasSider prop when false', () => {
      const { container } = render(
        <Layout hasSider={false}>
          <Sider>Sider</Sider>
          <Content>Content</Content>
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).not.toHaveClass('fluentui-plus-layout-has-sider');
    });

    it('should handle multiple Sider components', () => {
      const { container } = render(
        <Layout>
          <Sider>Left Sider</Sider>
          <Content>Content</Content>
          <Sider>Right Sider</Sider>
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('fluentui-plus-layout-has-sider');
    });
  });

  describe('复杂布局', () => {
    it('should render typical layout structure', () => {
      render(
        <Layout>
          <Header>Header</Header>
          <Layout>
            <Sider>Sider</Sider>
            <Content>Content</Content>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Sider')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should render nested layouts correctly', () => {
      const { container } = render(
        <Layout>
          <Header>Top Header</Header>
          <Layout hasSider>
            <Sider>Side Menu</Sider>
            <Layout>
              <Content>Main Content</Content>
              <Footer>Inner Footer</Footer>
            </Layout>
          </Layout>
        </Layout>
      );

      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Top Header')).toBeInTheDocument();
      expect(screen.getByText('Side Menu')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should render empty Layout', () => {
      const { container } = render(<Layout />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toBeEmptyDOMElement();
    });

    it('should handle null children gracefully', () => {
      const { container } = render(
        <Layout>
          {null}
          <Content>Content</Content>
          {undefined}
        </Layout>
      );
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle conditional rendering', () => {
      const showHidden = false;
      const { rerender } = render(
        <Layout>
          {showHidden && <Header>Hidden Header</Header>}
          <Content>Visible Content</Content>
        </Layout>
      );

      expect(screen.queryByText('Hidden Header')).not.toBeInTheDocument();
      expect(screen.getByText('Visible Content')).toBeInTheDocument();

      const showHeader = true;
      rerender(
        <Layout>
          {showHeader && <Header>Shown Header</Header>}
          <Content>Visible Content</Content>
        </Layout>
      );

      expect(screen.getByText('Shown Header')).toBeInTheDocument();
    });
  });
});
