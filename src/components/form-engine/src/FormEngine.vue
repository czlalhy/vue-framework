<template>
    <el-form ref="form" :model="form" :inline="true" label-width="109px" class="table-line">
        <template v-for="item in items">
            <!-- Object -->
            <table cellpadding="0" cellspacing="0" v-if="item.type === 'object'" class="tp-table">
                <tr v-for="tr in item.trs">
                    <template v-for="v in tr">
                        <tp-form-label :keyName="v.nameKey" :requires="v.required" :width="item.labelWidth"></tp-form-label>
                        <tp-form-input :prop="v.elementCode" :rules="v.rule" :width="item.inputWidth" :colspan="v.colSize">
                            <component :is="v.comp" v-model="item.name ? form[item.name][v.elementCode] : form[v.elementCode]" @dispatch="dispatch" :engine="engine"></component>
                        </tp-form-input>
                    </template>
                </tr>
            </table>
            <!-- List -->
            <el-table :data="item.name ? form[item.name] : form" v-if="item.type === 'list'" border>
                <!-- 序号 -->
                <el-table-column v-if="item.showSN" label-class-name="require-star" :label="'gNumber' | translate('SN')" width="70" align="center">
                    <template scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <!-- 值 -->
                <el-table-column v-for="v in item.elems" :label-class-name="v.required ? 'require-star' : ''" :label="v.nameKey | translate">
                    <template slot-scope="scope">
                        <tp-form-input :prop="(item.name ? item.name : '') + '.' + scope.$index + '.' + v.elementCode" :rules="v.rule">
                            <component :is="v.comp" :index="scope.$index" :flag="scope.row.flag && scope.row.flag !='U' ? scope.row.flag : ''" v-model="scope.row[v.elementCode]" @dispatch="dispatch" :engine="engine"></component>
                        </tp-form-input>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column v-if="item.showOP" :label="'gTitleOperation' | translate('Operation')" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="!(scope.row[item.readonly] || engine.isCorrectBtn)" size="mini" type="primary" icon="el-icon-minus" @click="onDeletes(scope.$index, item.name)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="!(item.type !== 'list' || engine.isCorrectBtn)" class="toolbar-btn toolbar-pagination" style="margin-bottom: 0;">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="onAdd(item.name)"></el-button>
            </div>
        </template>
        <!-- BottomButton -->
        <div :span="24" class="toolbar-btn toolbar-pagination" style="text-align: center;">
            <component v-for="btn in bottomBtns" :is="btn.comp" @dispatch="dispatch" :engine="form"></component>
        </div>
    </el-form>
</template>
<script>
import Vue from 'vue';
import util from './util';
export default {
    name: 'TpFormEngine',
    props: {
        // v-model
        value: {
            // type: Array,
            // default: function() {
            //     return []
            // }
        },
        // 页面对象, 用于配置API
        formCode: {
            type: String,
            default: ''
        },
        // 产品编码, 用于配置API
        productCode: {
            type: String,
            default: ''
        },
        // 标的编码，用于配置API
        subjectType: {
            type: String,
            default: ''
        },
        // 方案编码, 用于配置API
        planCode: {
            type: String,
            default: ''
        },
        // 传给引擎的外部数据
        data: {
            type: Object,
            default: function() {
                return {
                    code: 'findProduct'
                }
            }
        },
        // 表单为 List 时是否展示序号
        showSN: {
            type: Boolean,
            default: true
        },
        // 只供查看，Todo
        readonly: {
            type: Boolean,
            default: false
        },
        correct: {
            type: Number,
            default: 0
        },
        handleType: {
            type: String,
            default: '0'
        },
    },
    data: function() {
        return {
            // 只供查看
            isReadonly: false,
            // 页面元素
            items: [],
            // 底部按钮
            bottomBtns: [],
            // 表单数据
            form: null,
            form1: {},
            // 校验规则
            ref: {}
        }
    },
    created: function() {
        (this.productCode && this.subjectType && this.planCode || this.formCode) && this.initPage();
    },
    mounted: function() {
        this.form = this.value;
    },
    computed: {
        engine: function() {
            return Object.assign({}, this.data, this.form)
        }
    },
    watch: {
        form: {
            handler: function(val) {
                this.$emit('input', val)
            },
            deep: true
        },
        formCode: function(val) {
            val && this.initPage();
        },

    },
    methods: {
        // 新增
        onAdd: function(name) {
            if (this.correct > 0 || this.handleType == '1') {
                this.$emit('onAdd', this.form, this.engine, this.$set, this.correct);
            } else {
                if (name) {
                    if (this.form[name]) {
                        this.form[name].push({})
                    } else {
                        this.$set(this.form, name, [{}])
                    }
                } else {
                    this.form.push({})
                }
            }

        },
        // 删减
        onDeletes: function(index, name) {
            if (this.correct > 0 || this.handleType == '1') {
                this.$emit('onDeletes', this.form, this.engine, index, this.correct);
            } else {
                if (name) {
                    this.form[name].splice(index, 1);
                } else {
                    this.form.splice(index, 1);
                }
            }
        },
        // 接收组件传来的事件，然后分发
        dispatch: function(item) {
            var event = item.event,
                value = item.value
            this.$emit(event, value.val, value.val1, value.val2, value.val3);
        },
        // 初始化
        initPage: function() {
            this.getViewObject();
            this.isReadonly = this.readonly;
        },
        // 获取页面对象
        getViewObject: function() {
            var _this = this,
                key = this.productCode + this.planCode + this.subjectType;
            this.getViewObjectApi({
                formCode: this.formCode,
                productCode: this.productCode,
                planCode: this.planCode,
                subjectType: this.subjectType
            }).then(function(res) {
                if (res.resCode === '0000') {
                    var result = util.transformData(res.resData.object, key),
                        rows = result.rows,
                        bottomBtns = result.bottomBtns;
                    _this.items = rows;
                    _this.bottomBtns = bottomBtns;
                }
            })
        },
        // 获取页面对象
        getViewObjectApi: function(params) {
            var url = Vue.tpUtil.getUrl({
                apiName: params.formCode ? 'layoutFormEngineForm' : 'layoutFormEngine',
                urlParams: params,
                contextName: 'auth'
            });
            return Vue.tpUtil.http.get(url);
        },
        // 表单校验
        validate: function(cb) {
            this.$refs.form.validate(cb);
        }
    }
}
</script>