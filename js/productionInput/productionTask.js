/**
 * 初始化数据
 */
let loadUrl = '/processCard/ftCard/findByCondition';
let submitUrl = '/productionInput/task/save';
let dictArr = [];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable1({status: 1});
        });
    } else {
        initTable1({status: 1});
    }
});

/**
 * 加载表格数据
 */
function initTable1(data) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        width: '98%',
        height: mContentHeight,
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 20,
        pageList: [20, 50, 100],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams: data,
        columns: [[{
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'center'
        }, {
            field: 'shape',
            title: '规格',
            width: 200,
            align: 'center',
            formatter: function (value, row) {
                return value + "--" + row.material + "--" + row.diameter + "*" + row.thickness;
            }
        }, {
            field: 'count',
            title: '数量',
            width: 100,
            align: 'center'
        }, {
            field: 'unFinishCount',
            title: '未完成数量',
            width: 120,
            align: 'center'
        }, {
            field: 'weight',
            title: '重量',
            width: 100,
            align: 'center'
        }, {
            field: 'beginTime',
            title: '开始时间',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'endTime',
            title: '结束时间',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'currentProcess',
            title: '当前工序',
            width: 100,
            align: 'center'
        }, {
            field: 'nextProcess',
            title: '下道工序',
            width: 100,
            align: 'center'
        }, {
            field: 'customerId',
            title: '客户号',
            width: 100,
            align: 'center'
        }, {
            field: 'model',
            title: '主机种',
            width: 100,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 150,
            align: 'center'
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

function initTable2(data) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        width: '98%',
        height: mContentHeight,
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 20,
        pageList: [20, 50, 100],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams: data,
        columns: [[{
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'center'
        }, {
            field: 'shape',
            title: '规格',
            width: 200,
            align: 'center',
            formatter: function (value, row) {
                return value + "--" + row.material + "--" + row.diameter + "*" + row.thickness;
            }
        }, {
            field: 'count',
            title: '数量',
            width: 100,
            align: 'center'
        }, {
            field: 'currentProcess',
            title: '工序',
            width: 120,
            align: 'center'
        }, {
            field: 'weight',
            title: '重量',
            width: 100,
            align: 'center'
        }, {
            field: 'endTime',
            title: '结束时间',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'customerId',
            title: '客户号',
            width: 100,
            align: 'center'
        }, {
            field: 'model',
            title: '主机种',
            width: 100,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 100,
            align: 'center'
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search() {
    let obj = $('#searchForm').getData();
    let flag = $("#switch").switchbutton("options").checked;
    if (flag) {
        obj.status = 2;
        initTable2(obj);
        $("#needHide").hide()
    } else {
        obj.status = 1;
        initTable1(obj);
        $("#needHide").show()
    }
    $('#dg').datagrid('clearSelections');
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, data) {
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', '550px'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                ajaxPostInvoke('/processCard/ftCard/findOne', {id: data.id}, function (res) {
                    sonFrame.initData(res);
                })
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}

/*
$('#switch').switchbutton({
    checked: false,
    onChange: function (checked) {
        console.log("----res---", checked)
    }
})

$(".switchbutton").click(function () {
    console.log("---click---", )
    search();
})
*/

function setExplain() {
    let row = getSelections();
    if(row && row != null){
        layer.open({
            type: 1,
            title: "说明",
            fix: false,
            shadeClose: true,
            area: ['600px', '350px'],//width,height
            content: $('#savePage1'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                if(row && row != null){
                    ajaxPostInvoke("/processCard/ftCard/findWorking", {id: row.id}, function(res){
                        res.code = row.code;
                        $("#savePageForm1").form("load",res)
                    })
                }
            },
            yes: function (index, layero) {
                let param = $("#savePageForm1").getData();
                if(row && row != null){
                    param.id = row.id;
                }
                ajaxSubmit(submitUrl, param)
            },
            btn2: function () {
                layer.closeAll();
            },
            end:function () {
                $('#savePageForm1').form('clear');
            }
        });
    }

}

function finishWorking() {
    let row = getSelections();
    if(row && row != null){
        layer.open({
            type: 1,
            title: "完工",
            fix: false,
            shadeClose: true,
            area: ['600px', '520px'],//width,height
            content: $('#savePage2'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                if(row && row != null){
                    ajaxPostInvoke("/processCard/ftCard/findWorking", {id: row.id}, function(res){
                        res.code = row.code;
                        res.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
                        res.finishTime = res.createTime;
                        if(!res.finishOpt || res.finishOpt == ''){
                            res.finishOpt = getUserInfo().username;
                        }
                        $("#savePageForm2").form("load",res);
                        $("#specification").text(row.shape + " " + row.diameter + " " + row.material + "*" + row.thickness);
                        $("#count").text(row.unFinishCount)
                    })
                }
            },
            yes: function (index, layero) {
                let param = $("#savePageForm2").getData();
                if(param.finishCount > $("#count").text() * 1){
                    layer.alert("不存在如此多的封头可完成！", {
                        icon: 2
                    });
                }else if(param.finishCount > 0){
                    param.specification = $("#specification").text();
                    param.parentId = row.id;
                    ajaxSubmit(submitUrl, param)
                }else {
                    layer.alert("请输入正确的数量！", {
                        icon: 2
                    });
                }
            },
            btn2: function () {
                layer.closeAll();
            },
            end:function () {
                $('#savePageForm2').form('clear');
            }
        });
    }

}