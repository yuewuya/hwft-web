//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
let url = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
T.p = url;

//请求前缀
let baseURL = "/";

function getUserInfo() {
    return JSON.parse(readCookie("userInfo"));
}

//登录token
let token = localStorage.getItem("token");
if (token == 'null') {
    parent.location.href = baseURL + 'login.html';
}

//权限判断
function hasPermission(permission) {
    if (window.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

function getUrlPath(url, str) {
    if (str != null && str != '' && str != undefined) {
        return getRootPath() + url + "?token=" + token + str;
    } else {
        return getRootPath() + url + "?token=" + token;
    }
}

//jquery全局配置
$.ajaxSetup({
    dataType: "json",
    cache: false,
    headers: {
        "token": token
    },
    complete: function (xhr) {
        if (xhr.responseText != undefined && JSON.parse(xhr.responseText).code == 401) {
            parent.location.href = baseURL + 'login.html';
        }
        if (xhr.responseJSON == undefined) {
            return;
        }
        if (xhr.responseJSON.code == 401) {
            parent.location.href = baseURL + 'login.html';
        }
    }
});

//权限判断
function hasPermission(permission) {
    if (window.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 添加
 * @param url
 */
function addBtn(title, url) {
    url = url.search(".html?") != -1 ? url : url.split("?")[0];
    openWindow(title, url, null);
}

/**
 * 查看
 * @param url
 */
function showBtn(title, url) {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });
        return;
    }
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['100%', '100%'],//width,height
        content: getRootPath() + url,
        btn: ['关闭'],
        success: function (layero, index) {
            let data = rows[0];
            if (data) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(data);
            }
        }
    });
}

/**
 * 编辑 数据从父页面直接传给子页面
 * @param url
 */
function editBtn(title, url) {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要编辑的数据！", {
            icon: 2
        });
        return;
    }
    url = url.search(".html?") != -1 ? url : url.split("?")[0];
    openWindow(title, url, rows[0]);
}

/**
 * 审核
 * @param url
 */
function approveBtn(title, url) {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要审核的数据！", {
            icon: 2
        });

    } else {
        url = url.search(".html?") != -1 ? url : url.split("?")[0];
        let data = rows[0];
        if (data.status == 0) {
            layer.confirm('确认审核？', {
                icon: 3,
                title: '提示'
            }, function (index) {
                ajaxPostInvoke(url, {id: data.id, status: 1}, function (res) {
                    layer.alert('审核成功！', {
                        icon: 1
                    }, function () {
                        search();
                        layer.closeAll();
                    });
                })
            });
        } else {
            layer.confirm('取消审核？', {
                icon: 3,
                title: '提示'
            }, function (index) {
                ajaxPostInvoke(url, {id: data.id, status: 0}, function (res) {
                    layer.alert('取消审核成功！', {
                        icon: 1
                    }, function () {
                        search();
                        layer.closeAll();
                    });
                })
            });
        }
    }
}


/**
 * 删除
 * @param url
 */
function delBtn(title, url, tableId) {
    ajaxDeleteBatch(url,tableId);
}

/**
 * 批量删除
 * @param url
 */
function ajaxDeleteBatch(url, tableId) {
    let whatTable = 'dg';
    if (tableId) {
        whatTable = tableId;
    }
    let row = $('#' + whatTable).datagrid('getSelections');
    if (row != null && row.length > 0) {
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            let flag = typeof deleteInvoke === "function";
            if ((flag && deleteInvoke(row)) || !flag) {
                $.ajax({
                    type: 'POST',
                    url: getRootPath() + url,
                    data: $.toJSON(row),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (result) {
                        if (result.msg == 'success' && result.code == 0) {
                            layer.alert('删除成功！', {
                                icon: 1
                            }, function () {
                                layer.closeAll();
                            });
                            $('#' + whatTable).datagrid("clearSelections");
                        } else {
                            layer.alert(result.msg, {
                                icon: 0
                            }, function () {
                                layer.closeAll();
                            });
                        }
                        search();
                    },
                    error: function () {
                        layer.alert("操作错误！", {
                            icon: 2
                        });
                    }
                });
            } else {
                layer.alert('删除成功！', {icon: 1}, function (index) {
                    layer.close(index);
                });
            }
        });
    } else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }
}

/**
 * 表单提交
 */
