/**
 * 混合对象
 * @author 陈柱良
 * @time 2019/04/18
 */
import Vue from 'vue'
const mixin = {
    props: {
        type: {
            type: String,
            default: 'add'
        }
    },
    data: function() {
        return {
            mixinObject: {
                activeNames: ['1', '2', '3', '4'],
                gValidateRequired: Vue.filter('translate')('gValidateRequired'),
                gValidateNumber: Vue.filter('translate')('gValidateNumber'),
                searchSet: { // 查询设置，因定写法
                    total: 0,
                    pageNo: 0,
                    pageSize: 10,
                    currentPage: 1
                },
                isInit: false
            },
            cacheFilters: {}
        }
    },
    destroyed: function() {
        if (this.$options.name && this.$store) {
            this.$store.commit('DESTROYED_CACHE', this.$options.name);
        }
        if (this.storeData) {
            this.storeData.clear(this.$options.name);
            // console.log(this.storeData)
        }
    },
    created: function() {
        if (this.$route && this.$route.query) {
            var qu = Vue.tpUtil.handleUnCompileQuery(this.$route.query);

            $.extend(true, this.query, qu);
            if (qu.openFlag && qu.openFlag === '1') {
                this.$store.commit('MENU_SHOW', false);
            }
        }
        if (this.$options.name && this.$store) {
            var m = this.$options.name.match(/(\S*)App/);
            if (m && m.length > 1) {
                var key = m[1] + 'App';
                for (var name in this.$store.state.cache) {
                    if (name.indexOf(key) === -1) {
                        this.$store.state.cache[name] = null;
                        delete this.$store.state.cache[name];
                    }
                }
            }
        }
        this.initPage();
        this.initRules();
    },
    methods: {
        showNumber: function(params, fm, thou, len) {
            Vue.tpUtil.showNumber(params, fm, thou, len);
        },
        /**
         * 获取请求参数 默认只传递_pageNo(页码) _pageSize(每页条数) 可以由调用方传递指定对象合并(或者覆盖)原参数
         * @param params
         * @returns {*}
         */
        getParamsMixin: function(params) {
            this.cacheFilters = Object.assign({
                _pageSize: this.mixinObject.searchSet.pageSize,
                _pageNo: this.mixinObject.searchSet.pageNo
            }, params);
            return this.cacheFilters;
        },

        /**
         * 页码变动
         * @param val 码数
         */
        onHandleCurrentChange: function(val) {
            if (typeof(val) === 'undefined') {
                return;
            }
            this.mixinObject.searchSet.pageNo = val - 1;
            this.mixinObject.isInit = true;
            this.onGetList();
        },

        /**
         * 查询行数变动
         * @param 行数
         */
        onHandleSizeChange: function(val) {
            this.mixinObject.searchSet.pageSize = val;
            this.mixinObject.isInit = true;
            this.onGetList();
        },

        /**
         * 获取查询数据
         */
        onGetList: function() {},
        searchList: function(apiName, contextName, filters, voName, call) {
            if (!this.beforeSearchValidate()) {
                return;
            }
            if (!this.mixinObject.isInit) {
                this.mixinObject.searchSet.pageNo = 0;
                this.mixinObject.searchSet.currentPage = 1;
            } else {
                this.mixinObject.isInit = false;
            }
            var params = this.getParamsMixin(filters),
                url = Vue.tpUtil.getUrl({
                    apiName: apiName,
                    contextName: contextName,
                    serachParms: { _pageSize: params._pageSize, _pageNo: params._pageNo }
                }),
                _this = this,
                list = [];
            Vue.tpUtil.http.post(url, params).then(function(res) {
                if (res.resCode === '0000') {
                    _this.mixinObject.searchSet.total = res.resData[voName]['total'] ? res.resData[voName].total : res.resData[voName].totalElements;
                    list = res.resData[voName].content;
                } else {
                    list = [];
                    _this.mixinObject.searchSet.total = 0;
                }
                call && call(list);
            });
        },
        beforeSearchValidate: function() {
            return true;
        },
        initPage: function() {

        },
        initRules: function() {

        },
        onResetForm: function(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
export default mixin;