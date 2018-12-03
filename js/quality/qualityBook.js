/**
 * 初始化数据
 */
let loadUrl = '/quality/book/list';
let submitUrl = '/quality/book/update';
let dictArr = [];
//let dictArr = [{typeCode: 'RFQ_STATUS'}];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
            //setDictOptionKey(['rfq_status'], 'RFQ_STATUS');
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
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'orderNo',
            title: '质保编号',
            width: 100,
            align: 'left'
        }, {
            field: 'code',
            title: '指令号',
            width: 120,
            align: 'left'
        }, {
            field: 'createUserName',
            title: '操作员',
            width: 100,
            align: 'left'
        }, {
            field: 'createTime',
            title: '制作日',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (value == '' || value == null) {
                    return '';
                }
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'shape',
            title: '形状',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.shape;
            }
        }, {
            field: 'material',
            title: '材质',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.material;
            }
        }, {
            field: 'diameterStandard',
            title: '直径内外',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.diameterStandard == 1 ? '内直径' : '外直径';
            }
        }, {
            field: 'diameter',
            title: '直径',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.diameter;
            }
        }, {
            field: 'thickness',
            title: '壁厚',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.thickness;
            }
        }, {
            field: 'straightEdge',
            title: '直边',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.straightEdge;
            }
        }, {
            field: 'bigR',
            title: '大R',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.bigR;
            }
        }, {
            field: 'height',
            title: '总高',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.height;
            }
        }, {
            field: 'count',
            title: '数量',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.count;
            }
        }, {
            field: 'manufacture',
            title: '制造标准',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.manufacture;
            }
        }, {
            field: 'groove',
            title: '坡口',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.groove;
            }
        }, {
            field: 'processingMethod',
            title: '加工方法',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.processingMethod;
            }
        }, {
            field: 'hostType',
            title: '主机种',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.hostType;
            }
        }, {
            field: 'min',
            title: '最小壁厚',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (row.parameter == '' || row.parameter == null) {
                    return '';
                }
                return row.parameter.min;
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
        area: ['90%', '90%'],//width,height
        content: getRootPath() + url,
        btn: ['提交', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.init(data.id);
            }else{
                sonFrame.init(null);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}



