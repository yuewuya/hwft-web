/**
 * 初始化数据
 */
let loadUrl = '/dict/dictInfoQuery';
let submitUrl = '/dict/updateInfoQuery';
let dictArr = [{typeCode: 'IS_FIX'}];
let allDict = {};
let typeId = null;

/**
 * 初始化表单
 */
function initData(row) {
    typeId = row.id;
    console.log(row.id);
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable(typeId);
        });
    } else {
        initTable(typeId);
    }
}

/**
 * 加载表格数据
 */
function initTable(id) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        queryParams: {
            id: id
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
            field: 'infoId',
            title: '排序',
            width: 100,
            align: 'center'
        }, {
            field: 'info',
            title: '选项',
            width: 200,
            align: 'center'
        }, {
            field: 'infoCode',
            title: '选项代码',
            width: 200,
            align: 'left'
        }, {
            field: 'isFix',
            title: '可以修改',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'IS_FIX', value);
            }
        }, {
            field: 'createUser',
            title: '创建用户',
            width: 100,
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
    $('#dg').datagrid('reload', {id: typeId});
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
        area: ['60%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(data);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                obj.typeId = typeId;
                ajaxSubmit(submitUrl, obj);
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}

function getFormData(){
    return null;
}
