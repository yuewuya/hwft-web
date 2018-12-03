/**
 * 初始化数据
 */
const loadUrl = '/khgl/findContacts';
const submitUrl = '/khgl/saveContact';
/*let dictArr = [{typeCode: 'STEELGRADE'},{typeCode: 'SHAPE'},{typeCode: 'PROCESSING'}];*/
let allDict = {};
let tableData =[];
$(function(){

    /*initTable();*/
    /*ajaxDictQuery(dictArr, function (data) {
        allDict = data;
        setDictOption(['steelGrade1','steelGrade2'], 'STEELGRADE');
        setDictOption(['shape1','shape2'], 'SHAPE');
        setDictOption(['processing1'], 'PROCESSING');
    });*/
});


/**
 * 加载表格数据
 */
function initTable(id) {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    $("#dg").datagrid({
        width: '98%',
        height: mContentHeight,
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar',
        //idField: 'id',
        url: getRootPath() + loadUrl,
        queryParams:{customerId:id},
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'name',
            title: '姓名',
            align: 'center',
            width: '200'
        }, {
            field: 'sex',
            title: '性别',
            align: 'center',
            width: '200'
        }, {
            field: 'duty',
            title: '职务',
            align: 'center',
            width: '100'
        }, {
            field: 'telephone',
            title: '手机号码',
            align: 'center',
            width: '100'
        }, {
            field: 'age',
            title: '年龄',
            align: 'center',
            width: '100'
        }, {
            field: 'culture',
            title: '文化程度',
            align: 'center',
            width: '200'
        }, {
            field: 'fax',
            title: '电话传真',
            align: 'center',
            width: '200'
        }, {
            field: 'character',
            title: '性格',
            align: 'center',
            width: '100'
        }, {
            field: 'culture',
            title: '公司地址',
            align: 'center',
            width: '200'
        }, {
            field: 'email',
            title: '邮箱地址',
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
function openWindowu(title, url) {
    layer.open({
        type: 2,
        //skin: 'layui-layer-lan',
        title: title,
        fix: false,
        shadeClose: true,
        maxmin: true,
        area: ['1000px', '550px'],
        content: url
        , btn: ['确定','关闭'] //只是为了演示
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


function openWindow(title, url, data) {
    $("#sex1").attr("checked", true);
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['900px', '380px'],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                initContactData(data);
            }
        },
        yes: function (index, layero) {
            let obj = getContactFormData();
            let customerId = $("#customerId").val();
            if(customerId && customerId != ''){
                obj.customerId = customerId;
                ajaxSubmit(submitUrl, obj);
            }else{
                if (obj) {
                    if(data && data != null){
                        tableData[obj.id - 1] = obj;
                    }else {
                        obj.id = tableData.length + 1;
                        tableData.push(obj);
                    }
                }
                $("#dg").datagrid("loadData", tableData);
                layer.close(index);
            }

        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            $('#savePageForm').form('clear');
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
    if(!$("#baseInfo").form('validate')){
        return null;
    }else{
        let param = {};
        param.customerBase = $('#baseInfo').getData();
        param.customerSupplement = $('#supplementInfo').getData();
        param.customerFinance = $('#financeInfo').getData();
        param.customerTrust = $('#trustInfo').getData();
        param.customerRelationship = $('#relationshipInfo').getData();
        param.jssj = $('#jssj').val();
        if(!param.customerBase.id || param.customerBase.id == ''){
            if(tableData.length > 0){
                for(let i in tableData){
                    delete tableData[i].id;
                }
                param.customerContacts = tableData;
            }
        }
        return param;
    }
}

function initData(data) {
    $('#baseInfo').form('load', data.customerBase);
    $('#supplementInfo').form('load', data.customerSupplement);
    $('#financeInfo').form('load', data.customerFinance);
    let trust = data.customerTrust;
    $('#trustInfo').form('load', trust);
    $('#relationshipInfo').form('load', data.customerRelationship);
    $('#jssj').datebox("setValue", data.jssj);

    $("#xj").text(trust.arrearsA + trust.arrearsB + trust.arrearsC + trust.arrearsD)
}

function search() {
    let obj = {customerId:$('#baseInfo').getData().id};
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}

function initContactData(data){
    $('#savePageForm').form('load', data);
}

function getContactFormData(){
    if(!$("#savePageForm").form('validate')){
        layer.alert("请完善表单数据！",{icon: 2});
        return null;
    }else{
        return $('#savePageForm').getData();
    }
}

function setxj() {
    $("#xj").text($("#intA").val()*1 + $("#intB").val()*1 + $("#intC").val()*1 + $("#intD").val()*1)
}

function deleteInvoke(row) {
    let customerId = $("#customerId").val();
    if (customerId && customerId != ''){
        return true;
    }
    for (let i in row){
        let index = $("#dg").datagrid("getRowIndex", row[i]);
        $("#dg").datagrid("deleteRow", index);
        $(tableData).baoRemove(index);
    }
    return false;
}