/**
 * 初始化数据
 */
let loadUrl = '/cargo/list';
let submitUrl = '/cargo/save';
let dictArr = [];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
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
            field: 'transportNumber',
            title: '运输编号',
            width: 100,
            align: 'center'
        }, {
            field: 'shipper',
            title: '托运人',
            width: 100,
            align: 'left'
        }, {
            field: 'carrier',
            title: '承运人',
            width: 100,
            align: 'left'
        }, {
            field: 'cargoName',
            title: '货物名称',
            width: 100,
            align: 'left'
        },  {
            field: 'goodsPieces',
            title: '货物数量',
            width: 150,
            align: 'left'
        }, {
            field: 'goodsTon',
            title: '货物重量',
            width: 100,
            align: 'left'
        },{
            field: 'deliveryMethod',
            title: '货运方式',
            width: 100,
            align: 'left'
        },{
            field: 'startTime',
            title: '起运时间',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年 MM月 DD日");
            }
        }, {
            field: 'priceTotal',
            title: '运输价格',
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
    $('#dg').datagrid('reload', {
        // searchName:$('#searchName').combobox('getValue'),
        // searchTitle:$("#searchTitle").val()
    });
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
                let obj = {};
                obj.transportTime = moment(new Date()).format("YYYY-MM-DD");
                sonFrame.initData(obj);
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
