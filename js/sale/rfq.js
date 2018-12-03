/**
 * 初始化数据
 */
let loadUrl = '/sale/rfq/list';
let submitUrl = '/sale/rfq/update';
let statusChange = '/sale/rfq/statusChange';
let dictArr = [{typeCode: 'RFQ_STATUS'}, {typeCode: 'SALE_SITUATION'}];
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
            field: 'status',
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
            field: 'customerName',
            title: '客户',
            width: 100,
            align: 'left'
        }, {
            field: 'inquiryDate',
            title: '询价日期',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
            }
        }, {
            field: 'salesSituation',
            title: '销售形势',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                return compareDict(allDict, 'SALE_SITUATION', value);
            }
        }, {
            field: 'company',
            title: '公司',
            width: 300,
            align: 'left'
        }, {
            field: 'duty',
            title: '担当',
            width: 100,
            align: 'left'
        }, {
            field: 'operator',
            title: '操作员',
            width: 100,
            align: 'left'
        }, {
            field: 'auditor',
            title: '审核员',
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
    let obj = $('#searchForm').getData();
    obj[obj.selectType] = obj.selectValue;
    obj.inquiryDate1 = "" == obj.inquiryDate1 ? null : moment(obj.inquiryDate1).format("YYYY-MM-DD hh:mm:ss");
    obj.inquiryDate2 = obj.inquiryDate2 == "" ? null : moment(obj.inquiryDate2).format("YYYY-MM-DD hh:mm:ss");
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
        area: ['100%', '100%'],//width,height
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

/**
 * 询价
 */
function rfqPrice() {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });
        return;
    }
    let obj = rows[0];
    let str = '';
    if (obj.status == 4) {
        str = '确认询价吗？';
        obj.status = 1;
    } else if (obj.status == 1) {
        str = '确认取消询价吗？';
        obj.status = 4;
    } else {
        str = '已经报价';
        layer.alert(str, {
            icon: 2
        });
        return;
    }
    layer.confirm(str, {
        icon: 3,
        title: '提示'
    }, function () {
        ajaxSubmit(statusChange, obj);
    });
}

