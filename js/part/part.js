let loadUrl = '/part/list';
let submitUrl = '/part/save';
let findByIdUrl = '/part/findOne';
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
        idField: 'id',
        url: getRootPath() + loadUrl,
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'machine',
            title: '机器',
            width: 150,
            align: 'center'
        }, {
            field: 'category',
            title: '保修类别',
            width: 150,
            align: 'left',
            formatter:function (value,row) {
                var str="";
                if(value==1)
                    str="报修";
                if(value==2)
                    str="保养";
                return "<label>"+str+"</label>";
            }
        }, {
            field: 'condition',
            title: '状况',
            width: 350,
            align: 'center'
        },{
            field: 'createName',
            title: '人员',
            width: 100,
            align: 'left'

        }, {
            field: 'createTime',
            title: '时间',
            width: 130,
            align: 'left',
            formatter: function (value, row) {
                return moment(value).format("YYYY年 MM月 DD日");
            }
        },{
            field: 'isompelte',
            title: '是否完成',
            width: 150,
            align: 'left',
            formatter:function (value,row) {
                var str="";
                if(value==1)
                    str="完成";
                else
                    str="未完成";
                return "<label>"+str+"</label>";
            }
        }]],
        onLoadError: function (XMLHttpRequest) {

        }
    });
}

/**
 * 搜索
 */
function search() {
    $('#dg').datagrid('reload', {
        // searchName:$('#searchName').combobox('getValue'),
        // searchTitle:$("#searchTitle").val()
    });
}

/**
 * 弹出层
 * @param title
 * @param url
 * @param data
 */
function openWindow(title, url, data) {
    layer.open({
        type: 2,
        title: title,
        fix: false,
        shadeClose: true,
        area: ['100%', '100%'],//width,height
        content: getRootPath() + url,
        btn: ['确定', '关闭'],
        success: function (layero, index) {
            let sonFrame = window['layui-layer-iframe' + index];
            if(data && data != null){
                ajaxPostInvoke(findByIdUrl, {id : data.id}, function (res) {
                    sonFrame.initData(res);
                })
            }else {
                sonFrame.initData();
            }
        },
        yes: function (index, layero) {
            let obj = window[layero.find('iframe')[0]['name']].getFormData();
            if (obj) {
                ajaxSubmit(submitUrl, obj);
            }
            console.log(obj);
        },
        btn2: function () {
            layer.closeAll();
        }
    });
}
