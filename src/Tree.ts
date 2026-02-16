import { traverseTree } from './tools'

/**
 * Data structure for TreeNode constructor parameter
 */
export interface TreeNodeData {
  name: string
  isLeaf?: boolean
  id?: number | string
  dragDisabled?: boolean
  addTreeNodeDisabled?: boolean
  addLeafNodeDisabled?: boolean
  editNodeDisabled?: boolean
  delNodeDisabled?: boolean
  disabled?: boolean
  children?: TreeNodeData[]
  [key: string]: unknown
}

/**
 * Tree node class
 */
export class TreeNode {
  id: number | string
  parent: TreeNode | null
  children: TreeNode[] | null
  isLeaf: boolean
  name: string
  pid: number | string | undefined
  dragDisabled?: boolean
  addTreeNodeDisabled?: boolean
  addLeafNodeDisabled?: boolean
  editNodeDisabled?: boolean
  delNodeDisabled?: boolean
  disabled?: boolean;
  [key: string]: unknown

  constructor(data: TreeNodeData) {
    const { id, isLeaf } = data
    this.id = typeof id === 'undefined' ? new Date().valueOf() : id
    this.parent = null
    this.children = null
    this.isLeaf = !!isLeaf
    this.name = data.name
    this.pid = undefined

    // other params
    for (const k in data) {
      if (k !== 'id' && k !== 'children' && k !== 'isLeaf') {
        this[k] = data[k]
      }
    }
  }

  changeName(name: string): void {
    this.name = name
  }

  addChildren(children: TreeNode | TreeNode[]): void {
    if (!this.children) {
      this.children = []
    }

    if (Array.isArray(children)) {
      for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i]
        child.parent = this
        child.pid = this.id
      }
      this.children = this.children.concat(children)
    } else {
      const child = children
      child.parent = this
      child.pid = this.id
      this.children.push(child)
    }
  }

  // remove self
  remove(): void {
    const parent = this.parent
    if (!parent) return
    const index = parent.findChildIndex(this)
    if (index !== undefined) {
      parent.children!.splice(index, 1)
    }
  }

  // remove child
  _removeChild(child: TreeNode): void {
    if (!this.children) return
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        this.children.splice(i, 1)
        break
      }
    }
  }

  isTargetChild(target: TreeNode): boolean {
    let parent = target.parent
    while (parent) {
      if (parent === this) {
        return true
      }
      parent = parent.parent
    }
    return false
  }

  moveInto(target: TreeNode): void {
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

    this.parent!._removeChild(this)
    this.parent = target
    this.pid = target.id
    if (!target.children) {
      target.children = []
    }
    target.children.unshift(this)
  }

  findChildIndex(child: TreeNode): number | undefined {
    if (!this.children) return undefined
    for (let i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i] === child) {
        return i
      }
    }
    return undefined
  }

  _canInsert(target: TreeNode): boolean {
    if (this.name === 'root' || this === target) {
      return false
    }

    // cannot insert ancestor to child
    if (this.isTargetChild(target)) {
      return false
    }

    this.parent!._removeChild(this)
    this.parent = target.parent
    this.pid = target.parent!.id
    return true
  }

  insertBefore(target: TreeNode): void {
    if (!this._canInsert(target)) return

    const pos = target.parent!.findChildIndex(target)
    if (pos !== undefined) {
      target.parent!.children!.splice(pos, 0, this)
    }
  }

  insertAfter(target: TreeNode): void {
    if (!this._canInsert(target)) return

    const pos = target.parent!.findChildIndex(target)
    if (pos !== undefined) {
      target.parent!.children!.splice(pos + 1, 0, this)
    }
  }

  toString(): string {
    return JSON.stringify(traverseTree(this))
  }
}

export class Tree {
  root: TreeNode

  constructor(data: TreeNodeData[]) {
    this.root = new TreeNode({ name: 'root', isLeaf: false, id: 0 })
    this.initNode(this.root, data)
  }

  initNode(node: TreeNode, data: TreeNodeData[]): void {
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
