<template>
    <div>
        <div :class="{ 'inputColumn': isColumn}">
            <transition name="fade">
                <el-autocomplete :id="jqIdt" :data-correct-type="dataCorrectType" :disabled="isReadonly" @blur="onBlur" :maxlength="maxlength" :debounce="700" popper-class="tpSearchDropDown" @change="updateValue()" ref="loadmore" v-model="selector" :fetch-suggestions="querySearchAsync" :placeholder="'gInput' | translate('Please enter the search condition')" @select="handleSelect">
                </el-autocomplete>
            </transition>
        </div>
        <div v-if="isColumn" class="lableColumn">
            <el-input size="mini" v-model="lableColumn" readonly></el-input>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
var ids = 1;
export default {
    name: 'TpAutoComplete',
    props: {
        codeType: String,
        poName: {
            type: String,
            default: ''
        },
        maxlength: {
            type: Number,
            default: 50
        },
        codeName: {
            type: String,
            default: 'codeCode'
        },
        labelName: {
            type: String,
            default: ''
        },
        'dataCorrectType': '',
        selectHandleParams: Object,
        lableParams: '',
        'case-insensitive': false,
        lableValue: '',
        contextName: {
            type: String,
            default: 'system'
        },
        url: {
            type: String,
            default: ''
        },
        code: {
            type: String,
            default: ''
        },
        isReadonly: {
            type: Boolean,
            default: false
        },
        index: String,
        value: [String, Number],
        preQueryData: {
            type: Object,
            default: () => {}
        },
        // 模糊查询，针对code
        isFuzzy: true,
        orderByField: { // 要排序的字段
            type: String,
            default: ''
        },
        direction: { // 顺序还是倒序 desc，asc
            type: String,
            default: ''
        }

    },
    data: function() {
        return {
            jqIdt: '_tpAutoCompletet' + ids,
            isSearch: true,
            dropDownList: [],
            selector: '',
            timeout: null,
            pageNo: 0,
            pageSize: 10,
            loading: false,
            loadResult: [],
            oldNo: 0,
            isColumn: false,
            lableColumn: '',
            lableNameArr: null,
            selectorCache: null,
            preQueryDataCache: null,
            blurFlag: false,
            selectorCacheex: null, //选中的缓存
            searchCacheex: null, //查询的缓存
            blurCache: {},
            isAlert: false
        }
    },
    mounted() {
        this.initProp();
        this.initJq();
    },
    created() {
        if (this.lableParams) {
            this.isColumn = true;
        }
        if (this.lableValue) {
            this.lableColumn = this.lableValue
        }
        if (this.value) {
            this.selector = this.value;
        }
        ids++;
    },
    watch: {
        value(val, old) {
            if (val == null)
                val = '';
            if (old == null)
                old = '';
            if (val !== old) {
                if (val !== this.selector) {
                    this.selector = val;
                    if ((val === '' || val === null) && old !== '') {
                        this.lableColumn = '';
                        this.$emit('row-select', null, this.selectHandleParams, this.index, this.viewObjectCode, true);
                    }
                }
            }
            // this.selector = val;
            // if (val != old && !val) {
            //     this.lableColumn = '';
            //     this.$emit('row-select', null, this.selectHandleParams, this.index);
            // }
        },
        lableValue(val) {
            this.lableColumn = val;
            // this.isAlert = false;
        },
        selector(val, old) {
            if (val === '' && old !== '' && this.value != val) {
                this.lableColumn = '';
                this.updateValue('');
                this.$emit('row-select', null, this.selectHandleParams, this.index, this.viewObjectCode, true);
            } else {
                // this.updateValue(val);
            }
            // if (val != old)
            //     this.updateValue();
            // console.log(val)
        },
        preQueryData: { // 深度监听，可监听到对象、数组的变化
            handler: function(val, oldVal) {
                if (val && !Vue.tpUtil.compareObject(val, oldVal)) {
                    if (typeof val === 'object') {
                        this.preQueryDataCache = Object.assign({}, val);
                        this.searchCacheex = null;
                    }
                }
            },
            deep: true
        }
    },
    methods: {
        initProp() {
            this.lableNameArr = this.labelName.split(',');
            this.preQueryDataCache = Object.assign({}, this.preQueryData);
        },
        initJq() {
            var _this = this,
                jq = document.getElementById(this.jqIdt),
                activedescendant = jq.getAttribute('aria-activedescendant').replace('-item--1', ''),
                d = $('#' + activedescendant).parent().get(0);
            d.setAttribute('style', 'overflow-y: scroll; with: 100%')
            $(d).scroll(function() {
                var div = $(this).get(0);
                if (div.scrollHeight - div.clientHeight - div.scrollTop < 1 && _this.isSearch) {
                    _this.isSearch = false;
                    _this.initData(true);
                }
            });
        },
        querySearchAsync(queryString, cb) {
            this.pageNo = 0;
            if (this.searchCacheex !== this.selector) {
                this.searchCacheex = this.selector;
                this.initData(false, cb);
            } else {
                if (this.preQueryDataCache !== this.preQueryData && !Vue.tpUtil.compareObject(this.preQueryDataCache, this.preQueryData)) {
                    this.preQueryDataCache = Object.assign({}, this.preQueryData);
                    this.initData(false, cb);
                } else {
                    // this.isAlert = false;
                    this.computAlert(this.loadResult);
                    cb(this.loadResult);
                }
            }
        },

        initData(flag, cb) {
            var _this = this,
                codeName = _this.codeName;
            flag && this.pageNo++;
            this.requestData().then(function(res) {
                _this.isSearch = true;
                if (res.resCode === '0000') {
                    var data = res.resData[_this.vo].content,
                        length = data.length
                    if (length === 0 && flag) {
                        _this.isAlert = true;
                        _this.pageNo--;
                        return;
                    }

                    for (var j = 0, len = length; j < len; j++) {
                        // if (!data[j][_this.codeName]) {
                        //    data.splice(j, 1);
                        // } else {
                        var lableValue = data[j][_this.lableNameArr[0]];
                        for (var i = 1; i < _this.lableNameArr.length; i++) {
                            if (data[j][_this.lableNameArr[i]])
                                lableValue += ' -- ' + data[j][_this.lableNameArr[i]];
                        }
                        data[j]['value'] = lableValue;
                        // }
                    }
                }
                // 过滤空元素
                data = data.filter(function(item) {
                    var code = item[codeName],
                        value = item.value
                    return value
                    // return code && value
                })
                if (_this.pageNo > 0) { //
                    if (_this.pageNo !== _this.oldNo) {
                        for (var k = 0, len1 = data.length; k < len1; k++) {
                            Vue.set(_this.dropDownList, _this.dropDownList.length, data[k])
                        }
                        if (length < 10 && flag) {
                            _this.pageNo--;
                            _this.isSearch = false;
                        }
                    }
                } else {
                    _this.dropDownList = data;
                    _this.computAlert(_this.dropDownList);
                    cb && cb(_this.dropDownList);
                }
                // if(_this.dropDownList.length > 0) {
                //     _this.isAlert = false;
                // } else {
                //     _this.isAlert = true;
                // }
                _this.oldNo = _this.pageNo;
                _this.loadResult = _this.dropDownList;
                _this.blurCache = _this.computBlurCache(_this.loadResult);
            }, function() {
                if (flag) {
                    _this.isSearch = true;
                }
            });
        },
        updateValue(val) {
            this.$emit('input', val);
            this.$emit('change');
        },
        onBlur() {
            var _this = this;
            setTimeout(function() {
                if (!_this.blurFlag) {
                    if (_this.selectorCacheex !== _this.selector) {
                        if (_this.selector !== '' && !_this.matchingItem(_this.selector)) {
                            _this.selector = '';

                        }
                    }
                    // _this.updateValue('');
                } else {
                    _this.blurFlag = false;
                }
            }, 700);
        },
        handleSelect(item, flag) {
            this.selector = item[this.codeName];
            this.selectorCacheex = item[this.codeName];
            this.updateValue(this.selector);
            if (this.lableParams) {
                this.lableColumn = item[this.lableParams]
            }
            this.$emit('row-select', item, this.selectHandleParams, this.index);
            if (!flag)
                this.blurFlag = true;
        },
        //模糊匹配缓存
        matchingItem(obj) {
            var reg = new RegExp('^' + obj, 'm');
            for (var key in this.blurCache) {
                if (reg.test(key)) {
                    // this.isAlert = false;
                    this.handleSelect(this.blurCache[key], true);
                    return true;
                }
            }
            return false;
        },
        //组装缓存数据，供失去焦点时使用
        computBlurCache(data) {
            var d = {};
            for (var key in data) {
                d[data[key][this.codeName]] = data[key];
            }
            return d;
        },
        computAlert(data) {
            if (data.length == 0) {
                Vue.tpUtil.message('Result list is empty.');
            }
            // if(data.length == 0 && this.isAlert == false) {
            //     this.isAlert = true;
            //     var _this = this;
            //     setTimeout(function() {
            //         _this.isAlert = false;
            //     }, 5000);
            // }
        },
        requestData() {
            var url = '',
                param = {};
            if ((this.poName === '') && (this.code === '') && (this.url === '')) {
                url = Vue.tpUtil.getUrl({
                    apiName: 'layoutAutoCompleteGGCodeList',
                    contextName: 'auth',
                    serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                });

                this.vo = 'ggCodeVoList';
                this.labelName = 'codeName';
                this.codeName = 'codeCode';
                param = { codeType: this.codeType, validind: '1', codeCode: this.selector ? this.selector : '' };
            } else if (this.code !== '') {
                url = Vue.tpUtil.getUrl({
                    apiName: 'layoutDbclickGGCodeOtherListByCode',
                    contextName: 'auth',
                    serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                });
                param = { code: this.code, value: this.selector ? this.selector : '', isFuzzy: this.isFuzzy };
                this.vo = 'businessList';
            } else {
                if (this.url !== '') {
                    url = this.contextName + this.url + '?_pageSize=' + this.pageSize + '&_pageNo=' + this.pageNo;
                } else {
                    url = Vue.tpUtil.getUrl({
                        apiName: 'layoutDbclickGGCodeOtherList',
                        'contextName': 'auth',
                        serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                    });
                    param = { poName: this.poName };
                }
                var paramArr = this.codeName.split(','),
                    orCondition = '',
                    length = paramArr.length;
                for (var i = 0; i < length; i++) {
                    if (i === 0) {
                        orCondition += paramArr[i] + '=' + this.selector + ' ';
                    } else {
                        orCondition += 'or ' + paramArr[i] + '=' + this.selector + ' ';
                    }
                }
                this.vo = 'businessList';
                if (this.selector && paramArr.length === 1) {
                    param[this.codeName] = this.selector
                } else if (this.selector && paramArr.length > 1) {
                    param['orCondition'] = orCondition;
                }
            }
            param.value = !this.caseInsensitive ? param.value : param.value.toUpperCase();
            if (this.orderByField && this.direction) {
                param.orderByField = this.orderByField;
                param.direction = this.direction;
            }
            param = Object.assign(param, this.preQueryData);
            this.selectorCache = this.selector;
            return Vue.tpUtil.http.post(url, param, { shade: false })
        }
    }
}
</script>