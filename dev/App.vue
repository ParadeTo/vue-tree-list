<template>
  <div>
    <button @click="addNode">Add Node</button>
    <VueTreeList
      @click="onClick"
      @change-name="onChangeName"
      @end-edit="onEndEdit"
      @delete-node="onDeleteNode"
      @add-node="onAddNode"
      @drop="onDrop"
      @drop-before="onDropBefore"
      @drop-after="onDropAfter"
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
import { VueTreeList, Tree, TreeNode } from '../src'
  import type { TreeNodeData } from '../src'

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

  function nodeLabel(node: TreeNode | null): string {
    if (!node) return 'null'
    return `#${String(node.id)} ${node.name}`
  }

  function onDeleteNode(node: TreeNode) {
    console.log('delete-node', nodeLabel(node), node)
    node.remove()
  }

  function onEndEdit(payload: { id: number | string; oldName: string; newName: string }) {
    console.log('end-edit', payload)
  }

  function onChangeName(payload: {
    id: number | string
    oldName: string
    newName: string
    eventType?: string
  }) {
    console.log('change-name', payload)
  }

  function onAddNode(node: TreeNode) {
    console.log('add-node', nodeLabel(node), node)
  }

  function onClick(model: Record<string, unknown>) {
    console.log('click', model)
  }

  function onDrop({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop', nodeLabel(node), nodeLabel(src), nodeLabel(target), { node, src, target })
  }

  function onDropBefore({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop-before', nodeLabel(node), nodeLabel(src), nodeLabel(target), { node, src, target })
  }

  function onDropAfter({ node, src, target }: { node: TreeNode; src: TreeNode | null; target: TreeNode }) {
    console.log('drop-after', nodeLabel(node), nodeLabel(src), nodeLabel(target), { node, src, target })
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