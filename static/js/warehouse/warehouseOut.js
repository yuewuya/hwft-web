/**
 * 初始化数据
 */
let loadUrl = '/warehouse/material/outList';
let submitUrl = '/warehouse/material/outUpdate';
let dictArr = [{typeCode: 'MATERIAL_TYPE'}, {typeCode: 'OUT_WAREHOUSE_TYPE'}];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
            setDictOptionKey(['operationType'], 'OUT_WAREHOUSE_TYPE');
            setDictOptionKey(['materialType'], 'MATERIAL_TYPE');
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
            field: 'ck',
            checkbox: true
        }, {
            field: 'storage',
            title: '入库号',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return 'B' + value;
            }
        }, {
            field: 'singleNum',
            title: '单件号',
            width: 100,
            align: 'center'
        }, {
            field: 'materialType',
            title: '材料类型',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'MATERIAL_TYPE', value);
            }
        }, {
            field: 'operationType',
            title: '操作类型',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'OUT_WAREHOUSE_TYPE', value);
            }
        }, {
            field: 'deliveryUnitName',
            title: '供应商',
            width: 150,
            align: 'left'
        }, {
            field: 'steelGrade',
            title: '刚种',
            width: 150,
            align: 'left'
        }, {
            field: 'materialName',
            title: '材质',
            width: 150,
            align: 'left'
        }, {
            field: 'length',
            title: '长度',
            width: 100,
            align: 'left'
        }, {
            field: 'width',
            title: '宽度',
            width: 100,
            align: 'left'
        }, {
            field: 'thickness',
            title: '厚度',
            width: 100,
            align: 'left'
        }, {
            field: 'nums',
            title: '数量',
            width: 100,
            align: 'left'
        }, {
            field: 'stock',
            title: '库存',
            width: 100,
            align: 'left'
        }, {
            field: 'theoryWeight',
            title: '理论重量',
            width: 100,
            align: 'left'
        }, {
            field: 'weight',
            title: '重量',
            width: 100,
            align: 'left'
        }, {
            field: 'amount',
            title: '金额',
            width: 100,
            align: 'left'
        }, {
            field: 'batchNumber',
            title: '炉批号',
            width: 100,
            align: 'left'
        }, {
            field: 'place',
            title: '产地',
            width: 150,
            align: 'left'
        }, {
            field: 'outTime',
            title: '操作日期',
            width: 150,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
            }
        }, {
            field: 'remark',
            title: '备注',
            width: 200,
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
    let obj = $('#searchForm').getData();
    obj.opertorTime1 = "" == obj.opertorTime1 ? null : moment(obj.opertorTime1).format("YYYY-MM-DD HH:mm:ss");
    obj.opertorTime2 = obj.opertorTime2 == "" ? null : moment(obj.opertorTime2).format("YYYY-MM-DD HH:mm:ss");
    console.log(obj);
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
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.initData(data);
            } else {
                sonFrame.initData(null);
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



