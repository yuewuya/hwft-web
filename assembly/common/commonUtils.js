//Ajax Post提交
function AjaxPost(Url, JsonData, LodingFun, ReturnFun) {
    $.ajax({
        type: "post",
        url: Url,
        data: JsonData,
        dataType: 'json',
        async: 'false',
        beforeSend: LodingFun,
        error: function () {
            ErrorFunc({"Status": "Erro", "Erro": "500"});
        },
        success: ReturnFun
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
    // var curWwwPath = window.document.location.href;
    // //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    // var pathName = window.document.location.pathname;
    // var pos = curWwwPath.indexOf(pathName);
    // //获取主机地址，如： http://localhost:8083
    // var localhostPaht = curWwwPath.substring(0, pos);
    // return (localhostPaht);
    return "http://127.0.0.1:8080"
}

/**
 * Axios Post请求
 */
function AxiosPost(Url, data, ReturnFun, ErrorFunc) {
    axios.post(getRootPath() + Url, data).then(ReturnFun).catch(ErrorFunc);
}

/**
 * Axios Post请求
 */
function AxiosCommunication(then, Url, data, SuccessFunc) {
    axios.post(getRootPath() + Url, data).then((function (response) {
        let result = response.data;
        if (result.status == "1") {
            let items = result.messList;
            let info = "";
            for (let i = 0; i < items.length; i++) {
                info = info + items[i].message + '<br/>';
            }
            if (info.length >= 1) {
                info = info.substring(0, info.lastIndexOf("<br/>"));
                then.$message({
                    message: info,
                    type: 'warning'
                });
            }
        } else {
            then.$message({
                message: "操作成功！！！",
                type: 'success'
            });
            SuccessFunc();
            then.dialogFormVisible = false;
        }
    })).catch(function () {
        then.$message.error('和后台通讯失败');
    });
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
        let arr = new Array();
        for (let i = 0; i < row.length; i++) {
            let obj = new Object();
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
    let num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    let arr = str.split("&"); //各个参数放到数组里
    return arr[0].split('=')[1];
}
