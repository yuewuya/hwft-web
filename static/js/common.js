//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
T.p = url;

//请求前缀
//var baseURL = "http://demo.open.renren.io/renren-fastplus/";
//var baseURL = "/renren-fastplus/";
var baseURL = "/";

//登录token
var token = localStorage.getItem("token");
if (token == 'null') {
    parent.location.href = baseURL + 'login.html';
}

//jquery全局配置
$.ajaxSetup({
    dataType: "json",
    cache: false,
    headers: {
        "token": token
    },
    complete: function (xhr) {
        //token过期，则跳转到登录页面
        if (xhr.responseJSON.code == 401) {
            parent.location.href = baseURL + 'login.html';
        }
    }
});

//jqgrid全局配置
$.extend($.jgrid.defaults, {
    ajaxGridOptions: {
        headers: {
            "token": token
        }
    }
});

//权限判断
function hasPermission(permission) {
    if (window.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

//重写alert
window.alert = function (msg, callback) {
    parent.layer.alert(msg, function (index) {
        parent.layer.close(index);
        if (typeof(callback) === "function") {
            callback("ok");
        }
    });
};

//重写confirm式样框
window.confirm = function (msg, callback) {
    parent.layer.confirm(msg, {btn: ['确定', '取消']},
        function () {//确定事件
            if (typeof(callback) === "function") {
                callback("ok");
            }
        });
};

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    var selectedIDs = grid.getGridParam("selarrrow");
    if (selectedIDs.length > 1) {
        alert("只能选择一条记录");
        return;
    }

    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if (!rowKey) {
        alert("请选择一条记录");
        return;
    }

    return grid.getGridParam("selarrrow");
}

//Ajax 查询某字典的所有选项
function ajaxDictQuery(arr, then,SuccessFun) {
    $.ajax({
        type: "post",
        url:'/dict/dictInfoBatch',
        data: $.toJSON(arr),
        contentType: "application/json",
        async: 'true',
        beforeSend: function () {
            console.log('获取字典项');
        },
        error: function () {
            then.$message.error('业务字典获取失败');
            SuccessFun();
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                SuccessFun(result.data);
            }
        }
    });
}

//Ajax Post提交
function AjaxPost(Url, JsonData, then, SuccessFun) {
    $.ajax({
        type: "post",
        url: getRootPath() + Url,
        data: $.toJSON(JsonData),
        contentType: "application/json",
        async: 'false',
        beforeSend: function () {
            console.log('开始通讯');
        },
        error: function () {
            then.$message.error('和后台通讯失败');
        },
        success: function (result) {
            if (result.msg == 'success' && result.code == 0) {
                SuccessFun(result.data);
            } else {

            }
        }
    });
}

//Ajax Post 提交刪除操作
function AjaxDeleteFunc(Url, JsonData, that, SuccessFunc,errorFunc) {
    if (JsonData.length > 0) {
        that.$confirm('此操作将删除选中的记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            $.ajax({
                type: "post",
                url: getRootPath() + Url,
                data: $.toJSON(JsonData),
                contentType: "application/json",
                async: 'false',
                beforeSend: function () {
                },
                error: function () {
                    that.$message.error('和后台通讯失败');
                },
                success: function (result) {
                    if (result.msg == 'success' && result.code == 0) {
                        that.$message({
                            message: '删除成功！！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(result.msg);
                    }
                    SuccessFunc();
                }
            });
        }).catch(() => {
            that.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    } else {
        that.$message.error('请选择要删除的数据');
    }
}

//Ajax Post 提交刪除操作
function AjaxDelete(Url, JsonData, that) {
    if (JsonData.length > 0) {
        that.$confirm('此操作将删除选中的记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            $.ajax({
                type: "post",
                url: getRootPath() + Url,
                data: $.toJSON(JsonData),
                contentType: "application/json",
                async: 'false',
                beforeSend: function () {
                },
                error: function () {
                    that.$message.error('和后台通讯失败');
                },
                success: function (result) {
                    if (result.msg == 'success' && result.code == 0) {
                        that.$message({
                            message: '删除成功！！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(result.msg);
                    }
                    if (that.pageData.total % that.pageData.pageSize <= JsonData.length && (parseInt(that.pageData.total / that.pageData.pageSize) + 1) == that.pageData.currentPage) {
                        that.changePage(that.pageData.currentPage - 1);
                    } else if (that.pageData.total % that.pageData.pageSize == 0 && (that.pageData.total / that.pageData.pageSize) == that.pageData.currentPage) {
                        that.changePage(that.pageData.currentPage - 1);
                    } else {
                        that.loadTableData();
                    }
                    that.dialogFormVisible = false;
                }
            });
        }).catch(() => {
            that.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
    } else {
        that.$message.error('请选择要删除的数据');
    }
}

//Ajax Post 提交表单
function AjaxSubmitWithFunc(Url, JsonData, that, successFunc) {
    that.$confirm('是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        $.ajax({
            type: "post",
            url: getRootPath() + Url,
            data: $.toJSON(JsonData),
            contentType: "application/json",
            async: 'false',
            beforeSend: function () {
            },
            error: function () {
                that.$message.error('和后台通讯失败');
            },
            success: function (result) {
                if (result.msg == 'success' && result.code == 0) {
                    that.$message({
                        message: '提交成功！！',
                        type: 'success'
                    });
                    successFunc();
                } else {
                    that.$message.error(result.msg);
                }
            }
        });
    }).catch(() => {
        that.$message({
            type: 'info',
            message: '提交已取消'
        });
    });
}

