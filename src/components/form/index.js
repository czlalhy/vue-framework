/**
* 数据表格
* @component TpTable
* @author 陈柱良
* @time 2019/04/18
*/
import ZkForm from './src/Form.vue';

ZkForm.install = function(Vue) {
  Vue.component(ZkForm.name, ZkForm);
};

export default ZkForm;