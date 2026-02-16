<template>
  <div class="vtl">
    <div
      v-if="model.name !== 'root'"
      :id="String(model.id)"
      class="vtl-node"
      :class="{ 'vtl-leaf-node': model.isLeaf, 'vtl-tree-node': !model.isLeaf }"
    >
      <div
        class="vtl-border vtl-up"
        :class="{ 'vtl-active': isDragEnterUp }"
        @drop="dropBefore"
        @dragenter="dragEnterUp"
        @dragover="dragOverUp"
        @dragleave="dragLeaveUp"
      />
      <div
        :class="treeNodeClass"
        :draggable="!model.dragDisabled"
        @dragstart="dragStart"
        @dragover="dragOver"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="drop"
        @dragend="dragEnd"
        @mouseover="mouseOver"
        @mouseout="mouseOut"
        @click.stop="click"
      >
        <span class="vtl-caret vtl-is-small" v-if="model.children && model.children.length > 0">
          <i class="vtl-icon" :class="caretClass" @click.prevent.stop="toggle"></i>
        </span>

        <span v-if="model.isLeaf">
          <slot name="leafNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
            <i class="vtl-icon vtl-menu-icon vtl-icon-file"></i>
          </slot>
        </span>
        <span v-else>
          <slot name="treeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
            <i class="vtl-icon vtl-menu-icon vtl-icon-folder"></i>
          </slot>
        </span>

        <div class="vtl-node-content" v-if="!editable">
          <slot name="leafNameDisplay" :expanded="expanded" :model="model" :root="rootNode">
            {{ model.name }}
          </slot>
        </div>
        <input
          v-else
          class="vtl-input"
          type="text"
          ref="nodeInput"
          :value="model.name"
          @input="updateName"
          @blur="setUnEditable"
          @keyup.enter="setUnEditable"
        />
        <div class="vtl-operation" v-show="isHover">
          <span
            :title="defaultAddTreeNodeTitle"
            @click.stop.prevent="addChild(false)"
            v-if="!model.isLeaf && !model.addTreeNodeDisabled"
          >
            <slot name="addTreeNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-folder-plus-e"></i>
            </slot>
          </span>
          <span
            :title="defaultAddLeafNodeTitle"
            @click.stop.prevent="addChild(true)"
            v-if="!model.isLeaf && !model.addLeafNodeDisabled"
          >
            <slot name="addLeafNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-plus"></i>
            </slot>
          </span>
          <span title="edit" @click.stop.prevent="setEditable" v-if="!model.editNodeDisabled">
            <slot name="editNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-edit"></i>
            </slot>
          </span>
          <span title="delete" @click.stop.prevent="delNode" v-if="!model.delNodeDisabled">
            <slot name="delNodeIcon" :expanded="expanded" :model="model" :root="rootNode">
              <i class="vtl-icon vtl-icon-trash"></i>
            </slot>
          </span>
        </div>
      </div>

      <div
        v-if="model.children && model.children.length > 0 && expanded"
        class="vtl-border vtl-bottom"
        :class="{ 'vtl-active': isDragEnterBottom }"
        @drop="dropAfter"
        @dragenter="dragEnterBottom"
        @dragover="dragOverBottom"
        @dragleave="dragLeaveBottom"
      ></div>
    </div>

    <div
      :class="{ 'vtl-tree-margin': model.name !== 'root' }"
      v-show="model.name === 'root' || expanded"
      v-if="isFolder"
    >
      <VueTreeList
        v-for="child in model.children"
        :default-tree-node-name="defaultTreeNodeName"
        :default-leaf-node-name="defaultLeafNodeName"
        :default-expanded="defaultExpanded"
        :model="child"
        :key="child.id"
      >
        <template v-slot:leafNameDisplay="slotProps: any">
          <slot name="leafNameDisplay" v-bind="slotProps" />
        </template>
        <template v-slot:addTreeNodeIcon="slotProps: any">
          <slot name="addTreeNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:addLeafNodeIcon="slotProps: any">
          <slot name="addLeafNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:editNodeIcon="slotProps: any">
          <slot name="editNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:delNodeIcon="slotProps: any">
          <slot name="delNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:leafNodeIcon="slotProps: any">
          <slot name="leafNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:treeNodeIcon="slotProps: any">
          <slot name="treeNodeIcon" v-bind="slotProps" />
        </template>
      </VueTreeList>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  provide,
  inject,
  onBeforeUnmount,
  type ComponentPublicInstance,
} from 'vue'
import { TreeNode } from './Tree'
import { removeHandler } from './tools'

