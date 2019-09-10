/**
* 登陆
* @component TpLogin
* @author 陈柱良
* @time 2019/04/10
*/
import TpLogin from './src/Login.vue';

TpLogin.install = function(Vue) {
  Vue.component(TpLogin.name, TpLogin);
};

export default TpLogin;