import { css } from '@emotion/react'

// 主题颜色定义
export const colors = {
  primary: '#0078d4',
  primaryHover: '#106ebe',
  primaryPressed: '#005a9e',
  secondary: '#605e5c',
  success: '#107c10',
  warning: '#ff8c00',
  error: '#d13438',
  background: '#ffffff',
  surface: '#f3f2f1',
  border: '#d2d0ce',
  text: '#323130',
  textSecondary: '#605e5c',
  textDisabled: '#a19f9d',
}

// 间距定义
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
}

// 字体大小定义
export const typography = {
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

// 圆角定义
export const borderRadius = {
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
}

// 阴影定义
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 2px 4px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.1)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
}

// 全局主题对象
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
}

// 全局样式重置
export const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.5;
    color: ${colors.text};
    background-color: ${colors.background};
  }

  button {
    font-family: inherit;
  }

  input {
    font-family: inherit;
  }
`

export type Theme = typeof theme
