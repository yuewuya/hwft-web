/**
 * 初始化数据
 */
let loadUrl = '/log/work/findAll';
let submitUrl = '/log/work/save';
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
    $("#dg1").datagrid({
        width: '98%',
        height: "370px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 10,
        pageList: [10, 20, 50],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams: {status: 1},
        columns: [[{
            field: 'createName',
            title: '发送人',
            width: "18%",
            align: 'center'
        }, {
            field: 'createTime',
            title: '发送时间',
            width: "35%",
            align: 'center'
        }, {
            field: 'createInfo',
            title: '待处理信息',
            width: "35%",
            align: 'center'
        }, {
            field: 'status',
            title: '操作状态',
            width: "18%",
            align: 'center',
            formatter: function (value, row) {
                return "<a style='cursor: pointer;' onclick=\"openWindow('详情', '"+ row.viewLink +"', "+ row.id +",1)\">查看</a>"
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    })

    $("#dg2").datagrid({
        width: '98%',
        height: "370px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 10,
        pageList: [10, 20, 50],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams: {status: 2},
        columns: [[{
            field: 'createName',
            title: '发送人',
            width: "16%",
            align: 'center'
        }, {
            field: 'createTime',
            title: '发送时间',
            width: "24%",
            align: 'center'
        }, {
            field: 'createInfo',
            title: '待处理信息',
            width: "24%",
            align: 'center'
        }, {
            field: 'receiverHandleDate',
            title: '查看时间',
            width: "24%",
            align: 'center'
        }, {
            field: 'status',
            title: '操作状态',
            width: "16%",
            align: 'center',
            formatter: function (value, row) {
                return "<a style='cursor: pointer;' onclick=\"openWindow('详情', '"+ row.viewLink +"', "+ row.id +",2)\">已查看</a>"
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    })

    $("#dg3").datagrid({
        width: '98%',
        height: "370px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 10,
        pageList: [10, 20, 50],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams: {status: 3},
        columns: [[{
            field: 'createName',
            title: '发送人',
            width: "16%",
            align: 'center'
        }, {
            field: 'createTime',
            title: '发送时间',
            width: "24%",
            align: 'center'
        }, {
            field: 'createInfo',
            title: '待处理信息',
            width: "24%",
            align: 'center'
        }, {
            field: 'receiverHandleDate',
            title: '处理时间',
            width: "24%",
            align: 'center'
        }, {
            field: 'status',
            title: '操作状态',
            width: "16%",
            align: 'center',
            formatter: function (value, row) {
                return "<a style='cursor: pointer;' onclick=\"openWindow('详情', '"+ row.viewLink +"', "+ row.id +",3)\">已办理</a>"
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    })
}

/**
 * 搜索
 */
function search() {
    $('#dg1').datagrid("unselectAll");
    $('#dg2').datagrid("unselectAll");
    $('#dg3').datagrid("unselectAll");
    $('#dg1').datagrid('reload');
    $('#dg2').datagrid('reload');
    $('#dg3').datagrid('reload');
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, id, status) {
        if(status == 1){
            ajaxPostInvoke("/log/work/save", {id:id}, function(res){
                search()
            })
        }
        layer.open({
            type: 2,
            title: title,
            fix: false,
            shadeClose: true,
            area: ['100%', '100%'],//width,height
            content: getRootPath() + url,
            end:function () {
                search()
            }
        });


}
