/**
 * 初始化数据
 */
let loadPartUrl = '/processCard/repair/part/findAll';
let loadRecordUrl = '/processCard/repair/record/findAll';
let submitPartUrl = '/processCard/repair/part/save';
let submitRecordUrl = '/processCard/repair/record/save';
let dictArr = [];
let allDict = {};
let partData = [];
let recordData = [];
const user = getUserInfo();
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
        });
    }
});

/**
 * 加载表格数据
 */
function initTable(id) {
    $("#dg").datagrid({
        width: '98%',
        height: "400px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar',
        url: getRootPath() + loadPartUrl,
        queryParams: {id:id},
        columns: [[{
            field: 'part',
            title: '返修部位',
            width: 250,
            align: 'center'
        }, {
            field: 'type',
            title: '缺陷类型',
            width: 250,
            align: 'center'
        }, {
            field: 'remark',
            title: '不合格部位及长度',
            width: 500,
            align: 'center'
        }]],

        onLoadError: function (XMLHttpRequest) {

        }
    });

    $("#dg1").datagrid({
        width: '98%',
        height: "400px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar1',
        url: getRootPath() + loadRecordUrl,
        queryParams: {id:id},
        columns: [[{
            field: 'part',
            title: '返修部位',
            width: 150,
            align: 'center'
        }, {
            field: 'length',
            title: '返修长度',
            width: 150,
            align: 'center'
        }, {
            field: 'yrTemperature',
            title: '预热温度（℃）',
            width: 150,
            align: 'center'
        }, {
            field: 'hjI',
            title: '焊接电流（A）',
            width: 150,
            align: 'center'
        }, {
            field: 'hjU',
            title: '焊接电压（V）',
            width: 150,
            align: 'center'
        }, {
            field: 'repairMan',
            title: '返修人',
            width: 150,
            align: 'center'
        }, {
            field: 'testMan',
            title: '检验员',
            width: 150,
            align: 'center'
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
    obj.type = 1;
    $('#dg').datagrid('reload', obj);
}

function savePart(title, url, flag) {
    let data;
    if(flag){
        let rows = $('#dg').datagrid('getSelections');
        if (rows.length != 1) {
            layer.alert("请选择一条需要编辑的数据！", {
                icon: 2
            });
            return;
        }else {
            data = rows[0];
        }
    }
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['400px', '350px'],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if(data && data != null){
                $("#savePageForm").form("load",data)
            }
        },
        yes: function (index, layero) {
            let id = $("#id").val();
            let param = $("#savePageForm").getData();

            if(id &&  id!= ''){
                param.parentId = id;
                ajaxSubmit(submitPartUrl, param)
            }else {
                if(data && data != null){
                    tempDataUpdate("dg", param, partData);
                }else {
                    tempDataInsert("dg", param, partData);
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

function saveRecord(title, url, flag) {
    let data;
    if(flag){
        let rows = $('#dg1').datagrid('getSelections');
        if (rows.length != 1) {
            layer.alert("请选择一条需要编辑的数据！", {
                icon: 2
            });
            return;
        }else {
            data = rows[0];
        }
    }
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', '400px'],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if(data && data != null){
                $("#savePageForm1").form("load",data)
            }
        },
        yes: function (index, layero) {
            let id = $("#id").val();
            let param = $("#savePageForm1").getData();
            if(id && id != ''){
                param.parentId = id;
                ajaxSubmit(submitRecordUrl, param)
            }else {
                if(data && data != null){
                    tempDataUpdate("dg1", param, recordData);
                }else {
                    tempDataInsert("dg1", param, recordData);
                }
                layer.close(index);
            }
        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            $('#savePageForm1').form('reset');
        }
    });
}

function deletePart(url) {
    let row = $('#dg').datagrid('getSelections');
    if (row != null && row.length > 0) {
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            let id = $("#id").val();
            if (id && id != ''){
                ajaxPostInvoke(url, row, function (res) {
                    layer.alert('删除成功！', {
                        icon: 1
                    }, function () {
                        layer.closeAll();
                    });
                    $("#dg").datagrid("clearSelections");
                    $("#dg").datagrid("reload");
                })

            }else{
                tempDataDelete("dg", row, partData);
                layer.closeAll();
            }
        })
    }else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }
}

function deleteRecord(url) {
    let row = $('#dg1').datagrid('getSelections');
    if (row != null && row.length > 0) {
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            let id = $("#id").val();
            if (id && id != ''){
                ajaxPostInvoke(url, row,function (res) {
                    layer.alert('删除成功！', {
                        icon: 1
                    }, function () {
                        layer.closeAll();
                    });
                    $("#dg1").datagrid("clearSelections");
                    $("#dg1").datagrid("reload");
                })

            }else{
                tempDataDelete("dg1", row, recordData);
                layer.closeAll();
            }
        })
    }else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }
}



function getFormData() {
        let data = $("#saveForm").getData();
        let flag = $("#switch").switchbutton("options").checked;
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
            if(partData.length > 0){
                for(let i in partData){
                    delete partData[i].id;
                }
                data.partList = partData;
            }
            if(recordData.length > 0){
                for(let i in recordData){
                    delete recordData[i].id;
                }
                data.recordList = recordData;
            }
        }
        data.type = 2;
        return data;
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
        if(data.status == 1 && data.createName != user.username){
            $("#auditName").val(user.username);
            $("#status").val(2);
        }else if(data.status == 2 || data.status == 3){
            $("#approveName").val(user.username);
            $("#status").val(3);
        }
        initTable(data.id)
    }else {
        let user = getUserInfo();
        let param = {createName: user.username};
        $("#saveForm").form("load",param);
        $("#createName").val(user.username);
        $("#status").val(1);
        initTable(0)
    }
}

function search() {
    $("#dg").datagrid("reload");
    $("#dg1").datagrid("reload");
}