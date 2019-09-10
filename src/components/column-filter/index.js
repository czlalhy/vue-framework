/**
* 表格列过滤
* @component TpColumnFilter
* @author 陈柱良
* @time 2019/04/10
*/
import TpColumnFilter from './src/ColumnFilter.vue';

TpColumnFilter.install = function(Vue) {
  Vue.component(TpColumnFilter.name, TpColumnFilter);
};

export default TpColumnFilter;