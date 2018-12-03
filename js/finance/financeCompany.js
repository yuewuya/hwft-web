/**
 * 初始化数据
 */
let loadUrl = '/finance/ywyList';
let submitUrl = '/finance/financeUpdate';
let updateCompany = '/finance/saveCompany';
let deleteCompany = '/finance/delCompany';
let dictArr = [];
let allDict = {};
$(function () {
    initYear();
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
        });
    }
});

/**
 * 加载表格数据
 */
function initTable() {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#tt").datagrid({
        width: '98%',
        height: mContentHeight,
        singleSelect: true,
        autoRowHeight: false,
        rownumbers: true,
        pagination: false,
        showFooter: true,
        fitColumns: false,
        pageSize: 100,
        pageList: [20, 50, 100],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams:{ywyId:$('#ywyId').val()},
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'company',
            title: '业务单位',
            width: 200,
            align: 'center'
        }, {
            field: 'whsje',
            title: '应收款',
            width: 150,
            align: 'left'
        }, {
            field: 'fpje',
            title: '销售额',
            width: 150,
            align: 'left'
        }, {
            field: 'yshje',
            title: '回笼额',
            width: 150,
            align: 'left'
        }, {
            field: 'jx',
            title: '利息',
            width: 150,
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
    let obj = {};
    obj.kpsj = $("#year").combobox('getValue');
    obj.page = 1;
    obj.ywyId = $('#ywyId').val();
    $('#tt').datagrid('reload', obj);
}
function openFinance() {
    let rows = $('#tt').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {icon: 2});
    }else{
        layer.open({
            type: 2,
            title: '详情',
            fix: false,
            shadeClose: true,
            area: ['100%', '100%'],//width,height
            content: getRootPath() + '/finance/financeShow.html',
            success: function (layero, index) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(rows[0].companyId,$('#ywyId').val(),rows[0].company);
            }
        });
    }

}


function initYear() {
    let opts = [{id: '', text: '请选择'}];
    ajaxPostInvoke('/finance/getYears', {}, function (data) {
        $.each(data, function(i, value) {
            opts.push({id: value, text: value});
        });
        $("#year").combobox("loadData", opts);
    });

}

function addFinance() {
    let rows = $('#tt').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {icon: 2});
    }else{
        let index = layer.open({
            type: 1,
            title: '修改 业务单位',
            fix: false,
            shadeClose: true,
            area: ['800px', '400px'],//width,height
            content: $('#saveYwPage'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                $('#company').val(rows[0].company);
            },
            yes: function (index, layero) {
                let obj = getFormData();
                if (obj) {
                    obj.companyId = rows[0].companyId;
                    obj.company = rows[0].company;
                    obj.ywyId = $('#ywyId').val();
                    ajaxSubmit(submitUrl, obj);
                }
                console.log(obj);
            },
            end:function () {
                $('#saveYwForm').form('clear');
                layer.close(index);
            }
        });
    }
}

function editCompany(){
    let rows = $('#tt').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {icon: 2});
    }else{
        let index = layer.open({
            type: 1,
            title: '修改 业务单位',
            fix: false,
            shadeClose: true,
            area: ['800px', '400px'],//width,height
            content: $('#savePage'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                $('#name').val(rows[0].company);
            },
            yes: function (index, layero) {
                let obj = new Object();
                if($('#name').val()==''){
                    layer.alert("请完善表单数据！",{icon: 2});
                    return ;
                }
                obj.name = $('#name').val();
                obj.id = rows[0].companyId;
                ajaxSubmit(updateCompany, obj);
            },
            end:function () {
                $('#savePageForm').form('clear');
                layer.close(index);
            }
        });
    }
}

function delCompany() {
    let rows = $('#tt').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {icon: 2});
    }else{
        layer.confirm('删除单位会删除单位相关业务，确认删除吗？', function(index){
            let obj = new Object();
            obj.id = rows[0].companyId;
            ajaxSubmit(deleteCompany, obj);
            layer.close(index);
        });
    }

}