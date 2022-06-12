import { traverseTree } from './tools'
/**
 * Tree data struct
 * Created by ayou on 2017/7/20.
 * @param data: treenode's params
 *   name: treenode's name
 *   isLeaf: treenode is leaf node or not
 *   id: id
 *   dragDisabled: decide if it can be dragged
 *   disabled: desabled all operation
 */

interface Data {
  name: string
  isLeaf?: boolean
  id?: string | number
  dragDisabled?: boolean
  disabled?: boolean
}

export class TreeNode {
  id: string | number
  parent?: TreeNode | null
  children: TreeNode[]
  isLeaf?: boolean
  name: string
  pid?: string | number
  constructor(data: Data) {
    const { id, isLeaf } = data
    this.id = typeof id === 'undefined' ? new Date().valueOf() : id
    this.parent = null
    this.children = []
    this.isLeaf = !!isLeaf
    this.name = data['name']
  }

  changeName(name: string) {
    this.name = name
  }

  addChildren(children: TreeNode | TreeNode[]) {
    if (!this.children) {
      this.children = []
    }

    if (Array.isArray(children)) {
      for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i]
        child.parent = this
        child.pid = this.id
      }
      this.children.concat(children)
    } else {
      const child = children
      child.parent = this
      child.pid = this.id
      this.children.push(child)
    }
  }

  // remove self
  remove() {
    const parent = this.parent
    if (parent) {
      const index = parent.findChildIndex(this)
      index && parent.children?.splice(index, 1)
    }
  }

  // remove child
  _removeChild(child: TreeNode) {
    if (!this.children) return
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        break
      }
    }
  }

  isTargetChild(target: TreeNode) {
    let parent = target.parent
    while (parent) {
      if (parent === this) {
        return true
      }
      parent = parent.parent
    }
    return false
  }

  moveInto(target: TreeNode) {
    if (this.name === 'root' || this === target) {
      return
    }

    // cannot move ancestor to child
    if (this.isTargetChild(target)) {
      return
    }

    // cannot move to leaf node
    if (target.isLeaf) {
      return
    }

    this.parent?._removeChild(this)
    this.parent = target
    this.pid = target.id
    if (!target.children) {
      target.children = []
    }
    target.children.unshift(this)
  }

  findChildIndex(child: TreeNode) {
    let index
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        index = i
        break
      }
    }
    return index
  }

  _canInsert(target: TreeNode) {
    if (this.name === 'root' || this === target) {
      return false
    }

    // cannot insert ancestor to child
    if (this.isTargetChild(target)) {
      return false
    }

    this.parent?._removeChild(this)
    this.parent = target.parent
    this.pid = target.parent?.id
    return true
  }

  insertBefore(target: TreeNode) {
    if (!this._canInsert(target)) return
    if (target.parent) {
      const pos = target.parent.findChildIndex(target)
      pos && target.parent.children?.splice(pos, 0, this)
    }
  }

  insertAfter(target: TreeNode) {
    if (!this._canInsert(target)) return
    if (target.parent) {
      const pos = target.parent.findChildIndex(target)
      pos && target.parent.children?.splice(pos + 1, 0, this)
    }
  }

  toString() {
    return JSON.stringify(traverseTree(this))
  }
}

export class Tree {
  root: TreeNode
  constructor(data: TreeNode[]) {
    this.root = new TreeNode({ name: 'root', isLeaf: false, id: 0 })
    this.initNode(this.root, data)
    // @ts-ignore
    return this.root
  }

  initNode(node: TreeNode, data: TreeNode[]) {
    for (let i = 0, len = data.length; i < len; i++) {
      const _data = data[i]

      const child = new TreeNode(_data)
      if (_data.children && _data.children.length > 0) {
        this.initNode(child, _data.children)
      }
      node.addChildren(child)
    }
  }
}
