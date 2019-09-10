<template>
    <transition name="fade">
        <div class="loading">
            <div class="loading-body">
                <img width="40" height="40" src="dist/img/loading.gif">
                <p class="desc">{{title}}</p>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'TpLoading',
    props: {
        title: {
            type: String,
            default: '载入中'
        }
    }
}
</script>