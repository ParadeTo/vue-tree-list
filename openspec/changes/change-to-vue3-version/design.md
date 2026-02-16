## Context

`vue-tree-list` 是一个基于 Vue 2 的树形结构组件库，使用 vue-cli-service (Webpack) 构建，源码为纯 JavaScript。核心包含：

- `Tree.js` — `TreeNode` / `Tree` 数据模型类（169 行）
- `VueTreeList.vue` — 递归树组件，Options API（493 行，含 Less 样式和 icomoon 字体图标）
- `tools.js` — DOM 事件和树遍历工具函数（46 行）
- `index.js` — 入口 + Vue 2 `Vue.component` 插件安装
- `dev/` — 开发演示应用
- `tests/unit/` — 4 个 Jest 测试文件

组件通过 `this.rootNode.$emit()` 沿组件树向上冒泡事件，使用 `beforeCreate` 中 `require()` 实现递归组件引用，依赖 `this.$parent` 获取根节点。

## Goals / Non-Goals

**Goals:**

- 迁移到 Vite 构建，输出 ESM + UMD 双格式
- 全面升级到 Vue 3 Composition API + `<script setup lang="ts">`
- 所有源码转为 TypeScript，导出完整类型定义
- 使用 Vitest + `@vue/test-utils@2.x` 重写测试
- 保持组件行为和 API 不变（props、events、slots）

**Non-Goals:**

- 不重新设计组件的 UI 外观或样式
- 不添加新功能（如虚拟滚动、异步加载）
- 不支持 Vue 2 兼容模式

## Decisions

### 1. Composition API + `<script setup>` vs 保留 Options API

**选择**: Composition API + `<script setup lang="ts">`

**理由**: `<script setup>` 是 Vue 3 推荐的 SFC 语法，提供更好的 TypeScript 类型推断和更少的样板代码。项目规模适中（单组件），一次性迁移成本可控。

### 2. 递归组件引用方式

**选择**: 使用 Vue 3 的命名自引用 + `defineOptions({ name: 'VueTreeList' })` 实现递归

**理由**: Vue 3 SFC 中组件可通过文件名自动递归引用自身，无需 `beforeCreate` + `require()` hack。使用 `defineOptions` 设置组件名。

### 3. 事件通信机制: `this.rootNode.$emit()` → `provide/inject`

**选择**: 使用 `provide/inject` 在根节点注入事件回调，子节点通过 `inject` 调用

**理由**: Vue 3 移除了 `$on/$off/$once`，不再支持组件作为事件总线。`provide/inject` 是 Vue 3 推荐的跨层级通信方式。根组件 `provide` 一个 emit 函数，子组件 `inject` 后直接调用。

### 4. 拖拽状态管理: 模块级变量 `compInOperation`

**选择**: 保留模块级 `let compInOperation` 变量，但加上 TypeScript 类型标注

**理由**: 拖拽操作是跨实例的全局状态，`compInOperation` 在模块作用域中是合理的设计，不需要改为 reactive 或 provide/inject。

### 5. 构建输出格式

**选择**: Vite library mode，输出 `es` + `umd` 双格式

**理由**: ESM 供现代打包工具 tree-shaking，UMD 兼容 CDN / script 标签使用。`package.json` 使用 `module` (ESM) + `main` (UMD) + `exports` 字段。

### 6. 样式处理

**选择**: 保留 Less，Vite 原生支持

**理由**: Vite 内置 Less 支持，无需额外配置。字体文件（icomoon）保持在 `src/fonts/` 不变。

### 7. 测试框架

**选择**: Vitest + `@vue/test-utils@2.x` + `happy-dom`

**理由**: Vitest 与 Vite 共享配置，开箱即用。`happy-dom` 比 `jsdom` 更快，适合组件测试。

### 8. `tools.js` 中的 DOM 事件兼容代码

**选择**: 简化为仅使用 `addEventListener/removeEventListener`

**理由**: `attachEvent` 和 `element['on' + type]` 是 IE 兼容代码，现代浏览器无需支持。

## Risks / Trade-offs

- **Breaking Change** → 在 README 和 CHANGELOG 中明确标注版本要求 Vue 3，发布为新的 major version
- **递归组件 slot 转发** → Vue 3 的 `useSlots()` 确保 slot 透传正确，需要仔细测试 7 个 slot 的递归传递
- **`$parent` 依赖移除** → 使用 `provide/inject` 替代后，需确保多层嵌套深度下依然正确获取根节点引用
- **字体文件路径** → Vite 构建时静态资源路径可能变化，需确认 `@font-face` URL 在 library mode 下正确打包
