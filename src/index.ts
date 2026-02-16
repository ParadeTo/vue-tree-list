import type { App } from 'vue'
import VueTreeList from './VueTreeList.vue'
import { Tree, TreeNode } from './Tree'
import type { TreeNodeData } from './Tree'

const install = (app: App): void => {
  app.component('VueTreeList', VueTreeList)
}

export default VueTreeList
export { Tree, TreeNode, VueTreeList, install }
export type { TreeNodeData }
