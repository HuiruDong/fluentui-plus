import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '../Counter';

describe('Counter Component', () => {
  describe('渲染', () => {
    it('应正确渲染计数器容器', () => {
      const { container } = render(<Counter currentIndex={0} total={5} />);
      expect(container.querySelector('.fluentui-plus-image-preview-modal-counter')).toBeInTheDocument();
    });

    it('应正确显示当前位置和总数', () => {
      render(<Counter currentIndex={0} total={5} />);
      expect(screen.getByText('第 1 / 5 张')).toBeInTheDocument();
    });
  });

  describe('不同索引', () => {
    it('当 currentIndex 为 0 时应显示第 1 张', () => {
      render(<Counter currentIndex={0} total={10} />);
      expect(screen.getByText('第 1 / 10 张')).toBeInTheDocument();
    });

    it('当 currentIndex 为 4 时应显示第 5 张', () => {
      render(<Counter currentIndex={4} total={10} />);
      expect(screen.getByText('第 5 / 10 张')).toBeInTheDocument();
    });

    it('当 currentIndex 为最后一个时应显示最后一张', () => {
      render(<Counter currentIndex={9} total={10} />);
      expect(screen.getByText('第 10 / 10 张')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('只有一张图片时应正确显示', () => {
      render(<Counter currentIndex={0} total={1} />);
      expect(screen.getByText('第 1 / 1 张')).toBeInTheDocument();
    });
  });
});
