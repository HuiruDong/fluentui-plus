import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CascaderEmpty from '../CascaderEmpty';
import type { CascaderEmptyProps } from '../types';

const defaultProps: CascaderEmptyProps = {
  prefixCls: 'fluentui-plus-cascader',
};

describe('CascaderEmpty Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<CascaderEmpty {...defaultProps} />);

      const container = document.querySelector('.fluentui-plus-cascader__empty');
      expect(container).toBeInTheDocument();

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('暂无数据');
    });

    it('should render with custom text', () => {
      render(<CascaderEmpty {...defaultProps} text='没有找到数据' />);

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toHaveTextContent('没有找到数据');
    });

    it('should apply custom className', () => {
      render(<CascaderEmpty {...defaultProps} className='custom-empty-class' />);

      const container = document.querySelector('.fluentui-plus-cascader__empty');
      expect(container).toHaveClass('custom-empty-class');
      expect(container).toHaveClass('fluentui-plus-cascader__empty');
    });

    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red', padding: '20px' };
      render(<CascaderEmpty {...defaultProps} style={customStyle} />);

      const container = document.querySelector('.fluentui-plus-cascader__empty');
      expect(container).toHaveStyle('background-color: red');
      expect(container).toHaveStyle('padding: 20px');
    });

    it('should work with different prefixCls', () => {
      render(<CascaderEmpty prefixCls='custom-prefix' text='Test' />);

      const container = document.querySelector('.custom-prefix__empty');
      expect(container).toBeInTheDocument();

      const text = document.querySelector('.custom-prefix__empty-text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Test');
    });
  });

  describe('边界情况', () => {
    it('should handle empty text', () => {
      render(<CascaderEmpty {...defaultProps} text='' />);

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('');
    });

    it('should handle undefined text (use default)', () => {
      render(<CascaderEmpty {...defaultProps} text={undefined} />);

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toHaveTextContent('暂无数据');
    });

    it('should handle numeric text', () => {
      render(<CascaderEmpty {...defaultProps} text='404' />);

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toHaveTextContent('404');
    });

    it('should handle special characters in text', () => {
      render(<CascaderEmpty {...defaultProps} text={'<>&"\''} />);

      const text = document.querySelector('.fluentui-plus-cascader__empty-text');
      expect(text).toHaveTextContent('<>&"\'');
    });
  });

  describe('CSS 类和样式', () => {
    it('should merge classes correctly', () => {
      render(<CascaderEmpty {...defaultProps} className='class1 class2' />);

      const container = document.querySelector('.fluentui-plus-cascader__empty');
      expect(container).toHaveClass('fluentui-plus-cascader__empty');
      expect(container).toHaveClass('class1');
      expect(container).toHaveClass('class2');
    });

    it('should handle multiple style properties', () => {
      const style = {
        color: 'blue',
        fontSize: '14px',
        textAlign: 'center' as const,
        margin: '10px 0',
      };

      render(<CascaderEmpty {...defaultProps} style={style} />);

      const container = document.querySelector('.fluentui-plus-cascader__empty');
      expect(container).toHaveStyle('color: blue');
      expect(container).toHaveStyle('font-size: 14px');
      expect(container).toHaveStyle('text-align: center');
      expect(container).toHaveStyle('margin: 10px 0px');
    });
  });

  describe('可访问性', () => {
    it('should be accessible with default text', () => {
      render(<CascaderEmpty {...defaultProps} />);

      const text = screen.getByText('暂无数据');
      expect(text).toBeInTheDocument();
    });

    it('should be accessible with custom text', () => {
      render(<CascaderEmpty {...defaultProps} text='No results found' />);

      const text = screen.getByText('No results found');
      expect(text).toBeInTheDocument();
    });
  });
});
