<template>
    <transition name="fade">
        <el-input :rows="rows" :readonly="readonly" type="textarea" @input="updateValue()" @keyup.native="onCopy" v-model="content" v-on:keydown.tab.native="onKeyUp"></el-input>
    </transition>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpTextarea',
    props: {
        value: [String, Number],
        pla: { //占位符 每个占位符占多少个空格，不够则补
            type: Number,
            default: 0
        },
        readonly: {
            type: Boolean,
            default: false
        },
        rows: {
            type: Number,
            default: 3
        }
    },
    data: function() {
        return {
            content: ''
        };
    },
    watch: {
        value(val) {
            this.content = val;
        }
    },
    created() {
        this.initData();
    },
    mounted() {

    },
    methods: {
        updateValue() {

            this.$emit('input', this.content);
        },
        onCopy(event) {
            if (event.ctrlKey && event.keyCode == 86 && this.content) {
                var content = this.content;
                // 将tab键替换成空格
                // this.content = content.replace(new RegExp('\t','gm'),this.computNBSP(8));
                var arr = content.split("\t");
                var temp = arr[0];
                if (arr.length > 1) {
                    for (var i = 1, size = arr.length; i < size; i++) {
                        var endStr = arr[i];
                        var startPos = temp.length + 1;
                        var pos = temp.lastIndexOf("\n") + 1;
                        if (pos < 0) pos = 0;
                        var num = 5 - (startPos - pos) % 5;
                        temp += this.computNBSP(num) + endStr;
                    }
                }
                this.content = temp;
            }
            this.updateValue();
        },
        initData() {
            this.content = this.value;
        },
        onKeyUp(event) {
            if (this.pla <= 0) {
                return;
            }
            var tmpStr = this.content;
            if (!tmpStr) {
                tmpStr = "";
            }
            var startPos = event.target.selectionStart,
                starStr = tmpStr.substring(0, startPos);
            var pos = starStr.lastIndexOf("\n") + 1;
            if (pos < 0) pos = 0;
            var num = 5 - (startPos - pos) % 5;
            tmpStr = starStr + this.computNBSP(num) + tmpStr.substring(startPos, tmpStr.length);
            this.content = tmpStr;
            startPos += num;
            event.preventDefault();
            this.updateValue();
            this.$nextTick(function() {
                event.target.selectionStart = startPos;
                event.target.selectionEnd = startPos;
            });
        },
        computNBSP(num) {
            var str = '';
            for (var i = 0; i < num; i++) {
                str += ' ';
            }
            return str;
        }
    }
}
</script>