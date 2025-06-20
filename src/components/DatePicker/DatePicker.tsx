import React from 'react'

export interface DatePickerProps {
  /** 选中的日期 */
  value?: Date
  /** 默认日期 */
  defaultValue?: Date
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 日期格式 */
  format?: string
  /** 日期变化回调 */
  onChange?: (date: Date | null) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  defaultValue,
  placeholder = '请选择日期',
  disabled = false,
  format = 'YYYY-MM-DD',
  onChange,
  className,
  style,
}) => {
  // 这里是一个简单的日期选择器实现示例
  // 实际项目中会基于 Fluent UI 日期选择器组件进行封装
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null
    onChange?.(date)
  }

  const formatValue = (date: Date | undefined) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <input
      type="date"
      value={formatValue(value || defaultValue)}
      placeholder={placeholder}
      disabled={disabled}
      onChange={handleChange}
      className={`fluentui-plus-datepicker ${className || ''}`}
      style={style}
    />
  )
}

export default DatePicker