function ajaxSubmit(url, JsonData) {
    let idx = 0;
    $.ajax({
        type: 'POST',
        url: getRootPath() + url,
        data: $.toJSON(JsonData),
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            idx = layer.load('操作中 ...', 3);
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                layer.alert('操作成功！', {
                    icon: 1
                }, function () {
                    search(JsonData);
                    layer.closeAll();
                });
            } else {
                layer.alert(result.msg, {
                    icon: 0
                });
            }
        },
        complete: function (XMLHttpRequest, textStatus) {
            layer.close(idx);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.alert("和后台通讯失败！" + textStatus + jqXHR.status + jqXHR.readyState, {icon: 2});
        }
    });
}

function parentAjaxSubmit(url, JsonData, page) {
    let idx = 0;
    $.ajax({
        type: 'POST',
        url: getRootPath() + url,
        data: $.toJSON(JsonData),
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            idx = layer.load('操作中 ...', 3);
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                let endPageIndex = parent.layer.getFrameIndex(page.name);
                page.layer.alert('操作成功！', {
                    icon: 1
                }, function () {
                    search();
                    parent.layer.close(endPageIndex);
                });
            } else {
                layer.alert(result.msg, {
                    icon: 0
                });
            }
        },
        complete: function (XMLHttpRequest, textStatus) {
            layer.close(idx);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.alert("和后台通讯失败！" + textStatus + jqXHR.status + jqXHR.readyState, {icon: 2});
        }
    });
}

function axiosPost(Url, JsonData, SuccessFun) {
    axios.post(getRootPath() + Url, JsonData).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

/**
 * ajax通讯
 */
function ajaxPostInvoke(url, JsonData, SuccessFun) {
    $.ajax({
        type: 'POST',
        url: getRootPath() + url,
        data: $.toJSON(JsonData),
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            console.log('开始通讯');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.alert("和后台通讯失败！" + textStatus + jqXHR.status + jqXHR.readyState, {icon: 2});
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                SuccessFun(result.data);
            } else {
                layer.alert(result.msg, {icon: 2});
            }
        }
    });
}

/**
 * ajax通讯
 */
function ajaxGetInvoke(Url, param, SuccessFun) {
    let getUrl = '';
    if (param == null) {
        getUrl = getRootPath() + Url;
    } else {
        getUrl = getRootPath() + Url + "/" + param;
    }
    $.ajax({
        type: 'get',
        url: getUrl,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            console.log('开始通讯');
        },
        headers: {
            "token": token
        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.alert("和后台通讯失败！" + textStatus + jqXHR.status + jqXHR.readyState, {icon: 2});
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                SuccessFun(result);
            } else {
                layer.alert(result.msg, {icon: 2});
            }
        }
    });
}

/**
 * 获取表单数据
 */
(function ($) {
    $.fn.getData = function () {
        let serializeObj = {};
        $(this.serializeArray()).each(function () {
            if (isAdDate(this.value)) {
                console.log(this.name + ":是日期格式！");
                serializeObj[this.name] = moment(this.value).format("YYYY-MM-DD HH:mm:ss");
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        let $radio = $('input[type=radio],input[type=checkbox]', this);
        $.each($radio, function () {
            if ($("input[name='" + this.name + "']:checked").length == 0) {
                serializeObj[this.name] = 0;
            }
        });
        return serializeObj;
    };
})(jQuery);


/**
 * 判断方法是否存在
 * @param funcName
 * @returns {boolean}
 */
function funExists(funcName) {
    if (typeof funcName === "function") {
        return true;
    } else {
        console.log('not exists');
        return false;
    }
}

/**
 * 载入需要的字典项
 * @param funcName
 * @returns {boolean}
 */
function ajaxDictQuery(arr, SuccessFun) {
    $.ajax({
        type: "post",
        url: '/dict/dictInfoBatch',
        data: $.toJSON(arr),
        contentType: "application/json",
        async: 'false',
        beforeSend: function () {
            console.log('获取字典项' + $.toJSON(arr));
        },
        error: function () {
            layer.alert("业务字典获取失败！", {icon: 2});
            SuccessFun();
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                SuccessFun(result.data);
            }
        }
    });
}


/**
 * 匹配业务字典
 * @param dictArr 业务字典返回数据
 * @param typeCode 类型名称
 * @param typeInfo 选项id
 * @returns {*}
 */
function compareDict(dictArr, typeCode, typeInfo) {
    if (typeCode == null || typeInfo == '' || typeInfo == null) {
        return '';
    }
    return dictArr[typeCode][typeInfo].info;
}


/**
 * 字典select下拉框展示选项
 * @param idArr 需要填充的元素Id数组
 * @param typeCode 类型名称
 * @returns {*}
 */
function setDictOption(idArr, typeCode) {
    let opts = [{id: '', text: ''}];
    for (let i in allDict[typeCode]) {
        opts.push({id: allDict[typeCode][i].info, text: allDict[typeCode][i].info});
    }
    for (let i in idArr) {
        $("#" + idArr[i]).combobox("loadData", opts);
    }
}

/**
 * 字典select下拉框展示选项
 * @param idArr 需要填充的元素Id数组
 * @param typeCode 类型名称
 * @returns {*}
 */
function setDictOptionKey(idArr, typeCode) {
    let opts = [{id: '', text: ''}];
    for (let i in allDict[typeCode]) {
        let info = allDict[typeCode][i];
        opts.push({id: info.infoCode, text: info.info});
    }
    for (let i in idArr) {
        $("#" + idArr[i]).combobox("loadData", opts);
    }
}

/**
 * 获取选中的一条项目
 * @returns {*}
 */
function getSelections() {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });
        return;
    }
    return rows[0];
}

