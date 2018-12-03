/**
 * 初始化页面元素
 */
let Main = {
    created: function () {
        const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(211 ,211 ,211, 0.7)'
        });
        setTimeout(() => {
            this.loadTableData();
            loading.close();
        }, 500);
    },
    mounted: function () {
    },
    methods: {
        handleClick(row) {
            alert(row.ckcz);
        },
        //新增
        add() {
            let then = this;
            then.dialogFormVisible = true;
            this.resetForm();
            then.submitShow = true;
        },
        //查看
        show(row) {
            this.initFormData(row);
            let then = this;
            then.submitShow = false;
        },
        //编辑
        edit(row) {
            this.initFormData(row);
            let then = this;
            then.submitShow = true;
        },
        //删除
        del() {
            let then = this;
            let arr = then.multipleSelection;
            AjaxDelete('/baseStandard/deleteBaseStandard', arr, then);
        },
        //表格数据变化绑定
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //提交
        onSubmit() {
            let then = this;
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    AjaxSubmit('/baseStandard/saveBaseStandard', then.dataForm, then);
                } else {
                    then.$message.error('请完善表单数据');
                    return false;
                }
            });
        },
        //加载表格数据
        searchTable(){
            let data = this.searchForm.data;
            let select = this.searchForm.select;
            this.searchParams = {page : 1, limit : 10};
            this.searchParams[select] = data;
            this.loadTableData();
        },

        changePage(page){
            this.searchParams.page = page;
            this.loadTableData();
        },

        loadTableData(){
            let then = this;
            let temp = this.searchParams;
            AjaxPost('/baseStandard/findAll', temp, then,
                function (data) {
                    then.tableData = data.list;
                    then.pageData.total = data.totalCount;
                    then.pageData.currentPage = data.currPage;
                });
        },
        resetForm() {
            this.dataForm = {};
        },
        //加载表单数据
        initFormData(row) {
            this.dialogFormVisible = true;
            let id = row.id;
            let standard = row.standard ;
            let type = row.type;
            this.dataForm = {id:id, standard:standard, type:type};
        },
        //过度动画
        openFullScreen() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 2000);
        },
        //时间格式化
        dateFormat: function (row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
            return moment(date).format("MM月DD日 HH时mm分");
        }
    },
    data() {
        return {
            sites: [
                { id:'1',name: '是' },
                { id:'0',name: '否' }
            ],
            fullscreenLoading: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            searchParams: {
                page : 1,
                limit : 10,
            },
            tableData: null,
            submitShow: true,
            multipleSelection: [],
            dialogFormVisible: false,
            dataForm: {},

            rules: {

                standard: [{
                    required: true,
                    message: '标准',
                    trigger: 'change'
                }
                ],
                type: [{
                    required: true,
                    message: '类型',
                    trigger: 'change'
                }
                ]

            }
        }
    }
}
let Ctor = Vue.extend(Main);
new Ctor().$mount('#app');