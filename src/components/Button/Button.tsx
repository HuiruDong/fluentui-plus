import React from 'react'
import clsx from 'clsx'
import { StyledButton } from './Button.styles'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮类型
   */
  variant?: 'primary' | 'default' | 'secondary' | 'outline' | 'text' | 'link'
  
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * 是否为块级按钮（占满父容器宽度）
   */
  block?: boolean
  
  /**
   * 是否显示加载状态
   */
  loading?: boolean
  
  /**
   * 按钮图标
   */
  icon?: React.ReactNode
  
  /**
   * 图标位置
   */
  iconPosition?: 'start' | 'end'
  
  /**
   * 危险状态（用于删除等操作）
   */
  danger?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  block = false,
  loading = false,
  icon,
  iconPosition = 'start',
  danger = false,
  className,
  disabled,
  ...props
}) => {
  const buttonClass = clsx(
    'fluentui-plus-button',
    `fluentui-plus-button--${variant}`,
    `fluentui-plus-button--${size}`,
    {
      'fluentui-plus-button--block': block,
      'fluentui-plus-button--loading': loading,
      'fluentui-plus-button--danger': danger,
      'fluentui-plus-button--icon-only': icon && !children,
    },
    className
  )

  const renderIcon = () => {
    if (loading) {
      return <span className="fluentui-plus-button__loading">⟳</span>
    }
    return icon ? <span className="fluentui-plus-button__icon">{icon}</span> : null
  }

  return (
    <StyledButton
      className={buttonClass}
      variant={variant}
      size={size}
      block={block}
      danger={danger}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'start' && renderIcon()}
      {children && <span className="fluentui-plus-button__text">{children}</span>}
      {iconPosition === 'end' && renderIcon()}
    </StyledButton>
  )
}

export default Button
