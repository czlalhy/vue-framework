/**
 * 表单引擎工具
 * @author 谢代荣
 * @time 2019/04/11
 */
import Vue from 'vue';
// 引擎支持组件
let typeMaps = {
        text: 'el-input',
        select: 'tp-select',
        textarea: 'el-input',
        date: 'el-date-picker',
        dbclick: 'tp-dbclick',
        tpautocomplete: 'tp-auto-complete'
    },
    // 默认属性列表
    defAttrs = {
        text: [{
            prop: 'size',
            value: 'mini',
            async: false
        }],
        select: [{
            prop: 'size',
            value: 'mini',
            async: false
        }],
        textarea: [{
            prop: 'type',
            value: 'textarea',
            async: false
        }],
        date: [{
            prop: 'size',
            value: 'mini',
            async: false
        }, {
            prop: 'value-format',
            value: 'yyyy-MM-dd HH:mm:ss',
            async: false
        }]
    },
    // 转国际化属性
    internationAttrLists = 'placeholder'

// 模板工厂
function templateFactory(type, attrs, events, name) {
    var comp = typeMaps[type],
        defAttr = defAttrs[type] || [],
        template;
    attrs = attrs || []
    events = events || []
    attrs = attrs.concat(defAttr)
    // 动态属性校验
    attrs.forEach(function(item) {
        if (/^async\./.test(item.value)) {
            item.value = item.value.replace('async.', '')
            item.async = true
        }
        if (/^engine\./.test(item.value)) {
            item.async = true
        }
        if (/^v-+/.test(item.prop)) {
            item.async = false
        }
    })
    // 生成模板
    if (comp) {
        template = '<' + comp + ' v-model="compValue"'
        attrs.forEach(function(item) {
            item = internationAttr(item)
            template += item.async ? ' :' : ' '
            template += item.prop
            template += '="' + item.value + '"'
        });
        //template += ' v-correct="engine.originList[index].name" v-correct-flg="engine.originVo.correct" :data-correct-type="flag" '
        events.forEach(function(item) {
            template += ' @' + item.prop
            template += '="' + item.prop.replace(/-/g, '') + '"'
        })
        template += '></' + comp + '>'
        //console.log(template);
    } else if (type === 'search') {
        // 搜索框
        template = '<div><el-input size="mini" v-model="compValue" style="width:88%;"></el-input><el-button size="mini" type="primary"     class="pd-f0" icon="el-icon-search" style="width:10%; margin-left: 4px;"'
        events.forEach(function(item) {
            template += ' @' + item.prop
            template += '="' + item.prop.replace(/-/g, '') + '"'
        })
        template += '></el-button></div>'
    } else if (type === 'radio') {
        // 单选框
        var tempYes = '<el-radio size="mini" v-model="compValue" class="radio" :label="true"',
            tempNo = '<el-radio size="mini" v-model="compValue" class="radio" :label="false"'
        attrs.forEach(function(item) {
            item = internationAttr(item)
            tempYes += item.async ? ' :' : ' '
            tempYes += item.prop
            tempYes += '="' + item.value + '"'
            tempNo += item.async ? ' :' : ' '
            tempNo += item.prop
            tempNo += '="' + item.value + '"'
        })
        tempYes += '>Yes</el-radio>'
        tempNo += '>No</el-radio>'
        template = '<div>' + tempYes + tempNo + '</div>'
    } else if (type === 'bottomBtn') {
        // 底部按钮
        template = '<el-button size="mini"'
        attrs.forEach(function(item) {
            item = internationAttr(item)
            template += item.async ? ' :' : ' '
            template += item.prop
            template += '="' + item.value + '"'
        })
        events.forEach(function(item) {
            template += ' @' + item.prop
            template += '="' + item.prop.replace(/-/g, '') + '"'
        })
        template += '>{{"' + name + '" | translate("' + name + '")}}</el-button>'
    }
    return template
}

