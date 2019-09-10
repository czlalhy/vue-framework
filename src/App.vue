<template>
    <div id="app">
        <router-view />
        <transition name="fade">
            <tp-loading :title="'gTitleDataLoading' | translate('Loading the data...')" v-show="loading.showLoading"></tp-loading>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'appApp',
    computed: {
        loading() {
            return this.$store.state.loading;
        }
    }
}
</script>