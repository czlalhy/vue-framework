/**
* 数据表格
* @component TpTable
* @author 陈柱良
* @time 2019/04/18
*/
import ZkTable from './src/Table.vue';

ZkTable.install = function(Vue) {
  Vue.component(ZkTable.name, ZkTable);
};

export default ZkTable;