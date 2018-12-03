/**
 * 初始化数据
 */
let loadUrl = '/productionInput/conformityReport/findAll';
let submitUrl = '/productionInput/conformityReport/save';
let findByIdUrl = '/productionInput/conformityReport/findOne';
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
        columns: [[{
            field: 'code',
            title: '指令号',
            width: 120,
            align: 'center'
        }, {
            field: 'material',
            title: '材质',
            width: 150,
            align: 'center'
        }, {
            field: 'reportPerson',
            title: '报告人',
            width: 100,
            align: 'center'
        }, {
            field: 'specification',
            title: '规格',
            width: 150,
            align: 'center'
        }, {
            field: 'heatNo',
            title: '炉批号',
            width: 100,
            align: 'center'
        }, {
            field: 'createName',
            title: '填写人',
            width: 100,
            align: 'center'
        }, {
            field: 'createTime',
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
                if(value == 1) return "已填写";
                else if(value == 2) return "质检部已提交";
                else if(value == 3) return "技术部已审核";
                else if(value == 4) return "生产部已批准";
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
function approveSign(title, url) {
    let data = getSelections();
    if(data && data != null){
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
                sonFrame.initData(data);
            },
            yes: function (index, layero) {
                let obj = window[layero.find('iframe')[0]['name']].getFormData();
                if (obj && obj != null) {
                    ajaxSubmit(submitUrl, obj);
                }
            },
            btn2: function () {
                layer.closeAll();
            },
            end:function () {
                search()
            }
        });
    }
}