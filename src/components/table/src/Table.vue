<template>
    <div>
        <el-collapse v-model="active">
            <el-collapse-item ref="item1" :title="'gTitleSearchData' | translate('Search Data')" name="1">
                <zk-form :inline="true" ref="fromFilters" :model="fromFilters">
                    <slot name="search" v-bind:filters="fromFilters"></slot>
                    <el-row class="toolbar-btn txt-center">
                        <el-button type="primary" @click="onGetList()">{{ 'gBtnSearch' | translate('Search') }}</el-button>
                        <el-button @click="onResetForm('fromFilters')">{{ 'gBtnClear' | translate('Clear') }}</el-button>
                    </el-row>
                    <!-- <table width="100%" cellpadding="0" cellspacing="0" class="tp-table">
                        <slot name="search" v-bind:filters="fromFilters"></slot>
                        <tr>
                            <td align="center" colspan="6">
                                <el-form-item>
                                    <el-button size="mini" type="primary" @click="onGetList()">{{ 'gBtnSearch' | translate('Search') }}</el-button>
                                    <el-button size="mini" @click="onResetForm('fromFilters')">{{ 'gBtnClear' | translate('Clear') }}</el-button>
                                </el-form-item>
                            </td>
                        </tr>
                    </table> -->
                </zk-form>
            </el-collapse-item>
        </el-collapse>
        <div class="block table-toolbar">
            <slot name="toolbar" v-bind:data="{filters: fromFilters, list: list }"></slot>
            <el-button size="mini" v-if="exportExcel.isShow" type="primary" @click="onExportExcel">{{ 'ToExecl' | translate('ToExecl') }}</el-button>
            <el-button size="mini" v-if="exportAllExcel" type="primary" @click="onExportAllExcel">{{ 'ToAllExecl' | translate('ToAllExecl') }}</el-button>
        </div>
        <el-table :data="list" ref="list" :id="ids" class="table-scroll" highlight-current-row border stripe style="width: 100%;">
            <el-table-column v-for="(item, index) in table.fields" sortable :prop="item.prop" :label="item.label" :title="item.label" :width="item.width" :formatter="formatStatus">
                <template v-slot="scope" v-if="item.btns">
                    <el-button v-for="(btn, index) in item.btns" v-if="btn.type=='btn'" @click="onHandle(scope.row, btn.flag, index)" type="primary">{{ btn.btnKey | translate() }}</el-button>
                    <a v-for="(btn, index) in item.btns" v-if="btn.type!='btn'" href="javascript:;" @click="onHandle(scope.row, btn.flag, index)"> {{scope.row[btn.prop]}} </a>
                </template>
            </el-table-column>
            <!-- <slot name="table"></slot> -->
        </el-table>
        <div :span="24" class="toolbar-btn toolbar-pagination" style="padding-bottom:10px;">
            <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" :page-sizes="pageSizes" :page-size="mixinObject.searchSet.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="mixinObject.searchSet.total" :current-page="mixinObject.searchSet.currentPage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Mixins from '../../../mixins/tableMixins'
var id = 1;
export default {
    name: 'ZkTable',
    mixins: [Mixins],
    props: {
        table: Object,
        data: Array,
        api: String,
        searchFilters: Object,
        vo: String,
        context: String,
        autoSearch: {
            type: Boolean,
            default: false
        },
        exportExcel: {
            type: Object,
            default: () => {
                return { 'isShow': false, 'fileName': '', 'exclude': null, validate: true }
            }
        },
        exportAllExcel: {
            type: Boolean,
            default: false
        },
        beforeValidate: Function,
        pageSizes: {
            type: Array,
            default: () => [10, 30, 50, 100]
        },
    },
    data: function() {
        return {
            fromFilters: {},
            active: ['1'],
            list: [],
            ids: id,
            cacheFields: {}
        };
    },
    watch: {

    },
    created() {
        this.handleFields(this.table.fields);
        this.fromFilters = Object.assign({}, this.table.filters);
        this.autoSearch && this.onGetList();
        id++;
    },
    mounted() {

    },
    methods: {
        onGetList: function() {
            //console.log(this.beforeValidate(this.fromFilters));
            if (!this.beforeValidate || (this.beforeValidate && this.beforeValidate(this.fromFilters))) {
                this.searchList(this.table.api, this.table.context, this.fromFilters, this.table.vo, (data) => {
                    this.list = data;
                    console.log(this.list)
                });
            }
        },
        onExportExcel() {
            if (this.exportExcel.validate && this.list.length == 0) {
                Vue.tpUtil.message('List data is not allowed to be empty');
                return;
            }
            Vue.tpUtil.exportExcel(this.$refs.list, this.ids, this.exportExcel.fileName, null, this.exportExcel.exclude);
        },
        onExportAllExcel() {
            Vue.tpUtil.message('open');
        },
        handleFields(list) {
            var d = {};
            for (var key in list) {
                list[key].label = Vue.filter('translate')(list[key].labelKey);
                d[list[key].prop] = list[key];
            }
            this.cacheFields = d;
        },
        // 状态翻译
        formatStatus(row, column, cellValue, index) {
            var str = "";
            if (this.cacheFields[column.property] && this.cacheFields[column.property].format) {
                switch (this.cacheFields[column.property].format.type) {
                    case 'num':
                        str = Vue.filter('money')(cellValue, true, 2);
                        break;
                    case 'date':
                        str = Vue.filter('time')(cellValue, this.cacheFields[column.property].format.format);
                        break;
                    case 'ggcode':
                        str = Vue.tpUtil.translationData(this.cacheFields[column.property].format.codeType, cellValue)
                        break;
                }
            } else {
                str = cellValue;
            }
            return str;
        },
        onHandle(row, flag, index) {
            this.$emit('on-click-btn', row, flag, index);
        }
    }
}
</script>