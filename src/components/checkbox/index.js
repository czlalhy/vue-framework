/**
* 多选框
* @component TpCheckbox
* @author 陈柱良
* @time 2019/04/10
*/
import TpCheckbox from './src/Checkbox.vue';

TpCheckbox.install = function(Vue) {
  Vue.component(TpCheckbox.name, TpCheckbox);
};

export default TpCheckbox;