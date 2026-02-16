## 1. 项目基础设施

- [x] 1.1 初始化 Vite + Vue 3 + TypeScript 项目配置：创建 `vite.config.ts`，配置 library mode 输出 ESM + UMD 格式，Vue 标记为 external
- [x] 1.2 创建 `tsconfig.json`，配置 Vue 3 + TypeScript 编译选项和类型声明生成
- [x] 1.3 更新 `package.json`：替换依赖（vue@3、vite、vitest、@vue/test-utils@2、happy-dom、vue-tsc 等），更新 scripts（dev、build、test），配置 main/module/types/exports 入口
- [x] 1.4 移除旧的构建配置文件：`vue.config.js`、`babel.config.js`、`.eslintrc`（或替换为 eslint flat config）
- [x] 1.5 创建 `index.html` 作为 Vite dev server 入口，引用 `dev/index.ts`

## 2. 核心数据模型 TypeScript 化

- [x] 2.1 将 `src/Tree.js` 重写为 `src/Tree.ts`：为 `TreeNode` 和 `Tree` 类添加完整的类型标注，定义 `TreeNodeData` 接口
- [x] 2.2 将 `src/tools.js` 重写为 `src/tools.ts`：简化 DOM 事件函数（移除 IE 兼容），添加类型标注

## 3. Vue 3 组件迁移

- [x] 3.1 将 `src/VueTreeList.vue` 迁移为 `<script setup lang="ts">` 语法：定义 props（`defineProps`）、emits（`defineEmits`）、使用 `defineOptions` 设置组件名
- [x] 3.2 实现 provide/inject 事件机制：根组件 provide emit 函数，子组件 inject 后调用，替代 `this.rootNode.$emit()`
- [x] 3.3 实现 Vue 3 递归组件引用：移除 `beforeCreate` + `require()` hack，使用 SFC 文件名自引用
- [x] 3.4 迁移生命周期：`beforeDestroy` → `onBeforeUnmount`
- [x] 3.5 迁移模板中的 ref 访问：`this.$refs.nodeInput` → `ref()` + template ref
- [x] 3.6 确保 7 个 scoped slot 在递归组件中正确透传（使用 `useSlots()`）

## 4. 入口文件

- [x] 4.1 将 `src/index.js` 重写为 `src/index.ts`：使用 `app.component()` 实现 Vue 3 插件 install，导出类型定义

## 5. 开发环境

- [x] 5.1 将 `dev/index.js` 迁移为 `dev/index.ts`：使用 `createApp` 替代 `new Vue`
- [x] 5.2 将 `dev/App.vue` 迁移为 Vue 3 + TypeScript 语法

## 6. 测试迁移

- [x] 6.1 配置 Vitest：在 `vite.config.ts` 中添加 test 配置，使用 `happy-dom` 环境
- [x] 6.2 迁移 `tests/unit/render.spec.js` → `.ts`，适配 `@vue/test-utils@2.x` API
- [x] 6.3 迁移 `tests/unit/operation.spec.js` → `.ts`
- [x] 6.4 迁移 `tests/unit/drag.spec.js` → `.ts`
- [x] 6.5 迁移 `tests/unit/slot.spec.js` → `.ts`
- [x] 6.6 运行所有测试并确保全部通过

## 7. 验证

- [x] 7.1 执行 `npm run build`，确认 dist 输出 ESM + UMD 文件和类型声明
- [ ] 7.2 执行 `npm run dev`，确认开发服务器正常启动，演示应用功能正常
- [x] 7.3 执行 `npm run test`，确认所有测试通过
