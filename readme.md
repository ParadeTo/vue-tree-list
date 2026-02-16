[![Actions Status](https://github.com/ParadeTo/vue-tree-list/workflows/Test/badge.svg)](https://github.com/ParadeTo/vue-tree-list/actions)

# vue-tree-list

A vue component for tree structure. Support adding treenode/leafnode, editing node's name and dragging.

> ⚠️ Version compatibility notice
>
> - `vue-tree-list@2.0.0` (and all `2.x`) is **Vue 3 only**.
> - If your project is still on Vue 2, please install `vue-tree-list@1`.

## Migration from Vue 2 to Vue 3

- Install the Vue 3 line: `npm install vue-tree-list@^2`.
- Global registration changes from `Vue.use(...)` to `app.use(install)` (or `app.component('VueTreeList', VueTreeList)`).
- `model` should pass the root node: `new Tree(data).root`.
- Replace old slot syntax like `slot="..."` with `v-slot` templates.
- `2.x` includes `end-edit` event for edit completion; keep `change-name` for name-change flow.

![vue-tree-demo.gif](https://raw.githubusercontent.com/ParadeTo/vue-tree-list/master/img/demo.gif)

[Live Demo](http://paradeto.com/vue-tree-list/)

# install

Install the plugin then you can use the component globally.

For Vue 3 projects:

`npm install vue-tree-list@^2`

```js
import { createApp } from 'vue'
import App from './App.vue'
import { VueTreeList, install } from 'vue-tree-list'

const app = createApp(App)

// register globally as a plugin
app.use(install)

// or register component manually
app.component('VueTreeList', VueTreeList)
```

Or just register locally like the example below.

# use

`npm install vue-tree-list`

If you are using Vue 2, use `npm install vue-tree-list@1`.

```html
<template>
  <div>
    <button @click="addNode">Add Node</button>
    <VueTreeList
      @click="onClick"
      @change-name="onChangeName"
      @end-edit="onEndEdit"
      @delete-node="onDel"
      @add-node="onAddNode"
      @drop="onDrop"
      @drop-before="dropBefore"
      @drop-after="dropAfter"
      :model="data"
      default-tree-node-name="new node"
      default-leaf-node-name="new leaf"
      :default-expanded="false"
    >
      <template v-slot:leafNameDisplay="slotProps">
        <span>
          {{ slotProps.model.name }} <span class="muted">#{{ slotProps.model.id }}</span>
        </span>
      </template>
      <template v-slot:addTreeNodeIcon>
        <span class="icon">📂</span>
      </template>
      <template v-slot:addLeafNodeIcon>
        <span class="icon">＋</span>
      </template>
      <template v-slot:editNodeIcon>
        <span class="icon">📃</span>
      </template>
      <template v-slot:delNodeIcon>
        <span class="icon">✂️</span>
      </template>
      <template v-slot:leafNodeIcon>
        <span class="icon">🍃</span>
      </template>
      <template v-slot:treeNodeIcon="slotProps">
        <span class="icon">
          {{
            slotProps.model.children && slotProps.model.children.length > 0 && !slotProps.expanded
              ? '🌲'
              : ''
          }}
        </span>
      </template>
    </VueTreeList>
    <button @click="getNewTree">Get new tree</button>
    <pre>
      {{ newTree }}
    </pre>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { VueTreeList, Tree, TreeNode } from 'vue-tree-list'
  import type { TreeNodeData } from 'vue-tree-list'

  const newTree = ref<Record<string, unknown>>({})
  const data = ref(
    new Tree([
      {
        name: 'Node 1',
        id: 1,
        pid: 0,
        dragDisabled: true,
        addTreeNodeDisabled: true,
        addLeafNodeDisabled: true,
        editNodeDisabled: true,
        delNodeDisabled: true,
        children: [
          {
            name: 'Node 1-2',
            id: 2,
            isLeaf: true,
            pid: 1
          }
        ]
      },
      {
        name: 'Node 2',
        id: 3,
        pid: 0,
        disabled: true
      },
      {
        name: 'Node 3',
        id: 4,
        pid: 0
      }
    ]).root
  )

  function onDel(node: TreeNode) {
    console.log('onDel', node)
    node.remove()
  }

  function onEndEdit(params: Record<string, unknown>) {
    console.log('onEndEdit', params)
  }

  function onChangeName(params: Record<string, unknown>) {
    console.log('onChangeName', params)
  }

  function onAddNode(params: TreeNode) {
    console.log('onAddNode', params)
  }

  function onClick(params: Record<string, unknown>) {
    console.log('onClick', params)
  }

  function onDrop({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop', node, src, target)
  }

  function dropBefore({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop-before', node, src, target)
  }

  function dropAfter({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop-after', node, src, target)
  }

  function addNode() {
    const node = new TreeNode({ name: 'new node', isLeaf: false })
    if (!data.value.children) data.value.children = []
    data.value.addChildren(node)
  }

  function getNewTree() {
    function _dfs(oldNode: TreeNode): Record<string, unknown> {
      const newNode: Record<string, unknown> = {}

      for (const k in oldNode) {
        if (k !== 'children' && k !== 'parent') {
          newNode[k] = (oldNode as TreeNodeData)[k]
        }
      }

      if (oldNode.children && oldNode.children.length > 0) {
        newNode.children = []
        for (let i = 0, len = oldNode.children.length; i < len; i++) {
          ;(newNode.children as Record<string, unknown>[]).push(_dfs(oldNode.children[i]))
        }
      }
      return newNode
    }

    newTree.value = _dfs(data.value)
  }
</script>

<style lang="less" rel="stylesheet/less">
  .vtl {
    .vtl-drag-disabled {
      background-color: #d0cfcf;
      &:hover {
        background-color: #d0cfcf;
      }
    }
    .vtl-disabled {
      background-color: #d0cfcf;
    }
  }
</style>

<style lang="less" rel="stylesheet/less" scoped>
  .icon {
    &:hover {
      cursor: pointer;
    }
  }

  .muted {
    color: gray;
    font-size: 80%;
  }
</style>
```

# props

## props of vue-tree-list

|          name          |   type   |    default    |                                         description                                         |
| :--------------------: | :------: | :-----------: | :-----------------------------------------------------------------------------------------: |
|         model          | TreeNode |       -       |                 Use `new Tree([]).root` to pass the root node (`TreeNode`)                 |
| default-tree-node-name |  string  |   Tree Node   |                                Default name for new treenode                                |
| default-leaf-node-name |  string  |   Leaf Node   |                                Default name for new leafnode                                |
|    default-expanded    | boolean  |     true      |                                   Tree is expanded or not                                   |

## props of TreeNode

### attributes

|        name         |      type      |      default      |           description            |
| :-----------------: | :------------: | :---------------: | :------------------------------: |
|         id          | string, number | current timestamp |          The node's id           |
|       isLeaf        |    boolean     |       false       |     The node is leaf or not      |
|    dragDisabled     |    boolean     |       false       |    Forbid dragging tree node     |
| addTreeNodeDisabled |    boolean     |       false       | Show `addTreeNode` button or not |
| addLeafNodeDisabled |    boolean     |       false       | Show `addLeafNode` button or not |
|  editNodeDisabled   |    boolean     |       false       |  Show `editNode` button or not   |
|   delNodeDisabled   |    boolean     |       false       |   Show `delNode` button or not   |
|      children       |     array      |       null        |       The children of node       |

### methods

|     name     |         params          |          description          |
| :----------: | :---------------------: | :---------------------------: |
|  changeName  |          name           |      Change node's name       |
| addChildren  | children: object, array |     Add children to node      |
|    remove    |            -            |   Remove node from the tree   |
|   moveInto   |    target: TreeNode     |  Move node into another node  |
| insertBefore |    target: TreeNode     | Move node before another node |
| insertAfter  |    target: TreeNode     | Move node after another node  |

# events

|    name     |            params            |                                                                           description                                                                           |
| :---------: | :--------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    click    |           TreeNode           |                                Trigger when clicking a tree node. You can call `toggle` of `TreeNode` to toggle the folder node.                                |
| change-name | {'id', 'oldName', 'newName', 'node?', 'eventType?'} |                                              Trigger while changing a node's name (input/blur)                                              |
|  end-edit   | {'id', 'oldName', 'newName'} |                                                           Trigger when node name edit ends (blur/enter)                                                           |
| delete-node |           TreeNode           |                                 Trigger when clicking `delNode` button. You can call `remove` of `TreeNode` to remove the node.                                 |
|  add-node   |           TreeNode           |                                                                 Trigger after adding a new node                                                                 |
|    drop     |     {node, src, target}      |   Trigger after dropping a node into another. node: the draggable node, src: the draggable node's parent, target: the node that draggable node will drop into   |
| drop-before |     {node, src, target}      | Trigger after dropping a node before another. node: the draggable node, src: the draggable node's parent, target: the node that draggable node will drop before |
| drop-after  |     {node, src, target}      |  Trigger after dropping a node after another. node: the draggable node, src: the draggable node's parent, target: the node that draggable node will drop after  |

# customize operation icons

The component has default icons for `addTreeNodeIcon`, `addLeafNodeIcon`, `editNodeIcon`, `delNodeIcon`, `leafNodeIcon`, `treeNodeIcon` button, but you can also customize them and can access `model`, `root`, `expanded` as below:

```html
<template v-slot:leafNameDisplay="slotProps">
  <span>{{ slotProps.model.name }} #{{ slotProps.model.id }}</span>
</template>
<template v-slot:addTreeNodeIcon="slotProps">
  <span class="icon">📂</span>
</template>
<template v-slot:addLeafNodeIcon="slotProps">
  <span class="icon">＋</span>
</template>
<template v-slot:editNodeIcon="slotProps">
  <span class="icon">📃</span>
</template>
<template v-slot:delNodeIcon="slotProps">
  <span class="icon">✂️</span>
</template>
<template v-slot:leafNodeIcon="slotProps">
  <span class="icon">🍃</span>
</template>
<template v-slot:treeNodeIcon="slotProps">
  <span class="icon">
    {{ (slotProps.model.children && slotProps.model.children.length > 0 && !slotProps.expanded) ?
    '🌲' : '' }}</span
  >
</template>
```
