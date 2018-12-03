/**
 * 初始化数据
 */
let loadUrl = '/processCard/ftCard/findByNextProcess';
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
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'center'
        }, {
            field: 'shape',
            title: '形状',
            width: 100,
            align: 'center'
        }, {
            field: 'material',
            title: '材质',
            width: 100,
            align: 'center'
        }, {
            field: 'diameter',
            title: '直径',
            width: 100,
            align: 'center'
        }, {
            field: 'thickness',
            title: '壁厚',
            width: 100,
            align: 'center'
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
    $("#dg").datagrid("reload", obj)
}
