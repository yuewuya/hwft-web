/**
 * 初始化数据
 */
let loadUrl = '/productionInput/task/findAll';
let submitUrl = '/productionInput/task/save';
let findByIdUrl = '/productionInput/task/findOne';
let dictArr = [];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
        });
    } else {
        initTable();
    }
});

/**
 * 加载表格数据
 */
function initTable() {
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
        columns: [[{
            field: 'finishTime',
            title: '完工时间',
            width: 150,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日")
            }
        }, {
            field: 'finishUser',
            title: '完工人员',
            width: 100,
            align: 'center'
        }, {
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'center'
        }, {
            field: 'process',
            title: '工序',
            width: 100,
            align: 'center'
        }, {
            field: 'specification',
            title: '规格',
            width: 150,
            align: 'center'
        }, {
            field: 'finishCount',
            title: '完工数量',
            width: 100,
            align: 'center'
        }, {
            field: 'finishRemark',
            title: '备注',
            width: 120,
            align: 'center'
        }, {
            field: 'createName',
            title: '操作人',
            width: 100,
            align: 'center'
        }, {
            field: 'createTime',
            title: '操作时间',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日")
            }
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
    $('#dg').datagrid('reload', obj);
}

function openWindow(title, url, data) {
    if(data && data != null && data.parentId && data.parentId != ''&& data.parentId != null){
        layer.open({
            type: 1,
            title: "完工",
            fix: false,
            shadeClose: true,
            area: ['600px', '520px'],//width,height
            content: $('#savePage2'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                ajaxPostInvoke("/processCard/ftCard/findWorking", {id: data.parentId}, function(res){
                    res.parentId = res.id;
                    res.id = data.id;
                    res.code = data.code;
                    res.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
                    res.finishTime = data.finishTime == null ? res.createTime : data.finishTime;
                    res.finishCount = data.finishCount;
                    if(!data.createName || data.createName == ''){
                        res.createName = getUserInfo().username;
                    }else {
                        res.createName = data.createName;
                    }
                    res.specification = data.specification;
                    $("#count").text(res.planCount - res.finishCount + data.finishCount);
                    $("#savePageForm2").form("load",res);
                })
            },
            yes: function (index, layero) {
                let param = $("#savePageForm2").getData();
                if(param.finishCount > ($("#count").text() * 1)){
                    layer.alert("不存在如此多的数量可完成！", {
                        icon: 2
                    });
                }else if(param.finishCount > 0){
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
    }else {
        layer.open({
            type: 1,
            title: "完工",
            fix: false,
            shadeClose: true,
            area: ['600px', '520px'],//width,height
            content: $('#savePage1'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                if(data && data != null){
                    data.createName = getUserInfo().username;
                    data.createTime = moment().format("YYYY-MM-DD HH:mm:ss");
                    $("#savePageForm1").form("load",data);
                }else{
                    $("#savePageForm1").form("load",{createName: getUserInfo().username, createTime: moment().format("YYYY-MM-DD HH:mm:ss")});
                }
            },
            yes: function (index, layero) {
                let param = $("#savePageForm1").getData();
                if(param.finishCount > 0){
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
                $('#savePageForm1').form('clear');
            }
        });
    }


}

