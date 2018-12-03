/**
 * 初始化数据
 */
let loadUrl = '/periodic/findAll';
let submitUrl = '/periodic/save';
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
            field: 'planTime',
            title: '日期',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("D日");
            }
        }, {
            field: 'method',
            title: '工序',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 1 ? "冷冲压" : (value == 2 ? "热冲压" : "压鼓");
            }
        }, {
            field: 'model',
            title: '机种',
            width: 100,
            align: 'center'
        }, {
            field: 'diameterMin1',
            title: '最小直径',
            width: 100,
            align: 'center'
        }, {
                field: 'diameterMax1',
                title: '最大直径',
                width: 100,
                align: 'center'
            }, {
                field: 'diameterMin2',
                title: '最小直径',
                width: 100,
                align: 'center'
            }, {
                field: 'diameterMax2',
                title: '最大直径',
                width: 100,
                align: 'center'
            }, {
                field: 'count',
                title: '数量',
                width: 100,
                align: 'center'
            }, {
                field: 'weight',
                title: '重量',
                width: 100,
                align: 'center'
            }, {
                field: 'finishCount',
                title: '完成数量',
                width: 100,
                align: 'center'
            }, {
                field: 'finishWeight',
                title: '完成重量',
                width: 100,
                align: 'center'
            }, {
                field: 'planCount',
                title: '计划数量',
                width: 100,
                align: 'center'
            }, {
                field: 'planWeight',
                title: '计划重量',
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
    if (param.planTime && param.planTime != ''){
        param.planTime = param.planTime + "-01 00:00:00";
    }
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
            $('#savePageForm').form('reset');
        }
    });
}

