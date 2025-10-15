# Changelog

本文档记录了项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [2.3.0](https://github.com/HuiruDong/fluentui-plus/compare/v2.2.0...v2.3.0) (2025-10-15)

### Added

- **Checkbox:** add Checkbox component with Group support ([5b2509a](https://github.com/HuiruDong/fluentui-plus/commit/5b2509a6e703043b071c7021cb1806268c6fffe5))
- **modal:** add Modal component with static methods and comprehensive demo ([6aaadd3](https://github.com/HuiruDong/fluentui-plus/commit/6aaadd3aed5b322ba1e29611db9e9e7ad23e7436))

### Fixed

- **modal:** improve layout handling and scrolling behavior ([049e097](https://github.com/HuiruDong/fluentui-plus/commit/049e097cd3708ecbfac858186bcc7e20feb148eb))

### Changed

- **api:** add comprehensive API documentation for Cascader, Checkbox and Modal components ([cff94c3](https://github.com/HuiruDong/fluentui-plus/commit/cff94c38409f451e42965b461d262738531afac6))
- **Cascader:** remove commented CSS code ([b88cdd2](https://github.com/HuiruDong/fluentui-plus/commit/b88cdd2b7f221e607ed6266f35dbfde838f4ef6b))
- **demo:** extract common styles into reusable hooks ([12da5fd](https://github.com/HuiruDong/fluentui-plus/commit/12da5fd2b9381545d980a5b89ff4af41d708afd7))
- **Select:** implement React Context to eliminate prop drilling ([db713c0](https://github.com/HuiruDong/fluentui-plus/commit/db713c0d1cacec8016284e67a818af0d308ad18c))

## [2.2.0](https://github.com/HuiruDong/fluentui-plus/compare/v2.1.0...v2.2.0) (2025-09-22)

### Added

- **cascader:** add Cascader component for hierarchical data selection ([f7aa6de](https://github.com/HuiruDong/fluentui-plus/commit/f7aa6de3c61caecc3b9b247da9ac67b7f3c78b3d))
- **cascader:** add CascaderEmpty component for empty state display ([5c0e11a](https://github.com/HuiruDong/fluentui-plus/commit/5c0e11a7ea7a023c0548e992787d7dfdae2fe58d))
- **cascader:** add multiple selection support ([4d627e9](https://github.com/HuiruDong/fluentui-plus/commit/4d627e944f4dc749008aa75d3161690ce7a857cf))
- **cascader:** enhance search functionality with changeOnSelect support ([a71e17c](https://github.com/HuiruDong/fluentui-plus/commit/a71e17c7ddcd272d988e672a1d8f49c1b73cc1d2))
- **select:** add labelRender prop to customize selected option display ([6bd2a0c](https://github.com/HuiruDong/fluentui-plus/commit/6bd2a0cd448fc8883dc247e512b164aa1c13f60b))

### Fixed

- **cascader:** fix expandTrigger hover behavior for leaf nodes ([f6a6f14](https://github.com/HuiruDong/fluentui-plus/commit/f6a6f142dc438942ded4593a8471ba9be673d60c))
- **cascader:** implement search blur behavior and floating position width calculation ([f188b07](https://github.com/HuiruDong/fluentui-plus/commit/f188b07b2709908026bb6349cf0de6253e80f400))

### Changed

- **Cascader:** add comprehensive Storybook stories and examples ([2dfeacc](https://github.com/HuiruDong/fluentui-plus/commit/2dfeacc464005bd59328af1e1b3f2e630e41122b))
- **cascader:** replace custom SVG arrow with FluentUI ChevronRightFilled icon ([c328fc1](https://github.com/HuiruDong/fluentui-plus/commit/c328fc1423b61209abafd625e3303ca9bb88a2b7))
- **cascader:** restructure utility functions into modular architecture ([3011c10](https://github.com/HuiruDong/fluentui-plus/commit/3011c10a143241ca9937324fa8f6686bd8dddb78))
- **cascader:** split useCascader hook into specialized sub-hooks ([0bed32d](https://github.com/HuiruDong/fluentui-plus/commit/0bed32de2b0d2b1f846536f817fa5d4ecb6fb4b5))
- optimize eslint config and remove redundant lint suppressions in tests ([93794a5](https://github.com/HuiruDong/fluentui-plus/commit/93794a583f3120b9362b4e12b934925816e94e73))
- **Select:** enhance API documentation and Storybook examples ([b23269c](https://github.com/HuiruDong/fluentui-plus/commit/b23269ce84fc8289fc292912dc120809d32a892d))

## [2.1.0](https://github.com/HuiruDong/fluentui-plus/compare/v2.0.0...v2.1.0) (2025-09-09)

### Fixed

- fix mixins error ([0694f46](https://github.com/HuiruDong/fluentui-plus/commit/0694f4651942b19f3e99f9a2f3094ee82eb9adb3))

### Added

- add demo pages with React Router navigation ([6c3c6e7](https://github.com/HuiruDong/fluentui-plus/commit/6c3c6e76e5663a4be188778d4b771237f083af91))
- **Select:** add clear functionality with allowClear prop ([1a918b4](https://github.com/HuiruDong/fluentui-plus/commit/1a918b4305f5800dd5b5e0629bd9ff994f75a59e))
- **Select:** add option group support ([7f1e95a](https://github.com/HuiruDong/fluentui-plus/commit/7f1e95ac38b5c5c27769187724c47d88c897b618))
- **Select:** migrate to @floating-ui/react and improve positioning system ([1f8215e](https://github.com/HuiruDong/fluentui-plus/commit/1f8215e88d81670d9e0bd100dddf125379c62ab0))

### Changed

- enhance API documentation ([f09d7fb](https://github.com/HuiruDong/fluentui-plus/commit/f09d7fbf62ea50e4456992aa47b0e602ff8de2f9))

## [2.0.0](https://github.com/HuiruDong/fluentui-plus/compare/v1.0.0...v2.0.0) (2025-08-04)

### Added

- update prefixCls ([7f7db7e](https://github.com/HuiruDong/fluentui-plus/commit/7f7db7ec3cb78bfe3e7089ad8a346500d946a5c7))

## [1.0.0](https://github.com/HuiruDong/fluentui-plus/compare/v0.3.0...v1.0.0) (2025-08-01)

### Changed

- add global mixins ([a0afe49](https://github.com/HuiruDong/fluentui-plus/commit/a0afe4907691487e86816ab3a49deb1b56e0069c))
- **hooks:** refactor hooks ([f679f96](https://github.com/HuiruDong/fluentui-plus/commit/f679f961d461f9a268e5cfd1472bde20c0d2059a))
- **select:** refactor select component hooks ([82538a1](https://github.com/HuiruDong/fluentui-plus/commit/82538a1feecb468350a4feb3e8a087ed17f44e7c))

### Added

- add Select docs ([ec5017c](https://github.com/HuiruDong/fluentui-plus/commit/ec5017cc3b00ba6eead25e36a15969a00485e59d))
- **select:** Add search function ([39d7841](https://github.com/HuiruDong/fluentui-plus/commit/39d78416cb6eef02664b0a81c224252cd6ca0312))
- **select:** add select component ([77242b5](https://github.com/HuiruDong/fluentui-plus/commit/77242b55c88201e0889783f7728b0f8081bbd57b))
- **select:** support customer render option ([1617b30](https://github.com/HuiruDong/fluentui-plus/commit/1617b30d819833a1edae21a1146ae58c9f6181d2))

## [0.3.0](https://github.com/HuiruDong/fluentui-plus/compare/v0.2.0...v0.3.0) (2025-07-11)

## [0.2.0](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.7...v0.2.0) (2025-07-10)

### Added

- Add InputTag component ([04113d0](https://github.com/HuiruDong/fluentui-plus/commit/04113d05d94989c84a80b8281e2a76f15d7e0cd0))
- **nav:** add Nav component ([494e009](https://github.com/HuiruDong/fluentui-plus/commit/494e00967ad7b1b2e1312eb1c4c9b81a7af51118))

### Fixed

- **nav:** fix findParentKeys logic and reverse keyPath order ([7eea54f](https://github.com/HuiruDong/fluentui-plus/commit/7eea54fa7abbdeda7e07d2e3d85d34d774bd4f57))

### Changed

- Add InputTag component story ([c1c0693](https://github.com/HuiruDong/fluentui-plus/commit/c1c0693a9e70ede2e0721c0fbee43b4aaff62335))
- **nav:** add nav story ([59c8c92](https://github.com/HuiruDong/fluentui-plus/commit/59c8c92a4737a1a79266cd1d2e4c37be03b6d4cf))
- update docs ([55c7f19](https://github.com/HuiruDong/fluentui-plus/commit/55c7f19f50d7b35b39c6b4b25476745b0814fbcd))
- update README ([f62f7d7](https://github.com/HuiruDong/fluentui-plus/commit/f62f7d7f1b2f4556fa91704224646eccc1775fc0))

### [0.1.7](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.6...v0.1.7) (2025-07-04)

### [0.1.6](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.5...v0.1.6) (2025-07-04)

### [0.1.5](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.4...v0.1.5) (2025-07-04)

### Changed

- Update package name example ([3995d28](https://github.com/HuiruDong/fluentui-plus/commit/3995d28139577c477cea842cc9daca77664204a7))
- Update prettier config ([47b53e1](https://github.com/HuiruDong/fluentui-plus/commit/47b53e17152684cfcd47925570ab433628796740))
- update README ([9dc2cb3](https://github.com/HuiruDong/fluentui-plus/commit/9dc2cb3e81f1934a1a980b96d9be3f50894f835d))

### [0.1.4](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.3...v0.1.4) (2025-07-03)

### [0.1.3](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.2...v0.1.3) (2025-07-03)

### Changed

- Update component format
  ([e3b4a7c](https://github.com/HuiruDong/fluentui-plus/commit/e3b4a7c1780152fad6012e562cc5d6c714f25e4b))

### [0.1.2](https://github.com/HuiruDong/fluentui-plus/compare/v0.1.1...v0.1.2) (2025-07-03)

### Fixed

- Add realease.yml
  ([63d6b2e](https://github.com/HuiruDong/fluentui-plus/commit/63d6b2e0a4bb817eadf922ae43e18e4ac7237030))

### 0.1.1 (2025-07-03)

### Added

- Add demo page
  ([66e84c4](https://github.com/HuiruDong/fluentui-plus/commit/66e84c49ce28556dde21c01ee32a7389f04bfc22))
- Update Tag component export
  ([09420aa](https://github.com/HuiruDong/fluentui-plus/commit/09420aab96c6daf0a7edc7a5dbc89061b6de5e0b))

### Fixed

- Remove fluent UI v8
  ([3edb164](https://github.com/HuiruDong/fluentui-plus/commit/3edb164bc0de5cad6c03a6934cce5bc189e732f3))
- Unit test
  ([3c6a668](https://github.com/HuiruDong/fluentui-plus/commit/3c6a66864b4a63fe450e89d04a641381887bb409))

### Changed

- Add storybook
  ([ddd08b5](https://github.com/HuiruDong/fluentui-plus/commit/ddd08b578740878fda5cb75911d7df4386ffe735))
- Remove css-in-js, add less
  ([d1d0c86](https://github.com/HuiruDong/fluentui-plus/commit/d1d0c8637e6e4214cdd56bcdf6e2e2e419f721eb))
- Update md location
  ([4020bf4](https://github.com/HuiruDong/fluentui-plus/commit/4020bf49da088084c14d23b632055c205b0f8d38))
- Update RELEASE_GUIDE
  ([b46d58b](https://github.com/HuiruDong/fluentui-plus/commit/b46d58b8b362e036b79603a9d0ba8475ad8383ea))

## [0.1.0](https://github.com/HuiruDong/fluentui-plus/compare/v0.0.0...v0.1.0) (2024-01-01)

### Added

- 初始版本发布
- Tag 组件实现
- 基础组件库框架
- 自动发布流程配置

---

## 版本说明

- **[Unreleased]**: 尚未发布的变更
- **[X.Y.Z]**: 已发布的版本，包含发布日期

## 版本类型

- **Added**: 新增功能
- **Changed**: 现有功能的变更
- **Deprecated**: 即将在未来版本中移除的功能
- **Removed**: 在此版本中移除的功能
- **Fixed**: 修复的问题
- **Security**: 安全相关的修复
