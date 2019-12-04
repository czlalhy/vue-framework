<template>
    <td :width="widths" :colspan="colspan">
        <el-form-item :prop="prop" :rules="rules">
            <slot></slot>
        </el-form-item>
    </td>
</template>
<script>
export default {
    name: 'TpFormInput',
    props: {
        width: {
            type: Number,
            default: 2
        },
        prop: {
            type: String,
            default: ''
        },
        colspan: {
            type: String,
            default: '1'
        },
        rules: {
            type: Array,
            default: null
        },
    },
    data: function() {
        return {
            widths: (this.width / 24 * 100).toFixed(2) + '%'
        }
    }
}
</script>