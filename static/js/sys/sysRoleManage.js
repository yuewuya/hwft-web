/**
 * 初始化数据
 */
let loadUrl = '/sysRole/list';
let submitUrl = '/sysRole/update';
let dictArr = [];
let allDict = {};
let menuList = null;
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
        idField: 'roleId',
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
                return moment(value).format("MM月DD日 HH时mm分");
            }
        }, {
            field: 'roleName',
            title: '角色名称',
            width: 200,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 300,
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
    $('#dg').datagrid('reload', {roleName: $("#roleName").val()});
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
        area: ['50%', '50%'],//width,height
        content: $('#' + id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if (data) {
                initData(data);
                searchMenuList(data.roleId, function (list) {
                    menuList = list;
                    let name = '';
                    for (let i = 0; i < list.length; i++) {
                        if(list[i].checked){
                            name = name + ',' + list[i].name;
                        }
                    }
                    $("#menuNameList").val(name.replace(',',''));
                });
            }
        },
        yes: function (index, layero) {
            let obj = getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
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
    $('#form').form('load', row);
}

function getFormData() {
    let obj = $('#form').getData();
    obj.menuIdList = $("#menuIdList").val().split(',');
    if (obj.depName == '') {
        layer.alert("请填写部门！", {icon: 2});
        return;
    }
    return obj;
}

function selectRole(title, url) {
    let obj = getSelections();
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['40%', '80%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            sonFrame.query(menuList);
        },
        yes: function (index, layero) {
            let sonFrame = window['layui-layer-iframe' + index];
            let arr = sonFrame.getFormData();
            let str = '';
            let menuIdList = '';
            for (let i = 0; i < arr.length; i++) {
                str = str + ',' + arr[i].name;
                menuIdList = menuIdList + ',' + arr[i].menuId;
            }
            $("#menuNameList").val(str.replace(",", ""));
            $("#menuIdList").val(menuIdList.replace(",", ""));
            console.log(arr);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);
        }
    });
}

function searchMenuList(roleId, successFuc) {
    $.ajax({
        type: 'get',
        url: getRootPath() + '/sys/menu/userRole/' + roleId,
        data: null,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            "token": localStorage.getItem("token")
        },
        success: function (data) {
            let menuList = data.menuList;
            for (let i = 0; i < menuList.length; i++) {
                delete menuList[i].url;
                delete menuList[i].icon;
            }
            successFuc(menuList);
        }
    });
}

