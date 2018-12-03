/**
 * 初始化数据
 */
let loadOrderUrl = '/purchase/steel/findAllOrder';
let submitOrderUrl = '/purchase/steel/saveOrder';
let dictArr = [];
let allDict = {};
let codeIds = [];
let orderData = [];
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
        });
    }
});

function loadCardTbl(ids){
    $("#dg").datagrid({
        width: '98%',
        height: "400px",
        singleSelect: false,
        autoRowHeight: false,
        showFooter: true,
        fitColumns: false,
        url: getRootPath() + "/processCard/ftCard/findByIds",
        queryParams: {ids : ids},
        toolbar: '#toolbar',
        columns: [[{
            field: 'code',
            title: '指令号',
            width: 100,
            align: 'center'
        }, {
            field: 'shape',
            title: '形状',
            width: 100,
            align: 'center'
        }, {
            field: 'material',
            title: '材质',
            width: 200,
            align: 'center'
        }, {
            field: 'count',
            title: '数量',
            width: 100,
            align: 'center'
        }, {
            field: 'cutting1',
            title: '下料尺寸',
            width: 200,
            align: 'center'
        }, {
            field: 'min',
            title: '最小保证厚度',
            width: 100,
            align: 'center'
        }]],

        onLoadError: function (XMLHttpRequest) {

        }
    });
}



/**
 * 加载表格数据
 */
function loadSteelTbl(id) {

    $("#dg1").datagrid({
        width: '98%',
        height: "400px",
        singleSelect: false,
        autoRowHeight: false,
        rownumbers: true,
        showFooter: true,
        fitColumns: false,
        toolbar: '#toolbar1',
        url: getRootPath() + loadOrderUrl,
        queryParams: {id:id},
        columns: [[{
            field: 'material',
            title: '材质',
            width: 150,
            align: 'center'
        }, {
            field: 'specification',
            title: '钢板规格',
            width: 150,
            align: 'center'
        }, {
            field: 'num',
            title: '张数',
            width: 150,
            align: 'center'
        }, {
            field: 'address',
            title: '产地',
            width: 150,
            align: 'center'
        }, {
            field: 'ut',
            title: '热处理/母材UT',
            width: 150,
            align: 'center'
        }, {
            field: 'standard',
            title: '执行标准',
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
    loadCardTbl(codeIds);
    $('#dg1').datagrid('reload');
}

function saveCard(title, url) {

    selectRowsOtherPage(title, url, {}, function (res) {
        for(let i in res){
            if(codeIds.indexOf(res[i].id) < 0){
                codeIds.push(res[i].id)
            }
        }
        loadCardTbl(codeIds)
    })

}

function savePart(title, url, flag) {
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
        area: ['800px', '350px'],//width,height
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
                    tempDataUpdate("dg1", param, orderData);
                }else {
                    tempDataInsert("dg1", param, orderData);
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

function deleteCard() {
    let endArr = [];
    let row = $('#dg').datagrid('getSelections');
    if (row != null && row.length > 0) {
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            for (let i in row){
                codeIds.splice(codeIds.indexOf(row[i].id), 1)
            }
            loadCardTbl(codeIds);
            layer.closeAll();
        })
    }else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }
}

function deletePart(url) {
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
                tempDataDelete("dg1", row, orderData);
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
        if(orderData.length > 0){
            for(let i in orderData){
                delete orderData[i].id;
            }
            data.list = orderData;
        }
    }
    if(codeIds.length > 0){
        data.cardIds = codeIds.join(",");
    }
    return data;
}

function initData(data) {
    if(data && data != null){
        codeIds = data.cardIds.split(",");
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
        loadCardTbl(codeIds);
        loadSteelTbl(data.id)
    }else {
        let user = getUserInfo();
        let param = {createName: user.username};
        $("#saveForm").form("load",param);
        $("#createName").val(user.username);
        loadCardTbl([]);
        loadSteelTbl(0)
    }
}