// 国际化属性
function internationAttr(attr) {
    var prop = attr.prop,
        value = attr.value,
        async = attr.async
    if (!async &&~internationAttrLists.indexOf(prop)) {
        return {
            prop: prop,
            value: '\'' + value + '\' | translate',
            async: true
        }
    } else {
        return attr
    }
}

// 组件工厂
// name-组件名称（后期自动生成）type-组件类型 props-传给组件的属性（即新组件中的data）methodsT-方法(貌似没用) attrs-组件属性配置 events-组件事件配置
function componentFactory(name, type, props, methodsT, attrs, events) {
    if (!name) {
        return
    }
    var template = templateFactory(type, attrs, events, name),
        methods = {};
    events = events || []
    events.forEach(function(item) {
        var prop = item.prop.replace(/-/g, ''),
            value = item.value
        methods[prop] = function(val, val1, val2, val3) {
            this.$emit('dispatch', {
                event: value,
                value: {
                    val: val,
                    val1: val1,
                    val2: val2,
                    val3: val3
                }
            });
        }
    })
    Vue.component(name, {
        template: template,
        props: {
            index: null,
            flag: null,
            value: null,
            engine: null
        },
        data: function() {
            var res = {
                compValue: ''
            }
            return Object.assign(res, props);
        },
        watch: {
            value: function(val) {
                this.compValue = val;
            },
            compValue: function(val) {
                this.$emit('input', val)
            }
        },
        mounted: function() {
            // 初始化
            this.compValue = this.value;
        },
        methods: methods
    })
}

