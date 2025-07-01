// Button 组件样式
// 基于 FluentUI 设计令牌的按钮样式系统

import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { tokens } from '@fluentui/react-components'
import type { ButtonProps } from './Button'

// 按钮变体样式
const buttonVariants = {
  primary: css`
    background-color: ${tokens.colorBrandBackground};
    color: ${tokens.colorNeutralForegroundOnBrand};
    border: 1px solid ${tokens.colorBrandBackground};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colorBrandBackgroundHover};
      border-color: ${tokens.colorBrandBackgroundHover};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colorBrandBackgroundPressed};
      border-color: ${tokens.colorBrandBackgroundPressed};
    }
  `,
  
  default: css`
    background-color: ${tokens.colorNeutralBackground1};
    color: ${tokens.colorNeutralForeground1};
    border: 1px solid ${tokens.colorNeutralStroke1};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colorNeutralBackground1Hover};
      border-color: ${tokens.colorNeutralStroke1Hover};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colorNeutralBackground1Pressed};
      border-color: ${tokens.colorNeutralStroke1Pressed};
    }
  `,
  
  secondary: css`
    background-color: ${tokens.colorNeutralBackground2};
    color: ${tokens.colorNeutralForeground2};
    border: 1px solid ${tokens.colorNeutralStroke1};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colorNeutralBackground2Hover};
      border-color: ${tokens.colorNeutralStroke1Hover};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colorNeutralBackground2Pressed};
      border-color: ${tokens.colorNeutralStroke1Pressed};
    }
  `,
  
  outline: css`
    background-color: transparent;
    color: ${tokens.colorBrandForeground1};
    border: 1px solid ${tokens.colorBrandStroke1};
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colorBrandBackground};
      color: ${tokens.colorNeutralForegroundOnBrand};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colorBrandBackgroundPressed};
      color: ${tokens.colorNeutralForegroundOnBrand};
    }
  `,
  
  text: css`
    background-color: transparent;
    color: ${tokens.colorBrandForeground1};
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background-color: ${tokens.colorBrandBackground};
      color: ${tokens.colorNeutralForegroundOnBrand};
    }
    
    &:active:not(:disabled) {
      background-color: ${tokens.colorBrandBackgroundPressed};
      color: ${tokens.colorNeutralForegroundOnBrand};
    }
  `,
  
  link: css`
    background-color: transparent;
    color: ${tokens.colorBrandForeground1};
    border: none;
    text-decoration: underline;
    
    &:hover:not(:disabled) {
      color: ${tokens.colorBrandForeground2};
    }
    
    &:active:not(:disabled) {
      color: ${tokens.colorBrandForeground2};
    }
  `,
}

// 按钮尺寸样式
const buttonSizes = {
  small: css`
    height: 24px;
    padding: 0 ${tokens.spacingHorizontalS};
    font-size: ${tokens.fontSizeBase200};
    line-height: ${tokens.lineHeightBase200};
  `,
  
  medium: css`
    height: 32px;
    padding: 0 ${tokens.spacingHorizontalM};
    font-size: ${tokens.fontSizeBase300};
    line-height: ${tokens.lineHeightBase300};
  `,
  
  large: css`
    height: 40px;
    padding: 0 ${tokens.spacingHorizontalL};
    font-size: ${tokens.fontSizeBase400};
    line-height: ${tokens.lineHeightBase400};
  `,
}

// 危险状态样式
const dangerStyles = css`
  &.fluentui-plus-button--danger {
    &.fluentui-plus-button--primary {
      background-color: ${tokens.colorPaletteRedBackground3};
      border-color: ${tokens.colorPaletteRedBackground3};
      
      &:hover:not(:disabled) {
        background-color: ${tokens.colorPaletteRedBorderActive};
        border-color: ${tokens.colorPaletteRedBorderActive};
      }
    }
    
    &:not(.fluentui-plus-button--primary) {
      color: ${tokens.colorPaletteRedForeground3};
      border-color: ${tokens.colorPaletteRedBorder2};
      
      &:hover:not(:disabled) {
        background-color: ${tokens.colorPaletteRedBackground1};
        border-color: ${tokens.colorPaletteRedBorder2};
      }
    }
  }
`

export const StyledButton = styled.button<Pick<ButtonProps, 'variant' | 'size' | 'block' | 'danger'>>`
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacingHorizontalXS};
  border-radius: ${tokens.borderRadiusMedium};
  font-family: ${tokens.fontFamilyBase};
  font-weight: ${tokens.fontWeightSemibold};
  text-decoration: none;
  cursor: pointer;
  transition: all ${tokens.durationNormal} ${tokens.curveEasyEase};
  box-sizing: border-box;
  user-select: none;
  outline: none;
  position: relative;
  
  /* 变体样式 */
  ${({ variant = 'default' }) => buttonVariants[variant]}
  
  /* 尺寸样式 */
  ${({ size = 'medium' }) => buttonSizes[size]}
  
  /* 块级样式 */
  ${({ block }) => block && css`
    width: 100%;
  `}
  
  /* 禁用状态 */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* 加载状态 */
  &.fluentui-plus-button--loading {
    cursor: not-allowed;
    
    .fluentui-plus-button__loading {
      animation: spin 1s linear infinite;
    }
  }
  
  /* 图标样式 */
  .fluentui-plus-button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 只有图标的按钮 */
  &.fluentui-plus-button--icon-only {
    width: auto;
    aspect-ratio: 1;
    padding: 0;
  }
  
  /* 危险状态 */
  ${dangerStyles}
  
  /* 焦点样式 */
  &:focus-visible {
    outline: 2px solid ${tokens.colorStrokeFocus2};
    outline-offset: 2px;
  }
  
  /* 加载动画 */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
