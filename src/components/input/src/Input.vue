<template>
    <transition name="fade">
        <el-input :id="id" :name="name" is-number="y" :data-correct-type="dataCorrectType" size="mini" :maxlength="maxlength" :readonly="readonly" @focus="onKeyup($event, '1')" @keyup.native="onKeyup" v-model="code" @blur="onBlur">
            <i slot="suffix" class="c-black" v-if="suffix">{{suffix}}</i></el-input>
    </transition>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpInput',
    /**
     * @property {Number|String} v-model 双向绑定属性
     * @property {String} [size=mini] 大小
     * @property {Boolean} [readonly=false] 只读
     * @property {String} [id=''] id
     * @property {String} suffix 后缀
     * @property {String} numLen 数值长度
     * @property {Number} [maxlength=50] 可输入长度
     * @property {String} patternKey 正则，校验提示语（键值）
     * @property {Boolean} custom 自定义校验
     * @property {Number} max 最大值
     * @property {Number} min 最小值
     * @property {Boolean} isSelect 获取焦点后是否全选
     */
    props: {
        value: [String, Number],
        readonly: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        },
        dataCorrectType: '',
        /* disabled: {
            type   : Boolean,
            default: false
        }, */
        suffix: {
            type: String,
            default: null
        },
        thou: {
            type: Boolean,
            default: false
        },
        numLen: {
            type: String,
            default: null
        },
        maxlength: {
            type: String,
            default: '50'
        },
        patternKey: {
            type: String,
            default: null
        },
        custom: {
            type: Boolean,
            default: false
        },
        max: {
            type: Number,
            default: null
        },
        min: {
            type: Number,
            default: null
        },
        name: '',
        isSelect: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            code: '',
            isKey: false,
            repeat: false, // 防重复
            codeCache: '',
            maxLengthInput: 50
        };
    },
    watch: {
        value(val, old) {
            if (val !== '') {
                // 暂时屏蔽，它阻碍了数据的双向绑定
                /* eslint no-constant-condition: "off" */
                // if(!this.isKey) {
                if (true) {
                    // if (val + '' !== old) {
                    var codeVal = +Vue.tpUtil.delcommafy(this.code + '')
                    if (codeVal !== val || (old === '' && val === 0)) {
                        this.initData(val);
                    }
                } else {
                    this.isKey = false;
                }
            } else {
                if (this.code !== '') {
                    this.code = '';
                }
            }
        },
        code(val, old) {
            if (val === '' && old !== '' && this.value !== val) {
                this.updateValue();
            }
        }
    },
    created() {
        this.initData(this.value);
    },
    methods: {
        updateValue() {
            var val = '';
            if (this.code == '') {
                this.$emit('blur', val);
            } else {
                if (this.code || this.code == 0) {
                    val = Vue.tpUtil.delcommafy(this.code) || +this.code;
                    if(this.codeCache === val)
                        return;
                }
            }

            this.$emit('input', val);
            this.codeCache = Vue.tpUtil.delcommafy(this.code);
            /**
             * 数值发生变化.
             * @event component:TpInput#change
             * @property {Number} val 数值.
             */
            this.$emit('change', val);
        },
        onBlur() {
            var val = '';
            if (this.code == '') {
                this.$emit('blur', val);
                return;
            }
            if (this.code || this.code == 0) {
                val = Vue.tpUtil.delcommafy(this.code) || +this.code;
            }
            //var val = this.code ? Vue.tpUtil.delcommafy(this.code) || +this.code : ''
            // if (this.code && parseFloat(Vue.tpUtil.delcommafy(this.code + '')) !== parseFloat(this.codeCache)) {
            if (!(!this.code && this.code != 0) && +parseFloat(Vue.tpUtil.delcommafy(this.code + '')) !== this.value) {
                this.initData(this.code);
            }
            /**
             * 焦点离开.
             * @event component:TpInput#blur
             * @property {Number} val 数值.
             */
            this.$emit('blur', val);
        },
        onKeyup(event, flag) {
            if (!this.isKey) {
                this.isKey = true;
            }
            if (flag && flag == '1') {
                if (this.isSelect) {
                    event.currentTarget.select();
                }
            }
        },
        initData(value) {
            if (value !== '' && value !== null && value !== undefined) {
                if (this.thou || this.numLen) {
                    this.showNumber(this.thou, this.numLen, value)
                } else {
                    //this.code = value;
                    //this.updateValue();
                    this.showNumber(false, 0, value);
                }
            } else {
                this.code = value;
            }
            this.maxLengthInput = parseInt(this.maxlength) || 50;
        },
        showNumber(thou, len, value) {
            if (!len && len != 0) {
                len = 2
            } else {
                len = parseInt(len) !== undefined ? parseInt(len) : 2;
            }
            if (!value || parseFloat(value) === '0') {
                this.code = Number('0').toFixed(len);
                this.updateValue();
                return;
            }
            if (value && parseFloat(value) !== '0') {
                if (!isNaN(parseFloat(Vue.tpUtil.delcommafy(value)))) {
                    var itemValue = parseFloat(Vue.tpUtil.delcommafy(value));
                    if (this.patternKey && !Vue.tpUtil.getPattern(this.patternKey).test(itemValue)) {
                        Vue.prototype.$message.error(Vue.filter('translate')('gValidate' + this.patternKey));
                        this.code = '';
                    } else {
                        var _b = true;
                        //自定义校验大小
                        if (this.custom) {
                            if (this.max != undefined && itemValue >= this.max) {
                                _b = false;
                                Vue.prototype.$message.error('Must be less than ' + this.max);
                                this.code = '';
                            }
                            if (_b && this.min != undefined && itemValue <= this.min) {
                                _b = false;
                                Vue.prototype.$message.error('Must be greater than ' + this.min);
                                this.code = '';
                            }
                        }
                        if (_b) {
                            if (thou) {
                                this.code = Vue.tpUtil.comdify(Number(itemValue).toFixed(len));
                            } else {
                                this.code = Number(value).toFixed(len);
                            }
                        }
                    }
                    // if (itemValue >= minValue && itemValue <= maxValue) {
                } else {
                    Vue.prototype.$message.error('Please enter a number');
                    this.code = '';
                }
                var leng = this.code.length || 0;
                if (leng > this.maxLengthInput) {
                    this.code = this.code.substring((leng - this.maxLengthInput), leng);
                }
                this.repeat = false;
                this.updateValue();
            }
        }
    }
}
</script>