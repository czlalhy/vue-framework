<template>
    <div>
        <layout-top v-if="layoutType == 'top'" :menus="menus"></layout-top>
        <layout-left v-if="layoutType == 'left'" :menus="menus"></layout-left>
        <transition name="fade">
            <el-dialog :title="dialogLoading.status" :close-on-click-modal="false" :showClose="false" :visible.sync="dialogLoading.showLoading" class="dialog-small">
                <h4 style="margin-top: 5px; margin-bottom: 5px;">{{dialogLoading.statusText}}<a href="javascript:;" style="margin-left: 10px;" @click=onClickMore>More</a></h4>
                <span v-if="msgVisable">{{dialogLoading.msg}}</span>
                <span slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click="handleSure">{{"gBtnConfirm"| translate("Confirm")}}</el-button>
                                </span>
            </el-dialog>
        </transition>
        <transition name="fade">
            <el-dialog :title="'g401' | translate('Token expired, please log in')" :visible.sync="dialogLogin.showLoading" custom-class="dialogForm" :close-on-click-modal="false" :showClose="false" :before-close="onCloseDialog" class="dialog-login">
                <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item prop="account">
                        <el-input :placeholder="'gAccounts' | translate('Accounts')" size="mini" v-model="form.account"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" :placeholder="'gPassword' | translate('Password')" size="mini" v-model="form.checkPass"></el-input>
                    </el-form-item>
                    <el-form-item align="center">
                        <el-button size="mini" type="primary" @click="handleSubmit">{{ 'gBtnLogin' | translate('Sign in')}}</el-button>
                        <el-button size="mini" @click="onCloseDialog(0)">{{ 'gBtnClose' | translate('Close')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </transition>
    </div>
</template>
<script>
import Vue from 'vue';
import LayoutLeft from './LayoutLeft'
import LayoutTop from './LayoutTop'
import layoutService from './layoutService'
export default {
    name: 'TpLayout',
    props: {
        msg: String
    },
    data: function() {
        return {
            menus: [],
            collapsed: false,
            sysUserName: '',
            form: {
                account: '',
                checkPass: ''
            },
            rules: {
                account: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'change'
                }],
                checkPass: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'change'
                }]
            },
            msgVisable: false
        }
    },
    created() {
        this.initMenu();
        this.initPage();
    },
    computed: {
        layoutType: function() {
            return this.$store.state.homeType || 'top';
        },
        dialogLoading: function() {
            return this.$store.state.dialog;
        },
        dialogLogin: function() {
            return this.$store.state.dialogLogin;
        }
    },
    methods: {
        initPage() {

        },
        //初始化菜单
        initMenu() {
            var navMenus = [],
                c = localStorage.getItem('_i18') || 'en',
                _this = this;

            if (Vue.tpUtil.getCache('menu', 'menuFlag')) {
                this.menus = Vue.tpUtil.getCache('menu', 'menusData');
                _this.jump();
            } else {
                this.getAllSystemMenuApi({
                    platform: 'platform'
                }).then(function(res) {
                    if (res.resCode === '0000') {
                        var m = res.resData.navMenusData;
                        if (m && m.children && m.children.length > 0) {
                            navMenus = navMenus.concat(m.children);
                        }
                        Vue.tpUtil.setCache('menu', 'menuFlag', true);
                        layoutService.handleMenus(navMenus, c);
                        _this.menus = navMenus;
                        _this.jump();
                    }
                }, function() {
                    Vue.tpUtil.setCache('menu', 'menuFlag', false);
                    var time = setTimeout(function() {
                        _this.$store.commit('COMMIT_DIALOG', { 'showLoading': false })
                        _this.onCloseDialog(0);
                        clearTimeout(time);
                    }, 5000);
                    Vue.tpUtil.alert({
                        msg: 'The menu request failed, after 5 seconds to jump on the login page, please log in again',
                        confirmButtonText: 'Jump Logon'
                    }).then(function() {
                        _this.$store.commit('COMMIT_DIALOG', { 'showLoading': false })
                        _this.onCloseDialog(0);
                        clearTimeout(time);
                    }, function() {
                        _this.$store.commit('COMMIT_DIALOG', { 'showLoading': false })
                        _this.onCloseDialog(0);
                        clearTimeout(time);
                    });
                });
            }
        },
        //跳转页面
        jump() {
            this.$store.commit('CHANGE_HOME', { 'type': localStorage.getItem('_layoutType') || 'top' });
            var menuValue = sessionStorage.getItem('menuValue'),
                token = Vue.tpUtil.getCookie('TPTOKEN');
            if (token) {
                Vue.tpUtil.setTpToken(token.substring(7));
            }
            if (Vue.tpUtil.getCache('login', 'logingFlag') && Vue.tpUtil.getMenusForKey('/index/workbench_app').v) {
                Vue.tpUtil.setCache('login', 'logingFlag', false)
                sessionStorage.setItem('headerTitleTop', layoutService.getMenusNameForKey('/index/workbench_app'))
                Vue.tpUtil.redirectTo({ name: 'workbenchApp' });
            } else if (menuValue && menuValue !== '') {
                var menuValueSearch = Vue.tpUtil.getSearchJson(sessionStorage.getItem('menuValueSearch')),
                    r = { path: menuValue };

                if (menuValueSearch) {
                    r['query'] = menuValueSearch;
                }
                sessionStorage.removeItem('menuValue');
                sessionStorage.removeItem('menuValueSearch');
                Vue.tpUtil.redirectTo(r, true);
            }
        },
        //错误信息，点击更多
        onClickMore() {
            this.msgVisable = !this.msgVisable
        },
        //关闭登陆框
        onCloseDialog(flag) {
            this.$store.commit('COMMIT_DIALOG_LOGIN', {
                'showLoading': false
            });
            if (flag !== 1) {
                Vue.tpUtil.destroyApp(true);
            }
        },
        //确认登陆
        handleSubmit() {
            var _this = this;
            this.$refs.form.validate(function(valid) {
                if (valid) {
                    _this.handleLogin();
                }
            });
        },
        //处理登陆数据
        handleLogin() {
            var loginParams = {
                    userCode: this.form.account,
                    password: this.form.checkPass
                },
                msg = '',
                _this = this;

            this.requestLogin(loginParams).then(function(d) {
                if (d.resCode === '0000') {
                    var user = JSON.stringify(d.resData);
                    sessionStorage.setItem('user', user);
                    layoutService.setLogingFlag(true);
                    _this.onCloseDialog(1);
                    if (sessionStorage.getItem('name') !== d.resData.userCode || !Vue.tpUtil.getCache('menu', 'menuFlag')) {
                        sessionStorage.setItem('name', d.resData.userCode);
                        window.location.reload();
                        return;
                    }
                    sessionStorage.setItem('name', d.resData.userCode);
                    //资源超时，需要刷新
                    if (_this.$store.state.dialogLogin.isReload) {
                        window.location.reload();
                        return;
                    }
                    _this.form.checkPass = '';
                } else if (d.resCode === '0006') {
                    if (d.resMsg === 'locked') {
                        msg = 'This account is locked, please contact the administrator';
                    } else if (d.resMsg === 'wrong account/password') {
                        msg = 'The account or password is incorrect, and if enter wrong password more than ' + d.resData.failedTimes + ' times, this account will be locked';
                    } else if (d.resMsg === 'expired password') {
                        msg = 'The password is expired, please contact the administrator!';
                    }
                    d.traceID && (msg += '；TraceID = ' + d.traceID);
                    Vue.tpUtil.message(msg);
                }
            }, function(e) {
                msg = 'Please try again later.[' + e.response.data.resCode + ']';
                e.response.data.traceID && (msg += '；TraceID = ' + e.response.data.traceID);
                Vue.tpUtil.message(msg);
            });
        },
        //请求登陆数据
        requestLogin(params) {
            var url = Vue.tpUtil.getUrl({
                apiName: 'layoutAuth',
                contextName: 'auth'
            });
            return Vue.tpUtil.http.post(url, params, { clearToken: true });
        },
        //提示登陆框-确认
        handleSure() {
            this.$store.commit('COMMIT_DIALOG', {
                'msg': '',
                'status': '',
                'statusText': '',
                'showLoading': false
            });
            this.msgVisable = false;
        },
        /**
         * 获取功能菜单所有数据
         */
        getAllSystemMenuApi(params) {
            var url = Vue.tpUtil.getUrl({
                apiName: 'layoutAllMenu',
                urlParams: { platform: params.platform },
                contextName: 'auth'
            });
            return Vue.tpUtil.http.get(url);
        }
    },
    components: {
        LayoutLeft,
        LayoutTop
    }
}
</script>