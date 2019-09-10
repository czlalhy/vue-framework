/**
 * api配置
 * @module apiService
 * @author 陈柱良
 * @since 2017/11/01
 */
var apiService = {},
    api = {},
    Domain = {};

/**
 * @function get
 * @static
 * @param {string} apiName api配置名
 * @param {object} [params] 参数
 * @param {object} [urlParams] url上的参数
 * @param {string} [domain] 域名
 * @returns {string} url路径
 */
apiService.get = function(apiName, params, urlParams, domain) {
    var configUrl = api[apiName],
        url = new Array(0),
        d = Domain[domain] ? Domain[domain] : ''; // '/' +

    url[0] = d + configUrl;

    if (!url) {
        console.log('请求的cgi：' + apiName + ' 不存在');
        return '';
    }
    if (urlParams && typeof urlParams === 'object') {
        var re;
        for (var name in urlParams) {
            re = new RegExp('{' + name + '}', 'g');
            url[0] = url[0].replace(re, urlParams[name]);
        }
    }
    if (params && url[0].indexOf('?') === -1) {
        url.push('?');
    }
    if (typeof params === 'string') {
        url.push(params);
    } else if (typeof params === 'object') {
        for (var key in params) {
            url.push('&' + key + '=' + params[key]);
        }
    }
    var realUrl = url.join('');

    return realUrl;
};

apiService.registerApi = function(obj) {
    api = Object.assign(api, obj || {});
}

apiService.registerContext = function(obj) {
    Domain = Object.assign(Domain, obj || {});
}

export default apiService;