<template>
  <div>
    <div v-if="model.name !== 'root'">
      <div class="border up" :class="{'active': isDragEnterUp}"
        @drop="dropUp"
        @dragenter="dragEnterUp"
        @dragover='dragOverUp'
        @dragleave="dragLeaveUp"></div>
      <div class='tree-node' :id='model.id' :class="{'active': isDragEnterNode}"
        :draggable="!model.dragDisabled"
        @dragstart='dragStart'
        @dragover='dragOver'
        @dragenter='dragEnter'
        @dragleave='dragLeave'
        @drop='drop'
        @dragend='dragEnd'
        @mouseover='mouseOver'
        @mouseout='mouseOut'
        @click.stop='click'>
        <span class="caret icon is-small" v-if="model.children && model.children.length > 0">
          <i class="vue-tree-icon" :class="caretClass" @click.prevent.stop="toggle"></i>
        </span>

        <span v-if="model.isLeaf">
          <slot name="leafNodeIcon">
            <i class="vue-tree-icon item-icon icon-file"></i>
          </slot>
        </span>
        <span v-else>
          <slot name="treeNodeIcon">
            <i class="vue-tree-icon item-icon icon-folder"></i>
          </slot>
        </span>

        <div class="node-content" v-if="!editable">
          {{model.name}}
        </div>
        <input v-else class="vue-tree-input" type="text" ref="nodeInput" :value="model.name" @input="updateName" @blur="setUnEditable">
        <div class="operation" v-show="isHover">
          <span title="add tree node" @click.stop.prevent="addChild(false)" v-if="!model.isLeaf">
            <slot name="addTreeNode">
              <i class="vue-tree-icon icon-folder-plus-e"></i>
            </slot>
          </span>
          <span title="add tree node" @click.stop.prevent="addChild(true)" v-if="!model.isLeaf">
            <slot name="addLeafNode">
              <i class="vue-tree-icon icon-plus"></i>
            </slot>
          </span>
          <span title="edit" @click.stop.prevent="setEditable">
            <slot name="edit">
              <i class="vue-tree-icon icon-edit"></i>
            </slot>
          </span>
          <span title="delete" @click.stop.prevent="delNode">
            <slot name="edit">
              <i class="vue-tree-icon icon-trash"></i>
            </slot>
          </span>
        </div>
      </div>

      <div v-if="model.children && model.children.length > 0 && expanded"
        class="border bottom"
        :class="{'active': isDragEnterBottom}"
        @drop="dropBottom"
        @dragenter="dragEnterBottom"
        @dragover='dragOverBottom'
        @dragleave="dragLeaveBottom"></div>
    </div>

    <div :class="{'tree-margin': model.name !== 'root'}" v-show="expanded" v-if="isFolder">
      <item v-for="model in model.children"
        :default-tree-node-name="defaultTreeNodeName"
        :default-leaf-node-name="defaultLeafNodeName"
        :model="model"
        :key='model.id'>
      </item>
    </div>
  </div>
</template>

