/**
 * 初始化数据
 */
let loadUrl = '/sale/ledger/findAll';
let submitUrl = '/sale/ledger/save';
let findByIdUrl = '/sale/ledger/findOne';
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
        queryParams: {type : requsetParam.type},
        columns: [[{
            field: 'month',
            title: '月份',
            width: 80,
            align: 'center',
            formatter: function (value, row) {
                return num2month(value);
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

/**
 * 搜索
 */
function search(data) {
    if (data && data != null){
        data.type = requsetParam.type;
        $('#dg').datagrid('reload', data);
    }else {
        let obj = $('#searchForm').getData();
        obj.type = requsetParam.type;
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
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', "480px"],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            initData(data);
        },
        yes: function (index, layero) {
            let data = getSavePageData();
            data.month = month2num(data.month);
            data.type = requsetParam.type;
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
    data.month = num2month(data.month);
    $("#savePageForm").form("load",data)
}

function getSavePageData() {
    return $("#savePageForm").getData();
}

function num2month(num) {
    if(num == 1) return "一月";
    else if(num == 2) return "二月";
    else if(num == 3) return "三月";
    else if(num == 4) return "四月";
    else if(num == 5) return "五月";
    else if(num == 6) return "六月";
    else if(num == 7) return "七月";
    else if(num == 8) return "八月";
    else if(num == 9) return "九月";
    else if(num == 10) return "十月";
    else if(num == 11) return "十一月";
    else if(num == 12) return "十二月";
    else return "全年合计";
}

function month2num(month) {
    if(month == "一月") return 1;
    else if(month == "二月") return 2;
    else if(month == "三月") return 3;
    else if(month == "四月") return 4;
    else if(month == "五月") return 5;
    else if(month == "六月") return 6;
    else if(month == "七月") return 7;
    else if(month == "八月") return 8
    else if(month == "九月") return 9;
    else if(month == "十月") return 10;
    else if(month == "十一月") return 11;
    else if(month == "十二月") return 12;
}

