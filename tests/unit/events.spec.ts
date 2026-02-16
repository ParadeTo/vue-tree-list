import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Tree, VueTreeList } from '../../src/index'

describe('VueTreeList events', () => {
  it('emits click with toggle function and node data', async () => {
    const tree = new Tree([{ name: 'Node 1', id: 't1', pid: 0 }])
    const wrapper = mount(VueTreeList, {
      props: { model: tree.root },
    })

    await wrapper.find('#t1 .vtl-node-main').trigger('click')

    const clickEvent = wrapper.emitted('click')
    expect(clickEvent).toBeTruthy()
    const payload = clickEvent?.[0][0] as Record<string, unknown>
    expect(typeof payload.toggle).toBe('function')
    expect(payload.id).toBe('t1')
    expect(payload.name).toBe('Node 1')
  })

  it('emits add-node with expected default node name', async () => {
    const tree = new Tree([{ name: 'Node 1', id: 't1', pid: 0 }])
    const wrapper = mount(VueTreeList, {
      props: {
        model: tree.root,
        defaultTreeNodeName: 'custom tree',
      },
    })

    await wrapper.find('#t1 [title="Add Tree Node"]').trigger('click')

    const addEvents = wrapper.emitted('add-node')
    expect(addEvents).toBeTruthy()
    const addedNode = addEvents?.[0][0] as { name: string; isLeaf: boolean }
    expect(addedNode.name).toBe('custom tree')
    expect(addedNode.isLeaf).toBe(false)
  })

  it('emits change-name on input and end-edit on blur', async () => {
    const tree = new Tree([{ name: 'Node 1', id: 't1', pid: 0 }])
    const wrapper = mount(VueTreeList, {
      props: { model: tree.root },
    })

    await wrapper.find('#t1 [title="edit"]').trigger('click')
    await nextTick()

    const input = wrapper.find('#t1 .vtl-input')
    await input.setValue('Node 1 Updated')
    await input.trigger('blur')

    const changeEvents = wrapper.emitted('change-name')
    expect(changeEvents).toBeTruthy()
    expect(changeEvents?.length).toBe(2)
    expect((changeEvents?.[0][0] as { newName: string; node: { id: string } }).newName).toBe(
      'Node 1 Updated',
    )
    expect((changeEvents?.[0][0] as { newName: string; node: { id: string } }).node.id).toBe('t1')
    expect(
      (changeEvents?.[1][0] as { newName: string; eventType: string; oldName: string }).eventType,
    ).toBe('blur')
    expect((changeEvents?.[1][0] as { newName: string; eventType: string; oldName: string }).oldName).toBe(
      'Node 1 Updated',
    )

    const endEditEvents = wrapper.emitted('end-edit')
    expect(endEditEvents).toBeTruthy()
    expect((endEditEvents?.[0][0] as { id: string; newName: string }).id).toBe('t1')
    expect((endEditEvents?.[0][0] as { id: string; newName: string }).newName).toBe(
      'Node 1 Updated',
    )
  })

  it('hides operation buttons according to disabled flags', () => {
    const tree = new Tree([
      {
        name: 'Node 1',
        id: 't1',
        pid: 0,
        addTreeNodeDisabled: true,
        addLeafNodeDisabled: true,
        editNodeDisabled: true,
        delNodeDisabled: true,
      },
    ])

    const wrapper = mount(VueTreeList, {
      props: { model: tree.root },
    })

    expect(wrapper.find('#t1 [title="Add Tree Node"]').exists()).toBe(false)
    expect(wrapper.find('#t1 [title="Add Leaf Node"]').exists()).toBe(false)
    expect(wrapper.find('#t1 [title="edit"]').exists()).toBe(false)
    expect(wrapper.find('#t1 [title="delete"]').exists()).toBe(false)
  })

  it('emits delete-node with current node payload', async () => {
    const tree = new Tree([{ name: 'Node 1', id: 't1', pid: 0 }])
    const wrapper = mount(VueTreeList, {
      props: { model: tree.root },
    })

    await wrapper.find('#t1 [title="delete"]').trigger('click')

    const deleteEvents = wrapper.emitted('delete-node')
    expect(deleteEvents).toBeTruthy()
    const payload = deleteEvents?.[0][0] as { id: string; name: string }
    expect(payload.id).toBe('t1')
    expect(payload.name).toBe('Node 1')
  })
})
