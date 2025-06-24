# Button 按钮

基础的按钮组件，支持多种类型和状态，适用于表单提交、操作触发等场景。

## 基本用法

```jsx
import { Button } from 'fluentui-plus';

export default function Demo() {
  return <Button type="primary">主要按钮</Button>;
}
```

## 按钮类型

| 属性值    | 说明     |
| --------- | -------- |
| primary   | 主要按钮 |
| default   | 默认按钮 |
| dashed    | 虚线按钮 |
| text      | 文本按钮 |
| link      | 链接按钮 |

```jsx
<Button type="primary">主要按钮</Button>
<Button type="default">默认按钮</Button>
<Button type="dashed">虚线按钮</Button>
<Button type="text">文本按钮</Button>
<Button type="link">链接按钮</Button>
```

## 禁用状态

```jsx
<Button type="primary" disabled>禁用按钮</Button>
```

## Props

| 属性      | 说明         | 类型      | 默认值   |
| --------- | ------------ | --------- | -------- |
| type      | 按钮类型     | string    | default  |
| disabled  | 是否禁用     | boolean   | false    |
| onClick   | 点击回调     | function  | -        |

---

你可以参考本文件的结构为其余组件编写文档：
1. 组件简介
2. 基本用法
3. 主要属性/类型说明
4. 代码示例
5. Props 表格
6. 其他说明
