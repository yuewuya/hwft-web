/**
 * 初始化数据
 */
const loadUrl = '/drawing/drawingList';
const submitUrl = '/drawing/drawingUpdate';
const auditUrl = '/drawing/audit';
$(function(){
    initTable();
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
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'drawee',
            title: '支款人',
            align: 'center',
            width: '200'
        }, {
            field: 'team',
            title: '班组',
            align: 'center',
            width: '200'
        }, {
            field: 'amoutBranch',
            title: '支款金额',
            align: 'center',
            width: '200'
        }, {
            field: 'factoryTime',
            title: '进厂时间',
            align: 'center',
            width: '200',
            formatter: function (value, row) {
                return moment(value).format("YYYY-MM-DD");
            }
        }, {
            field: 'createName',
            title: '申请人',
            align: 'center',
            width: '200'
        }, {
            field: 'createTime',
            title: '时间',
            align: 'center',
            width: '200',
            formatter: function (value, row) {
                return moment(value).format("YYYY-MM-DD");
            }
        }, {
            field: 'status',
            title: '状态',
            align: 'center',
            width: '200',
            formatter: function (value, row) {
                let str="";
                if(value==2)
                    str="已提交";
                if(value==3)
                    str="财务审核";
                return "<label>"+str+"</label>";
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}
layer.ready(function() {
    //官网欢迎页
});

$('.tablelist3 tbody tr:odd').addClass('odd');

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, id, data) {
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['100%', '100%'],//width,height
        content: $('#'+id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            $("#advice").hide();
            $("#repaly").hide();
            if (data) {
                initData(data);
            }

        },
        yes: function (index, layero) {
            let obj = getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
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
        let data = $('#savePageForm').getData();
        if(!data.names || data.names == ''){
            layer.alert("发送对象不能为空！",{icon: 2});
            return null;
        }else{
            let flag = $("#switch").switchbutton("options").checked;
            if(flag){
                data.departIds = data.ids;
                data.departNames = data.names;
                data.userIds = '';
                data.userNames = '';
            }else {
                data.userIds = data.ids;
                data.userNames = data.names;
                data.departIds = '';
                data.departNames = '';
            }
            return data;
        }
    }
}

function search() {
    let obj = {};
    obj.searchName=$("#searchName").val();
    obj.searchTitle=$("#searchTitle").val();
    obj.page = 1;
    $('#dg').datagrid('reload', obj);
}

function lookBtn(title,id) {
    let rows = $('#dg').datagrid('getSelections');
    if (rows.length != 1) {
        layer.alert("请选择一条需要查看的数据！", {
            icon: 2
        });
        return;
    }
    layer.open({
        type: 1,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['800px', '400px'],//width,height
        content: $('#'+id),
        success: function (layero, index) {
            initData(rows[0]);
        },
        end:function () {
            $('#savePageForm').form('clear');
            $('#saveDepartForm').form('clear');
        }
    });
}

function audit(id) {
    let rows = $('#dg').datagrid('getSelections');
    if(rows.length == 1){
        layer.open({
            type: 1,
            title: '审核',
            fix: false,
            shadeClose: true,
            area: ['100%', '100%'],//width,height
            content: $('#'+id),
            btn: ['确定', '关闭'],
            success: function (layero, index) {
                $("#advice").show();
                $("#repaly").show();
                initData(rows[0]);
            },
            yes: function (index, layero) {
                let obj = new Object();
                obj.financialAdvice = $('#financialAdvice').val();
                obj.officialRepaly = $('#officialRepaly').val();
                obj.id = $('#id').val();
                if(obj.financialAdvice==''){
                    layer.alert("请完善表单数据！",{icon: 2});
                }else {
                    ajaxSubmit(auditUrl, obj);
                }
            },
            btn2: function () {
                layer.closeAll();
            },
            end:function () {
                $('#savePageForm').form('clear');
            }
        });
    }else {
        layer.alert("请选中一条数据！", {
            icon: 2
        });
    }

}
