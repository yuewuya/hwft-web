/**
 * 初始化数据
 */
let loadUrl = '/sys/user/userList';
let saveUrl = '/sys/user/save';
let updateUrl = '/sys/user/update';
let deleteUrl = '/sys/user/delete';
let dictArr = [];
let allDict = {};
$(function () {
    if (dictArr.length > 0) {
        ajaxDictQuery(dictArr, function (data) {
            allDict = data;
            initTable();
        });
    } else {
        initTable();
    }
});

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
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'createTime',
            title: '创建时间',
            width: 200,
            align: 'left',
            formatter: function (value, row) {
                return value != null ? moment(value).format("MM月DD日 HH时mm分") : '';
            }
        }, {
            field: 'username',
            title: '用户名',
            width: 200,
            align: 'center'
        }, {
            field: 'departmentName',
            title: '部门',
            width: 100,
            align: 'center'
        }, {
            field: 'roles',
            title: '角色',
            width: 200,
            align: 'center',
            formatter: function (value, row) {
                let obj = row.roles;
                if(obj.length > 0){
                    let str = '';
                    for(let i = 0 ;i<obj.length;i++){
                        str = str + ',' + obj[i].roleName;
                    }
                    return str .replace(',','');
                }else{
                    return '没有配置角色';
                }
            }
        }, {
            field: 'email',
            title: '邮箱',
            width: 200,
            align: 'center'
        }, {
            field: 'mobile',
            title: '手机',
            width: 200,
            align: 'center'
        }, {
            field: 'status',
            title: '状态',
            width: 100,
            align: 'center',
            formatter: function (value, row) {
                return value == 0 ? '禁用' : '正常';
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search(obj) {
    if (obj) {
        $("#departmentName").val(obj.departmentName);
        $("#username").val(obj.username);
    }
    $('#dg').datagrid('reload', {departmentName: $("#departmentName").val(), username: $("#username").val()});
}


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
        area: ['30%', '50%'],//width,height
        content: $('#' + id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                initData(data);
            }
        },
        yes: function (index, layero) {
            let obj = getFormData();
            if (obj) {
                if (obj.userId != '' && obj.userId != null) {
                    ajaxSubmit(updateUrl, obj);
                } else {
                    //新增用户设置初始密码
                    obj.password = '123456';
                    obj.status = 1;
                    ajaxSubmit(saveUrl, obj);
                }
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        },
        end: function () {
            $('#form').form('clear');
        }
    });
}

/**
 * 获取材料设置的数据
 */
function initData(row) {
    if(row.roles.length > 0){
        row.roleName = row.roles[0].roleName;
        row.roleId = row.roles[0].roleId;
    }
    $('#form').form('load', row);
}

function getFormData() {
    let obj = $('#form').getData();
    let arr = [obj.roleId];
    obj.roleIdList = arr;
    return obj;
}

/**
 * 选择部门
 */
function chooseDepartment(title, url) {
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['80%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getSelections();
            console.log(obj);
            $("#departmentNameValue").val(obj.depName);
            $("#departmentValue").val(obj.id);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}


