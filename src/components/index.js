import Vue from 'vue'
import TpLoading from './loading/index';
import TpLayout from './layout/index'
import TpLogin from './login/index'
import TpFormInput from './form-input/index'
import TpFormLabel from './form-label/index'
import TpButton from './button/index'
import TpCollapseItem from './collapse-item/index'
import TpInput from './input/index'
import TpSelect from './select/index'
import TpShowModal from './show-modal/index'
import TpRadioGroup from './radio-group/index'
import TpCheckbox from './checkbox/index'
import TpImportExecl from './import-execl/index'
import TpFloatMenu from './float-menu/index'
import TpColumnFilter from './column-filter/index'
import TpFormEngine from './form-engine/index'
import TpDbClick from './db-click/index'
import TpAutoComplete from './auto-complete/index'
import TpTextarea from './textarea/index'
import ZkTable from './table/index'
import ZkForm from './form/index'
import ZkFormItem from './form-item/index'

const Components = [
    TpLayout,
    TpLogin,
    TpLoading,
    TpFormInput,
    TpFormLabel,
    TpButton,
    TpCollapseItem,
    TpInput,
    TpSelect,
    TpRadioGroup,
    TpCheckbox,
    TpImportExecl,
    TpFloatMenu,
    TpColumnFilter,
    TpFormEngine,
    TpDbClick,
    TpAutoComplete,
    TpTextarea,
    ZkTable,
    ZkForm,
    ZkFormItem
];

const install = function(Vue, opts = {}) {
    Components.forEach(component => {
        Vue.component(component.name, component);
    });
};

install(window.Vue || Vue);

const cm = {
    install: function(Vue) {
        Vue.prototype.$TpShowModal = TpShowModal;
    }
};

Vue.use(cm);

export default Components