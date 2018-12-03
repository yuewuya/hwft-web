/**
 * js获取项目根路径
 */
function getRootPath() {
    // let curWwwPath = window.document.location.href;
    // let pathName = window.document.location.pathname;
    // let pos = curWwwPath.indexOf(pathName);
    // let localhostPaht = curWwwPath.substring(0, pos);
    // return (localhostPaht);
    return "http://127.0.0.1:8080"
}


const regular = {};
regular.uPattern = /^[a-zA-Z0-9_-]{4,16}$/;////用户名正则，4到16位（字母，数字，下划线，减号）
regular.posPattern = /^\d+$/;//正整数正则
regular.negPattern = /^-\d+$/;//负整数正则
regular.intPattern = /^-?\d+$/;//整数正则
regular.posPattern = /^\d*\.?\d+$/;//正数正则
regular.numPattern = /^-?\d*\.?\d+$/;//数字正则
regular.ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;//Email正则
regular.mPattern = /^1[34578]\d{9}$/;//手机号正则

/**
 * GUID
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * 合并两个json
 * @param jsonbject1
 * @param jsonbject2
 */
function mergeJsonObject(jsonbject1, jsonbject2) {
    let resultJsonObject = {};
    for (let attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
    }
    for (let attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr];
    }
    return resultJsonObject;
}


function number2China(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
    var unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
    n += "00";
    var p = n.indexOf('.');
    if (p >= 0)
        n = n.substring(0, p) + n.substr(p+1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(/(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/^元零?|零分/g, "").replace(/(元|角)$/g, "$1整");
}

