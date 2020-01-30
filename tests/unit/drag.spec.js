import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { Tree, VueTreeList } from '@/index'

describe('Drag', () => {
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
          },
          {
            name: 'Node 1-2',
            id: 't12',
            pid: 't1'
          }
        ]
      },
      {
        name: 'Node 2',
        id: 't2',
        pid: 0
      },
      {
        name: 'Node 3',
        id: 't3',
        pid: 0
      }
    ])
    wrapper = mount(VueTreeList, { propsData: { model: new Tree([]) } })
    wrapper.setProps({ model: tree })
  })

  it('drag before', done => {
    const $tree2 = wrapper.find('#t2 .vtl-node-main')
    const $tree1Up = wrapper.find('#t1 .vtl-up')
    $tree2.trigger('dragstart', { dataTransfer: { setData: () => {} } })
    $tree1Up.trigger('drop')
    Vue.nextTick(() => {
      expect(wrapper.find('.vtl-node').attributes('id')).toBe('t2')
      done()
    })
  })

  it('drag after', done => {
    const $tree3 = wrapper.find('#t3 .vtl-node-main')
    const $tree1Bottom = wrapper.find('#t1 .vtl-bottom')
    $tree3.trigger('dragstart', { dataTransfer: { setData: () => {} } })
    $tree1Bottom.trigger('drop')
    Vue.nextTick(() => {
      expect(
        wrapper
          .findAll('.vtl-tree-node')
          .at(2)
          .attributes('id')
      ).toBe('t3')
      done()
    })
  })

  it('drag into', done => {
    const $tree3 = wrapper.find('#t3 .vtl-node-main')
    const $tree1 = wrapper.find('#t1 .vtl-node-main')
    $tree3.trigger('dragstart', { dataTransfer: { setData: () => {} } })
    $tree1.trigger('drop')
    Vue.nextTick(() => {
      expect(wrapper.find('#t1 + .vtl-tree-margin .vtl-node').attributes('id')).toBe('t3')
      done()
    })
  })

  it('cannot drag ancestor into child', done => {
    const snapshot = wrapper.html()
    const $tree1 = wrapper.find('#t1 .vtl-node-main')
    const $tree1Child = wrapper.find('#t12 .vtl-node-main')
    $tree1.trigger('dragstart', { dataTransfer: { setData: () => {} } })
    $tree1Child.trigger('drop')
    Vue.nextTick(() => {
      expect(wrapper.html()).toBe(snapshot)
      done()
    })
  })
})
