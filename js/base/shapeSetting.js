/**
 * 初始化数据
 */
let loadUrl = '/baseShape/list';
let submitUrl = '/baseShape/update';
    let dictArr = [];
    let allDict = {};
    /**
     * 初始化
     */
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
            field: 'shape',
            title: '形状',
            width: 200,
            align: 'center'
        }, {
            field: 'coefficient',
            title: '形状系数',
            width: 200,
            align: 'left'
        }, {
            field: 'englishName',
            title: '英文名',
            width: 300,
            align: 'left'
        }, {
            field: 'chineseName',
            title: '中文名',
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
        content: url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.initData(data);
            }else{
                let obj = {};
                sonFrame.initData(obj);
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
