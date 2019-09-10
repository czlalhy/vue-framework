/**
 * 指令
 * @author 陈柱良
 * @time 2017/11/01
 */
import Vue from 'vue'
let btns = null,
    b = false;

function test() {
    btns = Vue.tpUtil.getCache('menu', 'btnsData');
}
Vue.directive('focus', {
    inserted: function(el) {
        el.querySelector('input').select();
    }
    // componentUpdated: function(el, binding, vnode, oldVnode){
    //     if (vnode.data.props.value.toString() !='') {
    //         var value = Number(vnode.data.props.value.toString()) || 0;
    //         el.querySelector('input').value = value.toFixed(2);
    //     }
    //     //console.log(el.children[0].value)
    // }
});
Vue.directive('focus1', {
    componentUpdated: function(el, binding, vnode) {
        if (vnode.data.props.value.toString() !== '') {
            var value = Number(vnode.data.props.value.toString()) || 0;
            el.querySelector('input').value = value.toFixed(2);
        }
        // console.log(el.children[0].value)
    }
});
Vue.directive('auth-btn', {
    bind: function(el, binding) {
        if (!b) {
            test();
            if (btns) {
                b = true;
            }
        }
        if (!btns || !btns['_' + binding.value]) {
            el.style.display = 'none';
        }
    }
});
Vue.directive('correct', {
    bind: function(el, b, c) {
        var name = !b.modifiers.textarea ? 'input' : 'textarea',
            title = '';
        var _input = el.querySelector(name);
        if (_input) {
            title = !b.value && b.value != 0 && (b.value + '') != 'false' ? '' : b.value;
            _input.setAttribute('data-correct-old', title);
            _input.setAttribute('title', title);
        }
    },
    update: function(el, b, c) {
        if (b.value != b.oldValue) {
            var name = !b.modifiers.textarea ? 'input' : 'textarea';
            var _input = el.querySelector(name);
            if (_input) {
                var title = !b.value && b.value != 0 && (b.value + '') != 'false' ? '' : b.value;
                _input.setAttribute('data-correct-old', title);
                _input.setAttribute('title', title);
            }
        } else {
            var name = !b.modifiers.textarea ? 'input' : 'textarea';
            var _input = el.querySelector(name);
            if (_input) {
                var flag = _input.getAttribute('data-correct');
                if (flag != null && flag != '0') { // && !_input.getAttribute('disabled')
                    correct(c, _input.getAttribute('data-correct-old') || '', _input);
                }
            }
        }
    }
});
Vue.directive('correct-flg', {
    bind: function(el, b, c) {
        var name = !b.modifiers.textarea ? 'input' : 'textarea';
        var _input = el.querySelector(name);
        if (_input) {
            //_input.setAttribute('data-correct-type', '1');
            _input.setAttribute('data-correct', b.value || '0');
        }
    },
    update: function(el, b, c) {
        if (b.value != 0 && b.value != b.oldValue) {
            var name = !b.modifiers.textarea ? 'input' : 'textarea';
            var _input = el.querySelector(name);
            if (_input) {
                _input.setAttribute('data-correct', b.value);
                _input.setAttribute('data-correct-flag', '1');
                var oldValue = _input.getAttribute('data-correct-old') || '';
                correct(c, oldValue, _input);
            }
        }
    }
});

function correct(c, old, inputDom) {
    var nowValue = c.data.model.value, //inputDom.value,
        color = inputDom.getAttribute('data-correct-type'),
        re = inputDom.getAttribute('readonly'),
        di = inputDom.getAttribute('disabled'),
        is = inputDom.getAttribute('is-select');
    nowValue = !nowValue && nowValue != 0 && (nowValue + '') != 'false' ? '' : nowValue + '';

    if (color == 'I') {
        // if (re && di && is) {
        //     inputDom.style.backgroundColor = '#ffffff';
        // } else {
        //新增  蓝色
        inputDom.style.backgroundColor = '#A0E88C';
        // }
        return;
    }
    if (color == 'D' || color == 'B') {
        // if (re && !di && is) {
        //     inputDom.style.backgroundColor = '#ffffff';
        // } else {
        // 删 灰色
        inputDom.style.backgroundColor = '#808080';
        // }
        return;
    }
    var isNumber = inputDom.getAttribute('is-number');
    if (isNumber) {
        if (old || old == '0') {
            old = parseFloat(old) || '';
        }
        if (nowValue || nowValue == '0' || nowValue == 0) {
            nowValue = parseFloat(nowValue) || '';
        }
    }
    if (old == nowValue) {
        // 未改
        if (!color || color == '1' || color == 'U') {
            inputDom.setAttribute('data-correct-type', '1');
            if ((re && di && is) || (re && !is) || (di && !is)) {
                inputDom.style.backgroundColor = '#ffffff';
            } else {
                inputDom.style.backgroundColor = '#d0e6f5';
            }
        }
    } else if (old != nowValue) {
        // 改 黄色
        if (color != 'U' && color !== 'D' && color !== 'B' && color !== 'I') {
            inputDom.setAttribute('data-correct-type', 'U');
            inputDom.style.backgroundColor = '#ffff00';
        }
    }
}
Vue.directive('to-fixed', {
    componentUpdated: function(el, binding, vnode) {
        if (vnode.data.props.value.toString() !== '') {
            var value = Number(vnode.data.props.value.toString()) || 0;
            el.querySelector('input').value = value.toFixed(2);
        }
        // console.log(el.children[0].value)
    },
    update: function(el, binding, vnode) {
        if (vnode.data.props.value.toString() !== '') {
            var value = Number(vnode.data.props.value.toString()) || 0;
            el.querySelector('input').value = value.toFixed(2);
        }
        // if (binding.value.toString().indexOf(".") > -1) {
        //     let reg = /\.\d{2}/
        //     if (reg.test(binding.value)) {
        //         console.log(el.querySelector('input'))
        //         el.querySelector('input').value = Number(binding.value.toString().match(/^(\-|\d)+(?:\.\d{0,2})?/)[0])
        //     }
        // }
        // console.log(el.children[0].value)
    }
});