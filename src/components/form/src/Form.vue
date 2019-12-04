<template>
  <el-form ref="form" size="mini" :model="model" :inline="true" :rules="rules" class="table-line" hide-required-asterisk status-icon :disabled="disabled" @submit.native.prevent>
    <table cellpadding="0" cellspacing="0" class="tp-table">
        <!-- <div class="zk-table"> -->
        <slot name="test"></slot>
        
    </table>
  </el-form>
</template>
<script>
import Vue from 'vue'
import Mixins from '../../../mixins/tableMixins'
export default {
    name: 'ZkForm',
    componentName: 'ZkForm',
    mixins: [Mixins],
    provide() {
      return {
        zkForm: this
      };
    },
    props: {
      model: Object,
      rules: Object,
      disabled: Boolean
    },
    data: function() {
        return {
            
        };
    },
    watch: {

    },
    created() {
        
    },
    mounted() {

    },
    methods: {
        validate(callBack) {
            this.$refs.form.validate(function(valid, obj) {
                callBack(valid, obj);
            });
        },
        resetFields() {
            this.$refs.form.resetFields();
        },
        clearValidate(props = []) {
            this.$refs.form.clearValidate(props);
        }
    }
}
</script>