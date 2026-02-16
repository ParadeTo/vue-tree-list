## Why

当前 `vue-tree-list` 项目基于 Vue 2 + vue-cli-service + Babel + JavaScript 构建，技术栈已过时。Vue 2 已进入维护模式，不再接收新特性。迁移到 **Vite + Vue 3 + TypeScript** 可以获得更好的开发体验、更快的构建速度、完善的类型安全，以及与 Vue 3 生态系统的全面兼容。

## What Changes

- **构建工具**: 从 `@vue/cli-service` (Webpack) 迁移到 **Vite**，使用 `vite-plugin-vue` 进行 SFC 编译，使用 library mode 输出组件库
- **框架版本**: 从 **Vue 2** 升级到 **Vue 3**
  - Options API → Composition API (`setup` / `<script setup>`)
  - `beforeDestroy` → `onBeforeUnmount`
  - 全局 `Vue.component` 插件安装 → `app.component` 方式
  - Slot 语法适配 Vue 3
- **语言**: 从 **JavaScript** 迁移到 **TypeScript**
  - `Tree.js` → `Tree.ts`（添加类型定义）
  - `tools.js` → `tools.ts`
  - `VueTreeList.vue` → 使用 `<script setup lang="ts">`
  - `index.js` → `index.ts`
- **样式**: Less → 保留 Less 或转为原生 CSS（Vite 原生支持 Less）
- **测试**: 从 Jest + `@vue/test-utils@1.x` 迁移到 Vitest + `@vue/test-utils@2.x`
- **开发环境**: `dev/` 目录的开发应用同步升级为 Vue 3
- **依赖清理**: 移除 `babel-eslint`、`core-js`、`vue-template-compiler` 等 Vue 2 专属依赖
- **BREAKING**: 不再支持 Vue 2，用户需在 Vue 3 项目中使用

## Capabilities

### New Capabilities

- `vue3-component`: Vue 3 组件实现，使用 Composition API 和 TypeScript，包含完整的类型导出
- `vite-build`: Vite library mode 构建配置，输出 ESM 和 UMD 格式

### Modified Capabilities

_(无已有 spec 需要修改)_

## Impact

- **源码**: `src/` 下所有 4 个文件需要重写（`Tree.js`、`VueTreeList.vue`、`tools.js`、`index.js`）
- **构建配置**: `package.json`、`vue.config.js` 替换为 `vite.config.ts`、`tsconfig.json`
- **开发环境**: `dev/` 下 2 个文件需要适配 Vue 3
- **测试**: `tests/unit/` 下 4 个测试文件需要适配 Vue 3 + Vitest
- **依赖**: 全量替换 devDependencies（约 15+ 个包变更）
- **产出物**: `dist/` 输出格式从 `vue-tree-list.umd.min.js` 变为 ESM + UMD 双格式
- **Breaking Change**: 下游用户必须使用 Vue 3
