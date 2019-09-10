<template>
    <div class="float-nemu-wrapper">
        <span class="el-icon-arrow-left" v-if="!show" @mouseover="more" style="width:30px;height:30px;line-height:30px;background:#7a6e6e;border-radius:2px;color:#fff;vertical-align:top"></span>
        <ul @click.stop v-show="show" @mouseout="less" @mouseover="more">
            <li class="float-menu-item" v-for="item in list" :key="item.id" :class="{'active':index === item.id}" @click="select(item)">
                {{item.name}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'TpFloatMenu',
    props: {
        // 导航配置数据
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 容器
        container: {
            type: String,
            default: 'content-container'
        },
        // 子元素索引
        el: {
            type: Object,
            default: function() {
                return {}
            }
        },
        // 是否在弹出框中使用
        isDialog: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            // 子集列表
            list: [],
            // 被选中元素
            index: '',
            // 容器
            content: null,
            // Todo 废弃
            id: '',
            // 是否展示所有选项
            show: false
        }
    },
    created: function() {
        var _this = this,
            index
        this.list = this.data;
        if (this.list.length > 0) {
            index = this.index = this.list[0].id;
            this.$nextTick(function() {
                _this.content = !_this.isDialog ? document.querySelector('#' + _this.container) : _this.closest(_this.el[index].$el, '.el-dialog__wrapper');
                //console.log(_this.content)
            });
        }
    },
    methods: {
        /**
         * 选中
         */
        select: function(obj) {
            var index = obj.id,
                item = this.el[index],
                offsetTop = item.$el.offsetTop
            this.index = index
            this.content.scrollTop = offsetTop
        },
        more() {
            this.show = true
        },
        less() {
            this.show = false
        },
        // 查找元素，针对弹出框
        closest(el, selector) {
            var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
            while (el) {
                if (matchesSelector.call(el, selector)) {
                    break;
                }
                el = el.parentElement;
            }
            return el;
        }
    }
}
</script>