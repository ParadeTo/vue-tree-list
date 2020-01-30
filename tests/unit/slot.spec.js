import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { Tree, VueTreeList } from '@/index'

describe('Slot', () => {
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
    wrapper = mount(VueTreeList, {
      propsData: { model: new Tree([]) },
      scopedSlots: {
        addTreeNodeIcon() {
          return <span class='add-tree-node-icon'>📂</span>
        },
        addLeafNodeIcon() {
          return <span class='icon'>＋</span>
        },
        editNodeIcon() {
          return <span class='icon'>📃</span>
        },
        delNodeIcon(slotProps) {
          return slotProps.model.isLeaf || !slotProps.model.children ? (
            <span class='del-node-icon'>✂️</span>
          ) : (
            <span />
          )
        },
        leafNodeIcon() {
          return <span class='icon'>🍃</span>
        },
        treeNodeIcon(slotProps) {
          return (
            <span class='tree-node-icon icon'>
              {slotProps.model.children &&
              slotProps.model.children.length > 0 &&
              !slotProps.expanded
                ? '🌲'
                : '❀'}
            </span>
          )
        }
      }
    })
    wrapper.setProps({ model: tree })
  })

  it('render slot correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('toggle tree node show different icon', done => {
    const $caretDown = wrapper.find('.vtl-icon-caret-down')
    expect(wrapper.find('#t1 .tree-node-icon').text()).toBe('❀')
    $caretDown.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.exists('.vtl-icon-caret-right')).toBe(true)
      expect(wrapper.find('#t1 .tree-node-icon').text()).toBe('🌲')
      done()
    })
  })

  it('dont show ✂️ after add child ', done => {
    const $addTreeNodeIcon = wrapper.find('#t2 .add-tree-node-icon')
    expect(wrapper.find('#t2 .del-node-icon').exists()).toBe(true)
    $addTreeNodeIcon.trigger('click')
    Vue.nextTick(() => {
      expect(wrapper.find('#t2 .del-node-icon').exists()).toBe(false)
      done()
    })
  })
})
