<template>
    <transition name="fade">
        <el-radio-group :disabled="disabled" size="mini" @change="updateValue()" v-model="code">
            <el-radio v-for="item in options" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
    </transition>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpRadioGroup',
    props: {
        value: {},
        codeType: String,
        disabled: {
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
        }
    },
    data: function() {
        return {
            code: 'false',
            options: []
        };
    },
    watch: {
        value: function(val) {
            this.code = val;
        },
        codeType: function(val) {
            if (val) {
                this.initData();
            }
        }
    },
    created: function() {
        this.initData();
    },
    methods: {
        updateValue: function() {
            this.$emit('input', this.code)
            // this.$emit('change');
        },
        initData: function() {
            var _this = this,
                list = null,
                cacheKey = Vue.tpUtil.getMd5(this.codeType),
                url = Vue.tpUtil.getUrl({ apiName: 'layoutSelectGGCodeList', contextName: 'auth' }),
                param = { codeType: this.codeType, validind: '1' };
            if (this.isCache) {
                list = Vue.tpUtil.getCache('select', cacheKey);
            }
            if (!list) {
                var validindList = {};
                this.requestData(url, param).then(function(res) {
                    var data = null;
                    if (res.resCode === '0000') {
                        data = res.resData['ggCodeVoList'][_this.codeType];
                        validindList = _this.formatData(data);
                    }
                    if (_this.isCache && data) {
                        Vue.tpUtil.setCache('select', cacheKey, data);
                    }
                    _this.options = _this.handleData(validindList);
                    // 选项刚更新，重新赋值
                    _this.code = _this.value
                });
            } else {
                this.options = this.handleData(this.formatData(list));
            }
        },
        formatData: function(data) {
            var validindList = {};
            for (var t in data) {
                validindList[data[t]['codeCode'] + ''] = data[t]['codeName'];
                if (data[t]['codeCode'] === (this.value || this.defaultValue)) {
                    this.code = data[t]['codeCode'];
                    this.updateValue();
                }
            }
            return validindList;
        },
        requestData: function(url, param) {
            return Vue.tpUtil.http.post(url, param, { shade: false })
        },
        handleData: function(obj) {
            if (!obj) {
                return [];
            }
            var radioOptions = [];
            for (var key in obj) {
                var convertObject = {};
                convertObject.value = key;
                convertObject.label = obj[key];
                radioOptions.push(convertObject);
            }

            return radioOptions;
        }
    }
}
</script>