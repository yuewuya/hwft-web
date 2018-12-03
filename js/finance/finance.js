/**
 * 初始化数据
 */
let loadUrl = '/finance/list';
let submitUrl = '/finance/saveCompany';
let dictArr = [];
let allDict = {};
$(function () {
    initYear();
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
        pagination: false,
        showFooter: true,
        fitColumns: false,
        pageSize: 100,
        pageList: [20, 50, 100],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'ywy',
            title: '业务员',
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
        }, {
            field: 'ywyId',
            title: '操作',
            width: 200,
            align: 'left',
            formatter: function (value, row) {
                if(value==null || value==''){
                    return '';
                }
                return '<a href="#" onClick="openYwy( '+value+')">查看</a>&nbsp;&nbsp;' +
                    '<a href="#" onClick="addCompany(' + value +')">新增单位</a>'
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
    let obj = {};
    obj.kpsj = $("#year").combobox('getValue');
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}
function openYwy(ywyId) {
    layer.open({
        type: 2,
        title: '应收款明细账',
        fix: false,
        shadeClose: true,
        area: ['100%', '100%'],//width,height
        content: getRootPath() + '/finance/financeCompany.html',
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            sonFrame.initData(ywyId);
        }
    });
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

function addCompany(ywyId) {
    let index = layer.open({
        type: 1,
        title: '新增 业务单位',
        fix: false,
        shadeClose: true,
        area: ['800px', '400px'],//width,height
        content: $('#savePage'),
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let obj = new Object();
            if($('#name').val()==''){
                layer.alert("请完善表单数据！",{icon: 2});
                return ;
            }
            obj.name = $('#name').val();
            obj.salesmanId = ywyId;
            ajaxSubmit(submitUrl, obj);
        },
        end:function () {
            $('#savePageForm').form('clear');
            layer.close(index);
        }
    });
}


