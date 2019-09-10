/**
* 导入Execl为JSON
* @component TpImportExecl
* @author 陈柱良
* @time 2019/04/11
*/
import TpImportExecl from './src/ImportExecl.vue';

TpImportExecl.install = function(Vue) {
  Vue.component(TpImportExecl.name, TpImportExecl);
};

export default TpImportExecl;