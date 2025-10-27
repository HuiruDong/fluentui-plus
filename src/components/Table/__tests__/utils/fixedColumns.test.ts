import { calculateFixedInfo, getFixedCellStyle } from '../../utils';
import type { ColumnType } from '../../types';

describe('fixedColumns utils', () => {
  describe('calculateFixedInfo', () => {
    it('should return empty array for empty columns', () => {
      const result = calculateFixedInfo([]);
      expect(result).toEqual([]);
    });

    it('should calculate info for columns without fixed property', () => {
      const columns: ColumnType[] = [
        { key: 'name', title: '姓名', width: 100 },
        { key: 'age', title: '年龄', width: 80 },
        { key: 'address', title: '地址', width: 200 },
      ];

      const result = calculateFixedInfo(columns);

      expect(result).toHaveLength(3);
      result.forEach(info => {
        expect(info.fixed).toBeUndefined();
        expect(info.left).toBeUndefined();
        expect(info.right).toBeUndefined();
        expect(info.isLastLeft).toBeFalsy();
        expect(info.isFirstRight).toBeFalsy();
      });
    });

    describe('左固定列', () => {
      it('should calculate left offset for single left fixed column', () => {
        const columns: ColumnType[] = [
          { key: 'name', title: '姓名', width: 100, fixed: 'left' },
          { key: 'age', title: '年龄', width: 80 },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0]).toMatchObject({
          fixed: 'left',
          left: 0,
          isLastLeft: true,
        });

        expect(result[1].fixed).toBeUndefined();
      });

      it('should calculate left offsets for multiple left fixed columns', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100, fixed: 'left' },
          { key: 'col2', title: '列2', width: 80, fixed: 'left' },
          { key: 'col3', title: '列3', width: 60, fixed: 'left' },
          { key: 'col4', title: '列4', width: 120 },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0]).toMatchObject({
          fixed: 'left',
          left: 0,
          isLastLeft: false,
        });

        expect(result[1]).toMatchObject({
          fixed: 'left',
          left: 100,
          isLastLeft: false,
        });

        expect(result[2]).toMatchObject({
          fixed: 'left',
          left: 180,
          isLastLeft: true,
        });

        expect(result[3].fixed).toBeUndefined();
      });

      it('should handle string width for left fixed columns', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: '100px', fixed: 'left' },
          { key: 'col2', title: '列2', width: '80px', fixed: 'left' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].left).toBe(0);
        expect(result[1].left).toBe(100);
      });

      it('should handle columns without width', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', fixed: 'left' },
          { key: 'col2', title: '列2', fixed: 'left' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].left).toBe(0);
        expect(result[1].left).toBe(0);
      });
    });

    describe('右固定列', () => {
      it('should calculate right offset for single right fixed column', () => {
        const columns: ColumnType[] = [
          { key: 'name', title: '姓名', width: 100 },
          { key: 'action', title: '操作', width: 80, fixed: 'right' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].fixed).toBeUndefined();

        expect(result[1]).toMatchObject({
          fixed: 'right',
          right: 0,
          isFirstRight: true,
        });
      });

      it('should calculate right offsets for multiple right fixed columns', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100 },
          { key: 'col2', title: '列2', width: 80, fixed: 'right' },
          { key: 'col3', title: '列3', width: 60, fixed: 'right' },
          { key: 'col4', title: '列4', width: 120, fixed: 'right' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].fixed).toBeUndefined();

        expect(result[1]).toMatchObject({
          fixed: 'right',
          right: 180,
          isFirstRight: true,
        });

        expect(result[2]).toMatchObject({
          fixed: 'right',
          right: 120,
          isFirstRight: false,
        });

        expect(result[3]).toMatchObject({
          fixed: 'right',
          right: 0,
          isFirstRight: false,
        });
      });

      it('should handle string width for right fixed columns', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100 },
          { key: 'col2', title: '列2', width: '80px', fixed: 'right' },
          { key: 'col3', title: '列3', width: '60px', fixed: 'right' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[1].right).toBe(60);
        expect(result[2].right).toBe(0);
      });
    });

    describe('混合固定列', () => {
      it('should calculate offsets for both left and right fixed columns', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100, fixed: 'left' },
          { key: 'col2', title: '列2', width: 80, fixed: 'left' },
          { key: 'col3', title: '列3', width: 150 },
          { key: 'col4', title: '列4', width: 120 },
          { key: 'col5', title: '列5', width: 90, fixed: 'right' },
          { key: 'col6', title: '列6', width: 110, fixed: 'right' },
        ];

        const result = calculateFixedInfo(columns);

        // 左固定列
        expect(result[0]).toMatchObject({
          fixed: 'left',
          left: 0,
          isLastLeft: false,
        });

        expect(result[1]).toMatchObject({
          fixed: 'left',
          left: 100,
          isLastLeft: true,
        });

        // 中间列
        expect(result[2].fixed).toBeUndefined();
        expect(result[3].fixed).toBeUndefined();

        // 右固定列
        expect(result[4]).toMatchObject({
          fixed: 'right',
          right: 110,
          isFirstRight: true,
        });

        expect(result[5]).toMatchObject({
          fixed: 'right',
          right: 0,
          isFirstRight: false,
        });
      });
    });

    describe('边界情况', () => {
      it('should handle all columns being left fixed', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100, fixed: 'left' },
          { key: 'col2', title: '列2', width: 80, fixed: 'left' },
          { key: 'col3', title: '列3', width: 60, fixed: 'left' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].left).toBe(0);
        expect(result[1].left).toBe(100);
        expect(result[2].left).toBe(180);
        expect(result[2].isLastLeft).toBe(true);
      });

      it('should handle all columns being right fixed', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 100, fixed: 'right' },
          { key: 'col2', title: '列2', width: 80, fixed: 'right' },
          { key: 'col3', title: '列3', width: 60, fixed: 'right' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].right).toBe(140);
        expect(result[0].isFirstRight).toBe(true);
        expect(result[1].right).toBe(60);
        expect(result[2].right).toBe(0);
      });

      it('should handle width of 0', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 0, fixed: 'left' },
          { key: 'col2', title: '列2', width: 100, fixed: 'left' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].left).toBe(0);
        expect(result[1].left).toBe(0);
      });

      it('should handle invalid string width', () => {
        const columns: ColumnType[] = [
          { key: 'col1', title: '列1', width: 'invalid', fixed: 'left' },
          { key: 'col2', title: '列2', width: 100, fixed: 'left' },
        ];

        const result = calculateFixedInfo(columns);

        expect(result[0].left).toBe(0);
        expect(result[1].left).toBe(0);
      });

      it('should handle single column', () => {
        const columns: ColumnType[] = [{ key: 'col1', title: '列1', width: 100, fixed: 'left' }];

        const result = calculateFixedInfo(columns);

        expect(result[0]).toMatchObject({
          fixed: 'left',
          left: 0,
          isLastLeft: true,
        });
      });
    });
  });

  describe('getFixedCellStyle', () => {
    it('should return empty object for non-fixed columns', () => {
      const info = { fixed: undefined };
      const style = getFixedCellStyle(info, 2);

      expect(style).toEqual({});
    });

    it('should return sticky style for left fixed columns', () => {
      const info = { fixed: 'left' as const, left: 100 };
      const style = getFixedCellStyle(info, 2);

      expect(style).toEqual({
        position: 'sticky',
        zIndex: 2,
        left: 100,
      });
    });

    it('should return sticky style for right fixed columns', () => {
      const info = { fixed: 'right' as const, right: 80 };
      const style = getFixedCellStyle(info, 3);

      expect(style).toEqual({
        position: 'sticky',
        zIndex: 3,
        right: 80,
      });
    });

    it('should handle left offset of 0', () => {
      const info = { fixed: 'left' as const, left: 0 };
      const style = getFixedCellStyle(info, 2);

      expect(style).toEqual({
        position: 'sticky',
        zIndex: 2,
        left: 0,
      });
    });

    it('should handle right offset of 0', () => {
      const info = { fixed: 'right' as const, right: 0 };
      const style = getFixedCellStyle(info, 2);

      expect(style).toEqual({
        position: 'sticky',
        zIndex: 2,
        right: 0,
      });
    });

    it('should use different zIndex values', () => {
      const info = { fixed: 'left' as const, left: 100 };

      const style1 = getFixedCellStyle(info, 1);
      expect(style1.zIndex).toBe(1);

      const style2 = getFixedCellStyle(info, 5);
      expect(style2.zIndex).toBe(5);

      const style3 = getFixedCellStyle(info, 10);
      expect(style3.zIndex).toBe(10);
    });

    it('should not include offset when undefined', () => {
      const infoLeft = { fixed: 'left' as const, left: undefined };
      const styleLeft = getFixedCellStyle(infoLeft, 2);

      expect(styleLeft).toEqual({
        position: 'sticky',
        zIndex: 2,
      });

      const infoRight = { fixed: 'right' as const, right: undefined };
      const styleRight = getFixedCellStyle(infoRight, 2);

      expect(styleRight).toEqual({
        position: 'sticky',
        zIndex: 2,
      });
    });

    it('should handle isLastLeft and isFirstRight flags', () => {
      const info = {
        fixed: 'left' as const,
        left: 100,
        isLastLeft: true,
      };
      const style = getFixedCellStyle(info, 2);

      // getFixedCellStyle 只关心 fixed、left/right 和 zIndex
      expect(style).toEqual({
        position: 'sticky',
        zIndex: 2,
        left: 100,
      });
    });

    describe('边界情况', () => {
      it('should handle negative offset values', () => {
        const info = { fixed: 'left' as const, left: -10 };
        const style = getFixedCellStyle(info, 2);

        expect(style.left).toBe(-10);
      });

      it('should handle large offset values', () => {
        const info = { fixed: 'right' as const, right: 9999 };
        const style = getFixedCellStyle(info, 2);

        expect(style.right).toBe(9999);
      });

      it('should handle zIndex of 0', () => {
        const info = { fixed: 'left' as const, left: 100 };
        const style = getFixedCellStyle(info, 0);

        expect(style.zIndex).toBe(0);
      });

      it('should handle negative zIndex', () => {
        const info = { fixed: 'left' as const, left: 100 };
        const style = getFixedCellStyle(info, -1);

        expect(style.zIndex).toBe(-1);
      });
    });
  });

  describe('Integration', () => {
    it('should work together to produce correct styles', () => {
      const columns: ColumnType[] = [
        { key: 'col1', title: '列1', width: 100, fixed: 'left' },
        { key: 'col2', title: '列2', width: 80, fixed: 'left' },
        { key: 'col3', title: '列3', width: 150 },
        { key: 'col4', title: '列4', width: 90, fixed: 'right' },
      ];

      const fixedInfo = calculateFixedInfo(columns);

      const style0 = getFixedCellStyle(fixedInfo[0], 2);
      expect(style0).toEqual({
        position: 'sticky',
        zIndex: 2,
        left: 0,
      });

      const style1 = getFixedCellStyle(fixedInfo[1], 2);
      expect(style1).toEqual({
        position: 'sticky',
        zIndex: 2,
        left: 100,
      });

      const style2 = getFixedCellStyle(fixedInfo[2], 2);
      expect(style2).toEqual({});

      const style3 = getFixedCellStyle(fixedInfo[3], 2);
      expect(style3).toEqual({
        position: 'sticky',
        zIndex: 2,
        right: 0,
      });
    });

    it('should handle real-world table scenario', () => {
      // 模拟真实的表格场景
      const columns: ColumnType[] = [
        { key: 'selection', title: '', width: 50, fixed: 'left' },
        { key: 'id', title: 'ID', width: 80, fixed: 'left' },
        { key: 'name', title: '姓名', width: 120 },
        { key: 'age', title: '年龄', width: 80 },
        { key: 'address', title: '地址', width: 200 },
        { key: 'email', title: '邮箱', width: 180 },
        { key: 'phone', title: '电话', width: 120 },
        { key: 'status', title: '状态', width: 100, fixed: 'right' },
        { key: 'action', title: '操作', width: 150, fixed: 'right' },
      ];

      const fixedInfo = calculateFixedInfo(columns);

      // 验证左固定列
      expect(fixedInfo[0]).toMatchObject({
        fixed: 'left',
        left: 0,
        isLastLeft: false,
      });

      expect(fixedInfo[1]).toMatchObject({
        fixed: 'left',
        left: 50,
        isLastLeft: true,
      });

      // 验证中间列
      expect(fixedInfo[2].fixed).toBeUndefined();
      expect(fixedInfo[6].fixed).toBeUndefined();

      // 验证右固定列
      expect(fixedInfo[7]).toMatchObject({
        fixed: 'right',
        right: 150,
        isFirstRight: true,
      });

      expect(fixedInfo[8]).toMatchObject({
        fixed: 'right',
        right: 0,
        isFirstRight: false,
      });

      // 验证样式生成
      const headerStyle1 = getFixedCellStyle(fixedInfo[1], 3);
      expect(headerStyle1).toEqual({
        position: 'sticky',
        zIndex: 3,
        left: 50,
      });

      const bodyStyle7 = getFixedCellStyle(fixedInfo[7], 2);
      expect(bodyStyle7).toEqual({
        position: 'sticky',
        zIndex: 2,
        right: 150,
      });
    });
  });
});
