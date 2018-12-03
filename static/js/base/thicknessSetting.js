/**
 * 初始化数据
 */
let loadUrl = '/thickness/list';
let submitUrl = '/thickness/update';
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
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'thickness',
            title: '厚度(毫米)',
            width: 100,
            align: 'center'
        }, {
            field: 'handWeldingDes',
            title: '手焊说明',
            width: 300,
            align: 'left'
        }, {
            field: 'plaDes',
            title: '等离子焊说明',
            width: 300,
            align: 'left'
        }, {
            field: 'arcWeldingDes',
            title: '埋弧焊说明',
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
    let thickness = $('#searchForm').getData().thickness;
    if(!regular.posPattern.test(thickness) && thickness != ''){
        layer.alert("必须为数字！", {
            icon: 2
        });
        return;
    }
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
        area: ['100%', '100%'],//width,height
        content: getRootPath() + url,
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
