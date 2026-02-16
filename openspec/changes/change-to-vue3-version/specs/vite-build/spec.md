## ADDED Requirements

### Requirement: Vite Library Mode 构建

项目 SHALL 使用 Vite 的 library mode 构建组件库，输出 ESM 和 UMD 双格式。

#### Scenario: ESM 格式输出

- **WHEN** 执行 `npm run build`
- **THEN** SHALL 在 `dist/` 目录生成 ES module 格式文件，可供现代打包工具 tree-shaking

#### Scenario: UMD 格式输出

- **WHEN** 执行 `npm run build`
- **THEN** SHALL 在 `dist/` 目录生成 UMD 格式文件，支持 CDN / `<script>` 标签直接使用，全局变量名为 `VueTreeList`

#### Scenario: Vue 作为外部依赖

- **WHEN** 构建组件库
- **THEN** Vue SHALL 被标记为 external 依赖，不打包进产物

### Requirement: package.json 多格式入口

`package.json` SHALL 配置正确的入口字段，支持不同使用场景。

#### Scenario: 入口字段配置

- **WHEN** 使用者通过 `import` 或 `require` 引入组件
- **THEN** `package.json` SHALL 包含 `main`（UMD）、`module`（ESM）、`types`（类型声明）和 `exports` 字段

### Requirement: TypeScript 编译配置

项目 SHALL 包含 `tsconfig.json`，配置 Vue 3 + TypeScript 的编译选项。

#### Scenario: 类型声明生成

- **WHEN** 执行构建
- **THEN** SHALL 生成 `.d.ts` 类型声明文件，供下游 TypeScript 项目使用

### Requirement: Vite 开发服务器

项目 SHALL 使用 Vite dev server 提供开发环境，支持 HMR。

#### Scenario: 开发启动

- **WHEN** 执行 `npm run dev`
- **THEN** SHALL 启动 Vite dev server，加载 `dev/` 目录下的演示应用，支持热模块替换

### Requirement: Vitest 测试集成

项目 SHALL 使用 Vitest 作为测试框架，替代 Jest。

#### Scenario: 运行测试

- **WHEN** 执行 `npm run test`
- **THEN** SHALL 使用 Vitest 运行 `tests/` 目录下的所有测试文件

#### Scenario: 测试环境

- **WHEN** 测试涉及 DOM 操作
- **THEN** SHALL 使用 `happy-dom` 作为测试环境，配合 `@vue/test-utils@2.x` 挂载 Vue 3 组件
