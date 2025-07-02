import React from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import type { Decorator } from "@storybook/react";

/**
 * FluentProvider 装饰器，为所有 Stories 提供统一的 Fluent UI 主题
 * 支持浅色主题 (webLightTheme) 和深色主题 (webDarkTheme)
 *
 * 注意：MDX 文档文件会被跳过，不会应用 FluentProvider
 */
export const withFluentProvider: Decorator = (Story, context) => {
  // 检查是否为 MDX 文件，如果是则直接返回 Story 不包裹 FluentProvider
  // 这样可以避免 MDX 文档被不必要的 Provider 包裹
  const isMDXFile =
    context.parameters?.docs?.page || context.title?.includes(".mdx");

  if (isMDXFile) {
    return <Story />;
  }

  // 从 Storybook 全局参数中获取主题，如果没有则使用默认的浅色主题
  const theme = context.globals.theme === "dark" ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={theme}>
      <div style={{ padding: "20px" }}>
        <Story />
      </div>
    </FluentProvider>
  );
};

/**
 * 简化的 FluentProvider 装饰器（无额外样式）
 * 默认使用浅色主题
 */
export const withFluentProviderSimple: Decorator = (Story) => (
  <FluentProvider theme={webLightTheme}>
    <Story />
  </FluentProvider>
);
