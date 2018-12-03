/**
 * 初始化数据
 */
const loadUrl = '/khgl/findAll';
const submitUrl = '/khgl/save';
const findByIdUrl = '/khgl/findById';
/*let dictArr = [{typeCode: 'STEELGRADE'},{typeCode: 'SHAPE'},{typeCode: 'PROCESSING'}];*/
let allDict = {};
$(function(){
    initTable();
    /*ajaxDictQuery(dictArr, function (data) {
        allDict = data;
        setDictOption(['steelGrade1','steelGrade2'], 'STEELGRADE');
        setDictOption(['shape1','shape2'], 'SHAPE');
        setDictOption(['processing1'], 'PROCESSING');
    });*/
})

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
        queryParams: {isSupplier:0},
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'company',
            title: '公司名称',
            align: 'center',
            width: '200'
        }, {
            field: 'address',
            title: '公司地址',
            align: 'center',
            width: '200'
        }, {
            field: 'zipCode',
            title: '邮编',
            align: 'center',
            width: '100'
        }, {
            field: 'contact',
            title: '联系人',
            align: 'center',
            width: '100'
        }, {
            field: 'mobile',
            title: '电话',
            align: 'center',
            width: '100'
        }, {
            field: 'fax',
            title: '传真',
            align: 'center',
            width: '200'
        }, {
            field: 'admin',
            title: '管理人',
            align: 'center',
            width: '200'
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, row) {
    layer.open({
        type: 2,
        //skin: 'layui-layer-lan',
        title: title,
        fix: false,
        shadeClose: true,
        maxmin: true,
        area: ['1000px', '550px'],
        content: url
        ,btn: ['确定','关闭']
        ,success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if (row) {
                let customerId = row.id;
                sonFrame.initTable(customerId);
                ajaxPostInvoke(findByIdUrl, {id:customerId}, function (data) {
                    sonFrame.initData(data);
                })
            }else{
                sonFrame.initTable(0);
            }
         }
        , yes: function (index, layero) {
            let sonFrame = window[layero.find('iframe')[0]['name']];
            let data = sonFrame.getFormData();
            if(data && data != null){
                ajaxPostInvoke(submitUrl, data, function (result) {

                    let customerId = result.customerBase.id;
                    sonFrame.initTable(customerId);
                    sonFrame.initData(result);

                    layer.confirm('保存成功,退出编辑页面？',function(index){
                        layer.closeAll();
                    })
                    search();
                })
            }

        }
        , btn2: function () {
            layer.closeAll();
        }
    });
}
layer.ready(function() {
    //官网欢迎页
});


function openWindowyl(title, url) {
    layer.open({
        type: 2,
        //skin: 'layui-layer-lan',
        title: title,
        fix: false,
        shadeClose: true,
        maxmin: true,
        area: ['1000px', '600px'],
        content: url

        , yes: function () {
            $(that).click();
        }
        , btn2: function () {
            layer.closeAll();
        }
    });
}
layer.ready(function() {
    //官网欢迎页
});

$('.tablelist3 tbody tr:odd').addClass('odd');

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

function getFormData() {
    if(!$("#savePageForm").form('validate')){
        layer.alert("请完善表单数据！",{icon: 2});
        return null;
    }else{
        return $('#savePageForm').getData();
    }
}

function initData(data) {
    $('#savePageForm').form('load', data);
}

function search(data) {
    let obj = getSearchData();
    obj.page = 1;
    let param = concatJSON(obj,data)
    $('#dg').datagrid('reload', param);
}

function getSearchData(){
    let param = {isSupplier:0};
    let searchValue = $("#searchValue").val();
    let searchKey = $("#searchKey").val();
    if(searchValue && searchValue != ''){
        param[searchKey] = searchValue;
    }
    return param;
}
