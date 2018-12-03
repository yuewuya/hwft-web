/**
 * 初始化数据
 */
let loadUrl = '/sale/rfq/productList';
let submitUrl = '/sale/rfq/productUpdate';
let submitUrlBath = '/sale/rfq/productUpdateBatch';
let queryOneUrl = '/sale/rfq/one';
let dictArr = [{typeCode: 'SALE_SITUATION'}, {typeCode: 'SALE_CLASSIFICATION'}, {typeCode: 'SALE_MATERIAL_SOURCE'}, {typeCode: 'SALE_STANDARDS'}];
let RfqProductArr = [];
let allDict = {};
let rfqId = null;
let numbering;

function initData(data) {
    if (data == null) {
        rfqId = null;
        ajaxPostInvoke('/sale/rfq/getNumbering', null, function (value) {
            numbering = value;
            $("#numbering").val(numbering);
            loadTable();
        });
    } else {
        rfqId = data.id;
        numbering = data.numbering;
        loadTable();
    }
    $('#form').form('load', data);
}

function loadTable(){
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (value) {
            allDict = value;
            initTable(rfqId);
            setDictOptionKey(['salesSituation'], 'SALE_SITUATION');
            setDictOptionKey(['classification'], 'SALE_CLASSIFICATION');
        });
    } else {
        initTable(rfqId);
    }
}

/**
 * 加载表格数据
 */
function initTable(rfqId) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        queryParams: {
            numbering: numbering
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
            field: 'singleNum',
            title: '单件号',
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
            field: 'materialSource',
            title: '材料来源',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'SALE_MATERIAL_SOURCE', value);
            }
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
            field: 'standards',
            title: '制造标准',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return compareDict(allDict, 'SALE_STANDARDS', value);
            }
        }, {
            field: 'flawDetection',
            title: '探伤',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == '1' ? '是' : '否';
            }
        }, {
            field: 'heatTreatment',
            title: '热处理',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == '1' ? '是' : '否';
            }
        }, {
            field: 'otherClaim',
            title: '其它要求',
            width: 100,
            align: 'center'
        }, {
            field: 'quote',
            title: '报价',
            width: 100,
            align: 'center'
        }, {
            field: 'price',
            title: '售价',
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
    $('#dg').datagrid('reload', {rfqId: rfqId});
}

function getFormData() {
    let obj = {};
    obj.details = RfqProductArr;
    obj.entity = $('#form').getData();
    if(rfqId == null || rfqId == ''){
        for (let i = 0; i < RfqProductArr.length; i++) {
            delete RfqProductArr[i].id;
        }
    }
    return obj;
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
                data.business = 'rfq';
                sonFrame.initData(data);
            } else {
                let obj = {};
                obj.rfqId = rfqId;
                let total = $("#dg").datagrid('getData').total;
                if (total > 0) {
                    let currentRow = $('#dg').datagrid('getData').rows[total - 1];
                    obj.singleNum = 1 * currentRow.singleNum + 1;
                } else {
                    obj.singleNum = 1;
                }
                obj.numbering = numbering;
                obj.business = 'rfq';
                sonFrame.initData(obj);
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData().rfq;
            //修改询价单
            if (rfqId != null) {
                ajaxSubmit(submitUrl, obj);
            } else {
                if (data != null) {//修改
                    RfqProductArr = tempDataUpdate('dg', obj, RfqProductArr);
                } else {
                    RfqProductArr = tempDataInsert('dg', obj, RfqProductArr);
                }
            }
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}

/**
 * 获取销售
 * @param title
 * @param url
 * @param data
 */
function selectSaleMan() {
    layer.open({
        type: 2,
        title: '获取销售',
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + '/sys/sysUser.html',
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            sonFrame.search('销售部门');
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                $("#duty").val(obj.username);
            }
            console.log(obj);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

/**
 * 获取客户
 * @param title
 * @param url
 * @param data
 */
function getCustomer() {
    layer.open({
        type: 2,
        title: '获取客户',
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + '/base/khgl/khgl.html',
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            if (obj) {
                $("#customerName").val(obj.company);
                $("#customerId").val(obj.id);
            }
            console.log(obj);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

/**
 * 删除回调函数
 * @param row
 * @returns {boolean} 是否调用后台删除方法
 */
function deleteInvoke(row) {
    if (rfqId != null) {
        return true;
    }
    RfqProductArr = tempDataDelete('dg', row, RfqProductArr);
    console.log(RfqProductArr);
    return false;
}
