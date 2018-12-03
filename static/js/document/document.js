/**
 * 初始化数据
 */
let loadUrl = '/document/list';
let submitUrl = '/document/update';
let dictArr = [];
let allDict = {};
let type = null;
/**
 * 初始化
 */
$(function () {
    type = GetQueryString("type");
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable(type);
        });
    } else {
        initTable(type);
    }
});

/**
 * 加载表格数据
 */
function initTable(type) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        queryParams: {
            type: type
        },
        width: '98%',
        height: mContentHeight,
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'title',
            title: '标题',
            width: 200,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 400,
            align: 'left'
        }, {
            field: 'updateTime',
            title: '更新时间',
            width: 300,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
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
    obj.type = type;
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
        area: ['80%', '95%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.initData(data);
            }else{
                let obj = {};
                obj.type = type;
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