/**
 * 获取选中的多条项目
 * @returns {*}
 */
function getSelectionsRows() {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length == 0) {
        layer.alert("请选择需要查看的数据！", {
            icon: 2
        });
        return;
    }
    return rows;
}

/**
 * 打开一个页面选择数据 直接在子页面打开
 * @returns {*}
 */
function selfSelectOtherPageRow(title, url, searchData, id) {
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (searchData != null) {
                sonFrame.search(searchData);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                $("#" + id + "Name").val(obj[id]);
                $("#" + id).val(obj.id);
            }
            console.log(obj);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function selfSelectOtherPage(title, url, searchData, successFuc) {
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (searchData != null) {
                sonFrame.search(searchData);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                successFuc(obj);
            }
            console.log(obj);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

/**
 * 打开一个页面选择数据 在父页面打开 并且会返回两个参数 保证页面上有id 以及idName的input
 * @returns {*}
 */
function selectOtherPageRow(title, url, searchData, id) {
    parent.layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = parent.window['layui-layer-iframe' + index];
            if (searchData != null) {
                sonFrame.search(searchData);
            }
        },
        yes: function (index, layero) {
            let obj = parent.window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                $('#' + id).val(obj.id);
                $('#' + id + 'Name').val(obj[id]);
            }
            parent.layer.close(index);
        },
        btn2: function (index) {
            parent.layer.close(index);
        }
    });
}

/**
 * 打开一个页面选择数据 特殊处理
 * @returns {*}
 */
function selectOtherPage(title, url, searchData, successFuc) {
    parent.layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = parent.window['layui-layer-iframe' + index];
            if (searchData != null) {
                sonFrame.search(searchData);
            }
        },
        yes: function (index, layero) {
            let obj = parent.window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                successFuc(obj);
            }
            console.log(obj);
            parent.layer.close(index);
        },
        btn2: function (index) {
            parent.layer.close(index);
        }
    });
}

/**
 * 打开一个页面选择多条数据 特殊处理
 * @returns {*}
 */
function selectRowsOtherPage(title, url, searchData, successFuc) {
    parent.layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = parent.window['layui-layer-iframe' + index];
            if (searchData != null) {
                sonFrame.search(searchData);
            }
        },
        yes: function (index, layero) {
            let obj = parent.window[layero.find('iframe')[0]['name']].getSelectionsRows();
            if (obj) {
                successFuc(obj);
            }
            console.log(obj);
            parent.layer.close(index);
        },
        btn2: function (index) {
            parent.layer.close(index);
        }
    });
}

/*
* 方法:Array.baoremove(dx)
* 功能:删除数组元素.
* 参数:dx删除元素的下标.
* 返回:在原数组上修改数组.
*/
(function ($) {
    $.fn.baoRemove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    }
})(jQuery);

