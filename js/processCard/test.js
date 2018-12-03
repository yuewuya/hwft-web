/**
 * 初始化数据
 */
let loadUrl = '/processCard/test/findAll';
let submitUrl = '/processCard/test/save';
let findByIdUrl = '/processCard/test/findOne';
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
        queryParams: {type:2},
        columns: [[{
            field: 'shape',
            title: '形状',
            width: 150,
            align: 'center'
        }, {
            field: 'productNumber',
            title: '产品编号',
            width: 150,
            align: 'center'
        }, {
            field: 'sampleNumber',
            title: '样式编号',
            width: 100,
            align: 'center'
        }, {
            field: 'commUnit',
            title: '委托单位',
            width: 150,
            align: 'center'
        }, {
            field: 'clientPerson',
            title: '委托人',
            width: 100,
            align: 'center'
        }, {
            field: 'commTime',
            title: '委托时间',
            width: 150,
            align: 'center',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'status',
            title: '状态',
            width: 100,
            align: 'center',
            formatter: function (value, row) {

                return value == 1 ? "已提交" : (value == 2 ? "仓库已填写" : "理化已填写");
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
    let obj = $('#searchForm').getData();
    $('#dg').datagrid('reload', obj);
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
            if(data && data != null){
                ajaxPostInvoke(findByIdUrl, {id : data.id}, function (res) {
                    sonFrame.initData(res);
                })
            }else {
                sonFrame.initData();
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj && obj != null) {
                ajaxSubmit(submitUrl, obj);
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}
