## Purpose

TBD: synced from change-to-vue3-version.

## Requirements


### Requirement: Vue 3 Composition API 组件

组件 SHALL 使用 Vue 3 Composition API 和 `<script setup lang="ts">` 语法实现，保持与原 Vue 2 版本相同的 props、events 和 slots 接口。

#### Scenario: 组件使用 script setup 语法

- **WHEN** 用户导入 `VueTreeList` 组件
- **THEN** 组件 SHALL 使用 `<script setup lang="ts">` 定义，导出类型安全的 props 接口

#### Scenario: Props 接口保持不变

- **WHEN** 用户传入 `model`、`defaultLeafNodeName`、`defaultTreeNodeName`、`defaultAddTreeNodeTitle`、`defaultAddLeafNodeTitle`、`defaultExpanded` props
- **THEN** 组件 SHALL 接受所有上述 props，类型和默认值与 Vue 2 版本一致

### Requirement: 使用 provide/inject 替代事件冒泡

组件 SHALL 使用 Vue 3 的 `provide/inject` 机制代替 `this.rootNode.$emit()` 进行跨层级事件通信。

#### Scenario: 根组件提供事件回调

- **WHEN** `VueTreeList` 作为根节点渲染（`model.name === 'root'`）
- **THEN** 组件 SHALL 通过 `provide` 注入一个 emit 函数供子组件使用

#### Scenario: 子组件触发事件

- **WHEN** 子节点执行 delete、change-name、click、drop、add-node 等操作
- **THEN** 子组件 SHALL 通过 `inject` 获取根组件提供的 emit 函数并调用，事件名和 payload 格式与 Vue 2 版本一致

### Requirement: 递归组件引用

组件 SHALL 使用 Vue 3 SFC 的文件名自引用机制实现递归渲染，配合 `defineOptions` 设置组件名。

#### Scenario: 递归渲染子节点

- **WHEN** 树节点包含 children 数组
- **THEN** 组件 SHALL 递归渲染自身，无需使用 `beforeCreate` + `require()` hack

### Requirement: Slots 透传

组件 SHALL 支持所有 7 个 scoped slot 的递归透传：`leafNameDisplay`、`addTreeNodeIcon`、`addLeafNodeIcon`、`editNodeIcon`、`delNodeIcon`、`leafNodeIcon`、`treeNodeIcon`。

#### Scenario: 自定义图标 slot

- **WHEN** 用户通过 `#leafNodeIcon` slot 传入自定义图标
- **THEN** 该 slot SHALL 在所有层级的叶子节点上正确渲染，接收 `expanded`、`model`、`root` 作为 slot props

### Requirement: TypeScript 数据模型

`TreeNode` 和 `Tree` 类 SHALL 使用 TypeScript 重写，提供完整的类型定义和导出。

#### Scenario: TreeNode 类型安全

- **WHEN** 用户通过 TypeScript 创建 `new TreeNode({ name: 'test', isLeaf: true })`
- **THEN** 构造函数参数 SHALL 有明确的类型约束，实例属性（`id`、`name`、`parent`、`children`、`isLeaf`）SHALL 有正确的类型标注

#### Scenario: 类型导出

- **WHEN** 用户从 `vue-tree-list` 导入类型
- **THEN** SHALL 能导入 `TreeNode`、`Tree`、`TreeNodeData` 等类型定义

### Requirement: 工具函数现代化

`tools.ts` SHALL 移除 IE 兼容代码，仅使用标准 DOM API。

#### Scenario: 事件监听简化

- **WHEN** 组件需要添加/移除 DOM 事件监听器
- **THEN** SHALL 直接使用 `addEventListener` / `removeEventListener`，不再包含 `attachEvent` 或 `element['on' + type]` 回退

### Requirement: Vue 3 插件安装

入口文件 SHALL 提供 Vue 3 兼容的 `install` 方法，使用 `app.component()` 注册全局组件。

#### Scenario: 全局注册

- **WHEN** 用户调用 `app.use(VueTreeList)`
- **THEN** SHALL 通过 `app.component()` 注册组件，而非 Vue 2 的 `Vue.component()`
