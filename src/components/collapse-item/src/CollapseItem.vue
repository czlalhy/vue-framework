<template>
    <div class="tp-collapse-item">
        <div class="collapse-item__header" style="background:#f7f7f7">
            <span :class="{'tp-collapse-line': showLine}" class="tp-collapse-header ellipsis" :style="{ width: titleWidth}" @click.stop="open" @keyup.space.enter.stop="open">
                    <i class="collapse-item__arrow el-icon-arrow-right" :class="{'active': close}"></i>{{title}}
                </span>
            <div class="tp-collapse-header-body" :style="{ float: contentAlgin}">
                <slot name="headerBody"></slot>
            </div>
        </div>
        <div class="el-collapse-item__content" style="background:#FFF" v-show="close" v-if="ifClose">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'TpCollapseItem',
    props: {
        isExpand: {
            type: Boolean,
            default: false
        },
        showLine: {
            type: Boolean,
            default: false
        },
        title: String,
        titleWidth: {
            type: String,
            default: '300px'
        },
        index: {
            type: Number,
            default: null
        },
        contentAlgin: {
            type: String,
            default: 'none'
        }
    },
    data: function() {
        return {
            close: false,
            ifClose: false
        }
    },
    created() {
        this.close = this.isExpand;
        this.ifClose = this.isExpand;
    },
    methods: {
        open() {
            this.close = !this.close;
            if (!this.ifClose)
                this.ifClose = this.close;
            this.$emit('change', this.close, this.index);
        }
    },
    watch: {
        isExpand(val) {
            this.close = val ? true : false;
            if (!this.ifClose)
                this.ifClose = this.close;
            this.$emit('change', this.close, this.index);
        }
    }
}
</script>