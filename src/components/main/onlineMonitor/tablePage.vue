<template>
    <div>
        <el-table :data="initData.datas" border style="width: 100%; margin-bottom: 24px;">
            <el-table-column :prop='item.prop' :label='item.label' v-for="item in columns" :key="item.index"></el-table-column>
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
    </div>
</template>

<script>
export default {
    props: ['initData', 'columns', 'manager', 'pageNumber'],
    data() {
        return {
            page_number: 1
        }
    },
    methods: {
        pageChange(current) {
            this.$emit('page-change', {data: current});
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
    .el-table .el-table_1_column_1>.cell {
        text-align: left;
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
    .el-table tbody tr {
        cursor: pointer;
    }
    .el-pagination__editor {
        padding: 0 6px;
    }
    .el-pagination {
        height: 50px;
    }
</style>
