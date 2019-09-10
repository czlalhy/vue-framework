<template>
    <div><i class="el-icon-tickets key-select-icon" @click="keySelect = !keySelect"></i>
        <div class="key-select-list" v-show="keySelect">
            <el-checkbox :indeterminate="isIndeterminate" v-model="isDefalutAll" @change="handleCheckAllChange">{{ 'gAll' | translate('ALL')}}</el-checkbox>
            <el-checkbox-group v-model="checkedOptions" @change="handleCheckedCitiesChange" class="key-list">
                <el-checkbox v-for="option in columnOptions" :label="option" :key="option">{{option | translate()}}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>
<script>
export default {
    name: 'TpColumnFilter',
    props: {
        isDefalutAll: {
            type: Boolean,
            default: true
        },
        defalueCheckedOptions: Array,
        columnOptions: Array
    },
    data: function() {
        return {
            keySelect: false,
            isIndeterminate: false,
            checkedOptions: this.isDefalutAll ? this.columnOptions : this.defalueCheckedOptions
        };
    },
    methods: {
        handleCheckAllChange(val) {
            this.checkedOptions = val ? this.columnOptions : [];
            this.isIndeterminate = false;
            val ? this.$emit('changeCheckedOptions', this.columnOptions) : this.$emit('changeCheckedOptions', [])
        },
        handleCheckedCitiesChange(value) {
            var checkedCount = value.length;
            //this.isDefalutAll = checkedCount === this.columnOptions.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnOptions.length;
            this.$emit('changeCheckedOptions', value)
        }
    }
}
</script>