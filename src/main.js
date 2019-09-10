import Vue from 'vue'
import ElementUI from 'element-ui';
import { mockXHR } from '../mock'
import App from './App.vue'
import router from './router'
import index from './index'
import config from './app.config'


Vue.tpUtil.setRouter(router);
Vue.tpUtil.setContext(config.context);
Vue.tpUtil.setApi(config.api);
Vue.tpUtil.setConfig(config.config);
const store = Vue.tpUtil.getStore();
mockXHR()
Vue.config.productionTip = false

Vue.use(ElementUI);

const translationsEn = {
    "content": "This is some {type} content"
};


const translationsDe = {
    "My nice title": "Ein schöner Titel",
    "content": "Dies ist ein toller Inhalt"
};

Vue.i18n.add('en', translationsEn);
Vue.i18n.add('de', translationsDe);

Vue.i18n.set('en');

router.beforeEach(function(to, from, next) {
    store.commit('PAGE_LOADING', true);
    var user = JSON.parse(sessionStorage.getItem('user')),
        menuFlag = Vue.tpUtil.getCache('menu', 'menuFlag');
    //opener && $('#sys_title').html(Vue.tpUtil.getInzTranslate(to.name) || to.name || '' + '-' + Vue.tpUtil.getInzTranslate('gSysTitle'));
    if (!user && to.path !== '/login') {
        next({ path: '/login' })
    } else if (user && to.path === '/login') {
        next({ path: '/' })
    } else if (user && !menuFlag && to.path !== '/') {
        sessionStorage.setItem('menuValueSearch', Vue.tpUtil.getSearchString(window.location.hash))
        sessionStorage.setItem('menuValue', to.path)
        next({ path: '/' })
    } else {
        if (true) {
            next()
        } else {
            next({ path: '/error' })
        }
    }
});
router.afterEach(function() {
    setTimeout(function() {
        store.commit('PAGE_LOADING', false);
    }, 300);
});

// new Vue({
//   el: '#app',
//   router: router,
//   store: store,
//   template: '<App/>',
//   components: { App }
// })

new Vue({
    router,
    store,
    render: h => h(App),
    
    created: function() {
        //Vue.tpUtil.setRouterObject(this.$router);
    }
    
}).$mount('#app')