let util = {
    // 转换数据
    transformData: function(obj, keys) {
        // 整理元素属性
        function calcAttrs(item) {
            var attribute = item.attribute || '[]',
                rule = item.validationConfig || '[]',
                required = false,
                attrs, events
            attribute = JSON.parse(attribute)
            attrs = attribute.filter(function(tmp) {
                return tmp.type === 'attr'
            })
            events = attribute.filter(function(tmp) {
                return tmp.type === 'event'
            })
            // 处理元素校验规则
            /* eslint no-cond-assign: "off" */
            rule = JSON.parse(rule)
            if (rule.length && item.textType !== 'bottomBtn') {
                rule = rule.map(function(tmp) {
                    var message = tmp.message,
                        pattern = tmp.pattern || '',
                        trigger = tmp.trigger,
                        reg
                    message = message ? Vue.tpUtil.getInzTranslate(message) : undefined
                    if (pattern === 'required') {
                        required = true
                        return {
                            trigger: trigger,
                            required: true,
                            message: message
                        }
                    } else if (pattern === 'notrequired') {
                        required = false
                        return {
                            trigger: trigger,
                            required: false,
                            message: message
                        }
                    } else if (reg = pattern.match(/(\/)(.*)(\/)([a-z]+)?/)) {
                        pattern = new RegExp(reg[2], reg[4])
                        return {
                            trigger: trigger,
                            pattern: pattern,
                            message: message
                        }
                    } else if (~['url', 'email'].indexOf(pattern)) {
                        // url email
                        return {
                            trigger: trigger,
                            type: pattern,
                            message: message
                        }
                    }
                    return {
                        trigger: trigger,
                        type: pattern,
                        message: message
                    }
                })
            } else {
                rule = [{
                    trigger: 'blur',
                    required: true,
                    message: 'message'
                }]
            }

            return {
                attrs: attrs,
                events: events,
                textType: item.textType,
                elementCode: item.elementCode,
                nameKey: item.nameKey,
                required: required,
                colSize: item.colSize || '1',
                sorting: item.sorting,
                rule: rule
            }
        }

        // 排版
        function composing() {
            var trs = [],
                tr = []
            for (var i = 0, len = elems.length; i < len; i++) {
                var el = elems[i],
                    colSize = +el.colSize,
                    less = column - curCols,
                    hadPush = false
                // 当前行元素 tr
                if (less - colSize >= 1) {
                    // 可添加到当行
                    tr.push(el)
                    curCols += colSize + 1
                    hadPush = true
                } else if (less) {
                    while (less) {
                        less -= 2
                        curCols += 2
                        tr.push({})
                    }
                }
                // 判断当前是否已满
                less = column - curCols
                if (!less) {
                    curCols = 0
                    trs.push(tr)
                    tr = []
                }
                // 当前元素未被添加
                if (!hadPush) {
                    tr.push(el)
                    curCols += colSize + 1
                    hadPush = true
                }
                // 最后元素
                if (i + 1 === len) {
                    less = column - curCols
                    while (less && curCols) {
                        less -= 2
                        curCols += 2
                        tr.push({})
                    }
                    curCols = 0
                    trs.push(tr)
                    tr = []
                }
            }
            return trs
        }

        // 处理单元
        function unit(type, elementCode) {
            elems = elems.filter(function(em) {
                return em.textType !== 'bottomBtn' && !em.pubViewObjectVo
            }).sort(function(a, b) {
                return a.sorting - b.sorting
            })
            var row = {}
            if (elems.length) {
                row.name = elementCode
                row.type = type
                row.labelWidth = column === 4 ? 2 : 3,
                    row.inputWidth = column === 4 ? 4 : 5
                elems = elems.map(function(item) {
                    item = calcAttrs(item)
                    // 创建组件
                    componentFactory(item.nameKey + keys, item.textType, {}, null, item.attrs, item.events)
                    item.comp = item.nameKey + keys;
                    return item
                })
                if (type === 'object') {
                    row.trs = composing()
                } else {
                    // list 属性
                    var attribute = currentItem.attribute || '[]'
                    attribute = JSON.parse(attribute)
                    attribute.forEach(function(item) {
                        var prop = item.prop,
                            value = item.value
                        row[prop] = value
                    })
                    row.showSN = row.showSN === undefined ? true : row.showSN
                    row.showOP = row.showOP === undefined ? true : row.showOP
                    row.readonly = row.readonly || 'readonly'
                    row.elems = elems
                    /* row.elems = elems.filter(function (ell) {
                        return ell.textType === 'text'
                    }) */
                }
                rows.push(row)
            }
        }

        var rows = [],
            // 列表当前处理对象
            currentItem = {},
            // 公共
            elems = obj.pubViewObjectEleVos,
            arrangement = ~~obj.arrangement || 6,
            column = ~~(arrangement / 2) * 2,
            curCols = 0,
            // 分离出底部按钮
            bottomBtns = elems.filter(function(em) {
                return em.textType === 'bottomBtn'
            }),
            // 分离出对象、列表
            lists = elems.filter(function(em) {
                return em.pubViewObjectVo
            })

        // [1] 处理零散件
        unit('object')
        // [2] 处理嵌套元素（对象或列表）
        if (lists.length) {
            for (var i = 0, len = lists.length; i < len; i++) {
                var dataType = lists[i].dataType,
                    elementCode = lists[i].elementCode
                currentItem = lists[i]
                obj = currentItem.pubViewObjectVo
                elems = obj.pubViewObjectEleVos
                arrangement = ~~obj.arrangement || 6
                column = ~~(arrangement / 2) * 2
                curCols = 0
                unit(dataType, elementCode)
            }
        }
        // [3] 处理底部按钮
        bottomBtns.sort(function(a, b) {
            return a.sorting - b.sorting
        })
        bottomBtns = bottomBtns.map(function(item) {
            item = calcAttrs(item)
            componentFactory(item.nameKey, item.textType, {}, null, item.attrs, item.events)
            item.comp = item.nameKey
            return item
        })
        // 只有一个元素
        if (rows.length === 1) {
            delete rows[0].name
        }
        // console.log(rows)
        return {
            rows: rows,
            bottomBtns: bottomBtns
        }
    }
};
export default util;