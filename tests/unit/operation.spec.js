import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { Tree, VueTreeList } from '@/index'

describe('Operation', () => {
  let wrapper

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
            pid: 't1'
          }
        ]
      },
      {
        name: 'Node 2',
        id: 't2',
        pid: 0
      }
    ])
    wrapper = mount(VueTreeList, { propsData: { model: new Tree([]) } })
    wrapper.setProps({ model: tree })
  })

  it('delete leaf node', done => {
    const $node11Trash = wrapper.find('#t11 [title="delete"]')
    $node11Trash.trigger('click')
    wrapper.emitted('delete-node')[0][0].remove()
    Vue.nextTick(() => {
      expect(wrapper.findAll('.vtl-node').length).toBe(2)
      done()
    })
  })

  it('delete tree node', done => {
    const $node11Trash = wrapper.find('#t1 [title="delete"]')
    $node11Trash.trigger('click')
    wrapper.emitted('delete-node')[0][0].remove()
    Vue.nextTick(() => {
      expect(wrapper.findAll('.vtl-node').length).toBe(1)
      done()
    })
  })

  it('add leaf node', done => {
    const $node1AddLeafNode = wrapper.find('#t1 [title="Add Leaf Node"]')
    $node1AddLeafNode.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.findAll('.vtl-leaf-node').length).toBe(2)
      done()
    })
  })

  it('add tree node', done => {
    const $node1AddTreeNode = wrapper.find('#t1 [title="Add Tree Node"]')
    $node1AddTreeNode.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.findAll('.vtl-tree-node').length).toBe(3)
      done()
    })
  })

  it('change node name', done => {
    const $node1Edit = wrapper.find('#t1 [title="edit"]')
    $node1Edit.trigger('click')
    Vue.nextTick(() => {
      const $input = wrapper.find('#t1 .vtl-input')
      $input.element.value = 'New Node 1'
      $input.trigger('input')
      var event = new KeyboardEvent('keyup', { keyCode: 13 })
      window.dispatchEvent(event)
      Vue.nextTick(() => {
        expect(wrapper.find('#t1').text()).toBe('New Node 1')
        done()
      })
    })
  })
})
