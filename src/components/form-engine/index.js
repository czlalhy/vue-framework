
/**
* 表单引擎
* @component TpFormEngine
* @author 陈柱良
* @time 2019/04/11
*/
import TpFormEngine from './src/FormEngine.vue';

TpFormEngine.install = function(Vue) {
  Vue.component(TpFormEngine.name, TpFormEngine);
};

export default TpFormEngine;