/**
 * 初始化数据
 */
let loadUrl = '/quality/heatTreatmentReport/list';
let submitUrl = '/quality/heatTreatmentReport/update';
//let dictArr = [{typeCode: 'CHEMICAL_TYPE_KIND'}];
let dictArr = [];
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
            field: 'no',
            title: '热处理炉次顺序号',
            width: 200,
            align: 'left'
        }, {
            field: 'createTime',
            title: '热处理时间',
            width: 120,
            align: 'left',
            formatter: function (value, row) {
                if (value == '' || value == null) {
                    return '';
                }
                return moment(value).format("YYYY年MM月DD日");
            }
        }]]
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
            } else {
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



