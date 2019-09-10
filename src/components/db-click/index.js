/**
*  双击域
* @component TpDbClick
* @author 陈柱良
* @time 2019/04/17
*/
import TpDbClick from './src/DbClick.vue';

TpDbClick.install = function(Vue) {
  Vue.component(TpDbClick.name, TpDbClick);
};

export default TpDbClick;