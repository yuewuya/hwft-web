/**
 * 初始化数据
 */
let loadUrl = '/ware/partsOut/findAll';
let submitUrl = '/ware/partsOut/save';
let findByIdUrl = '/ware/partsOut/findOne';
let dictArr = [{typeCode: 'OPERATION_TYPE'},{typeCode: 'WAREHOUSE_TYPE'},{typeCode: 'PARTS_TYPE'},{typeCode: 'OUT_WAREHOUSE_TYPE'}];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            setDictOptionKey(['bjlb1'], 'PARTS_TYPE');
            setDictOptionKey(['czlx1'], 'OPERATION_TYPE');
            setDictOptionKey(['cklx1'], 'WAREHOUSE_TYPE');
            setDictOptionKey(['czlx2'], 'OUT_WAREHOUSE_TYPE');
            initTable();
        });
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
            field: 'partsInNum',
            title: '入库号',
            width: 150,
            align: 'center'
        }, {
            field: 'singleNum',
            title: '单件号',
            width: 80,
            align: 'center'
        },{
            field: 'optType',
            title: '操作类型',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'OUT_WAREHOUSE_TYPE', value);
            }
        },{
            field: 'partsType',
            title: '部件类型',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'PARTS_TYPE', value);
            }
        }, {
            field: 'partsName',
            title: '品名',
            width: 100,
            align: 'center'
        },{
            field: 'partsCode',
            title: '牌号',
            width: 100,
            align: 'center'
        }, {
            field: 'partsSpecification',
            title: '规格',
            width: 100,
            align: 'center'
        },  {
            field: 'inAmount',
            title: '进价',
            width: 100,
            align: 'center'
        }, {
            field: 'nums',
            title: '取出数量',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value + row.unit;
            }
        }, {
            field: 'warehouseType',
            title: '仓库',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'WAREHOUSE_TYPE', value);
            }
        }, {
            field: 'companyName',
            title: '进货单位',
            width: 150,
            align: 'center'
        }, {
            field: 'createTime',
            title: '出库日',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return value == null ? "--" : moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'createName',
            title: '操作员',
            width: 100,
            align: 'center'
        },{
            field: 'remark',
            title: '备注',
            width: 120,
            align: 'center'
        }
        ]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search(data) {
    if (data && data != null){
        $('#dg').datagrid('reload', data);
    }else {
        let obj = $('#searchForm').getData();
        $('#dg').datagrid('reload', obj);
    }
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, data) {
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', "500px"],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                ajaxPostInvoke(findByIdUrl, {id:data.id}, function (res) {
                    $("#stockNums").val(res.stockNums);
                    $('#savePageForm').form('load',res);

                })
            }
        },
        yes: function (index, layero) {
            let data = getSavePageData();
            if(data && data != null){
                ajaxSubmit(submitUrl, data);
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

function initData(data) {
    $("#savePageForm").form("load",data)
}

function getSavePageData() {
    if(!$("#savePageForm").form('validate')){
        layer.msg("请先输入相关数据")
        return null;
    }else{
        let data = $("#savePageForm").getData();
        if (data.stockNums > stockNums){
            layer.msg("出库数量不能大于库存数量")
            return null;
        }
        return data;
    }
}

