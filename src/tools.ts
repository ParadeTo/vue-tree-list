/**
 * Created by ayou on 18/2/6.
 */

import { TreeNode } from './Tree'

// depth first search
export const traverseTree = (root: TreeNode) => {
  const newRoot = {} as TreeNode

  for (const k in root) {
    if (k !== 'children' && k !== 'parent') {
      // @ts-ignore
      newRoot[k] = root[k]
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
