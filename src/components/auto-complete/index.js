/**
* 可搜索下拉
* @component TpAutoComplete
* @author 陈柱良
* @time 2019/04/17
*/
import TpAutoComplete from './src/AutoComplete.vue';

TpAutoComplete.install = function(Vue) {
  Vue.component(TpAutoComplete.name, TpAutoComplete);
};

export default TpAutoComplete;