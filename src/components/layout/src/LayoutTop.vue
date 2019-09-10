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
                <div class="searchWrapper" v-if="isShowMenu">
                    <div class="path-txt">
                        <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" @select="onHandleSelect" @open="onHandleOpen" unique-opened router ref="topMenu">
                            <template v-for="(item,index) in menus" index="0">
                                <el-submenu :index="item.id" v-if="item.children && item.children.length > 0 && item.flag == '0'">
                                    <template slot="title">{{item.label}}</template>
                                    <template v-for="child in item.children">
                                        <el-menu-item :index="child.url" :key="child.url" v-if="child.flag == '0' && child.url != ''">
                                            {{child.label}}
                                        </el-menu-item>
                                        <el-submenu :index="child.id" v-if="child.flag == '0' && child.url == ''">
                                            <template slot="title">{{child.label}}</template>
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
                                <el-menu-item v-if="!item.children || item.children.length == 0" :index="item.url" :key="item.url">{{item.label}}</el-menu-item>
                            </template>
                        </el-menu>
                    </div>
                    <div class="path-more" v-show="isMore">
                        <i class="fa el-icon-caret-left" :class="{disable : showIndex === 0}" @click="pre()"></i>
                        <i class="fa el-icon-caret-right" :class="{disable : showIndex === hiddenIndex.length}" @click="next()"></i>
                    </div>
                </div>
                <div class="searchWrapper breadcrumb-wrapper" v-if="isShowMenu">
                    <div>
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :key="index" v-for="(item,index) in breadcrumbs">{{item}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                </div>
                <div :style="{ top: top}" v-loading="loading" :element-loading-text="'gTitlePageLoading' | translate('Loading the page...')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" class="main top-main" id="content-container">
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
</template>
<script>
import Vue from 'vue'
import layoutService from './layoutService'
export default {
    name: 'TpLayoutTop',
    props: {
        menus: {
            type: Array
        }
    },
    data: function() {
        return {
            collapsed: false,
            isMore: false,
            sysUserName: '',
            version: '',
            showIndex: 0,
            hiddenIndex: [],
            menuList: []
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
        },
        top() {
            return this.$store.state.menuShow ? '122px' : '55px';
        }
    },
    created() {
        this.onCalculate();
        let t = sessionStorage.getItem('headerTitleTop') || '';
        this.$store.commit('BREADCRUMBS', t.split(','));
        this.version = Vue.tpUtil.getVersion();
    },
    methods: {
        onCalculate() {
            let _this = this;
            setTimeout(function() {
                _this.$nextTick(function() {
                    if (_this.$refs.topMenu) {
                        _this.menuList = _this.$refs.topMenu.$children

                        var len = _this.menuList.length,
                            sum = 0,
                            arr = [],
                            lastWidth = 0;
                        if(!_this.menuList[len - 1] || !_this.menuList[len - 1].$el) {
                            return;
                        } else {
                            lastWidth = _this.menuList[len - 1].$el.clientWidth;
                        }
                        for (var i = 0; i < len; i++) {
                            arr.push(_this.menuList[i].$el.clientWidth)
                            sum += _this.menuList[i].$el.clientWidth
                            if (sum > 1290 - lastWidth) {
                                _this.isMore = true
                                _this.menuList[i].$el.style.display = 'none'
                                _this.hiddenIndex.push(i)
                            }
                        }
                    }
                })
            }, 100)
        },
        next() {
            if (this.showIndex >= 0 && this.showIndex < this.hiddenIndex.length) {
                this.menuList[this.showIndex].$el.style.display = 'none';
                this.menuList[this.hiddenIndex[this.showIndex]].$el.style.display = 'block';
                this.showIndex++;
            }
        },
        pre() {
            if (this.showIndex > 0) {
                this.showIndex--;
                this.menuList[this.showIndex].$el.style.display = 'block';
                this.menuList[this.hiddenIndex[this.showIndex]].$el.style.display = 'none';
            }
        },
        changeHome() {
            localStorage.setItem('_layoutType', 'left');
            this.$store.commit('CHANGE_HOME', { 'type': 'left' });
        },
        onHandleSelect(a, b) {
            window.reMethods = null;
            Vue.tpUtil.registerConfig('_' + a);
            this.$store.commit('BREADCRUMBS', this.getBreadcrumbs(b));
            sessionStorage.setItem('headerTitleTop', this.breadcrumbs.join(','));
        },
        onHandleOpen() {},
        getBreadcrumbs(data) {
            var bcs = [];
            for (var n in data) {
                bcs.push(layoutService.getMenusNameForKey(data[n]));
            }
            return bcs;
        },
        // 退出登录
        logout() {
            this.$confirm(Vue.filter('translate')('confirmQuit'), Vue.filter('translate')('gTitlePrompt'), {
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
        }
    },
    watch: {
        menus(val) {
            if (val && val.length > 0) {
                this.onCalculate();
            }
        }
    },
    mounted() {
        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.userName || '';
        }
    }
}
</script>