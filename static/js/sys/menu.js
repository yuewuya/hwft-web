let zTreeNodes;
let setting = {
    view: {
        showLine: false,
        showIcon: false,
        addDiyDom: addDiyDom
    },
    data: {
        simpleData: {
            enable: true,
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: "0"
        },
        key: {
            url: "ftp"
        }
    }
};

/**
 * 自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
    let spaceWidth = 15;
    let liObj = $("#" + treeNode.tId);
    let aObj = $("#" + treeNode.tId + "_a");
    let switchObj = $("#" + treeNode.tId + "_switch");
    let icoObj = $("#" + treeNode.tId + "_ico");
    let spanObj = $("#" + treeNode.tId + "_span");
    aObj.attr('title', '');
    aObj.append('<div class="diy swich"></div>');
    let div = $(liObj).find('div').eq(0);
    switchObj.remove();
    spanObj.remove();
    icoObj.remove();
    div.append(switchObj);
    div.append(spanObj);
    let spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
    switchObj.before(spaceStr);
    let editStr = '';
    editStr += '<div class="diy">' + (treeNode.name == null ? '&nbsp;' : treeNode.name) + '</div>';
    let type = treeNode.type == 0 ? '目录' : (treeNode.type == 1 ? '菜单' : '按钮');
    let corpCat = '<div title="' + type + '">' + type + '</div>';
    editStr += '<div class="diy">' + (treeNode.parentName == '-' ? '&nbsp;' : corpCat) + '</div>';
    editStr += '<div class="diy">' + (treeNode.orderNum == null ? '&nbsp;' : treeNode.orderNum) + '</div>';
    editStr += '<div class="diy">' + formatHandle(treeNode) + '</div>';
    aObj.append(editStr);
}

/**
 * 查询数据
 */
function query(menuList) {
    let data = menuList;
    //初始化列表
    zTreeNodes = data;
    //初始化树
    $.fn.zTree.init($("#dataTree"), setting, zTreeNodes);
    //添加表头
    let li_head = ' <li class="head"><a><div class="diy">名称</div><div class="diy">名称</div><div class="diy">类型</div>' +
        '<div class="diy">排序</div><div class="diy" onclick="addSector()">操作(添加目录)</div></a></li>';
    let rows = $("#dataTree").find('li');
    if (rows.length > 0) {
        rows.eq(0).before(li_head)
    } else {
        $("#dataTree").append(li_head);
        $("#dataTree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
    }
}

/**
 * 根据权限展示功能按钮
 * @param treeNode
 * @returns {string}
 */
function formatHandle(treeNode) {
    let htmlStr = '';
    htmlStr += '<div class="icon_div"><a class="icon_edit" title="查看"  href="javascript:view(\'' + treeNode.menuId + '\',\'' + treeNode.type + '\')">查看</a></div>';
    htmlStr += '<div class="icon_div"><a class="icon_edit" title="修改" href="javascript:edit(\'' + treeNode.menuId + '\',\'' + treeNode.type + '\')">修改</a></div>';
    if (treeNode.type == 2) {
        htmlStr += '<div class="icon_div"></div>';
    } else {
        htmlStr += '<div class="icon_div"><a class="icon_add" title="添加子部门" href="javascript:addSector(\'' + treeNode.menuId + '\',\'' + treeNode.type + '\')">添加</a></div>';
    }
    htmlStr += '<div class="icon_div"><a class="icon_del" title="删除" href="javascript:del(\'' + treeNode.menuId + '\',\'' + treeNode.type + '\')">删除</a></div>';
    return htmlStr;
}

function view(treeNode, type) {

}

function edit(menuId, type) {
    openWindow('修改', 'menuSave', menuId);
    if (type != 2) {
        if (type == 1) {
            $("#isChildrenMenuTr").show();
        }else{
            $("#isChildrenMenuTr").hide();
        }
        $("#methodNameTr").hide();
    } else {
        $("#isChildrenMenuTr").hide();
        $("#methodNameTr").show();
    }
}

function addSector(menuId, type) {
    if (type == 1) {
        $("#isChildrenMenuTr").hide();
        $("#methodNameTr").show();
        addButton(menuId);
    } else {
        $("#isChildrenMenuTr").show();
        $("#methodNameTr").hide();
        openWindow('新增', 'menuSave', menuId);
    }
}

function del(menuId, type) {
    ajaxSubmit('/sys/menu/delete/' + menuId, null);
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
        area: ['30%', '60%'],//width,height
        content: $('#' + id),
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            if ('修改' == title) {
                initData(data);
            }
        },
        yes: function (index, layero) {
            let obj = $('#form').getData();
            if (data == undefined || data == null) {
                obj.parentId = 0;
                obj.type = 0;
                ajaxSubmit('/sys/menu/save', obj);
            } else {
                let treeObj = $.fn.zTree.getZTreeObj("dataTree");
                let node = treeObj.getNodeByParam("menuId", data, null);
                if ('修改' == title) {
                    obj.parentId = node.parentId;
                    obj.type = node.type;
                    ajaxSubmit('/sys/menu/update', obj);
                } else {
                    obj.parentId = node.menuId;
                    obj.type = node.type + 1;
                    ajaxSubmit('/sys/menu/save', obj);
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

$(function () {
    //初始化数据
    search();
});

function initData(menuId) {
    ajaxGetInvoke('/sys/menu/info', menuId, function (result) {
        let data = result.menu;
        $('#form').form('load', data);
    });
}

function search() {
    $.ajax({
        type: 'get',
        url: getRootPath() + '/sys/menu/list',
        data: null,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            "token": localStorage.getItem("token")
        },
        success: function (menuList) {
            query(menuList);
        }
    });
}

/**
 * 新增按钮
 */
function addButton(menuId) {
    layer.open({
        type: 1,
        title: "选择按钮",
        fix: false,
        shadeClose: true,
        area: ['20%', '30%'],//width,height
        content: $('#chooseButton'),
        btn: ['确定', '关闭'],
        yes: function (index, layero) {
            let value = $('#chooseSelect option:selected').val();
            let obj = {};
            obj.orderNum = value;
            obj.name = $('#chooseSelect option:selected').text();
            if (value == 1) {
                obj.icon = 'icon-tip';
                obj.methodName = 'showBtn';
            } else if (value == 2) {
                obj.icon = 'icon-add';
                obj.methodName = 'addBtn';
            } else if (value == 3) {
                obj.icon = 'icon-edit';
                obj.methodName = 'editBtn';
            } else if (value == 4) {
                obj.icon = 'icon-remove';
                obj.methodName = 'delBtn';
            } else if (value == 5) {
                obj.icon = 'icon-print';
                obj.methodName = 'printBtn';
            } else if (value == 6) {
                obj.icon = 'icon-ok';
                obj.methodName = 'approveBtn';
            } else {
                obj.name = '';
            }
            openWindow('新增', 'menuSave', menuId);
            $('#form').form('load', obj);
            layer.close(index);
        },
        btn2: function (index) {
            layer.close(index);

        }
    });
}