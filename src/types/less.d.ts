// 为 Less 文件提供类型声明
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

// 支持 CSS 模块
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}
