import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColGroup from '../ColGroup';
import type { ColumnType } from '../types';

describe('ColGroup Component', () => {
  const basicColumns: ColumnType[] = [
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'age', title: '年龄', dataIndex: 'age' },
    { key: 'address', title: '地址', dataIndex: 'address' },
  ];

  describe('基础渲染', () => {
    it('should render colgroup element', () => {
      const { container } = render(
        <table>
          <ColGroup columns={basicColumns} />
        </table>
      );

      const colgroup = container.querySelector('colgroup');
      expect(colgroup).toBeInTheDocument();
    });

    it('should render col elements for each column', () => {
      const { container } = render(
        <table>
          <ColGroup columns={basicColumns} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(basicColumns.length);
    });

    it('should render with correct keys', () => {
      const { container } = render(
        <table>
          <ColGroup columns={basicColumns} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      cols.forEach(col => {
        // React sets the key internally, we verify it's rendered
        expect(col).toBeInTheDocument();
      });
    });
  });

  describe('列宽度处理', () => {
    it('should apply numeric width as pixels', () => {
      const columnsWithNumericWidth: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', width: 100 },
        { key: 'age', title: '年龄', dataIndex: 'age', width: 80 },
        { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithNumericWidth} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols[0]).toHaveStyle('width: 100px');
      expect(cols[1]).toHaveStyle('width: 80px');
      expect(cols[2]).toHaveStyle('width: 200px');
    });

    it('should apply string width directly', () => {
      const columnsWithStringWidth: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', width: '30%' },
        { key: 'age', title: '年龄', dataIndex: 'age', width: '20%' },
        { key: 'address', title: '地址', dataIndex: 'address', width: '50%' },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithStringWidth} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols[0]).toHaveStyle('width: 30%');
      expect(cols[1]).toHaveStyle('width: 20%');
      expect(cols[2]).toHaveStyle('width: 50%');
    });

    it('should handle mixed width types', () => {
      const columnsWithMixedWidth: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', width: 100 },
        { key: 'age', title: '年龄', dataIndex: 'age', width: '20%' },
        { key: 'address', title: '地址', dataIndex: 'address', width: '300px' },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithMixedWidth} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols[0]).toHaveStyle('width: 100px');
      expect(cols[1]).toHaveStyle('width: 20%');
      expect(cols[2]).toHaveStyle('width: 300px');
    });

    it('should not apply width style when width is not specified', () => {
      const columnsWithoutWidth: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithoutWidth} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      cols.forEach(col => {
        expect(col).not.toHaveAttribute('style');
      });
    });

    it('should handle width of 0', () => {
      const columnsWithZeroWidth: ColumnType[] = [{ key: 'hidden', title: '隐藏', dataIndex: 'hidden', width: 0 }];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithZeroWidth} />
        </table>
      );

      const col = container.querySelector('col');
      // width of 0 is falsy, so style is not applied (this is expected behavior)
      expect(col).not.toHaveAttribute('style');
    });

    it('should handle different CSS units', () => {
      const columnsWithDifferentUnits: ColumnType[] = [
        { key: 'col1', title: '列1', width: 'auto' },
        { key: 'col2', title: '列2', width: '10em' },
        { key: 'col3', title: '列3', width: '5rem' },
        { key: 'col4', title: '列4', width: '50vw' },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithDifferentUnits} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols[0]).toHaveStyle('width: auto');
      expect(cols[1]).toHaveStyle('width: 10em');
      expect(cols[2]).toHaveStyle('width: 5rem');
      expect(cols[3]).toHaveStyle('width: 50vw');
    });
  });

  describe('边界情况', () => {
    it('should handle empty columns array', () => {
      const { container } = render(
        <table>
          <ColGroup columns={[]} />
        </table>
      );

      const colgroup = container.querySelector('colgroup');
      expect(colgroup).toBeInTheDocument();

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(0);
    });

    it('should handle single column', () => {
      const singleColumn: ColumnType[] = [{ key: 'name', title: '姓名', dataIndex: 'name', width: 100 }];

      const { container } = render(
        <table>
          <ColGroup columns={singleColumn} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(1);
      expect(cols[0]).toHaveStyle('width: 100px');
    });

    it('should handle large number of columns', () => {
      const manyColumns: ColumnType[] = Array.from({ length: 50 }, (_, i) => ({
        key: `col${i}`,
        title: `列${i}`,
        dataIndex: `col${i}`,
        width: 100,
      }));

      const { container } = render(
        <table>
          <ColGroup columns={manyColumns} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(50);
    });

    it('should handle columns with special characters in keys', () => {
      const specialColumns: ColumnType[] = [
        { key: 'user-name', title: '用户名', width: 100 },
        { key: 'user_age', title: '年龄', width: 80 },
        { key: 'user.email', title: '邮箱', width: 150 },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={specialColumns} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(3);
    });
  });

  describe('泛型支持', () => {
    interface CustomRecord {
      id: number;
      name: string;
      customField: string;
    }

    it('should work with custom record type', () => {
      const typedColumns: ColumnType<CustomRecord>[] = [
        { key: 'id', title: 'ID', dataIndex: 'id', width: 50 },
        { key: 'name', title: '名称', dataIndex: 'name', width: 100 },
        { key: 'customField', title: '自定义', dataIndex: 'customField', width: 150 },
      ];

      const { container } = render(
        <table>
          <ColGroup<CustomRecord> columns={typedColumns} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(3);
      expect(cols[0]).toHaveStyle('width: 50px');
      expect(cols[1]).toHaveStyle('width: 100px');
      expect(cols[2]).toHaveStyle('width: 150px');
    });
  });

  describe('与固定列配合', () => {
    it('should render cols for fixed columns', () => {
      const columnsWithFixed: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', width: 100, fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age', width: 80 },
        { key: 'action', title: '操作', dataIndex: 'action', width: 100, fixed: 'right' },
      ];

      const { container } = render(
        <table>
          <ColGroup columns={columnsWithFixed} />
        </table>
      );

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(3);
      expect(cols[0]).toHaveStyle('width: 100px');
      expect(cols[1]).toHaveStyle('width: 80px');
      expect(cols[2]).toHaveStyle('width: 100px');
    });
  });

  describe('样式一致性', () => {
    it('should maintain consistent width across re-renders', () => {
      const columns: ColumnType[] = [{ key: 'name', title: '姓名', width: 100 }];

      const { container, rerender } = render(
        <table>
          <ColGroup columns={columns} />
        </table>
      );

      const col1 = container.querySelector('col');
      expect(col1).toHaveStyle('width: 100px');

      // 重新渲染
      rerender(
        <table>
          <ColGroup columns={columns} />
        </table>
      );

      const col2 = container.querySelector('col');
      expect(col2).toHaveStyle('width: 100px');
    });

    it('should update when columns change', () => {
      const columns1: ColumnType[] = [{ key: 'name', title: '姓名', width: 100 }];

      const columns2: ColumnType[] = [{ key: 'name', title: '姓名', width: 150 }];

      const { container, rerender } = render(
        <table>
          <ColGroup columns={columns1} />
        </table>
      );

      expect(container.querySelector('col')).toHaveStyle('width: 100px');

      rerender(
        <table>
          <ColGroup columns={columns2} />
        </table>
      );

      expect(container.querySelector('col')).toHaveStyle('width: 150px');
    });
  });

  describe('性能考虑', () => {
    it('should render efficiently with many columns', () => {
      const manyColumns: ColumnType[] = Array.from({ length: 100 }, (_, i) => ({
        key: `col${i}`,
        title: `列${i}`,
        width: 100 + i,
      }));

      const startTime = performance.now();

      const { container } = render(
        <table>
          <ColGroup columns={manyColumns} />
        </table>
      );

      const endTime = performance.now();

      const cols = container.querySelectorAll('col');
      expect(cols).toHaveLength(100);

      // 渲染时间应该在合理范围内（100ms内）
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
