import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { Tree, VueTreeList } from '../../src/index'
import type { TreeNode } from '../../src/index'

describe('Slot', () => {
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
      slots: {
        addTreeNodeIcon: () => h('span', { class: 'add-tree-node-icon' }, '📂'),
        addLeafNodeIcon: () => h('span', { class: 'icon' }, '＋'),
        editNodeIcon: () => h('span', { class: 'icon' }, '📃'),
        delNodeIcon: (slotProps: { model: TreeNode }) => {
          return slotProps.model.isLeaf || !slotProps.model.children
            ? h('span', { class: 'del-node-icon' }, '✂️')
            : h('span')
        },
        leafNodeIcon: () => h('span', { class: 'icon' }, '🍃'),
        treeNodeIcon: (slotProps: { model: TreeNode; expanded: boolean }) => {
          return h(
            'span',
            { class: 'tree-node-icon icon' },
            slotProps.model.children && slotProps.model.children.length > 0 && !slotProps.expanded
              ? '🌲'
              : '❀',
          )
        },
      },
    })
  })

  it('render slot correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('toggle tree node show different icon', async () => {
    const $caretDown = wrapper.find('.vtl-icon-caret-down')
    expect(wrapper.find('#t1 .tree-node-icon').text()).toBe('❀')
    await $caretDown.trigger('click')
    await nextTick()
    expect(wrapper.find('.vtl-icon-caret-right').exists()).toBe(true)
    expect(wrapper.find('#t1 .tree-node-icon').text()).toBe('🌲')
  })

  it('dont show ✂️ after add child', async () => {
    const $addTreeNodeIcon = wrapper.find('#t2 .add-tree-node-icon')
    expect(wrapper.find('#t2 .del-node-icon').exists()).toBe(true)
    await $addTreeNodeIcon.trigger('click')
    await nextTick()
    expect(wrapper.find('#t2 .del-node-icon').exists()).toBe(false)
  })
})
