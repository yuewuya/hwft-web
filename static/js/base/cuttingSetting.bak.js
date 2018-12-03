/**
 * 初始化页面元素
 */
let Main = {
    created: function () {
        console.log('son-created');
        let arr = new Array();
        this.dictArr = arr;
    },
    mounted: function () {
        console.log('son-mounted');
        this.shapes = this.loadShapes();
        this.processingMethods = this.loadProcessingMethods();
    },
    methods: {
        resetSearch(){
            this.searchForm = {};
        },
        loadShapes() {  return ["圆形","长方形","椭圆形","菱形"]; },
        loadProcessingMethods() {return ["冷冲压","热冲压","冷旋压","热旋压"]},
        //加载表格数据
        searchTable(){
            this.searchParams = this.searchForm;
            this.loadTableData();
        },
        //行格式化方法
        rowFormatter: function (row, column) {
            let then = this;
            let data = row[column.property];
            switch (column.property) {
                case 'updateTime':
                    return then.dateFormat(data,'YYYY-MM-DD HH:mm');
                default:
                    return data;
            }
        }
    },
    data() {
        return {
            shapes: [],
            processingMethods: [],
            delUrl: '/cuttingSetting/cuttingDelete',//删除url
            loadUrl: '/cuttingSetting/cuttingList',//加载表格数据url
            formDataUrl: '/cuttingSetting/cuttingInfo',//获取表单数据url
            submitUrl: '/cuttingSetting/cuttingUpdate',//提交表单数据url
            formId: 'dataForm',//表单id
            //表格列
            tableRow: [
                {prop: 'updateTime', label: '更新时间', width: 180},
                {prop: 'processingMethod', label: '加工方法', width: 120},
                {prop: 'shape', label: '形状', width: 120},
                {prop: 'diameter', label: '直径', width: 120},
                {prop: 'thicknessLeft', label: '<=壁厚', width: 120},
                {prop: 'thicknessRight', label: '壁厚<', width: 120},
                {prop: 'cutting', label: '下料', width: 120}
            ],
            rules: {
                processingMethod: [{
                    required: true,
                    message: '加工方法',
                    trigger: 'change'
                }
                ],
                shape: [{
                    required: true,
                    message: '形状',
                    trigger: 'change'
                }
                ],
                diameter: [{
                    required: true,
                    message: '直径',
                    trigger: 'blur'
                }, {type: 'number', message: '直径必须为数字值', trigger: ['change', 'change']}
                ],
                thicknessLeft: [{
                    required: true,
                    message: '<=壁厚',
                    trigger: 'blur'
                }, {type: 'number', message: '<=壁厚必须为数字值', trigger: ['blur', 'change']}
                ],
                thicknessRight: [{
                    required: true,
                    message: '壁厚<',
                    trigger: 'blur'
                }, {
                    type: 'number',
                    message: '壁厚<必须为数字值',
                    trigger: ['blur', 'change']
                }],
                cutting: [{
                    required: true,
                    message: '下料',
                    trigger: 'change'
                }
                ]
            },
            searchForm: {
                shape: '',
                processingMethod: '',
            }
        }
    }
}

let Ctor = Vue.extend(basePaginationA);
let ss = Ctor.extend(Main);
new ss().$mount('#app');