<script>
  import { Tree, TreeNode } from './Tree.js'
  import { addHandler, removeHandler } from './tools.js'

  let fromComp = null

  export default {
    data: function () {
      return {
        isHover: false,
        editable: false,
        isDragEnterUp: false,
        isDragEnterBottom: false,
        isDragEnterNode: false,
        expanded: true
      }
    },
    props: {
      model: {
        type: Object
      },
      defaultLeafNodeName: {
        type: String,
        default: 'New leaf node'
      },
      defaultTreeNodeName: {
        type: String,
        default: 'New tree node'
      }
    },
    computed: {
      itemIconClass () {
        return this.model.isLeaf ? 'icon-file' : 'icon-folder'
      },

      caretClass () {
        return this.expanded ? 'icon-caret-down' : 'icon-caret-right'
      },

      isFolder() {
        return this.model.children &&
          this.model.children.length
      }
    },
    mounted () {
      const vm = this
      addHandler(window, 'keyup', function (e) {
        // click enter
        if (e.keyCode === 13 && vm.editable) {
          vm.editable = false
        }
      })
    },
    beforeDestroy () {
      removeHandler(window, 'keyup')
    },
    methods: {
      updateName (e) {
        this.model.changeName(e.target.value)
      },

      delNode () {
        const vm = this
        if (window.confirm('Are you sure?')) {
          vm.model.remove()
        }
      },

      setEditable () {
        this.editable = true
        this.$nextTick(() => {
          this.$refs.nodeInput.focus()
//          fireFocusEvent(this.$refs.nodeInput)
        })
      },

      setUnEditable () {
        this.editable = false
      },

      toggle() {
        if (this.isFolder) {
          this.expanded = !this.expanded
        }
      },

      mouseOver(e) {
        this.isHover = true
      },

      mouseOut(e) {
        this.isHover = false
      },

      click() {
        var node = this.$parent
        var clickModel = this.model
        while (node._props.model.name !== 'root') {
          node = node.$parent
        }
        node.$emit('click', clickModel)
      },

      addChild(isLeaf) {
        const name = isLeaf ? this.defaultLeafNodeName : this.defaultTreeNodeName
        this.expanded = true
        var node = new TreeNode({ name, isLeaf })
        this.model.addChildren(node, true)
      },

      dragStart(e) {
        if (!this.model.dragDisabled) {
          fromComp = this
          // for firefox
          e.dataTransfer.setData("data","data");
          e.dataTransfer.effectAllowed = 'move'
          return true
        }
        return false
      },
      dragEnd(e) {
        fromComp = null
      },
      dragOver(e) {
        e.preventDefault()
        return true
      },
      dragEnter(e) {
        if (!fromComp) return
        if (this.model.isLeaf) return
        this.isDragEnterNode = true
      },
      dragLeave(e) {
        this.isDragEnterNode = false
      },
      drop(e) {
        if (!fromComp) return
        fromComp.model.moveInto(this.model)
        this.isDragEnterNode = false
      },

      dragEnterUp () {
        if (!fromComp) return
        this.isDragEnterUp = true
      },
      dragOverUp (e) {
        e.preventDefault()
        return true
      },
      dragLeaveUp () {
        if (!fromComp) return
        this.isDragEnterUp = false
      },
      dropUp () {
        if (!fromComp) return
        fromComp.model.insertBefore(this.model)
        this.isDragEnterUp = false
      },

      dragEnterBottom () {
        if (!fromComp) return
        this.isDragEnterBottom = true
      },
      dragOverBottom (e) {
        e.preventDefault()
        return true
      },
      dragLeaveBottom () {
        if (!fromComp) return
        this.isDragEnterBottom = false
      },
      dropBottom () {
        if (!fromComp) return
        fromComp.model.insertAfter(this.model)
        this.isDragEnterBottom = false
      }
    },
    beforeCreate () {
      this.$options.components.item = require('./VueTreeList.vue')
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @font-face {
    font-family: 'icomoon';
    src:  url('fonts/icomoon.eot?ui1hbx');
    src:  url('fonts/icomoon.eot?ui1hbx#iefix') format('embedded-opentype'),
    url('fonts/icomoon.ttf?ui1hbx') format('truetype'),
    url('fonts/icomoon.woff?ui1hbx') format('woff'),
    url('fonts/icomoon.svg?ui1hbx#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }

  .vue-tree-icon {
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
    &.item-icon {
      margin-right: 4px;
      &:hover {
        color: inherit;
      }
    }
    &:hover {
      color: blue;
    }
  }

  .icon-file:before {
    content: "\e906";
  }
  .icon-folder:before {
    content: "\e907";
  }
  .icon-caret-down:before {
    content: "\e901";
  }
  .icon-caret-right:before {
    content: "\e900";
  }
  .icon-edit:before {
    content: "\e902";
  }
  .icon-folder-plus-e:before {
    content: "\e903";
  }
  .icon-plus:before {
    content: "\e904";
  }
  .icon-trash:before {
    content: "\e905";
  }


  .border {
    height: 5px;
    &.up {
      margin-top: -5px;
      background-color: transparent;
    }
    &.bottom {
      background-color: transparent;
    }
    &.active {
      border-bottom: 3px dashed blue;
      /*background-color: blue;*/
    }
  }

  .tree-node {
    display: flex;
    align-items: center;
    padding: 5px 0 5px 1rem;
    .input {
      border: none;
      max-width: 150px;
      border-bottom: 1px solid blue;
    }
    &:hover {
      background-color: #f0f0f0;
    }
    &.active {
      outline: 2px dashed pink;
    }
    .caret {
      margin-left: -1rem;
    }
    .operation {
      margin-left: 2rem;
      letter-spacing: 1px;
    }
  }


  .item {
    cursor: pointer;
  }
  .tree-margin {
    margin-left: 2em;
  }
</style>
