import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Tree, VueTreeList } from '../../src/index'

describe('Operation', () => {
  let wrapper: VueWrapper

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
        ],
      },
      {
        name: 'Node 2',
        id: 't2',
        pid: 0,
      },
    ])
    wrapper = mount(VueTreeList, {
      props: { model: tree.root },
    })
  })

  it('delete leaf node', async () => {
    const $node11Trash = wrapper.find('#t11 [title="delete"]')
    await $node11Trash.trigger('click')
    ;(wrapper.emitted('delete-node')![0][0] as any).remove()
    await nextTick()
    expect(wrapper.findAll('.vtl-node').length).toBe(2)
  })

  it('delete tree node', async () => {
    const $node11Trash = wrapper.find('#t1 [title="delete"]')
    await $node11Trash.trigger('click')
    ;(wrapper.emitted('delete-node')![0][0] as any).remove()
    await nextTick()
    expect(wrapper.findAll('.vtl-node').length).toBe(1)
  })

  it('add leaf node', async () => {
    const $node1AddLeafNode = wrapper.find('#t1 [title="Add Leaf Node"]')
    await $node1AddLeafNode.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.vtl-leaf-node').length).toBe(2)
  })

  it('add tree node', async () => {
    const $node1AddTreeNode = wrapper.find('#t1 [title="Add Tree Node"]')
    await $node1AddTreeNode.trigger('click')
    await nextTick()
    expect(wrapper.findAll('.vtl-tree-node').length).toBe(3)
  })

  it('change node name', async () => {
    const $node1Edit = wrapper.find('#t1 [title="edit"]')
    await $node1Edit.trigger('click')
    await nextTick()
    const $input = wrapper.find('#t1 .vtl-input')
    ;($input.element as HTMLInputElement).value = 'New Node 1'
    await $input.trigger('input')
    await $input.trigger('blur')
    await nextTick()
    expect(wrapper.find('#t1').text()).toBe('New Node 1')
  })
})
