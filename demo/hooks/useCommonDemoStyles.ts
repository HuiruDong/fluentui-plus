import { makeStyles } from '@fluentui/react-components';

/**
 * Demo 页面通用样式 Hook
 * 提取所有页面中重复的样式定义，减少代码重复
 */
export const useCommonDemoStyles = makeStyles({
  // 主容器样式 - 所有页面都使用
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // 页面头部样式 - 所有页面都使用
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#1f2937',
  },
  description: {
    fontSize: '18px',
    color: '#6b7280',
    lineHeight: '1.6',
  },

  // 章节样式 - 所有页面都使用
  section: {
    marginBottom: '48px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937',
  },
  sectionDescription: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.6',
  },

  // 演示容器样式 - 所有页面都使用
  demoContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
  },
  demoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
  },

  // 基础演示内容样式 - 大部分页面使用（可根据需要覆盖）
  demo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'flex-start',
  },

  // 值显示样式 - 部分页面使用
  valueDisplay: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
  },

  // 两列布局样式 - 部分页面使用
  twoColumnDemo: {
    display: 'grid',
    gridTemplateColumns: '300px 300px',
    gap: '24px',
  },

  // 按钮组样式 - 部分页面使用
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  // 行布局样式 - 部分页面使用
  demoRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
