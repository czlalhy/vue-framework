import Vue from 'vue'
import TpUtil from './util'
import './filter'
import Store from '../vuex/store'
import Router from './router'
TpUtil.regSmallApp(Router, true);
function plugin(Vue) {
    Vue.tpUtil = TpUtil;
}
Vue.use(plugin);

Vue.tpUtil.setStore({store: Store});