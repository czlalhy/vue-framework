import Vue from 'vue'
import store from '../vuex/store'
import Axios from 'axios'

var params = {
        timeout: 300000,
        path: '',
        authValue: 'Arch6WithCloud',
        authName: 'Authorization'
    },
    shadeNum = 0,
    commit = store.commit || store.dispatch,
    axiosObject = {
        setTimeouts: function(obj) {
            params.timeout = obj || params.timeout;
        },
        setPath: function(obj) {
            params.path = obj || params.path;
        },
        setAuthValue: function(obj) {
            params.authValue = obj || params.authValue;
        },
        setAuthName: function(obj) {
            params.authName = obj || params.authName;
        }
    };
var language = !localStorage.getItem('_i18') ? 'zh' : localStorage.getItem('_i18'),
    tpSessionId = getTpSessionId();
if(!axios)
    axios = Axios;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Arch6-Language'] = language;
tpSessionId && (axios.defaults.headers.common['tpSessionId'] = tpSessionId);

/**
 * axios 公共配置
 * [1] 拦截请求
 * [2] 拦截返回
 */
axios.interceptors.request.use(function(config) {
    // if(!tpSessionId) {
    //     tpSessionId = getTpSessionId();
    // }

    // if(tpSessionId && !axios.defaults.headers.common.tpSessionId) {
    //     axios.defaults.headers.common['tpSessionId'] = tpSessionId;
    // }
    // 超时设置
    config.timeout = config.timeout || params.timeout;
    config.url = params.path + config.url;
    // if (config.url.indexOf('?') > -1) {
    //    config.url += '&_t=' + new Date().getTime();
    // } else {
    //    config.url += '?_t=' + new Date().getTime();
    // }
    // 遮罩
    var shade = config.shade === undefined ? true : config.shade;
    if (!!shade && typeof(commit) === 'function') {
        commit('LOADING', true, config.shadeMsg);
        shadeNum++;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
})

axios.interceptors.response.use(function(response) {
    // 关闭遮罩
    var shade = response.config.shade
    shade = shade === undefined ? true : shade
    if (shade && typeof(commit) === 'function') {
        if (shadeNum > 0) {
            --shadeNum;
        }
        if (shadeNum === 0) {
            commit('LOADING', false);
        }
    }
    if (response.data && response.data.resCode !== '0000' && response.data.resCode !== '0006') {
        var _d = response.config.data ? JSON.parse(response.config.data) : {};
        if (response.data.resCode === '401' || response.data.resCode === '0006') {
            if (!response.config.clearToken) {
                alertInfo(true);
            } else if (!_d._source || _d._source !== '1') {
                alertInfo(false, response, true);
            }
        } else if (!_d._source || _d._source !== '1') {
            alertInfo(false, response, true);
        }
    }
    if (!tpSessionId) {
        tpSessionId = response.data.resData && response.data.resData.tpSessionId;
        if (tpSessionId && !axios.defaults.headers.common.tpSessionId) {
            axios.defaults.headers.common['tpSessionId'] = tpSessionId;
        }
    }
    return response.data;
}, function(error) {
    // 关闭遮罩
    var shade = error.config && error.config.shade
    shade = shade === undefined ? true : shade
    if (shade && typeof(commit) === 'function') {
        if (shadeNum > 0) {
            --shadeNum;
        }
        if (shadeNum === 0) {
            commit('LOADING', false);
        }
    }
    if (error.response && error.response.data && (error.response.data.resCode === '0006' || error.response.data.resCode !== '0000')) {
        var _d = error.response.config.data ? JSON.parse(error.response.config.data) : {};
        if (error.response.data.resCode === '401' || error.response.data.resCode === '0006') {
            if (!error.response.config.clearToken) {
                alertInfo(true);
            } else if (!_d._source || _d._source !== '1') {
                alertInfo(false, error);
            }
        } else if (!_d._source || _d._source !== '1') {
            alertInfo(false, error);
        }
    } else {
        alertInfo(false, error);
    }
    return Promise.reject(error);
});

function getTpSessionId() {
    var _tpSessionId = '',
        user = sessionStorage.getItem('user');
    if (user) {
        user = JSON.parse(user);
        _tpSessionId = user.tpSessionId || '';
    }
    return _tpSessionId;
}

function alertInfo(flag, data, b) {
    if (flag) {
        Vue.tpUtil.destroyApp();
        commit('COMMIT_DIALOG_LOGIN', { 'showLoading': true })
    } else {
        var statusText = '',
            msg = '';
        if (!b) {
            statusText = Vue.tpUtil.getInzTranslate('g' + data.response.data.resCode) + '【' + data.response.data.resCode + '】';
            if (data.response.data.traceID) {
                statusText += '；TraceID = ' + data.response.data.traceID;
                msg = 'TraceID = ' + data.response.data.traceID + '；SpanID=' + data.response.data.spanID + '。';
            }
            if (data.response.data) {
                msg += data.response.data.resMsg;
            } else {
                msg += 'error';
            }
            //commit('COMMIT_DIALOG', { 'statusText': statusText, 'status': 'Tips', 'msg': msg, 'showLoading': true })
        } else {
            statusText = Vue.tpUtil.getInzTranslate('g' + data.data.resCode) + '【' + data.data.resCode + '】';
            if (data.data.traceID) {
                statusText += '；TraceID = ' + data.data.traceID;
                msg = 'TraceID = ' + data.data.traceID + '；SpanID=' + data.data.spanID + '。';
            }
            msg += data.data.resMsg;

        }
    }
    commit('COMMIT_DIALOG', { 'statusText': statusText, 'status': 'Tips', 'msg': msg, 'showLoading': true })
}

export default { axiosObject: axiosObject, axios: axios };