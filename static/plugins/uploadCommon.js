/** 文件上传js  --典型的码农 */
/** 重写后台方法需注意 文件上传后台Servlet 必须返回一个json  */

/**
 * 业务ID此处写死 根据自己业务需求来定义
 * */
/**
 * 初始化fileinput
 * **/
var FileInput = function () {
    let oFile = {};

    // 初始化fileinput控件（第一次初始化）
    /**
     * 入参说明
     * ctrlName：控件ID值
     * uploadUrl：上传地址
     * shwoKey：是否显示上传按钮和上传框 主要用于查看
     * imgPathArray：初始化数据path数组 主要用于查看和修改
     * imgNameArray：初始化数据name数组
     * maxFileCount：允许同时上传的最大文件个数
     * **/
    oFile.Init = function (uploadUrl, imgPathArray, imgNameArray, downArr,obj) {
        let control = $('#' + obj.ctrlName);
        let layoutTemplates = getLayoutTemplates(obj);
        // 初始化上传控件的样式
        control.fileinput({
            'theme': 'explorer',
            language: 'zh', // 设置语言
            uploadUrl: uploadUrl, // 上传的地址
            allowedFileExtensions: obj.allowedFileExtensions,// 接收的文件后缀 例[*.jpg,*.png]
            showPreview: obj.showPreview,
            overwriteInitial: obj.overwriteInitial,
            previewFileIcon: '<i class="fa fa-file"></i>',
            dropZoneEnabled: obj.dropZoneEnabled,//是否显示拖拽区域
            maxFileCount: obj.maxFileCount, // 表示允许同时上传的最大文件个数
            showUpload: obj.showUpload, //是否显示上传按钮
            showRemove: obj.showRemove, //显示移除按钮
            showBrowse: obj.showBrowse,//是否显示选择按钮
            showCaption: obj.showCaption,//是否显示选择输入框
            allowedPreviewType: obj.allowedPreviewType,
            enctype: 'multipart/form-data',
            maxFileSize: obj.maxFileSize,
            validateInitialCount: obj.validateInitialCount,
            previewFileIcon: obj.previewFileIcon,//是否显示文件icon 默认图片是直接显示缩略图 文件会展示相关内容
            msgFilesTooMany: obj.msgFilesTooMany,
            preferIconicPreview: obj.preferIconicPreview,//是否强制相关文件展示icon
            initialPreviewAsData: obj.initialPreviewAsData,
            previewFileIconSettings: obj.previewFileIconSettings, //配置相关文件展示的icon
            initialPreview: imgPathArray,
            initialPreviewConfig: imgNameArray,
            otherActionButtons: '<button type="button" class="kv-file-down btn btn-sm btn-default" {dataKey} title="下载附件"><i class="fa fa-cloud-download"></i></button>',
            layoutTemplates: layoutTemplates
        }).on("filebatchselected", function (event, files) {
            //选择文件后处理事件
            $(this).fileinput("upload");
        }).on("fileuploaded", function (event, data, previewId, index) {
            //otherActionButtons绑定事件 下载按钮绑定
        });
        //异步上传返回结果处理
        $(control).on("fileuploaded", function (event, data, previewId, index) {
            layer.alert('上传成功！', {icon: 1}, function () {
                layer.closeAll();
            });

            let ons = data.response;
            let delUrl = getUrlPath('/UploadServlet', "&cmd=delete&bizid=" + obj.bizid + "&id=" + ons.id);
            let downUrl = getUrlPath('/UploadServlet', "&cmd=download&id=" + ons.id);
            //绑定下载按钮事件
            $("#" + previewId).find(".kv-file-down").click(function () {
                console.log('开始绑定下载按钮！！！');
                window.location.href = downUrl;
            });

            //绑定删除按钮事件
            $("#" + previewId).find(".kv-file-remove").click(function () {
                console.log('开始删除！！！');
                $.ajax({
                    url: delUrl,
                    type: "post",
                    dataType: "json",
                    success: function (result) {
                        layer.alert('删除成功！', {icon: 1}, function () {
                            layer.closeAll();
                        });
                    },
                    error: function (result) {
                        layer.alert("删除失败！", {icon: 2});
                    }
                });
            });
        });
        //异步上传返回错误结果处理
        $(control).on('fileerror', function (event, data, msg) {
            layer.alert("上传失败！" + textStatus + jqXHR.status + jqXHR.readyState, {icon: 2});
        });
        //上传前
        $(control).on('filepreupload', function (event, data, previewId, index) {
            console.log('准备上传。。。。。');
        });
        //删除预处理
        $(control).on('filepredelete', function (event, key) {
            console.log('开始删除。。。。。');
        });
        //删除后
        $(control).on('filedeleted', function (event, key) {
            layer.alert('删除成功！', {icon: 1}, function () {
                layer.closeAll();
            });
        });

        /**
         * 初始化下载链接
         */
        let downSetting = $(control).data('fileinput').$preview.find(".kv-preview-thumb .kv-file-down");
        for (let i = 0; i < downSetting.length; i++) {
            downSetting[i].onclick = function () {
                window.location.href = downArr[i];
            }
        }
    };
    return oFile;
};

