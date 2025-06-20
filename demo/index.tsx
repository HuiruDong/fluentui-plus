import React from 'react'
import ReactDOM from 'react-dom/client'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import { Button, Input, Table, DatePicker } from '../src'

const Demo = () => {
  const [inputValue, setInputValue] = React.useState('')
  
  const tableData = [
    { id: 1, name: '张三', age: 25, city: '北京' },
    { id: 2, name: '李四', age: 30, city: '上海' },
    { id: 3, name: '王五', age: 28, city: '广州' },
  ]
  
  const tableColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '城市', dataIndex: 'city' },
  ]

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>FluentUI Plus 组件演示</h1>
        
        <section style={{ marginBottom: '30px' }}>
          <h2>Button 组件</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <Button type="primary">主要按钮</Button>
            <Button type="secondary">次要按钮</Button>
            <Button type="outline">轮廓按钮</Button>
            <Button type="subtle">微妙按钮</Button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <Button size="small">小号按钮</Button>
            <Button size="medium">中号按钮</Button>
            <Button size="large">大号按钮</Button>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button disabled>禁用按钮</Button>
            <Button loading>加载中</Button>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>Input 组件</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <Input 
              placeholder="请输入内容" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input placeholder="禁用状态" disabled />
            <Input placeholder="只读状态" readOnly value="只读内容" />
          </div>
          <p>当前输入值: {inputValue}</p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>DatePicker 组件</h2>
          <DatePicker 
            placeholder="请选择日期"
            onChange={(date) => console.log('选择的日期:', date)}
          />
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2>Table 组件</h2>
          <Table 
            dataSource={tableData}
            columns={tableColumns}
          />
        </section>
      </div>
    </FluentProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<Demo />)
