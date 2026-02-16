<template>
  <div>
    <button @click="addNode">Add Node</button>
    <button @click="getTreeChange">Get tree change</button>
    <VueTreeList
      @click="onClick"
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
          }}</span
        >
      </template>
    </VueTreeList>
    <button @click="getNewTree">Get new tree</button>
    <p>isMobile: {{ isMobile }}</p>
    <pre>
      {{ record }}
    </pre>
    <pre>
      {{ newTree }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueTreeList, Tree, TreeNode } from '../src'

function detectMobile(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()

  const isIpad = /ipad/i.test(userAgent)
  const isIphoneOs = /iphone os/i.test(userAgent)
  const isMidp = /midp/i.test(userAgent)
  const isUc7 = /rv:1.2.3.4/i.test(userAgent)
  const isUc = /ucweb/i.test(userAgent)
  const isAndroid = /android/i.test(userAgent)
  const isCE = /windows ce/i.test(userAgent)
  const isWM = /windows mobile/i.test(userAgent)
  const isWx = /MicroMessenger/i.test(userAgent)

  return isIpad || isIphoneOs || isMidp || isUc7 || isUc || isAndroid || isCE || isWM || isWx
}

function getTreeSnapshot(oldNode: TreeNode): Record<string, unknown> {
  const newNode: Record<string, unknown> = {}

  for (const k in oldNode) {
    if (k !== 'children' && k !== 'parent') {
      newNode[k] = (oldNode as Record<string, unknown>)[k]
    }
  }

  if (oldNode.children && oldNode.children.length > 0) {
    newNode.children = []
    for (let i = 0, len = oldNode.children.length; i < len; i++) {
      ;(newNode.children as Record<string, unknown>[]).push(getTreeSnapshot(oldNode.children[i]))
    }
  }

  return newNode
}

const isMobileValue = detectMobile()
const isMobile = ref(isMobileValue)
const record = ref<Record<string, unknown> | null>(null)
const newTree = ref<Record<string, unknown>>({})
const data = ref(
  new Tree([
    {
      name: 'Node 1',
      id: 1,
      pid: 0,
      dragDisabled: true,
      children: [
        {
          name: 'Node 1-2',
          id: 2,
          isLeaf: true,
          pid: 1,
        },
      ],
    },
    {
      name: 'Node 2',
      id: 3,
      pid: 0,
      disabled: true,
    },
    {
      name: 'Node 3',
      id: 4,
      pid: 0,
    },
  ]).root,
)

function getTreeChange() {
  record.value = getTreeSnapshot(data.value)
}

function addNode() {
  const node = new TreeNode({ name: 'new node', isLeaf: false })
  if (!data.value.children) data.value.children = []
  data.value.addChildren(node)
}

function getNewTree() {
  newTree.value = getTreeSnapshot(data.value)
}

function onClick(model: Record<string, unknown>) {
  console.log(model)
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
