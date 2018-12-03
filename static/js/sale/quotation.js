/**
 * 初始化数据
 */
let loadUrl = '/sale/rfq/productList';
let submitUrl = '/sale/quotation/update';
let cancelUrl = '/sale/quotation/cancel';
let dictArr = [{typeCode: 'RFQ_STATUS'}];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
            setDictOptionKey(['rfq_status'], 'RFQ_STATUS');
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
        queryParams: {
            rfqStatus: 2
        },
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
        //idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'detailStatus',
            title: '状态',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'RFQ_STATUS', value);
            }
        }, {
            field: 'numbering',
            title: '询价编号',
            width: 100,
            align: 'center'
        }, {
            field: 'singleNum',
            title: '单件号',
            width: 100,
            align: 'center'
        }, {
            field: 'customerName',
            title: '客户',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return row.rfqBean.customerName;
            }
        }, {
            field: 'inquiryDate',
            title: '询价日期',
            width: 150,
            align: 'center',
            formatter: function (value, row) {
                return row.rfqBean.inquiryDate;
            }
        }, {
            field: 'company',
            title: '公司',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return row.rfqBean.company;
            }
        }, {
            field: 'duty',
            title: '担当',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return row.rfqBean.duty;
            }
        }, {
            field: 'pricingOffer',
            title: '报价员',
            width: 100,
            align: 'center'
        }, {
            field: 'shapeName',
            title: '形状',
            width: 100,
            align: 'center'
        }, {
            field: 'materialName',
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
            field: 'num',
            title: '数量',
            width: 100,
            align: 'center'
        }, {
            field: 'materialCosts',
            title: '材料成本',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                if (row.quotationBean) {
                    return row.rfqBean.materialCosts;
                } else {
                    return "";
                }
            }
        }, {
            field: 'productionCosts',
            title: '生产成本',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                if (row.quotationBean) {
                    return row.rfqBean.productionCosts;
                } else {
                    return "";
                }
            }
        }, {
            field: 'otherCosts',
            title: '其它成本',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                if (row.quotationBean) {
                    return row.rfqBean.otherCosts;
                } else {
                    return "";
                }
            }
        }, {
            field: 'price',
            title: '总价',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                if (row.quotationBean) {
                    return row.rfqBean.price;
                } else {
                    return "";
                }
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
    obj.rfqStatus = 2;
    $('#dg').datagrid('reload',obj);
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
        btn: ['报价', '取消'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                data.business = 'quotation';
                sonFrame.initData(data);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                obj.detailStatus = 3;
                ajaxSubmit(submitUrl, obj);
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}

function cancelRfq() {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });
        return;
    }
    if(rows[0].detailStatus != 3){
        layer.alert("该数据未报价！", {
            icon: 2
        });
        return;
    }
    let obj = {};
    obj.rfqProductId = rows[0].id;
    obj.rfqId = rows[0].rfqId;
    layer.confirm('确认取消报价吗', {
        icon: 3,
        title: '提示'
    }, function () {
        ajaxSubmit(cancelUrl, obj);
    });
}


