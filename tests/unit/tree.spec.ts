import { describe, it, expect } from 'vitest'
import { Tree, TreeNode } from '../../src/index'

describe('Tree model', () => {
  it('addChildren with array should set parent and pid for each child', () => {
    const parent = new TreeNode({ name: 'Parent', id: 'p' })
    const child1 = new TreeNode({ name: 'Child1', id: 'c1' })
    const child2 = new TreeNode({ name: 'Child2', id: 'c2' })

    parent.addChildren([child1, child2])

    expect(parent.children?.map((child) => child.id)).toEqual(['c1', 'c2'])
    expect(child1.parent).toBe(parent)
    expect(child2.parent).toBe(parent)
    expect(child1.pid).toBe('p')
    expect(child2.pid).toBe('p')
  })

  it('remove should be safe for detached node', () => {
    const node = new TreeNode({ name: 'Detached', id: 'd1' })

    expect(() => node.remove()).not.toThrow()
  })

  it('findChildIndex returns undefined when child not found or no children', () => {
    const parent = new TreeNode({ name: 'Parent', id: 'p' })
    const child = new TreeNode({ name: 'Child', id: 'c' })

    expect(parent.findChildIndex(child)).toBeUndefined()

    parent.addChildren(child)
    const outsider = new TreeNode({ name: 'Outsider', id: 'o' })
    expect(parent.findChildIndex(outsider)).toBeUndefined()
  })

  it('toString should serialize tree without parent reference', () => {
    const tree = new Tree([
      {
        name: 'Node 1',
        id: 'n1',
        children: [{ name: 'Node 1-1', id: 'n11', isLeaf: true }],
      },
    ])

    const serialized = tree.root.toString()
    const parsed = JSON.parse(serialized) as Record<string, unknown>

    expect(parsed.name).toBe('root')
    expect(parsed).not.toHaveProperty('parent')
    expect((parsed.children as Array<{ id: string }>)[0].id).toBe('n1')
  })

  it('moveInto should create target children and insert node at first position', () => {
    const tree = new Tree([
      { name: 'Node A', id: 'a' },
      { name: 'Node B', id: 'b' },
      { name: 'Node C', id: 'c' },
    ])
    const root = tree.root
    const nodeA = root.children![0]
    const nodeB = root.children![1]

    nodeB.moveInto(nodeA)

    expect(nodeA.children?.[0].id).toBe('b')
    expect(nodeB.parent).toBe(nodeA)
    expect(nodeB.pid).toBe('a')
  })
})
