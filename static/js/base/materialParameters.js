/**
 * 初始化数据
 */
let loadUrl = '/materialParameters/list';
let submitUrl = '/materialParameters/update';
let dictArr = [{typeCode: 'IS_DUPLEX'}, {typeCode: 'YES_OR_NO'}];
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
        pageSize: 5,
        pageList: [5, 50, 100],
        toolbar: '#toolbar',
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'updateTime',
            title: '更新时间',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
            }
        }, {
            field: 'materialName',
            title: '材料名称',
            width: 200,
            align: 'center'
        }, {
            field: 'material',
            title: '参考材质',
            width: 200,
            align: 'center'
        }, {
            field: 'proportion',
            title: '比重',
            width: 100,
            align: 'left'
        }, {
            field: 'species',
            title: '种类',
            width: 100,
            align: 'left'
        }, {
            field: 'steelGrade',
            title: '钢种',
            width: 100,
            align: 'left'
        }, {
            field: 'coefficient',
            title: '系数',
            width: 100,
            align: 'left'
        }, {
            field: 'scrapPrice',
            title: '废材价格',
            width: 100,
            align: 'left'
        }, {
            field: 'duplex',
            title: '是否双相钢',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'IS_DUPLEX', value);
            }
        }, {
            field: 'utilizationRate',
            title: '利用率',
            width: 100,
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
    let data = $("#searchData").val();
    let select = $("#SearchChoose").val();
    let obj = {};
    obj[select] = data;
    obj.page = 1;
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
            if (data) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(data);
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

/**
 * 打开材料设置窗口
 */
function openSetting(title, url){
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '90%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                obj.materialId = obj.id;
                delete obj.id;
                initData(obj);
                layer.closeAll();
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}
