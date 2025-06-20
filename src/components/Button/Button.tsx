import React from 'react'
import styled from '@emotion/styled'
import { Button as FluentButton } from '@fluentui/react-components'
import { theme } from '../../styles/theme'
import clsx from 'clsx'

export interface ButtonProps {
  /** 按钮文本 */
  children: React.ReactNode
  /** 按钮类型 */
  type?: 'primary' | 'secondary' | 'outline' | 'subtle'
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 图标 */
  icon?: React.ReactNode
  /** 图标位置 */
  iconPosition?: 'before' | 'after'
}

const StyledButton = styled(FluentButton)<ButtonProps>`
  /* 基础样式 */
  font-family: inherit;
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  
  /* 尺寸样式 */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          height: 24px;
          padding: 0 ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
        `
      case 'large':
        return `
          height: 40px;
          padding: 0 ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
        `
      default:
        return `
          height: 32px;
          padding: 0 ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.sm};
        `
    }
  }}

  /* 类型样式 */
  ${({ type }) => {
    switch (type) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: white;
          
          &:hover {
            background-color: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
          
          &:active {
            background-color: ${theme.colors.primaryPressed};
            border-color: ${theme.colors.primaryPressed};
          }
        `
      case 'outline':
        return `
          background-color: transparent;
          border-color: ${theme.colors.primary};
          color: ${theme.colors.primary};
          
          &:hover {
            background-color: ${theme.colors.primary}10;
          }
        `
      case 'subtle':
        return `
          background-color: transparent;
          border-color: transparent;
          color: ${theme.colors.primary};
          
          &:hover {
            background-color: ${theme.colors.surface};
          }
        `
      default:
        return `
          background-color: ${theme.colors.surface};
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.border};
          }
        `
    }
  }}

  /* 禁用状态 */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.6;
    }
  }

  /* 加载状态 */
  ${({ loading }) => loading && `
    cursor: wait;
    opacity: 0.8;
  `}
`

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'secondary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className,
  style,
  icon,
  iconPosition = 'before',
  ...rest
}) => {  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (loading || disabled) return
    onClick?.(event)
  }

  return (    <StyledButton
      appearance={type === 'primary' ? 'primary' : 'secondary'}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      className={clsx('fluentui-plus-button', className)}
      style={style}
      {...rest}
    >
      {icon && iconPosition === 'before' && <span className="button-icon">{icon}</span>}
      {loading ? '加载中...' : children}
      {icon && iconPosition === 'after' && <span className="button-icon">{icon}</span>}
    </StyledButton>
  )
}

export default Button
