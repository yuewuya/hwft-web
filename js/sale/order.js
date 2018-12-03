/**
 * 初始化数据
 */
let loadUrl = '/sale/order/findAll';
let submitUrl = '/sale/order/save';
let findByIdUrl = '/sale/order/findOne';
let dictArr = [{typeCode: 'ORDER_STATUS'},{typeCode: 'SALE_SITUATION'}];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            setDictOptionKey(['orderStatus'], 'ORDER_STATUS');
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
            field: 'orderNum',
            title: '订单编号',
            width: 120,
            align: 'center'
        }, {
            field: 'orderDate',
            title: '订货日期',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return value == null ? "--" : moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'customer',
            title: '客户',
            width: 250,
            align: 'center'
        }, {
            field: 'department',
            title: '部门',
            width: 100,
            align: 'center'
        }, {
            field: 'responsibility',
            title: '担当',
            width: 100,
            align: 'center'
        }, {
            field: 'saleForm',
            title: '销售形式',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'SALE_SITUATION', value);
            }
        }, {
            field: 'state',
            title: '状态',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'ORDER_STATUS', value);
            }
        }, {
            field: 'createTime',
            title: '制作日',
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
            field: 'approveTime',
            title: '审核日',
            width: 120,
            align: 'center',
            formatter: function (value, row) {
                return value == null ? "--" : moment(value).format("YYYY年MM月DD日");
            }
        },{
            field: 'approveName',
            title: '审核员',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == null || value == "" ? "--" : value;
            }
        },{
            field: 'amount',
            title: '合计金额',
            width: 100,
            align: 'center'
        },
        ]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search(data) {
    if(data && data != null){
        $('#dg').datagrid('reload', data);
    }else{
        let obj = $('#searchForm').getData();
        if(obj.searchValue && obj.searchValue != ''){
            obj[obj.searchKey] = obj.searchValue;
        }
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
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['90%', "700px"],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                let orderId = data.id;
                sonFrame.initTable(orderId);
                ajaxPostInvoke(findByIdUrl, {id:orderId}, function (data) {
                    sonFrame.initData(data);
                })
            }else{
                sonFrame.initTable(0);
                ajaxPostInvoke('/sale/order/findNextOrderNum', {}, function (data) {
                    sonFrame.initData({orderNum:data});
                })
            }
        },
        yes: function (index, layero) {
            let sonFrame = window[layero.find('iframe')[0]['name']];
            let data = sonFrame.getFormData();
            if(data && data != null){
                ajaxPostInvoke(submitUrl, data, function (result) {

                    let orderId = result.id;
                    sonFrame.initTable(orderId);
                    sonFrame.initData(result);

                    layer.confirm('保存成功,退出编辑页面？',function(index){
                        layer.closeAll();
                    })
                    search();
                })
            }
        },
        btn2: function () {
            layer.closeAll();
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

