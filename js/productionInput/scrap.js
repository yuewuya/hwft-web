/**
 * 初始化数据
 */
let loadUrl = '/productionInput/scrap/findAll';
let submitUrl = '/productionInput/scrap/save';
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
            field: 'number',
            title: '不良品编号',
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
            field: 'address',
            title: '发现场所',
            width: 100,
            align: 'center'
        }, {
            field: 'department',
            title: '责任部门',
            width: 100,
            align: 'center'
        }, {
            field: 'source',
            title: '材料来源',
            width: 100,
            align: 'center'
        }, {
            field: 'count',
            title: '数量',
            width: 80,
            align: 'center'
        }, {
            field: 'dp',
            title: '代品',
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
            field: 'createName',
            title: '制作人',
            width: 100,
            align: 'center'
        }, {
            field: 'createTime',
            title: '制作日',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
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
        area: ['1000px', '500px'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.initData(data);
            } else {
                ajaxPostInvoke("/productionInput/scrap/findNextNumber", {}, function(res){
                    sonFrame.initData({number: res, createName: getUserInfo().username, createTime: moment().format("YYYY-MM-DD HH:mm:ss")});
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