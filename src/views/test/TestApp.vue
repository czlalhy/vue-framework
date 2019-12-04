<template>
    <section>
        <!--  <el-collapse v-model="active"> -->
        <!--  <tp-float-menu :el="$refs" :data="floatData"></tp-float-menu> -->
        <!-- <el-collapse-item ref="item2" :title="'gTitleSearchData' | translate('Search Data2')" name="2">
                <tp-form-engine @onAdd="onAddT" :correct="1" @onDeletes="onDeletesT" ref="engineaAcciInfoNameListForm" :data="engineData" productCode="TPG_NameList" planCode="D" subjectType="0006" v-model="acciRiskForm.guSubjectAcciNameListVoList"></tp-form-engine>
            </el-collapse-item> -->
        <!--  </el-collapse> -->
        <zk-form :model="form" ref="form" :rules="rules">
            <!-- <el-collapse v-model="mixinObject.activeNames">
                <el-collapse-item :title="'nonPropTreatyLayerSection' | translate('Non-Proportional Treaty R/I Section Info')" name="1"> -->
                    <li slot="test">1</li>
                    <li slot="test">2</li>
                    <li slot="test">3</li>
                    <tr class="row" >
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                    </tr>
                    <!-- <el-row class="row">
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                    </el-row>
                    <el-row class="row">
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                        <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                            <el-input v-model="form.input1" placeholder="请输入内容"></el-input>
                        </zk-form-item>
                    </el-row> -->
                <!-- </el-collapse-item>
            </el-collapse> -->
            <el-row class="toolbar-btn txt-center">
                <el-button type="primary" @click.native="onSubmit()">{{ 'gBtnSave' | translate('Save') }}</el-button>
                <el-button @click="returnPage()">{{ 'gBtnReturn' | translate('Return') }}</el-button>
            </el-row>
        </zk-form>
        <zk-table @on-click-btn="onBtn" :table="table" :before-validate="beforeValidate" :export-excel="{'isShow': true, 'fileName': 'testExecl', 'exclude': ['Operation'], 'validate': true}" export-all-excel>
            <!-- <template v-slot:search="scope">
                <el-row class="row">
                    <zk-form-item key-name="saaTaskVoTaskCode" prop="input1">
                        <el-input v-model="scope.filters.input1" placeholder="请输入内容"></el-input>
                    </zk-form-item>
                    <zk-form-item key-name="saaTaskVoTaskName" prop="taskCName">
                        <tp-checkbox size="mini" code-type="Validind" default-value="true" v-model="scope.filters.checkbox"></tp-checkbox>
                    </zk-form-item>
                    <zk-form-item key-name="gValidStatus" prop="searchValue">
                        <tp-select size="mini" filterable optionsSet="1" codeType="Validind" default-params="codeCode" default-value="1" v-model="scope.filters.validind">
                        </tp-select>
                    </zk-form-item>
                </el-row>
                <el-row class="row">
                    <zk-form-item key-name="saaTaskVoTaskCode" prop="taskCode">
                        <tp-input v-model="scope.filters.taskCode" pattern-key="Zero" thou maxlength="10"></tp-input>
                    </zk-form-item>
                    <zk-form-item key-name="saaTaskVoTaskName" prop="taskCName">
                        <tp-input size="mini" maxlength="12" is-select v-model="scope.filters.input4" suffix="%" thou num-len="2"></tp-input>
                    </zk-form-item>
                    <zk-form-item key-name="gValidStatus" prop="searchValue">
                        <tp-radio-group size="mini" code-type="Validind" default-value="true" v-model="scope.filters.radio"></tp-radio-group>
                    </zk-form-item>
                </el-row>
                <el-row class="row">
                    <zk-form-item key-name="saaTaskVoTaskCode" prop="taskCode">
                        <tp-dbclick code="findProduct" @row-select="selectProductCode" codeName="productCode" table-one-params="productCode" lable-params="productName" table-two-params="productCode,productName" search-one-params="productCode" :is-more-select="false" ids="productCode" v-model="scope.filters.productCode"> </tp-dbclick>
                    </zk-form-item>
                    <zk-form-item key-name="saaTaskVoTaskName" prop="taskCName">
                        <tp-auto-complete size="mini" :isReadonly="false" code="findProduct" codeName="productCode" labelName="productName,productCode" v-model="scope.filters.productCode1"></tp-auto-complete>
                    </zk-form-item>
                    <zk-form-item key-name="gValidStatus" prop="searchValue">
                    </zk-form-item>
                </el-row>
            </template> -->
            <!--工具条-->
            <template v-slot:toolbar="scope">
                <el-button size="mini" type="primary" @click="onOpenPdf(scope)">{{ 'OpenPdf' | translate('OpenPdf') }}</el-button>
                <!-- <tp-import-execl preview></tp-import-execl> -->
                <!-- <tp-column-filter :columnOptions="columnOptions" @changeCheckedOptions="onChangeCheckedOptions"></tp-column-filter> -->
            </template>
        </zk-table>
    </section>
</template>
<script>
import Vue from 'vue'
export default {
    name: 'TestApp',
    mixins: [Vue.tpUtil.getMixins()],
    data: function() {
        return {
            form: {
                input1: '111'
            },
            rules: {
                input1: [{ required: true, message: 'nihao', trigger: 'change' }],
            },
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
            table: {
                api: "sysTaskSearch",
                vo: "saaTaskVoList",
                context: "auth",
                filters: {
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
                fields: [{
                    prop: null,
                    labelKey: 'sysMenuTaskCode',
                    width: '200px',
                    btns: [{
                        prop: 'taskCode',
                        flag: 'tEdit',
                        type: 'text'
                    }]
                }, {
                    prop: 'taskCName',
                    labelKey: 'gCname',
                    width: '120px'
                }, {
                    prop: 'taskTName',
                    labelKey: 'gTname',
                    width: '120px'
                }, {
                    prop: 'taskEName',
                    labelKey: 'gZname',
                    width: '120px',
                    format: {
                        type: 'num'
                    }
                }, {
                    prop: 'groupName',
                    labelKey: 'saaTaskVoTaskGroupName',
                    width: '120px',
                    format: {
                        type: 'date',
                        format: "dd-MM-yyyy HH:mm:ss"
                    }
                }, {
                    prop: 'validind',
                    labelKey: 'gValidStatus',
                    width: '120px',
                    format: {
                        type: 'ggcode',
                        codeType: "Validind"
                    }
                }, {
                    prop: null,
                    labelKey: 'gTitleOperation',
                    btns: [{
                        btnKey: 'gBtnEdit',
                        flag: 'edit',
                        type: 'btn'
                    }, {
                        btnKey: 'gBtnView',
                        flag: 'view',
                        type: 'btn'
                    }, {
                        btnKey: 'gBtnDelete',
                        flag: 'deletes',
                        type: 'btn'
                    }]
                }]
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
        },
        onSubmit() {
            this.$refs.form.validate(function(valid) {
                console.log(valid)
            });
        },
        onBtn(row, flag, index) {
            console.log(row)
            console.log(flag)
        }
    }
}
</script>