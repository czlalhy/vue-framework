const user = {
    'TaskList': { "resCode": "0000", "resMsg": "成功", "resTimestamp": 1508837224137, "traceID": null, "spanID": null, "resData": { "saaTaskVoList": { "pageNo": 1, "perPage": 10, "total": 21, "content": [{ "taskCode": "PLAT_USER_DELETE", "groupName": "用户", "taskCName": "用户删除", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/delete/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_SYS_VIEW", "groupName": "用户", "taskCName": "表单管理", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/view/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1505282595434, "operateTimeForHis": null }, { "taskCode": "PLAT_SAA_ROLE", "groupName": "用户", "taskCName": "角色管理", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/role/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1501815290000, "operateTimeForHis": null }, { "taskCode": "PLAT_SAA_USER", "groupName": "用户", "taskCName": "用户管理", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_USER_EDIT", "groupName": "用户", "taskCName": "用户编辑", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/edit/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_USER_LIST", "groupName": "用户", "taskCName": "用户查看", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/list", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_USER_SAVE", "groupName": "用户", "taskCName": "用户保存", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/save", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_USER_SEARCH", "groupName": "用户", "taskCName": "用户查询", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/search", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_USER_VIEW", "groupName": "用户", "taskCName": "用户查询", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/user/view/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1429777246000, "operateTimeForHis": null }, { "taskCode": "PLAT_SAA_MENU", "groupName": "用户", "taskCName": "菜单管理", "taskTName": null, "taskEName": null, "url": "/tpsgi/sys/saa/menu/**", "creatorCode": null, "createTime": null, "updaterCode": null, "updateTime": null, "validind": "1", "remark": null, "flag": null, "version": 1, "insertTimeForHis": 1502245208191, "operateTimeForHis": null }] } }, "ext": null, "signature": null }
};

export default [{
        url: 'system/saa/task/search',
        type: 'post',
        response: config => {
            return user.TaskList;
        }
    }
]