import Vue from 'vue'

let handle = {
    //获取导出数据
    getExeclData(ref, id) {
        if (!$('#' + id)) {
            Vue.tpUtil.message('The ID reference of the data table is null, please check the settings');
            return;
        }
        var sheetHeader = [],
            sheetFilter = [],
            sheetData = [],
            rmcol = [],
            columns = ref.columns,
            trs = $('#' + id).find('.el-table__body-wrapper').find('tbody').find('tr'),
            da = {},
            cs;

        columns.forEach(function(item, index) {
            if (item.label) {
                sheetHeader.push(item.label)
                sheetFilter.push(item.property || item.label)
            } else {
                rmcol.push(index)
            }
        })
        trs.each(function() {
            var tr = $(this).children()
            da = {};
            cs = tr.filter(function(index) {
                return !~rmcol.indexOf(index)
            })
            cs.each(function(i) {
                var prop = sheetFilter[i],
                    val = '',
                    _input = $(this).find('input');
                if (_input && _input.length > 0) {
                    val = _input.val();
                } else {
                    val = $.trim($(this).text());
                }
                da[prop] = val
            })
            sheetData.push(da)
        })
        return {
            sheetHeader: sheetHeader,
            sheetFilter: sheetFilter,
            sheetData: sheetData
        };
    },
    // 导出
    toExcel(obj) {
        if (!obj) {
            return;
        }
        if (typeof ExportJsonExcel === 'function') {
            new ExportJsonExcel(obj).saveExcel();
        } else {
            require.async('exportJsonExcel', function() {
                new ExportJsonExcel(obj).saveExcel();
            });
        }
    },
    //处理路由
    handleRouter(objs, path, flag, appNameForPath, appConfigs) {
        var name = '',
            p = '';
        if (!path) {
            path = '';
        }
        for (var o in objs) {
            p = (path !== '' && objs[o].path.indexOf('/') !== 0) ? path + '/' + objs[o].path : objs[o].path;
            name = objs[o].name;
            if (name) {
                appNameForPath[name] = p;
            }
            if (flag && objs[o].config) {
                appConfigs['_' + p] = objs[o].config;
            }
            if (objs[o].children && objs[o].children.length > 0) {
                this.handleRouter(objs[o].children, p, flag, appNameForPath, appConfigs)
            }
        }
    },
    //请求配置文件
    getAjaxConfig(url, call, store) {
        if (url && url !== '') {
            $.ajax({
                url: url + '.js',
                dataType: 'script'
            }).done(function(data) {
                call(eval(data));
            }).fail(function(data) {
                console.log(data);
                if (data.status == 0) {
                    store.commit('COMMIT_DIALOG_LOGIN', { 'showLoading': true, 'isReload': true })
                }
            });
        }
    },
    //处理跳转路径
    handleRedirectPath(obj, appNameForPath, appConfigsAllow, appConfigs) {
        let path = '';
        if (obj.register) {
            let p, s;
            //获取应用入口
            if (!obj.name && obj.path) {
                s = obj.path.match(/(\S*)_app/);
                if (s && s.length > 1) {
                    s = obj.path.match(/(\S*)_app/)[1] + '_app';
                }
                p = s;
            } else {
                s = obj.name.match(/(\S*)App/);
                if (s && s.length > 1) {
                    s = obj.name.match(/(\S*)App/)[1] + 'App';
                }
                p = appNameForPath[s];
            }
            if (!p) {
                console.log('!p')
                return;
            }
            Vue.tpUtil.addMenu(p, obj.titleName || '');
            // this.registerRoutes('_' + p);
            //把应用增加到允许跳转的数据
            if (!appConfigsAllow['_' + p] && appConfigs['_' + p]) {
                appConfigsAllow['_' + p] = appConfigs['_' + p];
                delete appConfigs['_' + p];
            }
            path = '_' + p;
        } else {
            if (obj.name && appNameForPath[obj.name]) {
                obj.path = appNameForPath[obj.name];
                // delete obj.name;
            }
            if (!obj.path) {
                console.log('!obj.path1')
                return;
            }
        }
        path = path !== '' ? path : '_' + obj.path;
        return path;
    },
    //注册配置文件成功后处理数据
    registerConfigSuccess(obj, flag, appNameForPath, store, router) {
        //获取跳转path
        if (obj.name && appNameForPath[obj.name]) {
            obj.path = appNameForPath[obj.name];
        }
        if (!obj.path) {
            console.log('!obj.path2')
            return;
        }
        if (obj.isTitle) {
            var title = Vue.tpUtil.getInzTranslate(obj.name + 'Title');
            console.log(title);
            store.commit('BREADCRUMBS_TO', title);
        }
        if (obj.shareStore) {
            Vue.tpUtil.setVuexCache(obj.name, obj.shareStore);
        }
        delete obj.name;
        !flag && this.handleQuery(obj);
        if (!obj.isBlank) {
            window.reMethods = null;
            router.push(obj);
        } else {
            typeof obj.reMethods === 'function' && (window.reMethods = obj.reMethods);
            // console.log(window.reMethods)
            obj.query.openFlag = '1';
            var re = router.resolve(obj);
            window.open(re.href, '_blank')
        }
    },
    handleQuery(obj) {
        if (!obj.query) {
            return;
        }
        for (var name in obj.query) {
            obj.query[name] = this.compile(obj.query[name]);
        }
    },
    compile(code) {
        if (!code) {
            return '';
        }
        // code += this.getTpToken();
        // var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        // for (var i = 1, len = code.length; i < len; i++) {
        //     c += String.fromCharCode(code.charCodeAt(i) + len)
        // }
        // return escape(code);
        return code;
    },
    unCompile(code) {
        if (!code) {
            return '';
        }
        // code = unescape(code);
        // code = code.replace(this.getTpToken(), '');

        // var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        // for (var i = 1, len = code.length; i < len; i++) {
        //     c += String.fromCharCode(code.charCodeAt(i) - len)
        // }
        return code;
    },
    getBrowserType: function() {
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) { // 判断是否Safari浏览器
            return 's';
        }
        if ((userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) || userAgent.indexOf('Trident') > -1) { // 判断是否IE浏览器
            return 'i';
        }
        return 'g';
    }
};
window.browserType = handle.getBrowserType();
export default handle