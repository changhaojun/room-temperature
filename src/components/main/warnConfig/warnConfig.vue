<template>
    <div id="warn_config">
        <el-dialog
            :visible.sync="changeConfigShow"
            top="20%"
            width="380px">
            <div class="change_header">
                <h3>
                    <span>{{dialogTit}}</span>
                    <i class="el-icon-close" @click="changeConfigShow = false"></i>
                </h3>
            </div>
            <div class="input-list" style="padding:20px;">
                <div class="input-item">
                    <span>高温告警阀值：</span>
                    <el-input prefix-icon="el-icon-arrow-right" size="small" v-model="newConfig.high_warn"></el-input>
                </div>
                <div class="input-item">
                    <span>低温告警阀值：</span>
                    <el-input prefix-icon="el-icon-arrow-left" size="small" v-model="newConfig.low_warn"></el-input>
                </div>
            </div>
            <div class="change_footer">
                <el-button type="warning" round size="small" @click="suerChange">提交</el-button>
                <el-button round size="small" style="margin-left:120px;" @click="changeConfigShow = false">取消</el-button>
            </div>
        </el-dialog>
        <div class="warn_config_main">
            <div class="config_header">
                <h4>配置告警</h4>
                <div>
                    <el-input
                        size="small"
                        @change="getConfigList"
                        @keyup.enter.native="getConfigList"
                        placeholder="搜索"
                        suffix-icon="el-icon-search"
                        v-model="configSearch">
                    </el-input>
                </div>
            </div>
            <div class="config_tabel" ref="config_tabel">
                <el-table
                    border
                    :data="tableData"
                    @row-click="changeConfig"
                    style="width: 98%">
                    <el-table-column
                        prop="community_name"
                        label="小区名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="high_warn"
                        label="高温告警阀值">
                        <template slot-scope="scope">
                            <div :class="scope.row.highclass">{{scope.row.high_warn}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="low_warn"
                        label="低温告警阀值">
                        <template slot-scope="scope">
                            <div :class="scope.row.lowclass">{{scope.row.low_warn}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="config_footer">
                <el-pagination
                    @current-change="getConfigList"
                    :page-size="page.page_size"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            configSearch: '',
            tableData: [],
            page:{
                page_size: 10,
                page_number: 1
            },
            jump_page: 1,
            total:0,
            changeConfigShow: false,
            dialogTit: '',
            newConfig: {
                high_warn: '',
                low_warn: ''
            },
            changeId: 0
        }
    },

    methods: {
        async getConfigList() {
            const {result:{rows,total}} = await this.$http('warn/config', {
                data: Object.assign(this.page, {key: this.configSearch})
            });
            for(const row of rows) {
                const {high_warn, low_warn} = row;
                if(high_warn === null) {
                    row.high_warn = '未配置';
                    row.highclass = 'nohightConfig'
                }
                if(low_warn === null) {
                    row.low_warn = '未配置'
                    row.lowclass = 'nolowConfig'
                }
            }
            this.tableData = rows;
            this.total = total;
        },

        changeConfig(row, column, event) {
            this.changeConfigShow = true;
            const {community_name,id} = row;
            this.dialogTit = community_name;
            this.changeId = id;
        },
        async suerChange() {
            const res = await this.$http.put('warn/config', {
                id: this.changeId,
                high_warn: '>' + this.newConfig.high_warn,
                low_warn: '<' + this.newConfig.low_warn
            })
            this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
            })
            this.changeConfigShow = false;
            this.getConfigList()
        }
    },
    mounted() {
        this.getConfigList();
    }
}
</script>

<style lang="scss">

    @import './warnConfig.scss'
</style>