defineOptions({
  name: 'VueTreeList',
})

const props = withDefaults(
  defineProps<{
    model: TreeNode
    defaultLeafNodeName?: string
    defaultTreeNodeName?: string
    defaultAddTreeNodeTitle?: string
    defaultAddLeafNodeTitle?: string
    defaultExpanded?: boolean
  }>(),
  {
    defaultLeafNodeName: 'Leaf Node',
    defaultTreeNodeName: 'Tree Node',
    defaultAddTreeNodeTitle: 'Add Tree Node',
    defaultAddLeafNodeTitle: 'Add Leaf Node',
    defaultExpanded: true,
  },
)

const emit = defineEmits<{
  (e: 'click', payload: Record<string, unknown>): void
  (
    e: 'change-name',
    payload: {
      id: number | string
      oldName: string
      newName: string
      node?: TreeNode
      eventType?: string
    },
  ): void
  (e: 'delete-node', node: TreeNode): void
  (e: 'add-node', node: TreeNode): void
  (e: 'drop', payload: { target: TreeNode; node: TreeNode; src: TreeNode | null }): void
  (e: 'drop-before', payload: { target: TreeNode; node: TreeNode; src: TreeNode | null }): void
  (e: 'drop-after', payload: { target: TreeNode; node: TreeNode; src: TreeNode | null }): void
  (e: 'end-edit', payload: { id: number | string; oldName: string; newName: string }): void
}>()

// --- Drag state (module-level) ---
let compInOperation: { model: TreeNode } | null = null

// --- Provide/Inject for root event emitting ---
type RootEmitFn = (event: string, payload: unknown) => void

const isRoot = props.model.name === 'root'

const rootEmit: RootEmitFn = isRoot
  ? (event: string, payload: unknown) => {
      emit(event as any, payload as any)
    }
  : inject<RootEmitFn>('vtl-root-emit', () => {})

if (isRoot) {
  provide('vtl-root-emit', rootEmit)
}

const rootNode = computed(() => {
  // In Vue 3, we just return the root model reference
  // The root provides the emit function via provide/inject
  return props.model.name === 'root' ? props.model : undefined
})

// --- Reactive state ---
const isHover = ref(false)
const editable = ref(false)
const isDragEnterUp = ref(false)
const isDragEnterBottom = ref(false)
const isDragEnterNode = ref(false)
const expanded = ref(props.defaultExpanded)

const nodeInput = ref<HTMLInputElement | null>(null)

// --- Computed ---
const caretClass = computed(() => {
  return expanded.value ? 'vtl-icon-caret-down' : 'vtl-icon-caret-right'
})

const isFolder = computed(() => {
  return props.model.children && props.model.children.length > 0
})

const treeNodeClass = computed(() => {
  return {
    'vtl-node-main': true,
    'vtl-active': isDragEnterNode.value,
    'vtl-drag-disabled': props.model.dragDisabled,
    'vtl-disabled': props.model.disabled,
  }
})

// --- Lifecycle ---
onBeforeUnmount(() => {
  removeHandler(window, 'keyup')
})

// --- Methods ---
function updateName(e: Event) {
  const target = e.target as HTMLInputElement
  const oldName = props.model.name
  props.model.changeName(target.value)
  rootEmit('change-name', {
    id: props.model.id,
    oldName: oldName,
    newName: target.value,
    node: props.model,
  })
}

function delNode() {
  rootEmit('delete-node', props.model)
}

function setEditable() {
  editable.value = true
  nextTick(() => {
    const input = nodeInput.value
    if (input) {
      input.focus()
      input.setSelectionRange(0, input.value.length)
    }
  })
}

function setUnEditable(e: Event) {
  if (editable.value === false) return
  editable.value = false
  const target = e.target as HTMLInputElement
  const oldName = props.model.name
  props.model.changeName(target.value)
  rootEmit('change-name', {
    id: props.model.id,
    oldName: oldName,
    newName: target.value,
    eventType: 'blur',
  })
  rootEmit('end-edit', {
    id: props.model.id,
    oldName: oldName,
    newName: target.value,
  })
}

function toggle() {
  if (isFolder.value) {
    expanded.value = !expanded.value
  }
}

function mouseOver() {
  if (props.model.disabled) return
  isHover.value = true
}

function mouseOut() {
  isHover.value = false
}

function click() {
  rootEmit('click', {
    toggle,
    ...props.model,
  })
}

