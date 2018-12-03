function search(roleId) {
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
            query(menuList);
        }
    });
}

/**
 * 查询数据
 */
function query(menuList) {
    let t = $("#tree");
    t = $.fn.zTree.init(t, setting, menuList);
    t.expandAll(true);
}

let zTree;
let setting = {
    check: {
        enable: true,
        chkboxType: {"Y": "ps", "N": "ps"}
    },
    view: {
        dblClickExpand: false,
        showLine: true,
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            icon: "nothing",
            rootPId: "0"
        },
        key: {
            name: "name"
        }
    },
    callback: {
        beforeClick: function (treeId, treeNode) {
            let zTree = $.fn.zTree.getZTreeObj("tree");
            if (treeNode.isParent) {
                zTree.expandNode(treeNode);
                return false;
            } else {
                return true;
            }
        }
        //,beforeCheck: Check
    }
};

//获取选中的数据
function getFormData() {
    let zTree = $.fn.zTree.getZTreeObj("tree");
    let nodes = zTree.getCheckedNodes(true);
    let arr = [];
    for (let i = 0; i < nodes.length; i++) {
        arr[i] = {menuId: nodes[i].menuId, name: nodes[i].name};
    }
    return arr;
}

