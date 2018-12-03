/**
 * 初始化数据
 */
let loadUrl = '/hjMethod/findAll';
let submitUrl = '/hjMethod/save';
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
        columns: [[
        {
            field: 'method',
            title: '焊接方法',
            width: 100,
            align: 'center'
        }, {
            field: 'arrangement',
            title: '层次',
            width: 100,
            align: 'center'
        }, {
            field: 'vcc',
            title: '电源',
            width: 100,
            align: 'center'
        }, {
            field: 'hc',
            title: '焊材',
            width: 100,
            align: 'center'
        }, {
            field: 'specification',
            title: '规格',
            width: 100,
            align: 'center'
        }, {
            field: 'i',
            title: '电流',
            width: 100,
            align: 'center'
        }, {
            field: 'u',
            title: '电压',
            width: 100,
            align: 'center'
        }, {
            field: 'speed',
            title: '速度',
            width: 100,
            align: 'center'
        }, {
            field: 'arrangementTemperature',
            title: '层间温度',
            width: 100,
            align: 'center'
        }, {
            field: 'wjDiameter',
            title: '钨极直径',
            width: 100,
            align: 'center'
        }, {
            field: 'pzDiameter',
            title: '喷嘴直径',
            width: 100,
            align: 'center'
        }, {
            field: 'flow',
            title: '气体流量',
            width: 100,
            align: 'center'
        }, {
            field: 'energy',
            title: '线能量',
            width: 100,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 150,
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
    let param = $("#searchForm").getData();
    $('#dg').datagrid('reload', param);
}

function initData(data) {
    $('#savePageForm').form('load', data);
}

function getFormData() {
    if(!$("#savePageForm").form('validate')){
        layer.alert("请完善表单数据！",{icon: 2});
        return null;
    }else{
        return $('#savePageForm').getData();
    }
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, id, data) {
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', '520px'],//width,height
        content: $('#'+id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                initData(data);
            }
        },
        yes: function (index, layero) {
            let obj = getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
            }
        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            $('#savePageForm').form('clear');
        }
    });
}

