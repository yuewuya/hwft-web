/**
 * 初始化数据
 */
const loadUrl = '/payment/list';
const submitUrl = '/payment/update';
const auditUrl = '/payment/audit';
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
            field: 'paymentMethod',
            title: '付款方式',
            align: 'center',
            width: '200'
        }, {
            field: 'collectionUnit',
            title: '收款单位',
            align: 'center',
            width: '200'
        }, {
            field: 'collectionBank',
            title: '开户行',
            align: 'center',
            width: '200'
        }, {
            field: 'collectionAccounts',
            title: '账号',
            align: 'center',
            width: '200'
        }, {
            field: 'paymentPurpose',
            title: '付款用途',
            align: 'center',
            width: '200'
        }, {
            field: 'applicant',
            title: '申请人',
            align: 'center',
            width: '200'
        }, {
            field: 'dateTime',
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
                    str="总经理批准";
                if(value==4)
                    str="采购部转发";
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
            let day = new Date();
            if (data) {
                initData(data);
            }

        },
        yes: function (index, layero) {
            let obj = getFormData();
            if (obj) {
                obj.userIds = userIds;
                ajaxSubmit(submitUrl, obj);
            }
        },
        btn2: function () {
            layer.closeAll();
        },
        end:function () {
            userIds = '';
            loadDep = false;
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
        }
    });
}

function audit(id,title) {
    let rows = $('#dg').datagrid('getSelections');
    if(rows.length == 1){
        layer.open({
            type: 1,
            title: title,
            fix: false,
            shadeClose: true,
            area: ['100%', '100%'],//width,height
            content: $('#'+id),
            btn: ['确定', '关闭'],
            success: function (layero, index) {

                rows[0].userIds = '';
                rows[0].userNames='';
                rows[0].departIds='';
                rows[0].departNames='';
                initData(rows[0]);


            },
            yes: function (index, layero) {
                let obj = new Object();
                let flag = $("#switch").switchbutton("options").checked;
                obj.id = rows[0].id;
                if(flag){
                    obj.departIds = $('#name').val();
                    obj.userIds = '';
                }else {
                    obj.userIds = $('#name').val();
                    obj.departIds = '';
                }
                ajaxSubmit(auditUrl, obj);
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
