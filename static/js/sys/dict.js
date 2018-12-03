/**
 * 初始化数据
 */
let loadUrl = '/dict/dictTypeList';
let submitUrl = '/dict/dictTypeAdd';
let dictArr = [{typeCode: 'IS_FIX'}];
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
            field: 'updateTime',
            title: '创建时间',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
            }
        }, {
            field: 'type',
            title: '字典名称',
            width: 200,
            align: 'center'
        }, {
            field: 'typeCode',
            title: '字典代码',
            width: 300,
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
        area: ['70%', '70%'],//width,height
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
                ajaxSubmit(submitUrl, obj);
            }else{
                layer.closeAll();
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}

/**
 * 获取材料设置的数据
 */
function getSettingData() {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length == 1) {
        return rows[0];
    } else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });

    }
}
