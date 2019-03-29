<template>
    <div>
        <el-table :data="initData.datas" border style="width: 100%; margin-bottom: 24px;"  @row-click="selectColumn">
            <el-table-column v-if='type === 1' :prop='item.prop' :label='item.label' v-for="item in columns" :key="item.index">
                <template slot-scope="scope" >
                    <div v-if="item.prop === 'data_value'" :class="scope.row.data_alarm === 1 ? 'warnHigh' : scope.row.data_alarm === 2 ? 'warnLow' : ''" 
                        style='cursor: pointer;' @click="houseTemp(scope.row.user_house_id)">
                        {{scope.row[item.prop]}}
                    </div>
                    <div v-else>{{scope.row[item.prop]}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if='type === 2' :prop='item.prop' :label='item.label' v-for="item in columns" :key="item.index">
                <template slot-scope="scope">
                    <div :class="scope.row.data_alarm === 1 ? 'warnHigh' : scope.row.data_alarm === 2 ? 'warnLow' : ''">
                        {{scope.row[item.prop]}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="initData.datas.length > 0 && manager"
            layout="prev, pager, next, jumper"
            @current-change='pageChange'
            prev-click='pageChange' 
            next-click='pageChange'
            :current-page.sync="page_number"
            :total="initData.total"
            :page-size="2">
        </el-pagination>

        <!-- 弹窗 -->
        <el-dialog :title="dialogData.title" :visible.sync="dialogData.dialogFormVisible" :width="dialogData.dialogWidth" @close="Cancel">
            <div class="main-dialog">
                <data-dialog :date='date' :conditionsHistory='conditionsHistory'></data-dialog>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import DataDialog from './dataDialog.vue';
import moment from 'moment';
export default {
    props: ['initData', 'columns', 'manager', 'pageNumber', 'type','mapdialog'],  //manager: 是否需要分页(否：pageNumber可不传)，type：每次调用传不同的值以区分表格样式
    components:{DataDialog},
    data() {
        return {
            page_number: 1,

            
            dialogData: {
                title: "",
                dialogFormVisible: false,
                dialogWidth: '80%',
                type: 1
            },

            date: [moment().subtract(3,'days'), moment()],
            conditionsHistory: {
                house_id: null,
                start_time: moment(moment().subtract(3,'days')).format('YYYY-MM-DD'),
                end_time: moment().format('YYYY-MM-DD')
            }
        }
    },
    methods: {
        pageChange(current) {
            this.$emit('page-change', {data: current});
        },
        selectColumn(){
           
        },
        houseTemp(houseId) {
             if(this.mapdialog){
                this.$emit("select",houseId)
            }else{
                 this.dialogData.title = '温度变化历史';
                this.dialogData.type = 1;
                this.showDialog();
                this.conditionsHistory.house_id = houseId;
            }
           
        },
        showDialog() {
            this.dialogData.dialogFormVisible = true;
        },
        Cancel() {
            this.dialogData.dialogFormVisible = false;      
        }
    },
    watch: {
        pageNumber: {
            handler(newVal) {
                this.page_number = newVal;
            },
            deep: true
        }
    },
    created() {
        this.page_number = this.pageNumber;
    }
}
</script>

<style lang="scss">      
    .el-table .cell {
        text-align: center;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
    }
    .el-table th>.cell {
        color: rgba(118,118,118,1);
    }
    .el-table td div {
        color:rgba(70,76,91,1);
    }
    .el-table td, .el-table th {
        height: 60px;
    }
    .el-table th {
        height: 80px;
        padding: 0;
        background: rgba(248,248,249,1);
    }
    .el-pager li {
        font-weight: 400;
        color: rgba(70,76,91,1);
    }
    .el-pager li.active {
        color: #409eff;
    }
    .el-pagination .btn-prev {
        padding: 0;
        margin-right: 6px;
    }
    .el-pagination .btn-next {
        padding: 0; 
        margin-left: 6px;
    }
    .el-pagination__jump {
        float: right;
    }
    .el-pagination {
        padding: 0;
    }
    .el-pagination button, .el-pagination span:not([class*=suffix]) {
        min-width: 0;
    }
    .el-pagination__editor {
        padding: 0 6px;
    }
    .el-pagination {
        height: 50px;
    }
    .el-dialog {
        margin: 0 !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }

    .el-dialog__header {
        padding: 10px 10px 10px 25px;
        border-bottom: 1px solid rgba(233,234,236,1);
        .el-dialog__title {
            font-size:18px;
            font-family:SourceHanSansCN-Bold;
            font-weight:bold;
            color:rgba(70,76,91,1);
        }
        .el-dialog__headerbtn {
            top: 13px;
        }
    }
    .el-dialog__body {
        padding: 20px;
    }
    .main-dialog {
        
        height: 600px; 
        overflow: auto;
        padding-right: 20px;
        &::-webkit-scrollbar{
            width:4px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb{
            background:rgba(238,238,238,1);
        }
    }
    
</style>
