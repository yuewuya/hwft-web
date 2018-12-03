/**
 * 初始化数据
 */
let loadUrl = '/processCard/ftCard/findAll';
let submitUrl = '/processCard/ftCard/save';
let findByIdUrl = '/processCard/ftCard/findOne';
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
    let mContentHeight = mWindHeight - 150;
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
            field: 'shape',
            title: '形状',
            width: 100,
            align: 'center'
        }, {
            field: 'material',
            title: '材质',
            width: 100,
            align: 'center'
        }, {
            field: 'diameter',
            title: '直径',
            width: 100,
            align: 'center'
        }, {
            field: 'thickness',
            title: '壁厚',
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
            field: 'heatTreatment',
            title: '热处理',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 0 ? "不需要" : "需要";
            }
        }, {
            field: 'boardPerformance',
            title: '试板性能',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 0 ? "不需要" : "需要";
            }
        }, {
            field: 'detection',
            title: '监检',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 0 ? "不需要" : "需要";
            }
        }, {
            field: 'materialRetest',
            title: '材料复验',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 0 ? "不需要" : "需要";
            }
        }, {
            field: 'noticeNumber',
            title: '通知单号',
            width: 100,
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
            if (obj.status && obj.status == 1){
                layer.msg("已审核无法修改");
            }else{
                if (obj) {
                    let szb = obj.straightEdge && obj.straightEdge != 0 ? true : false;
                    let xzb = obj.downStraight && obj.downStraight != 0 ? true : false;
                    if(pdzt(obj.shape)){
                        obj.ztBottomId = obj.coneAngle < 60 ? "sb" : (obj.coneAngle == 60 ? "mb" : "lb");
                        obj.ztTopId = szb && xzb ? "sxzb" : (szb && ! xzb ? "szb" : (!szb && xzb ? "xzb" : "wzb"));
                    }
                    ajaxSubmit(submitUrl, obj);
                }
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}
