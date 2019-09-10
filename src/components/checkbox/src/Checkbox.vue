<template>
    <el-checkbox-group v-model="checkList" :disabled="isReadonly">
        <el-checkbox v-for="item in checkItem" :key="item.value" :label="item.value" @change="onChange(item.value)">{{item.label}}</el-checkbox>
    </el-checkbox-group>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpCheckbox',
    /**
     * @property {Number|String} value v-model 双向绑定属性
     * @property {Boolean} isReadonly Readonly
     * @property {Boolean} isMore 不否多选
     * @property {Array} listCheck 选项
     */
    props: {
        value: {},
        isReadonly: {
            type: Boolean,
            default: false
        },
        isMore: {
            type: Boolean,
            default: true
        },
        listCheck: null,
        codeType: {
            type: String,
            default: ''
        },
        searchObject: {
            type: Object,
            default: null
        },
        orderByField: null,
        direction: null
    },
    data: function() {
        return {
            checkList: [], //组件内选中的值
            checkListEx: [], //传输给调用者的值
            checkItem: [], //选项
            flag: '0', //是否外部触发
            path: '',
            c: '',
            l: ''
        };
    },
    watch: {
        checkList: function(o) {
            if (this.isMore && this.flag == '0') {
                this.checkListEx = o;
            }
        },
        checkListEx: function(o) {
            if (this.flag == '0') {
                this.updateValue(o);
            } else {
                var _this = this;
                setTimeout(function() {
                    _this.flag = '0';
                }, 1000);

            }
        },
        value: function(o) {
            if (o) {
                if (!Vue.tpUtil.compareObject(o, this.checkListEx)) {
                    this.flag = '1';
                    this.checkList = o;
                    this.checkListEx = o;
                }
            }
        }
    },
    created: function() {
        if (this.listCheck) {
            this.checkItem = this.listCheck;
        } else {
            this.ajaxData();
        }
        this.initData(this.value);
    },
    methods: {
        initData: function(val) {
            if (val && val.length > 0) {
                this.checkList = this.value;
            }
        },
        onChange: function(obj, obj1, obj2) {
            if (!this.isMore && this.checkList.indexOf(obj) > -1) {
                if (this.checkList.length != 1)
                    this.checkList = [obj]
                this.checkListEx = this.checkList;
            }
        },
        ajaxData: function() {
            var _this = this,
                url = '',
                param = {},
                cacheKey = '',
                cacheKeyParam = null,
                list = null;

            url = Vue.tpUtil.getUrl({ apiName: 'layoutSelectGGCodeList', contextName: 'auth' });
            this.path = this.codeType;
            this.c = 'codeCode';
            this.l = this.labelName || 'codeName';
            param = { codeType: this.codeType, validind: '1' };
            cacheKey = Vue.tpUtil.getMd5(this.path);
            if (this.searchObject && typeof this.searchObject === 'string') {
                Object.assign(param, JSON.parse(this.searchObject));
                cacheKeyParam = Vue.tpUtil.getMd5(this.path + JSON.stringify(param) || '');
            }
            if (cacheKeyParam) {
                list = Vue.tpUtil.getCache('select', cacheKeyParam);
            } else {
                list = Vue.tpUtil.getCache('select', cacheKey);
            }
            if (this.orderByField && this.direction) {
                param.orderByField = this.orderByField;
                param.direction = this.direction;
            }
            if (!list) {
                this.requestData(url, param).then(function(res) {
                    if (res.resCode === '0000') {
                        var data = res.resData.ggCodeVoList[_this.codeType];
                        _this.handleReturnData(data, true, cacheKey, cacheKeyParam);
                    }
                });
            } else {
                this.handleReturnData(list);
            }
        },
        handleReturnData: function(data, c, cacheKey, cacheKeyParam) {
            var cacheList = data,
                result = [],
                _this = this;
            if(!data)
                return;
            data.forEach(function(tmp) {
                var value = tmp[_this.c] + '',
                    label = tmp[_this.l];
                if (value === 'false') {
                    value = false
                } else if (value === 'true') {
                    value = true
                }
                tmp.value = value
                tmp.label = label
                result.push(tmp);
            });
            if (result.length > 0) {
                this.checkItem = result;
                if (c && cacheList) {
                    if (cacheKeyParam) {
                        Vue.tpUtil.setCache('select', cacheKeyParam, cacheList);
                        var cacheListEx = c.get(cacheKey);
                        if (cacheListEx) {
                            cacheList = cacheList.concat(cacheListEx);
                        }
                    }
                    Vue.tpUtil.setCache('select', cacheKey, cacheList);
                }
            }
        },
        requestData: function(url, param) {
            return Vue.tpUtil.http.post(url, param, { shade: false })
        },
        updateValue: function(obj) {
            this.$emit('input', obj);
            this.$emit('change', obj);
        },

    }
}
</script>