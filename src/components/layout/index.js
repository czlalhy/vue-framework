/**
* 框架
* @component TpLayout
* @author 陈柱良
* @time 2019/04/10
*/
import TpLayout from './src/Layout.vue';

TpLayout.install = function(Vue) {
  Vue.component(TpLayout.name, TpLayout);
};

export default TpLayout;