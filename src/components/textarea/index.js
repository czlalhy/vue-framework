/**
* 多行文本
* @component TpTextarea
* @author 陈柱良
* @time 2019/04/18
*/
import TpTextarea from './src/Textarea.vue';

TpTextarea.install = function(Vue) {
  Vue.component(TpTextarea.name, TpTextarea);
};

export default TpTextarea;