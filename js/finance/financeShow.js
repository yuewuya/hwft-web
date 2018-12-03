/**
 * 初始化数据
 */
let loadUrl = '/finance/companyList';
let submitUrl = '/finance/financeUpdate';
let dictArr = [];
let allDict = {};
$(function () {
    initYear();
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
        });
    }
});

/**
 * 加载表格数据
 */
function initTable() {
    let mWindHeight = $(window).height();
    let mContentHeight = mWindHeight - 100;
    ajaxPostInvoke('/finance/getJson', {companyId:$('#companyId').val(),ywyId:$('#ywyId').val()}, function (data) {
        $("#dt").datagrid({
            width: '98%',
            height: mContentHeight,
            singleSelect: true,
            autoRowHeight: false,
            rownumbers: true,
            pagination: false,
            showFooter: true,
            fitColumns: false,
            pageSize: 100,
            pageList: [20, 50, 100],
            toolbar: '#toolbar',
            url: getRootPath() + loadUrl,
            queryParams:{ywyId:$('#ywyId').val(),companyId:$('#companyId').val()},
            frozenColumns:[[
                {field:'kpsj',width:100, title:'开票时间',align:'center'},
                {field:'fpje',width:100, title:'发票金额',align:'center'},
                {field:'whsje',width:100, title:'余额',align:'center'},
                {field:'jx',width:100, title:'利息',align:'center'}
            ]],
            columns :  data,
            rowStyler:function(index,row){
                if (row.zt == '1'){
                    return 'background-color:pink;';
                }
            },
            onLoadError: function (XMLHttpRequest) {

            }
        });
    });

}

/**
 * 搜索
 */
function search() {
    let obj = {};
    obj.kpsj = $("#year").combobox('getValue');
    obj.page = 1;
    obj.ywyId = $('#ywyId').val();
    obj.companyId = $('#companyId').val();
    $('#dt').datagrid('reload', obj);
}
function editFinance() {
    let rows = $('#dt').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {icon: 2});
    }else{
        let index = layer.open({
            type: 1,
            title: '修改 业务单位',
            fix: false,
            shadeClose: true,
            area: ['800px', '400px'],//width,height
            content: $('#saveYwPage'),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                $('#companyName').val($('#company').val());
                $('#saveYwForm').form('load', rows[0]);
            },
            yes: function (index, layero) {
                let obj = getFormData();
                if (obj) {
                    obj.id = rows[0].id;
                    ajaxSubmit(submitUrl, obj);
                }
                console.log(obj);
            },
            end:function () {
                $('#saveYwForm').form('clear');
                layer.close(index);
            }
        });
    }
}


function initYear() {
    let opts = [{id: '', text: '请选择'}];
    ajaxPostInvoke('/finance/getYears', {}, function (data) {
        $.each(data, function(i, value) {
            opts.push({id: value, text: value});
        });
        $("#year").combobox("loadData", opts);
    });
}

function removeBtn(url) {
    let row = $('#dt').datagrid('getSelections');
    if (row.length ==1) {
        layer.confirm('确认删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            let obj = new Object();
            obj.id = row[0].id;
            ajaxSubmit(url, obj);
        });
    } else {
        layer.alert("请选中一条数据！", {icon: 2});
    }
}

function backFinance() {
    let index = layer.open({
        type: 1,
        title: '收回',
        fix: false,
        shadeClose: true,
        area: ['800px', '400px'],//width,height
        content: $('#backPage'),
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let obj = getOpData();
            obj.companyId = $('#companyId').val();
            ajaxSubmit('/finance/saveFinanceOp', obj);
        },
        end:function () {
            $('#saveBackForm').form('clear');
            layer.close(index);
        }
    });
}

function editBack() {
    let row = $('#dt').datagrid('getSelections');
    if (row.length ==1) {
        let index = layer.open({
            type: 2,
            title: '收回',
            fix: false,
            shadeClose: true,
            area: ['100%', '100%'],//width,height
            content: getRootPath() + '/finance/opsEdit.html?number='+row[0].ops,
            success: function (layero, index) {
                let sonFrame = window['layui-layer-iframe' + index];
                sonFrame.initData(row[0]);
            },
            end:function () {
                search();
                layer.close(index);
            }
        });
    }else {
        layer.alert("请选中一条数据！", {icon: 2});
    }

}

function settlement() {
    let row = $('#dt').datagrid('getSelections');
    if (row.length ==1) {
        let index = layer.open({
            type: 1,
            title: '收回',
            fix: false,
            shadeClose: true,
            area: ['800px', '400px'],//width,height
            content: $('#settlementPage'),
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                let obj = new Object();
                obj.id = row[0].id;
                obj.ywf = $("#ywf").val();
                if(obj.ywf==''){
                    layer.alert("请完善表单数据！", { icon: 2});
                    return;
                }
                obj.companyId = $('#companyId').val();
                if($("#zt").is(":checked")){
                    obj.zt = '1';
                    if(parseFloat(row[0].whsje)>0||parseFloat(row[0].jx)>0){
                        layer.confirm('还有未收回金额及利息，确认要结算吗？',function(index){
                            ajaxSubmit('/finance/settleFinance', obj);
                        });
                    }
                }else{
                    obj.zt = '0';
                    ajaxSubmit('/finance/settleFinance', obj);
                }
                console.log(obj);
            },
            end:function () {
                $('#settlementForm').form('clear');
                layer.close(index);
            }
        });
    }else {
        layer.alert("请选中一条数据！", {icon: 2 });
    }
}