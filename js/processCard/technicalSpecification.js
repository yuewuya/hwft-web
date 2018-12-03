/**
 * 初始化数据
 */
let loadUrl = '/processCard/specification/findAll';
let submitUrl = '/processCard/specification/save';
let dictArr = [
    {typeCode:'RT_REPORT'},
    {typeCode:'FLAW_CLAIM'}
];
let allDict = {};
let tableData = [];

$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            setDictOption(['zzbz'], 'RT_REPORT');
            setDictOption(['tsyq'], 'FLAW_CLAIM');
        });
    }
});

/**
 * 加载表格数据
 */
function initTable(id) {
    $("#dg").datagrid({
        width: '98%',
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
                { title: '材料', align: 'center', colspan: 5 },
                { field: 'shape', title: '封头形状', width: 100, align: 'center', rowspan: 3 },
                { title: '封头尺寸', align: 'center', colspan: 6 },
                { field: 'num', title: '封头数量', width: 80, align: 'center', rowspan: 3 },
                { title: '公差要求', align: 'center', colspan: 2 },
                { title: '抛光要求', align: 'center', colspan: 2 },
                { field: 'makeStandard', title: '制造标准', width: 200, align: 'center', rowspan: 3 },
                { title: '封头用途', align: 'center', colspan: 2 },
                { title: '无损检测', align: 'center', colspan: 3 },
                { title: '其他要求', align: 'center', colspan: 4 },
                { field: 'fileNums', title: '附件页数', width: 80, align: 'center', rowspan: 3 },
                { field: 'finishDate', title: '完工日', width: 150, align: 'center', rowspan: 3 },
                { field: 'code', title: '指令号', width: 100, align: 'center', rowspan: 3 }
            ],
            [
                { field: 'materialNumber', title: '材料牌号', width: 100, align: 'center', rowspan: 2 },
                { field: 'materialSource', title: '材料来源', width: 100, align: 'center', rowspan: 2 },
                { title: '材料复验', align: 'center', colspan: 2 },
                { field: 'materialRequire', title: '其他要求', width: 100, align: 'center', rowspan: 2 },
                { field: 'diameter', title: '公称直径', width: 100, align: 'center', rowspan: 2 },
                { field: 'materialThickness', title: '投料厚度', width: 100, align: 'center', rowspan: 2 },
                { field: 'straightHeight', title: '直边高度', width: 100, align: 'center', rowspan: 2 },
                { field: 'allHeight', title: '封头总高', width: 100, align: 'center', rowspan: 2 },
                { field: 'minThickness', title: '最小厚度', width: 100, align: 'center', rowspan: 2 },
                { field: 'pkType', title: '坡口形式', width: 100, align: 'center', rowspan: 2 },
                { field: 'gcBase', title: '对准基准', width: 100, align: 'center', rowspan: 2 },
                { field: 'gcNum', title: '公差数值', width: 100, align: 'center', rowspan: 2 },
                { field: 'pgFace', title: '抛光面', width: 100, align: 'center', rowspan: 2 },
                { field: 'pgRough', title: '粗糙度', width: 100, align: 'center', rowspan: 2 },
                { field: 'containerType', title: '容器类别', width: 100, align: 'center', rowspan: 2 },
                { field: 'medium', title: '工作介质', width: 100, align: 'center', rowspan: 2 },
                { field: 'flawMethod', title: '探伤方法', width: 100, align: 'center', rowspan: 2 },
                { field: 'flawPart', title: '探伤部位', width: 100, align: 'center', rowspan: 2 },
                { field: 'flawRequire', title: '具体要求', width: 100, align: 'center', rowspan: 2 },
                { field: 'heatTreatment', title: '热处理', width: 100, align: 'center', rowspan: 2 },
                { field: 'testBody', title: '焊接试板', width: 100, align: 'center', rowspan: 2 },
                { field: 'stamp', title: '钢印', width: 100, align: 'center', rowspan: 2 },
                { field: 'check', title: '监检', width: 100, align: 'center', rowspan: 2 }
            ],
            [
                { field: 'materialCommon', title: '常规', width: 100, align: 'center' },
                { field: 'materialOther', title: '其他', width: 100, align: 'center' }
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
        area: ['1000px', '550px'],//width,height
        content: $('#'+url),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if(data){
                $("#savePageForm").form("load",data)
            }
        },
        yes: function (index, layero) {
            let id = $("#id").val();
            let param = $("#savePageForm").getData();
            if(id && id != ''){
                param.parentId = id;
                ajaxSubmit("/processCard/specification/save", param)
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

function deleteInvoke(row) {
    let id = $("#id").val();
    if (id && id != ''){
        return true;
    }
    tempDataDelete("dg", row, tableData);
    return false;
}
