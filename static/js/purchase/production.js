/**
 * 初始化数据
 */
let loadUrl = '/purchase/production/findAll';
let submitUrl = '/purchase/production/save';
let dictArr = [{typeCode: 'PURCHASE_STATUS'}];
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
            field: 'ck',
            checkbox: true
        }, {
            field: 'applyDepart',
            title: '需求部门',
            width: 200,
            align: 'center'
        }, {
            field: 'applyGoods',
            title: '需求物品',
            width: 200,
            align: 'center'
        }, {
            field: 'applyTime',
            title: '请购时间',
            width: 150,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'applyNum',
            title: '需求数量',
            width: 100,
            align: 'center'
        }, {
            field: 'createName',
            title: '申请人',
            width: 100,
            align: 'center'
        }, {
            field: 'createTime',
            title: '时间',
            width: 150,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'status',
            title: '状态',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'PURCHASE_STATUS', value);
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
                ajaxPostInvoke('/purchase/production/findOne', {id: data.id}, function (res) {
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