/*
* 方法:updateBaoRemove
* 功能:修改数组元素.
* 参数:obj
* 返回:在原数组上修改数组.
*/
(function ($) {
    $.fn.updateBaoRemove = function (obj) {
        let row = $('#dg').datagrid('getSelections');
        if (row.length != 1) {
            layer.alert("请选择一条需要查看的数据！", {
                icon: 2
            });
            return;
        }
        let index = $('#dg').datagrid('getRowIndex', row[0]);
        this[index] = obj;
        $('#dg').datagrid('loadData', {total: this.length, rows: this});
        layer.alert('操作成功！', {
            icon: 1
        }, function () {
            layer.closeAll();
        });
        return this;
    }
})(jQuery);

/*
 *判断字符串是否为日期（日期格式为：YYYY-MM-DD）
 */
function isAdDate(d) {
    let regx = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!regx.test(d)) {
        return false;
    }
    else {
        return true;
    }
}

function concatJSON(jsonbject1, jsonbject2) {

    var resultJsonObject = {};
    for (var attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr];
    }
    for (var attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr];
    }
    return resultJsonObject;
}

function GetRequestParam() {

    var url = location.search; //获取url中含"?"符后的字串

    var theRequest = {};

    if (url.indexOf("?") != -1) {

        var str = url.substr(1);

        strs = str.split("&");

        for (var i = 0; i < strs.length; i++) {

            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);

        }

    }

    return theRequest;

}


let layerZ = 20000000;

function printBtn(title, url) {
    let size = ['98%', '98%'];
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });

    } else {
        layer.open({
            type: 2,
            title: title,
            fix: false,
            shadeClose: true,
            maxmin: false,
            area: size,
            content: getRootPath() + url
            , btn: ['打印', '关闭']
            , success: function (layero, index) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(rows[0])
            }
            , yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);

                body.find('#print1').jqprint({
                    debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
                    // importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
                    printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
                    operaSupport: true
                });
            }
            , btn2: function () {
                layer.closeAll();
            }
        });
    }
}

function printPage(title, url) {
    let size = ['98%', '98%'];
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        maxmin: false,
        area: size,
        content: getRootPath() + url
        , btn: ['打印', '关闭']
        , yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            body.print(printObj);
        }
        , btn2: function () {
            layer.closeAll();
        }
    });

}

function lookBtn(title, url) {
    let size = ['98%', '98%'];
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });

    } else {
        layer.open({
            type: 2,
            title: title,
            fix: false,
            shadeClose: true,
            maxmin: false,
            area: size,
            content: getRootPath() + url
            , btn: ['打印', '关闭']
            , success: function (layero, index) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(rows[0])
            }
        });
    }

}

function changeStatus(url, status) {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要审核的数据！", {
            icon: 2
        });
        return;
    }
    ajaxPostInvoke(url, {ids: rows[0].id, status: status}, function (res) {
        layer.alert('操作成功！', {
            icon: 1
        }, function () {
            layer.closeAll();
        });
    })
}


let printObj = {
    globalStyles: false,
    mediaPrint: false,
    stylesheet: "/assembly/css/easyui_print.css",
    noPrintSelector: ".no-print",
    iframe: true,
    append: null,
    prepend: null,
    manuallyCopyFormValues: true,
    deferred: $.Deferred(),
    timeout: 750,
    title: null,
    doctype: '<!doctype html>'
};

/*----------表格单元格赋值-----------*/
function setData2Text(data) {
    for (let i in data) {
        if (data[i] != null) {
            if (Array.isArray(data[i])) {
                for (let a in data[i]) {
                    for (let b in data[i][a]) {
                        if ($("[field=" + i + "_" + b + "]").eq(a).attr("type") == "checkbox") {
                            if (data[i][a][b] == 1) {
                                $("[field=" + i + "_" + b + "]").eq(a).attr("checked", true);
                            }
                        } else {
                            $("[field=" + i + "_" + b + "]").eq(a).text(data[i][a][b])
                        }
                    }
                }
            } else {
                if ($("[field=" + i + "]").attr("type") == "checkbox") {
                    if (data[i] == 1) {
                        $("[field=" + i + "]").attr("checked", true)
                    }
                } else {
                    $("[field=" + i + "]").text(data[i])
                }
            }
        }
    }
}

