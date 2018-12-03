/**
 * 初始化数据
 */
let loadUrl = '/process/heatTreatment/list';
let submitUrl = '/process/heatTreatment/update';
let getNumberUrl = '/process/heatTreatment/getNumbering';
let dictArr = [{typeCode: 'RFQ_STATUS'}];
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
            field: 'heatTreatmentNo',
            title: '热处理编号',
            width: 100,
            align: 'left'
        }, {
            field: 'createTime',
            title: '制作日',
            width: 120,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'createUserName',
            title: '操作员',
            width: 100,
            align: 'left'
        }, {
            field: 'examineTime',
            title: '审核日',
            width: 100,
            align: 'left',
            formatter: function (value, row) {
                if (value == '' || value == null) {
                    return '';
                }
                return moment(value).format("YYYY年MM月DD日");
            }
        }, {
            field: 'examineUserName',
            title: '审核员',
            width: 100,
            align: 'left'
        }, {
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'left'
        }, {
            field: 'treatmentType',
            title: '类别',
            width: 100,
            align: 'left'
        }, {
            field: 'furnaceType',
            title: '炉种类',
            width: 100,
            align: 'left'
        }, {
            field: 'status',
            title: '状态',
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
        area: ['90%', '90%'],//width,height
        content: getRootPath() + url,
        btn: ['提交', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (data) {
                sonFrame.initMethod(data.heatTreatmentId);
            } else {
                ajaxPostInvoke(getNumberUrl, null, function (data) {
                    sonFrame.initData({heatTreatmentNo: data});
                })
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



