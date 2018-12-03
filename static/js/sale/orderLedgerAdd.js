/**
 * 初始化数据
 */
let loadUrl = '/sale/orderLedger/findAll';
let submitUrl = '/sale/orderLedger/save';
let findByIdUrl = '/sale/orderLedger/findOne';
let type = 0;
let year = 0;
let month = 0;
$(function () {
    initTable();
});

/**
 * 加载表格数据
 */
function initTable(data) {
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
        queryParams: {type : data.type, month:data.month},
        columns: [[{
            field: 'time',
            title: '日期',
            width: 80,
            align: 'center',
            formatter: function (value, row) {
                return value == null ? "总计" : moment(value).format("DD日");
            }
        }, {
            field: 'orderQuantity',
            title: '订货数量',
            width: 100,
            align: 'center'
        }, {
            field: 'contractAmount',
            title: '合同金额',
            width: 100,
            align: 'center'
        },{
            field: 'alreadyNum',
            title: '已发数量',
            width: 100,
            align: 'center'
        },{
            field: 'alreadyAmount',
            title: '已发金额',
            width: 100,
            align: 'center'
        }, {
            field: 'unissuedNum',
            title: '未发数量',
            width: 100,
            align: 'center'
        }, {
            field: 'unissuedAmount',
            title: '未发金额',
            width: 100,
            align: 'center'
        }, {
            field: 'ticketNum',
            title: '已开发票数量',
            width: 120,
            align: 'center'
        }, {
            field: 'ticketAmount',
            title: '已开发票金额',
            width: 120,
            align: 'center'
        }, {
            field: 'unTicketNum',
            title: '未开发票数量',
            width: 120,
            align: 'center'
        }, {
            field: 'unTicketAmount',
            title: '未开发票金额',
            width: 120,
            align: 'center'
        }
        ]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

function initData(data){
    initTable(data);
    type = data.type;
    month = data.month;
    year = data.year;
    $("#title").text(year + "年" + month + "月份台账")
}

/**
 * 搜索
 */
function search() {
    $('#dg').datagrid('reload');
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
        area: ['800px', "480px"],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if(data && data != null){
                initPage(data);
            }
        },
        yes: function (index, layero) {
            let data = getSavePageData();
            data.type = type;
            ajaxSubmit(submitUrl, data);
        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            $('#savePageForm').form('clear');
        }
    });
}

function initPage(data) {
    $("#savePageForm").form("load",data)
}

function getSavePageData() {
    return $("#savePageForm").getData();
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

function lookOrder() {
    selfSelectOtherPage("销售合同", "/sale/xsht.html", {start:getSettingData().time,end:getSettingData().time}, function(res){})
}
