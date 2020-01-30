/**
 * Created by ayou on 17/7/21.
 */

import VueTreeList from './VueTreeList'
import { Tree, TreeNode } from './Tree'

VueTreeList.install = Vue => {
  Vue.component(VueTreeList.name, VueTreeList)
}

export default VueTreeList
export { Tree, TreeNode, VueTreeList }
