import { describe, it, expect, beforeEach } from 'vitest'
import { Tree, TreeNode } from '../../src/index'

describe('Drag (data model)', () => {
  let root: TreeNode

  beforeEach(() => {
    const tree = new Tree([
      {
        name: 'Node 1',
        id: 't1',
        pid: 0,
        children: [
          {
            name: 'Node 1-1',
            id: 't11',
            isLeaf: true,
            pid: 't1',
          },
          {
            name: 'Node 1-2',
            id: 't12',
            pid: 't1',
          },
        ],
      },
      {
        name: 'Node 2',
        id: 't2',
        pid: 0,
      },
      {
        name: 'Node 3',
        id: 't3',
        pid: 0,
      },
    ])
    root = tree.root
  })

  it('insert before', () => {
    // Move Node 2 before Node 1
    const node2 = root.children![1] // t2
    const node1 = root.children![0] // t1
    node2.insertBefore(node1)

    expect(root.children![0].id).toBe('t2')
    expect(root.children![1].id).toBe('t1')
  })

  it('insert after', () => {
    // Move Node 3 after Node 1
    const node3 = root.children![2] // t3
    const node1 = root.children![0] // t1
    node3.insertAfter(node1)

    expect(root.children![0].id).toBe('t1')
    expect(root.children![1].id).toBe('t3')
    expect(root.children![2].id).toBe('t2')
  })

  it('move into', () => {
    // Move Node 3 into Node 1
    const node3 = root.children![2] // t3
    const node1 = root.children![0] // t1
    node3.moveInto(node1)

    expect(root.children!.length).toBe(2) // t1 and t2 remain at root
    expect(node1.children![0].id).toBe('t3') // t3 is first child of t1
  })

  it('cannot move ancestor into child', () => {
    const node1 = root.children![0] // t1
    const node12 = node1.children![1] // t12
    const originalChildren = [...root.children!].map((n) => n.id)

    node1.moveInto(node12)

    // Should be unchanged
    expect(root.children!.map((n) => n.id)).toEqual(originalChildren)
  })

  it('cannot move to leaf node', () => {
    const node2 = root.children![1] // t2
    const node11 = root.children![0].children![0] // t11, isLeaf
    const originalRootChildren = [...root.children!].map((n) => n.id)

    node2.moveInto(node11)

    // Should be unchanged since t11 is a leaf
    expect(root.children!.map((n) => n.id)).toEqual(originalRootChildren)
  })

  it('cannot move root', () => {
    const node1 = root.children![0]
    root.moveInto(node1)

    // Root stays root, nothing changes
    expect(root.children!.length).toBe(3)
  })
})
