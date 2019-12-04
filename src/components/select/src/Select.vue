<template>
    <div>
        <el-select ref="tpSelect" :name="name" :id="id" :filterable="true" @change="onChange" size="mini" v-model="code" @input="updateValue()" :disabled="disableds">
            <el-option v-for="item in options" :key="item.value+''" :label="item.label" :value="item.value+''" :disabled="item.disabled">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpSelect',
    props: {
        url: {
            type: String,
            default: ''
        },
        contextName: {
            type: String,
            default: ''
        },
        value: {},
        codeType: String,
        optionsSet: {
            type: String,
            default: '0'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        dataCorrectType: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        disabledOption: null,
        poName: {
            type: String,
            default: ''
        },
        searchObject: {
            type: String,
            default: null
        },
        codeName: {
            type: String,
            default: ''
        },
        labelName: {
            type: String,
            default: ''
        },
        labelNameEx: {
            type: String,
            default: ''
        },
        defaultParams: {
            type: String,
            default: ''
        },
        defaultEmit: {
            type: Boolean,
            default: false
        },
        defaultValue: {
            type: String,
            default: ''
        },
        isCache: {
            type: Boolean,
            default: true
        },
        defaultType: {
            type: Boolean,
            default: false
        },
        orderByField: { // 要排序的字段
            type: String,
            default: ''
        },
        direction: { // 顺序还是倒序 desc，asc
            type: String,
            default: ''
        },
        isFuzzy: { //后台isFuzzy 0：模糊，1：不模糊 前端is-fuzzy flase：模糊 true:不模糊
            type: Boolean,
            default: false
        },
        'index': String
    },
    data: function() {
        return {
            code: '',
            options: [],
            path: '',
            c: '',
            l: '',
            le: '',
            vo: '',
            cacheKey: '',
            disableds: false
            // Todo 废弃
            // searchCacheList: {}
        };
    },
    watch: {
        value: function(val, old) {
            if (val !== old) {
                this.onChange(val, true);
                this.code = val;
            }
        },
        searchObject: function(val, old) {
            if (val && val !== old) {
                this.initData();
            }
        },
        disabledOption: function(val, old) {
            if (val && val !== old) {
                this.handleDisabledOption();
            }
        },
        codeType: function(val) {
            if (val) {
                this.initData();
            }
        },
        poName: function(val) {
            if (val) {
                this.initData();
            }
        },
        disabled: function(val) {
            this.disableds = val;
        },
        dataCorrectType: function(val) {
            this.setParams('data-correct-type', val);
        },
        code: function(val, old) {}
    },
    created: function() {
        this.code = this.value;
        this.initData();
        this.disableds = this.disabled;

    },
    mounted: function() {
        var _this = this;
        // setTimeout(() => {
        //         if (_this.dataCorrectType)
        //         _this.setParams('data-correct-type', this.dataCorrectType);
        //     _this.setParams('is-select', 'y');
        //     }, 1000);
        this.$nextTick(function() {
            if (_this.dataCorrectType)
                _this.setParams('data-correct-type', this.dataCorrectType);
            _this.setParams('is-select', 'y');
        });
        // if (this.dataCorrectType)
        //     this.setParams('data-correct-type', this.dataCorrectType);
        // this.setParams('is-select', 'y');

    },
    methods: {
        updateValue: function() {
            this.$emit('input', this.code)
            this.$emit('change');
        },
        onChange: function(obj, flag) {
            var self = this,
                row;
            if (flag) {
                if (obj !== this.code && this.options.filter) {
                    row = this.options.filter(function(item) {
                        return item.value === obj
                    })[0]
                    // this.$emit('row-select', this.searchCacheList[obj + ''], this.index);
                    this.$emit('row-select', row, this.index);
                }
            } else if (this.options.filter) {
                row = this.options.filter(function(item) {
                    return item.value === self
                })[0]
                // this.$emit('row-select', this.searchCacheList[this.code + ''], this.index);
                this.$emit('row-select', row, this.index);
            }
        },
        initData: function() {
            var _this = this,
                url = '',
                param = {},
                cacheKey = '',
                cacheKeyParam = null,
                list = null;
            if ((!this.poName || this.poName === '') && this.url === '') {
                // codeType
                url = Vue.tpUtil.getUrl({ apiName: 'layoutSelectGGCodeList', contextName: 'auth' });
                this.path = this.codeType;
                this.c = 'codeCode';
                this.l = this.labelName || 'codeName';
                this.le = this.labelNameEx;
                param = { codeType: this.codeType, validind: '1' };
                this.vo = 'ggCodeVoList';
                cacheKey = Vue.tpUtil.getMd5(this.path);
                if (this.searchObject && typeof this.searchObject === 'string') {
                    Object.assign(param, JSON.parse(this.searchObject));
                    cacheKeyParam = Vue.tpUtil.getMd5(this.path + JSON.stringify(param) || '');
                }
            } else if (this.url !== '') {
                // url
                url = this.contextName + this.url;
                this.path = this.codeType;
                param = {};
                this.c = this.codeName || 'codeCode';
                this.l = this.labelName || 'codeName';
                this.le = this.labelNameEx;
                this.vo = 'businessList';
                if (this.searchObject && typeof this.searchObject === 'object') {
                    Object.assign(param, this.searchObject);
                }
                if (this.searchObject && typeof this.searchObject === 'string') {
                    Object.assign(param, JSON.parse(this.searchObject));
                }
                cacheKey = Vue.tpUtil.getMd5(JSON.stringify(param) || '');
            } else {
                // poName
                url = Vue.tpUtil.getUrl({ apiName: 'layoutSelectGGCodeOtherList', contextName: 'auth' });
                this.path = this.poName;
                param = { poName: this.poName };
                this.c = this.codeName;
                this.l = this.labelName;
                this.le = this.labelNameEx;
                this.vo = 'businessList';
                if (this.searchObject && typeof this.searchObject === 'object') {
                    Object.assign(param, this.searchObject);
                }
                if (this.searchObject && typeof this.searchObject === 'string') {
                    Object.assign(param, JSON.parse(this.searchObject));
                }
                cacheKey = Vue.tpUtil.getMd5(JSON.stringify(param) || '');
            }

            if (this.isCache) {
                if (cacheKeyParam) {
                    list = Vue.tpUtil.getCache('select', cacheKeyParam);
                } else {
                    list = Vue.tpUtil.getCache('select', cacheKey);
                }
            }
            if (this.orderByField && this.direction) {
                param.orderByField = this.orderByField;
                param.direction = this.direction;
            }
            param.isFuzzy = this.isFuzzy ? '1' : '0';
            if (!list) {
                this.requestData(url, param).then(function(res) {
                    if (res.resCode === '0000') {
                        var data = res.resData[_this.vo];
                        if (_this.c === 'codeCode') {
                            data = data[_this.codeType];
                        }
                        _this.handleReturnData(data, true, cacheKey, cacheKeyParam);
                    }
                });
            } else {
                this.handleReturnData(list);
            }
        },
        setParams: function(name, value) {
            this.$refs.tpSelect.$el.querySelector('input').setAttribute(name, value);
        },
        handleReturnData: function(data, c, cacheKey, cacheKeyParam) {
            var self = this,
                result = [],
                item = null,
                optionsSet = this.optionsSet,
                cacheList = data;

            // 第一项
            if (optionsSet === '1') {
                item = {}
                item.value = ''
                item.label = Vue.filter('translate')('gAll')
            } else if (optionsSet === '2') {
                item = {}
                item.value = ''
                item.label = Vue.filter('translate')('gSelect')
            }
            item && result.push(item)
            if (data && data.length > 0) {
                // 选项
                data.forEach(function(tmp) {
                    var value = tmp[self.c] + '',
                        label = tmp[self.l],
                        disabled
                    if (value === 'false') {
                        value = false
                    } else if (value === 'true') {
                        value = true
                    }
                    if (self.le) {
                        label += ' -- ' + tmp[self.le];
                    }
                    disabled = self.disabledOption && self.disabledOption.indexOf(value) > -1
                    tmp.value = value
                    tmp.label = label
                    tmp.disabled = disabled
                    result.push(tmp)
                })
            }

            this.options = result

            if (this.defaultParams) {
                if (!this.defaultType && (this.value === '' || this.value === null)) {
                    this.handleDefaultParams(cacheList);
                }
                if (this.defaultType) {
                    this.handleDefaultParams(cacheList);
                }
            }

            if (c && this.isCache && cacheList) {
                if (cacheKeyParam) {
                    Vue.tpUtil.setCache('select', cacheKeyParam, cacheList);
                    var cacheListEx = c.get(cacheKey);
                    if (cacheListEx) {
                        cacheList = cacheList.concat(cacheListEx);
                    }

                }
                Vue.tpUtil.setCache('select', cacheKey, cacheList);
            }
        },
        requestData: function(url, param) {
            return Vue.tpUtil.http.post(url, param, { shade: false })
        },
        handleDisabledOption: function() {
            var obj = $.extend({}, this.options);
            for (var o in obj) {
                obj[o].disabled = this.disabledOption && this.disabledOption.indexOf(obj[o].value) > -1;
            }
            this.options = obj;
        },
        handleDefaultParams: function(obj) {
            for (var o in obj) {
                if (obj[o][this.defaultParams] === 'false') {
                    obj[o][this.defaultParams] = false;
                } else if (obj[o][this.defaultParams] === 'true') {
                    obj[o][this.defaultParams] = true;
                }
                if (this.defaultValue === 'false') {
                    this.defaultValue = false;
                } else if (this.defaultValue === 'true') {
                    this.defaultValue = true;
                }
                if (obj[o][this.defaultParams] === this.defaultValue) {
                    this.code = obj[o][this.c] + '';
                    this.updateValue();
                    if (this.defaultEmit) {
                        this.onChange(obj[o][this.defaultParams]);
                    }
                }
            }
        }
    }
}
</script>