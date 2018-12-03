/**
 * 初始化数据
 */
let loadUrl = '/materialPrice/list';
let submitUrl = '/materialPrice/update';
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
            field: 'createTime',
            title: '日期',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年 MM月 DD日");
            }
        }, {
            field: 'operator',
            title: '操作员',
            width: 200,
            align: 'center'
        }, {
            field: 'material',
            title: '材质',
            width: 100,
            align: 'left'
        }, {
            field: 'thickness',
            title: '壁厚',
            width: 100,
            align: 'left'
        }, {
            field: 'price',
            title: '价格',
            width: 100,
            align: 'left'
        }, {
            field: 'updateTime',
            title: '更新时间',
            width: 150,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("MM月DD日 HH时mm分");
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
    let obj = {};
    if ($("#startDate").val() != '') {
        obj.startDate = moment($("#startDate").val()).subtract(1, "days").format("YYYY-MM-DD hh:mm:ss");
    } else {
        obj.startDate = moment('1970-01-01').format("YYYY-MM-DD hh:mm:ss");
    }
    if ($("#currentDate").val() != '') {
        obj.currentDate = moment($("#currentDate").val()).format("YYYY-MM-DD hh:mm:ss");
    } else {
        obj.currentDate = moment('2099-01-01').format("YYYY-MM-DD hh:mm:ss");
    }
    if($("#material").val() != ''){
        obj.material = $("#material").val();
    }
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
                let obj = {};
                obj.createTime = moment(new Date()).format("YYYY-MM-DD");
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
