/**
* 折叠组件
* @component TpCollapseItem
* @author 胡丽君
* @time 2019/04/10
*/
import TpCollapseItem from './src/CollapseItem.vue';

TpCollapseItem.install = function(Vue) {
  Vue.component(TpCollapseItem.name, TpCollapseItem);
};

export default TpCollapseItem;