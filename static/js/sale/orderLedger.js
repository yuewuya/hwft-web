/**
 * 初始化数据
 */
let loadUrl = '/sale/order/queryPageLedger1';
$(function () {
    initTable();
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
        singleSelect: true,
        autoRowHeight: false,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'time',
            title: '月份',
            width: 80,
            align: 'center',
            formatter: function (value, row) {
                return value == null ? "全年合计" : "<a onclick=\"setPage2('"+value+"')\">"+moment(value).format('MM月')+"</a>";
            }
        }, {
            field: 'count',
            title: '订货数量',
            width: 100,
            align: 'center'
        }, {
            field: 'amount',
            title: '合同金额',
            width: 100,
            align: 'center'
        },{
            field: 'yfCount',
            title: '已发数量',
            width: 100,
            align: 'center'
        },{
            field: 'yfAmount',
            title: '已发金额',
            width: 100,
            align: 'center'
        }, {
            field: 'wfCount',
            title: '未发数量',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return row.count - row.yfCount == 0 ? "" : row.count - row.yfCount;
            }
        }, {
            field: 'wfAmount',
            title: '未发金额',
            width: 100,
            align: 'center'
        }, {
            field: 'ykfpCount',
            title: '已开发票数量',
            width: 120,
            align: 'center'
        }, {
            field: 'ykfpAmount',
            title: '已开发票金额',
            width: 120,
            align: 'center'
        }, {
            field: 'wkfpCount',
            title: '未开发票数量',
            width: 120,
            align: 'center'
        }, {
            field: 'wkfpAmount',
            title: '未开发票金额',
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
        data.type = requsetParam.type;
        $('#dg').datagrid('reload', data);
    }else {
        let obj = $('#searchForm').getData();
        searchYear = obj.year;
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
        area: ['100%', "100%"],//width,height
        content: getRootPath() + url,
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            sonFrame.initData(data.time);
        },
        end:function () {
            search()
        }
    });
}
function setPage2(time) {
    layer.open({
        type: 2,
        title: '查看当月',
        fix: false,
        shadeClose: true,
        area: ['100%', "100%"],//width,height
        content: getRootPath() + "/sale/orderLedger2.html",
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            sonFrame.initData(time);
        },
        end:function () {
            search()
        }
    });
}
