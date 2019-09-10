<template>
    <div class="container">
        <div class="main-header">
            <div class="logo logo-width">
                <img src="dist/img/main_logo.png" alt="">
                        </div>
                <div class="weblogo">
                    <img src="dist/img/web_name.png" alt="" width="240" height="29">
                        </div>
                    <div class="userinfo cursor" @click="logout">
                        {{'gTitleLogoutLogin' | translate('Logout Login')}}
                    </div>
                    <div class="userinfo">
                        {{sysUserName}}
                    </div>
                    <span class="time">
                            <a v-if="isShowMenu" href="javascript:;" @click="changeHome">{{'gTitleSwitch' | translate('Switch')}}</a>
                             Version {{version}}  {{new Date() | time}} 
                        </span>
                </div>
                <div class="main menu-main">
                    <el-menu v-if="isShowMenu" :default-active="$route.path" :unique-opened="true" class="el-menu-vertical-demo leftMenu" @select="onHandleSelect" @open="onHandleOpen" v-show="!collapsed" router style="overflow: auto">
                        <template v-for="(item,index) in menus">
                            <el-submenu :index="item.id" v-if="item.children && item.children.length > 0 && item.flag == '0'">
                                <template slot="title"><span slot="title">{{item.label}}</span></template>
                                <template v-for="child in item.children">
                                    <el-menu-item :index="child.url" :key="child.url" v-if="child.flag == '0' && child.url != ''"> {{child.label}}
                                    </el-menu-item>
                                    <el-submenu :index="child.id" v-if="child.flag == '0' && child.url == ''">
                                        <template slot="title"><span slot="title">{{child.label}}</span></template>
                                        <div v-if="child.url == ''">
                                            <template v-for="child1 in child.children">
                                                <el-menu-item :index="child1.url" :key="child1.url" v-if="child1.flag == '0' && child1.url != ''"> {{child1.label}}
                                                </el-menu-item>
                                                <el-submenu :index="child1.id" v-if="child1.flag == '0' && child1.url == ''">
                                                    <template slot="title"><span slot="title">{{child1.label}}</span></template>
                                                    <div v-if="child1.url == ''">
                                                        <el-menu-item v-for="child2 in child1.children" :index="child2.url" :key="child2.url" v-if="child2.flag == '0' && child2.url != ''"> {{child2.label}}
                                                        </el-menu-item>
                                                    </div>
                                                </el-submenu>
                                            </template>
                                        </div>
                                    </el-submenu>
                                </template>
                            </el-submenu>
                            <el-menu-item v-if="!item.children || item.children.length == '0'" :index="item.url" :key="item.url"><span slot="title">{{item.label}}</span></el-menu-item>
                        </template>
                    </el-menu>
                    <div class="btn-float" @click.prevent="collapse" v-if="isShowMenu">
                        <i class="fa " :class="collapsed ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                    </div>
                    <section class="content-container" id="content-container">
                        <div v-if="isShowMenu" class="searchWrapper" style="margin-bottom: 5px;height:30px;line-height:30px;border-bottom: 1px solid #e6ebf5">
                            <div class="path-txt">
                                <el-breadcrumb separator="/" style="line-height:30px;">
                                    <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="index">{{item}}</el-breadcrumb-item>
                                </el-breadcrumb>
                            </div>
                        </div>
                        <el-col v-loading="loading" :element-loading-text="'gTitlePageLoading' | translate('Loading the page...')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" :span="24" class="content-wrapper" style="height:calc(100% - 41px);">
                            <transition name="fade" mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </el-col>
                    </section>
                </div>
            </div>
</template>
<script>
import Vue from 'vue'
import layoutService from './layoutService'
export default {
    name: 'TpLayoutLeft',
    props: {
        menus: {
            type: Array
        }
    },
    data: function() {
        return {
            collapsed: false,
            sysUserName: '',
            version: ''
        }
    },
    created() {
        var t = sessionStorage.getItem('headerTitleTop') || '';
        this.$store.commit('BREADCRUMBS', t.split(','));
        this.version = Vue.tpUtil.getVersion();
    },
    mounted() {
        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.userName || '';
        }
    },
    computed: {
        loading() {
            return this.$store.state.pageLoading;
        },
        breadcrumbs() {
            return this.$store.state.breadcrumbs;
        },
        isShowMenu() {
            return this.$store.state.menuShow;
        }
    },
    methods: {
        changeHome() {
            localStorage.setItem('_layoutType', 'top');
            this.$store.commit('CHANGE_HOME', { 'type': 'top' });
        },
        onHandleSelect(a, b) {
            window.reMethods = null;
            Vue.tpUtil.registerConfig('_' + a);
            this.$store.commit('BREADCRUMBS', this.getBreadcrumbs(b));
            sessionStorage.setItem('headerTitleTop', this.breadcrumbs.join(','));
        },
        getBreadcrumbs(data) {
            var bcs = [];
            for (var n in data) {
                bcs.push(layoutService.getMenusNameForKey(data[n]));
            }
            return bcs;
        },
        onHandleOpen() {},

        // 退出登录
        logout() {
            this.$confirm('确认退出吗?', '提示', {
                type: 'warning'
            }).then(function() {
                Vue.tpUtil.destroyApp(true);
            }, function() {
                console.log('cance')
            });
        },
        jump() {
            var menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue !== '') {
                var menuValueSearch = Vue.tpUtil.getSearchJson(sessionStorage.getItem('menuValueSearch')),
                    r = { path: menuValue };

                if (menuValueSearch) {
                    r['query'] = menuValueSearch;
                }
                sessionStorage.removeItem('menuValue');
                sessionStorage.removeItem('menuValueSearch');
                Vue.tpUtil.redirectTo(r);
            }
        },
        // 折叠导航栏
        collapse() {
            this.collapsed = !this.collapsed;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
        },
        handleOpen(key, keyPath) {},
        handleClose(key, keyPath) {}
    }
}
</script>