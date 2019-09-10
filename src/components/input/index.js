/**
* 数字输入域
* @component TpInput
* @author 陈柱良
* @time 2019/04/10
*/
import TpInput from './src/Input.vue';

TpInput.install = function(Vue) {
  Vue.component(TpInput.name, TpInput);
};

export default TpInput;