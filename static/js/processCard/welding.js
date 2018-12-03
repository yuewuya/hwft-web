/**
 * 初始化数据
 */
let loadUrl = '/process/welding/list';
let submitUrl = '/process/welding/update';
let getWeldingUrl = '/process/welding/getWeldingNo';//获取新的工艺卡编号
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
            field: 'weldingNo',
            title: '焊接编号',
            width: 200,
            align: 'left'
        }, {
            field: 'code',
            title: '指令号',
            width: 200,
            align: 'left'
        }, {
            field: 'produceName',
            title: '产品名称',
            width: 200,
            align: 'left'
        }, {
            field: 'thickness',
            title: '厚度',
            width: 200,
            align: 'left'
        }, {
            field: 'weldingLength',
            title: '焊接长度',
            width: 200,
            align: 'left'
        }, {
            field: 'specification',
            title: '规格',
            width: 200,
            align: 'left'
        }, {
            field: 'createTime',
            title: '时间',
            width: 200,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年MM月DD日");
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
                sonFrame.initData(data);
            } else {
                let obj = {};
                ajaxPostInvoke(getWeldingUrl,null,function(data){
                    obj.weldingNo = data;
                    sonFrame.initData(obj);
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



