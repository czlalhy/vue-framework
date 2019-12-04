<template>
    <label>
        <td  :colspan="colspanLeft">
            <span class="lable">
                <em class="require" v-if="requires">*</em>
                {{name}}
            </span>
        </td>
        <td  :colspan="colspanRight">
            <el-form-item :prop="prop" :rules="rules">
                <slot></slot>
            </el-form-item>
        </td>
        <!-- <el-col :span="3" class="td-lable td">
            <em class="require" v-if="requires">*</em>
            {{name}}
        </el-col>
        <el-col :span="5" class="td">
            <el-form-item :prop="prop" :rules="rules">
                <slot></slot>
            </el-form-item>
        </el-col> -->
    </label>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'ZkFormItem',
    componentName: 'ZkFormItem',
    // inject: ['zkForm'],
    props: {
        widthLeft: {
            type: Number,
            default: 2
        },
        widthRight: {
            type: Number,
            default: 2
        },
        colspanLeft: {
            type: String,
            default: '1'
        },
        colspanRight: {
            type: String,
            default: '1'
        },
        keyName: {
            type: String,
            default: ''
        },
        rules: {
            type: Array,
            default: null
        },
        prop: {
            type: String,
            default: ''
        },
        requires: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            widthsLeft: (this.widthLeft / 24 * 100).toFixed(2) + '%',
            widthsRight: (this.widthRight / 24 * 100).toFixed(2) + '%',
            name: this.keyName ? Vue.filter('translate')(this.keyName) + ':' : ''
        };
    },
    watch: {
        keyName(val) { // 监听 data里面的wa,val是最新的值，old是旧的数据
            this.name = Vue.filter('translate')(val);
        }
    },
    created() {

    },
    methods: {

    }
}
</script>