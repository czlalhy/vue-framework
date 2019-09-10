import Vue from 'vue'
import AxiosConfig from './axios'
import ApiService from './api'
import Mixins from '../mixins/index'
import Handle from './handle'


let cache = {
        login: { logingFlag: false },
        menu: {
            menuFlag: false, //是否加载菜单
            btnsData: null, //权限按钮数据
            menusData: null, //权限菜单数据
            authMenuData: null, //有权限的菜单
        },
        select: {},
    },
    plug = {
        router: null,
        store: null
    },
    params = {
        smallApps: [], //app.router.js 应用的路由，注册后销毁
        appNameForPath: {}, //通过name查path routerName->routerPath _routerKeys
        appConfigs: {}, //routerPath->routerConfig 除了可以请求的 _routerConfig
        appConfigsAllow: {}, // routerPath->routerConfig 可以请求的 _allowRouterConfig
        translations: {}, // 国际化数据保存,设置后销毁
        token: null,
        config: {
            version: '1.0.0.0',
            islanguage: false,
            maxlength: 30
        },
        pattern: {
            PATTERN_AMOUNT: /^(-)?(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d{2})?$/, // 金额
            PATTERN_WEIGHT: /^(-)?(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d{3})?$/, // 重量
            PATTERN_POSITIVE_INTEGER: /^[1-9]\d*$/, // 正整数
            PATTERN_INTEGER: /^-?\d+$/, // 整数
            PATTERN_DECIMAL: /^-?\d+\.\d{2}$/, // 2位小数
            PATTERN_HUNDRED: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, // 大于等于0小于等于100
            PATTERN_ZERO_INTEGER: /^\d+(\.\d+)?$/, // 大于或者等于0
            PATTERN_ORDERNO: /^[A-Za-z0-9]+$/, // 只能是数字或字母
            AllNumber: /^[0-9]+$/, //Must be number
            Hundred: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, // 大于等于0小于等于100
            Zero: /^\d+(\.\d+)?$/, // 大于或者等于0
            MoreZero: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/, // 大于0的小数或整数
        },
        components: {
            Home: { template: '<div><tp-layout/></div>' }
        }
    };

