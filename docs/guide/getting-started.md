# 快速开始

本指南将帮助您快速上手 FluentUI Plus 组件库。

## 安装

首先，安装 FluentUI Plus 及其依赖：

```bash
npm install fluentui-plus @fluentui/react-components react react-dom
```

或使用 yarn：

```bash
yarn add fluentui-plus @fluentui/react-components react react-dom
```

## 引入组件

### 全量引入

```jsx
import { Button, Input, Table, DatePicker } from 'fluentui-plus'
```

### 按需引入

为了减小打包体积，推荐按需引入：

```jsx
import Button from 'fluentui-plus/lib/Button'
import Input from 'fluentui-plus/lib/Input'
```

## 基础使用

```jsx
import React from 'react'
import { Button, Input } from 'fluentui-plus'

function App() {
  return (
    <div>
      <Button type="primary" onClick={() => console.log('clicked')}>
        主要按钮
      </Button>
      <Input placeholder="请输入内容" />
    </div>
  )
}

export default App
```

## 样式定制

FluentUI Plus 支持通过 CSS 变量和 className 进行样式定制：

```css
.fluentui-plus-button {
  border-radius: 8px;
}

.custom-button {
  background-color: #ff6b6b;
}
```

```jsx
<Button className="custom-button">自定义样式按钮</Button>
```
