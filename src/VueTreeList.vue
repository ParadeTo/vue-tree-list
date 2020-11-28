<template>
  <div class="vtl">
    <div
      v-if="model.name !== 'root'"
      :id="model.id"
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
      <item
        v-for="model in model.children"
        :default-tree-node-name="defaultTreeNodeName"
        :default-leaf-node-name="defaultLeafNodeName"
        :default-expanded="defaultExpanded"
        :model="model"
        :key="model.id"
      >
        <template v-slot:leafNameDisplay="slotProps">
          <slot name="leafNameDisplay" v-bind="slotProps" />
        </template>
        <template v-slot:addTreeNodeIcon="slotProps">
          <slot name="addTreeNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:addLeafNodeIcon="slotProps">
          <slot name="addLeafNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:editNodeIcon="slotProps">
          <slot name="editNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:delNodeIcon="slotProps">
          <slot name="delNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:leafNodeIcon="slotProps">
          <slot name="leafNodeIcon" v-bind="slotProps" />
        </template>
        <template v-slot:treeNodeIcon="slotProps">
          <slot name="treeNodeIcon" v-bind="slotProps" />
        </template>
      </item>
    </div>
  </div>
</template>

<script>
import { TreeNode } from './Tree.js'
import { addHandler, removeHandler } from './tools.js'

let compInOperation = null

export default {
  name: 'vue-tree-list',
  data: function() {
    return {
      isHover: false,
      editable: false,
      isDragEnterUp: false,
      isDragEnterBottom: false,
      isDragEnterNode: false,
      expanded: this.defaultExpanded
    }
  },
  props: {
    model: {
      type: Object
    },
    defaultLeafNodeName: {
      type: String,
      default: 'Leaf Node'
    },
    defaultTreeNodeName: {
      type: String,
      default: 'Tree Node'
    },
    defaultAddTreeNodeTitle: {
      type: String,
      default: 'Add Tree Node'
    },
    defaultAddLeafNodeTitle: {
      type: String,
      default: 'Add Leaf Node'
    },
    defaultExpanded: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    rootNode() {
      var node = this.$parent
      while (node._props.model.name !== 'root') {
        node = node.$parent
      }
      return node
    },

    caretClass() {
      return this.expanded ? 'vtl-icon-caret-down' : 'vtl-icon-caret-right'
    },

    isFolder() {
      return this.model.children && this.model.children.length
    },

    treeNodeClass() {
      const {
        model: { dragDisabled, disabled },
        isDragEnterNode
      } = this

      return {
        'vtl-node-main': true,
        'vtl-active': isDragEnterNode,
        'vtl-drag-disabled': dragDisabled,
        'vtl-disabled': disabled
      }
    }
  },
  beforeCreate() {
    this.$options.components.item = require('./VueTreeList').default
  },
  mounted() {
    const vm = this
    addHandler(window, 'keyup', function(e) {
      // click enter
      if (e.keyCode === 13 && vm.editable) {
        vm.editable = false
      }
    })
  },
  beforeDestroy() {
    removeHandler(window, 'keyup')
  },
  methods: {
    updateName(e) {
      var oldName = this.model.name
      this.model.changeName(e.target.value)
      this.rootNode.$emit('change-name', {
        id: this.model.id,
        oldName: oldName,
        newName: e.target.value,
        node: this.model
      })
    },

    delNode() {
      this.rootNode.$emit('delete-node', this.model)
    },

    setEditable() {
      this.editable = true
      this.$nextTick(() => {
        const $input = this.$refs.nodeInput
        $input.focus()
        $input.setSelectionRange(0, $input.value.length)
      })
    },

    setUnEditable(e) {
      this.editable = false
      var oldName = this.model.name
      this.model.changeName(e.target.value)
      this.rootNode.$emit('change-name', {
        id: this.model.id,
        oldName: oldName,
        newName: e.target.value,
        eventType: 'blur'
      })
    },

    toggle() {
      if (this.isFolder) {
        this.expanded = !this.expanded
      }
    },

    mouseOver() {
      if (this.model.disabled) return
      this.isHover = true
    },

    mouseOut() {
      this.isHover = false
    },

    click() {
      this.rootNode.$emit('click', {
        toggle: this.toggle,
        ...this.model
      })
    },

    addChild(isLeaf) {
      const name = isLeaf ? this.defaultLeafNodeName : this.defaultTreeNodeName
      this.expanded = true
      var node = new TreeNode({ name, isLeaf })
      this.model.addChildren(node, true)
      this.rootNode.$emit('add-node', node)
    },

    dragStart(e) {
      if (!(this.model.dragDisabled || this.model.disabled)) {
        compInOperation = this
        // for firefox
        e.dataTransfer.setData('data', 'data')
        e.dataTransfer.effectAllowed = 'move'
        return true
      }
      return false
    },
    dragEnd() {
      compInOperation = null
    },
    dragOver(e) {
      e.preventDefault()
      return true
    },
    dragEnter() {
      if (!compInOperation) return
      if (compInOperation.model.id === this.model.id || !compInOperation || this.model.isLeaf)
        return
      this.isDragEnterNode = true
    },
    dragLeave() {
      this.isDragEnterNode = false
    },
    drop() {
      if (!compInOperation) return
      const oldParent = compInOperation.model.parent
      compInOperation.model.moveInto(this.model)
      this.isDragEnterNode = false
      this.rootNode.$emit('drop', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    },

    dragEnterUp() {
      if (!compInOperation) return
      this.isDragEnterUp = true
    },
    dragOverUp(e) {
      e.preventDefault()
      return true
    },
    dragLeaveUp() {
      if (!compInOperation) return
      this.isDragEnterUp = false
    },
    dropBefore() {
      if (!compInOperation) return
      const oldParent = compInOperation.model.parent
      compInOperation.model.insertBefore(this.model)
      this.isDragEnterUp = false
      this.rootNode.$emit('drop-before', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    },

    dragEnterBottom() {
      if (!compInOperation) return
      this.isDragEnterBottom = true
    },
    dragOverBottom(e) {
      e.preventDefault()
      return true
    },
    dragLeaveBottom() {
      if (!compInOperation) return
      this.isDragEnterBottom = false
    },
    dropAfter() {
      if (!compInOperation) return
      const oldParent = compInOperation.model.parent
      compInOperation.model.insertAfter(this.model)
      this.isDragEnterBottom = false
      this.rootNode.$emit('drop-after', {
        target: this.model,
        node: compInOperation.model,
        src: oldParent
      })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@font-face {
  font-family: 'icomoon';
  src: url('fonts/icomoon.eot?ui1hbx');
  src: url('fonts/icomoon.eot?ui1hbx#iefix') format('embedded-opentype'),
    url('fonts/icomoon.ttf?ui1hbx') format('truetype'),
    url('fonts/icomoon.woff?ui1hbx') format('woff'),
    url('fonts/icomoon.svg?ui1hbx#icomoon') format('svg');
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
