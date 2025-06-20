import React from 'react'

export interface TableProps {
  /** 表格数据 */
  dataSource?: any[]
  /** 表格列配置 */
  columns?: any[]
  /** 是否显示加载状态 */
  loading?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

const Table: React.FC<TableProps> = ({
  dataSource = [],
  columns = [],
  loading = false,
  className,
  style,
}) => {
  // 这里是一个简单的表格实现示例
  // 实际项目中会基于 Fluent UI 表格组件进行封装
  return (
    <div className={`fluentui-plus-table ${className || ''}`} style={style}>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{item[col.dataIndex]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Table
