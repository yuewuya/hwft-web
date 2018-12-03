/**
 * 初始化数据
 */
let loadUrl = '/infiltration/list';
let submitUrl = '/infiltration//update';
//let dictArr = [{typeCode: 'CHEMICAL_TYPE_KIND'}];
let dictArr = [];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
            //setDictOptionKey(['rfq_status'], 'RFQ_STATUS');
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
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        },{
            field: 'reportNo',
            title: '报告编号',
            width: 100,
            align: 'left'
        }, {
            field: 'code',
            title: '产品编号',
            width: 100,
            align: 'left'
        }, {
            field: 'site',
            title: '检测部位',
            width: 100,
            align: 'left'
        }, {
            field: 'penetrantType',
            title: '渗透剂种类',
            width: 100,
            align: 'left'
        }, {
            field: 'applyUser',
            title: '操作员',
            width: 100,
            align: 'left'
        }, {
            field: 'examineUser',
            title: '审核员',
            width: 100,
            align: 'left'
        }]]
    });
}

/**
 * 搜索
 */
function search() {
    $('#dg').datagrid('reload', $('#searchForm').getData());
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
        area: ['90%', '90%'],//width,height
        content: getRootPath() + url,
        btn: ['提交', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.init(data.id);
            } else {
                sonFrame.init(null);
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