/*----------表格单元格赋值  指定区域-----------*/
function setData2TextArea(data, id) {
    for (let i in data) {
        if (data[i] != null) {
            if (Array.isArray(data[i])) {
                for (let a in data[i]) {
                    for (let b in data[i][a]) {
                        if ($("#" + id + " [field=" + i + "_" + b + "]").eq(a).attr("type") == "checkbox") {
                            if (data[i][a][b] == 1) {
                                $("#" + id + "[field=" + i + "_" + b + "]").eq(a).attr("checked", true);
                            }
                        } else {
                            $("#" + id + "[field=" + i + "_" + b + "]").eq(a).text(data[i][a][b])
                        }
                    }
                }
            } else {
                if ($("#" + id + "[field=" + i + "]").attr("type") == "checkbox") {
                    if (data[i] == 1) {
                        $("#" + id + "[field=" + i + "]").attr("checked", true)
                    }
                } else {
                    $("#" + id + "[field=" + i + "]").text(data[i])
                }
            }
        }
    }
}

function createTooBar(id) {
    let menuId = GetQueryString("menuId");
    if (menuId == undefined) {
        return;
    }
    ajaxGetInvoke('/sys/menu/button/' + menuId, null, function (data) {
        let arr = data.buttons;
        let str = '';
        for (let i = 0; i < arr.length; i++) {
            str = str + '<a href="#"' +
                'onclick="' + arr[i].methodName + '(\'' + arr[i].name + '\',\'' + arr[i].url + '\')"' +
                'data-options="plain:true,iconCls:\'' + arr[i].icon + '\'">' +
                '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">' + arr[i].name + '</span>' +
                '<span class="l-btn-icon ' + arr[i].icon + '">&nbsp;</span></span>' +
                '</a>';
        }
        if (id != undefined) {
            $("#" + id).html(str);
        } else {
            $("#toolbar").html(str);
        }
    });

}

function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * easyui dataGrid 临时数组缓存 新增
 * grid dataGrid id
 * obj 新增的一行数据
 * arr 数组
 */
function tempDataInsert(grid, obj, arr) {
    obj.id = arr.length;
    arr[arr.length] = obj;
    $('#' + grid).datagrid('loadData', {total: arr.length, rows: arr});
    layer.alert('操作成功！', {
        icon: 1
    }, function () {
        layer.closeAll();
    });
    return arr;
}

/**
 * easyui dataGrid 临时数组缓存 删除
 * grid dataGrid id
 * delArr 要删除的数据
 * arr 数组
 */
function tempDataDelete(grid, delRows, arr) {
    for (let i = 0; i < delRows.length; i++) {
        arr.splice(delRows[i].id, 1);
        for (let i = 0; i < arr.length; i++) {
            arr[i].id = arr[i].id - 1;
        }
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i].id = i;
    }
    $('#' + grid).datagrid('loadData', {total: arr.length, rows: arr});
    layer.alert('操作成功！', {
        icon: 1
    }, function () {
        layer.closeAll();
    });
    return arr;
}

/**
 * easyui dataGrid 临时数组缓存 修改
 * key 数组的id
 * obj 修改的一行数据
 */
function tempDataUpdate(grid, obj, arr) {
    arr.splice(obj.id, 1, obj);
    $('#' + grid).datagrid('loadData', {total: arr.length, rows: arr});
    layer.alert('操作成功！', {
        icon: 1
    }, function () {
        layer.closeAll();
    });
    return arr;
}

function margeList(list1, list2) {
    let ids = [];
    for (let i in list1) {
        ids.push(list1[i].id)
    }
    for (let i in list2) {
        if (ids.indexOf(list2[i].id) == -1) {
            list1.push(list2[i])
        }
    }
    return list1;
}

function timeCompare(time1, time2, format) {
    let str = format ? format : "YYYY-MM-DD HH:mm:ss";
    if (moment(time1, str) > moment(time2, str)) {
        return 1;
    } else if (moment(time1, str) == moment(time2, str)) {
        return 0;
    } else {
        return -1;
    }

}

function getBackImg(ids){
        ajaxPostInvoke("/screenshot/findById", {ids: ids}, function(res){
            if(res != null){
                for(let i in res){
                    $(".backImg[field="+res[i].id+"]").attr("src", res[i].img)
                }
            }
        })
}

function getRowIndex(target){
    var tr = $(target).closest("tr.datagrid-row");
    return parseInt(tr.attr("datagrid-row-index"));
}
