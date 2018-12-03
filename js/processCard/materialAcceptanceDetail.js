/**
 * 初始化数据
 */
let loadUrl = '/processCard/materialAcceptance/findAllDetail';
let submitUrl = '/processCard/materialAcceptance/saveDetail';
let dictArr = [
    /*{typeCode:'RT_REPORT'},
    {typeCode:'FLAW_CLAIM'},*/
];
let allDict = {};
let tableData = [];
const user = getUserInfo();

$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            /*setDictOption(['zzbz'], 'RT_REPORT');
            setDictOption(['tsyq'], 'FLAW_CLAIM');*/
        });
    }
});

/**
 * 加载表格数据
 */
function initTable(id) {
    $("#dg").datagrid({
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        pageSize: 8,
        toolbar: '#toolbar',
        url: getRootPath() + loadUrl,
        queryParams: {id:id},
        columns: [
            [
                { field: 'material', title: '材质', width: 150, align: 'center' },
                { field: 'shape', title: '形状', width: 100, align: 'center'},
                { field: 'specification', title: '规格', width: 150, align: 'center'},
                { field: 'num', title: '数量', width: 80, align: 'center'},
                { field: 'blankSize', title: '下料尺寸', width: 200, align: 'center'},
                { field: 'materialSize', title: '实际下料尺寸', width: 200, align: 'center'},
                { field: 'actualThickness', title: '实际厚度', width: 100, align: 'center'}
            ]
        ],
        onLoadError: function (XMLHttpRequest) {

        }
    });
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
        area: ['600px', '400px'],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if(data){
                let department = user.department;
                if ( department == 4 ){
                    $("#input1,#input2,#input3,#input4,#input6,#input7").attr("disabled", true);
                    $("#input4").textbox('textbox').attr("disabled", true);
                }else if(department == 5){
                    $("#input1,#input2,#input3,#input4,#input5").attr("disabled", true);
                    $("#input4").textbox('textbox').attr("disabled", true);
                }else{
                    $("#input5,#input6,#input7").attr("disabled", true)
                }
                $("#savePageForm").form("load",data)
            }
        },
        yes: function (index, layero) {
            let id = $("#id").val();
            let param = $("#savePageForm").getData();
            if(id && id != ''){
                param.parentId = id;

                let department = user.department;
                if(data && data != null){
                    let status = $("#status").val();
                    if(status == 1 && department == 4){
                        ajaxPostInvoke("/processCard/materialAcceptance/save", {id : id, status : 2}, function(res){
                            $("#status").val(2);
                        })
                    }else if(status == 2 && department == 5){
                        ajaxPostInvoke("/processCard/materialAcceptance/save", {id : id, status : 3}, function(res){
                            $("#status").val(3);
                        })
                    }
                }
                ajaxSubmit(submitUrl, param)
            }else {
                if(data && data != null){
                    tempDataUpdate("dg", param, tableData);
                }else {
                    tempDataInsert("dg", param, tableData);
                }
                layer.close(index);
            }
        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            $('#savePageForm').form('reset');
        }
    });
}

function getFormData() {
    let data = $("#saveForm").getData();
    let flag = $("#switch").switchbutton("options").checked;
    let department = user.department;
    if(department == 4){
        return {id : data.id, status : 2};
    }else if (department == 5){
        return {id : data.id, status : 3};
    }else{
        if(flag){
            data.departIds = data.names;
            data.userIds = '';
            data.departIdList = departIdList;
        }else {
            data.userIds = data.names;
            data.departIds = '';
            data.userIdList = userIdList;
        }
        if(!data.id || data.id == ''){
            if(tableData.length > 0){
                for(let i in tableData){
                    delete tableData[i].id;
                }
                data.list = tableData;
            }
        }
        data.status = 1;
        return data;
    }

}

function initData(data) {
    if(data && data != null){
        $("#saveForm").form("load",data);
        if(data.departIds && data.departIds != ''){
            $('#switch').switchbutton('check');
            $("#names").val(data.departIds);
            departIds = data.departIds;
            departIdList = data.departIdList;
        }else {
            userIds = data.userIds;
            userIdList = data.userIdList;
            $("#names").val(data.userIds)
        }
        initTable(data.id)
    }else {
        initTable(0)
    }
}

function deleteInvoke(row) {
    let id = $("#id").val();
    if (id && id != ''){
        return true;
    }
    tempDataDelete("dg", row, tableData);
    return false;
}
