/**
* 浮动菜单/楼层/导航定位组件
* @component TpFloatMenu
* @author 陈柱良
* @time 2019/04/11
*/
import TpFloatMenu from './src/FloatMenu.vue';

TpFloatMenu.install = function(Vue) {
  Vue.component(TpFloatMenu.name, TpFloatMenu);
};

export default TpFloatMenu;