//Ajax Post 提交表单
function AjaxSubmit(Url, JsonData, that) {
    console.log($.toJSON(JsonData));
    that.$confirm('是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        $.ajax({
            type: "post",
            url: getRootPath() + Url,
            data: $.toJSON(JsonData),
            contentType: "application/json",
            async: 'false',
            beforeSend: function () {
            },
            error: function () {
                that.$message.error('和后台通讯失败');
            },
            success: function (result) {
                if (result.msg == 'success' && result.code == 0) {
                    that.$message({
                        message: '提交成功！！',
                        type: 'success'
                    });
                    that.loadTableData();
                    that.dialogFormVisible = false;
                } else {
                    that.$message.error(result.msg);
                }
            }
        });
    }).catch(() => {
        that.$message({
            type: 'info',
            message: '提交已取消'
        });
    });
}

//Ajax 错误弹出
function ErrorAlert(e) {
    var index = layer.alert(e, {
        icon: 5,
        time: 2000,
        offset: 't',
        closeBtn: 0,
        title: '错误信息',
        btn: [],
        anim: 2,
        shade: 0
    });
    layer.style(index, {
        color: '#777'
    });
}

//Ajax 错误返回处理
function ErrorFunc(e) {
    if (e.Status == "Erro") {
        switch (e.Erro) {
            case "500":
                top.location.href = '/Erro/Erro500';
                break;
            case "100001":
                ErrorAlert("错误 : 错误代码 '10001'");
                break;
            default:
                ErrorAlert(e.Erro);
        }
    } else {
        layer.msg("未知错误！");
    }
}

/**
 * js获取项目根路径
 */
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    return (localhostPaht);
}

/**
 * Axios Post请求
 */
function AxiosPost(Url, data, ReturnFun, ErrorFunc) {
    axios.post(getRootPath() + Url, data).then(ReturnFun).catch(ErrorFunc);
}

/**
 * 通用新增
 */
function addBtn(title, url) {
    openWindow(title, url);
}

/**
 * 通用修改
 */
function editBtn(title, url, row) {
    openWindow(title, url + "?id=" + row.id);
}

/**
 * 通用删除
 */
function deleteBtn(title, url, row) {
    if (row.length > 0) {
        let arr = [];
        for (let i = 0; i < row.length; i++) {
            let obj = {};
            obj.id = row[i].id;
            arr[i] = obj;
        }
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function () {
            AxiosCommunication(getRootPath() + url, arr);
        });
    } else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }
}

/**
 * 获取url参数
 */
function getQueryId() {
    let str = location.href; //取得整个地址栏
    let num = str.indexOf("?");
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    let arr = str.split("&"); //各个参数放到数组里
    return arr[0].split('=')[1];
}

function funExists(funcName){
    if(typeof funcName === "function"){
        return true;
    }else{
        console.log('not exists');
        return false;
    }
}
