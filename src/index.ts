/**
 * Created by ayou on 17/7/21.
 */

import VueTreeList from './VueTreeList.vue'
import { Tree, TreeNode } from './Tree'
import { App } from 'vue'

export default {
  ...VueTreeList,
  install(app: App) {
    app.component(VueTreeList.name, VueTreeList)
  }
}
export { Tree, TreeNode, VueTreeList }
