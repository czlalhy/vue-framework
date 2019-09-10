<template>
    <el-button size="small" @click="onShow()" :style="{ 'text-align': position}" :class="{'el-icon-caret-bottom': !more, 'el-icon-caret-top': more}" style="width: 100%;border: 0px;height: 29px;">{{msg}}</el-button>
</template>
<script>
export default {
    name: 'TpButton',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: String,
            default: null
        },
        notShowTitle: {
            type: String,
            default: null
        },
        position: {
            type: String,
            default: 'center'
        }
    },
    data: function() {
        return {
            more: null,
            msg: ''
        };
    },
    created() {
        this.initPage();
    },
    methods: {
        initPage() {
            if (!this.showTitle) {
                this.showTitle = Vue.filter('translate')('gBtnMore');
            }
            if (!this.notShowTitle) {
                this.notShowTitle = Vue.filter('translate')('gBtnHide');
            }
            this.more = this.show ? this.show : false;
        },
        onShow() {
            if (this.more) {
                this.more = false;
            } else {
                this.more = true;
            }
            this.$emit('click');
        }
    },
    watch: { // 监听数据变化
        show(val) {
            this.more = val;
        },
        more(val) {
            this.more = val;
            if (this.more) {
                this.msg = this.showTitle
            } else {
                this.msg = this.notShowTitle
            }
        }
    }
}
</script>