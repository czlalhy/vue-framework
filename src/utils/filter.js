import Vue from 'vue'
/**
 * @Function transform 加空格
 * @Param splitNum 每隔几位数加个空格
 */
Vue.filter('formatUpOrLow', function(value, formatStr) {
    if (!value) {
        return ''
    }!formatStr || formatStr === 'up' ? value = value.toUpperCase() : value.toLowerCase();
    return value;
})
/**
 * @Function format 加空格
 * @Param splitNum 每隔几位数加个空格
 */
Vue.filter('format', function(value, splitNum) {
    if (!value) {
        return ''
    }
    var str = value.replace(/\s+/g, ''),
        result = '',
        tmp, num = splitNum || 4,
        regexp = new RegExp('\\w{' + num + '}');
    /* eslint no-cond-assign: "off" */
    while (tmp = regexp.exec(str)) {
        str = str.replace(regexp, '');
        result += tmp[0] + ' ';
    }
    result += str;
    return result;
})
/**
 * @Function format 格式化日期
 * @Param formatStr String 格式 [yyyy,MM,dd,HH,mm,ss]
 */
Vue.filter('time', function(value, formatStr) {
    if (!value || value === '') {
        return '';
    }
    // 针对safari兼容处理
    if (typeof value === 'string' && window.browserType !== 'g') {
        value = value.replace(/-/g, '/');
    }
    formatStr = formatStr || 'dd-MM-yyyy';
    var date = new Date(value),
        yyyy = date.getFullYear(),
        MM = date.getMonth() + 1,
        dd = date.getDate(),
        HH = date.getHours(),
        mm = date.getMinutes(),
        ss = date.getSeconds(),
        result = formatStr;

    (MM < 10) && (MM = '0' + MM);
    (dd < 10) && (dd = '0' + dd);
    (HH < 10) && (HH = '0' + HH);
    (mm < 10) && (mm = '0' + mm);
    (ss < 10) && (ss = '0' + ss);

    result = result.replace('yyyy', yyyy)
        .replace('MM', MM)
        .replace('dd', dd)
        .replace('HH', HH)
        .replace('mm', mm)
        .replace('ss', ss);
    return result;
})

/**
 * 后缀， 如：XX元
 * @Param label
 */
// Vue.filter('money', function(value, label, isDecimal) {

//     if (value == 'undefined' || value === "") {
//         return ""
//     }
//     if (!label) {
//         label = '';
//     }
//     var numberTmp = Math.round(value * 100) / 100;

//     if (isNaN(numberTmp)) {
//         return value;
//     }
//     if (isDecimal) {
//         numberTmp = parseInt(numberTmp.toFixed(0)) || 0;
//     }

//     var numberStr = numberTmp.toString(),
//         divide = numberStr.split("."),
//         integer = divide[0],
//         len = integer.length,
//         decimal = '',
//         result = "",
//         i = 0;

//     if (!isDecimal) {
//         decimal = divide[1] || '00'
//     }
//     while (len) {
//         result += integer[--len];
//         i++;
//         if (!(i % 3) && len) {
//             result += ",";
//             i = 0;
//         }
//     }
//     result = result.split("").reverse().join("");

//     if (decimal.length == 1) {
//         decimal += '0';
//     }
//     // if (decimal.length > 2) {
//     //     decimal = decimal.subString(0, 2);
//     // }
//     if (!isDecimal) {
//         result += "." + decimal;
//     }

//     return label + result
// })
/**
 * 后缀， 如：XX元
 * @Param label
 */
Vue.filter('money', function(value, thou, len, flag) {
    if (value === 'undefined' || value === '' || value == null) {
        return '';
    }
    if (flag && parseFloat(value) === 0) {
        return '';
    }
    if (value < 0) {
        return '-' + (Vue.tpUtil.showNumber(thou, len, -value))
    }
    return Vue.tpUtil.showNumber(thou, len, value);
})
/**
 * @Description 身份证号遮挡
 * @Param start Number 开始位置
 * @Param len Number 长度
 */
Vue.filter('idCard', function(value, start, len) {
    if (!value) {
        return ''
    }

    var val = value.replace(/\s+/g, ''),
        result = '',
        maxLen = 18 - start;
    if (!/^\d{17}[\dX]$/.test(val)) {
        return ''
    }
    if (start > 18) {
        return value
    }

    result = val.substring(0, start);
    maxLen = maxLen < len ? maxLen : len;
    while (maxLen--) {
        result += '*'
    }

    result += val.substring(start + len, 18);

    return result
})

/**
 * @Description 手机号遮挡
 * @Param start Number 开始位置
 * @Param end Number 结束位置
 */
Vue.filter('phoneNum', function(value, start, end) {
    if (!value) {
        return ''
    }

    var val = value.replace(/\s+/g, ''),
        result = '',
        valLen = val.length,
        startLen = valLen - start - end;
    if (!/^(\+\d{1,4})?1[3|4|5|7|8|9]\d{9}$/.test(val)) {
        return ''
    }
    if (startLen < 0) {
        return value
    }

    result = val.substring(0, start);
    while (startLen--) {
        result += '*'
    }

    result += val.substring(valLen - end, valLen);

    return result
});
/**
 * @Description 手机号遮挡
 * @Param start Number 开始位置
 * @Param end Number 结束位置
 */
Vue.filter('keepNum', function(value, len) {
    if (!value) {
        return ''
    }
    value = Number(value);
    return value.toFixed(len || 2);
})