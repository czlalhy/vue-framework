<template>
    <td :width="widths" :align="align" :colspan="colspan">
        <span class="lable">
                <em class="require" v-if="requires">*</em>
                <slot></slot>
                {{name}}
            </span>
    </td>
</template>
<script>
import Vue from 'vue';
export default {
    name: 'TpFormLabel',
    props: {
        keyName: {
            type: String,
            default: ''
        },
        requires: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 2
        },
        colspan: {
            type: String,
            default: '1'
        },
        align: {
            type: String,
            default: 'right'
        }
    },
    data: function() {
        return {
            widths: (this.width / 24 * 100).toFixed(2) + '%',
            name: this.keyName ? Vue.filter('translate')(this.keyName) + ':' : ''
        }
    },
    watch: { // 监听数据变化
        keyName(val) { // 监听 data里面的wa,val是最新的值，old是旧的数据
            this.name = Vue.filter('translate')(val);
        }
    }
}
</script>