import React from 'react'
import styled from '@emotion/styled'
import { Input as FluentInput } from '@fluentui/react-components'
import { theme } from '../../styles/theme'
import clsx from 'clsx'

export interface InputProps {
  /** 输入框值 */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readOnly?: boolean
  /** 输入框大小 */
  size?: 'small' | 'medium' | 'large'
  /** 值变化回调 */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** 焦点回调 */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** 失焦回调 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 前缀图标 */
  prefix?: React.ReactNode
  /** 后缀图标 */
  suffix?: React.ReactNode
}

const StyledInput = styled(FluentInput)<InputProps>`
  .fui-Input__input {
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border};
    font-family: inherit;
    
    &:focus {
      border-color: ${theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 1px ${theme.colors.primary};
    }
    
    &:disabled {
      background-color: ${theme.colors.surface};
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  }
`

const Input: React.FC<InputProps> = ({
  value,
  defaultValue,
  placeholder,
  disabled = false,
  readOnly = false,
  size = 'medium',
  onChange,
  onFocus,
  onBlur,
  className,
  style,
  prefix,
  suffix,
  ...rest
}) => {
  return (
    <StyledInput
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      size={size}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={clsx('fluentui-plus-input', className)}
      style={style}      contentBefore={prefix ? { children: prefix } : undefined}
      contentAfter={suffix ? { children: suffix } : undefined}
      {...rest}
    />
  )
}

export default Input
