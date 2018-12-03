/**
 * 初始化数据
 */
const loadUrl = '/processingSetting/findAll';
const submitUrl = '/processingSetting/save';

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
        queryParams:{category:1},
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'category',
            title: '类别',
            align: 'center',
            width: '150',
            formatter: function (value, row) {
                if(value == 1){
                    return '工艺卡';
                }else if(value == 2){
                    return '母材试板';
                }else if(value == 3){
                    return '焊接试板';
                }
            }
        }, {
            field: 'process',
            title: '工序',
            align: 'center',
            width: '150'
        }, {
            field: 'peoples',
            title: '人数',
            align: 'center',
            width: '100'
        }, {
            field: 'description1',
            title: '说明1',
            align: 'center',
            width: '200'
        }, {
            field: 'description2',
            title: '说明2',
            align: 'center',
            width: '200'
        }, {
            field: 'description3',
            title: '说明3',
            align: 'center',
            width: '200'
        }, {
            field: 'description4',
            title: '说明4',
            align: 'center',
            width: '200'
        }, {
            field: 'machine1',
            title: '机器1',
            align: 'center',
            width: '100'
        }, {
            field: 'machine2',
            title: '机器2',
            align: 'center',
            width: '100'
        }, {
            field: 'machine3',
            title: '机器3',
            align: 'center',
            width: '100'
        }, {
            field: 'machine4',
            title: '机器4',
            align: 'center',
            width: '100'
        }, {
            field: 'machine5',
            title: '机器5',
            align: 'center',
            width: '100'
        }, {
            field: 'machine6',
            title: '机器6',
            align: 'center',
            width: '100'
        }, {
            field: 'machine7',
            title: '机器7',
            align: 'center',
            width: '100'
        }, {
            field: 'machine8',
            title: '机器8',
            align: 'center',
            width: '100'
        }, {
            field: 'machine9',
            title: '机器9',
            align: 'center',
            width: '100'
        }, {
            field: 'processingNum',
            title: '加工数量',
            align: 'center',
            width: '150'
        }, {
            field: 'processingWeight',
            title: '加工重量',
            align: 'center',
            width: '150'
        }, {
            field: 'processingLength',
            title: '加工长度',
            align: 'center',
            width: '150'
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
        area: ['1200px', '600px'],//width,height
        content: $('#'+id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                initData(data);
            }else{
                $("#choose4 option").attr("selected", false);
                $("#choose4 option[value='"+$('input[type=radio][name=category]:checked').val()+"']").attr("selected", true);
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
    let obj = {};
    obj.page = 1;
    obj.category = $('input[type=radio][name=category]:checked').val();
    $('#dg').datagrid('reload', obj);
}

$("input[type='radio'][name='category']").change(function() {
    $('#dg').datagrid("unselectAll");
    search()
});