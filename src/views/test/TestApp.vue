<template>
    <section>
        <!--  <el-collapse v-model="active"> -->
        <!--  <tp-float-menu :el="$refs" :data="floatData"></tp-float-menu> -->
        <!-- <el-collapse-item ref="item2" :title="'gTitleSearchData' | translate('Search Data2')" name="2">
                <tp-form-engine @onAdd="onAddT" :correct="1" @onDeletes="onDeletesT" ref="engineaAcciInfoNameListForm" :data="engineData" productCode="TPG_NameList" planCode="D" subjectType="0006" v-model="acciRiskForm.guSubjectAcciNameListVoList"></tp-form-engine>
            </el-collapse-item> -->
        <!--  </el-collapse> -->
        
        <tp-table :searchFilters="saaTaskVoFilters" api="sysTaskSearch" vo="saaTaskVoList" context="auth" 
        :before-validate="beforeValidate" :export-excel="{'isShow': true, 'fileName': 'testExecl', 'exclude': ['Operation'], 'validate': true}" export-all-excel>
            <template v-slot:search="scope">
                <tr>
                    <tp-form-label keyName="saaTaskVoTaskCode" defaultName="Task Code" :width="3"></tp-form-label>
                    <tp-form-input prop="input1" :width="5" id="teee">
                        <el-input size="mini" v-model="scope.filters.input1" placeholder="请输入内容"></el-input>
                    </tp-form-input>
                    <tp-form-label keyName="saaTaskVoTaskName" defaultName="Task Name" :width="3"></tp-form-label>
                    <tp-form-input prop="taskCName" :width="5">
                        <tp-checkbox size="mini" code-type="Validind" default-value="true" v-model="scope.filters.checkbox"></tp-checkbox>
                    </tp-form-input>
                    <tp-form-label keyName="gValidStatus" defaultName="Valid Status" :width="3"></tp-form-label>
                    <tp-form-input prop="searchValue" :width="5">
                        <tp-select size="mini" filterable optionsSet="1" codeType="Validind" default-params="codeCode" default-value="1" v-model="scope.filters.validind">
                        </tp-select>
                    </tp-form-input>
                </tr>
                <tr>
                    <tp-form-label keyName="saaTaskVoTaskCode" defaultName="Task Code" :width="3"></tp-form-label>
                    <tp-form-input prop="taskCode" :width="5" id="teee">
                        <tp-input v-model="scope.filters.taskCode" pattern-key="Zero" thou maxlength="10"></tp-input>
                    </tp-form-input>
                    <tp-form-label keyName="saaTaskVoTaskName" defaultName="Task Name" :width="3"></tp-form-label>
                    <tp-form-input prop="taskCName" :width="5">
                        <tp-input size="mini" maxlength="12" is-select v-model="scope.filters.input4" suffix="%" thou num-len="2"></tp-input>
                    </tp-form-input>
                    <tp-form-label keyName="gValidStatus" defaultName="Valid Status" :width="3"></tp-form-label>
                    <tp-form-input prop="searchValue" :width="5">
                        <tp-radio-group size="mini" code-type="Validind" default-value="true" v-model="scope.filters.radio"></tp-radio-group>
                    </tp-form-input>
                </tr>
                <tr>
                    <tp-form-label keyName="saaTaskVoTaskCode" defaultName="Task Code" :width="3"></tp-form-label>
                    <tp-form-input prop="taskCode" :width="5" id="teee">
                        <tp-dbclick code="findProduct" @row-select="selectProductCode" codeName="productCode"  table-one-params="productCode" lable-params="productName" table-two-params="productCode,productName" search-one-params="productCode" :is-more-select="false" ids="productCode" v-model="scope.filters.productCode"> </tp-dbclick>
                    </tp-form-input>
                    <tp-form-label keyName="saaTaskVoTaskName" defaultName="Task Name" :width="3"></tp-form-label>
                    <tp-form-input prop="taskCName" :width="5">
                        <tp-auto-complete size="mini" :isReadonly="false" code="findProduct" codeName="productCode"  labelName="productName,productCode" v-model="scope.filters.productCode1"></tp-auto-complete>
                    </tp-form-input>
                    <tp-form-label keyName="gValidStatus" defaultName="Valid Status" :width="3"></tp-form-label>
                    <tp-form-input prop="searchValue" :width="5">
                    </tp-form-input>
                </tr>
            </template>
            <!--工具条-->
            <template v-slot:toolbar="scope">
                <el-button size="mini" type="primary" @click="onOpenPdf(scope)">{{ 'OpenPdf' | translate('OpenPdf') }}</el-button>
                <!-- <tp-import-execl preview></tp-import-execl> -->
                <!-- <tp-column-filter :columnOptions="columnOptions" @changeCheckedOptions="onChangeCheckedOptions"></tp-column-filter> -->
            </template>
            <template v-slot:table>
                <el-table-column :label="'sysMenuTaskCode' | translate('TaskCode')" width="200">
                    <template v-slot="scope">
                        <a href="javascript:;" @click="onHandleEdit(scope.row, 'edit')"> {{scope.row.taskCode}} </a>
                    </template>
                </el-table-column>
                <el-table-column :label="'gCname' | translate('Chinese Name')" width="120">
                    <template v-slot="scope">
                        <router-link :to="{ name: 'taskApp' }" target="_blank">{{scope.row.taskCName}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="taskTName" :label="'gTname' | translate('Traditional Name')" width="120">
                </el-table-column>
                <el-table-column class-name="yyyy" v-if="checkedOptions.indexOf('gZname') >= 0" prop="taskEName" :label="'gZname' | translate('English Name')" width="120">
                </el-table-column>
                <el-table-column prop="groupName" :label="'saaTaskVoTaskGroupName' | translate('Group Name')" width="120">
                </el-table-column>
                <el-table-column prop="validind" :formatter="formatStatus" :label="'gValidStatus' | translate('Valid Status')" width="120">
                </el-table-column>
                <el-table-column :label="'gTitleOperation' | translate('Operation')" min-width="320">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" @click="onHandleEdit(scope.row, 'edit')">{{ 'gBtnEdit' | translate('Edit') }}</el-button>
                        <el-button size="mini" type="primary" @click="onHandleEdit(scope.row, 'view')">{{ 'gBtnView' | translate('View') }}</el-button>
                        <el-button type="danger" size="mini" @click="onHandleDel(scope.row)">{{ 'gBtnDelete' | translate('Delete') }}</el-button>
                    </template>
                </el-table-column>
            </template>
        </tp-table>
    </section>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TestApp',
    mixins: [Vue.tpUtil.getMixins()],
    data: function() {
        return {
            active: ['1', '2'],
            saaTaskVoFilters: {
                input1: '',
                input2: '',
                input3: '',
                input4: 7777,
                taskCode: 5667,
                validind: 'false',
                radio: '',
                checkbox: '',
                productCode: '',
                productCode1: '',
                productName: ''
            },
            floatData: [{
                name: 'item1',
                id: 'item1'
            }, {
                name: 'item2',
                id: 'item2'
            }],
            saaTaskVoList: [{
                taskCode: '1',
                taskCName: '2',
                taskTName: '3',
                taskEName: '4',
                groupName: '5',
                validind: '1',

            }],
            columnOptions: ['sysMenuTaskCode', 'gCname', 'gTname', 'gZname', 'saaTaskVoTaskGroupName', 'gValidStatus', 'gTitleOperation'],
            checkedOptions: ['sysMenuTaskCode', 'gCname', 'gTname', 'gZname', 'saaTaskVoTaskGroupName', 'gValidStatus', 'gTitleOperation'],
            engineData: { // 表单引擎数据
                isCorrectBtn: false,
                booleanF: false,
                isReadonly: false,
                acciInfo: {},
                originVo: {
                    correct: 1,
                    colorFlag: '',
                    tenMetersHighDesc: '1'
                },
                originList: [{
                    areaCode: null,
                    createTime: "2018-12-06 17:30:08",
                    creatorCode: "admin",
                    declarationInfo: false,
                    displayNo: 1,
                    dob: "1978-08-08 00:00:00",
                    endtSeqNo: "000",
                    flag: 'I',
                    fullTimeStudent: null,
                    gender: "f",
                    groupType: null,
                    height: null,
                    identificationNo: "QW123312",
                    identificationType: "02",
                    name: "JANE"
                }]
            },
            acciRiskForm: {
                guSubjectAcciNameListVoList: [{
                    areaCode: null,
                    createTime: "2018-12-06 17:30:08",
                    creatorCode: "admin",
                    declarationInfo: false,
                    displayNo: 1,
                    dob: "1978-08-08 00:00:00",
                    endtSeqNo: "000",
                    flag: '',
                    fullTimeStudent: null,
                    gender: "f",
                    groupType: null,
                    height: null,
                    identificationNo: "QW123312",
                    identificationType: "02",
                    name: "JANE",
                    namedBasis: null,
                    noOfInsured: null,
                    occupationClass: "III",
                    occupationCode: "0005",
                    policyNo: "DTPGSNA00000201800",
                    policySubjectAcciNameListId: "2018120605300803770",
                    policyVersionNo: "001",
                    quotationNo: "QDTPGSNA00000571800",
                    relationShip: null,
                    remark: null,
                    subjectNo: 1,
                    tenMetersHigh: false,
                    tenMetersHighDesc: "1",
                    typeOfPerson: null,
                    updateTime: "2018-12-06 17:30:08",
                    updaterCode: "admin",
                    validInd: true,
                    weight: null
                }],
            }
        }
    },
    methods: {
        onChangeCheckedOptions(value) {
            this.checkedOptions = value
        },
        // 状态翻译
        formatStatus(row) {
            return Vue.tpUtil.translationData('Validind', row.validind);
        },
        onAddT() {

        },
        onDeletesT() {

        },
        selectProductCode(row) {
            console.log(row)
        },
        onOpenPdf(data) {
            Vue.tpUtil.openPdf({
                system: 'Report',
                reportName: 'PropSpecialStmtTemplate',
                readonly: 'false',
                showU: 'false',
                showE: 'false'
            });
        },
        beforeValidate(data) {
            console.log(data);
            return true;
        }
    }
}
</script>