/**
* 加载
* @component TpLoading
* @author 陈柱良
* @time 2019/04/10
*/
import TpLoading from './src/Loading.vue';

TpLoading.install = function(Vue) {
  Vue.component(TpLoading.name, TpLoading);
};

export default TpLoading;