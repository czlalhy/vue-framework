import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n';
Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        count: 10,
        homeTitleName: '',
        homeType: '',
        pageLoading: false,
        menuShow: !opener ? true : false,
        dialog: {
            msg: '',
            showLoading: false
        },
        loading: {
            showLoading: false,
            showLoadMsg: ''
        },
        dialogLogin: {
            showLoading: false,
            isReload: false
        },
        breadcrumbs: [],
        quotationBasicInfo: {},
        cache: {}
    },
    mutations: {
        INCREMENT: function(state) {
            state.count++
        },
        DECREMENT: function(state) {
            state.count--
        },
        PAGE_LOADING: function(state, isShow) {
            state.pageLoading = isShow;
        },
        LOADING: function(state, isShow, msg) {
            state.loading.showLoading = isShow;
            state.loading.showLoadMsg = msg && msg !== '' ? msg : 'Requests for data...';
        },
        UPDATE_HONE_TITLE: function(state, homeTitleName) {
            state.homeTitleName = homeTitleName;
        },
        CHANGE_HOME: function(state, opt) {
            state.homeType = opt.type;
        },
        COMMIT_DIALOG: function(state, opt) {
            state.dialog.msg = opt.msg;
            state.dialog.statusText = opt.statusText;
            state.dialog.status = opt.status + '';
            state.dialog.showLoading = opt.showLoading;
        },
        COMMIT_DIALOG_LOGIN: function(state, opt) {
            state.dialogLogin.showLoading = opt.showLoading;
            state.dialogLogin.isReload = opt.isReload ? true : false;
        },
        UPDATE_QUOBAINFO: function(state, obj) {
            state.quotationBasicInfo = obj
        },
        UPDATE_CACHE: function(state, obj) {
            $.extend(true, state.cache, obj || {});
        },
        DESTROYED_CACHE: function(state, key) {
            if (key && state.cache[key]) {
                state.cache[key] = null;
                delete state.cache[key];
            }
        },
        BREADCRUMBS: function(state, breadcrumbs) {
            if (breadcrumbs) {
                state.breadcrumbs = breadcrumbs;
            }
        },
        BREADCRUMBS_TO: function(state, breadcrumbs) {
            if (breadcrumbs && state.breadcrumbs) {
                state.breadcrumbs.push(breadcrumbs);
            }
        },
        MENU_SHOW: function(state, flag) {
            state.menuShow = flag || false;
        }
    },
    actions: {

    },
    modules: {
        i18n: vuexI18n.store
    }
});

Vue.use(vuexI18n.plugin, store);

export default store