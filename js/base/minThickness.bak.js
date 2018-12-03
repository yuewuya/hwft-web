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
    mounted() {
        this.shapes = this.loadShapes();
        this.steelGrades = this.loadSteelGrades();
        this.processingMethods = this.loadProcessingMethods();
    },
    methods: {
        resetSearch(){
            this.searchForm = {};
        },
        setSearchShape(o){
            this.searchForm.shape = o;
        },
        setSearchSteelGrade(o){
            this.searchForm.steelGrade = o;
        },
        setDataShape(o){
            this.dataForm.shape = o;
        },
        setDataSteelGrade(o){
            this.dataForm.steelGrade = o;
        },
        setDataProcessingMethod(o){
            this.dataForm.processingMethod = o;
        },
        shapeSearch(queryString, cb) {
            let shapes = this.shapes;
            let results = queryString ? shapes.filter(this.createFilter(queryString)) : shapes;
            cb(results);
        },
        steelGradeSearch(queryString, cb) {
            let steelGrades = this.steelGrades;
            let results = queryString ? steelGrades.filter(this.createFilter(queryString)) : steelGrades;
            cb(results);
        },
        processingMethodSearch(queryString, cb) {
            let processingMethods = this.processingMethods;
            let results = queryString ? processingMethods.filter(this.createFilter(queryString)) : processingMethods;
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadShapes() {  return ["圆形","长方形","椭圆形","菱形"]; },
        loadSteelGrades() {return ["不锈钢","碳素钢","Q235B","其他"];},
        loadProcessingMethods() {return ["冷冲压","热冲压","冷旋压","热旋压"]},
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
            AjaxDelete('/minThickness/delete', arr, then);
        },
        //表格数据变化绑定
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //提交
        onSubmit() {
            let then = this;
            this.$refs['dataForm'].validate((valid) => {
                if(then.dataForm.diameterInout){
                    then.dataForm.diameterInout = 1;
                }else{
                    then.dataForm.diameterInout = 0;
                }
                if (valid) {
                    AjaxSubmit('/minThickness/save', then.dataForm, then);
                } else {
                    then.$message.error('请完善表单数据');
                    return false;
                }
            });
        },
        //加载表格数据
        searchTable(){
            this.searchParams = this.searchForm;
            this.loadTableData();
        },

        changePage(page){
            this.searchParams.page = page;
            this.loadTableData();
        },

        loadTableData(){
            let then = this;
            let temp = this.searchParams;
            AjaxPost('/minThickness/findAll', temp, then,
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
            let then = this;
            let temp = {id: row.id};
            then.dialogFormVisible = true;
            AjaxPost('/minThickness/findById', temp, then,
                function (data) {
                    if(data.diameterInout == 1){
                        data.diameterInout = true;
                    }else{
                        data.diameterInout = false;
                    }
                    then.dataForm = data;
                });
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
            shapes: [],
            steelGrades: [],
            processingMethods: [],
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
            searchForm: {
                shape: '',
                steelGrade: '',
                wallThickness: ''
            },
            rules: {
                shape: [{
                    required: true,
                    message: '形状不能为空',
                    trigger: 'change'
                }
                ],
                steelGrade: [{
                    required: true,
                    message: '钢种不能为空',
                    trigger: 'change'
                }
                ],
                processingMethod: [{
                    required: true,
                    message: '加工方法不能为空',
                    trigger: 'change'
                }
                ],
                diameter1: [{
                    required: true,
                    message: '最小直径不能为空',
                    trigger: 'change'
                }, {type: 'number', message: '最小直径必须为数字值', trigger: ['blur', 'change']}
                ],
                diameter2: [{type: 'number', message: '最大直径必须为数字值', trigger: ['blur', 'change']}
                ],
                wallThickness: [{
                    required: true,
                    message: '壁厚不能为空',
                    trigger: 'change'
                }, {
                    type: 'number',
                    message: '壁厚必须为数字值',
                    trigger: ['blur', 'change']
                }],
                minwallThickness:[{
                    required: true,
                    message: '最小壁厚不能为空',
                    trigger: 'change'
                }, {
                    type: 'number',
                    message: '最小壁厚必须为数字值',
                    trigger: ['blur', 'change']
                }]
            }
        }
    }
}
let Ctor = Vue.extend(Main);
new Ctor().$mount('#app');