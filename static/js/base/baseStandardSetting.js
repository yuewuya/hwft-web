/**
 * 初始化数据
 */
const loadUrl = '/baseStandard/findAll';
const submitUrl = '/baseStandard/saveBaseStandard';

$(function(){
    initTable();
})
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
            field: 'standard',
            title: '标准',
            align: 'center',
            width: '400'
        }, {
            field: 'type',
            title: '类别',
            align: 'center',
            width: '200'
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
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
        area: ['600px', '250px'],//width,height
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
            $('#saveStandardForm').form('clear');
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

function getFormData() {
    if(!$("#saveStandardForm").form('validate')){
        layer.alert("请完善表单数据！",{icon: 2});
        return null;
    }else{
        return $('#saveStandardForm').getData();
    }
}

function initData(data) {
    $('#saveStandardForm').form('load', data);
}

function search() {
    let obj = {};
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}
