/**
 * 全局配置模块
 * @author 陈柱良
 * @time 2017/11/01
 */
const config = {
    config: {
        authName: 'Authorization', // 权限Name
        authValue: 'Arch6WithCloud', // 权限Value
        timeout: 60000, // ajax超时默认时间
        version: 'dev1.0.0.0', // 版本号
        islanguage: true, //是否需要语言切换
        maxlength: 10, //帐号最大长度
        // path     : 'http://10.0.102.12:8805/'
        // path     : 'http://192.168.32.141:8805/'
    },
    api: {
        'uploadGetFileMenus': '/biztype/list',
        'uploadGetFileList': '/docinfo/list',
        'uploadRemoveFile': '/docinfo/remove',
        'uploadAddFile': '/docinfo/add',
        'layoutMenu': '/tpsgi/jwt/menu',
        'layoutAuth': '/jwt/login',
        'layoutRefresh': '/jwt/refresh',
        'layoutSelectGGCodeList': '/gg_code/find_list',
        'layoutSelectGGCodeOtherList': '/gg_code/find_other_list',
        'layoutDbclickGGCodeList': '/gg_code/find_list_valid_dbclick',
        'layoutAutoCompleteGGCodeList': '/gg_code/find_list_valid_auto_complete',
        'layoutDbclickGGCodeOtherList': '/gg_code/find_other_list_page',
        'layoutDbclickGGCodeOtherListByCode': '/gg_code/find_business_list_page_by_code',
        'layoutAllMenu': '/menu/find_by_system_code/{platform}',
        'layoutFormEngine': '/view/get_view_object/{productCode}/{planCode}/{subjectType}',
        'layoutFormEngineForm': '/view/get_view_object_form/{formCode}',
        'layoutValidationConfig': '/validation/mapping/{voName}',
        'layoutDocinfo': '/docinfo/view/{docId}',
        'sysTaskSearch': '/saa/task/search'
    },
    context: {
        config: 'config', // (配置中心)
        euraka: 'euraka', // (注册中心)
        gateway: 'gateway', // (Zuul网关)
        webui: 'webui', // (前端工程)
        filesystem: 'filesystem', // (影像微服务)
        logcenter: 'logcenter', // (日志中心)
        schedule: 'schedule', // (定时任务)
        report: 'report', // (单证报表微服务)
        workflow: 'workflow', // (工作流微服务)
        rule: 'rule', // (规则引擎微服务)
        // auth: 'http://127.0.0.1:8812/auth', // (权限微服务)
        auth: 'system', // (权限微服务)
        monitor: 'monitor', // (监控中心)
        admin: 'admin', // (监控运维后台UI)
        underwriting: 'underwriting', // (承保微服务)
        claims: 'claims', // (理赔微服务)
        finance: 'finance', // (收付微服务)
        reinsurance: 'reinsurance', // (再保微服务)
        common: 'common', // （公共服务）
        fs: 'fs'
    }
}
export default config