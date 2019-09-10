/**
* 数据表格
* @component TpTable
* @author 陈柱良
* @time 2019/04/18
*/
import TpTable from './src/Table.vue';

TpTable.install = function(Vue) {
  Vue.component(TpTable.name, TpTable);
};

export default TpTable;