<template>
    <div style="min-height: 2em;">
        <div :class="{ 'inputColumn': isColumn}" @dblclick="onDbClick('1')" class="dblclick">
            <el-input size="mini" :autofocus="autofocus" :data-correct-type="dataCorrectType" :maxlength="maxlength" @blur="onDbClick('2')" :readonly="isReadonly" :placeholder="'gDblclick' | translate('Double click')" v-model="codeColumn"></el-input>
            <transition name="fade">
                <el-dialog append-to-body top="5%" :title="title" :close-on-click-modal="false" custom-class="dialogForm dialog-middle" v-if="show" :visible.sync="show" :before-close="beforeClose">
                    <el-collapse v-model="activeNames">
                        <el-collapse-item :title="'gTitleSearchData' | translate('Search Data')" name="1">
                            <el-form :inline="true" ref="filters" :model="filters" style="padding-bottom: 0px;padding-top: 0px;">
                                <el-form-item v-if="searchParams.one.open" :label="searchParams.one.title" prop="searchOneParam">
                                    <el-input size="mini" v-model="filters.searchOneParam"></el-input>
                                </el-form-item>
                                <el-form-item v-if="searchParams.two.open" :label="searchParams.two.title" prop="searchTwoParam">
                                    <el-input size="mini" v-model="filters.searchTwoParam"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button size="mini" type="primary" @click="onGetList('1')">{{"gBtnSearch" | translate("Search") }}</el-button>
                                    <el-button size="mini" @click="onResetForm()">{{ "gBtnClear" | translate("Clear") }}</el-button>
                                    <el-button v-if="isMoreSelect" size="mini" type="primary" @click="save()">{{"gBtnConfirm" | translate("Confirm") }}</el-button>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                    <template>
                        <div v-if="isMoreSelect" class="block table-toolbar">
                            <el-tag v-for="tag in tags" :key="tag.name" closable :type="tag.type" size="mini" @close="handleClose(tag)">{{tag.name}}</el-tag>
                        </div>
                        <el-table ref="multipleTable" :data="datas" highlight-current-row border stripe style="width: 100%;" @select="handleSelectionChange1" @select-all="handleSelectionChange">
                            <el-table-column v-if="isMoreSelect" type="selection" width="55"></el-table-column>
                            <el-table-column prop="showOne" :label="tableProps.oneTitle">
                            </el-table-column>
                            <el-table-column prop="showTwo" :label="tableProps.twoTitle">
                            </el-table-column>
                            <el-table-column :label="'gTitleOperation' | translate('Operation')" width="100">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="onHandleSelect(scope.row)">{{ "gBtnSelect" | translate }}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                    <div :span="24" class="toolbar-btn toolbar-pagination" style="padding-bottom: 10px;margin-bottom: 15px;">
                        <el-pagination small @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" :page-sizes="[10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page.sync="currentPage">
                        </el-pagination>
                    </div>
                </el-dialog>
            </transition>
        </div>
        <div v-if="isColumn" class="lableColumn">
            <el-input size="mini" v-model="lableColumn" @blur="onClickLableColumn()" :readonly="lableReadonly || isReadonly"></el-input>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TpDbclick',
    props: {
        maxlength: {
            type: Number,
            default: 50
        },
        //preQueryData: Object,
        lableReadonly: true,
        'dataCorrectType': '',
        'ids': '',
        'value': [String, Number],
        'table-one-params': String,
        'table-one-title': String,
        'table-two-params': String,
        'table-two-title': String,
        // 'search-one-value': String,
        'search-one-params': String,
        'is-more-select': false,
        'case-insensitive': false,
        'search-one-title': String,
        'search-two-params': String,
        'search-two-title': String,
        'search-two-value': String,
        'pre-query-data': Object,
        'code-type': String,
        'select-handle-params': String,
        'view-object-code': String,
        'index': String,
        'lable-params': String,
        'lable-value': String,
        'code': {
            type: String,
            default: ''
        },
        'po-name': {
            type: String,
            default: ''
        },
        'context-name': {
            type: String,
            default: 'system'
        },
        'is-one-show': {
            type: Boolean,
            default: false
        },
        'is-readonly': {
            type: Boolean,
            default: false
        },
        'dbclick-object': {
            type: String,
            default: null
        },
        'url': {
            type: String,
            default: ''
        },
        orderByField: { // 要排序的字段
            type: String,
            default: ''
        },
        direction: { // 顺序还是倒序 desc，asc
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            tags: [],
            isInit: false,
            activeNames: ['1'],
            show: false,
            title: Vue.tpUtil.getInzTranslate('gDblclick'),
            filters: {
                searchOneParam: '',
                searchTwoParam: ''
            },
            tableProps: {
                oneShowParams: 'codeCode',
                twoShowParams: 'value',
                oneTitle: Vue.filter('translate')('gCode'),
                twoTitle: Vue.filter('translate')('gValue')
            },
            config: {
                isOneOpenDialog: false, // 查询结果只有一条记录时是否打开双击域，true：打开；false：不打开
                codeType: '',
                poName: '',
                caseInsensitive: false
            },
            searchParams: { // 双击域查询条件设置
                one: {
                    name: 'codeCode',
                    value: '',
                    title: Vue.filter('translate')('gCode'),
                    open: true
                },
                two: {
                    name: '',
                    value: '',
                    title: '',
                    open: false
                }
            },
            ckey: false,
            path: '',
            autofocus: false,
            frontSearchParams: {},
            datas: [],
            total: 0,
            pageNo: 0,
            pageSize: 10,
            currentPage: 1,
            callBack: null,
            codeColumn: '', // 显示code的属性
            codeId: '', // code的Id
            lableColumn: '', // 显示详情的属性
            isColumn: false, // 是否显示详情
            selectHandleParamsData: null,
            selectHandleParamsExtend: {},
            lableParamsData: null,
            dbclickObjectData: null,
            tagCache: [],
            selectTags: []
            //isMoreSelect: true
        }
    },
    watch: {
        value(val, old) {
            if (val !== old) {
                if (val !== this.codeColumn) {
                    this.codeColumn = val;
                    if ((val === '' || val === null) && old !== '') {
                        this.lableColumn = '';
                        this.$emit('row-select', null, this.selectHandleParamsExtend, this.index, this.viewObjectCode, true);
                    }
                }
            }
        },
        codeColumn(val, old) {
            if (val === '' && old !== '') {
                this.lableColumn = '';
                this.updateValue('');
                this.$emit('row-select', null, this.selectHandleParamsExtend, this.index, this.viewObjectCode, true);
            } else {
                this.updateValue(val);
            }
        },
        lableValue(val) {
            this.lableColumn = val;
        },
        searchTwoValue(val) {
            this.filters.searchTwoParam = val;
        },
        preQueryData: { // 深度监听，可监听到对象、数组的变化
            handler: function(val, oldVal) {
                if (val && !Vue.tpUtil.compareObject(val, oldVal)) {
                    if (typeof val === 'object') {
                        this.frontSearchParams = val;
                    }
                }
                return {};
            },
            deep: true
        }
    },
    created() {
        if (this.dbclickObject) {
            this.dbclickObjectData = JSON.parse(this.dbclickObject);
            this.isColumn = this.dbclickObjectData.lableParams !== '' && this.dbclickObjectData.lableParams !== undefined ? true : false;
        } else {
            this.isColumn = this.lableParams !== '' && this.lableParams !== undefined ? true : false;
        }
        if (this.lableValue) {
            this.lableColumn = this.lableValue
        }
        if (this.value) {
            this.codeColumn = this.value
        }
    },
    methods: {
        onDbClick(flag) {
            if (flag === '1') {
                this.ckey = true;
            } else if (flag !== '1') {
                if (this.codeColumn === '') {
                    return;
                }
                if (this.ckey || this.show) {
                    return;
                }
            }
            if (this.isReadonly) {
                return;
            }
            // if (!this.isInit) {
            this.isInit = true;
            this.initProps();
            this.initData();
            // }
            if (this.config.isOneOpenDialog) {
                this.show = true;
            }
            this.filters.searchOneParam = this.codeColumn;
            this.onGetList('2');
        },
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
            for (var v in this.datas) {
                if (tag.id === this.datas[v][this.ids]) {
                    this.$refs.multipleTable.toggleRowSelection(this.datas[v], false);
                    break;
                }
            }
            this.selectTags[tag.id] = null;
            delete this.selectTags[tag.id];
        },
        // 翻页选中
        handleSelectPage(tags, list) {
            if (this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection) {
                for (var t in tags) {
                    for (var l in list) {
                        if (tags[t].id === list[l][this.ids]) {
                            this.$refs.multipleTable.toggleRowSelection(list[l], true);
                            break;
                        }
                    }
                }
            }
        },
        handleSelectionChange1(val, row) {
            var d = {},
                b = true;
            for (var t in this.tags) {
                if (this.tags[t].id === row[this.ids]) {
                    b = false
                    this.selectTags[this.tags[t].id] = null;
                    delete this.selectTags[this.tags[t].id];
                    this.tags.splice(this.tags.indexOf(this.tags[t]), 1);
                    break;
                }
            }
            if (b) {
                d = {};
                d.name = row[this.searchParams.one.name];
                d.id = row[this.ids];
                this.selectTags[d.id] = row;
                this.tags.push(d);
            }
        },
        handleSelectionChange(val) {
            var tag = [],
                d = {},
                b = true;
            if (val.length > 0) {
                for (var v in val) {
                    for (var t in this.tags) {
                        if (this.tags[t].id === val[v][this.ids]) {
                            b = false
                            break;
                        }
                    }
                    if (b) {
                        d = {};
                        d.name = val[v][this.searchParams.one.name];
                        d.id = val[v][this.ids];
                        this.selectTags[d.id] = val[v];
                        this.tags.push(d);
                    } else {
                        b = true;
                    }
                }
            } else {
                for (var da in this.datas) {
                    this.selectTags[this.datas[da][this.ids]] = null;
                    delete this.selectTags[this.datas[da][this.ids]];
                    d = {};
                    d.name = this.datas[da][this.searchParams.one.name];
                    d.id = this.datas[da][this.ids];
                    tag.push(d);
                }
                var ids = this.tags.map(function(item) {
                    return item.id
                })
                for (var ts in tag) {
                    this.tags.splice(ids.indexOf(tag[ts].id), 1);
                    ids.splice(ids.indexOf(tag[ts].id), 1);
                }
            }
        },
        initProps() {
            var _t = !this.dbclickObjectData ? this : this.dbclickObjectData;

            this.config.poName = _t.poName;
            this.config.isOneOpenDialog = _t.isOneShow;
            this.config.codeType = _t.codeType;
            this.searchParams.one.value = _t.codeColumn;
            this.config.caseInsensitive = _t.caseInsensitive;
            if (this.preQueryData && typeof _t.preQueryData === 'object') {
                this.frontSearchParams = Object.assign({}, _t.preQueryData);
            }

            var tableProps = {
                oneShowParams: _t.tableOneParams,
                twoShowParams: _t.tableTwoParams,
                oneTitle: _t.tableOneTitle,
                twoTitle: _t.tableTwoTitle
            }
            if (_t.tableOneParams && _t.tableOneParams !== '') {
                Object.assign(this.tableProps, tableProps);
            }
            if (_t.searchOneParams && _t.searchOneParams !== '') {
                Object.assign(this.searchParams.one, {
                    name: _t.searchOneParams,
                    title: _t.searchOneTitle,
                    // value: this.searchOneValue,
                    open: true
                });
            }
            if (_t.searchTwoParams && _t.searchTwoParams !== '') {
                Object.assign(this.searchParams.two, {
                    name: _t.searchTwoParams,
                    title: _t.searchTwoTitle,
                    value: _t.searchTwoValue,
                    open: true
                });
            }
            // if(!this.searchOneValue)
            this.selectHandleParamsData = _t.selectHandleParams;
            this.lableParamsData = _t.lableParams;
            if (this.selectHandleParamsData) {
                this.selectHandleParamsExtend = JSON.parse(this.selectHandleParamsData);
            }
        },
        initData() {
            this.filters.searchOneParam = this.searchParams.one.value;
            this.filters.searchTwoParam = this.searchParams.two.value;

            if (!this.config.poName && !this.code && !this.url) {
                this.searchParams.one.name = 'codeCode';

                this.searchParams.one.title = Vue.filter('translate')('gCode');
                this.tableProps.oneShowParams = 'codeCode';
                this.tableProps.twoShowParams = 'codeName';
                this.tableProps.oneTitle = Vue.filter('translate')('gCode');
                this.tableProps.twoTitle = Vue.filter('translate')('gValue');
                this.frontSearchParams.codeType = this.config.codeType;
                this.frontSearchParams.validind = '1';
                this.config.receiveObject = 'ggCodeVoList';
            } else {
                this.frontSearchParams.poName = this.config.poName;
                this.config.receiveObject = 'businessList';
            }
        },
        beforeClose() {
            this.show = false;
            var _this = this;
            setTimeout(function() {
                _this.codeColumn = '';
                _this.codeId = '';
            }, 300)
        },
        // 页码变动
        onHandleCurrentChange(val) {
            this.pageNo = val - 1;
            this.onGetList('3');
        },
        // 查询行数变动
        onHandleSizeChange(val) {
            this.pageSize = val;
            this.onGetList('3');
        },
        // 获取用户列表
        onGetList(flag) {
            var para = {},
                _this = this;
            if (flag === '1') {
                this.pageNo = 0;
                this.currentPage = 1;
            }
            if ((!this.config.poName || this.config.poName === '') && this.code === '' && this.url === '') {
                this.path = Vue.tpUtil.getUrl({
                    apiName: 'layoutDbclickGGCodeList',
                    contextName: 'auth',
                    serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                });
            } else if (this.code !== '') {
                this.path = Vue.tpUtil.getUrl({
                    apiName: 'layoutDbclickGGCodeOtherListByCode',
                    contextName: 'auth',
                    serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                });
            } else if (this.url !== '') {
                this.path = this.contextName + this.url + '?_pageSize=' + this.pageSize + '&_pageNo=' + this.pageNo;
            } else {
                this.path = Vue.tpUtil.getUrl({
                    apiName: 'layoutDbclickGGCodeOtherList',
                    contextName: 'auth',
                    serachParms: { _pageSize: this.pageSize, _pageNo: this.pageNo }
                });
            }
            this.searchParams.one.open && this.filters.searchOneParam && this.filters.searchOneParam !== '' && (para[this.searchParams.one.name] = this.filters.searchOneParam);
            this.searchParams.two.open && this.searchParams.two.name && this.searchParams.two.name !== '' && (para[this.searchParams.two.name] = this.filters.searchTwoParam);
            // 增加一个判断，如果是自定义url，那么url的参数中加一个value
            if (this.url !== '') {
                para.value = para[this.searchParams.one.name]
                //console.log(para)
            }
            Object.assign(para, this.frontSearchParams);
            if (this.code !== '') {
                if (typeof this.preQueryData === 'object') {
                    para = this.preQueryData;
                } else {
                    para = {};
                }
                if (!this.filters.searchOneParam) {
                    this.filters.searchOneParam = '';
                }
                para.value = !this.config.caseInsensitive ? this.filters.searchOneParam : this.filters.searchOneParam.toUpperCase();
                para = Object.assign(para, { code: this.code });
            }
            if (this.orderByField && this.direction) {
                para.orderByField = this.orderByField;
                para.direction = this.direction;
            }
            Vue.tpUtil.http.post(this.path, para).then(function(res) {
                if (res.resCode === '0000') {
                    var datas = res.resData[_this.config.receiveObject],
                        data = datas.content;
                    _this.total = datas.total;
                    if (!_this.config.isOneOpenDialog && !_this.show) {
                        if (_this.total !== 1) {
                            _this.show = true;
                        } else {
                            _this.onHandleSelect(data[0]);
                        }
                    }
                    var twoShowParamsArr = _this.tableProps.twoShowParams.split(',');
                    for (var d in data) {
                        var twoShowValue = data[d][twoShowParamsArr[0]];
                        for (var i = 1; i < twoShowParamsArr.length; i++) {
                            twoShowValue += ' -- ' + data[d][twoShowParamsArr[i]];
                        }
                        data[d].showOne = data[d][_this.tableProps.oneShowParams];
                        data[d].showTwo = twoShowValue;
                    }
                    _this.datas = data;
                    if (_this.isMoreSelect) {
                        if (flag === '2') {
                            _this.tags = _this.handleTags(_this.codeId || _this.filters.searchOneParam, data, _this.codeId);
                        } else {
                            _this.tagCache.length > 0 && _this.handleTagsExtend(_this.tagCache, data);
                        }
                        setTimeout(function() {
                            _this.handleSelectPage(_this.tags, _this.datas)
                        }, 100);
                    }
                } else {
                    _this.total = 0;
                    _this.datas = [];
                }
                _this.ckey = false;
            });
        },
        // Todo 尚未对id情况处理， 貌似该方法未用
        handleTagsExtend(tag, data) {
            var tags = [],
                t = {},
                b = false;
            for (var s in tag) {
                for (var d in data) {
                    if (data[d][this.searchParams.one.name] === tag[s]) {
                        b = true;
                        this.selectTags[data[d][this.ids]] = data[d];
                        break;
                    }
                }
                if (!b) {
                    t = {};
                    t.name = tag[s];
                    t.id = tag[s];
                    tags.push(t);
                } else {
                    b = false;
                }
            }
            tag = tags;
        },
        handleTags(str, data, isId) {
            if (!str || str === '') {
                return [];
            }
            var strs = str.split(','),
                tags = [],
                t = {},
                b = false,
                flag;
            for (var s in strs) {
                for (var d in data) {
                    flag = isId ? data[d][this.ids] === strs[s] : data[d][this.searchParams.one.name] === strs[s];
                    if (flag) {
                        t = {};
                        t.name = data[d][this.searchParams.one.name];
                        t.id = data[d][this.ids];
                        tags.push(t);
                        b = true;
                        this.selectTags[t.id] = data[d];
                        break;
                    }
                }
                if (!b) {
                    for (var nt in this.selectTags) {
                        flag = isId ? this.selectTags[nt][this.ids] === strs[s] : this.selectTags[nt][this.searchParams.one.name] === strs[s];
                        if (flag) {
                            t = {};
                            t.name = this.selectTags[nt][this.searchParams.one.name];
                            t.id = this.selectTags[nt][this.ids]
                            tags.push(t);
                            break;
                        }
                    }
                    // this.tagCache.push(strs[s]);
                } else {
                    b = false;
                }
            }
            return tags;
        },
        // 选择
        onHandleSelect(row) {
            this.codeColumn = row[this.searchParams.one.name] || '';
            this.codeId = row[this.ids] || '';
            this.updateValue(this.codeColumn);
            if (this.lableParamsData) {
                this.lableColumn = row[this.lableParamsData] || '';
            }
            row.lableColumnEx = this.lableColumn;
            this.$emit('row-select', row, this.selectHandleParamsExtend, this.index, this.viewObjectCode);

            this.show = false;
            this.filters.searchOneParam = this.codeColumn;
            this.filters.searchTwoParam = this.searchTwoValue;
            this.init();
        },
        onClickLableColumn: function() {
            if (!this.lableReadonly)
                this.$emit('row-select-lable', this.lableColumn, this.selectHandleParamsExtend, this.index, this.viewObjectCode);
        },
        // 确认
        save() {
            var s = '',
                id = '';
            for (var t in this.selectTags) {
                s += this.selectTags[t][this.searchParams.one.name] + ','
                id += this.selectTags[t][this.ids] + ','
            }
            this.codeColumn = s.slice(0, -1)
            this.codeId = id.slice(0, -1)
            this.updateValue(this.codeColumn);
            if (this.lableParamsData) {
                // var s = '';
                s = '';
                for (var t1 in this.selectTags) {
                    s += this.selectTags[t1][this.lableParamsData] + ','
                }
                this.lableColumn = s.length > 0 ? s.substring(0, s.length - 1) : '';
            }
            this.$emit('row-select', this.selectTags, this.selectHandleParamsExtend, this.index, this.viewObjectCode);
            this.show = false;
            this.init();
        },
        updateValue(val) {
            this.$emit('input', val)
            this.$emit('change');
        },
        init() {
            this.total = 0;
            this.pageNo = 0;
            this.currentPage = 1;
            this.tags = [];
        },
        // 清除表单
        onResetForm() {
            // 暂时保留，此方法为重置，并非清除
            // this.$refs.filters.resetFields();
            // 以下为清除方法并搜索
            this.filters.searchOneParam = ''
            this.filters.searchTwoParam = ''
            this.onGetList('1')
        }
    }

}
</script>