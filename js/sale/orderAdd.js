/**
 * 初始化数据
 */
let loadUrl = '/sale/order/findAllDetail';
let submitUrl = '/sale/order/saveDetail';
let dictArr = [{typeCode:'SOURCE_SEND'},{typeCode: 'SALE_SITUATION'}];
let allDict = {};
let tableData = [];
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            setDictOptionKey(['sourceSend'], 'SOURCE_SEND');
            setDictOptionKey(["xsxs"], 'SALE_SITUATION');
        });
    }
});

/**
 * 加载表格数据
 */
function initTable(id) {
    let mWindHeight = $(window).height();
    let mContentHeight = "350px";
    $("#dg").datagrid({
        width: '98%',
        height: mContentHeight,
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        pagination: true,
        pageSize: 10,
        pageList: [10, 50, 100],
        toolbar: '#toolbar',
        url: getRootPath() + loadUrl,
        queryParams:{id:id},
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'resNum',
            title: '单件号',
            align: 'center',
            width: '100'
        }, {
            field: 'shape',
            title: '形状',
            align: 'center',
            width: '150'
        }, {
            field: 'material',
            title: '材质',
            align: 'center',
            width: '100'
        }, {
            field: 'materialSource',
            title: '材料来源',
            align: 'center',
            width: '100'
        }, {
            field: 'outDiameter',
            title: '直径',
            align: 'center',
            width: '100',
            formatter: function (value, row) {
                return value == null ? row.innerDiameter : value;
            }
        }, {
            field: 'thickness',
            title: '壁厚',
            align: 'center',
            width: '100'
        }, {
            field: 'nums',
            title: '数量',
            align: 'center',
            width: '100'
        }, {
            field: 'standards',
            title: '制造标准',
            align: 'center',
            width: '100'
        }, {
            field: 'flawClaim',
            title: '探伤标准',
            align: 'center',
            width: '200'
        }, {
            field: 'rtReport',
            title: '抛光要求',
            align: 'center',
            width: '200'
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
    if(obj.searchValue && obj.searchValue != ''){
        obj[obj.searchKey] = obj.searchValue;
    }
    $('#dg').datagrid('reload', obj);
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, data) {
    parent.layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        maxmin: true,
        area: ['90%', '680px'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = parent.window['layui-layer-iframe' + index];
            let orderId = $("#orderId").val();
            if (data) {
                if(!data.singleId || data.singleId == null || data.singleId == ''){
                    sonFrame.hideChange();
                }
                sonFrame.initData(data);
            }else{
                sonFrame.hideChange();
                if(orderId && orderId != ''){
                    ajaxPostInvoke('/sale/order/findNextOrderDetailNum', {id:orderId}, function (res) {
                        sonFrame.initData({orderNum: $("#orderNum").val(),resNum:res});
                    })
                }else {
                    sonFrame.initData({orderNum: $("#orderNum").val(),resNum:tableData.length + 1});
                }
            }
        },
        yes: function (index, layero) {
            let page = parent.window[layero.find('iframe')[0]['name']];
            let param = page.getFormData();
            let orderId = $("#orderId").val();
            if (orderId && orderId != ''){
                param.orderId = orderId;
                parentAjaxSubmit(submitUrl, param, page);
            }else {
                if(data && data != null){
                    tempDataUpdate("dg", param, tableData);
                }else {
                    tempDataInsert("dg", param, tableData);
                }
                parent.layer.close(index);
            }
        },
        btn2: function (index, layero) {
            parent.layer.close(index);
        }
    });
}

function initData(data) {
    $('#saveForm').form('load', data);
    $('#ex').form('load', data);
}

function getFormData() {
    if(!$("#saveForm").form('validate')){
        return null;
    }else{
        let param = {};
        param.order = $('#saveForm').getData();
        if(!param.id || param.id == ''){
            if(tableData.length > 0){
                for(let i in tableData){
                    delete tableData[i].id;
                }
                param.list = tableData;
            }
        }
        return param;
    }
}

function search() {
    let obj = {id:$('#orderId').val()};
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}

function deleteInvoke(row) {
    let orderId = $("#orderId").val();
    if (orderId && orderId != ''){
        return true;
    }
    tempDataDelete("dg", row, tableData);
    return false;
}