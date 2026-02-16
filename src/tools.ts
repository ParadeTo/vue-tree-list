import type { TreeNode } from './Tree'

let handlerCache: EventListener | null = null

export const addHandler = function (
  element: EventTarget,
  type: string,
  handler: EventListener,
): void {
  handlerCache = handler
  element.addEventListener(type, handler, false)
}

export const removeHandler = function (element: EventTarget, type: string): void {
  if (handlerCache) {
    element.removeEventListener(type, handlerCache, false)
    handlerCache = null
  }
}

export interface TraversedNode {
  [key: string]: unknown
  children?: TraversedNode[]
}

// depth first search
export const traverseTree = (root: TreeNode): TraversedNode => {
  const newRoot: TraversedNode = {}

  for (const k in root) {
    if (k !== 'children' && k !== 'parent') {
      newRoot[k] = (root as Record<string, unknown>)[k]
    }
  }

  if (root.children && root.children.length > 0) {
    newRoot.children = []
    for (let i = 0, len = root.children.length; i < len; i++) {
      newRoot.children.push(traverseTree(root.children[i]))
    }
  }
  return newRoot
}
