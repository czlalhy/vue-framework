<template>
    <div class="login-form-wrapper">
        <el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm login-container">
            <h3 class="title">{{ 'gBtnLogin' | translate('Sign in')}}（{{version}}）</h3>
            <el-form-item prop="account" :label="'gAccounts' | translate('Accounts')" label-position="top">
                <el-input type="text" :autofocus="true" :maxlength="maxlength" id="account" v-model="form.account" auto-complete="off" @keyup.enter.native="next('checkPass')"></el-input>
            </el-form-item>
            <span style="color: red;" v-if="isLock">{{errorMessage}}</span>
            <el-form-item prop="checkPass" :label="'gPassword' | translate('Password')" label-position="top">
                <el-input type="password" v-model="form.checkPass" id="checkPass" auto-complete="off" @keyup.enter.native="next('submitLogin')"></el-input>
            </el-form-item>
            <span style="color: red;" v-if="isWrong">{{errorMessage}}</span>
            <el-form-item v-if="islanguage" prop="language" :label="'gTitleLanguage' | translate('Language')" label-position="top">
                <el-select v-model="form.language" @change="setI18n" class="login-select">
                    <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="login-btn-item">
                <el-button type="primary" style="width:45%;" id="submitLogin" @submit.native="handleSubmit" @click.native.prevent="submit">{{ 'gBtnLogin' | translate('Sign in')}}</el-button>
            </el-form-item>
            <transition name="fade">
                <el-dialog :title="dialogLoading.status" :showClose="false" :closeOnClickModal="false" :visible.sync="dialogLoading.showLoading" class="dialog-small">
                    <h4 style="margin-top: 5px; margin-bottom: 5px;">{{dialogLoading.statusText}}<a href="javascript:;" style="margin-left: 10px;" @click=onClickMore>More</a></h4>
                    <span v-if="msgVisable">{{dialogLoading.msg}}</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="handleSure">{{"gBtnConfirm"| translate("Confirm")}}</el-button>
                    </span>
                </el-dialog>
            </transition>
        </el-form>
    </div>
</template>
<script>
import Vue from 'vue';
export default {
    name: 'TpLogin',
    data: function() {
        return {
            maxlength: 30,
            version: '',
            logining: false,
            form: {
                language: '',
                account: '',
                checkPass: '',
                code: ''
            },
            rules: {
                account: [{
                    required: true,
                    message: 'Please input account number.',
                    trigger: 'change'
                }],
                checkPass: [{
                    required: true,
                    message: 'Please input a password',
                    trigger: 'blur'
                }]
            },
            options: [{
                value: 'en',
                label: Vue.tpUtil.getInzTranslate('gTitleEn')
            }, {
                value: 'zh',
                label: Vue.tpUtil.getInzTranslate('gTitleZh')
            }],
            isWrong: false,
            isLock: false,
            errorMessage: '',
            msgVisable: false,
            islanguage: false
        };
    },
    computed: {
        dialogLoading() {
            return this.$store.state.dialog
        }
    },
    created() {
        opener = null;
        this.$store.commit('MENU_SHOW', true);
        if (!localStorage.getItem('_i18') && _gc);
        localStorage.setItem('_i18', _gc);
        this.form.language = _gc;
        var config = Vue.tpUtil.getConfig();
        this.islanguage = config.islanguage;
        this.maxlength = config.maxlength;
        this.version = config.version;
    },
    methods: {
        handleSubmit(ev) {
            if (ev.keyCode === 13) {
                this.submit()
            }
        },
        setI18n() {
            var c = localStorage.getItem('_i18') == 'en' ? 'en' : 'zh';
            if (this.form.language !== c) {
                localStorage.setItem('_i18', this.form.language);
                window.location.reload();
            }
        },
        next(ids) {
            document.querySelector('#' + ids).focus();
        },
        submit() {
            var _this = this;
            this.$refs.form.validate(function(valid) {
                if (valid) {
                    _this.handleRequest();
                } else {
                    return false;
                }
            });
        },
        handleRequest() {
            var _this = this,
                loginParams = {
                    userCode: this.form.account,
                    password: this.form.checkPass,
                    _source: '1'
                },
                msg = '';
            this.requestLogin(loginParams).then(function(d) {
                if (d.resCode === '0000') {
                    sessionStorage.setItem('name', d.resData.userCode);
                    var user = JSON.stringify(d.resData);
                    sessionStorage.setItem('user', user);
                    Vue.tpUtil.setCache('login', 'logingFlag', true);

                    Vue.tpUtil.redirectTo({ path: '/home' });
                } else if (d.resCode === '0006') {
                    if (d.resMsg === 'locked') {
                        _this.isLock = true;
                        _this.isWrong = false;
                        msg = 'This account is locked, please contact the administrator';
                    } else if (d.resMsg === 'wrong account/password') {
                        _this.isLock = true;
                        _this.isWrong = false;
                        msg = 'The account or password is incorrect, and if enter wrong password more than ' + d.resData.failedTimes + ' times, this account will be locked';
                    } else if (d.resMsg === 'expired password') {
                        _this.isLock = true;
                        _this.isWrong = false;
                        msg = 'The password is expired, please contact the administrator!';
                    }
                    d.traceID && (msg += '；TraceID = ' + d.traceID);
                    _this.errorMessage = msg;
                }
            }, function(e) {
                _this.isLock = false;
                _this.isWrong = true;
                msg = 'Please try again later.[' + e.response.data.resCode + ']';
                e.response.data.traceID && (msg += '；TraceID = ' + e.response.data.traceID);
                _this.errorMessage = msg;
            });
        },

        requestLogin(params) {
            var url = Vue.tpUtil.getUrl({
                apiName: 'layoutAuth',
                contextName: 'auth'
            });
            return Vue.tpUtil.http.post(url, params, { clearToken: true });
        },
        handleSure() {
            this.$store.commit('COMMIT_DIALOG', {
                'msg': '',
                'status': '',
                'statusText': '',
                'showLoading': false
            });
            this.msgVisable = false;
        },
        onClickMore() {
            this.msgVisable = !this.msgVisable
        }
    }
}
</script>