function addChild(isLeaf: boolean) {
  const name = isLeaf ? props.defaultLeafNodeName : props.defaultTreeNodeName
  expanded.value = true
  const node = new TreeNode({ name, isLeaf })
  props.model.addChildren(node)
  rootEmit('add-node', node)
}

function dragStart(e: DragEvent) {
  if (!(props.model.dragDisabled || props.model.disabled)) {
    compInOperation = { model: props.model }
    // for firefox
    e.dataTransfer?.setData('data', 'data')
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
    return true
  }
  return false
}

function dragEnd() {
  compInOperation = null
}

function dragOver(e: DragEvent) {
  e.preventDefault()
  return true
}

function dragEnter() {
  if (!compInOperation) return
  if (compInOperation.model.id === props.model.id || props.model.isLeaf) return
  isDragEnterNode.value = true
}

function dragLeave() {
  isDragEnterNode.value = false
}

function drop() {
  if (!compInOperation) return
  const oldParent = compInOperation.model.parent
  compInOperation.model.moveInto(props.model)
  isDragEnterNode.value = false
  rootEmit('drop', {
    target: props.model,
    node: compInOperation.model,
    src: oldParent,
  })
}

function dragEnterUp() {
  if (!compInOperation) return
  isDragEnterUp.value = true
}

function dragOverUp(e: DragEvent) {
  e.preventDefault()
  return true
}

function dragLeaveUp() {
  if (!compInOperation) return
  isDragEnterUp.value = false
}

function dropBefore() {
  if (!compInOperation) return
  const oldParent = compInOperation.model.parent
  compInOperation.model.insertBefore(props.model)
  isDragEnterUp.value = false
  rootEmit('drop-before', {
    target: props.model,
    node: compInOperation.model,
    src: oldParent,
  })
}

function dragEnterBottom() {
  if (!compInOperation) return
  isDragEnterBottom.value = true
}

function dragOverBottom(e: DragEvent) {
  e.preventDefault()
  return true
}

function dragLeaveBottom() {
  if (!compInOperation) return
  isDragEnterBottom.value = false
}

function dropAfter() {
  if (!compInOperation) return
  const oldParent = compInOperation.model.parent
  compInOperation.model.insertAfter(props.model)
  isDragEnterBottom.value = false
  rootEmit('drop-after', {
    target: props.model,
    node: compInOperation.model,
    src: oldParent,
  })
}
</script>

<style lang="less" rel="stylesheet/less">
@font-face {
  font-family: 'icomoon';
  src: url('./fonts/icomoon.eot?ui1hbx');
  src:
    url('./fonts/icomoon.eot?ui1hbx#iefix') format('embedded-opentype'),
    url('./fonts/icomoon.ttf?ui1hbx') format('truetype'),
    url('./fonts/icomoon.woff?ui1hbx') format('woff'),
    url('./fonts/icomoon.svg?ui1hbx#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}

.vtl-icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  &.vtl-menu-icon {
    margin-right: 4px;
    &:hover {
      color: inherit;
    }
  }
  &:hover {
    color: blue;
  }
}

.vtl-icon-file:before {
  content: '\e906';
}
.vtl-icon-folder:before {
  content: '\e907';
}
.vtl-icon-caret-down:before {
  content: '\e901';
}
.vtl-icon-caret-right:before {
  content: '\e900';
}
.vtl-icon-edit:before {
  content: '\e902';
}
.vtl-icon-folder-plus-e:before {
  content: '\e903';
}
.vtl-icon-plus:before {
  content: '\e904';
}
.vtl-icon-trash:before {
  content: '\e905';
}

.vtl-border {
  height: 5px;
  &.vtl-up {
    margin-top: -5px;
    background-color: transparent;
  }
  &.vtl-bottom {
    background-color: transparent;
  }
  &.vtl-active {
    border-bottom: 3px dashed blue;
    /*background-color: blue;*/
  }
}

.vtl-node-main {
  display: flex;
  align-items: center;
  padding: 5px 0 5px 1rem;
  .vtl-input {
    border: none;
    max-width: 150px;
    border-bottom: 1px solid blue;
  }
  &:hover {
    background-color: #f0f0f0;
  }
  &.vtl-active {
    outline: 2px dashed pink;
  }
  .vtl-caret {
    margin-left: -1rem;
  }
  .vtl-operation {
    margin-left: 2rem;
    letter-spacing: 1px;
  }
}

.vtl-item {
  cursor: pointer;
}
.vtl-tree-margin {
  margin-left: 2em;
}
</style>
