import Vue from 'vue';
let params = {
    btns: {
        '_PLAT_SAA_FACTOR_BTN': true
    },
    authMenuData: {//有权限访问的菜单
        '_/404': {
            flag: true,
            name: '404'
        },
        '_/login': {
            flag: true,
            name: 'login'
        },
        '_/home': {
            flag: true,
            name: 'home'
        },
        '_/test': {
            flag: true,
            name: 'test'
        },
        '_/test/test_app': {
            flag: true,
            name: 'testApp'
        },
        '_/home/note': {
            flag: true,
            name: 'note'
        },
        '_/error': {
            flag: true,
            name: '500'
        },
        '_/claim/scanned_doc/scanned_doc_app': {
            flag: true,
            name: 'scannedDoc'
        },
        '_/claim/registration/registration_app': {
            flag: true,
            name: 'registration'
        },
        '_/claim/print_documents/rprint_documents_app': {
            flag: true,
            name: 'documents'
        },
        '_/claim/notes_list/notes_list_app': {
            flag: true,
            name: 'documents'
        }
    },
};

let layoutService = {
    handleMenus(list, _i18) {
        let paths = [],
            authMenus = {};
        this.fooMenus(list, authMenus, _i18, paths);
        //缓存权限菜单数据据
        Vue.tpUtil.setCache('menu', 'menusData', list);
        //合并无需权限校验的应用,供路由用和取appName用
        this.mergeAuthMenus(params.authMenuData, paths, authMenus);
        //注册可以请求的应用路由
        Vue.tpUtil.registerRoutesForMenus(paths);
        //更新按钮数据
        this.updateBtnAuthCache();
    },
    fooMenus(data, pathArr, i18, paths) {
        var label = 'clabel';
        if (i18 === 'en') {
            label = 'elabel';
        } else if (i18 === 'zh') {
            label = 'clabel';
        }
        if (data && data.length > 0) {
            data = data.sort(Vue.tpUtil.compare('displayNo'))
            for (var name in data) {
                if (data[name].flag === '0') {
                    data[name].label = data[name][label];
                    //if (data[name].children && data[name].children.length > 0) {
                    if (data[name].isParent) {
                        pathArr['_' + data[name].id] = {
                            name: data[name][label]
                        };
                        this.fooMenus(data[name].children, pathArr, i18, paths);
                    } else {
                        if (data[name].url) {
                            paths.push('_' + data[name].url);
                            pathArr['_' + data[name].url] = {
                                flag: true,
                                name: data[name][label]
                            };
                        } else {
                            pathArr['_' + data[name].id] = {
                                name: data[name][label]
                            };
                        }
                        if (data[name].children && data[name].children.length > 0) {
                            this.fooMenus(data[name].children, pathArr, i18, paths);
                        }
                    }
                } else {
                    this.addBtnAuth(data[name].code || data[name].id);
                }
            }
        }
    },
    //合并无需权限校验的应用,供路由用和取appName用
    mergeAuthMenus(obj, list, authMenus) {
    	for(let key in obj) {
    		list.push(key);
    	}
    	params.authMenuData = Object.assign(obj, authMenus);
        Vue.tpUtil.setCache('menu', 'authMenuData', params.authMenuData);
    },
    //增加按钮权限
    addBtnAuth(key, flag) {
        !params.btns['_' + key] && (params.btns['_' + key] = true);
        !!flag && this.updateBtnAuthCache();
    },
    //更新按钮缓存
    updateBtnAuthCache() {
        Vue.tpUtil.setCache('menu', 'btnsData', params.btns);
    },
    //通过path获取appName
    getMenusNameForKey(key) {
        return params.authMenuData['_' + key] && params.authMenuData['_' + key].name || '';
    }
};

export default layoutService