/**
 * 其他按钮（如下载）绑定时间
 */
FileInput.prototype.downloadHandler = function (fileobj) {
    if (!fileobj)
        fileobj = $(this.options.showContainer);
    var objs = $(fileobj).data('fileinput').$preview.find(".kv-preview-thumb .kv-file-down");
    objs.unbind("click");
    objs.on("click", function () {
        //点击下载
        window.location.href = basePath + "/file/download/" + $(this).data("key");
    });
};

/**
 *   初始化fileinput数据 用于已上传数据的插件 做编辑 查看使用
 *   例:项目关联多个图片（文件） 查项目时需要查出所有的图片 那么项目和图片的关系ID作为父ID
 *   入参说明
 *   domId：控件ID值
 *   bizid:  父ID（业务id/分类id 根据需求自定义）用于批量查出同一类的文件
 *   maxInput:最大文件个数
 *   readOnly:只读 true false
 * */
function initFileInputData(obj) {
    let initUrl = getUrlPath('/UploadServlet', "&cmd=initFileInput&bizid=" + obj.bizid);
    $.ajax({
        url: initUrl,
        type: "post",
        dataType: "json",
        success: function (result) {
            //成功操作
            let pathArr = [];//文件查看地址 集合
            let nameArr = [];//文件删除地址 集合
            let downArr = [];//文件下载地址 集合
            $(result).each(function () {
                pathArr.push(getUrlPath(this.sysPath));//文件访问地址 这里需要网络地址  例：http://localhost:8080/xxx/xx.jpg
                let obj = {};
                obj.caption = this.realName;
                obj.size = this.size;
                obj.bizid = this.bizid;
                obj.url = getUrlPath('/UploadServlet', "&cmd=delete&bizid=" + obj.bizid + "&id=" + this.id);//用于初始化文件删除事件地址
                nameArr.push(obj);
                downArr.push(getUrlPath('/UploadServlet', "&cmd=download&id=" + this.id));
            });
            let oFileInput = new FileInput();
            oFileInput.Init(getUrlPath('/UploadServlet', "&cmd=upload&bizid=" + obj.bizid), pathArr, nameArr,downArr, obj);
        },
        error: function (result) {
            //异常操作
        }
    });
}

function initFileInputBatch(arr) {
    for (let i = 0; i < arr.length; i++) {
        initFileInputData(arr[i]);
    }
}

/**
 * 创建一个参数对象
 * @returns {Object}
 */
function fileInputData(ctrlName, bizid) {
    let obj = {};
    obj.ctrlName = ctrlName;
    obj.bizid = bizid;
    obj.allowedFileExtensions = [];// 接收的文件后缀 例[*.jpg,*.png]
    obj.maxFileCount = 1;// 表示允许同时上传的最大文件个数
    obj.showUpload = false;//是否显示上传按钮
    obj.overwriteInitial = false;
    obj.showRemove = false; //显示移除按钮
    obj.showBrowse = true;//是否显示选择按钮
    obj.showCaption = true;//是否显示选择输入框
    obj.validateInitialCount = true;//验证初始计数
    obj.previewFileIcon = true;//是否显示文件icon 默认图片是直接显示缩略图 文件会展示相关内容
    obj.msgFilesTooMany = "选择上传的文件数量({n}) 超过允许的最大数值{m}！";
    obj.preferIconicPreview = true;//是否强制相关文件展示icon
    obj.initialPreviewAsData = true;
    obj.actionUpload = true;//是否隐藏上传小图标
    obj.actionDelete = false;//是否隐藏删除小图标
    obj.dropZoneEnabled = false;//是否显示拖拽区域
    obj.previewFileIconSettings = {
        'docx': '<i class="fa fa-file-word-o text-primary"></i>',
        'doc': '<i class="fa fa-file-word-o text-primary"></i>',
        'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
        'xls': '<i class="fa fa-file-excel-o text-success"></i>',
        'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
        'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
        'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
        'rar': '<i class="fa fa-file-archive-o text-muted"></i>',
        'sql': '<i class="fa fa-file-word-o text-primary"></i>'
    };
    obj.maxFileSize = 10240;//最大文件大小 kb
    obj.layoutTemplates = getLayoutTemplates(obj);
    obj.allowedPreviewType = true;
    obj.showData = function () {
        console.log(obj);
    };
    return obj;
}

function getLayoutTemplates(obj) {
    return obj.actionUpload ? (obj.actionDelete ? {
        actionUpload: '',
        actionDelete: ''
    } : {actionUpload: ''}) : (obj.actionDelete ? {actionDelete: ''} : {});
}


