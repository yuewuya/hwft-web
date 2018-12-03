/**
 * 初始化数据
 */
let loadRecordUrl = '/delivery/detailList';
let submitPartUrl = '/delivery/saveDetail';
let dictArr = [];
let allDict = {};
let partData = [];
let recordData = [];
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
        toolbar: '#toolbar1',
        url: getRootPath() + loadRecordUrl,
        queryParams: {id:id},
        columns: [[{
            field: 'materials',
            title: '材质',
            width: 150,
            align: 'center'
        }, {
            field: 'shapes',
            title: '形状',
            width: 150,
            align: 'center'
        }, {
            field: 'specifications',
            title: '规格',
            width: 150,
            align: 'center'
        }, {
            field: 'numbers',
            title: '个数',
            width: 100,
            align: 'center'
        }, {
            field: 'unitPrices',
            title: '单价',
            width: 150,
            align: 'center'
        }, {
            field: 'notes',
            title: '备注',
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

function savePage(title, url, flag) {
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
        area: ['800px', '350px'],//width,height
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
                param.deliveryId = id;
                ajaxSubmit(submitPartUrl, param)
            }else {
                if(data && data != null){
                    partData[data.id - 1] = param;
                }else {
                    param.id = partData.length + 1;
                    partData.push(param);
                }
                console.log(partData)
                $("#dg").datagrid("loadData", partData);
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
                for (let i = row.length; i > 0; i--){
                    partData.splice(row[i-1].id*1-1,1)
                }
                for(let i = 0; i < partData.length; i++){
                    partData[i].id = i+1;
                }
                $("#dg").datagrid("loadData", partData)
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
        initTable(data.id)
    }else {
        initTable(0)
    }
}

function search() {
    $("#dg").datagrid("reload");
}