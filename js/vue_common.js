let basePaginationA = {
    created: function () {
        console.log('father-created');
    },
    mounted: function () {
        console.log('father-mounted');
        let then = this;
        const loading = this.$loading({
            lock: true,
            text: '玩命加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(211 ,211 ,211, 0.7)'
        });
        ajaxDictQuery(then.dictArr, then, function (data) {
            then.loadDict(data, function () {
                then.loadTableData();
                then.sonInit();
            });
        });
        then.pageShow = true;
        loading.close();
    },
    methods: {
        //改变分页数据
        changePage(page) {
            this.searchParams.page = page;
            this.loadTableData();
        },
        //时间格式化
        dateFormat(date, format) {
            if (date == undefined) {
                return "";
            }
            return moment(date).format(format);
        },
        //加载字典项
        loadDict(data, successFuc) {
            let then = this;
            if (data != undefined) {
                then.dictArr = data;
            }
            successFuc();
        },
        //字典项格式化
        dictFormat(data, dict) {
            let then = this;
            if (data == undefined) {
                return "";
            }
            return then.compareDict(dict, data);
        },
        changePage(page) {
            this.searchParams.page = page;
            this.loadTableData();
        },
        //匹配字典详情
        compareDict(type, key) {
            if (type == null || key == null) {
                return null;
            }
            return this.dictArr[type][key].info;
        },
        //匹配字典类型
        compareDropDict(type) {
            if (type == null) {
                return null;
            }
            let obj = new Object();
            for (let s = 0; s < type.length; s++) {
                let arr = new Array();
                let i = 0;
                for (let key in this.dictArr[type]) {
                    arr[i] = {infoCode: key, info: this.dictArr[type][key].info};
                    i++
                }
                obj[type[s]] = arr;
            }
            return obj;
        },
        //提交表单
        onSubmit() {
            let then = this;
            this.$refs[then.formId].validate((valid) => {
                if (valid) {
                    AjaxSubmit(then.submitUrl, then[then.formId], then);
                } else {
                    then.$message.error('请完善表单数据');
                    return false;
                }
            });
        },
        //带参数搜索表格数据
        searchTable() {
            let data = this.searchForm.data;
            let select = this.searchForm.select;
            this.searchParams = {page: 1, limit: 10};
            this.searchParams[select] = data;
            this.loadTableData();
        },
        //加载表单
        loadTableData() {
            let then = this;
            let temp = this.searchParams;
            AjaxPost(then.loadUrl, temp, then,
                function (data) {
                    then.tableData = data.list;
                    then.pageData.total = data['totalCount'];
                    then.pageData.currentPage = data['currPage'];
                    then.loading = false;
                });
        },
        //删除表格数据
        del() {
            let then = this;
            AjaxDelete(then.delUrl, then.multipleSelection, then);
        },
        //查看
        show(row) {
            let then = this;
            this.initFormDataFromTable(row);
            if(funExists(then.showCallBack)){
                then.showCallBack();
            }
        },
        //编辑
        edit(row) {
            this.initFormDataFromTable(row);
            let then = this;
            then.submitShow = true;
            if(funExists(then.editCallBack)){
                then.editCallBack();
            }
        },
        //新增
        add() {
            let then = this;
            then.dialogFormVisible = true;
            this.resetForm();
            then.submitShow = true;
            if(funExists(then.addCallBack)){
                then.addCallBack();
            }
        },
        //从后台加载表单数据
        initFormData(row) {
            let then = this;
            then.dialogFormVisible = true;
            AjaxPost(then.formDataUrl, {id: row.id}, then,
                function (data) {
                    then[then.formId] = data;
                });
        },
        //直接加载页面表单数据
        initFormDataFromTable(row) {
            let then = this;
            then.dataForm = JSON.parse(JSON.stringify(row));
            then.submitShow = false;
            then.dialogFormVisible = true;
        },
        resetForm() {
            this.dataForm = {};
        },
        //表格数据变化绑定
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    },
    data: function () {
        return {
            multipleSelection: [],//表格1选中数据
            dataForm: {},//表单数据
            submitShow: true,//提交按钮显示 true显示 false隐藏
            tableData: null,//表格数据
            dictArr: null,//表格业务字典数组
            sites: null,
            //分页选择数据
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            //搜索框数据
            searchParams: {
                page: 1,  //页码
                limit: 10,//每页条数
            },
            pageShow: false,//loading显示
            fullscreenLoading: false,//加载显示
            //表格搜索参数
            searchForm: {
                data: '',
                select: ''
            },
            loading: true,
            fullscreenLoading: false,//loading层
            dialogFormVisible: false,//弹出层显示，隐藏
        }
    }
}