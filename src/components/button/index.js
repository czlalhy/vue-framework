/**
* 按钮
* @component TpButton
* @author 陈柱良
* @time 2019/04/10
*/
import TpButton from './src/Button.vue';

TpButton.install = function(Vue) {
  Vue.component(TpButton.name, TpButton);
};

export default TpButton;