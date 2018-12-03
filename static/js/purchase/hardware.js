/**
 * 初始化数据
 */
let loadUrl = '/purchase/hardware/list';
let submitUrl = '/purchase/hardware/update';
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
            field: 'ck',
            checkbox: true
        }, {
            field: 'applyTime',
            title: '请购时间',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年 MM月 DD日");
            }
        }, {
            field: 'partsType',
            title: '部件类别',
            width: 200,
            align: 'center'
        }, {
            field: 'partsName',
            title: '品名',
            width: 100,
            align: 'left'
        }, {
            field: 'nums',
            title: '申请数量',
            width: 100,
            align: 'left'
        }, {
            field: 'unit',
            title: '申请单位',
            width: 100,
            align: 'left'
        }, {
            field: 'status',
            title: '申请状态',
            width: 150,
            align: 'left'
        }, {
            field: 'dealMan',
            title: '处理人员或部门',
            width: 250,
            align: 'left',
            formatter: function (value, row) {
                return row.chooseType == 1 ? row.dealDepartment : row.dealMan;
            }
        }, {
            field: 'remark',
            title: '备注',
            width: 300,
            align: 'left'
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search() {
    $('#dg').datagrid('reload', $("#searchForm").getData());
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
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                ajaxPostInvoke('/purchase/hardware/findOne', {id: data.id}, function (res) {
                    sonFrame.initData(res);
                })
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}
