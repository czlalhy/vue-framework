/**
 * 显示模态弹窗入口
 * @author 陈柱良
 * @time 2019/04/10
 */
import Vue from 'vue'
var instance,
    tpl = '\
            <transition name="fade">\
                <el-dialog top="5%" :title="title" :close-on-click-modal="false" :width="width" custom-class="dialogForm" v-if="show" :visible.sync="show" :before-close="beforeClose">\<!-- style="z-index: -1 !important" -->\
                    <component v-bind:is="currentView" @callDialog="callData" :dialogProp="dialogProp" v-if="show" @closeDialog="close"></component>\
                </el-dialog>\
            </transition>',
    initInstance = function(dcom, name, propsData) {
        var TpShowModal = {
            template: tpl,
            props: {
                widthStyle: {
                    type: String,
                    default: 'dialog-large'
                }
            },
            data: function() {
                return {
                    currentView: '',
                    show: false,
                    width: '85%',
                    title: Vue.filter('translate')('gTitleBasics'),
                    callDialog: null,
                    closeDialog: null,
                    dialogProp: {}
                }
            },
            methods: {
                initPage() {
                },
                close() {
                    this.show = false;
                },
                beforeClose() {
                    typeof(this.closeDialog) === 'function' && this.closeDialog();
                    this.show = false;
                },

                callData(obj) {
                    typeof(this.callDialog) === 'function' && this.callDialog(obj);
                    this.show = typeof obj === 'object' ? obj.showDialog : false;
                }

            },
            mounted() {
                var _this = this;
                if (this.widthStyle === 'dialog-middle') {
                    this.width = '55%';
                } else if (this.widthStyle === 'dialog-small') {
                    this.width = '45%';
                }
                this.$nextTick(function() {
                    _this.show = true;
                    _this.initPage();
                });
            }
        };
        TpShowModal.components = {};
        TpShowModal.components[name] = dcom;
        var d = Vue.extend(TpShowModal);
        instance = new d({
            el: document.createElement('div'),
            propsData: propsData
        });
        document.body.appendChild(instance.$el);
        return instance
    },
    tpShowModal = function(dcom, options) {
        options.currentView = 'dcom';
        var instance = initInstance(dcom, options.currentView, {
            widthStyle: options.widthStyle
        });
        Object.assign(instance.$data, options || {});
        // return new Promise(function () {});
        return instance
    }
export default tpShowModal;