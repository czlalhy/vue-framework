/**
* 单选框
* @component TpRadioGroup
* @author 陈柱良
* @time 2019/04/10
*/
import TpRadioGroup from './src/RadioGroup.vue';

TpRadioGroup.install = function(Vue) {
  Vue.component(TpRadioGroup.name, TpRadioGroup);
};

export default TpRadioGroup;