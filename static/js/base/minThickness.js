/**
 * 初始化数据
 */
const loadUrl = '/minThickness/findAll';
const submitUrl = '/minThickness/save';
let dictArr = [{typeCode: 'STEELGRADE'},{typeCode: 'SHAPE'},{typeCode: 'PROCESSING'}];
let allDict = {};
$(function(){
    initTable();
    ajaxDictQuery(dictArr, function (data) {
        allDict = data;
        setDictOption(['steelGrade1','steelGrade2'], 'STEELGRADE');
        setDictOption(['shape1','shape2'], 'SHAPE');
        setDictOption(['processing1'], 'PROCESSING');
    });
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
            field: 'shape',
            title: '形状',
            align: 'center',
            width: '200'
        }, {
            field: 'diameter1',
            title: '最小直径',
            align: 'center',
            width: '100'
        }, {
            field: 'diameter2',
            title: '最大直径',
            align: 'center',
            width: '100'
        }, {
            field: 'diameterInout',
            title: '直径内外',
            align: 'center',
            width: '100'
        }, {
            field: 'wallThickness',
            title: '壁厚',
            align: 'center',
            width: '100'
        }, {
            field: 'steelGrade',
            title: '钢种',
            align: 'center',
            width: '200'
        }, {
            field: 'processingMethod',
            title: '加工方法',
            align: 'center',
            width: '200'
        }, {
            field: 'minwallThickness',
            title: '最小壁厚',
            align: 'center',
            width: '100'
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
        area: ['800px', '400px'],//width,height
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
    if(!$("#savePageForm").form('validate')){
        layer.alert("请完善表单数据！",{icon: 2});
        return null;
    }else{
        return $('#savePageForm').getData();
    }
}

function initData(data) {
    $('#savePageForm').form('load', data);
}

function search() {
    let obj = $("#searchForm").getData();
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}