let tpUtil = {
    /**
     * http服务
     * @method http
     * @return {promise}
     */
    http: AxiosConfig.axios,

    /**
     * message提示
     * @method message
     * @param {String} msg 显示内容 
     * @param {Number} duration 显示时间
     * @param {String} type 显示类型
     * @return {promise}
     */
    message(msg, duration, type) {
        Vue.prototype.$message({ message: msg || '', duration: duration !== 0 ? (duration || 6000) : duration, type: type || 'error', showClose: true });
    },

    /**
     * 对话框提示
     * @method notify
     * @param {String} msg 显示内容 
     * @param {Number} duration 显示时间
     * @param {String} type 显示类型
     * @param {String} title 标题 默认：Tips
     * @return {promise}
     */
    notify: function(msg, duration, type, title) {
        Vue.prototype.$notify({ title: title || 'Tips', message: msg || '', duration: duration !== 0 ? (duration || 10000) : duration, type: type || 'warning', dangerouslyUseHTMLString: true, showClose: true });
    },

    /**
     * 提示对话框
     * @method alert
     * @param {Object} obj 
     * @return {promise}
     */
    alert(obj) {
        let o = {
                title: this.getInzTranslate('gTitlePrompt'),
                msg: '',
                confirmButtonText: null
            },
            d = {};
        o = Object.assign(o, obj);
        if (o.confirmButtonText) {
            d.confirmButtonText = o.confirmButtonText;
        }
        if (o.dangerouslyUseHTMLString) {
            d.dangerouslyUseHTMLString = o.dangerouslyUseHTMLString;
        }
        d.showClose = false;
        d.closeOnClickModal = false;
        return Vue.prototype.$alert(o.msg, o.title, d);
    },

    /**
     * 确认对话框
     * @method confirm
     * @param {Object} obj 
     * @return {promise}
     */
    confirm: function(obj) {
        var o = {
                title: this.getInzTranslate('gTitlePrompt'),
                msg: '',
                confirmButtonText: null,
                cancelButtonText: null
            },
            d = {};
        o = Object.assign(o, obj);
        if (o.confirmButtonText) {
            d.confirmButtonText = o.confirmButtonText;
        }
        if (o.cancelButtonText) {
            d.cancelButtonText = o.cancelButtonText;
        }
        if (o.dangerouslyUseHTMLString) {
            d.dangerouslyUseHTMLString = o.dangerouslyUseHTMLString;
        }
        d.showClose = false;
        d.closeOnClickModal = false;
        return Vue.prototype.$confirm(o.msg, o.title, d);
    },

    /**
     * 模态窗口
     * @method showModal
     * @param {Object} com 组件
     * @param {Object} obj 参数
     * @return {promise}
     */
    showModal(com, obj) {
        return com && obj && Vue.prototype.$TpShowModal(com, obj);
    },
    //路由跳转
    redirectTo(obj, flag) {
        let searchPath = Handle.handleRedirectPath(obj, params.appNameForPath, params.appConfigsAllow,
            params.appConfigs); //处理跳转路径

        this.registerConfig(searchPath, true, function() {
            Handle.registerConfigSuccess(obj, flag, params.appNameForPath,
                plug.store, plug.router);
        });
    },
    redirectBack(flag, type) {
        if (!flag) {
            routerObj.go(-1);
        } else {
            type && opener && typeof opener.reMethods === 'function' && (opener.reMethods(), opener.reMethods = null);
            window.close();
        }
    },
    //注销登陆
    destroyApp(flag) {
        sessionStorage.removeItem('user');
        // layoutService.cancellation();
        if (flag) {
            Vue.tpUtil.setCache('menu', 'menuFlag', true);
            plug.store.commit('CHANGE_HOME', { 'type': '' });
            window.gtyh = false;
            plug.router.push('/login');
            window.location.reload();
        }
    },
    replaceToUpperCase(str) { // 首字母置为大写
        var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
        return str.replace(reg, function(m) {
            return m.toUpperCase()
        });
    },
    setTranslations(url) {
        params.translations = Object.assign(params.translations, JSON.parse($.ajax({
            url: url,
            async: false,
            dataType: 'json'
        }).responseText) || {} || {});
    },

    getTranslations(flag) {
        if (!flag) {
            setTimeout(function() {
                params.translations = null;
                params.translations = {};
            }, 1000);
        }
        return params.translations;
    },
    //处理允许请求的应用路径，通过权限菜单
    registerRoutesForMenus(paths) {
        if (!paths || paths.length === 0) {
            return;
        }
        for (var name in paths) {
            params.appConfigsAllow[paths[name]] = params.appConfigs[paths[name]];
            delete params.appConfigs[paths[name]];
        }
        paths = null;
    },
    //注册小应用配置文件，判断配置文件是否注册，没注册则调取注册方法
    registerConfig(path, type, call, flag) {
        if (!path || path === '') {
            return;
        }
        if (type) {
            let s = path.match(/(\S*)_app/);
            if (s && s.length > 1) {
                path = path.match(/(\S*)_app/)[1] + '_app';
            }
        }
        if (flag) {
            path = '_' + path;
        }
        if (params.appConfigsAllow[path]) { //判断配置文件是否注册
            let _this = this;
            Handle.getAjaxConfig(params.appConfigsAllow[path], function(data) {
                if (data.router) {
                    //注册小应用
                    _this.regSmallApp(data.router);
                    //增加相应路由
                    plug.router.addRoutes(data.router);
                }
                //设置api
                data.api && _this.setApi(data.api);
                //注册成功，删除
                delete params.appConfigsAllow[path];
                call && call();
            }, plug.store);
        } else {
            call && call();
        }
    },
    //注册小应用
    regSmallApp(list, type) {
        if (!list) {
            return;
        }
        if (!type) {
            if (list.length > 0) {
                Handle.handleRouter(list, null, false, params.appNameForPath, params.appConfigs);
            }
        } else {
            Handle.handleRouter(list, null, true, params.appNameForPath, params.appConfigs);
            params.smallApps = params.smallApps.concat(list || []);
        }
    },
    //排序比较方法
    compare(property) {
        return function(a, b) {
            var value1 = parseInt(a[property]) || 0,
                value2 = parseInt(b[property]) || 0;
            return value1 - value2;
        }
    },
    //格式化输入域
    showNumber(thou, len, value) {
        var code = '';
        if (!len) {
            len = 2
        } else {
            len = parseInt(len) || 2;
        }
        if (!value || parseFloat(value) === '0') {
            code = Number('0').toFixed(len);
            return code;
        }
        if (value && parseFloat(value) !== '0') {
            if (!isNaN(parseFloat(this.delcommafy(value)))) {
                var itemValue = parseFloat(this.delcommafy(value));
                // if (itemValue >= minValue && itemValue <= maxValue) {
                if (thou) {
                    code = this.comdify(Number(itemValue).toFixed(len));
                } else {
                    code = Number(value).toFixed(len);
                }
            } else {
                code = '';
            }
        }
        return code;
    },
    // 去除千分位中的‘，’
    delcommafy(num) {
        num = num.toString();
        num = num.replace(/,/gi, '');
        return num;
    },
    //加千分位
    comdify(n) {
        var re = /\d{1,3}(?=(\d{3})+$)/g,
            n1 = n.replace(/^(-?\d+)((\.\d+)?)$/, function(s, s1, s2) {
                return s1.replace(re, '$&,') + s2;
            });
        return n1;
    },
    //打开pdf
    openPdf(obj, flag) {
        var p = '',
            objs = {
                system: '', // 表所属系统
                reportName: '', // 报表名
                readonly: '' // 是否只读
            };
        objs = Object.assign(objs, obj || {});
        for (var o in objs) {
            p = p + '&' + o + '=' + objs[o];
        }
        p = p.substring(1);
        if (flag) {
            return 'dist/pdf/web/viewer.html?' + p;
        } else {
            window.open('dist/pdf/web/viewer.html?' + p)

        }
    },
    //对象比较
    compareObject(origin, target) {
        if (target && typeof target === 'object') {
            if (typeof origin !== 'object') {
                return false
            } else {
                if (JSON.stringify(origin) === JSON.stringify(target)) {
                    return true
                } else {
                    return false
                }
            }
        } else {
            return origin === target
        }
    },
    //深拷贝
    cloneObj(obj, flag) {
        var str, newobj = typeof obj === 'object' && isNaN(obj.length) ? [] : {};
        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = JSON.stringify(obj), // 系列化对象
                newobj = JSON.parse(str); // 还原
            if (flag) {
                for (var name in newobj) {
                    newobj[name] = '';
                }
            }
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ?
                    this.cloneObj(obj[i]) : null;
            }
        }
        return newobj;
    },
    //数组转对象
    arrayToObject(key, value, data) {
        if (!key || !data) {
            return {};
        }
        var d = {};
        for (var name in data) {
            d[data[name][key]] = data[name][value];
        }
        return d;
    },
    //翻译ggcode
    translationData: function(code, key) {
        var v = Vue.tpUtil.getCache('select', this.getMd5(code))
        key = key + '';
        if (v) {
            for (var name in v) {
                if (v[name]['codeCode'] === key) {
                    return v[name]['codeName']
                }
            }
        }
        return '';
    },
    // 导出excel，新增exclude字段（数组类型，有prop用prop，无则使用展示名称）以控制无需导出字段
    exportExcel(ref, id, fileName, sheet, exclude) {
        if (!ref || !id) {
            Vue.tpUtil.message('The ref and ID values of the data table are not allowed to be empty');
            return;
        }
        var d = Handle.getExeclData(ref, id),
            rm = [],
            sheetFilter = d.sheetFilter.filter(function(item, index) {
                var flag = !~(exclude || []).indexOf(item)
                if (!flag) {
                    rm.push(index)
                }
                return flag
            }),
            sheetHeader = d.sheetHeader.filter(function(item, index) {
                return !~rm.indexOf(index)
            })
        Handle.toExcel({
            fileName: fileName || 'tp_execl',
            datas: [{
                sheetData: d.sheetData,
                sheetName: sheet || 'sheet',
                sheetFilter: sheetFilter,
                sheetHeader: sheetHeader
            }]
        });
    },
    handleUnCompileQuery(obj) {
        if (!obj) {
            return {};
        }
        var o = {};
        for (var name in obj) {
            o[name] = Handle.unCompile(obj[name]);
        }
        // console.log(o)
        return o;
    },
    //初始化ggcode翻译，不依赖下拉缓存
    initTranslation: function(codeType, callFn) {
        var url = this.getUrl({ apiName: 'layoutSelectGGCodeList', contextName: 'auth' }),
            path = codeType,
            param = { codeType: codeType, validind: '1' },
            vo = 'ggCodeVoList',
            cacheKey = Vue.tpUtil.md5(path),
            list = this.getCache('select', cacheKey);
        if (!list) {
            this.http.post(url, param, { shade: true }).then(function(res) {
                if (res.resCode === '0000') {
                    var data = res.resData[vo];
                    for (var t in data) {
                        Vue.tpUtil.setCache('select', Vue.tpUtil.md5(t), data[t]);
                    }
                    typeof(callFn) === 'function' && callFn.call(this);
                }
            });
        } else {
            typeof(callFn) === 'function' && callFn.call(this);
        }
    },
    /** 字符转日期
     *@param dateStr 日期格式的字符串
     */
    stringToDate(dateStr) {
        if (typeof dateStr === 'undefined') {
            return new Date();
        }
        if (typeof dateStr === 'object') {
            return dateStr;
        }
        var converted = Date.parse(dateStr),
            myDate = new Date(converted);
        if (isNaN(myDate)) {
            dateStr = dateStr.replace(/:/g, '-'); // 支持 2013:10:17
            dateStr = dateStr.replace(' ', '-'); // 支持 2013 10 17
            dateStr = dateStr.replace('.', '-'); // 支持 2013.10.17
            var arys = dateStr.split('-'); // 支持2013-10-17
            switch (arys.length) {
                case 7: // 2013-10-17-13-56-33-22 格式
                    myDate = new Date(arys[0], parseInt(arys[1], 10) - 1, arys[2], arys[3], arys[4], arys[5], arys[6]);
                    break;

                case 6: // 2013-10-17-13-56-33 格式
                    myDate = new Date(arys[0], parseInt(arys[1], 10) - 1, arys[2], arys[3], arys[4], arys[5]);
                    break;

                default: // 2013-10-17 格式
                    myDate = new Date(arys[1] + '/' + arys[2] + '/' + arys[0]);
                    break;
            }
        }
        return myDate;
    },
    /**
     * 比较两日期大小
     * @param time1
     * @param time2
     * @returns 0:time1小于time2；
     *          1：time1大于time2；
     *          2：time1等于time2
     */
    comPareDate(time1, time2) {
        var a = this.stringToDate(time1).getTime(),
            b = this.stringToDate(time2).getTime(),
            c = 0;
        if (a > b) {
            c = 1;
        } else if (a === b) {
            c = 2;
        }
        return c;
    },
    /**
     * 相差月数
     * @param s_time 开始时间
     * @param e_time 结束时间
     * @param type String 月数加减 1：加；2：减
     * @param num int 月数
     */
    getMonthsApart(s_time, e_time, type, num) {
        var _this = this,
            s = _this.stringToDate(s_time),
            e = _this.stringToDate(e_time),
            s_year = s.getFullYear(),
            s_month = s.getMonth(),
            s_day = s.getDate(),
            s_hour = s.getHours(),
            e_year = e.getFullYear(),
            e_month = e.getMonth(),
            e_day = e.getDate(),
            e_hour = e.getHours(),
            sum = (e_year - s_year) * 12 + (e_month - s_month);
        if ((e_day - s_day < 0) || ((e_day === s_day) && (e_hour > s_hour))) {
            sum -= 1;
        }
        if (type && typeof(num) === 'number') {
            if (type === '1') {
                sum += num;
            } else {
                sum -= num;
            }
        }
        return sum;
    },
    /**
     * 时间加减
     * @param obj yearType 年份：'0' 加;1: 减
     *            year 加减多少年
     *            monthType 月份：'0' 加;1: 减
     *            month 加减多少月
     *            dayType 日：'0' 加;1: 减
     *            day 加减多少日
     */
    getHandleDate(time, obj) {
        var date = this.stringToDate(time);
        if (!date) {
            return;
        }
        var opt = $.extend({
                yearType: '0',
                monthType: '0',
                dayType: '0',
                year: null,
                month: null,
                day: null
            }, obj || {}),
            s;
        if (opt.year) {
            s = date.getFullYear();
            if (opt.yearType === '0') {
                s += opt.year;
            } else {
                s -= opt.year;
            }
            date.setFullYear(s);
        }

        if (opt.month) {
            s = date.getMonth();
            if (opt.monthType === '0') {
                s += opt.month;
            } else {
                s -= opt.month;
            }
            date.setMonth(s);
        }

        if (opt.day) {
            s = date.getDate();
            if (opt.dayType === '0') {
                s += opt.day;
            } else {
                s -= opt.day;
            }
            date.setDate(s);
        }
        return date;
    },
    /**
     * 获取时区信息
     * @param Date date 
     */
    getTimeZone(date) {
        //            var current = new Date();
        var tz;
        var zone = (-date.getTimezoneOffset()) / 60;

        if (zone > 9 || zone < -9) {
            tz = zone > 0 ? 'GMT +' + zone + '00' : 'GMT ' + zone + '00';
        } else if (zone != 0) {
            tz = zone > 0 ? 'GMT +0' + zone + '00' : 'GMT -0' + (-zone) + '00';
        } else {
            tz = 'GMT +0000';
        }
        //            console.log('Current TimeZone:' + tz);

        return tz;
    },
    //四舍五入
    iTofixed(num, fractionDigits) {
        return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits) + Math.pow(10, -(fractionDigits + 1))).toString().slice(0, -1);
    },
    //添加权限菜单的标题
    addAuthMenuData(key, title) {
        let menus = this.getCache('menu', 'authMenuData');
        if (menus['_' + key]) {
            menus['_' + key] = { flag: true, name: title };
        }
    },
    //获取cookie
    getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        /* eslint no-cond-assign: "off" */
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    //获取组件
    getComponents(name) {
        return params.components[name];
    },
    //通过路由name查path
    getRouterNameForPath: function(path) {
        return params.appNameForPath[path] || '';
    },
    getSmallApps: function(flag) {
        if (!flag) {
            setTimeout(function() {
                params.smallApps = null;
                params.smallApps = [];
            }, 1000);
        }
        return params.smallApps;
    },
    getMixins() {
        return Mixins;
    },
    //获取md5
    getMd5(str) {
        //md5(str)
        return str ? md5(str) : '';
    },
    //获取正则
    getPattern(key) {
        return params.pattern[key];
    },
    //翻译国际化
    getInzTranslate(key) {
        return key && key !== '' ? Vue.filter('translate')(key) : '';
    },
    //获取Cookie
    getCookie(name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    //获取Url
    getUrl(obj) {
        return ApiService.get(obj.apiName, obj.serachParms || null, obj.urlParams || null, obj.contextName || '');
    },
    //获取url参数，格式化化数据
    getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
            r = decodeURI(window.location.search.substr(1)).match(reg);
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    },
    //获取浏览器api参数，格式化为String串
    getSearchString(obj) {
        if (!obj || obj === '') {
            return '';
        }
        if (obj.indexOf('?') > 0) {
            obj = obj.substring(obj.indexOf('?') + 1);
            return obj;
        } else {
            return '';
        }
    },
    //获取浏览器api参数传为json
    getSearchJson(obj) {
        if (!obj || obj === '') {
            return null;
        }
        var objs = obj.split('&'),
            s = [],
            t = {};
        for (var o in objs) {
            s = objs[o].split('=');
            if (s && s.length > 1) {
                t[s[0]] = s[1];
            }
        }
        return t;
    },
    //通过path返回有权限菜单的name
    getMenusForKey(path) {
        let obj = {
            v: false,
            agreement: false
        }
        path = '_' + path;
        if (path === '_/') {
            obj.v = true;
            return obj
        }
        let menus = this.getCache('menu', 'authMenuData');
        for (var name in menus) {
            if (path.indexOf(name) > -1) {
                obj.v = true;
                return obj;
            }
        }
        return obj
    },
    //获取版本号
    getVersion() {
        return params.config.version;
    },
    //设置请求上下文 
    setContext(obj) {
        ApiService.registerContext(obj);
    },
    //注册api
    setApi(obj) {
        ApiService.registerApi(obj);
    },
    //设置配置
    setConfig(obj) {
        obj.timeout && AxiosConfig.axiosObject.setTimeouts(obj.timeout);
        obj.authValue && AxiosConfig.axiosObject.setAuthValue(obj.authValue);
        obj.path && AxiosConfig.axiosObject.setPath(obj.path);
        obj.authName && AxiosConfig.axiosObject.setAuthName(obj.authName);
        Object.assign(params.config, obj || {});
    },
    //获取配置
    getConfig() {
        return params.config;
    },
    //设置token
    setTpToken(token) {
        params.token = token;
    },
    //获取token
    getTpToken() {
        return params.token;
    },
    //设置缓存
    setCache(type, key, val) {
        cache[type][key] = val;
    },
    //获取缓存
    getCache(type, key) {
        return cache[type][key];
    },
    //设置路由对象
    setRouter(r) {
        plug.router = r;
    },
    //获取路由对象
    getRouter() {
        return plug.router = r;
    },
    //设置状态
    setStore(r) {
        plug.store = r.store;
        //plug.store = r;
    },
    //获取状态
    getStore(r) {
        return plug.store;
    },
    //设置共享状态
    setVuexCache(key, value) {
        if (!key) {
            return;
        }
        plug.store.commit('UPDATE_CACHE', { key: value });
    },
    //获取共享状态
    getVuexCache(key) {
        return key ? plug.store.state.cache[key] : null;
    },
    Page(obj) {
        if (obj.events) {
            if (!obj.methods) {
                obj.methods = {};
            }
            obj.methods = Object.assign(obj.methods, obj.events)
        }

        obj.data = function() {
            let d = { query: {}, shareStore: {} };
            if (obj.query && typeof obj.query === 'function') {
                d.query = Object.assign(d.query, obj.query());
                // delete obj.query;
            }
            if (!obj.name || obj.name === '') {
                alert('请设置组件的name(组件的name必须和路由一至)，否则无法正常运行')
                return {};
            }
            if (obj.name && obj.shareStore && typeof obj.shareStore === 'function') {
                d.shareStore = Object.assign(d.shareStore, plug.store.state.cache[obj.name] || {});
            }
            return Object.assign(d, typeof obj.datas === 'function' && obj.datas(), typeof obj.params === 'function' && obj.params());
        }
        obj.mixins = [this.getMixins()];

        return obj;
    },
};

export default tpUtil