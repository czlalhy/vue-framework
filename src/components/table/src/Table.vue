<template>
    <div>
        <el-collapse v-model="active">
            <el-collapse-item ref="item1" :title="'gTitleSearchData' | translate('Search Data')" name="1">
                <el-form :inline="true" ref="fromFilters" :model="fromFilters" class="table-line">
                    <table width="100%" cellpadding="0" cellspacing="0" class="tp-table">
                        <slot name="search" v-bind:filters="fromFilters"></slot>
                        <tr>
                            <td align="center" colspan="6">
                                <el-form-item>
                                    <el-button size="mini" type="primary" @click="onGetList()">{{ 'gBtnSearch' | translate('Search') }}</el-button>
                                    <el-button size="mini" @click="onResetForm('fromFilters')">{{ 'gBtnClear' | translate('Clear') }}</el-button>
                                </el-form-item>
                            </td>
                        </tr>
                    </table>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="block table-toolbar">
            <slot name="toolbar" v-bind:data="{filters: fromFilters, list: list }"></slot>
            <el-button size="mini" v-if="exportExcel.isShow" type="primary" @click="onExportExcel">{{ 'ToExecl' | translate('ToExecl') }}</el-button>
            <el-button size="mini" v-if="exportAllExcel" type="primary" @click="onExportAllExcel">{{ 'ToAllExecl' | translate('ToAllExecl') }}</el-button>
        </div>
        <el-table :data="list" ref="list" :id="ids" class="table-scroll" highlight-current-row border stripe style="width: 100%;">
            <slot name="table"></slot>
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
    name: 'TpTable',
    mixins: [Mixins],
    props: {
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
                return {'isShow': false, 'fileName': '', 'exclude': null, validate: true}
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
            ids: id
        };
    },
    watch: {

    },
    created() {
        this.fromFilters = Object.assign({}, this.searchFilters);
        this.autoSearch && this.onGetList();
        id++;
    },
    mounted() {

    },
    methods: {
        onGetList: function() {
            //console.log(this.beforeValidate(this.fromFilters));
            if (!this.beforeValidate || (this.beforeValidate && this.beforeValidate(this.fromFilters))) {
                this.searchList(this.api, this.context, this.fromFilters, this.vo, (data) => {
                    this.list = data;
                });
            }
        },
        onExportExcel() {
            if(this.exportExcel.validate && this.list.length == 0) {
                Vue.tpUtil.message('List data is not allowed to be empty');
                return;
            }
            Vue.tpUtil.exportExcel(this.$refs.list, this.ids, this.exportExcel.fileName, null, this.exportExcel.exclude);
        },
        onExportAllExcel() {
            Vue.tpUtil.message('open');
        }
    }
}
</script>