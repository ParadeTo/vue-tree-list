import { mount } from "@vue/test-utils";
import { Tree, VueTreeList } from "@/index";

describe("VueTreeList", () => {
  it("renders correctly", () => {
    const wrapper = mount(VueTreeList, {
      propsData: {
        model: new Tree([
          {
            name: "Node 1",
            id: 1,
            pid: 0,
            dragDisabled: true,
            addTreeNodeDisabled: true,
            addLeafNodeDisabled: true,
            editNodeDisabled: true,
            delNodeDisabled: true,
            children: [
              {
                name: "Node 1-2",
                id: 2,
                isLeaf: true,
                pid: 1
              }
            ]
          },
          {
            name: "Node 2",
            id: 3,
            pid: 0,
            disabled: true
          },
          {
            name: "Node 3",
            id: 4,
            pid: 0
          }
        ]),
        defaultTreeNodeName: "new node",
        defaultLeafNodeName: "new leaf",
        defaultExpanded: false
      }
    });

    expect(wrapper.text()).toMatch(`Node 1················
            Node 1-2················
            Node 2················
            Node 3`);
  });
});
